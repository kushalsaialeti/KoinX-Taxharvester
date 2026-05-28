import { useState, useEffect, useCallback } from "react";
import { Holding, CapitalGains } from "@/types";

export function useHoldingsData() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [capitalGains, setCapitalGains] = useState<CapitalGains | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [holdingsRes, gainsRes] = await Promise.all([
        fetch("/api/holdings"),
        fetch("/api/capital-gains")
      ]);

      if (!holdingsRes.ok || !gainsRes.ok) {
        if (holdingsRes.status === 429 || gainsRes.status === 429) {
          throw new Error("Rate limit exceeded (30 req/min). Please try again soon.");
        }
        throw new Error("Failed to load tax harvesting data. Server returned an error.");
      }

      const holdingsData = await holdingsRes.json();
      const gainsData = await gainsRes.json();

      setHoldings(holdingsData);
      setCapitalGains(gainsData.capitalGains);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "A network error occurred. Please check your connection.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { holdings, capitalGains, loading, error, refetch: fetchData };
}
