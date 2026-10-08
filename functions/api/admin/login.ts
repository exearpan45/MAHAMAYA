const json = (body: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });

const base64Url = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const textBase64Url = (value: string) =>
  btoa(unescape(encodeURIComponent(value)))
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

export const onRequestPost = async ({ request, env }: any) => {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
      return json({ error: 'Admin system is not configured on Cloudflare yet.' }, 503);
    }

    if (email !== String(env.ADMIN_EMAIL).trim().toLowerCase() || password !== String(env.ADMIN_PASSWORD)) {
      return json({ error: 'Invalid admin email or password.' }, 401);
    }

    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const payload = `${email}.${expiresAt}`;
    const signature = await hmac(payload, String(env.SESSION_SECRET));
    const token = `${textBase64Url(payload)}.${signature}`;

    const user = {
      id: 'committee-admin',
      name: env.ADMIN_NAME || 'Mahamaya Committee Admin',
      email,
      role: 'SUPER_ADMIN',
      createdAt: '2026-10-07T00:00:00.000Z',
    };

    return json(
      { user },
      200,
      {
        'set-cookie': `mahamaya_admin_session=${token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax`,
      },
    );
  } catch {
    return json({ error: 'Invalid login request.' }, 400);
  }
};

export const onRequestGet = async ({ request, env }: any) => {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )mahamaya_admin_session=([^;]+)/);
  if (!match || !env.SESSION_SECRET) return json({ authenticated: false }, 401);

  try {
    const token = decodeURIComponent(match[1]);
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return json({ authenticated: false }, 401);

    const payload = decodeURIComponent(
      escape(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/') + '==')),
    );
    const [email, expiresAtText] = payload.split('.');
    if (!email || Number(expiresAtText) < Date.now()) return json({ authenticated: false }, 401);

    const expected = await hmac(payload, String(env.SESSION_SECRET));
    if (expected !== signature) return json({ authenticated: false }, 401);

    return json({
      authenticated: true,
      user: {
        id: 'committee-admin',
        name: env.ADMIN_NAME || 'Mahamaya Committee Admin',
        email,
        role: 'SUPER_ADMIN',
        createdAt: '2026-10-07T00:00:00.000Z',
      },
    });
  } catch {
    return json({ authenticated: false }, 401);
  }
};

export const onRequestDelete = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'set-cookie': 'mahamaya_admin_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
    },
  });
