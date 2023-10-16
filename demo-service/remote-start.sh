#!/bin/bash

REMOTE_PATH=/opt/demo

cd $REMOTE_PATH

echo "start docker-compose"
sudo docker-compose up -d
