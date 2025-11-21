import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: string | Date, pattern = 'dd/MM/yyyy') => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, pattern, { locale: ptBR });
};

export const formatRelativeTime = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: ptBR });
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
