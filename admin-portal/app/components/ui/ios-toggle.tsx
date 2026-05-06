import * as React from 'react';
import { cn } from '@/lib/utils';

interface IOSToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function IOSToggle({
  checked = false,
  onCheckedChange,
  disabled = false,
  className
}: IOSToggleProps) {
  const [isChecked, setIsChecked] = React.useState(checked);

  React.useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onCheckedChange?.(newValue);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        'relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        isChecked ? 'bg-[#34C759]' : 'bg-[#E5E5EA]',
        'dark:bg-opacity-100',
        !isChecked && 'dark:bg-[#39393D]',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-7 w-7 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out',
          isChecked ? 'translate-x-[26px]' : 'translate-x-[2px]'
        )}
      />
    </button>
  );
}
