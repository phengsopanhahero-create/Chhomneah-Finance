"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/layout/PageHeader";
import { LoanFilters, type LoanFilterValue } from "@/components/loan/LoanFilters";
import { LoanCard } from "@/components/loan/LoanCard";
import { PaymentCalculator } from "@/components/loan/PaymentCalculator";
import { useLoanProducts } from "@/lib/hooks/useLoanProducts";

export default function LoansPage() {
  const { t } = useTranslation();
  const { products, loading } = useLoanProducts();

  const [filters, setFilters] = useState<LoanFilterValue>({
    amount: "",
    providerType: "all",
  });

  const filteredProducts = useMemo(() => {
    const amount = parseFloat(filters.amount);

    return products.filter((product) => {
      if (
        filters.providerType !== "all" &&
        product.provider_type !== filters.providerType
      ) {
        return false;
      }

      if (!isNaN(amount) && amount > 0) {
        if (amount < product.min_amount || amount > product.max_amount) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  return (
    <div>
      <PageHeader title={t("loans.title")} subtitle={t("loans.subtitle")} />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <PaymentCalculator />

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <LoanFilters value={filters} onChange={setFilters} />
        </div>

        {loading && (
          <p className="lang-km text-center text-muted-foreground">
            {t("common.loading")}
          </p>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p className="lang-km rounded-xl border border-dashed border-border bg-white p-6 text-center text-muted-foreground">
            {t("loans.no_results")}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <LoanCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
