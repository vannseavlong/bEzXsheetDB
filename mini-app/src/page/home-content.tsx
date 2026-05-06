import { Link } from 'react-router';
import useCategoryQuery from '@/hooks/use-category-query';
import HomeSkeleton from '@/components/common/home-skeleton';
import useLanguage from '@/hooks/use-language';
import { get } from 'lodash-es';
import type { Category } from '@/types/api';

export default function HomeContent() {
  const { data, isLoading } = useCategoryQuery();
  const { apiLang } = useLanguage();

  if (isLoading) return <HomeSkeleton />;

  const categories = data?.categories || [];

  return (
    <div className="bg-muted pb-24">
      {categories.map((category: Category) => (
        <div
          key={category.id}
          className="px-4 bg-white mt-4 [content-visibility:auto] [contain-intrinsic-size:1px_420px]">
          <h2 className="text-[16px] font-bold text-gray-800 p-6">
            {get(category.title, `title${apiLang}`, 'N/A')}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {category.items.map((item, index) => (
              <Link
                key={index}
                to={`/service/${item.categoryId}${item.productId != null ? `?productId=${item.productId}` : ''}`}>
                <div className="px-[26px] text-center justify-start">
                  <img
                    src={item.iconUrl}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-3"
                  />
                </div>
                <div className="px-2 py-1">
                  <p className="text-sm text-center font-medium text-gray-700 pb-[18px]">
                    {get(item.name, `name${apiLang}`, 'N/A')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
