"use client";

import { useTranslation } from "react-i18next";
import { MapPin, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ServiceType } from "@/types/database";

export interface FinderFilterValue {
  serviceType: ServiceType | "all";
}

export function FinderFilters({
  value,
  onChange,
  onUseLocation,
  locating,
}: {
  value: FinderFilterValue;
  onChange: (value: FinderFilterValue) => void;
  onUseLocation: () => void;
  locating: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-2">
        <label className="lang-km text-sm font-semibold" htmlFor="service-type">
          {t("finder.filter_type")}
        </label>
        <Select
          value={value.serviceType}
          onValueChange={(v) =>
            onChange({ serviceType: v as ServiceType | "all" })
          }
        >
          <SelectTrigger id="service-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="lang-km">
              {t("finder.filter_all")}
            </SelectItem>
            <SelectItem value="bank" className="lang-km">
              {t("finder.type_bank")}
            </SelectItem>
            <SelectItem value="mfi" className="lang-km">
              {t("finder.type_mfi")}
            </SelectItem>
            <SelectItem value="wing" className="lang-km">
              {t("finder.type_wing")}
            </SelectItem>
            <SelectItem value="truemoney" className="lang-km">
              {t("finder.type_truemoney")}
            </SelectItem>
            <SelectItem value="digital_wallet" className="lang-km">
              {t("finder.type_digital_wallet")}
            </SelectItem>
            <SelectItem value="insurance" className="lang-km">
              {t("finder.type_insurance")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="button"
        onClick={onUseLocation}
        variant="secondary"
        className="lang-km"
        disabled={locating}
      >
        {locating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="mr-2 h-4 w-4" />
        )}
        {locating ? t("finder.locating") : t("finder.use_my_location")}
      </Button>
    </div>
  );
}
