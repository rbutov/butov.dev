import React, { useEffect, useRef, useState } from 'react';

import { type Geocode } from '../autocomplete/utils';
import mapData from './map.json';

declare global {
  interface Window {
    ymaps: any;
  }
}

interface YandexMapWithZonesProps {
  center: [number, number]; // [latitude, longitude]
  selectedGeocode: Geocode | null;
}

const YandexMapWithZones: React.FC<YandexMapWithZonesProps> = ({
  center,
  selectedGeocode,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const isScriptLoaded = useRef(false);
  const [map, setMap] = useState<any>(null);
  const [deliveryZones, setDeliveryZones] = useState<any>(null);
  const [selectedZoneDescription, setSelectedZoneDescription] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isScriptLoaded.current) {
      isScriptLoaded.current = true;
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU&coordorder=longlat`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.ymaps.ready(() => initMap());
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    if (map && selectedGeocode && deliveryZones) {
      const { latitude, longitude } = selectedGeocode;
      const coordinates = [longitude, latitude];

      const placemark = new window.ymaps.Placemark(
        coordinates,
        {},
        {
          preset: 'islands#redDotIcon',
        }
      );

      map.geoObjects.add(placemark);
      map.setCenter(coordinates, 12);

      // Check if the selected geocode is in a delivery zone
      const zonesContainingPoint = deliveryZones.searchContaining(coordinates);
      zonesContainingPoint.each((obj: any) => {
        obj.options.set({
          fillColor: '#ff0000',
          fillOpacity: 0.4,
        });
        const description = obj.properties.get('description');
        if (description) {
          setSelectedZoneDescription(description);
        }
      });

      if (zonesContainingPoint.getLength() === 0) {
        setSelectedZoneDescription(null);
      }
    }
  }, [map, selectedGeocode, deliveryZones]);

  const initMap = () => {
    if (!mapRef.current) return;

    const newMap = new window.ymaps.Map(mapRef.current, {
      center: center,
      zoom: 9,
    });

    setMap(newMap);

    const zones = new window.ymaps.geoQuery(mapData).addToMap(newMap);
    zones.each(function (obj: any) {
      obj.options.set({
        fillColor: obj.properties.get('fill'),
        fillOpacity: obj.properties.get('fill-opacity'),
        strokeColor: obj.properties.get('stroke'),
        strokeWidth: obj.properties.get('stroke-width'),
        strokeOpacity: obj.properties.get('stroke-opacity'),
      });
    });

    setDeliveryZones(zones);

    console.log('GeoJSON data added to map:', mapData);
  };

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
      {selectedZoneDescription && (
        <div className="mt-4 p-4 text-black bg-gray-100 rounded-md">
          <p>{selectedZoneDescription}</p>
        </div>
      )}
    </div>
  );
};

export { YandexMapWithZones };
