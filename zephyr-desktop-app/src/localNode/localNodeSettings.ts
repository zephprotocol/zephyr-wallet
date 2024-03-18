import * as path from "path";
import { getNetTypeName } from "../env";
import { NET } from "../types";

const PLATFORM = process.platform;

export function checkForUnpackedPath(pathName: string): string {
  if (!pathName.includes("app.asar.unpacked")) {
    return pathName.replace("app.asar", "app.asar.unpacked");
  }
  return pathName;
}

export const getLocalDaemonPath = (netTypeID: NET): string => {
  return checkForUnpackedPath(
    path.resolve(__dirname, `../zephyr-node/${PLATFORM}/${getNetTypeName(netTypeID)}/zephyrd`),
  );
};

export const getLocalNodeArguments = (netTypeId: NET): object => {
  switch (netTypeId) {
    case NET.Mainnet:
      return {};
    case NET.Testnet:
      return {
        testnet: "",
        "add-priority-node": "seed.zephyrprotocol.com",
      };
    case NET.Stagenet:
      return {
        stagenet: "",
        offline: "",
        "fixed-difficulty": 50,
      };
  }
};
