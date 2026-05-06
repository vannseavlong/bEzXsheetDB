import Icon from '@/assets/icons/icon-asset';
import Qty from './qty';
import { useTranslation } from 'node_modules/react-i18next';
import { getLocalizedName, type MultiLanguageName } from '@/lib/language-helper';

type ServiceCheckoutAddon = MultiLanguageName & {
  id: number;
  amount: number;
  qty: number;
};

type BaseProduct = MultiLanguageName & {
  id: number;
  iconUrl: string;
  amount: number;
  hourCount?: string | null;
  cleanerCount?: string | null;
  floorCount?: string | null;
  bedroomCount?: string | null;
};

type ServiceCheckoutProps = {
  product: BaseProduct;
  quantity?: number;
  addOns?: ServiceCheckoutAddon[];
};

export default function ServiceCheckout({
  product,
  quantity = 1,
  addOns = []
}: ServiceCheckoutProps) {
  const { t, i18n } = useTranslation();
  const hasDisplayValue = (value?: string | null) => {
    if (value == null) return false;
    const normalized = String(value).trim().toLowerCase();
    return normalized !== '' && normalized !== 'null' && normalized !== 'undefined';
  };

  const floorBedroomText = [
    hasDisplayValue(product.floorCount) ? `${t('common.floors')}: ${product.floorCount}` : null,
    hasDisplayValue(product.bedroomCount) ? `${t('common.bedroom')}: ${product.bedroomCount}` : null
  ]
    .filter((text): text is string => Boolean(text))
    .join(' | ');

  if (!product) {
    return <div className="p-4">{t('serviceCheckout.noProductSelected')}</div>;
  }

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <img
            src={product.iconUrl || product.iconUrl}
            alt={getLocalizedName(product, i18n.language)}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <p className="text-md font-semibold">{getLocalizedName(product, i18n.language)}</p>
            <div className="font-semibold text-gray-800">${product.amount.toFixed(2)}</div>
          </div>
          {floorBedroomText && <p className="mb-2">{floorBedroomText}</p>}
          <div className="flex items-center justify-between text-[#3D3D3D]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Icon name="clockIcon" />
                <p className="text-sm text-[#3D3D3D]">
                  {product.hourCount} {t('common.hours')}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="userGroupIcon" />
                <p className="text-sm text-[#3D3D3D]">
                  {product.cleanerCount}{' '}
                  {Number(product.cleanerCount) > 1 ? t('common.cleaners') : t('common.cleaner')}
                </p>
              </div>
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
