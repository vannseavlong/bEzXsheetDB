import type { Row } from '@tanstack/react-table';
import MultipleSelectSearch from './multiple-select-search';
import useCategoryNamesQuery from '@/hooks/query/use-category-name-query';
import { useEffect, useState } from 'react';
import { useUpdateCleanerExpertisesMutation } from '@/hooks/mutations/use-update-cleaner-expertises-mutation';

export default function CleanerExpertise({ row }: { row: Row<CleanerAttributes> }) {
  const { data, isPending } = useCategoryNamesQuery(undefined, undefined, 'all');
  const { mutate } = useUpdateCleanerExpertisesMutation(row.original.id);
  const [expertises, setExpertises] = useState<string[]>(row.original.expertiseIds || []);

  useEffect(() => {
    setExpertises(row.original.expertiseIds || []);
  }, [row.original.expertiseIds]); // ✅ sync when data changes

  return (
    <div className="w-[400px]">
      <MultipleSelectSearch
        isLoading={isPending}
        className="border-0 shadow-none"
        placeholder="Select Expertises"
        onValueChange={(vals) => {
          setExpertises(vals);
          mutate(vals);
        }}
        data={data || []}
        value={expertises}
        labelKey="nameEn"
        valueKey="id"
      />
    </div>
  );
}
