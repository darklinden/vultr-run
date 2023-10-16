#!/bin/bash

REMOTE_PATH=/opt/demo

cd $REMOTE_PATH

sudo apt-get update -y
sudo apt-get install -y docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker

echo "stop docker-compose"
sudo docker-compose down --remove-orphans
