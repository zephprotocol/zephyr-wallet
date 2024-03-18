import { AnyAction } from "redux";
import { GET_BLOCK_HEADER_EXCHANGE_RATE_SUCCEED } from "shared/actions/types";
import { DesktopAppState } from "../../platforms/desktop/reducers";
import { Ticker } from "shared/reducers/types";
import bigInt from "big-integer";
import { WebAppState } from "platforms/web/reducers";

export interface ConversionRate {
  fromTicker: Ticker;
  toTicker: Ticker;
  xRate: number;
  xRateRevert: number;
}

export interface XRates {
  height: number;
  timestamp: number;
  rates: ConversionRate[];
}

type Rates = Record<Ticker, bigInt.BigInteger>;
interface BlockHeader {
  height: number;
  signature: string;
  spot: bigInt.BigInteger;
  moving_average: bigInt.BigInteger;
  stable: bigInt.BigInteger;
  stable_ma: bigInt.BigInteger;
  reserve: bigInt.BigInteger;
  reserve_ma: bigInt.BigInteger;
  timestamp: bigInt.BigInteger;
}

export type BlockHeaderRate = BlockHeader & Rates;

const INITIAL_STATE: BlockHeaderRate[] = [];

export const blockHeaderExchangeRate = (
  state: BlockHeaderRate[] = INITIAL_STATE,
  action: AnyAction,
): BlockHeaderRate[] => {
  switch (action.type) {
    case GET_BLOCK_HEADER_EXCHANGE_RATE_SUCCEED:
      return [...state, action.payload];
    default:
      return state;
  }
};

export const selectXRate = (
  blockHeaderExchangeRate: BlockHeaderRate[],
  fromTicker: Ticker | null,
  toTicker: Ticker | null,
  useSpot: boolean = false,
): number => {
  if (blockHeaderExchangeRate.length === 0) {
    return 0;
  }

  if (fromTicker === toTicker) {
    return 1;
  }

  if (fromTicker === null || toTicker === null) {
    return 0;
  }

  // one of the tickers must be ZEPH
  if (fromTicker !== Ticker.ZEPH && toTicker !== Ticker.ZEPH) {
    return 0;
  }

  const latestBlockerHeader: BlockHeaderRate = blockHeaderExchangeRate[blockHeaderExchangeRate.length - 1];

  if (useSpot && fromTicker === Ticker.ZEPH && toTicker === Ticker.ZEPHUSD) {
    let spot_rate = latestBlockerHeader["spot"].toJSNumber() / Math.pow(10, 12);
    return spot_rate;
  }

  let stable_rate = latestBlockerHeader["stable"].toJSNumber() / Math.pow(10, 12);
  let stable_ma_rate = latestBlockerHeader["stable_ma"].toJSNumber() / Math.pow(10, 12);

  let reserve_rate = latestBlockerHeader["reserve"].toJSNumber() / Math.pow(10, 12);
  let reserve_ma_rate = latestBlockerHeader["reserve_ma"].toJSNumber() / Math.pow(10, 12);

  if (fromTicker === Ticker.ZEPH && toTicker === Ticker.ZEPHUSD) {
    return Math.max(stable_rate, stable_ma_rate);
  } else if (fromTicker === Ticker.ZEPHUSD && toTicker === Ticker.ZEPH) {
    return Math.min(stable_rate, stable_ma_rate);
  } else if (fromTicker === Ticker.ZEPH && toTicker === Ticker.ZEPHRSV) {
    return Math.max(reserve_rate, reserve_ma_rate);
  } else if (fromTicker === Ticker.ZEPHRSV && toTicker === Ticker.ZEPH) {
    return Math.min(reserve_rate, reserve_ma_rate);
  }

  return 0;
};

export const selectLastExchangeRates = (state: DesktopAppState | WebAppState): BlockHeaderRate | null => {
  const latestBlockerHeader: BlockHeaderRate = state.blockHeaderExchangeRate[state.blockHeaderExchangeRate.length - 1];
  return latestBlockerHeader;
};

export const hasLatestXRate = (state: DesktopAppState) => {
  const nodeHeight: number = state.chain.nodeHeight;
  return state.blockHeaderExchangeRate.some((xRate) => xRate.height === nodeHeight - 1);
};

export const priceDelta = (state: DesktopAppState): number | null => {
  if (state.blockHeaderExchangeRate.length === 0) {
    return null;
  }

  const latestBlockerHeader = state.blockHeaderExchangeRate[state.blockHeaderExchangeRate.length - 1];

  return latestBlockerHeader.stable.subtract(latestBlockerHeader.stable_ma).abs().toJSNumber();
};
