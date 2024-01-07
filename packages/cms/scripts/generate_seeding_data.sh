#!/bin/bash -e
cd packages/cms
#import .env variables
set -o allexport && source .env && set +o allexport
# Define MongoDB URI
if [ -z "$MONGODB_URI" ]; then
  echo "MONGODB_URI is not set. Using default value."
  MONGODB_URI="mongodb://127.0.0.1/payload-template-blank"
fi

# You need to have mongo db tools https://www.mongodb.com/docs/database-tools/installation/installation/
# and mongosh https://www.mongodb.com/docs/mongodb-shell/ installed
# Fetch collection names and store them in an array
COLLECTIONS=$(mongosh --quiet --eval 'db.getCollectionNames().join("\n")' "$MONGODB_URI")

# Loop to export each collection to a JSON file
for COLLECTION_NAME in $COLLECTIONS; do
  # Check document count in collection
  COUNT=$(mongosh --quiet --eval "db.getCollection('$COLLECTION_NAME').countDocuments({})" "$MONGODB_URI")
  # Skip users collection if it has more than 1 document, as the default user is already created
  if [ "$COLLECTION_NAME" == "users" ] && [ "$COUNT" -gt "1" ]; then
    echo "Skipping users collection import with more than 1 document"
    continue
  fi
  if [ "$COUNT" -gt "0" ]; then
    echo "Exporting $COLLECTION_NAME collection..."
    mongoexport --uri="$MONGODB_URI" --collection="$COLLECTION_NAME" --out="db_data/mongo/$COLLECTION_NAME.json" --jsonArray --pretty
  else
    echo "Skipping empty collection $COLLECTION_NAME"
  fi
done

# Copy images from uploads to db_data/images
cp -r uploads/* db_data/images
