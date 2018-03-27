#!/bin/bash

set -eo pipefail

HOST_IP=`../host-ip.sh`
export HOST_IP && docker-compose up -d #--force-recreate

(cd application && npm i) & (cd distribution && npm i) &
wait

# echo "We need you to login to Webtask in order to generate a new access/deployment token:"
# npx wt init || true
# WEBTASK_TOKEN=$(npx wt token create)
printf "\nWe need a Webtask token in order to deploy our code.\nPlease enter a valid Webtask token: "
read -r WEBTASK_TOKEN

printf "giving extra time for containers to be fully up and running... \n\n\n"
(sleep 1 && cd distribution && export WEBTASK_TOKEN && npm start) &
(sleep 3 && xterm -hold -e 'cd application && npm start') &
(sleep 3 && xterm -hold -e 'cd application && npm start') &
npx wt logs
wait

# wt token revoke $WEBTASK_TOKEN