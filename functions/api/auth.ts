import {
  authenticate,
  clearSessionCookie,
  createSession,
  errorResponse,
  getSessionUser,
  json,
  passwordDigest,
  rateLimit,
  readJson,
  revokeSession,
  sameOrigin,
  type RequestContext,
} from '../_lib/api';

function secureCompare(left: string, right: string): boolean {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);

  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    difference |= (a[index] || 0) ^ (b[index] || 0);
  }

  return difference === 0;
}

function validName(value: unknown): value is string {
  return typeof value === 'string'
    && value.trim().length >= 2
    && value.trim().length <= 100;
}

function validEmail(value: unknown): value is string {
  return typeof value === 'string'
    && value.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPassword(value: unknown): value is string {
  return typeof value === 'string'
    && value.length >= 12
    && value.length <= 128;
}

export const onRequestGet = async ({ request, env }: RequestContext): Promise<Response> => {
  try {
    return json({ user: await getSessionUser(request, env) });
  } catch {
    return errorResponse('Authentication service is temporarily unavailable.', 503);
  }
};

export const onRequestPost = async ({ request, env }: RequestContext): Promise<Response> => {
  if (!sameOrigin(request, env)) {
    return errorResponse('Invalid request origin.', 403);
  }

  const body = await readJson(request, 12_000);

  if (!body || typeof body.action !== 'string') {
    return errorResponse('Invalid request body.', 400);
  }

  try {
    if (body.action !== 'logout' && !(await rateLimit(request, env))) {
      return errorResponse('Too many authentication attempts. Try again later.', 429);
    }

    if (body.action === 'login') {
      if (!validEmail(body.email) || !validPassword(body.password)) {
        return errorResponse('Invalid email or password.', 401);
      }

      const user = await authenticate(env, body.email, body.password);

      if (!user) {
        return errorResponse('Invalid email or password.', 401);
      }

      const cookie = await createSession(request, env, user.id);

      return Response.json(
        { user },
        {
          headers: {
            'Cache-Control': 'no-store',
            'Set-Cookie': cookie,
          },
        },
      );
    }

    if (body.action === 'bootstrap-admin') {
      const configuredSecret = env.BOOTSTRAP_SECRET;

      if (!configuredSecret || configuredSecret.length < 32) {
        return errorResponse('Admin bootstrap is not configured.', 503);
      }

      if (
        typeof body.secret !== 'string'
        || !secureCompare(body.secret, configuredSecret)
      ) {
        return errorResponse('Invalid bootstrap credentials.', 403);
      }

      if (
        !validName(body.name)
        || !validEmail(body.email)
        || !validPassword(body.password)
      ) {
        return errorResponse(
          'Name, email, and password do not meet the required format.',
          400,
        );
      }

      const existingAdmin = await env.DB
        .prepare(
          "SELECT id FROM users WHERE role IN ('ADMIN', 'SUPER_ADMIN') LIMIT 1",
        )
        .first<{ id: string }>();

      if (existingAdmin) {
        return errorResponse('Admin bootstrap is already completed.', 409);
      }

      const userId = crypto.randomUUID();
      const passwordSalt = crypto.randomUUID() + crypto.randomUUID();
      const passwordHash = await passwordDigest(body.password, passwordSalt);

      await env.DB
        .prepare(
          `INSERT INTO users
            (id, name, email, password_hash, password_salt, role, created_at)
           VALUES (?, ?, ?, ?, ?, 'SUPER_ADMIN', ?)`,
        )
        .bind(
          userId,
          body.name.trim(),
          body.email.trim().toLowerCase(),
          passwordHash,
          passwordSalt,
          new Date().toISOString(),
        )
        .run();

      const user = await authenticate(env, body.email, body.password);

      if (!user) {
        return errorResponse('Admin account creation failed.', 500);
      }

      const cookie = await createSession(request, env, user.id);

      return Response.json(
        { user },
        {
          status: 201,
          headers: {
            'Cache-Control': 'no-store',
            'Set-Cookie': cookie,
          },
        },
      );
    }

    if (body.action === 'logout') {
      await revokeSession(request, env);

      return Response.json(
        { ok: true },
        {
          headers: {
            'Cache-Control': 'no-store',
            'Set-Cookie': clearSessionCookie(request),
          },
        },
      );
    }

    return errorResponse('Unknown authentication action.', 400);
  } catch {
    return errorResponse(
      'Authentication service is temporarily unavailable.',
      503,
    );
  }
};
