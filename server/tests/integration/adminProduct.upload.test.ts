import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createTestAdmin } from '../helpers/factories.js';
import { MAX_IMAGE_SIZE_BYTES } from '../../src/middlewares/upload.js';

const app = createApp();

async function loginAndGetToken(email: string): Promise<string> {
  const { email: adminEmail, password } = await createTestAdmin({ email, password: 'CorrectHorse1!' });
  const res = await request(app).post('/api/admin/auth/login').send({ email: adminEmail, password });
  return res.body.data.accessToken as string;
}

// These only exercise the validation paths that reject *before* Cloudinary is ever called
// (auth, fileFilter, size limit, missing file) — no network access or real credentials needed.
describe('admin product image upload validation', () => {
  it('rejects an upload without an access token', async () => {
    const res = await request(app)
      .post('/api/admin/shop/products/upload-image')
      .attach('image', Buffer.from('not-a-real-image'), { filename: 'photo.jpg', contentType: 'image/jpeg' });
    expect(res.status).toBe(401);
  });

  it('rejects an unsupported file type', async () => {
    const token = await loginAndGetToken('upload-admin-1@test.com');
    const res = await request(app)
      .post('/api/admin/shop/products/upload-image')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', Buffer.from('plain text content'), { filename: 'notes.txt', contentType: 'text/plain' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/JPG, PNG, and WebP/i);
  });

  it('rejects a file over the size limit', async () => {
    const token = await loginAndGetToken('upload-admin-2@test.com');
    const oversized = Buffer.alloc(MAX_IMAGE_SIZE_BYTES + 1);
    const res = await request(app)
      .post('/api/admin/shop/products/upload-image')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', oversized, { filename: 'huge.jpg', contentType: 'image/jpeg' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/smaller than/i);
  });

  it('rejects a request with no file attached', async () => {
    const token = await loginAndGetToken('upload-admin-3@test.com');
    const res = await request(app)
      .post('/api/admin/shop/products/upload-image')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('rejects deleting an image without an access token', async () => {
    const res = await request(app).delete('/api/admin/shop/products/upload-image').query({ publicId: 'x' });
    expect(res.status).toBe(401);
  });

  it('rejects deleting an image without a publicId', async () => {
    const token = await loginAndGetToken('upload-admin-4@test.com');
    const res = await request(app)
      .delete('/api/admin/shop/products/upload-image')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});
