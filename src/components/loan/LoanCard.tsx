"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateMonthlyPayment, formatCurrencyUSD } from "@/lib/finance";
import { getProviderLogo } from "@/lib/data/logos";
import type { LoanProductRow } from "@/types/database";

const PROVIDER_FILTER_KEYS = {
  bank: "bank",
  mfi: "mfi",
  digital_wallet: "digital",
  insurance: "insurance",
} as const;

export function LoanCard({ product }: { product: LoanProductRow }) {
  const { t, i18n } = useTranslation();
  const isKhmer = i18n.language === "km";

  const logoSrc = getProviderLogo(product.provider_name);

  const productName =
    isKhmer && product.product_name_km
      ? product.product_name_km
      : product.product_name;

  const description =
    isKhmer && product.description_km
      ? product.description_km
      : product.description;

  const sampleAmount = Math.min(
    Math.max(product.min_amount, 500),
    product.max_amount
  );
  const sampleTerm = product.term_max_months;
  const estimatedPayment = calculateMonthlyPayment(
    sampleAmount,
    product.interest_rate_max,
    sampleTerm
  );

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardDescription className="font-semibold uppercase tracking-wide text-primary">
              {product.provider_name}
            </CardDescription>
            <CardTitle className="lang-km mt-1">{productName}</CardTitle>
          </div>
          {logoSrc && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-border">
              <Image
                src={logoSrc}
                alt={product.provider_name}
                width={40}
                height={40}
                unoptimized={logoSrc.endsWith(".svg")}
                className="h-full w-full object-contain p-1"
              />
            </span>
          )}
        </div>
        {description && (
          <p className="lang-km mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted p-3">
            <p className="lang-km text-xs font-semibold text-muted-foreground">
              {t("loans.interest_rate")}
            </p>
            <p className="text-lg font-bold text-primary">
              {product.interest_rate_min}–{product.interest_rate_max}%
              <span className="lang-km text-xs font-normal text-muted-foreground">
                {" "}
                {t("loans.per_year")}
              </span>
            </p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="lang-km text-xs font-semibold text-muted-foreground">
              {t("loans.term")}
            </p>
            <p className="text-lg font-bold">
              {product.term_min_months}–{product.term_max_months}{" "}
              <span className="lang-km text-xs font-normal text-muted-foreground">
                {t("loans.months")}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="lang-km">
            {t("loans.min_amount")}: {formatCurrencyUSD(product.min_amount)}
          </Badge>
          <Badge variant="outline" className="lang-km">
            {t("loans.max_amount")}: {formatCurrencyUSD(product.max_amount)}
          </Badge>
        </div>

        <div className="rounded-lg border border-dashed border-secondary bg-secondary/10 p-3">
          <p className="lang-km text-xs font-semibold text-secondary-foreground/80">
            {t("loans.monthly_payment")} ({formatCurrencyUSD(sampleAmount)},{" "}
            {sampleTerm} {t("loans.months")})
          </p>
          <p className="text-xl font-extrabold text-primary">
            {formatCurrencyUSD(estimatedPayment)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="lang-km">
            {t(`loans.filter_${PROVIDER_FILTER_KEYS[product.provider_type]}`)}
          </Badge>
          {!product.source_url && (
            <Badge
              variant="outline"
              className="lang-km text-muted-foreground"
              title={t("loans.data_disclaimer")}
            >
              {t("loans.estimated_rate")}
            </Badge>
          )}
        </div>
        <div className="lang-km flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {product.source_url && (
            <a
              href={product.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
            >
              {t("loans.source_link")}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {product.rates_last_updated && (
            <span>
              {t("loans.rates_updated")}: {product.rates_last_updated}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
