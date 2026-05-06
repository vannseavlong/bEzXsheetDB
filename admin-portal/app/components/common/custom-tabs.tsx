import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type TabItem = { label: string; value: string };
type Props = {
  defaultValue?: string;
  tabs: TabItem[];
  children: (tab: TabItem, index: number) => React.ReactNode;
  className?: string;
  onChange?: (value: string) => void;
};

export default function CustomTabs({
  defaultValue = 'all',
  tabs,
  children,
  className,
  onChange
}: Props) {
  return (
    <Tabs
      onValueChange={onChange}
      defaultValue={defaultValue}
      className="relative flex flex-1 overflow-auto"
    >
      <TabsList
        className={cn(
          'ml-4 flex h-auto justify-start gap-4 rounded-none bg-transparent p-0',
          className
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'relative px-0 py-3 font-normal text-muted-foreground transition-colors',
              'data-[state=active]:bg-transparent',
              'data-[state=active]:after:bg-primary data-[state=active]:after:h-0.5 data-[state=active]:after:w-full',
              'data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0',
              'data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=active]:font-bold'
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className={cn('flex flex-1 overflow-auto min-h-0 relative p-4')}>
        {tabs.map((tab, index) => (
          <TabsContent key={tab.value} value={tab.value}>
            {children(tab, index)}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
