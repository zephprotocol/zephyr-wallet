import bigInt from "big-integer";
import { AnyAction } from "redux";
import { ADD_RESERVE_INFO } from "shared/actions/types";

export type ReserveInfo = {
  zeph_reserve: bigInt.BigInteger;
  num_stables: bigInt.BigInteger;
  num_reserves: bigInt.BigInteger;
  assets: bigInt.BigInteger;
  assets_ma: bigInt.BigInteger;
  liabilities: bigInt.BigInteger;
  equity: bigInt.BigInteger;
  equity_ma: bigInt.BigInteger;
  reserve_ratio: bigInt.BigInteger;
  reserve_ratio_ma: bigInt.BigInteger;
};

const INITALSTATE: ReserveInfo = {} as ReserveInfo;

export const reserveInfo = (state: ReserveInfo = INITALSTATE, action: AnyAction) => {
  switch (action.type) {
    case ADD_RESERVE_INFO:
      return { ...action.payload };
    default:
      return state;
  }
};
