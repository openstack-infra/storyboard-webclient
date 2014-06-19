#!/bin/bash
set -e

# This script checks if node is installed in the tox virtualenv, it checks
# if we have the correct version and run a nodeenv -p if not.
#command -v node && echo "ok"

ENVDIR="$1"

if [[ -n "$2" ]]
then
    VERSION="$2"
    if [[ $(command -v node) && $(node -v) == "v$VERSION" ]]
    then
        exit
    fi
else
    if [[ $(command -v node) ]]
    then
        exit
    fi
fi

if [[ -n "$VERSION" ]]
then
    nodeenv -p "$ENVDIR" --node="$VERSION"
else
    nodeenv -p "$ENVDIR"
fi

npm config set ca
npm install npm -g
npm config delete ca
npm install -g bower@1.2.8 grunt@0.4.2 grunt-cli@0.1.11
