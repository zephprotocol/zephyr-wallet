import { getPort } from "constants/env";
import { IMonerRPCConnection } from "typings";

export const webWalletConnection = (): IMonerRPCConnection => {
  const uri = process.env.REACT_APP_ZEPHYR_DIRECT_HOST
    ? process.env.REACT_APP_ZEPHYR_DIRECT_HOST
    : window.location.protocol + "//" + window.location.hostname + ":" + getPort();

  return { uri, username: "", password: "" };
};
