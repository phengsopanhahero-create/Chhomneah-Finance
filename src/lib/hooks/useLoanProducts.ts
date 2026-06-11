"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { FALLBACK_LOAN_PRODUCTS } from "@/lib/data/loanProducts";
import type { LoanProductRow } from "@/types/database";

export function useLoanProducts() {
  const [products, setProducts] = useState<LoanProductRow[]>(
    FALLBACK_LOAN_PRODUCTS
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("loan_products")
        .select("*")
        .order("provider_name", { ascending: true });

      if (cancelled) return;

      if (!error && data && data.length > 0) {
        setProducts(data);
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}
