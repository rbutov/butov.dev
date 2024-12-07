'use client';

import { useThrottle } from '@uidotdev/usehooks';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';

import {
  AutocompleteInput,
  type Suggestion,
} from '../components/autocomplete-input';
import { YandexMapWithZones } from '../components/yandex-map';
import { type Geocode, fetchSuggestions, getGeocode } from './utils';

const Autocomplete: FC = () => {
  const [googleInputValue, setGoogleInputValue] = useState<string>('');
  const [yandexInputValue, setYandexInputValue] = useState<string>('');
  const [googleSuggestions, setGoogleSuggestions] = useState<Suggestion[]>([]);
  const [yandexSuggestions, setYandexSuggestions] = useState<Suggestion[]>([]);
  const [selectedGeocode, setSelectedGeocode] = useState<Geocode | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const throttledGoogleValue = useThrottle(googleInputValue, 300);
  const throttledYandexValue = useThrottle(yandexInputValue, 300);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFetchSuggestions = useCallback(
    async (value: string, type: 'google' | 'yandex') => {
      abortControllerRef.current?.abort('new request');
      abortControllerRef.current = new AbortController();

      const suggestions = await fetchSuggestions(
        value,
        type,
        abortControllerRef.current.signal
      );

      if (type === 'google') {
        setGoogleSuggestions(suggestions);
      } else {
        setYandexSuggestions(suggestions);
      }
    },
    []
  );

  useEffect(() => {
    if (throttledGoogleValue) {
      handleFetchSuggestions(throttledGoogleValue, 'google');
    } else {
      setGoogleSuggestions([]);
    }
  }, [throttledGoogleValue, handleFetchSuggestions]);

  useEffect(() => {
    if (throttledYandexValue) {
      handleFetchSuggestions(throttledYandexValue, 'yandex');
    } else {
      setYandexSuggestions([]);
    }
  }, [throttledYandexValue, handleFetchSuggestions]);

  useEffect(() => {
    if (selectedAddress) {
      getGeocode(selectedAddress).then((geocode) => {
        if (geocode) {
          setSelectedGeocode(geocode);
        }
      });
    }
  }, [selectedAddress]);

  return (
    <div className="bg-[#1e1f22] p-4">
      {/* <AutocompleteInput
        type="google"
        inputValue={googleInputValue}
        setInputValue={setGoogleInputValue}
        suggestions={googleSuggestions}
        setSuggestions={setGoogleSuggestions}
        setSelected={setSelectedAddress}
      /> */}
      <AutocompleteInput
        type="yandex"
        inputValue={yandexInputValue}
        setInputValue={setYandexInputValue}
        suggestions={yandexSuggestions}
        setSuggestions={setYandexSuggestions}
        setSelected={setSelectedAddress}
      />
      <YandexMapWithZones
        center={[27.518791325127733, 53.90891092143379]}
        selectedGeocode={selectedGeocode}
      />
    </div>
  );
};

export default Autocomplete;
