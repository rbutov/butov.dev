import type { ResponseData } from '~/app/api/autocomplete/route';

import { type Suggestion } from '../components/autocomplete-input';

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
