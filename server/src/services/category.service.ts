import { Category, type CategoryDoc } from '../models/Category.model.js';
import { NotFound } from '../errors/httpErrors.js';
import { slugify } from '../utils/slug.js';

export async function listCategories(activeOnly = true): Promise<CategoryDoc[]> {
  const filter = activeOnly ? { isActive: true } : {};
  return Category.find(filter).sort({ name: 1 }).lean<CategoryDoc[]>();
}

export async function createCategory(input: { name: string; slug?: string; isActive?: boolean }): Promise<CategoryDoc> {
  const slug = (input.slug ? slugify(input.slug) : slugify(input.name));
  const category = await Category.create({ name: input.name, slug, isActive: input.isActive ?? true });
  return category.toObject() as unknown as CategoryDoc;
}

export async function updateCategory(
  id: string,
  updates: { name?: string; slug?: string; isActive?: boolean }
): Promise<CategoryDoc> {
  const patch: Record<string, unknown> = { ...updates };
  if (updates.slug) patch.slug = slugify(updates.slug);
  const category = await Category.findByIdAndUpdate(id, { $set: patch }, { new: true }).lean<CategoryDoc>();
  if (!category) throw NotFound('Category not found');
  return category;
}

export async function deleteCategory(id: string): Promise<void> {
  const result = await Category.findByIdAndDelete(id);
  if (!result) throw NotFound('Category not found');
}
