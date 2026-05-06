import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { BannerSchemaProps } from '@/lib/schema/banner-schema';

export function useUpdateBannerMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const apiFn = (payload: BannerSchemaProps & { id: number }) => {
    const formData = new FormData();

    formData.append('id', payload.id.toString());
    formData.append('name', payload.name);
    formData.append('type', payload.bannerType);

    formData.append('titleEn', payload.title.en);
    formData.append('titleKm', payload.title.km);
    formData.append('titleVi', payload.title.vi);
    formData.append('titleTw', payload.title.tw);
    formData.append('titleCn', payload.title.cn);

    formData.append('status', payload.status === 'true' ? 'true' : 'false');
    formData.append('hasDetail', String(payload.hasDetail));
    formData.append('hasTopup', String(payload.hasTopup));

    if (payload.hasDetail && payload.content) {
      formData.append('contentEn', payload.content.en || '');
      formData.append('contentKm', payload.content.km || '');
      formData.append('contentVi', payload.content.vi || '');
      formData.append('contentTw', payload.content.tw || '');
      formData.append('contentCn', payload.content.cn || '');
    }

    if (payload.hasTopup) {
      formData.append('credit', payload.credit || '');
      formData.append('amount', payload.amount || '');
    }

    if (payload.startDate) {
      formData.append('startDate', payload.startDate.toISOString());
    }

    if (payload.expiredDate) {
      formData.append('expiredDate', payload.expiredDate.toISOString());
    }

    if (payload.imgUrlEn instanceof File) formData.append('imgUrlEn', payload.imgUrlEn);
    if (payload.imgUrlKm instanceof File) formData.append('imgUrlKm', payload.imgUrlKm);
    if (payload.imgUrlVi instanceof File) formData.append('imgUrlVi', payload.imgUrlVi);
    if (payload.imgUrlCn instanceof File) formData.append('imgUrlCn', payload.imgUrlCn);
    if (payload.imgUrlTw instanceof File) formData.append('imgUrlTw', payload.imgUrlTw);

    const imgDetailEn = payload.imgDetailUrlEn ?? '';
    const imgDetailKm = payload.imgDetailUrlKm ?? '';
    const imgDetailVi = payload.imgDetailUrlVi ?? '';
    const imgDetailCn = payload.imgDetailUrlCn ?? '';
    const imgDetailTw = payload.imgDetailUrlTw ?? '';

    if (imgDetailEn instanceof File) formData.append('imgDetailUrlEn', imgDetailEn);
    else if (typeof imgDetailEn === 'string' && imgDetailEn)
      formData.append('imgDetailUrlEn', imgDetailEn);

    if (imgDetailKm instanceof File) formData.append('imgDetailUrlKm', imgDetailKm);
    else if (typeof imgDetailKm === 'string' && imgDetailKm)
      formData.append('imgDetailUrlKm', imgDetailKm);

    if (imgDetailVi instanceof File) formData.append('imgDetailUrlVi', imgDetailVi);
    else if (typeof imgDetailVi === 'string' && imgDetailVi)
      formData.append('imgDetailUrlVi', imgDetailVi);

    if (imgDetailCn instanceof File) formData.append('imgDetailUrlCn', imgDetailCn);
    else if (typeof imgDetailCn === 'string' && imgDetailCn)
      formData.append('imgDetailUrlCn', imgDetailCn);

    if (imgDetailTw instanceof File) formData.append('imgDetailUrlTw', imgDetailTw);
    else if (typeof imgDetailTw === 'string' && imgDetailTw)
      formData.append('imgDetailUrlTw', imgDetailTw);

    return api.post(API_ENDPOINT.UPDATE_BANNER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.UPDATE_BANNER],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Banner updated successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.BANNERS] });
      navigate(-1);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message ?? 'Failed to update banner';
      toast.error(message);
    }
  });
}
