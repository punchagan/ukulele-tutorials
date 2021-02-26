#!/bin/bash
set -e

EXPORT_DIR="out"
GIT_URL=$(git remote get-url origin)

# Build the site
pushd $(dirname $0)/../site/
yarn build
yarn export

# Push to GitHub
# pushd "${EXPORT_DIR}"
# git init
# git add .
# git commit -m "Deploy to GitHub Pages" \
#     --author "Puneeth Chaganti <punchagan@muse-amuse.in>"
# git push --force "${GIT_URL}" master:gh-pages
# popd

# Push to muse-amuse.in
rsync -azP --delete "${EXPORT_DIR}/" muse-amuse.in:~/public_html/uke-tutorials.in

popd
