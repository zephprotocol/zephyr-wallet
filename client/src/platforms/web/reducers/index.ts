import { AnyAction, combineReducers } from "redux";

// Reducers
import theme from "shared/reducers/currentTheme.js";
import { address } from "shared/reducers/address";
import { xTransferList } from "shared/reducers/xTransferList";
import { priceHistory } from "shared/reducers/priceHistory";
import notification from "shared/reducers/notification";
import { chain } from "shared/reducers/chain";
import { transferProcess } from "shared/reducers/transferProcess";
import { exchangeProcess } from "shared/reducers/exchangeProcess";
import { xBalance } from "shared/reducers/xBalance";
import { blockHeaderExchangeRate } from "shared/reducers/blockHeaderExchangeRates";
import { walletSession } from "shared/reducers/walletSession";
import { walletCreation } from "shared/reducers/walletCreation";
import modal from "shared/reducers/modal";
import { STOP_WALLET_SESSION } from "shared/actions/types";
import { connectedNode } from "platforms/desktop/reducers/selectedNode";
import { reserveInfo } from "shared/reducers/reserveInfo";

const appReducer = combineReducers({
  theme,
  address,
  xBalance,
  chain,
  xTransferList,
  priceHistory,
  notification,
  transferProcess,
  exchangeProcess,
  blockHeaderExchangeRate,
  walletSession,
  walletCreation,
  modal,
  connectedNode,
  reserveInfo,
});

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === STOP_WALLET_SESSION) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;

export type WebAppState = ReturnType<typeof rootReducer>;
