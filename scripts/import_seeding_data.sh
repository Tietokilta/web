#!/bin/bash -e

# Define MongoDB URI
if [ -z "$PAYLOAD_MONGO_CONNECTION_STRING" ]; then
  echo "PAYLOAD_MONGO_CONNECTION_STRING is not set. Using default value."
  PAYLOAD_MONGO_CONNECTION_STRING="mongodb://127.0.0.1/payload"
fi

# Loop to import each JSON file into a MongoDB collection
for file_path in data/gen/db/*.json; do
  filename=$(basename "$file_path")
  COLLECTION_NAME="${filename%.json}"
  echo "Importing $COLLECTION_NAME collection..."
  mongoimport --uri="$PAYLOAD_MONGO_CONNECTION_STRING" --collection="$COLLECTION_NAME" --file="$file_path" --jsonArray
done

# Copy images from images to ../uploads folder
# TODO: change this implementation when using cloud storage plugin
mkdir -p apps/cms/uploads
find data/gen/images -type f -exec cp {} apps/cms/uploads/ \;
