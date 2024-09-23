'use client';

import { useState, useEffect, useRef, type FC, useCallback } from 'react';
import { useThrottle } from '@uidotdev/usehooks';
import { AutocompleteInput } from '../components/autocomplete-input';
import { fetchSuggestions } from './utils';

const Autocomplete: FC = () => {
  const [googleInputValue, setGoogleInputValue] = useState<string>('');
  const [yandexInputValue, setYandexInputValue] = useState<string>('');
  const [googleSuggestions, setGoogleSuggestions] = useState<string[]>([]);
  const [yandexSuggestions, setYandexSuggestions] = useState<string[]>([]);

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

  return (
    <div className="bg-[#1e1f22] p-4">
      <AutocompleteInput
        type="google"
        inputValue={googleInputValue}
        setInputValue={setGoogleInputValue}
        suggestions={googleSuggestions}
        setSuggestions={setGoogleSuggestions}
      />
      <AutocompleteInput
        type="yandex"
        inputValue={yandexInputValue}
        setInputValue={setYandexInputValue}
        suggestions={yandexSuggestions}
        setSuggestions={setYandexSuggestions}
      />
    </div>
  );
};

export default Autocomplete;
