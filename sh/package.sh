#!/usr/bin/env bash

NET_TYPE_ID=$1

if [ -z "${NET_TYPE_ID}" ]; then
    PS3="please select net type: "
    select opt in "mainnet" "testnet" "stagenet"

do
    case $opt in
        "mainnet")
            NET_TYPE_ID=0
            break
            ;;
        "testnet")
            NET_TYPE_ID=1
            break
            ;;
        "stagenet")
        NET_TYPE_ID=2
            break
            ;;
              *)
            echo "Invalid option"
            ;;
    esac
done
fi

echo "you choose $NET_TYPE_ID"

export ZEPHYR_DESKTOP_DEVELOPMENT=false
export NET_TYPE_ID
export NODE_INSTALLER=npm

npm run package --prefix zephyr-desktop-app
