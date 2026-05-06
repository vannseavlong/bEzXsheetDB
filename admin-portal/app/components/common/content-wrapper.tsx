import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function ContentWrapper({ children, className }: Props) {
  return (
    <div className={clsx('h-[calc(100vh-88px)] overflow-y-auto bg-muted', className)}>
      {children}
    </div>
  );
}
