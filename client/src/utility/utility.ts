/* global BigInt */

import { notificationList } from "constants/notificationList";
import { NO_PRICE } from "shared/reducers/priceHistory";
import { NO_BALANCE } from "shared/reducers/xBalance";
import { Ticker } from "shared/reducers/types";
import bigInt from "big-integer";
import BigInteger from "zephyr-javascript/src/main/js/common/biginteger";
import { isDevMode } from "constants/env";

export const convertTimestampToDateString = (timestamp: any) => new Date(timestamp).toLocaleDateString();

//coingeckeo delivers to many prices, so we decrease them
export const decreasePricePoints = (priceData: any) => {
  const prices = priceData.prices;
  const decreasedPrices = [];
  const maxVal = 220;
  const delta = Math.round(prices.length / maxVal);
  let i;
  for (i = 0; i < prices.length; i += delta) {
    decreasedPrices.push(prices[i]);
  }

  return { prices: decreasedPrices };
};

export const getCurrentValueInUSD = (amount: number, ticker: Ticker, priceInUSD: number) => {
  const humanAmount: number = convertBalanceToMoney(Math.abs(amount));

  switch (ticker) {
    case Ticker.ZEPHUSD:
      return humanAmount;
    case Ticker.ZEPH:
      return humanAmount * priceInUSD;
  }
};

export const convertBalanceToMoney = (atomicMoney: bigInt.BigInteger | number, decimals: number = 2): number => {
  if (atomicMoney === NO_BALANCE) return 0;

  const atomicUnits = 12;
  let readableBalance;
  if (bigInt.isInstance(atomicMoney)) {
    readableBalance = Number(atomicMoney.divide(Math.pow(10, atomicUnits - decimals)));
    readableBalance = readableBalance / Math.pow(10, decimals);
    return Number(readableBalance.toFixed(decimals));
  }

  readableBalance = atomicMoney / Math.pow(10, 12);

  if (readableBalance % 1 === 0) return Math.round(readableBalance);
  return Number(readableBalance.toFixed(decimals));
};

// converts user input in atomic units
export const convertMoneyToBalance = (amount: number): bigInt.BigInteger => {
  const atomicUnits = 12;
  if (amount === Math.round(amount)) {
    return bigInt(amount).multiply(bigInt(Math.pow(10, atomicUnits)));
  }

  const amountString = amount.toFixed(12);
  let numDecimals = amountString.split(".")[1].length || 0;
  let roundAmount: string;
  roundAmount = amountString.replace(".", "");

  return bigInt(roundAmount).multiply(Math.pow(10, Math.max(atomicUnits - numDecimals, 0)));
};

export const uuidv4 = () => {
  var uuid = "",
    i,
    random;
  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;

    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += "-";
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
};

export const getMessageOfError = (error: any) => {
  const errorNotification = notificationList.find((notification) => notification.code === error.code);
  return errorNotification ? errorNotification.message : error.message;
};

export const estimateFee = () => {
  // const fee = lWallet.estimated_tx_network_fee(null, 1, "24658");
  return null;
};

export const calcValue = (amount: any, price: any) => {
  if (amount === NO_BALANCE || price === NO_PRICE) {
    return "--";
  } else {
    return (amount * price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
};

export const getPriceDates = (prices: any) => {
  return prices.map((priceItem: any) => convertTimestampToDateString(priceItem[0]));
};

export const getPriceValues = (prices: any) => {
  return prices.map((priceItem: any) => priceItem[1]);
};

export const logM = (message: any) => {
  if (isDevMode()) {
    console.log(message);
  }
};

export const createRemainingTimeString = (remainingTimeInMinutes: number) => {
  const days = Math.floor(remainingTimeInMinutes / (60 * 24));
  const hours = Math.floor((remainingTimeInMinutes % (60 * 24)) / 60);
  const minutes = Math.floor(remainingTimeInMinutes % 60);

  const timeString =
    (days > 0 ? days + "d " : "") + (hours > 0 ? hours + "h " : "") + (minutes > 0 ? minutes + "m" : "");
  return timeString;
};

// zephyr-javascript uses its own implementation of BigInteger, and we need to convert to adapt the apps
//implementaion of bigInts

export const bigIntegerToBigInt = (value: BigInteger): bigInt.BigInteger => {
  // @ts-ignore
  if (value instanceof BigInteger.BigInteger) {
    //@ts-ignore
    return bigInt(value.toString(10));
  }

  //@ts-ignore
  const convertedBigInteger = BigInteger.BigInteger._construct(value._d, value._s);

  return bigInt(convertedBigInteger.toString(10));
};

/**
 * meant to return a informative/meaningful number to display
 * @param rawNumber
 * @returns string
 */
export const iNum = (rawNumber: number | undefined | null): string => {
  if (rawNumber === undefined || rawNumber === null) {
    return "";
  }

  let preciseNumString;

  if (numDigits(rawNumber) > 1) {
    preciseNumString = rawNumber.toFixed(2);
  } else {
    preciseNumString = rawNumber.toPrecision(5);
  }
  //@ts-ignore

  //trim to 6 decimals max and remove trailing zeros
  //@ts-ignore
  const preciseNum = Number(preciseNumString).toFixed(6) / 1;

  return preciseNum.toString();
};

const numDigits = (value: number) => {
  return Math.max(Math.floor(Math.log10(Math.abs(value))), 0) + 1;
};

export function convertToNewTicker(ticker: Ticker | undefined) {
  if (ticker === Ticker.ZEPHUSD) {
    return "ZSD";
  } else if (ticker === Ticker.ZEPHRSV) {
    return "ZRS";
  }
  return ticker ?? "";
}