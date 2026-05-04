import useOrderState from '@/hooks/store/use-order-state';
import type { ProductOptionDetail } from '@/types/api';

interface SelectedService {
  id: number;
  qty?: number;
  amount?: number;
  productId?: number;
  nameEn?: string;
  hourCount?: string | null;
  cleanerCount?: string | null;
  iconUrl?: string;
  [key: string]: unknown;
}

interface UseCheckoutServicesProps {
  productData: ProductOptionDetail[] | undefined;
  productId: string | undefined;
  serviceId: string | undefined;
  selectedServices: SelectedService[];
}

interface UseCheckoutServicesReturn {
  calculateServiceTotal: () => number;
  formatCurrency: (amount?: number) => string;
}

export function useCheckoutServices({
  productData,
  productId,
  serviceId,
  selectedServices
}: UseCheckoutServicesProps): UseCheckoutServicesReturn {
  const { serviceAddons, productQuantity } = useOrderState();

  const formatCurrency = (amount?: number): string => `$${(amount ?? 0).toFixed(2)}`;

  const calculateServiceTotal = (): number => {
    if (!productData) return 0;

    // Calculate main product amount with quantity
    const productsAmount = productData
      .filter(
        (product) => product.id.toString() === productId || product.id.toString() === serviceId
      )
      .reduce((sum, product) => sum + (product.amount ?? 0) * productQuantity, 0);

    const selectedServicesAmount = selectedServices.reduce(
      (sum, s) => sum + (s.amount ?? 0) * (s.qty ?? 1),
      0
    );

    const serviceAddonsAmount = serviceAddons.reduce((sum, addon) => {
      const matchingService = selectedServices.find((s) => s.id.toString() === addon.id);
      return sum + (matchingService?.amount ?? 0) * addon.qty;
    }, 0);

    return productsAmount + selectedServicesAmount + serviceAddonsAmount;
  };

  return {
    calculateServiceTotal,
    formatCurrency
  };
}
