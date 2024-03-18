#!/usr/bin/env bash


export ZEPHYR_DESKTOP_DEVELOPMENT=false
export NODE_INSTALLER=npm

if [ "$ACTION_OS" == "macOS-latest" ]
then
    npm run make --prefix zephyr-desktop-app -- --arch="arm64,x64" 
else 
    npm run make --prefix zephyr-desktop-app
fi


