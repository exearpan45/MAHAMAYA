import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CULTURAL_PROGRAMS,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
  INITIAL_HISTORY_MILESTONES,
  INITIAL_PUJA_YEARS,
  INITIAL_SETTINGS,
} from '../../src/data/initialData';
import type { Announcement, CulturalProgramItem, EventItem, GalleryPhoto, HistoryMilestone, PujaYear, SiteSettings, User, UserRole } from '../../src/types';

export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results?: T[] }>;
  run(): Promise<unknown>;
}

export interface D1Database {
  prepare(query: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown>;
}

export interface R2Object {
  body: ReadableStream;
  httpMetadata?: { contentType?: string; cacheControl?: string };
  httpEtag?: string;
}

export interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView, options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }): Promise<unknown>;
  delete(key: string): Promise<unknown>;
}

export interface Env {
  DB: D1Database;
  GALLERY_BUCKET: R2Bucket;
  APP_ORIGIN?: string;
  BOOTSTRAP_SECRET?: string;
}

export interface RequestContext {
  request: Request;
  env: Env;
  params?: Record<string, string>;
}

export interface SafeUser extends Omit<User, 'createdAt'> {
  createdAt: string;
}

export interface Snapshot {
  settings: SiteSettings;
  pujaYears: PujaYear[];
  events: EventItem[];
  announcements: Announcement[];
  gallery: GalleryPhoto[];
  historyMilestones: HistoryMilestone[];
  culturalPrograms: CulturalProgramItem[];
  currentUser: SafeUser | null;
}

export const ROLES: UserRole[] = ['ADMIN', 'SUPER_ADMIN'];
const SESSION_COOKIE = '__Host-mahamaya_session';
const LOCAL_SESSION_COOKIE = 'mahamaya_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const AUTH_WINDOW_SECONDS = 15 * 60;
const MAX_AUTH_ATTEMPTS = 10;
const PBKDF2_ITERATIONS = 210_000;

export function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    },
  });
}

export function errorResponse(message: string, status: number): Response {
  return json({ error: message }, status);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function readJson(request: Request, maxBytes = 1_000_000): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > maxBytes) return null;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) return null;
    const parsed: unknown = JSON.parse(text);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function validEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validRole(value: unknown): value is UserRole {
  return typeof value === 'string' && ROLES.includes(value as UserRole);
}

export function safeUser(row: Record<string, unknown>): SafeUser {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    role: validRole(row.role) ? row.role : 'ADMIN',
    createdAt: String(row.created_at ?? row.createdAt ?? ''),
  };
}

export async function hash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(digest));
}

function constantTimeEqual(left: string, right: string): boolean {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) difference |= (a[index] || 0) ^ (b[index] || 0);
  return difference === 0;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function randomToken(byteLength = 32): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(byteLength)));
}

export async function passwordDigest(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: PBKDF2_ITERATIONS },
    key,
    256,
  );
  return toBase64Url(new Uint8Array(bits));
}

function cookieName(request: Request): string {
  return new URL(request.url).protocol === 'https:' ? SESSION_COOKIE : LOCAL_SESSION_COOKIE;
}

function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  for (const value of cookieHeader.split(';')) {
    const [key, ...parts] = value.trim().split('=');
    if (key === name) return parts.join('=') || null;
  }
  return null;
}

function sessionCookie(request: Request, token: string, maxAge: number): string {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${cookieName(request)}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export function clearSessionCookie(request: Request): string {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${cookieName(request)}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function sameOrigin(request: Request, env: Env): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const expected = env.APP_ORIGIN ? new URL(env.APP_ORIGIN).origin : new URL(request.url).origin;
    return new URL(origin).origin === expected && new URL(request.url).origin === expected;
  } catch {
    return false;
  }
}

export async function rateLimit(request: Request, env: Env): Promise<boolean> {
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const key = await hash(`auth:${ip}`);
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - AUTH_WINDOW_SECONDS;
  await env.DB.prepare(`INSERT INTO auth_rate_limits (key_hash, attempts, window_started_at)
    VALUES (?, 1, ?)
    ON CONFLICT(key_hash) DO UPDATE SET
      attempts = CASE WHEN auth_rate_limits.window_started_at <= ? THEN 1 ELSE auth_rate_limits.attempts + 1 END,
      window_started_at = CASE WHEN auth_rate_limits.window_started_at <= ? THEN excluded.window_started_at ELSE auth_rate_limits.window_started_at END`)
    .bind(key, now, windowStart, windowStart).run();
  const row = await env.DB.prepare('SELECT attempts FROM auth_rate_limits WHERE key_hash = ?').bind(key).first<{ attempts: number }>();
  return (row?.attempts ?? MAX_AUTH_ATTEMPTS + 1) <= MAX_AUTH_ATTEMPTS;
}

export async function createSession(request: Request, env: Env, userId: string): Promise<string> {
  const token = randomToken();
  const tokenHash = await hash(token);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .bind(tokenHash, userId, now + SESSION_MAX_AGE, new Date().toISOString()).run();
  return sessionCookie(request, token, SESSION_MAX_AGE);
}

export async function getSessionUser(request: Request, env: Env): Promise<SafeUser | null> {
  const token = getCookie(request, cookieName(request));
  if (!token) return null;
  const tokenHash = await hash(token);
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare(`SELECT u.id, u.name, u.email, u.role, u.created_at
      FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > ?`)
    .bind(tokenHash, now).first<Record<string, unknown>>();
  return row ? safeUser(row) : null;
}

export async function revokeSession(request: Request, env: Env): Promise<void> {
  const token = getCookie(request, cookieName(request));
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await hash(token)).run();
}

export async function requireUser(request: Request, env: Env): Promise<SafeUser | null> {
  return getSessionUser(request, env);
}

export async function requireRoles(request: Request, env: Env, roles: UserRole[]): Promise<SafeUser | Response> {
  const user = await getSessionUser(request, env);
  if (!user) return errorResponse('Authentication required.', 401);
  if (!roles.includes(user.role)) return errorResponse('You are not allowed to perform this action.', 403);
  return user;
}

export async function authenticate(env: Env, email: string, password: string): Promise<SafeUser | null> {
  const row = await env.DB.prepare('SELECT id, name, email, role, created_at, password_hash, password_salt FROM users WHERE email = ? COLLATE NOCASE')
    .bind(email.trim().toLowerCase()).first<Record<string, unknown>>();
  // Hash even when the account is absent to reduce obvious account enumeration timing differences.
  const salt = typeof row?.password_salt === 'string' ? row.password_salt : 'mahamaya-unknown-account-salt';
  const calculated = await passwordDigest(password, salt);
  if (!row || typeof row.password_hash !== 'string' || !constantTimeEqual(calculated, row.password_hash)) return null;
  return safeUser(row);
}

const INITIAL_COLLECTIONS: Record<string, Array<{ id: string; [key: string]: unknown }>> = {
  settings: [{ id: 'site', ...INITIAL_SETTINGS }],
  pujaYears: INITIAL_PUJA_YEARS as unknown as Array<{ id: string; [key: string]: unknown }>,
  events: INITIAL_EVENTS as unknown as Array<{ id: string; [key: string]: unknown }>,
  announcements: INITIAL_ANNOUNCEMENTS as unknown as Array<{ id: string; [key: string]: unknown }>,
  gallery: INITIAL_GALLERY as unknown as Array<{ id: string; [key: string]: unknown }>,
  historyMilestones: INITIAL_HISTORY_MILESTONES as unknown as Array<{ id: string; [key: string]: unknown }>,
  culturalPrograms: INITIAL_CULTURAL_PROGRAMS as unknown as Array<{ id: string; [key: string]: unknown }>,
};

export async function ensureSeeded(env: Env): Promise<void> {
  const marker = await env.DB.prepare("SELECT id FROM site_content WHERE collection = '_meta' AND id = 'initial-seed-v1'").first();
  if (marker) return;
  const statements: D1Statement[] = [];
  const now = new Date().toISOString();
  for (const [collection, items] of Object.entries(INITIAL_COLLECTIONS)) {
    for (const item of items) {
      const key = typeof item.id === 'string' ? item.id : typeof item.year === 'number' ? String(item.year) : collection;
      statements.push(env.DB.prepare('INSERT OR IGNORE INTO site_content (collection, id, payload, updated_at) VALUES (?, ?, ?, ?)')
        .bind(collection, key, JSON.stringify(item), now));
    }
  }
  statements.push(env.DB.prepare('INSERT OR IGNORE INTO site_content (collection, id, payload, updated_at) VALUES (?, ?, ?, ?)')
    .bind('_meta', 'initial-seed-v1', 'true', now));
  await env.DB.batch(statements);
}

async function collection<T>(env: Env, name: string): Promise<T[]> {
  const rows = await env.DB.prepare('SELECT payload FROM site_content WHERE collection = ? ORDER BY id').bind(name).all<{ payload: string }>();
  return (rows.results || []).map((row) => JSON.parse(row.payload) as T);
}

export async function snapshot(request: Request, env: Env): Promise<Snapshot> {
  await ensureSeeded(env);
  const user = await getSessionUser(request, env);
  const visibleGallery = await collection<GalleryPhoto>(env, 'gallery');
  const result: Snapshot = {
    settings: (await collection<SiteSettings & { id?: string }>(env, 'settings'))[0] || INITIAL_SETTINGS,
    pujaYears: await collection<PujaYear>(env, 'pujaYears'),
    events: await collection<EventItem>(env, 'events'),
    announcements: await collection<Announcement>(env, 'announcements'),
    gallery: visibleGallery,
    historyMilestones: await collection<HistoryMilestone>(env, 'historyMilestones'),
    culturalPrograms: await collection<CulturalProgramItem>(env, 'culturalPrograms'),
    currentUser: user,
  };
  return result;
}

export async function writeItem(env: Env, collectionName: string, id: string, payload: Record<string, unknown>): Promise<void> {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw new Error('Invalid content ID.');
  const serialized = JSON.stringify(payload);
  if (new TextEncoder().encode(serialized).byteLength > 1_900_000) throw new Error('Content is too large.');
  await env.DB.prepare(`INSERT INTO site_content (collection, id, payload, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(collection, id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`)
    .bind(collectionName, id, serialized, new Date().toISOString()).run();
}

export async function readItem(env: Env, collectionName: string, id: string): Promise<Record<string, unknown> | null> {
  const row = await env.DB.prepare('SELECT payload FROM site_content WHERE collection = ? AND id = ?').bind(collectionName, id).first<{ payload: string }>();
  return row ? JSON.parse(row.payload) as Record<string, unknown> : null;
}

export async function deleteItem(env: Env, collectionName: string, id: string): Promise<void> {
  await env.DB.prepare('DELETE FROM site_content WHERE collection = ? AND id = ?').bind(collectionName, id).run();
}

export async function resetContent(env: Env): Promise<void> {
  await env.DB.prepare("DELETE FROM site_content WHERE collection != '_meta'").run();
  await env.DB.prepare("DELETE FROM site_content WHERE collection = '_meta'").run();
  await ensureSeeded(env);
}

export function hasResponse(value: SafeUser | Response): value is Response {
  return value instanceof Response;
}

export function validImage(bytes: Uint8Array, contentType: string): boolean {
  if (contentType === 'image/jpeg') return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === 'image/png') return bytes.length > 8 && bytes.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10';
  if (contentType === 'image/webp') return bytes.length > 12 && new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP';
  return false;
}

export function adminError(error: unknown): Response {
  const message = error instanceof Error ? error.message : 'The request could not be completed.';
  return errorResponse(message, 400);
}

export async function applyContentImport(env: Env, data: Record<string, unknown>): Promise<void> {
  const allowed = ['settings', 'pujaYears', 'events', 'announcements', 'gallery', 'historyMilestones', 'culturalPrograms'];
  for (const name of allowed) {
    if (!(name in data)) continue;
    const value = data[name];
    if (name === 'settings') {
      if (!isRecord(value)) throw new Error('Invalid settings in backup.');
      const keys = Object.keys(INITIAL_SETTINGS) as Array<keyof SiteSettings>;
      const safeSettings: Partial<SiteSettings> = {};
      for (const key of keys) if (key in value) (safeSettings as Record<string, unknown>)[key] = value[key];
      if (typeof safeSettings.mapsUrl === 'string' && !/^https:\/\//i.test(safeSettings.mapsUrl)) throw new Error('Map links must use HTTPS.');
      if (typeof safeSettings.heroDeityImage === 'string' && (!safeSettings.heroDeityImage.startsWith('/') || safeSettings.heroDeityImage.startsWith('//') || safeSettings.heroDeityImage.startsWith('/data:'))) {
        throw new Error('Backups cannot set external or embedded deity images.');
      }
      await writeItem(env, name, 'site', { ...INITIAL_SETTINGS, ...safeSettings, id: 'site' });
      continue;
    }
    if (!Array.isArray(value) || value.length > 5000 || value.some((entry) => !isRecord(entry) || typeof entry.id !== 'string')) {
      throw new Error(`Invalid ${name} list in backup.`);
    }
    if (name === 'gallery' && value.some((entry) => typeof entry.imageUrl === 'string' && entry.imageUrl.startsWith('data:'))) {
      throw new Error('Backups with locally embedded images must be migrated through the gallery upload workflow.');
    }
    await env.DB.prepare('DELETE FROM site_content WHERE collection = ?').bind(name).run();
    for (const entry of value as Array<Record<string, unknown>>) {
      const { id, ...rest } = entry;
      if (typeof id !== 'string') continue;
      await writeItem(env, name, id, { ...rest, id });
    }
  }
}
