#!/bin/bash

# This script simplifies the migration of the storyboard database for testing
# and development purposes.

SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
WORKSPACE="$(dirname "$SCRIPT_DIR")"
ACTION=$1
DB_USER='openstack_citest'
DB_PASSWORD='openstack_citest'

# First we need to ensure that storyboard has been installed and is on our
# path.
command -v storyboard-api >/dev/null 2>&1 || {
    echo >&2 "Could not find Storyboard. Exiting.";
    exit 1;
}
command -v storyboard-db-manage >/dev/null 2>&1 || {
    echo >&2 "Could not find Storyboard. Exiting.";
    exit 1;
}

# This method creates the database.
function create_db() {
    # drop and recreate the database
    echo 'Creating database...'
    mysql -u $DB_USER -p$DB_PASSWORD -e 'DROP DATABASE IF EXISTS storyboard;'
    mysql -u $DB_USER -p$DB_PASSWORD -e 'CREATE DATABASE storyboard;'
}

# This method migrates the configured database.
function migrate_db() {
    local config_path=$(detect_storyboard_config)

    echo 'Running migration...'
    storyboard-db-manage --config-file $config_path upgrade head
}

# Starts storyboard as a background service.
function start_service() {
    echo 'Starting storyboard-api...'
    local config_path=$(detect_storyboard_config)
    local config_dir=$( dirname "$config_path" )
    local log_path="$WORKSPACE/reports/storyboard.log"

    # Delete and clear any previous logs
    mkdir -p $WORKSPACE/reports
    rm $log_path
    storyboard-api --config-dir $config_dir > $log_path 2>&1 &
    echo "Started, logging to $log_path..."
}

# Stops storyboard.
function stop_service() {
    echo 'Killing storyboard-api...'
    killall storyboard-api
}

# This method detects the location of the storyboard configuration file.
function detect_storyboard_config() {
    local global_config_path='/etc/storyboard/storyboard.conf'
    local test_config_path="$WORKSPACE/bin/storyboard_test.conf"
    local config_path="$WORKSPACE/.tox/node/etc/storyboard/storyboard.conf"

    local source_config_path

    if [ -f $global_config_path ];
    then
        # If there's a global config, source our config from there...
        source_config_path=$global_config_path
    else
        source_config_path=$test_config_path
    fi

    cp $source_config_path $config_path
    echo $config_path
}

# Switch based on what the user wants to do.
case $ACTION in
    'migrate-db')
        migrate_db
        ;;
    'create-db')
        create_db
        migrate_db
        ;;
    'start')
        start_service
        ;;
    'stop')
        stop_service
        ;;
    *)
        echo 'Usage: api.sh [create-db|migrate-db|start|stop]'
        exit 0;
        ;;
esac

echo 'Done!'