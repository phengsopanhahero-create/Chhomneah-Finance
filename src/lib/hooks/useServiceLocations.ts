"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { FALLBACK_SERVICE_LOCATIONS } from "@/lib/data/serviceLocations";
import type { ServiceLocationRow } from "@/types/database";

export function useServiceLocations() {
  const [locations, setLocations] = useState<ServiceLocationRow[]>(
    FALLBACK_SERVICE_LOCATIONS
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("service_locations")
        .select("*")
        .order("name", { ascending: true });

      if (cancelled) return;

      if (!error && data && data.length > 0) {
        setLocations(data);
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { locations, loading };
}
