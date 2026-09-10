import { describe, expect, it, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createTestAdmin } from '../helpers/factories.js';

const destroyFn = vi.fn().mockResolvedValue({ result: 'ok' });

// The create/update/delete product flow below goes through the real service + real
// (in-memory) database — only the actual network call to Cloudinary is mocked out, so this
// verifies our own diffing/cleanup logic in product.service.ts without touching the network.
vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload_stream: vi.fn(),
      destroy: (...args: unknown[]) => destroyFn(...args),
    },
  },
}));

const app = createApp();

async function loginAndGetToken(email: string): Promise<string> {
  const { email: adminEmail, password } = await createTestAdmin({ email, password: 'CorrectHorse1!' });
  const res = await request(app).post('/api/admin/auth/login').send({ email: adminEmail, password });
  return res.body.data.accessToken as string;
}

describe('product image cleanup on update/delete', () => {
  beforeEach(() => {
    destroyFn.mockClear();
  });

  it('deletes only the Cloudinary image(s) that were removed from the product on update', async () => {
    const token = await loginAndGetToken('cleanup-admin-1@test.com');

    const createRes = await request(app)
      .post('/api/admin/shop/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Cat Food',
        images: ['https://res.cloudinary.com/test-cloud/a.jpg', 'https://res.cloudinary.com/test-cloud/b.jpg'],
        imagePublicIds: ['products/a', 'products/b'],
        hasVariants: false,
        priceRegular: 100,
        priceDiscounted: 90,
        stock: 5,
      });
    expect(createRes.status).toBe(201);
    const productId = createRes.body.data._id;

    const updateRes = await request(app)
      .patch(`/api/admin/shop/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ images: ['https://res.cloudinary.com/test-cloud/a.jpg'], imagePublicIds: ['products/a'] });

    expect(updateRes.status).toBe(200);
    expect(destroyFn).toHaveBeenCalledTimes(1);
    expect(destroyFn).toHaveBeenCalledWith('products/b');
  });

  it('does not delete anything when the image set is left unchanged', async () => {
    const token = await loginAndGetToken('cleanup-admin-2@test.com');

    const createRes = await request(app)
      .post('/api/admin/shop/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Bird Cage',
        images: ['https://res.cloudinary.com/test-cloud/d.jpg'],
        imagePublicIds: ['products/d'],
        hasVariants: false,
        priceRegular: 200,
        priceDiscounted: 180,
        stock: 2,
      });
    const productId = createRes.body.data._id;

    const updateRes = await request(app)
      .patch(`/api/admin/shop/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isEnabled: false });

    expect(updateRes.status).toBe(200);
    expect(destroyFn).not.toHaveBeenCalled();
  });

  it('deletes all Cloudinary images when the product itself is deleted', async () => {
    const token = await loginAndGetToken('cleanup-admin-3@test.com');

    const createRes = await request(app)
      .post('/api/admin/shop/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dog Leash',
        images: ['https://res.cloudinary.com/test-cloud/c.jpg'],
        imagePublicIds: ['products/c'],
        hasVariants: false,
        priceRegular: 50,
        priceDiscounted: 45,
        stock: 3,
      });
    const productId = createRes.body.data._id;

    const deleteRes = await request(app)
      .delete(`/api/admin/shop/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);
    expect(destroyFn).toHaveBeenCalledWith('products/c');
  });
});
