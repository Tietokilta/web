#!/usr/bin/env bash
set -eo pipefail

# Define MongoDB URI
if [ -z "$PAYLOAD_MONGO_CONNECTION_STRING" ]; then
  echo "PAYLOAD_MONGO_CONNECTION_STRING is not set. Using default value."
  PAYLOAD_MONGO_CONNECTION_STRING="mongodb://127.0.0.1/payload"
fi
#if no args, print usage
if [ $# -eq 0 ]; then
  echo "Usage: ./scripts/import_seeding_data.sh [-u|--upsert] [collection_name]"
  echo "  -u, --upsert    Use upsert mode when importing data"
  echo "  -a, --all       Import all collections, "
  exit 0
fi
# iterate through arguments and process them
UPSERT_FLAG=false
ALL_FLAG=false
for arg in "$@"
do
    case $arg in
        -u|--upsert)
        UPSERT_FLAG=true
        shift # Remove --upsert from processing
        ;;
    esac
    case $arg in
        -h|--help)
        echo "Usage: ./scripts/import_seeding_data.sh [-u|--upsert] [collection_name]"
        echo "  -u, --upsert    Use upsert mode when importing data"
        exit 0
        ;;
    esac
    case $arg in
        -a|--all)
        ALL_FLAG=true
        shift # Remove --all from processing
        ;;
    esac
done
# add --upsert flag to mongoimport command if UPSERT_FLAG is true
if [ "$UPSERT_FLAG" = true ] ; then
  echo "Using upsert mode"
  UPSERT_FLAG="--upsert"
else
  UPSERT_FLAG=""
fi

# if argument is passed, only import that collection
if [ -n "$1" ]; then
  if [ "$ALL_FLAG" = true ] ; then
    echo "Cannot use --all flag with collection name"
    exit 1
  fi
  COLLECTION_NAME="$1"
  echo "Importing $COLLECTION_NAME collection..."
  mongoimport --uri="$PAYLOAD_MONGO_CONNECTION_STRING" --collection="$COLLECTION_NAME" --file="data/gen/db/$COLLECTION_NAME.json" --jsonArray $UPSERT_FLAG
# Loop to import each JSON file into a MongoDB collection
elif [ "$ALL_FLAG" = true ] ; then
  echo "Importing all collections..."
  for file_path in data/gen/db/*.json; do
    filename=$(basename "$file_path")
    COLLECTION_NAME="${filename%.json}"
    echo "Importing $COLLECTION_NAME collection..."
    mongoimport --uri="$PAYLOAD_MONGO_CONNECTION_STRING" --collection="$COLLECTION_NAME" --file="$file_path" --jsonArray $UPSERT_FLAG
  done
fi
# Exports made before the cost pools collection existed do not contain it, so fall back to the
# initial list. Once the export has it, it is the source of truth: seeding on top of it would
# bring back any pool that has since been deleted in the CMS.
if [ -f data/gen/db/cost-pools.json ]; then
  echo "cost pools are in the seeding data, not seeding them"
else
  echo "seeding cost pools"
  pnpx tsx apps/web/src/scripts/seed-cost-pools.ts
fi

# import images from production cuz ya yeet
echo "starting image import from main site"
pnpx tsx apps/web/src/scripts/import-uploads.ts media
echo "NOTE: only media collection imported by default to save space"
echo "If you want to import documents, run:"
echo "pnpx tsx apps/web/src/scripts/import-uploads.ts documents"
