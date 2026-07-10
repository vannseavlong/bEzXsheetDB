import { Link } from 'react-router';
import useCategoryQuery from '@/hooks/use-category-query';
import HomeSkeleton from '@/components/common/home-skeleton';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '@/lib/language-helper';

export default function HomeContent() {
  const { data, isLoading } = useCategoryQuery();
  const { i18n } = useTranslation();

  if (isLoading) return <HomeSkeleton />;

  const categories = data ?? [];

  return (
    <div className="bg-muted pb-24">
      <div className="px-4 bg-white mt-4">
        <div className="grid grid-cols-3 gap-4 p-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/service/${category.id}`}>
              <div className="px-[26px] text-center justify-start">
                <img
                  src={category.thumbnailUrl ?? undefined}
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-3"
                />
              </div>
              <div className="px-2 py-1">
                <p className="text-sm text-center font-medium text-gray-700 pb-[18px]">
                  {getLocalizedName(category, i18n.language)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
