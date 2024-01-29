#!/bin/bash -e

# Define MongoDB URI
if [ -z "$PAYLOAD_POSTGRES_CONNECTION_STRING" ]; then
  echo "PAYLOAD_POSTGRES_CONNECTION_STRING is not set. Using default value."
  PAYLOAD_POSTGRES_CONNECTION_STRING="postgres://cms:password@localhost/payload"
fi

# Copy images from images to ../uploads folder
mkdir -p apps/cms/uploads
rm -rf apps/cms/uploads/*
cp -r data/gen/images/* apps/cms/uploads
# run import dump.sql
psql $PAYLOAD_POSTGRES_CONNECTION_STRING < data/gen/db/dump.sql