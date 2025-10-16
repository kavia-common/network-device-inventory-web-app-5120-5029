#!/bin/bash
cd /home/kavia/workspace/code-generation/network-device-inventory-web-app-5120-5029/ReactFrontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

