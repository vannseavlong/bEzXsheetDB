import type { LatLng } from './types';

export const parseCoordinates = (latitude?: string, longitude?: string): LatLng | null => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
};

export const formatAddressFromGeocode = (result: google.maps.GeocoderResult) => {
  const addressComponents = result.address_components;

  let streetNumber = '';
  let street = '';
  let district = '';
  let city = '';
  let country = '';

  addressComponents.forEach((component) => {
    if (component.types.includes('street_number')) {
      streetNumber = component.long_name;
    }

    if (component.types.includes('route')) {
      street = component.long_name;
    }

    if (component.types.includes('administrative_area_level_2')) {
      district = component.long_name;
    }

    if (component.types.includes('locality')) {
      city = component.long_name;
    }

    if (component.types.includes('country')) {
      country = component.long_name;
    }
  });

  if (!district && addressComponents.length > 1) {
    district = addressComponents[1].long_name;
  }

  if (!city && addressComponents.length > 2) {
    city = addressComponents[2].long_name;
  }

  if (!country && addressComponents.length > 0) {
    country = addressComponents[addressComponents.length - 1].long_name;
  }

  const formattedAddress = [streetNumber, street, district, city, country]
    .filter(Boolean)
    .join(', ');

  return formattedAddress || result.formatted_address;
};

export const reverseGeocode = (coordinates: LatLng, onSuccess: (address: string) => void): void => {
  const geocoder = new window.google.maps.Geocoder();

  geocoder.geocode({ location: coordinates }, (results, status) => {
    if (status !== 'OK' || !results || !results[0]) {
      return;
    }

    onSuccess(formatAddressFromGeocode(results[0]));
  });
};

export const createUserLocationMarkerIcon = (heading = 0): google.maps.Icon => ({
  url: `data:image/svg+xml;utf8,<svg width='105' height='105' viewBox='0 0 105 105' xmlns='http://www.w3.org/2000/svg'><g transform='rotate(${heading},52.5,52.5)'><polygon points='52.5,25 62.5,40 42.5,40' fill='%23007aff'/></g><circle cx='52.5' cy='52.5' r='40' fill='%23007aff' fill-opacity='0.15'/><circle cx='52.5' cy='52.5' r='16' fill='white'/><circle cx='52.5' cy='52.5' r='12' fill='%23007aff'/></svg>`,
  scaledSize: new window.google.maps.Size(52, 52),
  anchor: new window.google.maps.Point(26, 26)
});
