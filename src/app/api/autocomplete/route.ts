import {
  Client,
  PlaceAutocompleteType,
} from '@googlemaps/google-maps-services-js';
import axios from 'axios';
import { type NextRequest } from 'next/server';
import { type Suggestion } from '~/app/components/autocomplete-input';

const axiosInstance = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});
const client = new Client({ axiosInstance });

export type ResponseData = Suggestion[] | { error: string };

export async function GET(request: NextRequest) {
  try {
    const input = request.nextUrl.searchParams.get('input');
    const type = request.nextUrl.searchParams.get('type');

    if (typeof input !== 'string') {
      return Response.json(
        { error: 'Invalid input parameter' },
        { status: 400 }
      );
    }

    if (type === 'yandex') {
      const yandexResponse = await axios.get<any>(
        'https://suggest-maps.yandex.ru/v1/suggest',
        {
          params: {
            apikey: process.env.YANDEX_MAPS_API_KEY,
            text: input,
            lang: 'ru_RU',
            types: 'house',
            ll: '27.518791325127733,53.90891092143379', // Coordinates for Minsk
            spn: '1.5,1.5', // Approximate span for Minsk region
            results: 5,
          },
        }
      );

      if (yandexResponse.data.results) {
        const yandexSuggestions = yandexResponse.data.results.map(
          (result: any) => ({
            text: `${result.title.text}, ${result.subtitle.text}`,
            distance: result.distance?.value || null,
          })
        );
        return Response.json(yandexSuggestions);
      }
    } else {
      const googleResponse = await client.placeAutocomplete({
        params: {
          input: input,
          key: process.env.GOOGLE_MAPS_API_KEY,
          language: 'ru',
          types: PlaceAutocompleteType.address,
          components: ['country:by'],
          location: { lat: 53.9006, lng: 27.559 }, // Coordinates for Minsk
          radius: 20000, // 20km radius around Minsk
          strictbounds: true,
        },
      });

      if (googleResponse.data.predictions) {
        const googleSuggestions = googleResponse.data.predictions.map(
          (prediction) => ({
            text: prediction.description,
          })
        );
        return Response.json(googleSuggestions);
      }
    }

    return Response.json([]);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
