#!/bin/bash

# set -eo pipefail

# This works on EC2 ubuntu 16.04 machines
host=$(netstat -nr | grep '^0\.0\.0\.0' | awk '{print $2}')

if [ -z "$host" ]; then
  # This works on Mac
  host=$(ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}')
fi

# In Amazon EC2: `wget -q -O - checkip.amazonaws.com`

echo "$host";
