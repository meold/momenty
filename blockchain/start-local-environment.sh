#!/usr/bin/env bash

# if there's no local ipfs repo, initialize one
if [ ! -d "$HOME/.ipfs" ]; then
  npx go-ipfs init
fi

echo "Running IPFS and development blockchain"
run_ipfs_cmd="npx go-ipfs daemon"

npx concurrently -n ipfs -c blue "$run_ipfs_cmd"
