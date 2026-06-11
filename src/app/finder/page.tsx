"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/layout/PageHeader";
import {
  FinderFilters,
  type FinderFilterValue,
} from "@/components/finder/FinderFilters";
import { ServiceCard } from "@/components/finder/ServiceCard";
import { ServiceMap } from "@/components/finder/ServiceMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useServiceLocations } from "@/lib/hooks/useServiceLocations";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { haversineDistanceKm } from "@/lib/finance";

export default function FinderPage() {
  const { t } = useTranslation();
  const { locations, loading } = useServiceLocations();
  const { coords, loading: locating, error, requestLocation } = useGeolocation();

  const [filters, setFilters] = useState<FinderFilterValue>({
    serviceType: "all",
  });

  const filteredLocations = useMemo(() => {
    let result = locations.filter((location) => {
      if (
        filters.serviceType !== "all" &&
        location.service_type !== filters.serviceType
      ) {
        return false;
      }
      return true;
    });

    if (coords) {
      result = [...result].sort((a, b) => {
        const distA = haversineDistanceKm(
          coords.latitude,
          coords.longitude,
          a.latitude,
          a.longitude
        );
        const distB = haversineDistanceKm(
          coords.latitude,
          coords.longitude,
          b.latitude,
          b.longitude
        );
        return distA - distB;
      });
    }

    return result;
  }, [locations, filters, coords]);

  return (
    <div>
      <PageHeader title={t("finder.title")} subtitle={t("finder.subtitle")} />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <FinderFilters
            value={filters}
            onChange={setFilters}
            onUseLocation={requestLocation}
            locating={locating}
          />
          {error === "denied" && (
            <p className="lang-km mt-2 text-sm text-destructive">
              {t("finder.location_denied")}
            </p>
          )}
        </div>

        {loading && (
          <p className="lang-km text-center text-muted-foreground">
            {t("common.loading")}
          </p>
        )}

        {!loading && filteredLocations.length === 0 && (
          <p className="lang-km rounded-xl border border-dashed border-border bg-white p-6 text-center text-muted-foreground">
            {t("finder.no_results")}
          </p>
        )}

        {!loading && filteredLocations.length > 0 && (
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list" className="lang-km">
                {t("finder.list_view")}
              </TabsTrigger>
              <TabsTrigger value="map" className="lang-km">
                {t("finder.map_view")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLocations.map((location) => (
                  <ServiceCard
                    key={location.id}
                    location={location}
                    distanceKm={
                      coords
                        ? haversineDistanceKm(
                            coords.latitude,
                            coords.longitude,
                            location.latitude,
                            location.longitude
                          )
                        : undefined
                    }
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="map" className="h-[500px]">
              <ServiceMap locations={filteredLocations} userLocation={coords} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
