import useBannerDetailQuery from '@/hooks/use-banner-detail-query';
import { useParams } from 'react-router';
import useNavigationTitle from '@/hooks/use-navigation-title';
import { useTranslation } from 'react-i18next';
import AppBar from '@/components/common/app-bar';

export default function Banner() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data } = useBannerDetailQuery(id);

  // Set navigation bar title
  useNavigationTitle(t('banner.banner'));

  if (!data) return <AppBar title={t('banner.banner')} />;

  return (
    <div>
      <AppBar title={t('banner.banner')} />
      <div className="p-4">
        <div className="mb-4">
          <img
            src={data.imgUrlEn ?? undefined}
            alt={data.name}
            className="w-full aspect-[16/9] object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />

          <div className="mt-4">
            <p className="font-semibold">{data.titleEn}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
