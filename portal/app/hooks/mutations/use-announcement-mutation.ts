import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type {
  CustomDataSchemaProps,
  NotificationCouponSchemaProps
} from '@/lib/schema/push-notification-schema';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

function buildFormData(formData: FormData, data: unknown, parentKey?: string) {
  if (data && typeof data === 'object' && !(data instanceof File)) {
    // 1. Handle Objects and Arrays (but ignore File/Blob objects)
    Object.keys(data).forEach((key) => {
      const propName = parentKey ? `${parentKey}[${key}]` : key;
      // Recursive call for nested structure
      buildFormData(formData, (data as Record<string, unknown>)[key], propName);
    });
  } else if (data !== undefined && data !== null) {
    // 2. Handle Primitive values (String, Number, Boolean, File)
    // Convert to String as FormData only accepts strings or Blobs/Files
    formData.append(parentKey!, String(data));
  }
}

export interface payload {
  type: string;
  name: string;
  bannerCn?: File;
  bannerEn?: File;
  bannerKm?: File;
  bannerTw?: File;
  bannerVi?: File;
  titleEn: string;
  titleKm: string;
  titleVi: string;
  titleTw: string;
  titleCn: string;
  contentEn: string;
  contentKm: string;
  contentVi: string;
  contentTw: string;
  contentCn: string;
  detailEn: string;
  detailKm: string;
  detailVi: string;
  detailTw: string;
  detailCn: string;
  topics: string[];
  dateRange?: { from?: Date; to?: Date };
  categoryIds: string[];
  productIds: string[];
  optionIds: string[];
  customData: CustomDataSchemaProps;
  scheduleType: string;
  triggerBase?: string;
  timeOffset?: string;
  sentAt?: Date;
  coupons?: NotificationCouponSchemaProps[];
}

export function useAnnouncementMutation() {
  const navigate = useNavigate();

  const apiFn = (payload: payload): Promise<Blob> => {
    const formData = new FormData();

    // Append normal fields
    formData.append('name', payload.name);

    formData.append('titleEn', payload.titleEn);
    formData.append('titleKm', payload.titleKm);
    formData.append('titleVi', payload.titleVi);
    formData.append('titleTw', payload.titleTw);
    formData.append('titleCn', payload.titleCn);

    formData.append('contentEn', payload.contentEn);
    formData.append('contentKm', payload.contentKm);
    formData.append('contentVi', payload.contentVi);
    formData.append('contentTw', payload.contentTw);
    formData.append('contentCn', payload.contentCn);

    formData.append('detailEn', payload.detailEn);
    formData.append('detailKm', payload.detailKm);
    formData.append('detailVi', payload.detailVi);
    formData.append('detailTw', payload.detailTw);
    formData.append('detailCn', payload.detailCn);

    formData.append('type', payload.type);
    formData.append('startDate', payload.dateRange?.from?.toISOString() || '');
    formData.append('endDate', payload.dateRange?.to?.toISOString() || '');

    payload.categoryIds.forEach((c) => {
      formData.append('categoryIds[]', c);
    });
    payload.productIds.forEach((p) => {
      formData.append('productIds[]', p);
    });
    payload.optionIds.forEach((o) => {
      formData.append('optionIds[]', o);
    });

    // Append banners only if provided
    if (payload.bannerCn) formData.append('bannerCn', payload.bannerCn);
    if (payload.bannerEn) formData.append('bannerEn', payload.bannerEn);
    if (payload.bannerKm) formData.append('bannerKm', payload.bannerKm);
    if (payload.bannerTw) formData.append('bannerTw', payload.bannerTw);
    if (payload.bannerVi) formData.append('bannerVi', payload.bannerVi);

    formData.append('scheduleType', payload.scheduleType);
    formData.append('sentAt', payload.sentAt?.toISOString() || '');

    if (payload.triggerBase) formData.append('triggerBase', payload.triggerBase);
    if (payload.timeOffset) formData.append('timeOffset', payload.timeOffset);

    if (payload.coupons && payload.coupons.length > 0) {
      payload.coupons.forEach((coupon, i) => {
        formData.append(`coupons[${i}][id]`, coupon.id);
        formData.append(`coupons[${i}][qty]`, `${coupon.qty}`);
        formData.append(`coupons[${i}][price]`, `${coupon.price}`);
      });
    }

    // Append array items
    payload.topics.forEach((topic, i) => {
      formData.append(`topics[${i}]`, topic);
    });

    buildFormData(formData, payload.customData, 'customData');

    return api.post(API_ENDPOINT.CREATE_ANNOUNCEMENT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ANNOUNCEMENT],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Notification has been sent');
      navigate(-1);
    }
  });
}
