#!/bin/bash -e

# Define MongoDB URI
if [ -z "$PAYLOAD_MONGO_CONNECTION_STRING" ]; then
  echo "PAYLOAD_MONGO_CONNECTION_STRING is not set. Using default value."
  PAYLOAD_MONGO_CONNECTION_STRING="mongodb://127.0.0.1/payload"
fi

# You need to have mongo db tools https://www.mongodb.com/docs/database-tools/installation/installation/
# and mongosh https://www.mongodb.com/docs/mongodb-shell/ installed
# Fetch collection names and store them in an array
COLLECTIONS=$(mongosh --quiet --eval 'db.getCollectionNames().join("\n")' "$PAYLOAD_MONGO_CONNECTION_STRING")

# Loop to export each collection to a JSON file
for COLLECTION_NAME in $COLLECTIONS; do
  # Check document count in collection
  COUNT=$(mongosh --quiet --eval "db.getCollection('$COLLECTION_NAME').countDocuments({})" "$PAYLOAD_MONGO_CONNECTION_STRING")
  # Skip users collection if it has more than 1 document, as the default user is already created
  if [ "$COLLECTION_NAME" == "users" ] && [ "$COUNT" -gt "1" ]; then
    echo "Skipping users collection import with more than 1 document"
    continue
  fi
  if [ "$COLLECTION_NAME" == "payload-preferences" ]; then
    echo "Skipping payload-preferences collection import"
    continue
  fi
  if [ "$COUNT" -gt "0" ]; then
    echo "Exporting $COLLECTION_NAME collection..."
    mongoexport --uri="$PAYLOAD_MONGO_CONNECTION_STRING" --collection="$COLLECTION_NAME" --out="data/gen/db/$COLLECTION_NAME.json" --jsonArray --pretty --sort="{_id:1}"
  else
    echo "Skipping empty collection $COLLECTION_NAME"
  fi
done

# Copy images from uploads to db_data/images
cp -r apps/cms/uploads data/gen/uploads
