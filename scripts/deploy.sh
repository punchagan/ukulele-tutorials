#!/bin/bash
set -e

EXPORT_DIR="out"

# Build the site
pushd $(dirname $0)/../site/
yarn build
yarn export

# Push to muse-amuse.in
rsync -azP --delete "${EXPORT_DIR}/" muse-amuse.in:~/ukulele.muse-amuse.in

popd
