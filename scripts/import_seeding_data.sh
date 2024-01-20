#!/bin/bash -e

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
  exit 0
fi
# Loop to import each JSON file into a MongoDB collection
if [ "$ALL_FLAG" = true ] ; then
  echo "Importing all collections..."
  for file_path in data/gen/db/*.json; do
    filename=$(basename "$file_path")
    COLLECTION_NAME="${filename%.json}"
    echo "Importing $COLLECTION_NAME collection..."
    mongoimport --uri="$PAYLOAD_MONGO_CONNECTION_STRING" --collection="$COLLECTION_NAME" --file="$file_path" --jsonArray $UPSERT_FLAG
  done
  exit 0
fi

# Copy images from images to ../uploads folder
# TODO: change this implementation when using cloud storage plugin
mkdir -p apps/cms/uploads
find data/gen/images -type f -exec cp {} apps/cms/uploads/ \;
