const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const base64UrlDecode = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  return decodeURIComponent(escape(atob(normalized)));
};

const base64Url = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const hmac = async (value: string, secret: string) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return base64Url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
};

const verifySession = async (request: Request, env: any) => {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )mahamaya_admin_session=([^;]+)/);
  if (!match || !env.SESSION_SECRET) return false;

  try {
    const token = decodeURIComponent(match[1]);
    const [encodedPayload, signature] = token.split('.');
    const payload = base64UrlDecode(encodedPayload);
    const [email, expiresAtText] = payload.split('.');
    if (!email || Number(expiresAtText) < Date.now()) return false;
    const expected = await hmac(payload, String(env.SESSION_SECRET));
    return expected === signature && email === String(env.ADMIN_EMAIL).trim().toLowerCase();
  } catch {
    return false;
  }
};

const github = async (env: any, path: string, init: RequestInit = {}) => {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'x-github-api-version': '2022-11-28',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!response.ok) throw new Error(data?.message || `GitHub API error ${response.status}`);
  return data;
};

const utf8Base64 = (value: string) => btoa(unescape(encodeURIComponent(value)));

export const onRequestPost = async ({ request, env }: any) => {
  if (!(await verifySession(request, env))) return json({ error: 'Admin session expired. Please sign in again.' }, 401);

  if (!env.GITHUB_TOKEN) return json({ error: 'GitHub publishing is not configured on Cloudflare yet.' }, 503);

  try {
    const body = await request.json();
    const content = body?.content;
    const assets = Array.isArray(body?.assets) ? body.assets : [];

    if (!content || typeof content !== 'object') return json({ error: 'No site content was supplied.' }, 400);

    const owner = String(env.GITHUB_OWNER || 'exearpan45');
    const repo = String(env.GITHUB_REPO || 'MAHAMAYA');
    const branch = String(env.GITHUB_BRANCH || 'main');
    const apiBase = `/repos/${owner}/${repo}`;

    const ref = await github(env, `${apiBase}/git/ref/heads/${branch}`);
    const parentSha = ref.object.sha;
    const parentCommit = await github(env, `${apiBase}/git/commits/${parentSha}`);
    const baseTree = parentCommit.tree.sha;

    const contentText = JSON.stringify(content, null, 2) + '\n';
    const entries: any[] = [
      {
        path: 'public/site-content.json',
        mode: '100644',
        type: 'blob',
        content: contentText,
      },
    ];

    for (const asset of assets) {
      const path = String(asset?.path || '');
      const base64 = String(asset?.base64 || '');
      if (!/^public\/uploads\/[a-zA-Z0-9._-]+$/.test(path)) {
        return json({ error: `Invalid asset path: ${path}` }, 400);
      }
      if (!base64 || base64.length > 20_000_000) {
        return json({ error: 'One of the uploaded images is too large.' }, 413);
      }

      const blob = await github(env, `${apiBase}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({ encoding: 'base64', content: base64 }),
      });

      entries.push({
        path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      });
    }

    const tree = await github(env, `${apiBase}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({ base_tree: baseTree, tree: entries }),
    });

    const commit = await github(env, `${apiBase}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message: `Update Mahamaya website content ${new Date().toISOString().slice(0, 10)}`,
        tree: tree.sha,
        parents: [parentSha],
      }),
    });

    await github(env, `${apiBase}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });

    return json({
      ok: true,
      commit: commit.sha,
      message: 'Content published successfully. Cloudflare Pages will rebuild automatically.',
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Publishing failed.' }, 500);
  }
};
