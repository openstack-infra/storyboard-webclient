#!/bin/bash
set -e

# This script checks if node is installed in the current path,
# and if not, will install the version specified. using nodeenv -p
#
#command -v node && echo "ok"

ENVDIR="$1"
VERSION="$2"

if [[ $(command -v node) ]]
then
    exit
fi

if [[ -n "$VERSION" ]]
then
    nodeenv -p "$ENVDIR" --node="$VERSION"
else
    nodeenv -p "$ENVDIR"
fi