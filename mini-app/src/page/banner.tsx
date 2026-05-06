import useBannerDetailQuery from '@/hooks/use-banner-detail-query';
import { useParams } from 'react-router';
import useNavigationTitle from '@/hooks/use-navigation-title';
import { useTranslation } from 'node_modules/react-i18next';

export default function Banner() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data } = useBannerDetailQuery(id);

  // Set navigation bar title
  useNavigationTitle(t('banner.banner'));

  if (!data) return null;

  const cleanHtml = data.contentEn?.replace(/\\"/g, '"').replace(/\\n/g, '').replace(/\\/g, '');

  return (
    <div className="p-4">
      <div className="mb-4">
        <img
          src={data.imgUrlEn}
          alt={data.name}
          className="w-full aspect-[16/9] object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />

        <div className="mt-4" dangerouslySetInnerHTML={{ __html: cleanHtml || '' }} />
      </div>
    </div>
  );
}
