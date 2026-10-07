import {
  adminError,
  applyContentImport,
  deleteItem,
  errorResponse,
  hasResponse,
  isRecord,
  json,
  readItem,
  readJson,
  requireRoles,
  resetContent,
  sameOrigin,
  snapshot,
  writeItem,
  type RequestContext,
} from '../_lib/api';
function roleForAction(action: string): Array<'ADMIN' | 'SUPER_ADMIN'> | null {
  if (action.startsWith('gallery-')) return ['ADMIN', 'SUPER_ADMIN'];
  if (action === 'reset-content') return ['SUPER_ADMIN'];
  if (action === 'import-content') return ['ADMIN', 'SUPER_ADMIN'];
  if (['settings-update', 'puja-add', 'puja-update', 'event-add', 'event-update', 'event-delete', 'announcement-add', 'announcement-update', 'announcement-delete', 'history-add', 'history-update', 'history-delete', 'cultural-add', 'cultural-update', 'cultural-delete'].includes(action)) {
    return ['ADMIN', 'SUPER_ADMIN'];
  }
  return null;
}

function entityId(payload: Record<string, unknown>): string {
  return typeof payload.id === 'string' ? payload.id : '';
}

function contentPayload(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) throw new Error('Invalid content payload.');
  return value;
}

export const onRequestPost = async ({ request, env }: RequestContext): Promise<Response> => {
  if (!sameOrigin(request, env)) return errorResponse('Invalid request origin.', 403);
  const body = await readJson(request);
  if (!body || typeof body.action !== 'string') return errorResponse('Invalid request body.', 400);
  const roles = roleForAction(body.action);
  if (!roles) return errorResponse('Unknown admin action.', 400);
  const actor = await requireRoles(request, env, roles);
  if (hasResponse(actor)) return actor;
  try {
    const payload = isRecord(body.payload) ? body.payload : {};
    const action = body.action;
    if (action === 'settings-update') {
      const current = (await readItem(env, 'settings', 'site')) || {};
      const allowed = ['templeName_en', 'templeName_bn', 'committeeName_en', 'committeeName_bn', 'currentYear', 'currentEdition', 'mapsUrl', 'heroKicker_bn', 'heroKicker_en', 'topBannerEnabled', 'topBannerText_bn', 'topBannerText_en'];
      const update: Record<string, unknown> = {};
      for (const key of allowed) if (key in payload) update[key] = payload[key];
      if (typeof update.mapsUrl === 'string' && !/^https:\/\//i.test(update.mapsUrl)) return errorResponse('Map links must use HTTPS.', 400);
      await writeItem(env, 'settings', 'site', { ...current, ...update, id: 'site' });
    } else if (action.startsWith('gallery-')) {
      const id = entityId(payload);
      const photo = await readItem(env, 'gallery', id);
      if (!photo) return errorResponse('Gallery photo not found.', 404);
      if (action === 'gallery-approve') {
        await writeItem(env, 'gallery', id, photo);
      } else if (action === 'gallery-feature') {
        photo.featured = payload.featured === true;
        await writeItem(env, 'gallery', id, photo);
      } else if (action === 'gallery-delete') {
        if (typeof photo.objectKey === 'string') await env.GALLERY_BUCKET.delete(photo.objectKey);
        await deleteItem(env, 'gallery', id);
      }
    } else if (action === 'reset-content') {
      await resetContent(env);
    } else if (action === 'import-content') {
      await applyContentImport(env, contentPayload(payload.data));
    } else {
      const map: Record<string, { collection: string; operation: 'add' | 'update' | 'delete' }> = {
        'puja-add': { collection: 'pujaYears', operation: 'add' }, 'puja-update': { collection: 'pujaYears', operation: 'update' },
        'event-add': { collection: 'events', operation: 'add' }, 'event-update': { collection: 'events', operation: 'update' }, 'event-delete': { collection: 'events', operation: 'delete' },
        'announcement-add': { collection: 'announcements', operation: 'add' }, 'announcement-update': { collection: 'announcements', operation: 'update' }, 'announcement-delete': { collection: 'announcements', operation: 'delete' },
        'history-add': { collection: 'historyMilestones', operation: 'add' }, 'history-update': { collection: 'historyMilestones', operation: 'update' }, 'history-delete': { collection: 'historyMilestones', operation: 'delete' },
        'cultural-add': { collection: 'culturalPrograms', operation: 'add' }, 'cultural-update': { collection: 'culturalPrograms', operation: 'update' }, 'cultural-delete': { collection: 'culturalPrograms', operation: 'delete' },
      };
      const config = map[action];
      if (!config) return errorResponse('Unknown admin action.', 400);
      if (config.operation === 'delete') {
        const id = typeof payload.id === 'string' ? payload.id : '';
        if (!id) return errorResponse('Content ID is required.', 400);
        await deleteItem(env, config.collection, id);
      } else {
        const item = contentPayload(payload.item);
        const id = config.collection === 'pujaYears' ? String(item.year ?? '') : entityId(item);
        if (!id) return errorResponse('Content ID is required.', 400);
        const current = config.operation === 'update' ? await readItem(env, config.collection, id) : null;
        if (config.operation === 'update' && !current) return errorResponse('Content not found.', 404);
        const stored: Record<string, unknown> = { ...(current || {}), ...item };
        if (config.collection !== 'pujaYears') stored.id = id;
        await writeItem(env, config.collection, id, stored);
      }
    }
    return json({ data: await snapshot(request, env) });
  } catch (error) {
    return adminError(error);
  }
};
