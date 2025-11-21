import { z } from 'zod';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const purchaseFormSchema = z.object({
  productName: z
    .string('O nome do produto é obrigatório')
    .min(3, 'O nome do produto deve ter pelo menos 3 caracteres')
    .max(100, 'O nome do produto deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s'-]+$/, 'O nome do produto contém caracteres inválidos'),
  quantity: z
    .number('A quantidade é obrigatória')
    .positive('A quantidade deve ser maior que zero')
    .max(999.99, 'A quantidade máxima permitida é 999.99'),
  measurementUnit: z.enum(
    ['kg', 'g', 'l', 'ml', 'unidade', 'pacote', 'caixa', 'duzia'],
    'Selecione uma unidade de medida'
  ),
  unitPrice: z
    .number('O preço unitário é obrigatório')
    .min(0, 'O preço unitário não pode ser negativo')
    .max(99999.99, 'O preço unitário máximo permitido é 99999.99'),
  purchaseDate: z.string('A data da compra é obrigatória').refine((date) => {
    const [day, month, year] = date.split('/').map(Number);
    const purchaseDate = new Date(year, month - 1, day);
    return purchaseDate <= today;
  }, 'A data da compra não pode ser futura'),
  category: z.enum(
    [
      'Frutas',
      'Verduras',
      'Carnes',
      'Laticínios',
      'Grãos',
      'Bebidas',
      'Congelados',
      'Padaria',
      'Outros',
    ],
    'Selecione uma categoria'
  ),
  purchaseLocation: z
    .string()
    .max(100, 'O local da compra deve ter no máximo 100 caracteres')
    .nullable()
    .optional(),
  notes: z
    .string()
    .max(500, 'As observações devem ter no máximo 500 caracteres')
    .nullable()
    .optional(),
});
