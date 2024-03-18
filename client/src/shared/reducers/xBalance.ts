import { AnyAction } from "redux";
import { DesktopAppState } from "platforms/desktop/reducers";
import { INITAL_FETCHING_STATE, Ticker, XFetching } from "./types";
import { BlockHeaderRate, selectXRate } from "shared/reducers/blockHeaderExchangeRates";
import bigInt from "big-integer";
import { convertBalanceToMoney } from "utility/utility";
import { WebAppState } from "platforms/web/reducers";
import { GET_BALANCES_FAILED, GET_BALANCES_FETCHING, GET_BALANCES_SUCCEED } from "shared/actions/types";

export const NO_BALANCE = bigInt.zero;

export interface Balance {
  [key: string]: bigInt.BigInteger;
  balance: bigInt.BigInteger;
  unlockedBalance: bigInt.BigInteger;
  lockedBalance: bigInt.BigInteger;
}

export interface ViewBalance {
  [key: string]: number;
  balance: number;
  unlockedBalance: number;
  lockedBalance: number;
}

export type XBalance = Partial<{ [key in Ticker]: Balance }>;
export type XBalances = { [key in Ticker]: Balance };
export type XViewBalance = Partial<{ [key in Ticker]: ViewBalance }>;
export type XViewBalances = { [key in Ticker]: ViewBalance };

const INITIAL_BALANCE: Balance = {
  balance: NO_BALANCE,
  unlockedBalance: NO_BALANCE,
  lockedBalance: NO_BALANCE,
};

const INITIAL_VIEW_BALANCE: ViewBalance = {
  balance: -1,
  unlockedBalance: -1,
  lockedBalance: -1,
};

let tempObj: any = {};
Object.values(Ticker).forEach((ticker) => (tempObj[ticker] = { ...INITIAL_BALANCE }));
const INITIAL_STATE: XBalances = tempObj;

export function fetching(state = INITAL_FETCHING_STATE, action: AnyAction): XFetching {
  switch (action.type) {
    case GET_BALANCES_FETCHING:
      return { ...state };
    case GET_BALANCES_FAILED:
      return { ...state };
    default:
      return state;
  }
}

export function xBalance(state = INITIAL_STATE, action: { type: string; payload: XBalance }): XBalances {
  switch (action.type) {
    case GET_BALANCES_SUCCEED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const selectBalances = (state: DesktopAppState | WebAppState): XViewBalance => {
  return {
    [Ticker.ZEPH]: {
      balance: convertBalanceToMoney(state.xBalance[Ticker.ZEPH].balance),
      unlockedBalance: convertBalanceToMoney(state.xBalance[Ticker.ZEPH].unlockedBalance),
      lockedBalance: convertBalanceToMoney(state.xBalance[Ticker.ZEPH].lockedBalance),
    },
  };
};

export const selectPortfolioInUSD = (state: DesktopAppState | WebAppState): XViewBalance => {
  const zephPortfolio: ViewBalance = { balance: 0, unlockedBalance: 0, lockedBalance: 0 };
  const usdPortfolio: ViewBalance = { balance: 0, unlockedBalance: 0, lockedBalance: 0 };
  const xBalance = state.xBalance;

  // iterate over all balance assets
  Object.entries(xBalance).forEach(([ticker, balance]: [string, Balance]) => {
    const fromTicker: Ticker = ticker as Ticker;
    let spotRate = selectXRate(state.blockHeaderExchangeRate, Ticker.ZEPH, Ticker.ZEPHUSD, true);
    let xRate = spotRate;

    if (fromTicker === Ticker.ZEPHRSV) {
      xRate = selectXRate(state.blockHeaderExchangeRate, Ticker.ZEPHRSV, Ticker.ZEPH) * spotRate;
    } else if (fromTicker === Ticker.ZEPHUSD) {
      xRate = 1;
    }

    //iterate different balance types
    Object.entries(balance).forEach(([balanceType, amount]: [string, bigInt.BigInteger]) => {
      const usdAmount = xRate * amount.toJSNumber();
      usdPortfolio[balanceType] += convertBalanceToMoney(usdAmount);

      if (fromTicker === Ticker.ZEPH) {
        zephPortfolio[balanceType] += convertBalanceToMoney(amount.toJSNumber());
      }
    });
  });

  return { [Ticker.ZEPHUSD]: usdPortfolio, [Ticker.ZEPH]: zephPortfolio };
};

export const selectTotalBalances = (state: DesktopAppState | WebAppState): XViewBalance => {
  const defaultBalance = {
    [Ticker.ZEPH]: { ...INITIAL_VIEW_BALANCE },
    [Ticker.ZEPHUSD]: { ...INITIAL_VIEW_BALANCE },
    [Ticker.ZEPHRSV]: { ...INITIAL_VIEW_BALANCE },
  };

  const xBalance = state.xBalance;

  const zephToUSDRate = selectXRate(state.blockHeaderExchangeRate, Ticker.ZEPH, Ticker.ZEPHUSD, true);

  const usdToZEPHRate = selectXRate(state.blockHeaderExchangeRate, Ticker.ZEPHUSD, Ticker.ZEPH);

  const zephToRSVRate = selectXRate(state.blockHeaderExchangeRate, Ticker.ZEPH, Ticker.ZEPHRSV);

  if (zephToUSDRate === null || usdToZEPHRate === null || zephToRSVRate === null) {
    return defaultBalance;
  }

  const zephUSDTotalBalance: ViewBalance = Object.entries(xBalance[Ticker.ZEPHUSD]).reduce(
    (result: any, [balanceType, balance]) => {
      const total = xBalance.ZEPH[balanceType].toJSNumber() * zephToUSDRate + balance.toJSNumber();
      result[balanceType] = convertBalanceToMoney(total);
      return result;
    },
    {},
  );

  const zephTotalBalance: ViewBalance = Object.entries(xBalance.ZEPH).reduce((result: any, [balanceType, balance]) => {
    const total = xBalance[Ticker.ZEPHUSD][balanceType].toJSNumber() * usdToZEPHRate + balance.toJSNumber();
    result[balanceType] = convertBalanceToMoney(total);
    return result;
  }, {});

  const rsvTotalBalance: ViewBalance = Object.entries(zephTotalBalance).reduce(
    (result: any, [balanceType, balance]) => {
      const total = balance * zephToRSVRate;
      result[balanceType] = total;
      return result;
    },
    {},
  );

  return {
    [Ticker.ZEPH]: zephUSDTotalBalance,
    ZEPHRSV: rsvTotalBalance,
  };
};

export const selectValueInOtherAsset = (
  balance: Balance,
  exchangeRates: BlockHeaderRate[],
  fromAsset: Ticker,
  toAsset: Ticker,
  useSpot: boolean = false,
): ViewBalance => {
  const xRate: number = selectXRate(exchangeRates, fromAsset, toAsset, useSpot);

  const viewBalance: ViewBalance = { ...INITIAL_VIEW_BALANCE };
  Object.entries(balance).forEach(
    ([balanceType, balance]) => (viewBalance[balanceType] = convertBalanceToMoney(balance.toJSNumber() * xRate)),
  );
  return viewBalance;
};
