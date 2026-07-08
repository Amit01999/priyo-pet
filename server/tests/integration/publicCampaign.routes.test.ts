import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { createTestCampaign } from '../helpers/factories.js';

const app = createApp();

describe('public campaign routes', () => {
  it('returns the public campaign view via HTTP (regression: dayStatus must serialize from a lean() Map)', async () => {
    const campaign = await createTestCampaign();

    const res = await request(app).get(`/api/public/campaigns/${campaign.slug}`);

    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe(campaign.slug);
    expect(res.body.data.dayStatus).toEqual({});
  });

  it('reflects a closed day in the public view', async () => {
    const campaign = await createTestCampaign();
    const { setDayStatus } = await import('../../src/services/slotAdmin.service.js');
    await setDayStatus(campaign, campaign.dates[0], 'closed');

    const res = await request(app).get(`/api/public/campaigns/${campaign.slug}`);

    expect(res.status).toBe(200);
    expect(res.body.data.dayStatus[campaign.dates[0]]).toBe('closed');
  });

  it('returns slots for a valid date over HTTP', async () => {
    const campaign = await createTestCampaign();

    const res = await request(app)
      .get(`/api/public/campaigns/${campaign.slug}/slots`)
      .query({ date: campaign.dates[0] });

    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(campaign.maxSlotsPerDay);
    expect(res.body.data.slots).toHaveLength(campaign.maxSlotsPerDay);
  });

  it('404s for an unknown campaign slug', async () => {
    const res = await request(app).get('/api/public/campaigns/does-not-exist');
    expect(res.status).toBe(404);
  });
});
