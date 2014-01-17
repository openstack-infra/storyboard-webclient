#!/bin/bash -xe

# This script bootstraps the current workspace with a locally compiled
# node/grunt/bower javascript toolchain. This is done because recent NodeJS
# releases (v0.10+) are not available for the images we use for builds
# (CentOS, Ubuntu 12.04 precise), and because we only need node to generate our
# static assets.
#

node_version=0.10.24
script_dir="$( cd "$( dirname "$0" )" && pwd )"
workspace_path="$(dirname "$script_dir")"

node_archive_path=~/.cache/storyboard/node-v$node_version.tar.gz
node_remote_path=http://nodejs.org/dist/v$node_version/node-v$node_version.tar.gz

# Sanity check cleanup.
rm -fr $workspace_path/.local/
rm -fr $workspace_path/.build/

# Create our working directories
mkdir -p $workspace_path/.local/bin/
mkdir -p $workspace_path/.build/
mkdir -p ~/.cache/storyboard

# If we have npm already, there is no need to download/compile
if hash npm 2>/dev/null; then
    exit 0
fi

if hash nodejs 2>/dev/null && ! hash node 2>/dev/null; then
    ln -s `which nodejs` $workspace_path/.local/bin/node
fi

# Download the source if we don't have it already.
if [ ! -f $node_archive_path ]; then
    echo "Downloading Node v$node_version..."
    cd ~/.cache/storyboard
    wget $node_remote_path -O $node_archive_path
    cd $workspace_path
fi

# Compile into the workspace, so we keep things isolated.
# Note that on build nodes without ccache this will take a while.

cd $workspace_path/.build/
tar -xf $node_archive_path
cd $workspace_path/.build/node-v$node_version

# Run config, exit & dump if it fails.
echo 'Configuring...'
CONFIG_OUTPUT=$(./configure --prefix=$workspace_path/.local/ 2>&1)
if [ $? != 0 ]; then
    echo $CONFIG_OUTPUT
    cd $workspace_path
    exit 1
fi

# Run make
echo 'Make...'
MAKE_OUTPUT=$(make 2>&1)
if [ $? != 0 ]; then
    echo $MAKE_OUTPUT
    cd $workspace_path
    exit 1
fi

# Run make install
echo 'Make Install...'
MAKE_INSTALL_OUTPUT=$(make install 2>&1)
if [ $? != 0 ]; then
    echo $MAKE_INSTALL_OUTPUT
    cd $workspace_path
    exit 1
fi

# Go back home...
cd $workspace_path

exit 0
