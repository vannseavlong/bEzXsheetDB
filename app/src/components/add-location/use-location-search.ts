import { useState } from 'react';
import { CAMBODIA_COUNTRY_CODE } from './constants';
import type { LatLng } from './types';

type UseLocationSearchParams = {
  onLocationSelected: (coordinates: LatLng, address: string) => void;
  onUseCurrentLocation: () => void;
};

export const useLocationSearch = ({
  onLocationSelected,
  onUseCurrentLocation
}: UseLocationSearchParams) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchSuggestions([]);
  };

  const closeSearchModal = () => {
    setShowSearchModal(false);
    clearSearch();
  };

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }

    if (!window.google?.maps?.places) {
      setSearchSuggestions([]);
      return;
    }

    const service = new google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country: CAMBODIA_COUNTRY_CODE }
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSearchSuggestions(predictions);
          return;
        }

        setSearchSuggestions([]);
      }
    );
  };

  const handleSelectLocation = (placeId: string, description: string) => {
    if (!window.google?.maps?.places) {
      return;
    }

    const service = new google.maps.places.PlacesService(document.createElement('div'));

    service.getDetails(
      {
        placeId,
        fields: ['geometry']
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) {
          return;
        }

        const coordinates = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };

        onLocationSelected(coordinates, description);
        closeSearchModal();
      }
    );
  };

  const handleUseCurrentLocationFromModal = () => {
    onUseCurrentLocation();
    closeSearchModal();
  };

  return {
    showSearchModal,
    setShowSearchModal,
    searchQuery,
    searchSuggestions,
    handleSearchQuery,
    handleSelectLocation,
    handleUseCurrentLocationFromModal,
    handleCloseSearchModal: closeSearchModal,
    handleClearSearch: clearSearch
  };
};
