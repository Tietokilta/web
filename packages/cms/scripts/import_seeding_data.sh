#!/bin/bash -e
cd packages/cms
#import .env variables
set -o allexport && source .env && set +o allexport
cd db_data
# Define MongoDB URI
if [ -z "$MONGODB_URI" ]; then
  echo "MONGODB_URI is not set. Using default value."
  MONGODB_URI="mongodb://127.0.0.1/payload-template-blank"
fi

# Loop to import each JSON file into a MongoDB collection
cd mongo
for filename in *.json; do
    COLLECTION_NAME="${filename%.json}"
    echo "Importing $COLLECTION_NAME collection..."
    mongoimport --uri="$MONGODB_URI" --collection="$COLLECTION_NAME" --file="$filename" --jsonArray
done
# Copy images from images to ../uploads folder 
# TODO: change this implementation when using cloud storage plugin
cd ..
mkdir -p ../uploads
find images -type f -exec cp {} ../uploads/ \;
