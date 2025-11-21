import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { purchaseFormSchema } from '../../validations/purchase';
import type { PurchaseFormData } from '../../types/forms';
import type { Purchase } from '../../types/purchase';
import { format } from 'date-fns';

interface UsePurchaseFormOptions {
  defaultValues?: Purchase;
  onSubmit: (data: PurchaseFormData) => Promise<void>;
}

export const usePurchaseForm = ({ defaultValues, onSubmit }: UsePurchaseFormOptions) => {
  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema),
    mode: 'onBlur',
    defaultValues: defaultValues
      ? {
          productName: defaultValues.productName,
          quantity: defaultValues.quantity,
          measurementUnit: defaultValues.measurementUnit,
          unitPrice: defaultValues.unitPrice,
          purchaseDate: defaultValues.purchaseDate,
          category: defaultValues.category,
          purchaseLocation: defaultValues.purchaseLocation,
          notes: defaultValues.notes,
        }
      : {
          productName: '',
          quantity: 0,
          measurementUnit: 'unidade',
          unitPrice: 0,
          purchaseDate: format(new Date(), 'dd/MM/yyyy'),
          category: 'Outros',
          purchaseLocation: null,
          notes: null,
        },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const sanitizedData: PurchaseFormData = {
      ...data,
      productName: DOMPurify.sanitize(data.productName),
      purchaseLocation: data.purchaseLocation ? DOMPurify.sanitize(data.purchaseLocation) : null,
      notes: data.notes ? DOMPurify.sanitize(data.notes) : null,
    };

    await onSubmit(sanitizedData);
  });

  const totalValue = form.watch('quantity') * form.watch('unitPrice');

  return {
    form,
    handleSubmit,
    totalValue,
  };
};
