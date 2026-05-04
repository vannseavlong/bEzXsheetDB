import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Command, CommandInput, CommandItem, CommandList } from '../ui/command';
import { FormField, FormItem, FormLabel } from '../ui/form';
import CustomSelect from './custom-select';
import {
  useAddDirectSaleUsersAddressMutation,
  useDirectSaleUsersAddressQuery,
  useExpendMapShortLinkMutation
} from '@/hooks/query/use-direct-sale-user-query';
import { useWatch, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from '../ui/input';
import clsx from 'clsx';
import { toast } from 'sonner';
import useDebounce from '@/hooks/useDebounce';
import { Loader2 } from 'lucide-react';

const initialCenter = { lat: 11.5564, lng: 104.9282 }; // Phnom Penh
const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: 8
};
interface Suggestion {
  description: string;
  place_id: string;
}

interface AddressPickerProps<T extends FieldValues> {
  control: Control<T>;
  fieldName?: Path<T>;
  userFieldName?: Path<T>;
}

interface GoogleMapData {
  lat: number | null;
  lng: number | null;
  placeName: string | null;
  originalUrl: string;
}

const GOOGLE_MAP_LIBRARIES: 'places'[] = ['places'];

export default function AddressPicker<T extends FieldValues>({
  control,
  fieldName = 'address' as Path<T>,
  userFieldName = 'sale' as Path<T>
}: AddressPickerProps<T>) {
  const [addressDetail, setAddressDetail] = useState('');
  const [markerPosition, setMarkerPosition] = useState(initialCenter);
  const [address, setAddress] = useState('');
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAP_LIBRARIES
  });
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const userWatcher = useWatch({ name: userFieldName, control });

  const { mutate } = useAddDirectSaleUsersAddressMutation();
  const { data } = useDirectSaleUsersAddressQuery({ userId: userWatcher });
  const { mutateAsync: mutateShortLink, isPending: isPendingExpandShortLink } =
    useExpendMapShortLinkMutation();

  const debouncedSearchText = useDebounce(searchValue, 500);

  const handleSave = () => {
    if (!address) {
      toast.error('Address is required');
      return;
    }

    const payload = {
      address,
      latitude: `${markerPosition.lat}`,
      longitude: `${markerPosition.lng}`,
      addressDetail,
      userId: userWatcher
    };
    mutate(payload);
    // onSaved(payload);
    setIsOpen(false);
  };

  const handleGetAddressFromCoord = ({ lat, lng }: { lat: number; lng: number }) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setAddress(results[0].formatted_address);
        // setSearchValue(results[0].formatted_address);
      } else {
        setAddress('Address not found');
      }
    });
  };

  // Drag marker
  const handleDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    handleGetAddressFromCoord({ lat, lng });
  }, []);

  // Search suggestions
  const handleTextInput = useCallback((value: string) => {
    setSearchValue(value);
    if (!value) return setSuggestions([]);

    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: value, componentRestrictions: { country: 'KH' } },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(
            predictions.map((p) => ({ description: p.description, place_id: p.place_id }))
          );
        } else {
          setSuggestions([]);
        }
      }
    );
  }, []);

  // Select suggestion
  const handleSelectSuggestion = useCallback((placeId: string) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        placeId
      },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();

          console.log({ location, lat, lng });
          setMarkerPosition({ lat, lng });
          setAddress(results[0].formatted_address);
          if (mapRef.current) mapRef.current.panTo({ lat, lng });
          setSuggestions([]);
          if (inputRef.current) inputRef.current.value = results[0].formatted_address;
        }
      }
    );
  }, []);

  const parseGoogleMapsUrl = (url: string): GoogleMapData => {
    const result: GoogleMapData = { lat: null, lng: null, placeName: null, originalUrl: url };

    try {
      // A: !3d/!4d pin — /maps/place/Name/@lat,lng,z/data=...!3d{lat}!4d{lng}
      // e.g. https://www.google.com/maps/place/Eiffel+Tower/@48.858,2.294,17z/data=!3d48.8584!4d2.2945
      const pinLat = url.match(/!3d(-?[\d.]+)/);
      const pinLng = url.match(/!4d(-?[\d.]+)/);
      if (pinLat && pinLng) {
        result.lat = parseFloat(pinLat[1]);
        result.lng = parseFloat(pinLng[1]);
      }

      // B: @lat,lng camera view — /maps/place/Name/@lat,lng,zoom
      // e.g. https://www.google.com/maps/@11.5417,104.9109,15z
      if (result.lat === null || result.lng === null) {
        const view = url.match(/@(-?[\d.]+),(-?[\d.]+)/);
        if (view) {
          result.lat = parseFloat(view[1]);
          result.lng = parseFloat(view[2]);
        }
      }

      // C: query=lat,lng param — /maps/search/?api=1&query=lat,lng
      // e.g. https://www.google.com/maps/search/?api=1&query=11.54791391,104.87652780  <- YOUR CASE
      if (result.lat === null || result.lng === null) {
        const queryParam = url.match(/[?&]query=(-?[\d.]+),(-?[\d.]+)/);
        if (queryParam) {
          result.lat = parseFloat(queryParam[1]);
          result.lng = parseFloat(queryParam[2]);
        }
      }

      // D: q=lat,lng param — maps.google.com/maps?q=lat,lng
      // e.g. https://maps.google.com/maps?q=11.5417921,104.9109638&entry=gps
      if (result.lat === null || result.lng === null) {
        const qCoord = url.match(/[?&]q=(-?[\d.]+),(-?[\d.]+)/);
        if (qCoord) {
          result.lat = parseFloat(qCoord[1]);
          result.lng = parseFloat(qCoord[2]);
        }
      }

      // E: ll=lat,lng param — older Google Maps URLs
      // e.g. https://maps.google.com/maps?ll=11.5417,104.9109
      if (result.lat === null || result.lng === null) {
        const ll = url.match(/[?&]ll=(-?[\d.]+),(-?[\d.]+)/);
        if (ll) {
          result.lat = parseFloat(ll[1]);
          result.lng = parseFloat(ll[2]);
        }
      }

      // F: /search/lat,lng path segment
      // e.g. https://www.google.com/maps/search/11.5417,104.9109
      if (result.lat === null || result.lng === null) {
        const searchPath = url.match(/\/search\/(-?[\d.]+),(-?[\d.]+)/);
        if (searchPath) {
          result.lat = parseFloat(searchPath[1]);
          result.lng = parseFloat(searchPath[2]);
        }
      }

      // --- PLACE NAME EXTRACTION ---

      // 1. /place/Name — most reliable
      // e.g. https://www.google.com/maps/place/Eiffel+Tower/@...
      const nameMatch = url.match(/\/place\/([^/@?]+)/);
      if (nameMatch?.[1]) {
        result.placeName = decodeURIComponent(nameMatch[1].replace(/\+/g, ' '));
      }

      // 2. query= param as name (only if it's NOT a coordinate pair)
      // e.g. https://www.google.com/maps/search/?api=1&query=Eiffel+Tower
      if (!result.placeName) {
        const queryText = url.match(/[?&]query=([^&]+)/);
        if (queryText?.[1]) {
          const raw = decodeURIComponent(queryText[1].replace(/\+/g, ' '));
          const isCoord = /^-?[\d.]+,-?[\d.]+$/.test(raw);
          if (!isCoord) result.placeName = raw;
        }
      }

      // 3. q= param as name (only if it's NOT a coordinate pair)
      // e.g. https://maps.google.com/maps?q=Eiffel+Tower
      if (!result.placeName) {
        const qText = url.match(/[?&]q=([^&]+)/);
        if (qText?.[1]) {
          const raw = decodeURIComponent(qText[1].replace(/\+/g, ' '));
          const isCoord = /^-?[\d.]+,-?[\d.]+$/.test(raw);
          if (!isCoord) result.placeName = raw;
        }
      }
    } catch (err) {
      console.error('Error parsing Google Maps URL:', err);
    }

    return result;
  };

  const handleUrlInput = async (url: string) => {
    setSuggestions([]);

    try {
      let finalUrl = url;

      // Expand short links FIRST — short URLs have zero coordinate data
      const isShortLink =
        url.includes('goo.gl') || url.includes('maps.app.goo.gl') || url.includes('g.co/maps');

      if (isShortLink) {
        finalUrl = await mutateShortLink({ shortUrl: url });
        if (!finalUrl) throw new Error('Failed to expand short link');
        // console.log('Expanded URL:', finalUrl);
      }

      const result = parseGoogleMapsUrl(finalUrl);
      // console.log('Parsed result:', result);

      if (result.lat !== null && result.lng !== null) {
        setMarkerPosition({ lat: result.lat, lng: result.lng });
        // Use placeName if available, otherwise a generic label
        if (result.placeName) {
          setAddress(result.placeName);
        } else {
          handleGetAddressFromCoord({ lat: result.lat, lng: result.lng });
        }
      } else {
        // console.warn('No coordinates found in URL:', finalUrl);
        // Optionally surface an error to the user here
      }
    } catch (err) {
      console.error('handleUrlInput error:', err);
    }
  };

  useEffect(() => {
    if (!debouncedSearchText) {
      setSuggestions([]);
      return;
    }

    // Check if input looks like a URL
    const isUrl = debouncedSearchText.includes('http') || debouncedSearchText.includes('goo.gl');

    if (isUrl) {
      handleUrlInput(debouncedSearchText);
    } else {
      // It's just text -> Use Autocomplete
      handleTextInput(debouncedSearchText);
    }
  }, [debouncedSearchText]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* this w-full not work why? */}
        <DialogTrigger asChild>
          <div className="flex mb-2 justify-between">
            <FormLabel>
              Address<span className="text-red-500">*</span>
            </FormLabel>
            <FormLabel
              className={clsx('text-primary hover:underline cursor-pointer', {
                hidden: !userWatcher
              })}
            >
              Add
            </FormLabel>
          </div>
        </DialogTrigger>
        <DialogContent className="w-[670px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Add Location</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              {/* <Label htmlFor="name-1">Address</Label> */}
              <Command>
                <div className="relative">
                  <CommandInput
                    placeholder="Search address..."
                    ref={inputRef}
                    value={searchValue}
                    disabled={isPendingExpandShortLink}
                    onValueChange={(v) => setSearchValue(v)}
                  />
                  {isPendingExpandShortLink && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>

                {suggestions.length > 0 && (
                  <CommandList className="absolute z-999 bg-white top-[130px] border w-[350px]">
                    {suggestions.map((sug) => (
                      <CommandItem
                        key={sug.place_id}
                        onSelect={() => handleSelectSuggestion(sug.place_id)}
                      >
                        {sug.description}
                      </CommandItem>
                    ))}
                  </CommandList>
                )}
              </Command>
            </div>
          </div>
          {isLoaded ? (
            <div>
              <GoogleMap
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  zoomControl: false,
                  rotateControl: false,
                  scaleControl: false,
                  clickableIcons: false,
                  gestureHandling: 'greedy' // allow drag & zoom
                }}
                mapContainerStyle={containerStyle}
                center={markerPosition}
                zoom={15}
              >
                <Marker position={markerPosition} draggable={true} onDragEnd={handleDragEnd} />
              </GoogleMap>
              <div className="space-y-2 mt-4">
                <p className="text-sm">Address</p>
                <Input disabled value={address} />
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-sm">Name (optional)</p>
                <Input value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
              </div>
            </div>
          ) : (
            <p>Loading Map...</p>
          )}
          <DialogFooter className="mt-10">
            <Button size="sm" type="button" onClick={handleSave}>
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FormField
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex flex-1">
            <CustomSelect
              disabled={!userWatcher}
              data={(data || []).map((item) => ({
                label: item.addressDetail || item.address,
                value: item.id
              }))}
              value={`${field.value}`}
              onValueChange={(val) => field.onChange(`${val}`)}
            />
          </FormItem>
        )}
      />
    </div>
  );
}
