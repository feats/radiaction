#!/bin/bash

set -eo pipefail
HOST_IP=`../host-ip.sh`

npm i
export HOST_IP && docker-compose up -d
printf "giving extra time for containers to be fully up and running... \n\n\n"

(sleep 2 && babel-node distribution) &
(sleep 4 && xterm -hold -e 'babel-node application') &
(sleep 4 && xterm -hold -e 'babel-node application') &
(sleep 4 && xterm -hold -e 'babel-node application') &
wait