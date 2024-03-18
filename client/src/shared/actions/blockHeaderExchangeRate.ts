import { AnyAction } from "redux";
import { GET_BLOCK_HEADER_EXCHANGE_RATE_FETCH, GET_BLOCK_HEADER_EXCHANGE_RATE_SUCCEED } from "./types";
import { BlockHeaderRate } from "shared/reducers/blockHeaderExchangeRates";
import bigInt from "big-integer";
import { zephyrdProxy } from "shared/core/proxy";
import MoneroBlockHeader from "zephyr-javascript/src/main/js/daemon/model/MoneroBlockHeader";

export const getLastBlockHeader = () => {
  return async (dispatch: any) => {
    dispatch({ type: GET_BLOCK_HEADER_EXCHANGE_RATE_FETCH });

    try {
      const rawHeader: MoneroBlockHeader = await zephyrdProxy.getLastBlockHeader();
      const recordEntry = createRecordEntry(rawHeader);
      dispatch(getLastBlockerHeaderSucceed(recordEntry));
    } catch (e) {
      console.log("getLastBlockHeader error: ", e);
    }
  };
};

const createRecordEntry = (blockHeader: MoneroBlockHeader): BlockHeaderRate => {
  const pricingRecord: any = {};

  Object.entries(blockHeader.getPricingRecord()).forEach(([key, value]) => {
    if (key !== "signature") {
      pricingRecord[key] = bigInt(value as number);
    }
  });
  pricingRecord.height = blockHeader.getHeight();
  pricingRecord.timestamp = blockHeader.getTimestamp();
  return pricingRecord;
};

export const getLastBlockerHeaderSucceed = (priceRecord: BlockHeaderRate): AnyAction => {
  return { type: GET_BLOCK_HEADER_EXCHANGE_RATE_SUCCEED, payload: priceRecord };
};
