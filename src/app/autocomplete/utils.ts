import type { ResponseData } from '~/app/api/autocomplete/route';

import { type Suggestion } from '../components/autocomplete-input';

export type Geocode = {
  latitude: number;
  longitude: number;
};

export const getGeocode = async (address: string): Promise<Geocode | null> => {
  try {
    const response = await fetch(
      `/api/autocomplete?input=${encodeURIComponent(address)}&type=geocode`
    );

    if (response.ok) {
      const data = await response.json();
      if ('latitude' in data && 'longitude' in data) {
        return { latitude: data.latitude, longitude: data.longitude };
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching geocode:', error);
    return null;
  }
};

export const fetchSuggestions = async (
  value: string,
  type: 'google' | 'yandex',
  signal: AbortSignal
): Promise<Suggestion[]> => {
  try {
    const response = await fetch(
      `/api/autocomplete?input=${encodeURIComponent(value)}&type=${type}`,
      { signal }
    );

    if (response.ok) {
      const data = (await response.json()) as ResponseData;

      if (Array.isArray(data)) {
        return data;
      } else {
        console.error('Error:', data.error);
        return [];
      }
    } else {
      throw new Error('Failed to fetch suggestions');
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request was aborted');
    } else {
      console.error('Error fetching autocomplete suggestions:', error);
    }
    return [{ text: value }];
  }
};
