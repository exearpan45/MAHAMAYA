import { deleteItem, errorResponse, isRecord, json, requireRoles, sameOrigin, snapshot, validImage, writeItem, type RequestContext } from '../_lib/api';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const onRequestPost = async ({ request, env }: RequestContext): Promise<Response> => {
  if (!sameOrigin(request, env)) return errorResponse('Invalid request origin.', 403);
  const user = await requireRoles(request, env, ['ADMIN', 'SUPER_ADMIN']);
  if (user instanceof Response) return user;
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_IMAGE_BYTES + 30_000) return errorResponse('Image must be smaller than 5 MB.', 413);
  try {
    const form = await request.formData();
    const file = form.get('image');
    if (!(file instanceof File) || file.size < 1 || file.size > MAX_IMAGE_BYTES) return errorResponse('Select an image smaller than 5 MB.', 400);
    const title = String(form.get('title') || '').trim();
    const description = String(form.get('description') || '').trim();
    const category = String(form.get('category') || 'Community');
    const allowedCategories = ['Maa Durga', 'Temple', 'Durga Puja', 'Bhog', 'Cultural Programs', 'Visarjan', 'Historical Photos', 'Community'];
    if (!title || title.length > 120 || description.length > 1000 || !allowedCategories.includes(category)) return errorResponse('Invalid photo details.', 400);
    const contentType = file.type.toLowerCase();
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!validImage(bytes, contentType)) return errorResponse('Only valid JPEG, PNG, or WebP images are accepted.', 415);
    const extension = contentType === 'image/jpeg' ? 'jpg' : contentType === 'image/png' ? 'png' : 'webp';
    const id = crypto.randomUUID();
    const objectKey = `gallery/${id}.${extension}`;
    await env.GALLERY_BUCKET.put(objectKey, bytes, { httpMetadata: { contentType, cacheControl: 'public, max-age=31536000, immutable' } });
    const photo = {
      id,
      imageUrl: `/api/media/${objectKey}`,
      thumbnailUrl: `/api/media/${objectKey}`,
      objectKey,
      title_en: title,
      title_bn: title,
      description_en: description || 'Community upload',
      description_bn: description || 'ভক্ত কর্তৃক আপলোডকৃত ছবি',
      category,
      pujaYear: Number(form.get('pujaYear')) || 2026,
      uploaderName: user.name,
      uploaderEmail: user.email,
      uploaderId: user.id,
      createdAt: new Date().toISOString(),
      featured: false,
    };
    await writeItem(env, 'gallery', id, photo);
    return json({ data: await snapshot(request, env) }, 201);
  } catch {
    return errorResponse('Photo upload failed. Please try again.', 503);
  }
};

export const onRequestDelete = async ({ request, env }: RequestContext): Promise<Response> => {
  if (!sameOrigin(request, env)) return errorResponse('Invalid request origin.', 403);
  const user = await requireRoles(request, env, ['ADMIN', 'SUPER_ADMIN']);
  if (user instanceof Response) return user;
  const id = new URL(request.url).searchParams.get('id') || '';
  const row = await env.DB.prepare('SELECT payload FROM site_content WHERE collection = ? AND id = ?').bind('gallery', id).first<{ payload: string }>();
  if (!row) return errorResponse('Gallery photo not found.', 404);
  const photo: unknown = JSON.parse(row.payload);
  if (!isRecord(photo)) return errorResponse('Gallery photo not found.', 404);

  if (typeof photo.objectKey === 'string') await env.GALLERY_BUCKET.delete(photo.objectKey);
  await deleteItem(env, 'gallery', id);
  return json({ data: await snapshot(request, env) });
};
