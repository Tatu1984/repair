"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type?: "mechanic" | "breakdown" | "workshop";
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
  height?: string;
}

// Dynamically import the entire map as a single component to avoid context issues
const LeafletMap = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { MapContainer, TileLayer, Marker, Popup } = mod;

      // Fix Leaflet default icon issue in Next.js/webpack
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const L = require("leaflet");
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Return a proper component
      function MapInner(props: MapViewProps) {
        return (
          <MapContainer
            center={props.center || [20.5937, 78.9629]}
            zoom={props.zoom || 5}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {(props.markers || []).map((marker) => (
              <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                <Popup>{marker.label}</Popup>
              </Marker>
            ))}
          </MapContainer>
        );
      }

      return MapInner;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-muted/30 rounded-lg border border-dashed h-full">
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

export function MapView({
  center = [20.5937, 78.9629],
  zoom = 5,
  markers = [],
  className = "",
  height = "280px",
}: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      {mounted ? (
        <LeafletMap center={center} zoom={zoom} markers={markers} />
      ) : (
        <div className="flex items-center justify-center bg-muted/30 rounded-lg border border-dashed h-full">
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      )}
    </div>
  );
}
