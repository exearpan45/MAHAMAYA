const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

const SESSION_COOKIE = 'mahamaya_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const GITHUB_API = 'https://api.github.com';

type Env = {
  GITHUB_TOKEN?: string;
    ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN';
  createdAt: string;
};

const response = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...jsonHeaders, ...extraHeaders },
  });

const base64UrlEncode = (bytes: Uint8Array) => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/g, '');
};

const base64UrlDecode = (value: string) => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const utf8Bytes = (value: string) => new TextEncoder().encode(value);

const sign = async (value: string, secret: string) => {
  const key = await crypto.subtle.importKey(
    'raw',
    utf8Bytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return base64UrlEncode(new Uint8Array(await crypto.subtle.sign('HMAC', key, utf8Bytes(value))));
};

const safeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let i = 0; i < left.length; i += 1) result |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return result === 0;
};

const makeSession = async (email: string, secret: string) => {
  const payload = base64UrlEncode(utf8Bytes(JSON.stringify({
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  })));
  return payload + '.' + await sign(payload, secret);
};

const getSessionEmail = async (request: Request, secret: string) => {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(SESSION_COOKIE + '='));
  if (!match) return null;

  const token = decodeURIComponent(match.slice(SESSION_COOKIE.length + 1));
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  if (!safeEqual(await sign(payload, secret), signature)) return null;

  try {
    const data = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    if (!data?.email || Number(data.exp) < Math.floor(Date.now() / 1000)) return null;
    return String(data.email);
  } catch {
    return null;
  }
};

const adminUser = (env: Env): AdminUser => ({
  id: 'mahamaya-admin',
  name: 'MAHAMAYA Committee Admin',
  email: env.ADMIN_EMAIL || '',
  role: 'SUPER_ADMIN',
  createdAt: '2026-10-08T00:00:00.000Z',
});

const githubRequest = async (env: Env, path: string, init: RequestInit = {}) => {
  if (!env.GITHUB_TOKEN) {
    throw new Error('GitHub publishing is not configured yet. Add the required Cloudflare secrets.');
  }

  const headers = new Headers(init.headers);
  headers.set('authorization', 'Bearer ' + env.GITHUB_TOKEN);
  headers.set('accept', 'application/vnd.github+json');
  headers.set('x-github-api-version', '2022-11-28');
  headers.set('user-agent', 'Pinrra-Durga-Mandir-Admin');
  if (init.body) headers.set('content-type', 'application/json');

  const result = await fetch(GITHUB_API + path, { ...init, headers });
  const text = await result.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!result.ok) {
    throw new Error(data?.message || 'GitHub publishing request failed.');
  }
  return data;
};

const toBase64 = (value: string) => {
  const bytes = utf8Bytes(value);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

const cleanAssetPath = (value: string) => {
  const path = String(value || '').replace(/^\/+/, '');
  if (!path.startsWith('public/') || path.includes('..') || path.includes('\\')) return null;
  return path;
};

const publish = async (request: Request, env: Env) => {
  const email = await getSessionEmail(request, env.SESSION_SECRET || '');
  if (!email || !env.ADMIN_EMAIL || email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) {
    return response({ error: 'Administrator session required.' }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return response({ error: 'Invalid JSON payload.' }, 400);
  }

  const content = body?.content;
  const assets = Array.isArray(body?.assets) ? body.assets : [];
  if (!content || typeof content !== 'object') {
    return response({ error: 'No website content was supplied.' }, 400);
  }

  const contentJson = JSON.stringify(content, null, 2) + '\n';
  if (contentJson.length > 2_000_000) {
    return response({ error: 'Website content is too large to publish.' }, 413);
  }

  const assetEntries: Array<{ path: string; base64: string }> = [];
  for (const asset of assets) {
    const path = cleanAssetPath(asset?.path);
    const base64 = String(asset?.base64 || '');
    if (!path || !base64 || base64.length > 8_500_000) {
      return response({ error: 'One of the uploaded files is invalid or too large.' }, 400);
    }
    assetEntries.push({ path, base64 });
  }

  const owner = 'exearpan45';
  const repo = 'MAHAMAYA';
  const branch = 'main';

  let stage = 'starting';
  try {
    stage = 'checking GitHub repository access';
    await githubRequest(env, '/repos/' + owner + '/' + repo);
    stage = 'reading main branch';
    const ref = await githubRequest(env, '/repos/' + owner + '/' + repo + '/git/ref/heads/' + encodeURIComponent(branch));
    const baseCommitSha = ref.object.sha;
    stage = 'reading current commit';
    const baseCommit = await githubRequest(env, '/repos/' + owner + '/' + repo + '/git/commits/' + baseCommitSha);
    const baseTreeSha = baseCommit.tree.sha;

    const blobs: Array<{ path: string; sha: string }> = [];

    stage = 'uploading site content';
    const contentBlob = await githubRequest(env, '/repos/' + owner + '/' + repo + '/git/blobs', {
      method: 'POST',
      body: JSON.stringify({ content: toBase64(contentJson), encoding: 'base64' }),
    });
    blobs.push({ path: 'public/site-content.json', sha: contentBlob.sha });

    for (const asset of assetEntries) {
      stage = 'uploading website assets';
      const blob = await githubRequest(env, '/repos/' + owner + '/' + repo + '/git/blobs', {
        method: 'POST',
        body: JSON.stringify({ content: asset.base64, encoding: 'base64' }),
      });
      blobs.push({ path: asset.path, sha: blob.sha });
    }

    stage = 'creating Git tree';
    const tree = await githubRequest(env, '/repos/' + owner + '/' + repo + '/git/trees', {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: blobs.map((item) => ({ path: item.path, mode: '100644', type: 'blob', sha: item.sha })),
      }),
    });

    stage = 'creating Git commit';
    const commit = await githubRequest(env, '/repos/' + owner + '/' + repo + '/git/commits', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Update Mahamaya website content from Admin Panel',
        tree: tree.sha,
        parents: [baseCommitSha],
      }),
    });

    stage = 'updating main branch';
    await githubRequest(env, '/repos/' + owner + '/' + repo + '/git/refs/heads/' + encodeURIComponent(branch), {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });

    return response({
      ok: true,
      commit: commit.sha,
      message: 'Published successfully. Cloudflare Pages will rebuild automatically.',
    });
  } catch (error) {
    return response({
      error: (error instanceof Error ? error.message : 'Publishing failed.') + ' (Stage: ' + stage + ')',
    }, 500);
  }
};

export const onRequest = async (context: any) => {
  const request = context.request as Request;
  const env = context.env as Env;
  const method = request.method.toUpperCase();
  const path = new URL(request.url).pathname.replace(/^\/api\/admin\/?/, '').replace(/\/$/, '');

  if (path === 'login' && method === 'GET') {
    const email = await getSessionEmail(request, env.SESSION_SECRET || '');
    if (!email || !env.ADMIN_EMAIL || email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) {
      return response({ user: null }, 401);
    }
    return response({ user: adminUser(env) });
  }

  if (path === 'login' && method === 'POST') {
    if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
      return response({ error: 'Admin authentication is not configured in Cloudflare yet.' }, 503);
    }

    let body: any;
    try { body = await request.json(); } catch { return response({ error: 'Invalid login request.' }, 400); }

    const email = String(body?.email || '').trim();
    const password = String(body?.password || '');
    if (!safeEqual(email.toLowerCase(), env.ADMIN_EMAIL.toLowerCase()) || !safeEqual(password, env.ADMIN_PASSWORD)) {
      return response({ error: 'Invalid administrator credentials.' }, 401);
    }

    const token = await makeSession(env.ADMIN_EMAIL, env.SESSION_SECRET);
    return response(
      { user: adminUser(env) },
      200,
      { 'set-cookie': SESSION_COOKIE + '=' + encodeURIComponent(token) + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + SESSION_TTL_SECONDS },
    );
  }

  if (path === 'login' && method === 'DELETE') {
    return response(
      { ok: true },
      200,
      { 'set-cookie': SESSION_COOKIE + '=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0' },
    );
  }

  if (path === 'publish' && method === 'POST') {
    return publish(request, env);
  }

  return response({ error: 'Not found.' }, 404);
};
