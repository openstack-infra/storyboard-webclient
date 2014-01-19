#!/bin/bash

if [ "$0" = "bash" ]; then
    # We're sourcing things
    BIN_DIR=$(pwd)/bin
else
    BIN_DIR="$( cd "$( dirname "$thisscript" )" && pwd )"
fi

WORKSPACE="$(dirname "$BIN_DIR")"

# Add our new bin directory to the PATH
echo "Adding $WORKSPACE/.local/bin to PATH"
export PATH=$WORKSPACE/.local/bin:$PATH
echo "Adding $WORKSPACE/node_modules/.bin to PATH"
export PATH=$WORKSPACE/node_modules/.bin:$PATH
