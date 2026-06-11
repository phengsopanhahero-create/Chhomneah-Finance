"use client";

import { useTranslation } from "react-i18next";
import { Landmark, Building2, Wallet, Smartphone, Clock, MapPin, Navigation } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ServiceLocationRow } from "@/types/database";

const SERVICE_ICONS = {
  bank: Landmark,
  mfi: Building2,
  wing: Wallet,
  truemoney: Smartphone,
} as const;

export function ServiceCard({
  location,
  distanceKm,
}: {
  location: ServiceLocationRow;
  distanceKm?: number;
}) {
  const { t, i18n } = useTranslation();
  const isKhmer = i18n.language === "km";

  const Icon = SERVICE_ICONS[location.service_type];
  const name = isKhmer && location.name_km ? location.name_km : location.name;
  const address =
    isKhmer && location.address_km ? location.address_km : location.address;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge variant="outline" className="lang-km mb-1">
              {t(`finder.type_${location.service_type}`)}
            </Badge>
            <CardTitle className="lang-km text-base">{name}</CardTitle>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="lang-km">{address}</span>
        </div>
        {location.hours && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{location.hours}</span>
          </div>
        )}
        {typeof distanceKm === "number" && (
          <p className="lang-km text-sm font-bold text-primary">
            {t("finder.distance_away", { distance: distanceKm })}
          </p>
        )}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lang-km mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          <Navigation className="h-4 w-4" />
          {t("finder.directions")}
        </a>
      </CardContent>
    </Card>
  );
}
