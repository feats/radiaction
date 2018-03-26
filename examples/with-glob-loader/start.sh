#!/bin/bash

set -eo pipefail

HOST_IP=`../host-ip.sh`
export HOST_IP && docker-compose up -d #--force-recreate

(cd application && npm i) & (cd distribution && npm i) &
wait

printf "giving extra time for containers to be fully up and running... \n\n\n"
(sleep 1 && cd distribution && npm start) &
(sleep 3 && xterm -hold -e 'cd application && npm start') &
(sleep 3 && xterm -hold -e 'cd application && npm start') &
(sleep 3 && xterm -hold -e 'cd application && npm start') &
wait