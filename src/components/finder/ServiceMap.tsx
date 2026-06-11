"use client";

import { useMemo, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

import type { ServiceLocationRow } from "@/types/database";
import type { Coordinates } from "@/lib/hooks/useGeolocation";

const CAMBODIA_CENTER = { lat: 12.5657, lng: 104.991 };

const SERVICE_COLORS: Record<ServiceLocationRow["service_type"], string> = {
  bank: "#B22222",
  mfi: "#DAA520",
  wing: "#1E90FF",
  truemoney: "#FF7F00",
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export function ServiceMap({
  locations,
  userLocation,
}: {
  locations: ServiceLocationRow[];
  userLocation: Coordinates | null;
}) {
  const { t, i18n } = useTranslation();
  const isKhmer = i18n.language === "km";
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: "rural-finance-hub-map",
  });

  const center = useMemo(() => {
    if (userLocation) {
      return { lat: userLocation.latitude, lng: userLocation.longitude };
    }
    return CAMBODIA_CENTER;
  }, [userLocation]);

  if (!apiKey) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
        Google Maps API key is not configured. Set
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment to enable the map
        view.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-border bg-muted">
        <p className="lang-km text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  const selected = locations.find((l) => l.id === selectedId) ?? null;

  return (
    <div className="h-full min-h-[400px] overflow-hidden rounded-xl border border-border">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={userLocation ? 13 : 7}
      >
        {userLocation && (
          <MarkerF
            position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#1E90FF",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        )}

        {locations.map((location) => (
          <MarkerF
            key={location.id}
            position={{ lat: location.latitude, lng: location.longitude }}
            onClick={() => setSelectedId(location.id)}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: SERVICE_COLORS[location.service_type],
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 1.5,
            }}
            title={isKhmer && location.name_km ? location.name_km : location.name}
          />
        ))}
      </GoogleMap>

      {selected && (
        <div className="border-t border-border bg-white p-3 text-sm">
          <p className="lang-km font-bold text-primary">
            {isKhmer && selected.name_km ? selected.name_km : selected.name}
          </p>
          <p className="lang-km text-muted-foreground">
            {isKhmer && selected.address_km
              ? selected.address_km
              : selected.address}
          </p>
        </div>
      )}
    </div>
  );
}
