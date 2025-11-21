import { z } from 'zod';
import { purchaseFormSchema } from '../validations/purchase';

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
