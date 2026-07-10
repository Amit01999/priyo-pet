import type { CampaignDoc } from '../models/Campaign.model.js';
import type { AccessTokenPayload } from '../services/auth.service.js';
import type { CustomerAccessTokenPayload } from '../services/customerAuth.service.js';

declare global {
  namespace Express {
    interface Request {
      campaign?: CampaignDoc;
      admin?: AccessTokenPayload;
      customer?: CustomerAccessTokenPayload;
    }
  }
}

export {};
