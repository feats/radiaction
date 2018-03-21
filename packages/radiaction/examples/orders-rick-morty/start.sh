#!/bin/bash

set -eo pipefail
HOST_IP=`../host-ip.sh`

npm i
export HOST_IP && docker-compose up -d
printf "giving extra time for containers to be fully up and running... "
sleep 5
printf "\033[0;32mdone\033[0m\n\n\n"

babel-node distribution &
xterm -hold -e 'babel-node application' &
wait