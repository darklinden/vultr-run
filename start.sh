#!/usr/bin/env bash

BASEDIR=$(dirname "$0")
SCRIPT_DIR="$(realpath "${BASEDIR}")"

HOST=$1
echo "HOST: $HOST"

if [ -z "$HOST" ]; then
    echo "HOST is empty"
    exit 1
fi

# Start the service

cd $SCRIPT_DIR/demo-service

export $REMOTE_SSH_HOST=root@$HOST

if [ -f $SCRIPT_DIR/.env ]; then
    echo "Loading environment variables from $SCRIPT_DIR/.env ..."
    set -a
    source $SCRIPT_DIR/.env
    set +a
fi

sh start-service.sh
