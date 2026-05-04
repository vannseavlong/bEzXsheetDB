import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import IconAssets from '@/asset/icons/icon-assets';
import AppDataContent from '@/components/common/dashboard/app-data-content';
import moment from 'moment';
import DateRangePickerV2 from '@/components/common/date-range-picker-v2';
import { ACTIONS, MODULES } from '@/lib/permission';
import { usePermission } from '@/hooks/use-permission';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdsDataContent from '@/components/common/dashboard/ads-data-content';
import { Button } from '@/components/ui/button';
import IconAssets from '@/asset/icons/icon-assets';
import { useExportExcelMutation } from '@/hooks/mutations/use-export-excel-mutation';

export default function Dashboard() {
  const { hasPermission } = usePermission();
  // if (import.meta.env.VITE_ENV === 'dev')
  //   return (
  //     <div className="flex flex-1 h-full items-center justify-center">
  //       <span className="text-muted-foreground">ONLY PRODUCTION HAVE DATA</span>
  //     </div>
  //   );
  if (!hasPermission(MODULES.DASHBOARD, ACTIONS.VIEW)) {
    return (
      <div className="flex flex-1 h-full items-center justify-center">
        <span className="text-muted-foreground">No Permission to View</span>
      </div>
    );
  }
  return <DashboardContent />;
}

function DashboardContent() {
  const { mutate: exportMutate, isPending } = useExportExcelMutation();
  const [tab, setTab] = useState<'app-data' | 'ads-data'>('app-data');
  const initialDateRange = {
    // from: moment('2025-10-10').toDate(),
    // to: moment('2025-10-10').toDate()
    from: moment().startOf('month').toDate(),
    to: moment().toDate()
  };

  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>(initialDateRange);
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    exportMutate({
      startDate: dateRange.from?.toString() || '',
      endDate: dateRange.to?.toString() || '',
      type: 'dashboard'
    });
  };

  console.log({ tab });

  return (
    <div className="p-5 pt-0 flex gap-0 flex-col">
      <Tabs onValueChange={(value) => setTab(value as 'app-data' | 'ads-data')} value={tab}>
        <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between py-2 bg-white dashboard-header">
          <TabsList>
            <TabsTrigger value="app-data" className="text-sm px-4">
              App Data
            </TabsTrigger>
            <TabsTrigger value="ads-data" className="text-sm px-4">
              Ads Data
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-4 pb-6 dashboard-controls">
            <DateRangePickerV2
              initialDateRange={initialDateRange}
              dateRange={dateRange}
              setDateRange={setDateRange}
              isCalendarOpen={isOpen}
              setIsCalendarOpen={setIsOpen}
            />
            <Button isLoading={isPending} size="sm" onClick={handleExport}>
              Export
              <IconAssets.Export />
            </Button>
          </div>
        </div>
        <TabsContent value="app-data">
          <AppDataContent dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="ads-data">
          <AdsDataContent dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
