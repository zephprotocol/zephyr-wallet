import * as fs from "fs";
import * as path from "path";
import { APP_DATA_PATH } from "../env";
import { NET } from "../types";

const newPaths = ["/wallets/main", "/wallets/test", "/wallets/stage"];

const getWalletPath = (netTypeId: NET) => {
  return path.join(APP_DATA_PATH, newPaths[netTypeId]);
};

const getOrConstructWalletPath = (netTypeId: NET) => {
  const walletPath = getWalletPath(netTypeId);
  if (!fs.existsSync(walletPath)) {
    // create new wallet folder
    fs.mkdirSync(walletPath, { recursive: true });
  }
  return walletPath;
};

export const getAvailableWallets = (
  netTypeId: NET,
): {
  storePath: string;
  wallets: string[];
} => {
  const walletPath: string = getOrConstructWalletPath(netTypeId);
  let availableWallets: string[];

  const files = fs.readdirSync(walletPath);

  availableWallets = files
    .filter((file: string) => file.endsWith(".keys"))

    .map((walletName: string) => {
      walletName = walletName.replace(".keys", "");
      return walletName;
    });

  return {
    storePath: walletPath,
    wallets: availableWallets,
  };
};
