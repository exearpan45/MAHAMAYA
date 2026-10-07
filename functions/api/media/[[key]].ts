import { getSessionUser, isRecord, type RequestContext } from '../../_lib/api';

export const onRequestGet = async ({ request, env, params }: RequestContext): Promise<Response> => {
  const key = params?.key || new URL(request.url).pathname.replace(/^\/api\/media\//, '');
  if (!/^(gallery|deity)\/[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(key)) return new Response('Not found', { status: 404 });
  try {
    let privateImage = false;
    if (key.startsWith('gallery/')) {
      const row = await env.DB.prepare("SELECT payload FROM site_content WHERE collection = 'gallery' AND json_extract(payload, '$.objectKey') = ? LIMIT 1")
        .bind(key).first<{ payload: string }>();
      if (!row) return new Response('Not found', { status: 404 });
      const photo: unknown = JSON.parse(row.payload);
      if (!isRecord(photo)) return new Response('Not found', { status: 404 });
      const user = await getSessionUser(request, env);
      const isManager = !!user && ['SUPER_ADMIN', 'ADMIN'].includes(user.role);
      if (!isManager) return new Response('Not found', { status: 404 });
      privateImage = false;
    }
    const object = await env.GALLERY_BUCKET.get(key);
    if (!object) return new Response('Not found', { status: 404 });
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
        'Cache-Control': privateImage ? 'private, no-store' : object.httpMetadata?.cacheControl || 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
        'Cross-Origin-Resource-Policy': 'same-origin',
        ...(object.httpEtag ? { ETag: object.httpEtag } : {}),
      },
    });
  } catch {
    return new Response('Storage unavailable', { status: 503 });
  }
};
