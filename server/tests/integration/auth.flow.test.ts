import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createTestAdmin } from '../helpers/factories.js';

const app = createApp();

function extractCookie(res: request.Response): string {
  const raw = res.headers['set-cookie'];
  const cookies = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
  if (!refreshCookie) throw new Error('No refreshToken cookie in response');
  return refreshCookie.split(';')[0];
}

describe('admin auth flow', () => {
  it('rejects invalid credentials', async () => {
    await createTestAdmin({ email: 'a@test.com', password: 'CorrectHorse1!' });
    const res = await request(app).post('/api/admin/auth/login').send({ email: 'a@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('logs in, refreshes, and logs out successfully', async () => {
    const { email, password } = await createTestAdmin({ email: 'b@test.com', password: 'CorrectHorse1!' });

    const loginRes = await request(app).post('/api/admin/auth/login').send({ email, password });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.accessToken).toBeTruthy();
    const cookie = extractCookie(loginRes);

    const meRes = await request(app)
      .get('/api/admin/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.admin.email).toBe(email);

    const refreshRes = await request(app).post('/api/admin/auth/refresh').set('Cookie', cookie);
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.data.accessToken).toBeTruthy();
    const rotatedCookie = extractCookie(refreshRes);
    expect(rotatedCookie).not.toBe(cookie);

    const logoutRes = await request(app).post('/api/admin/auth/logout').set('Cookie', rotatedCookie);
    expect(logoutRes.status).toBe(200);

    const refreshAfterLogout = await request(app).post('/api/admin/auth/refresh').set('Cookie', rotatedCookie);
    expect(refreshAfterLogout.status).toBe(401);
  });

  it('detects refresh token reuse and revokes the whole session family', async () => {
    const { email, password } = await createTestAdmin({ email: 'c@test.com', password: 'CorrectHorse1!' });

    const loginRes = await request(app).post('/api/admin/auth/login').send({ email, password });
    const firstCookie = extractCookie(loginRes);

    const refreshRes = await request(app).post('/api/admin/auth/refresh').set('Cookie', firstCookie);
    expect(refreshRes.status).toBe(200);
    const secondCookie = extractCookie(refreshRes);

    // Reusing the already-rotated-away first token is a theft signal.
    const reuseRes = await request(app).post('/api/admin/auth/refresh').set('Cookie', firstCookie);
    expect(reuseRes.status).toBe(401);

    // The whole family (including the otherwise-still-valid second token) should now be dead.
    const afterReuse = await request(app).post('/api/admin/auth/refresh').set('Cookie', secondCookie);
    expect(afterReuse.status).toBe(401);
  });

  it('rejects protected routes without a token', async () => {
    const res = await request(app).get('/api/admin/auth/me');
    expect(res.status).toBe(401);
  });
});
