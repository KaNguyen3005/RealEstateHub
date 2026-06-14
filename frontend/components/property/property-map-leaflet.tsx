"use client";

import L from "leaflet";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { formatAddress, formatPrice } from "@/lib/property-format";
import type { Property } from "@/types/property";

interface PropertyMapLeafletProps {
  properties?: Property[];
  center?: {
    latitude: number;
    longitude: number;
  };
  selectedLocation?: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
  selectable?: boolean;
  onLocationSelect?: (location: { latitude: number; longitude: number }) => void;
}

const defaultCenter: [number, number] = [10.7769, 106.7009];

const markerIcon = L.divIcon({
  className: "property-map-marker",
  html: '<span></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function hasValidCoordinates(latitude?: number, longitude?: number) {
  return Number.isFinite(latitude) && Number.isFinite(longitude);
}

function getMapCenter(
  properties: Property[],
  center?: PropertyMapLeafletProps["center"],
  selectedLocation?: PropertyMapLeafletProps["selectedLocation"]
): [number, number] {
  if (hasValidCoordinates(selectedLocation?.latitude, selectedLocation?.longitude)) {
    return [selectedLocation!.latitude, selectedLocation!.longitude];
  }

  if (hasValidCoordinates(center?.latitude, center?.longitude)) {
    return [center!.latitude, center!.longitude];
  }

  const firstPropertyWithCoordinates = properties.find((property) => hasValidCoordinates(property.latitude, property.longitude));

  if (firstPropertyWithCoordinates) {
    return [firstPropertyWithCoordinates.latitude, firstPropertyWithCoordinates.longitude];
  }

  return defaultCenter;
}

function MapClickHandler({ onLocationSelect }: Pick<PropertyMapLeafletProps, "onLocationSelect">) {
  useMapEvents({
    click: (event) => {
      onLocationSelect?.({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapViewUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);

  return null;
}

export default function PropertyMapLeaflet({
  properties = [],
  center,
  selectedLocation,
  zoom = 13,
  selectable = false,
  onLocationSelect,
}: PropertyMapLeafletProps) {
  const visibleProperties = properties.filter((property) => hasValidCoordinates(property.latitude, property.longitude));
  const mapCenter = getMapCenter(visibleProperties, center, selectedLocation);
  const mapZoom = visibleProperties.length > 1 ? Math.min(zoom, 11) : zoom;

  return (
    <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={false} className="h-[360px] w-full">
      <MapViewUpdater center={mapCenter} zoom={mapZoom} />
      {selectable ? <MapClickHandler onLocationSelect={onLocationSelect} /> : null}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {visibleProperties.map((property) => (
        <Marker key={property._id} position={[property.latitude, property.longitude]} icon={markerIcon}>
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-foreground">{property.title}</p>
              <p className="text-primary">{formatPrice(property.price, property.purpose)}</p>
              <p className="text-muted-foreground">{formatAddress(property)}</p>
              <Link href={`/properties/${property._id}`} className="font-medium text-primary">
                View detail
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {selectedLocation && hasValidCoordinates(selectedLocation.latitude, selectedLocation.longitude) ? (
        <Marker position={[selectedLocation.latitude, selectedLocation.longitude]} icon={markerIcon}>
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-foreground">Selected property location</p>
              <p className="text-muted-foreground">Click the map to adjust this marker.</p>
            </div>
          </Popup>
        </Marker>
      ) : null}
    </MapContainer>
  );
}
