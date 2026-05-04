import SearchBar from '../common/search-bar';

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function ActivityLogHeader({ search, setSearch }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
      <div className="w-full">
        <SearchBar placeholder="Search for Coupon..." value={search} onChange={setSearch} />
      </div>
    </div>
  );
}
