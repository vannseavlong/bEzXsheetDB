import Qty from './qty';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '@/lib/language-helper';
import { toEmbeddableImageUrl } from '@/lib/drive-image';
import type { BookingLine, OrderPreviewAddOn } from '@/types/api';

type ServiceCheckoutProps = {
  product: BookingLine;
  quantity?: number;
  addOns?: OrderPreviewAddOn[];
};

export default function ServiceCheckout({
  product,
  quantity = 1,
  addOns = []
}: ServiceCheckoutProps) {
  const { t, i18n } = useTranslation();

  if (!product) {
    return <div className="p-4">{t('serviceCheckout.noProductSelected')}</div>;
  }

  const durationHours = product.duration > 0 ? Math.round(product.duration / 60) : null;

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <img
            src={toEmbeddableImageUrl(product.thumbnailUrl) ?? undefined}
            alt={getLocalizedName(product, i18n.language)}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <p className="text-md font-semibold">{getLocalizedName(product, i18n.language)}</p>
            <div className="font-semibold text-gray-800">${product.amount.toFixed(2)}</div>
          </div>
          <div className="flex items-center justify-between text-[#3D3D3D]">
            <div className="flex items-center gap-4">
              {durationHours !== null && (
                <div className="flex items-center gap-1">
                  <p className="text-sm text-[#3D3D3D]">
                    {durationHours} {t('common.hours')}
                  </p>
                </div>
              )}
            </div>
            {quantity > 0 && <Qty quantity={quantity} />}
          </div>

          {addOns.length > 0 && (
            <div className="mt-3 space-y-1 border-t border-gray-100 pt-2">
              <p className="text-sm font-semibold">{t('service.serviceAddon')}</p>
              {addOns.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between text-sm text-[#3D3D3D]">
                  <p className="truncate pr-2">{getLocalizedName(addon, i18n.language)}</p>
                  <p className="font-medium text-gray-700">x{addon.qty}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
