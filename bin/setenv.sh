#!/bin/bash

BIN_DIR="$( cd "$( dirname "$0" )" && pwd )"
WORKSPACE="$(dirname "$BIN_DIR")"

# Add our new bin directory to the PATH
echo "Adding $WORKSPACE/.local/bin to PATH"
export PATH=$WORKSPACE/.local/bin:$PATH
echo "Adding $WORKSPACE/node_modules/.bin to PATH"
export PATH=$WORKSPACE/node_modules/.bin:$PATH
