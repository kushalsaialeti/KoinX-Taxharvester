import { Holding, CapitalGains, CapitalGainBucket } from "@/types";

export function netGain(bucket: CapitalGainBucket): number {
  return bucket.profits - bucket.losses;
}

export function realisedGains(gains: CapitalGains): number {
  return netGain(gains.stcg) + netGain(gains.ltcg);
}

export function applyHarvesting(base: CapitalGains, selectedHoldings: Holding[]): CapitalGains {
  let stcgProfits = base.stcg.profits;
  let stcgLosses = base.stcg.losses;
  let ltcgProfits = base.ltcg.profits;
  let ltcgLosses = base.ltcg.losses;

  for (const h of selectedHoldings) {
    if (h.stcg.gain > 0) stcgProfits += h.stcg.gain;
    else if (h.stcg.gain < 0) stcgLosses += Math.abs(h.stcg.gain);

    if (h.ltcg.gain > 0) ltcgProfits += h.ltcg.gain;
    else if (h.ltcg.gain < 0) ltcgLosses += Math.abs(h.ltcg.gain);
  }

  return {
    stcg: { profits: stcgProfits, losses: stcgLosses },
    ltcg: { profits: ltcgProfits, losses: ltcgLosses }
  };
}

export function taxSavings(preGains: CapitalGains, postGains: CapitalGains): number {
  return Math.max(0, realisedGains(preGains) - realisedGains(postGains));
}
