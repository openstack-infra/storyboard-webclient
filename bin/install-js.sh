#!/bin/bash

if [ ! -e $1/bin/grunt ] ; then
  nodeenv -p $2 --node=0.10.26 || true
  npm config set ca ""
  npm install npm -g
  npm config delete ca
  npm install -g bower@1.2.8 grunt@0.4.2 grunt-cli@0.1.11
  npm install
  bower install
fi
