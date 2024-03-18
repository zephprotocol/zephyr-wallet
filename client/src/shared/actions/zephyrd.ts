import { zephyrdProxy } from "shared/core/proxy";
import { DAEMON_CONECTION_CREATED } from "./types";
import { getNodeForWallet } from "./walletCreation";

export const connectAppToDaemon = () => {
  return (dispatch: any, getState: any) => {
    const node = getNodeForWallet(getState);
    if (node) {
      zephyrdProxy.createDaemonConnection(node);
      dispatch({ type: DAEMON_CONECTION_CREATED });
    }
  };
};
