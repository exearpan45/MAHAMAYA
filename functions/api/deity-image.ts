import { errorResponse, getSessionUser, json, sameOrigin, snapshot, writeItem, validImage, type RequestContext } from '../_lib/api';

export const onRequestPost = async ({ request, env }: RequestContext): Promise<Response> => {
  if (!sameOrigin(request, env)) return errorResponse('Invalid request origin.', 403);
  const user = await getSessionUser(request, env);
  if (!user) return errorResponse('Authentication required.', 401);
  if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return errorResponse('You are not allowed to change the temple photograph.', 403);
  try {
    const form = await request.formData();
    const file = form.get('image');
    if (!(file instanceof File) || file.size < 1 || file.size > 5 * 1024 * 1024) return errorResponse('Select an image smaller than 5 MB.', 400);
    const type = file.type.toLowerCase();
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!validImage(bytes, type)) return errorResponse('Only valid JPEG, PNG, or WebP images are accepted.', 415);
    const ext = type === 'image/jpeg' ? 'jpg' : type === 'image/png' ? 'png' : 'webp';
    const key = `deity/${crypto.randomUUID()}.${ext}`;
    await env.GALLERY_BUCKET.put(key, bytes, { httpMetadata: { contentType: type, cacheControl: 'public, max-age=3600' } });
    const row = await env.DB.prepare("SELECT payload FROM site_content WHERE collection = 'settings' AND id = 'site'").first<{ payload: string }>();
    const settings = row ? JSON.parse(row.payload) : {};
    await writeItem(env, 'settings', 'site', { ...settings, heroDeityImage: `/api/media/${key}`, id: 'site' });
    return json({ data: await snapshot(request, env) });
  } catch {
    return errorResponse('The temple photograph could not be saved.', 503);
  }
};
