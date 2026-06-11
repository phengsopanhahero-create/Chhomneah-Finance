"use client";

import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProviderType } from "@/types/database";

export interface LoanFilterValue {
  amount: string;
  providerType: ProviderType | "all";
}

export function LoanFilters({
  value,
  onChange,
}: {
  value: LoanFilterValue;
  onChange: (value: LoanFilterValue) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="loan-amount" className="lang-km">
          {t("loans.filter_amount")}
        </Label>
        <Input
          id="loan-amount"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="500"
          value={value.amount}
          onChange={(e) => onChange({ ...value, amount: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider-type" className="lang-km">
          {t("loans.filter_provider_type")}
        </Label>
        <Select
          value={value.providerType}
          onValueChange={(v) =>
            onChange({ ...value, providerType: v as ProviderType | "all" })
          }
        >
          <SelectTrigger id="provider-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="lang-km">
              {t("loans.filter_all")}
            </SelectItem>
            <SelectItem value="bank" className="lang-km">
              {t("loans.filter_bank")}
            </SelectItem>
            <SelectItem value="mfi" className="lang-km">
              {t("loans.filter_mfi")}
            </SelectItem>
            <SelectItem value="digital_wallet" className="lang-km">
              {t("loans.filter_digital")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
