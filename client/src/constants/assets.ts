import { Ticker } from "shared/reducers/types";

// id matches Ticker enum
export const AssetList = [
  {
    id: Ticker.ZEPH,
    token: "Zeph",
    ticker: "ZEPH",
    symbol: "Z",
  },
  {
    id: Ticker.ZEPHUSD,
    token: "Stable",
    ticker: "ZEPHUSD",
    symbol: "$",
  },
  {
    id: Ticker.ZEPHRSV,
    token: "Reserve",
    ticker: "ZEPHRSV",
    symbol: "Z",
  },
];
