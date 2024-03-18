import bigInt from "big-integer";
import { walletProxy } from "shared/core/proxy";
import type { ReserveInfo } from "shared/reducers/reserveInfo";
import { ADD_RESERVE_INFO } from "./types";

export const getReserveInfo = () => {
  return async (dispatch: any) => {
    try {
      //@ts-ignore
      const reserveInfo: any = await walletProxy.getReserveInfo();
      let parsedreserveInfo: ReserveInfo = reserveInfo.toDict();
      Object.entries(parsedreserveInfo).forEach(([key, value]) => {
        parsedreserveInfo[key as keyof ReserveInfo] = bigInt(value!.toString());
      });

      dispatch(addReserveInfo(parsedreserveInfo));
    } catch (e) {
      console.error(e);
    }
  };
};

const addReserveInfo = (supply: ReserveInfo) => ({ type: ADD_RESERVE_INFO, payload: supply });
