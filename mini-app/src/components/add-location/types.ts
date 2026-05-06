import type { AddressAttributes } from '@/types/api';

export type LatLng = {
  lat: number;
  lng: number;
};

export type UserLocation = LatLng & {
  heading?: number;
};

export type AddLocationRouteState = {
  editMode?: boolean;
  addressData?: AddressAttributes;
};
