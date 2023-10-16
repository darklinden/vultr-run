#!/bin/bash

ssh $REMOTE_SSH_HOST -p $REMOTE_SSH_PORT -i $REMOTE_SSH_AUTH_ID 'bash -s' <remote-stop.sh

rsync -e "ssh -i $REMOTE_SSH_AUTH_ID -p $REMOTE_SSH_PORT" \
    -av ./ $REMOTE_SSH_HOST:$VP_REMOTE_PATH \
    --exclude-from='exclude.txt'

ssh $REMOTE_SSH_HOST -p $REMOTE_SSH_PORT -i $REMOTE_SSH_AUTH_ID 'bash -s' <remote-start.sh
