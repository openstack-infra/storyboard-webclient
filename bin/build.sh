#!/bin/bash

# This script executes the build.

VDISPLAY=99
DIMENSIONS='1280x1024x24'
XVFB=/usr/bin/Xvfb

source $(dirname $0)/setenv.sh
cd $WORKSPACE;

echo "Installing build dependencies"
npm prune
npm install

echo "Launching Virtual Frame Buffer"
$XVFB :${VDISPLAY} -screen 0 ${DIMENSIONS} -ac +extension GLX +render -noreset 2>&1 > /dev/null &

echo "Building"
set +e
DISPLAY=:${VDISPLAY} grunt clean test
result=$?

pkill Xvfb 2>&1 > /dev/null
set -e

exit $result
