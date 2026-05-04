import clsx from 'clsx';

export default function TableCellDiv({
  children,
  className,
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div className={clsx('min-w-[130px] truncate', className)} onClick={onClick}>
      {children}
    </div>
  );
}
