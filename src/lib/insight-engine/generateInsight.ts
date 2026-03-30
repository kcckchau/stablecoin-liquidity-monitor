export type LiquidityInsight = {
  observation: string
  interpretation: string
  implication: string
  confidence: 'Low' | 'Medium' | 'High'
}

export type LiquidityInsightInput = {
  usdt7d: number | null
  usdc7d: number | null
  rrpChange7d: number | null
  tgaChange7d: number | null
}

export function generateLiquidityInsight(data: LiquidityInsightInput): LiquidityInsight {
  const { usdt7d, usdc7d, rrpChange7d, tgaChange7d } = data

  const stablecoinDelta = (usdt7d ?? 0) + (usdc7d ?? 0)

  const observation = `Stablecoin supply (USDT + USDC) changed ${stablecoinDelta >= 0 ? '+' : ''}${stablecoinDelta.toFixed(2)}% over 7 days.`

  let interpretation: string
  let implication: string
  let confidence: LiquidityInsight['confidence']

  if (stablecoinDelta > 2) {
    interpretation = 'Liquidity expansion driven by stablecoin growth.'
    implication = 'Supports risk assets, but requires macro confirmation.'
    confidence = 'Medium'
  } else if (stablecoinDelta < -2) {
    interpretation = 'Liquidity contraction as stablecoin supply declines.'
    implication = 'May pressure risk assets if sustained.'
    confidence = 'Medium'
  } else {
    interpretation = 'Liquidity conditions are relatively stable.'
    implication = 'No strong directional macro signal.'
    confidence = 'Low'
  }

  // Macro overlay: RRP declining = liquidity improving (cash moving into markets)
  if (rrpChange7d !== null && rrpChange7d < 0) {
    interpretation += ' RRP declining suggests improving system liquidity.'
    confidence = 'High'
  }

  // Macro overlay: TGA rising = Treasury draining liquidity from system
  if (tgaChange7d !== null && tgaChange7d > 5) {
    implication += ' Rising TGA suggests a near-term liquidity drain.'
  }

  return {
    observation,
    interpretation,
    implication,
    confidence,
  }
}
