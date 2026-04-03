# HelloWorld

# Quantitative Trading Explained

## What Is Quantitative Trading?

Quantitative trading (quant trading) is a method of executing trades using mathematical models, statistical analysis, and algorithmic systems — rather than relying on human intuition or discretionary judgment. Practitioners are called **quantitative traders** or **quants**.

---

## Core Concepts

### 1. Alpha Generation
**Alpha** is excess return above a benchmark. Quants build models to identify signals — patterns in price, volume, fundamentals, or alternative data — that predict future price movements. The goal is a signal that is:
- **Statistically significant** (not random noise)
- **Economically meaningful** (large enough to trade after costs)
- **Robust** (works out-of-sample, not just on historical data)

### 2. Signal Types
| Category | Examples |
|---|---|
| Technical / Price-based | Momentum, mean-reversion, moving average crossovers |
| Fundamental | P/E ratios, earnings growth, balance sheet metrics |
| Alternative Data | Satellite imagery, credit card transactions, social sentiment |
| Microstructure | Order book imbalance, trade flow, bid-ask spread |

### 3. Strategy Styles

**Statistical Arbitrage (Stat Arb)**
Exploits temporary mispricings between correlated instruments (e.g., pairs trading). Assumes prices will revert to a historical relationship.

**Momentum / Trend Following**
Buys assets that have recently outperformed and sells those that have underperformed. Grounded in the empirical observation that trends persist in the short-to-medium term.

**Mean Reversion**
Bets that extreme price moves will reverse toward a long-run average. Common in equity markets at short time horizons.

**Market Making**
Continuously posts both buy (bid) and sell (ask) orders to profit from the spread. Requires extremely low latency infrastructure.

**High-Frequency Trading (HFT)**
Operates at microsecond to millisecond timescales. Strategies include latency arbitrage, market making, and order flow prediction. Requires co-location and custom hardware (FPGAs).

---

## The Quant Trading Workflow

```
1. Idea Generation
   └── Literature, data exploration, intuition, domain knowledge

2. Data Acquisition & Cleaning
   └── Market data, fundamental data, alternative data
   └── Handle missing values, survivorship bias, look-ahead bias

3. Feature Engineering
   └── Transform raw data into predictive signals

4. Backtesting
   └── Simulate the strategy on historical data
   └── Account for transaction costs, slippage, market impact

5. Risk Management & Portfolio Construction
   └── Position sizing (Kelly criterion, mean-variance optimization)
   └── Exposure limits: sector, factor, concentration

6. Paper Trading (Simulation)
   └── Run strategy live but without real capital

7. Live Deployment
   └── Order management system (OMS) → broker/exchange API
   └── Real-time monitoring, alerting, kill switches

8. Ongoing Research
   └── Alpha decay is real — strategies degrade over time
```

---

## Key Mathematical & Statistical Foundations

- **Time Series Analysis**: ARIMA, cointegration, autocorrelation
- **Linear Algebra**: Portfolio optimization, factor models (PCA)
- **Probability & Statistics**: Hypothesis testing, Bayesian inference, distributions
- **Optimization**: Convex optimization for portfolio construction (e.g., Markowitz mean-variance)
- **Machine Learning**: Gradient boosting, neural networks, reinforcement learning for signal discovery

---

## Risk Management

Risk is central to every quant strategy.

| Metric | Purpose |
|---|---|
| Sharpe Ratio | Risk-adjusted return (return / volatility) |
| Maximum Drawdown | Largest peak-to-trough loss |
| Value at Risk (VaR) | Loss not exceeded at a given confidence level |
| Beta / Factor Exposure | Sensitivity to market or systematic factors |
| Turnover | Trading frequency and associated transaction costs |

**Common risk controls:**
- Position limits (max % of portfolio per instrument)
- Sector and factor neutrality (long/short hedging)
- Stop-loss and drawdown-based circuit breakers
- Correlation monitoring across positions

---

## Infrastructure

| Component | Role |
|---|---|
| Data Pipeline | Ingest, clean, store market and alternative data |
| Research Environment | Python/R notebooks for backtesting and analysis |
| Execution Engine | Routes orders to exchanges, manages fills |
| Risk System | Real-time P&L and exposure monitoring |
| Order Management System (OMS) | Tracks open orders, positions, inventory |

Popular tools and libraries:
- **Python**: pandas, NumPy, scikit-learn, statsmodels, PyTorch
- **Backtesting Frameworks**: Backtrader, Zipline, Vectorbt, QuantConnect (Lean)
- **Data Sources**: Bloomberg, Refinitiv, Quandl, Alpaca, Polygon.io

---

## Common Pitfalls

1. **Overfitting / Curve-fitting**: A model that performs perfectly in-sample but fails out-of-sample. Too many parameters relative to data.
2. **Look-ahead Bias**: Accidentally using future information in a backtest, making results unrealistically good.
3. **Survivorship Bias**: Only backtesting on assets that still exist today, ignoring delisted companies.
4. **Transaction Cost Underestimation**: Ignoring slippage, commissions, and market impact can make an unprofitable strategy appear profitable.
5. **Alpha Decay**: Market participants discover the same edge, arbitraging it away over time.
6. **Overly Correlated Positions**: Thinking you are diversified when positions are all exposed to the same risk factor.

---

## Quant Trading vs. Discretionary Trading

| Dimension | Quantitative | Discretionary |
|---|---|---|
| Decision Making | Rules-based, algorithmic | Human judgment |
| Scalability | Can trade hundreds of instruments simultaneously | Limited by analyst bandwidth |
| Emotion | Emotion-free by design | Susceptible to behavioral biases |
| Adaptability | Requires re-research when market regime changes | Can adapt in real-time |
| Edge Source | Statistical patterns, data advantages | Domain expertise, information networks |

---

## Career Paths in Quant Trading

- **Quant Researcher**: Develops alpha signals and models
- **Quant Developer / Engineer**: Builds execution infrastructure and data pipelines
- **Portfolio Manager**: Allocates capital across strategies and manages risk
- **Risk Manager**: Monitors and controls portfolio-level and firm-level risk
- **HFT Engineer**: Focuses on ultra-low-latency systems and exchange connectivity

---

## Further Reading

- *Algorithmic Trading* — Ernest Chan
- *Advances in Financial Machine Learning* — Marcos López de Prado
- *Quantitative Trading* — Ernest Chan
- *Active Portfolio Management* — Grinold & Kahn
- *Inside the Black Box* — Rishi Narang

---

# Value at Risk (VaR) Explained

## What Is VaR?

**Value at Risk (VaR)** is a statistical measure that quantifies the **maximum expected loss** of a portfolio over a given time horizon, at a specified confidence level, under normal market conditions.

> **Plain English**: "With 95% confidence, we will not lose more than $1 million in a single day."

VaR answers the question: *How bad can things get, most of the time?*

---

## The Three Parameters of VaR

Every VaR figure requires three inputs:

| Parameter | Description | Example |
|---|---|---|
| **Time Horizon** | The period over which loss is measured | 1 day, 10 days, 1 month |
| **Confidence Level** | Probability that the loss will NOT exceed VaR | 95%, 99%, 99.9% |
| **Portfolio Value** | The dollar value of positions being measured | $10,000,000 |

**Example statement**: "The 1-day 99% VaR of this portfolio is $500,000."
This means: on 99 out of 100 trading days, the loss will be less than $500,000. On approximately 1 day out of 100, it may exceed that amount.

---

## The Three Main Methods for Calculating VaR

### Method 1: Historical Simulation (Non-Parametric)

**How it works:**
1. Collect historical returns for the portfolio (e.g., the past 500 trading days)
2. Apply those historical return scenarios to the current portfolio
3. Sort the resulting P&L scenarios from worst to best
4. Read off the loss at the chosen confidence percentile

**Example** (99% 1-day VaR on 500 days of data):
- Sort 500 simulated daily P&Ls
- The 5th worst loss (bottom 1% of 500) is the VaR

```
Daily P&L sorted (worst to best):
  Day 1:  -$980,000   ← 1st worst (0.2%)
  Day 2:  -$870,000   ← 2nd worst (0.4%)
  Day 3:  -$760,000   ← 3rd worst (0.6%)
  Day 4:  -$650,000   ← 4th worst (0.8%)
  Day 5:  -$540,000   ← 5th worst (1.0%)  ← 99% VaR = $540,000
  Day 6:  -$420,000
  ...
```

**Pros:** Simple, no distributional assumptions, captures fat tails and non-linear instruments.
**Cons:** Fully anchored to the historical window; rare events outside that window are invisible.

---

### Method 2: Parametric VaR (Variance-Covariance)

**How it works:**
Assumes returns are normally distributed. Uses the portfolio's mean return (μ) and standard deviation (σ) to compute VaR analytically.

**Formula:**

```
VaR = Portfolio Value × (μ - z × σ)
```

Where **z** is the z-score for the chosen confidence level:

| Confidence Level | z-score |
|---|---|
| 90% | 1.282 |
| 95% | 1.645 |
| 99% | 2.326 |
| 99.9% | 3.090 |

**Example:**
- Portfolio value: $10,000,000
- Daily mean return: 0.05%
- Daily standard deviation: 1.2%
- Confidence level: 99% → z = 2.326

```
VaR = $10,000,000 × (0.0005 - 2.326 × 0.012)
    = $10,000,000 × (0.0005 - 0.02791)
    = $10,000,000 × (-0.02741)
    = $274,100
```

**Pros:** Fast, easy to compute and decompose. Works well for linear portfolios.
**Cons:** Assumes normality — badly underestimates risk in fat-tailed, skewed, or non-linear portfolios (e.g., options).

---

### Method 3: Monte Carlo Simulation

**How it works:**
1. Model the statistical behavior of risk factors (prices, rates, volatilities)
2. Simulate thousands (or millions) of random scenarios using those models
3. Revalue the portfolio under each scenario
4. Sort the resulting P&L distribution and read off the VaR percentile

**Example** (simplified):
- Simulate 100,000 random daily returns from a fitted distribution
- Sort the simulated P&Ls
- The 1,000th worst outcome (bottom 1%) is the 99% VaR

**Pros:** Handles non-linear instruments (options, structured products), complex correlations, and non-normal distributions.
**Cons:** Computationally expensive. Results depend heavily on the model assumptions used for simulation.

---

## Comparing the Three Methods

| | Historical Simulation | Parametric | Monte Carlo |
|---|---|---|---|
| Distributional assumption | None | Normal | Model-dependent |
| Handles options / non-linearity | Yes | Poorly | Yes |
| Computational cost | Low | Very low | High |
| Captures fat tails | Only if in history | No | Yes (if modeled) |
| Transparency | High | High | Lower |

---

## Scaling VaR Across Time Horizons

Regulatory frameworks (e.g., Basel) often require a **10-day VaR** but firms may only calculate a 1-day VaR. The square-root-of-time rule scales VaR under the normality assumption:

```
VaR(T days) = VaR(1 day) × √T
```

**Example:** 1-day 99% VaR = $500,000
→ 10-day 99% VaR = $500,000 × √10 ≈ $1,581,139

*Note: This scaling only holds if daily returns are independent and identically distributed (i.i.d.) — an assumption that often breaks down in practice.*

---

## VaR in Practice: Regulatory Use

**Basel II / III (Banking Regulation):**
- Banks must hold capital against market risk, calculated using a 10-day 99% VaR
- Internal models must be backtested: if actual losses exceed VaR more than 4–5 times in 250 trading days, multipliers are applied to capital requirements

**Portfolio Management:**
- Used to set position limits and risk budgets
- Reported daily by risk teams to senior management and boards

---

## Criticisms and Limitations of VaR

VaR is widely used but also widely criticized:

### 1. Tells You Nothing About Tail Severity
VaR says "you will not lose more than X on 99% of days" but says **nothing** about how much you lose on the remaining 1% of days. A loss could be $X + $1 or $X + $1 billion.

### 2. Assumes Normal Market Conditions
Financial returns have **fat tails** (leptokurtosis) — extreme events happen far more often than a normal distribution predicts. Parametric VaR systematically underestimates crisis-period losses.

### 3. Can Be Manipulated
Strategies can be constructed to have low VaR while carrying enormous hidden tail risk (e.g., selling out-of-the-money options). VaR may not capture these.

### 4. Not Sub-Additive
VaR does not always satisfy the property that diversification reduces risk. In some cases, VaR(A + B) > VaR(A) + VaR(B), which is mathematically undesirable.

### 5. Gives False Precision
A single number implies a precision that is not warranted given the underlying model uncertainty.

---

## Beyond VaR: Related Risk Measures

| Measure | Description | Addresses VaR's Gap? |
|---|---|---|
| **Expected Shortfall (ES) / CVaR** | Average loss in the worst (1-α)% of scenarios | Yes — captures tail severity |
| **Stressed VaR** | VaR computed using a stressed historical period (e.g., 2008 crisis) | Partially |
| **Maximum Drawdown** | Largest peak-to-trough loss over a period | Different dimension |
| **Tail Risk** | Probability-weighted extreme loss scenarios | Yes |

**Expected Shortfall (ES)** is now preferred by regulators (Basel III/IV uses ES at 97.5% instead of VaR at 99%) because it is coherent and captures the severity of tail losses, not just the threshold.

---

## Worked Example: End-to-End Historical VaR

**Setup:**
- Portfolio: $5,000,000 in a single equity
- Historical daily returns for 252 trading days available

**Step 1:** Calculate daily P&L for each historical day
```
Day P&L = Portfolio Value × Daily Return
```

**Step 2:** Sort 252 P&L values from worst to best

**Step 3:** For 95% confidence (5th percentile):
- 5% of 252 = 12.6, round to the 13th worst day
- Suppose the 13th worst P&L = -$112,000

**Result:** 1-day 95% VaR = **$112,000**

Interpretation: On 95% of trading days historically, the portfolio did not lose more than $112,000 in a single day.

---

## Summary

| Question | Answer |
|---|---|
| What does VaR measure? | Maximum expected loss at a given confidence level over a time horizon |
| What does VaR NOT tell you? | How large losses are when they exceed VaR |
| Best method for linear portfolios? | Parametric (fast, transparent) |
| Best method for options/non-linear? | Monte Carlo or Historical Simulation |
| What replaces VaR in modern regulation? | Expected Shortfall (CVaR) |

---

# Decentralized Exchanges (DEX) Explained

## What Is a Decentralized Exchange?

A **decentralized exchange (DEX)** is a peer-to-peer marketplace where users trade cryptocurrencies and tokens **directly with each other**, without relying on a central intermediary to hold funds, match orders, or settle trades.

All core operations — custody of assets, trade execution, and settlement — are handled by **smart contracts** running on a blockchain (most commonly Ethereum and EVM-compatible chains).

> **Centralized Exchange (CEX)**: You deposit funds into the exchange's custody. The exchange matches your order against another user's order in its internal database. Examples: Binance, Coinbase, Kraken.
>
> **Decentralized Exchange (DEX)**: Your funds stay in your own wallet at all times. Smart contracts execute trades on-chain. Examples: Uniswap, Curve, dYdX.

---

## How a DEX Works: The Core Mechanism

### Traditional Order Book (CEX Model)
```
Buyer places bid → Exchange matches with seller's ask → Exchange settles internally
```
The exchange holds both sides' funds during the process. Settlement is off-chain in the exchange's database.

### DEX Model
```
User signs a transaction from their wallet
    → Smart contract executes the trade on-chain
    → Tokens are atomically swapped between wallet addresses
    → Settlement is final on the blockchain
```
No intermediary ever touches the funds. The user retains self-custody throughout.

---

## Types of DEX Architecture

### 1. Automated Market Maker (AMM)

The dominant DEX model today. Instead of matching buyers with sellers, an AMM uses a **liquidity pool** — a smart contract holding reserves of two (or more) tokens — and a **pricing formula** to determine exchange rates algorithmically.

**How it works:**
- **Liquidity Providers (LPs)** deposit pairs of tokens into the pool (e.g., ETH and USDC)
- Traders swap against the pool rather than against other traders
- The price adjusts automatically after every trade based on the formula

**The Constant Product Formula (Uniswap v2):**
```
x × y = k
```
Where:
- `x` = reserve of Token A
- `y` = reserve of Token B
- `k` = constant (invariant)

When a trader buys Token A, they add Token B to the pool, reducing `x` and increasing `y`. The price of A rises as the pool is depleted of it.

**Example:**
```
Pool: 100 ETH × 200,000 USDC = k = 20,000,000

Trader buys 1 ETH by depositing USDC:
  New ETH reserve: 100 - 1 = 99 ETH
  New USDC reserve: 20,000,000 / 99 ≈ 202,020 USDC
  USDC paid: 202,020 - 200,000 = 2,020 USDC

Effective price: ~$2,020/ETH (vs. $2,000 before)
```

The price impact grows with the size of the trade relative to pool depth — this is called **slippage**.

**AMM Examples:** Uniswap, SushiSwap, Curve (optimized for stablecoins), Balancer (multi-asset pools)

---

### 2. Order Book DEX

Replicates the traditional limit order book model but on-chain or with an off-chain order book and on-chain settlement.

- **Fully on-chain order book**: Every order placement and cancellation is a blockchain transaction. Expensive in gas costs and slow. Rarely used.
- **Off-chain order book, on-chain settlement**: Orders are matched off-chain for efficiency; settlement (final token transfer) happens on-chain. More practical.

**Examples:** dYdX (perpetuals), Serum (Solana), 0x Protocol

---

### 3. DEX Aggregators

Do not hold liquidity themselves. Instead, they route trades across multiple DEXs to find the best price, splitting orders across pools to minimize slippage.

**Examples:** 1inch, Paraswap, Cowswap

---

## Liquidity Providers and Fees

LPs are essential to AMM-based DEXs. In exchange for supplying liquidity, they earn a share of trading fees.

**Mechanics:**
1. LP deposits tokens into a pool (e.g., $10,000 in ETH + $10,000 in USDC)
2. LP receives **LP tokens** representing their proportional share of the pool
3. Every trade pays a fee (e.g., 0.3% on Uniswap v2), which accrues to the pool
4. When the LP withdraws, they redeem LP tokens for their share of the pool plus accumulated fees

**Impermanent Loss (IL):**
The main risk for LPs. When the price ratio of the two pooled assets changes, the LP ends up with less value than if they had simply held the assets outside the pool.

```
Example:
  Deposit: 1 ETH ($2,000) + 2,000 USDC → $4,000 total

  ETH price doubles to $4,000:
    Pool rebalances: ~0.707 ETH + ~2,828 USDC → ~$5,657
    HODL value: 1 ETH + 2,000 USDC → $6,000

  Impermanent loss: $6,000 - $5,657 = $343 (5.7%)
```

IL is "impermanent" because it only locks in if the LP withdraws while prices are diverged. If prices return to the original ratio, IL disappears.

---

## Key DEX Concepts

### Slippage
The difference between the expected price and the executed price of a trade. Caused by:
- Pool depth (shallow pools have higher slippage)
- Trade size relative to pool reserves
- Price movement between when a transaction is submitted and when it is mined

Users set a **slippage tolerance** (e.g., 0.5%) to protect against worse-than-expected execution.

### Price Impact
The effect a trade has on the pool price. Larger trades cause larger price impact.

### MEV (Maximal Extractable Value)
Miners/validators and bots can reorder, insert, or censor transactions within a block to extract value. Common MEV strategies on DEXs:
- **Sandwich attacks**: A bot detects your pending trade, frontruns it (buying before you), then backruns it (selling after you), profiting from the price movement your trade caused.
- **Arbitrage**: Bots exploit price differences between DEXs instantly.

### Gas Fees
Every on-chain DEX transaction requires paying gas to the blockchain network. During periods of high congestion, gas costs can make small trades economically unviable.

---

## DEX vs. CEX Comparison

| Dimension | DEX | CEX |
|---|---|---|
| **Custody** | Self-custody (you hold your keys) | Custodial (exchange holds funds) |
| **KYC / AML** | Generally none | Required in most jurisdictions |
| **Trust Required** | Trust the smart contract code | Trust the exchange operator |
| **Counterparty Risk** | None (atomic settlement) | Exchange insolvency / hack risk |
| **Speed** | Limited by block times (seconds to minutes) | Near-instant (off-chain matching) |
| **Liquidity** | Generally lower | Generally higher for major pairs |
| **Asset Coverage** | Any token with a liquidity pool | Listed tokens only |
| **Censorship Resistance** | High — no central party can block trades | Low — accounts can be frozen |
| **Price** | Slippage on large trades; gas costs | Tighter spreads; lower/no gas |

---

## Risks of Using a DEX

### Smart Contract Risk
If the smart contract has a bug or vulnerability, funds in the pool can be drained. Hacks of DEX protocols have resulted in hundreds of millions of dollars in losses.

### Impermanent Loss
LPs face potential underperformance vs. simply holding assets, especially in volatile or one-sided markets.

### Front-running / MEV
Transactions sitting in the mempool are visible to bots before being confirmed.

### Low Liquidity / Slippage
Thin pools on less popular token pairs result in very poor execution prices for anything but tiny trades.

### Regulatory Uncertainty
The legal status of DEXs and their token offerings varies by jurisdiction and is actively evolving.

---

## Notable DEX Protocols

| Protocol | Chain | Type | Notable Feature |
|---|---|---|---|
| **Uniswap v3** | Ethereum + L2s | AMM | Concentrated liquidity — LPs set custom price ranges |
| **Curve Finance** | Ethereum + multichain | AMM | Optimized for stablecoin/pegged-asset swaps (StableSwap formula) |
| **Balancer** | Ethereum | AMM | Multi-asset pools with custom weightings |
| **dYdX** | StarkEx / Cosmos | Order Book | Perpetual futures with leverage |
| **GMX** | Arbitrum / Avalanche | Synthetic AMM | Perpetuals via oracle-based pricing, no order book |
| **1inch** | Multichain | Aggregator | Routes across DEXs for best execution |
| **Uniswap v2** | Ethereum | AMM | The foundational x×y=k constant product model |

---

## The Role of DEXs in DeFi

DEXs are the foundational primitive of **Decentralized Finance (DeFi)**. They enable:
- **Token launches**: New projects can create a liquidity pool without needing exchange approval
- **Composability**: Other DeFi protocols (lending, yield farming, derivatives) integrate DEX liquidity via smart contract calls
- **Permissionless access**: Anyone with a wallet and internet connection can trade any listed token globally, 24/7

---

## Summary

| Question | Answer |
|---|---|
| What is a DEX? | A peer-to-peer exchange where smart contracts hold funds and execute trades |
| How do AMMs price assets? | Algorithmic formula (e.g., x×y=k) using pooled liquidity |
| Who provides liquidity? | Anyone — LPs deposit token pairs and earn trading fees |
| Main LP risk? | Impermanent loss when pooled asset prices diverge |
| Main trader risks? | Slippage, MEV/front-running, smart contract bugs |
| DEX vs. CEX key difference? | Self-custody and permissionless access vs. speed and deeper liquidity |

---

# Open Interest on Decentralized Exchanges

## What Is Open Interest?

**Open Interest (OI)** is the total number (or notional value) of **outstanding derivative contracts** — futures or perpetuals — that have been opened but not yet closed, settled, or expired.

It measures the **total size of active positions** in a market at any given moment.

> Open Interest is **not** trading volume. Volume counts every trade executed. OI counts only positions that remain open.

---

## Open Interest on DEXs vs. Traditional Markets

In traditional finance, OI applies to futures and options traded on regulated exchanges (CME, CBOE). On DEXs, OI is primarily relevant to **perpetual futures** (perps) — the dominant derivative product in crypto — offered by protocols like dYdX, GMX, and Hyperliquid.

A **perpetual future** is a derivative contract that tracks an asset's price with no expiry date. Traders can go long or short with leverage, and positions are kept alive through a **funding rate** mechanism (longs pay shorts, or vice versa, depending on market skew).

---

## How Open Interest Works: Step by Step

```
State: OI = 0

1. Alice opens a long position: 10 BTC perpetual
   OI = 10 BTC

2. Bob opens a short position: 5 BTC perpetual
   OI = 15 BTC  (a new short position was opened, not offsetting Alice's long)

3. Alice closes half her long: -5 BTC
   OI = 10 BTC  (an existing position was closed)

4. Carol opens a long position: 3 BTC
   OI = 13 BTC
```

**Key rule:**
- Opening a new position (long or short) **increases** OI
- Closing an existing position **decreases** OI
- Two traders exchanging an existing position with each other leaves OI **unchanged**

---

## Long OI vs. Short OI

On a DEX perpetual platform, OI is often broken down by side:

| | Long OI | Short OI |
|---|---|---|
| **Definition** | Total notional value of open long positions | Total notional value of open short positions |
| **Interpretation** | Bullish exposure in the market | Bearish exposure in the market |

**Total OI = Long OI + Short OI**

The **OI imbalance** (long OI minus short OI) indicates whether the market is net long or net short. This directly drives the **funding rate**.

---

## Open Interest and the Funding Rate

The funding rate is the mechanism that keeps perpetual prices anchored to the spot price. It transfers payments between longs and shorts periodically (e.g., every 8 hours).

```
Long OI > Short OI (market net long):
  → Longs pay funding to shorts
  → Discourages more longs, incentivizes more shorts
  → Pulls perpetual price down toward spot

Short OI > Long OI (market net short):
  → Shorts pay funding to longs
  → Discourages more shorts, incentivizes more longs
  → Pushes perpetual price up toward spot
```

**Funding rate formula (simplified):**
```
Funding Rate = Clamp(Premium Index, -0.05%, +0.05%)

Premium Index = (Perpetual Mid Price - Spot Index Price) / Spot Index Price
```

High positive OI imbalance → high positive funding rate → holding longs becomes expensive.

---

## How DEX Protocols Handle OI: Two Models

### Model 1: Counterparty Pool (GMX, Gains Network style)

A shared liquidity pool (e.g., GLP on GMX) acts as the **counterparty to all traders**.

- When a trader opens a long, the pool is effectively short that exposure
- When a trader opens a short, the pool is effectively long
- The pool profits when traders lose and loses when traders win
- **OI limits** are enforced to cap the pool's net directional exposure and protect LPs

```
GMX OI cap example:
  Max long OI on BTC: $50,000,000
  Max short OI on BTC: $50,000,000
  If max is reached, new positions in that direction are rejected
```

**OI skew fee**: Some protocols charge a higher fee for opening positions that increase OI imbalance, and a lower fee (or rebate) for positions that reduce it.

### Model 2: Peer-to-Peer Order Book (dYdX style)

Longs are matched directly against shorts. OI represents the total matched open positions on both sides. The protocol does not take directional risk.

---

## What Open Interest Tells You

### 1. Market Conviction / Commitment
High OI means many traders have committed capital to directional bets. It signals conviction in the current trend.

### 2. Liquidity and Liquidation Risk
Large OI clusters around certain price levels create **liquidation cascades**: if price moves against a heavily crowded trade, forced liquidations push price further in that direction, triggering more liquidations.

```
Example:
  $500M of leveraged long positions clustered with liquidation prices at $58,000 BTC.
  If BTC drops to $58,000, those longs are force-closed (sold).
  Selling pressure drives price further down → more liquidations trigger.
  This is a "long squeeze" or "liquidation cascade."
```

### 3. Trend Confirmation vs. Divergence

| Price Action | OI | Interpretation |
|---|---|---|
| Price rising + OI rising | Bullish | New money entering longs; trend likely to continue |
| Price rising + OI falling | Weakening | Short covering (shorts closing), not new longs; trend may be fragile |
| Price falling + OI rising | Bearish | New money entering shorts; trend likely to continue |
| Price falling + OI falling | Weakening | Long liquidations/closures, not new shorts; potential bottom |

### 4. Funding Rate Pressure
Extreme OI skew in one direction causes funding rates to become punishing for the crowded side, incentivizing position closures and natural mean reversion.

---

## Open Interest vs. Volume: Key Differences

| | Open Interest | Volume |
|---|---|---|
| **What it counts** | Currently open positions | All trades executed in a period |
| **Time dimension** | Snapshot (point in time) | Flow (over a period) |
| **Resets** | No — accumulates and decreases as positions open/close | Yes — resets each day/hour |
| **What it signals** | Degree of market commitment and leverage | Degree of trading activity |
| **Example** | $2B OI means $2B of active bets are outstanding | $500M volume means $500M was traded today |

---

## Open Interest in DEX Risk Management

DEX protocols use OI actively as a risk management tool:

| Control | Purpose |
|---|---|
| **Max OI caps** | Prevent the liquidity pool from taking on catastrophic directional exposure |
| **OI-based fees** | Charge higher fees for positions that increase OI imbalance; reward positions that reduce it |
| **Funding rate** | Automatically tax the crowded side to rebalance OI |
| **Dynamic borrowing fees** | Some protocols (e.g., GMX v2) charge a utilization-based borrowing fee that rises as OI increases, regardless of direction |

---

## Worked Example: Reading OI on a DEX

Suppose a BTC-USDC perpetual market on a DEX shows:

```
BTC Price:    $65,000
Long OI:      $120,000,000   (1,846 BTC notional)
Short OI:     $80,000,000    (1,231 BTC notional)
Total OI:     $200,000,000
OI Imbalance: +$40,000,000 net long

Funding Rate: +0.01% per 8 hours
  → Longs pay 0.01% every 8 hours to shorts
  → Annualized: ~10.95% per year cost to hold a long
```

**What this tells you:**
- The market is heavily skewed long — traders are bullish
- Longs are paying a significant carry cost — the trade is crowded
- If price drops, a large pool of long positions could be liquidated, amplifying the move

---

## Summary

| Question | Answer |
|---|---|
| What is Open Interest? | Total notional value of all open (not yet closed) derivative positions |
| Does OI include both longs and shorts? | Yes — Long OI + Short OI = Total OI |
| How does OI differ from volume? | OI is a stock (outstanding positions); volume is a flow (trades executed in a period) |
| What drives the funding rate? | OI imbalance between longs and shorts |
| How do DEX protocols use OI? | OI caps, OI-based fees, dynamic borrowing rates to manage pool risk |
| What is a liquidation cascade? | Clustered OI liquidations triggering a chain reaction of forced position closures |

---

# Drift 协议技术事故报告 — 2022/05/11（中文翻译）

> 原文来源：[Drift Protocol Technical Incident Report — 2022/05/11](https://driftprotocol.medium.com/drift-protocol-technical-incident-report-2022-05-11-eedea078b6d4)

---

## 背景

Drift 协议是一个开源的动态自动做市商（DAMM）与去中心化订单簿（DLOB）永续合约交易所，构建于 Solana 区块链之上，为主流加密资产提供杠杆永续合约交易。

2022 年 5 月 11 日，由于用户资金提取速度急剧加快，Drift 协议被迫暂停运营。在用户资金被完全耗尽之前，Drift 成功暂停了协议。这次暂停对于防止协议资金进一步流失至关重要。

本事后分析报告记录了事件的时间线，解释了导致资金快速提取的根本原因，展示了攻击者可能如何利用这些漏洞，描述了这些问题如何迫使交易所暂停运营，并提出了立即修复方案以及 Drift v2 上线前的进一步改进方向。

Drift 的核心开发团队目前正在全力推进大幅改进的 Drift v2。v2 修复了 v1 中存在的技术问题，并在 v1 基础上构建一个更加健壮的杠杆交易系统，配备完善的风险机制与安全防护，同时充分考虑社区反馈。

Drift v1 现已正式落幕，所有仓位已完成结算。[总计结算抵押品金额为 1,950 万美元](https://driftprotocol.medium.com/settlement-update-25-may-2022-122171fe69a9)（其中 495 万美元来自剩余保险基金，1,455 万美元来自融资），已全额偿还给受影响的交易者。Drift v2 预计于 7 月推出，改进内容详见第 2 节。

---

## 1. 事件详情

本节提供事件时间线、问题详细分析，以及带有代码的完整概念验证（PoC）以说明漏洞细节。

### a. 事件时间线

- **5 月 11 日 UTC 0:00 至 12:00 — 发现提款量骤增**
  在约 12 小时内，系统净提款 872 万美元，协议总锁仓量从 [1,366 万美元降至 494 万美元](https://defillama.com/protocol/drift)。核心开发人员注意到提款速率异常并开始调查。

- **[5 月 11 日 UTC 13:15](https://explorer.solana.com/tx/3fj99yUrZKQWPnUb7eQH3RbfuN8U5UuYwHmTVdrt4qDvxTN4vsAPvSYrHsmsjgPxcbK5PhhS8JRtT2XLKqNxdzSe) — 第一次暂停，降低市场风险**
  由于 LUNA 价格剧烈波动，交易被暂停以便核心开发人员能够降低风险。通过提高初始保证金要求、基础市场价差和交易费用来降低风险。

- **[5 月 11 日 UTC 14:39](https://explorer.solana.com/tx/3HwLjpnSAAMR2ovQ3Tczt4nAfZMYSdFuZ9tXGx1s93JTXWjmgQVExbCyvgu1KnYZiBjhjfyfCBdNGjSUKjQy8Hde) — 交易所重新开放，降低 k 值储备**
  降低风险后，核心开发人员认为风险已足够低，交易所可以重新运营。重新开放后，核心开发人员继续调查根本问题，并[全面降低了 LUNA、SOL、AVAX、BTC 和 ETH 的 k 值储备](https://flatgithub.com/0xbigz/drift-flat-data?filename=data%2FextendedCurve_history.csv)。降低 k 值（储备）有助于减缓多空失衡的增长。

- **[5 月 11 日 UTC 19:29](https://explorer.solana.com/tx/61N6ETBTzbBBqnsybaG41oeNjkiD5z2EDn3CrhpmpdDJrjR1wYYscF8Rg435Paw9EDS4MXmkJSDg1y3SR3PnZuoz) — 第二次暂停，调查提款漏洞**
  核心开发人员发现了已实现 PNL 和保险基金提款漏洞是协议大量提款的根源。由于协议没有提款熔断机制或社会损失机制，核心开发人员被迫暂停交易所，以便将剩余资金分配给所有用户。

- **[5 月 16 日](https://driftprotocol.medium.com/drift-settlement-plan-2d1af1c1525) — 仓位结算方法论公布**
  交易所暂停后，[需要对仓位进行结算](https://driftprotocol.medium.com/drift-settlement-plan-2d1af1c1525)。核心开发人员与社区共同制定了仓位及已实现抵押品的结算方法。

- **5 月 18 日 — "Drift Drain" 漏洞利用 PoC 代码发布 [[链接]](https://github.com/drift-labs/protocol-v1/tree/crispheaney/drift-drain)**
  此代码展示了协议漏洞如何允许攻击者在单笔交易中耗尽整个资金库。

- **[5 月 20 日](https://app.drift.trade/redeem) — 赎回界面上线**

- **[5 月 21 日](https://github.com/drift-labs/protocol-v1/commits/crispheaney/patch-withdraw-bug) — 提款漏洞的 PoC 工作补丁推送**

- **[5 月 25 日](https://driftprotocol.medium.com/settlement-update-25-may-2022-122171fe69a9) — 结算完成**
  Drift 获得融资，全额覆盖了对交易者 1,450 万美元的未偿缺口。

- **5 月 26 日 — 技术事故报告发布**

- **5 月 27 日 — 赎回上线，全额未偿结算缺口可领取**

---

### b. 根本原因

此次事件存在两个层面的问题——一是表层的未受检查的提款和 PNL 核算漏洞，二是更深层的杠杆交易设计问题。

根据社区反馈，本文使用"问题"一词而非"漏洞"或"设计缺陷"。Drift 核心开发人员承认 v1 实现存在挑战，并渴望在 Drift v2 中解决这些问题。

**i. 未受检查的提款**

从表层来看，问题源于系统对已实现抵押品的错误定性，允许任何盈利在没有任何检查、限制或资金标记的情况下被提取，且没有内置的社会损失和追回机制。

**ii. 未受检查的杠杆导致杠杆损失**

杠杆损失的根本问题存在于所有杠杆市场中，无论是 vAMM 还是订单簿模式。当一方（多头或空头）的杠杆过度扩张时，价格的大幅波动会导致系统中已实现盈利和已实现亏损之间的失衡。

如果系统中未实现亏损金额大于已实现收益，则系统存在未实现杠杆损失。vAMM 中的多空失衡会放大未受检查的杠杆问题。

---

### c. 问题详情

vAMM 允许用户之间进行异步交易。异步意味着一个用户在其他用户进入仓位之前就可以开立多头或空头仓位（而同步交易要求多头和空头仓位同时开立）。

异步交易有两个重要特性：
- PNL 根据用户开仓和平仓的顺序分配给用户，vAMM 无法保证仓位开仓/平仓的顺序，也无法保证 PNL 的实现顺序；
- 多头和空头的名义价值可能不同（即多空失衡）。

三个问题共同作用，在 2022 年 5 月 11 日 LUNA 的急剧下跌推动下，导致用户资金被快速提取，最终迫使协议紧急暂停：

1. 用户能够在等量负 PNL 未被实现的情况下提取正 PNL；
2. 用户能够立即从保险基金中提款，没有任何限制或保护措施；
3. 关于市场多空失衡的杠杆未受检查。

交易所暂停时，可提取抵押品金额为 1,011 万美元（缺口 518 万美元）。

---

### d. 漏洞利用概念验证

核心开发人员编写了一个[代码模拟](https://github.com/drift-labs/protocol-v1/blob/crispheaney/drift-drain/tests/driftDrain10M.ts)来说明提款漏洞的严重性，展示攻击者如何在单笔交易中提取资金库中的所有用户资金。

**PoC 场景：**

假设有十名用户，每人向协议存入 100 万美元（共计 1,000 万美元存款）。在此示例中，攻击者存入 175 万美元，利用漏洞，从系统中提取 1,175 万美元。

SOL 市场以 53 美元初始化，AMM 储备与主网 SOL AMM 规模相同。攻击需要预言机无效（即数据过期或置信度低）才能绕过预言机-标记价格偏差的防护措施。

1. 攻击者创建两个 Drift 用户账户，每个账户存入 87.5 万美元（使总存款达到 1,175 万美元）。
2. 账户 1 以 20 倍杠杆开立 SOL-PERP 多头仓位，将价格推至 146 美元。以 87.5 万美元抵押品，这是一个 1,750 万美元名义价值的多头仓位。
3. 账户 2 开立同等规模的 1,750 万美元名义多头仓位，将合约标记价格推至 285.45 美元。
4. 账户 1 平仓，实现 1,200 万美元盈利，然后提取 1,175 万美元（所有用户资金）。

此 PoC 展示了攻击者如何通过操纵系统标记价格并利用已实现 PNL 核算漏洞，在单笔交易中提取所有用户资金。

账户 2 遭受 1,200 万美元亏损，但其抵押品仅有约 86.4 万美元。当账户 1 提取 1,200 万美元收益时，资金从无辜用户的抵押品中提取，耗尽了保险基金。

---

### e. 事件后果

该事件发生后，保险基金中没有费用，协议的博弈论机制崩溃。最可能的结果是用户竞相退出仓位并提取抵押品。核心开发人员发现上述问题后，暂停了交易所，以便将剩余抵押品社会化分配给所有用户。

交易所暂停时，用户集体未实现 PNL 为 1,490 万美元，但在终态下，已实现 PNL 为 -1,070 万美元（偏差为 2,560 万美元）。在 LUNA 市场中，未实现 PNL 为 440 万美元，终态下的已实现 PNL 为 -760 万美元（偏差为 1,200 万美元）。

所有用户以终态结算后，用户已实现抵押品余额为 575 万美元。协议中剩余 494 万美元，这意味着终态下系统存在 81 万美元的杠杆损失（缺口）。

Drift 承诺按照[此处](https://www.notion.so/Drift-Settlement-and-Claim-Process-c55ff831fb5c44cc9d2541c315c55132)所述方法将已实现抵押品余额结算至 2,089 万美元。排除团队和投资者账户后，用户可领取的总结算抵押品为 1,949 万美元。协议中仅剩 494 万美元，结算抵押品缺口为 1,450 万美元。

---

## 2. 解决方案

Drift v1 现已落幕，所有仓位已完成结算。Drift 获得了 1,450 万美元融资，以覆盖对用户的全额结算缺口，可于 2022 年 5 月 27 日起兑换。

### a. 立即修复

**防止已实现抵押品缺口：**
一种简单的解决方案是，在市场失衡期间，只有在同一市场出现等额已实现亏损时，才允许用户提取已实现收益。一个更实用的解决方案是增加一个辅助资金池，为希望在等额亏损发生前提取正已实现 PNL 的交易者提供资金，该资金池通过早期提款者支付的溢价以及协议费用获得收益。

**阻止从市场费用池保险基金立即提款：**
核心开发人员已增加了阻止用户立即从为市场费用池预留的保险基金中提款的机制。每个市场费用池的资金库也可以隔离到各自的代币账户中，以进一步隔离风险并防止来自波动性市场的溢出影响。

### b. 设计改进

Drift v2 的未来设计改进必须解决协议的多空失衡、未受检查的杠杆以及多空杠杆失衡问题。具体包括：

**1. 被动做市商和流动性提供者系统**
通过增加虚拟流动性的抵押化程度，即使在失衡发生之前，也能在多种市场场景下降低协议内的隐性杠杆。

**2. 公式化市场参数**
- **公式化重新锚定 / k 值调整**：从协议上线第一天起内置公式化参数；
- **动态费用/价差**：动态费用有助于从长远来看减少多空失衡；
- **动态杠杆**：根据任何单个市场的健康状况（当前杠杆、当前标记-终端价格偏差或多空杠杆失衡）动态地向上或向下调整杠杆。

**3. 高级价格曲线**
Drift v1 使用简单的常数乘积曲线（xy = k）来描述流动性。这在高波动性价格行情中无法防止 vAMM 报价不准确。更高级的曲线（例如高斯函数）加上买卖价差，将能够缓冲对 vAMM 的影响。

**4. 高级协议熔断机制**
- 能够在不暂停交易的情况下暂停提款；
- 关闭和自动结算单个市场的机制；
- 在风险指标超过设定阈值的波动性水平下的涨跌停熔断机制（价格区间）。

**5. 内置社会损失机制（保险基金耗尽时）**
社会损失的几种设计选择，各有利弊：
- 将损失平均分摊给系统中所有用户；
- 将损失平均分摊给市场中所有用户；
- 将损失平均分摊给市场中的盈利者；
- 自动去杠杆机制（ADL），根据杠杆比例将损失分摊给市场中的盈利者。

---

## 结语

Drift 衷心感谢社区持续不断的反馈和贡献，Drift 将继续致力于打造一个可靠、安全、健壮的衍生品 DEX。尽管此次事件充满波折，但其中蕴含的关键经验和教训将极大地改善协议未来的迭代版本。Drift 对虚拟流动性价值的核心论断依然坚定。Drift 将全力推进所概述的改进，并力争在未来两个月内尽快推出 v2。

---

## 常见问题解答

**用户资金是如何被耗尽的？**
用户在没有等额亏损抵消的情况下提取了大量正 PNL，在系统中留下了大量未实现的杠杆损失。Drift 提供了概念验证，展示恶意攻击者如何利用该问题在单笔交易中耗尽资金。

**为什么交易被暂停？**
第一次暂停是为了让核心开发人员采取紧急措施降低风险，通过增加市场价差和保证金要求。第二次暂停是为了防止用户资金进一步流失，并保留剩余保险基金以便社会化分配给用户。

**为什么漏洞没有立即修复以继续交易？**
当问题和解决方案完全明确时，市场条件的波动性、暂停持续时间、大量资金缺失以及系统中的杠杆损失，最终导致 v1 落幕，分阶段结算仓位，并承诺构建 v2。

**为什么结算价格相较于标记价格有折扣？**
由于 AMM 流动性的顺序性特征，AMM 中的市场结算通常会在[结算价格](https://www.notion.so/Drift-Settlement-and-Claim-Process-c55ff831fb5c44cc9d2541c315c55132)上有所折扣。流动性有限，如上文本地 PNL 与终端 PNL 的讨论所示。Drift 正在尽力通过第二阶段补贴用户，使其能够以高于平均 vAMM 结算价格的价格结算，以在突然暂停的情况下维护社区信誉。

---

## 附录：术语定义

1. **保险基金（Insurance Fund）** — 来自协议费用的资金，包括清算罚款。这些资金被添加到"每个市场"的保险基金（或费用池），专门用于特定操作（失衡资金费、重新锚定、k 值调整）。
2. **本地状态 PNL（Local State PnL）** — 所有用户在当前状态下潜在支付的总和，每个用户的本地滑点由 Drift SDK 退出价格计算。
3. **终端状态 PNL（Terminal State PnL）** — 所有用户在最终状态下的总支付，其中所有仓位以零未平仓量平仓。
4. **本地价格（Local Price）** — 每个用户的本地退出价格，用于标记用户的总抵押品。
5. **终端价格（Terminal Price）** — 所有用户仓位以零未平仓量平仓时 vAMM 报出的价格。

---

# OI Caps: How and When to Apply Them

## What Is an OI Cap?

An **OI cap** (Open Interest cap) is a hard or soft limit on the maximum total notional value of open positions — long, short, or both — that a DEX derivatives protocol will allow at any given time.

When the cap is reached, the protocol **rejects new position opens** (or increases) in the capped direction until existing positions are closed and OI falls back below the limit.

---

## Why OI Caps Exist

On AMM-style DEX perpetual protocols (e.g., GMX, Gains Network, Hyperliquid), a shared liquidity pool acts as the **counterparty to all traders**. This creates direct financial risk for the pool:

```
Trader opens a $10M long on BTC:
  → Pool is implicitly short $10M BTC
  → If BTC rises 10%, pool pays the trader $1M in profit
  → Pool LPs absorb this loss
```

Without limits, a coordinated attack or highly one-sided market could cause losses that exceed the pool's collateral — making the protocol **insolvent**.

OI caps are the primary mechanism to bound this risk.

---

## The Core Risk That Caps Protect Against

### Pool Insolvency / Skew Risk

The pool's net exposure is:

```
Net Pool Exposure = Long OI - Short OI
```

If Long OI >> Short OI, the pool is net short and profits if price falls, but suffers if price rises. The **maximum loss the pool can absorb** is constrained by its total assets under management (AUM).

```
Maximum tolerable net exposure ≈ f × Pool AUM

Where f is a risk fraction (e.g., 0.20 = 20% of pool can be lost before insolvency)

Max Net OI = f × Pool AUM
```

**Example:**
```
Pool AUM:           $50,000,000
Risk fraction (f):  20%
Max Net OI:         $10,000,000

If Long OI = $30M and Short OI = $25M:
  Net exposure = $5M  ✓ (within limit)

If Long OI = $40M and Short OI = $25M:
  Net exposure = $15M ✗ (exceeds $10M cap — block new longs)
```

---

## Types of OI Caps

### 1. Absolute Per-Side Cap
A hard limit on total long OI and total short OI independently.

```
Max Long OI:  $50M per market
Max Short OI: $50M per market
```
Simple to implement. Does not directly limit net exposure — both sides can be at $50M simultaneously (balanced) with no pool risk, but also allows $50M net if one side is zero.

### 2. Net OI Cap (Skew Cap)
Limits the **difference** between long and short OI rather than each side in isolation.

```
Max |Long OI - Short OI| = $10M
```
More precisely targets pool solvency risk. Allows arbitrarily large balanced OI (equal longs and shorts) but blocks directional skew beyond the threshold.

### 3. Total OI Cap
Limits Long OI + Short OI regardless of balance.

```
Max Total OI: $100M per market
```
Controls overall market size and operational risk (oracle manipulation, liquidity depth), not just directional exposure.

### 4. Per-Asset / Per-Market Cap
Separate caps for each underlying asset, scaled to the asset's liquidity and the pool's depth in that asset.

```
BTC-USDC perp:  Max Long OI = $60M,  Max Short OI = $60M
ETH-USDC perp:  Max Long OI = $40M,  Max Short OI = $40M
SOL-USDC perp:  Max Long OI = $10M,  Max Short OI = $10M
```
More illiquid assets receive lower caps because oracle manipulation is cheaper and liquidations are harder to execute cleanly.

### 5. Dynamic OI Caps
Caps that adjust automatically based on current pool conditions:

```
Max Long OI = min(Static Cap, α × Pool AUM)
```

As pool AUM grows (more LP deposits), caps expand. If pool AUM shrinks (losses, withdrawals), caps tighten automatically. This maintains a constant risk ratio without manual governance intervention.

---

## When to Apply OI Caps: Decision Framework

### Trigger 1: Pool AUM Threshold

Apply caps proportional to the pool's collateral base. A common formula:

```
Max Per-Side OI (per market) = Pool AUM × utilization_limit
                                             (e.g., 0.5 to 1.0×)

Max Net OI (per market) = Pool AUM × skew_limit
                                      (e.g., 0.15 to 0.25×)
```

**When to tighten:** Pool AUM falls (withdrawals, losses) → reduce caps to maintain the same risk ratio.
**When to loosen:** Pool AUM rises (new LP deposits, fee accrual) → can safely increase caps.

### Trigger 2: Asset Liquidity and Oracle Risk

Tighter caps are warranted for assets where:
- **Spot market liquidity is thin** — easier for whales to manipulate spot price and trigger oracle-reported price changes that drain the pool
- **Oracle update latency is high** — stale prices create arbitrage windows against the pool
- **Bid-ask spreads are wide** — liquidations may not execute at fair value

```
Liquidity Score = Spot 24h Volume / Proposed Max OI

Rule of thumb: Liquidity Score should be ≥ 5–10×
  (spot volume should be 5–10× the maximum open interest)
```

If a market's spot 24h volume is $100M, capping OI at $10–20M is prudent.

### Trigger 3: Concentration / Single-Position Risk

Even if total OI is within limits, a single position that represents a large fraction of total OI creates risk:

```
Max Single Position Size = Min(per-trader cap, % of Max OI)
  (e.g., no single trader can hold more than 10% of market OI)
```

Apply per-trader position limits alongside pool-level OI caps.

### Trigger 4: Volatility Regime

In periods of elevated volatility, the risk of large rapid losses (before liquidations can execute) increases. Protocols should tighten OI caps during high-volatility regimes:

```
Volatility-adjusted cap = Base Cap × (1 - vol_multiplier)

vol_multiplier = clamp((current_IV - baseline_IV) / baseline_IV, 0, 0.5)
```

**Example:**
```
Base Cap:     $50M
Baseline IV:  50%
Current IV:   90%  → vol_multiplier = clamp(0.8, 0, 0.5) = 0.5
Adjusted Cap: $50M × (1 - 0.5) = $25M
```

### Trigger 5: Funding Rate Extremes

If the funding rate hits extreme levels (e.g., >0.1% per 8 hours) and OI continues to grow in the crowded direction, this signals market dislocation. The cap should activate to prevent further one-sided buildup even if the absolute dollar threshold has not yet been reached.

---

## Implementation Patterns

### Hard Cap (Binary)
```
if new_position_size + current_long_OI > MAX_LONG_OI:
    revert("Long OI cap reached")
```
Simple, predictable. Creates a cliff — the last dollar before the cap fills the space; the next dollar is completely blocked.

### Soft Cap (Fee-Based)
Rather than blocking positions outright, apply an exponentially increasing fee as OI approaches the cap:

```
skew_fee_bps = base_fee × exp(k × (current_OI / max_OI))
```

This creates market pressure to reduce OI before the hard limit is hit, without a sudden cutoff. Protocols like GMX v2 and Hyperliquid use variants of this approach.

### Gradual Tightening
When conditions change (AUM drops, volatility spikes), do not immediately slash caps to the new level. Phase them in to avoid forcing mass liquidations of positions opened under the old cap:

```
Step 1: Stop accepting new positions that would increase OI above new cap
Step 2: Allow existing positions to run; do not force-close them
Step 3: Cap naturally decreases as traders close positions organically
```

---

## OI Cap Calibration: Worked Example

**Inputs:**
```
Protocol: BTC-USDC perpetual DEX
Pool AUM:            $80,000,000
BTC spot 24h volume: $2,000,000,000  (exchange-aggregated)
BTC 30-day realized vol: 55% annualized → ~3.5% daily
Desired max single-day pool loss: 15% of AUM = $12,000,000
```

**Step 1: Compute max net OI from loss tolerance**
```
Worst-case 1-day price move (3σ): 3 × 3.5% = 10.5%
Max Net OI = Max Loss / Max Price Move = $12M / 10.5% ≈ $114M
```

**Step 2: Liquidity sanity check**
```
Liquidity Score = $2B / $114M ≈ 17.5×  ✓  (well above 5–10× threshold)
```

**Step 3: Set per-side caps**
```
Allow symmetric OI up to a balanced total of ~$200M:
  Max Long OI:  $150M
  Max Short OI: $150M
  Max Net OI:   $114M  (hard skew cap)
```

**Step 4: Dynamic scaling**
```
If Pool AUM drops to $40M:
  New Max Loss: 15% × $40M = $6M
  New Max Net OI: $6M / 10.5% ≈ $57M
  Caps auto-tighten accordingly
```

---

## OI Caps Across Major DEX Protocols

| Protocol | Cap Mechanism | Notable Approach |
|---|---|---|
| **GMX v2** | Per-market long/short caps; dynamic with pool depth | OI-based borrowing fee increases utilization cost continuously |
| **Hyperliquid** | Per-market open interest limits set by governance | Caps adjusted based on oracle quality and liquidity |
| **Gains Network (gTrade)** | Max OI per asset as % of DAI vault collateral | Caps tighter for exotic/illiquid assets |
| **Synthetix Perps** | Skew limit (max |long - short| per market) | Funding rate velocity mechanism discourages skew build-up |
| **dYdX** | No pool counterparty — peer-to-peer matching | OI caps less critical; position limits enforced per trader |

---

## Summary

| Question | Answer |
|---|---|
| Why do OI caps exist? | To prevent the LP pool from absorbing losses that exceed its collateral |
| What does a cap limit? | New position opens once total OI (or net OI) reaches the threshold |
| What determines the cap level? | Pool AUM, asset liquidity, oracle risk, volatility regime |
| Hard cap vs. soft cap? | Hard cap blocks positions; soft cap applies escalating fees as OI approaches the limit |
| When should caps tighten? | Pool AUM falls, volatility rises, spot liquidity thins, or funding rate hits extremes |
| When should caps loosen? | Pool AUM grows, volatility normalizes, liquidity deepens |
| Best practice for implementation? | Dynamic caps (auto-scale with AUM) + skew cap + soft fee curve before hard block |
