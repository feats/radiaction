#!/bin/bash

set -eo pipefail

npm i
docker-compose up -d

babel-node distribution &
xterm -e 'babel-node application' &
wait