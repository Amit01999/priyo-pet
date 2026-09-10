import { describe, expect, it, vi, beforeEach } from 'vitest';
import { uploadImageBuffer, deleteImage } from '../../src/utils/cloudinary.js';

const uploadStreamFn = vi.fn();
const destroyFn = vi.fn();

vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload_stream: (...args: unknown[]) => uploadStreamFn(...args),
      destroy: (...args: unknown[]) => destroyFn(...args),
    },
  },
}));

describe('cloudinary util', () => {
  beforeEach(() => {
    uploadStreamFn.mockReset();
    destroyFn.mockReset();
  });

  it('resolves with the secure url and public id on a successful upload', async () => {
    uploadStreamFn.mockImplementation((_opts, cb) => {
      cb(null, { secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1/abc.jpg', public_id: 'priyopet/products/abc' });
      return { end: vi.fn() };
    });

    const result = await uploadImageBuffer(Buffer.from('fake-image-bytes'));

    expect(result).toEqual({
      url: 'https://res.cloudinary.com/test-cloud/image/upload/v1/abc.jpg',
      publicId: 'priyopet/products/abc',
    });
  });

  it('rejects with a friendly 502 AppError when Cloudinary reports a failure', async () => {
    uploadStreamFn.mockImplementation((_opts, cb) => {
      cb(new Error('network down'), null);
      return { end: vi.fn() };
    });

    await expect(uploadImageBuffer(Buffer.from('fake-image-bytes'))).rejects.toMatchObject({
      statusCode: 502,
    });
  });

  it('deleteImage swallows destroy errors instead of throwing', async () => {
    destroyFn.mockRejectedValue(new Error('not found'));

    await expect(deleteImage('some-public-id')).resolves.toBeUndefined();
    expect(destroyFn).toHaveBeenCalledWith('some-public-id');
  });

  it('deleteImage is a no-op for an empty publicId', async () => {
    await deleteImage('');
    expect(destroyFn).not.toHaveBeenCalled();
  });
});
