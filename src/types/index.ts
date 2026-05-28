export interface GainLoss {
  balance: number;
  gain: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainLoss;
  ltcg: GainLoss;
}

export interface CapitalGainBucket {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  stcg: CapitalGainBucket;
  ltcg: CapitalGainBucket;
}

export interface HarvestingState {
  stcg: CapitalGainBucket;
  ltcg: CapitalGainBucket;
}
