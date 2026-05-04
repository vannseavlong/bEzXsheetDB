import clsx from 'clsx';

type Props = {
  label: string;
  value: number | string;
  formatCurrency?: (amount: number) => string;
  vatRate?: number;
  currency?: string;
  labelClassName?: string;
  valueClassName?: string;
};

export default function PaymentLabel({
  label,
  value,
  formatCurrency,
  vatRate,
  currency,
  labelClassName,
  valueClassName
}: Props) {
  const defaultFormatCurrency = (amount: number) => {
    const curr = currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr
    }).format(amount);
  };

  const displayValue =
    typeof value === 'number' && (formatCurrency || defaultFormatCurrency)
      ? (formatCurrency || defaultFormatCurrency)(value)
      : value;

  return (
    <div className="flex justify-between items-center">
      <span className={clsx('text-gray-700', labelClassName)}>
        {label}
        {vatRate !== undefined ? ` (${vatRate}%):` : ''}
      </span>
      <span className={clsx('font-medium', valueClassName)}>{displayValue}</span>
    </div>
  );
}
