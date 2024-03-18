import ZephyrBalance from "zephyr-javascript/src/main/js/wallet/model/ZephyrBalance";
import { walletProxy } from "shared/core/proxy";
import { XBalance } from "shared/reducers/xBalance";
import { bigIntegerToBigInt } from "utility/utility";
import { GET_BALANCES_SUCCEED, GET_BALANCES_FETCHING, GET_BALANCES_FAILED } from "./types";
import BigInteger from "zephyr-javascript/src/main/js/common/biginteger";

export const getZephyrBalance = () => {
  return async (dispatch: any) => {
    dispatch(getBalancesFetching());
    try {
      const balance: ZephyrBalance = await walletProxy.getBalance();

      const unlockedBalance: ZephyrBalance = await walletProxy.getUnlockedBalance();
      const xBalances: XBalance = convertBalance(balance, unlockedBalance);
      dispatch(getBalancesSucceed(xBalances));
    } catch (e) {
      dispatch(getBalancesFailed(e));
    }

    return;
  };
};

const getBalancesFetching = () => ({ type: GET_BALANCES_FETCHING });

export const getBalancesSucceed = (balance: XBalance) => ({
  type: GET_BALANCES_SUCCEED,
  payload: balance,
});
const getBalancesFailed = (error: any) => ({
  type: GET_BALANCES_FAILED,
  payload: error,
});

const convertBalance = (balances: ZephyrBalance, unlockedBalances: ZephyrBalance): XBalance => {
  const unlockedDict: { [key: string]: BigInteger } = unlockedBalances.toDict();
  const balanceDict: { [key: string]: BigInteger } = balances.toDict();
  const assetArr = Object.keys(balanceDict);
  const xBalances: XBalance = {};

  for (const asset of assetArr) {
    const unlockedBalance = bigIntegerToBigInt(unlockedDict[asset]);
    const balance = bigIntegerToBigInt(balanceDict[asset]);
    const lockedBalance = balance.subtract(unlockedBalance);

    const xBalance: XBalance = {
      [asset]: {
        lockedBalance,
        unlockedBalance,
        balance,
      },
    };
    Object.assign(xBalances, xBalance);
  }

  return xBalances;
};
