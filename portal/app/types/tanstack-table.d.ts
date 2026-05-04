import '@tanstack/react-table'; // This line is crucial for module augmentation

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    // Add all your custom meta properties here
    className?: string;
    width?: number;
    isSticky?: boolean;
    stickyLeft?: number;
    stickyRight?: number;
  }
}
