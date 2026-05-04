import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Icon from '@/assets/icons/icon-asset';
import { useTranslation } from 'react-i18next';

interface SearchLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchSuggestions: google.maps.places.AutocompletePrediction[];
  onSelectLocation: (placeId: string, description: string) => void;
  onUseCurrentLocation: () => void;
  onClearSearch: () => void;
}

const SearchLocationModal: React.FC<SearchLocationModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchQueryChange,
  searchSuggestions,
  onSelectLocation,
  onUseCurrentLocation,
  onClearSearch
}) => {
  const { t } = useTranslation();
  // console.log('searchSuggestions: ', searchSuggestions);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let openAnimationTimer: number | undefined;
    let delayedFocusTimer: number | undefined;
    let closeAnimationTimer: number | undefined;

    if (isOpen) {
      setShouldRender(true);
      // Small delay to trigger animation
      openAnimationTimer = window.setTimeout(() => setIsAnimating(true), 10);
      delayedFocusTimer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      closeAnimationTimer = window.setTimeout(() => setShouldRender(false), 250);
    }

    return () => {
      if (openAnimationTimer) {
        window.clearTimeout(openAnimationTimer);
      }
      if (delayedFocusTimer) {
        window.clearTimeout(delayedFocusTimer);
      }
      if (closeAnimationTimer) {
        window.clearTimeout(closeAnimationTimer);
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    onClose();
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-[#00000080] z-50 flex items-end transition-opacity duration-300 ${
        isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
      }`}
      onClick={handleClose}>
      <div
        className={`bg-white w-full h-[85vh] rounded-t-2xl overflow-hidden transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}>
        {/* Modal Content */}
        <div className="p-4 h-full overflow-y-auto ">
          <h4 className="text-lg font-medium text-[#484848] mb-4">
            {t('searchLocation.searchLocation')}
          </h4>

          {/* Search Input */}
          <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-[#102C90] to-[#1B4CFA]" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder={t('searchLocation.searchLocation')}
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg bg-[#eeeeee] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Use Current Location Button */}
          <button
            onClick={onUseCurrentLocation}
            className="w-full flex items-center justify-center gap-3 bg-[#bbdefa] text-[#173f73] py-4 rounded-lg mb-6 font-medium">
            <div className=" flex items-center justify-center">
              <Icon name="radarIcon1" />
            </div>
            {t('searchLocation.useCurrentLocation')}
          </button>

          {/* Search Results */}
          <div className="space-y-1">
            {searchSuggestions.length > 0 ? (
              searchSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.place_id || index}
                  onClick={() => onSelectLocation(suggestion.place_id, suggestion.description)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        {suggestion.structured_formatting.main_text}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {suggestion.structured_formatting.secondary_text}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : searchQuery.trim() ? (
              <p className="text-center text-gray-500 py-8">
                {t('searchLocation.noSuggestionsFound')}
              </p>
            ) : (
              <p className="text-center text-gray-500 py-8">
                {t('searchLocation.noSuggestionsFound')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLocationModal;
