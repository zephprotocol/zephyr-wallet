const fs = require("fs");
const path = require("path");
const ncp = require("ncp").ncp;
const {
  utils: { fromBuildIdentifier },
} = require("@electron-forge/core");

const ignoredPaths = [
  "^/src",
  ".gitignore",
  "tsconfig.json",
  "tslint.json",
  "yarn.lock",
  "forge.config.js",
  "^/zephyr-node",
  // "^/icons",
];

const substituteEnvsForBuild = (buildPath, electronVersion, platform, arch, callback) => {
  const envPath = path.resolve(buildPath, "dist", "env.js");
  let envContent = fs.readFileSync(envPath, { encoding: "utf8" });

  const envKeys = Object.keys(process.env);

  envKeys.forEach((envKey) => {
    envContent = envContent.replace(`process.env.${envKey}`, process.env[envKey]);
  });

  fs.writeFileSync(envPath, envContent);
  callback();
};

const copyTargetNodesToBuild = (buildPath, electronVersion, platform, arch, callback) => {
  const netTypes = {
    0: "mainnet",
    1: "testnet",
    2: "stagenet",
  };

  const filter = (fileName) => {
    return fileName.includes(".log") === false;
  };

  const netType = netTypes[process.env.REACT_APP_NET_TYPE_ID];

  fs.mkdirSync(path.resolve(buildPath, `./zephyr-node/${platform}/`), {
    recursive: true,
  });
  ncp(
    path.resolve(__dirname, `./zephyr-node/${platform}/${netType}/`),
    path.resolve(buildPath, `./zephyr-node/${platform}/${netType}/`),
    { filter },
    (err) => {
      if (err) {
        console.log(err);
      }

      console.log(`copied daemons for  ${platform} ${netType}`);
      callback();
    },
  );
};

module.exports = {
  /*   packagerConfig: {
    executableName: "Zephyr",
    name: "Zephyr",
    ignore: ignoredPaths,
    afterCopy: [copyTargetNodesToBuild, substituteEnvsForBuild],
    icon: "./icons/icon",
    asar: {
      unpackDir: "zephyr-node/**",
    },
  }, */

  packagerConfig: {
    executableName: process.platform === "linux" ? "zephyr" : "Zephyr",
    name: "Zephyr",
    ignore: ignoredPaths,
    afterCopy: [substituteEnvsForBuild],
    icon: "./icons/icon",
    asar: false,
  },

  hooks: {
    readPackageJson: (value) => {
      //console.log(process);
    },
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "Zephyr",
      },
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        background: "./icons/dmg-bg.png",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
      config: {},
    },
    {
      name: "@electron-forge/maker-deb",
      platforms: ["linux"],
      config: {
        name: "zephyr",
        productName: "zephyr",
        icon: "./icons/icon.png",
      },
    },

    // not flatpak support till issue resolved
    //https://github.com/electron-userland/electron-forge/issues/2561
    /*  {
      name: "@electron-forge/maker-flatpak",
      platforms: ["linux"],
      config: {
        name: "zephyr",
        productName: "zephyr",
        icon: "./icons/icon.png",
      },
    }, */
  ],

  //  plugins: [["@electron-forge/plugin-auto-unpack-natives"]],

  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "zephyr-protocol-org",
          name: "zephyr-web-app",
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
};
