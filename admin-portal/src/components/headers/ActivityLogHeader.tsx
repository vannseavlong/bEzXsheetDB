import { SearchBar } from '@/components/shared/SearchBar'

interface Props {
  search: string
  setSearch: (v: string) => void
}

export function ActivityLogHeader({ search, setSearch }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:justify-between gap-4">
      <SearchBar
        placeholder="Search by user, module or action..."
        value={search}
        onChange={setSearch}
      />
    </div>
  )
}
