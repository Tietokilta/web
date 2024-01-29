#!/bin/bash -e

# Define postgres URI
if [ -z "$PAYLOAD_POSTGRES_CONNECTION_STRING" ]; then
  echo "PAYLOAD_POSTGRES_CONNECTION_STRING is not set. Using default value."
  PAYLOAD_POSTGRES_CONNECTION_STRING="postgres://cms:password@localhost/payload"
fi

# import data only from payload db as sql
pg_dump --data-only --exclude-table payload_migrations --column-inserts $PAYLOAD_POSTGRES_CONNECTION_STRING > data/gen/db/dump.sql
# Copy images from uploads to db_data/images
cp -r apps/cms/uploads/* data/gen/images
