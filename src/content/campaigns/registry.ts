import { rabiesVaccination2026Content, type CampaignContent } from './rabies-2026.content';

const registry: Record<string, CampaignContent> = {
  [rabiesVaccination2026Content.slug]: rabiesVaccination2026Content,
};

export function getCampaignContent(slug: string): CampaignContent | undefined {
  return registry[slug];
}
