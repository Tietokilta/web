#!/usr/bin/env bash

# Define the URL and file to upload
URL="http://localhost:3000/api/media/upload"

# Read file, alt, photographer and jwt from command arguments
# Example: ./upload_file.sh --file="data/gen/uploads/1.jpg" --alt="A beautiful landscape" --photographer="John Doe"
for i in "$@"; do
  case $i in
  --file=*)
    FILE="${i#*=}"
    shift # Remove --file= from processing
    ;;
  --alt=*)
    ALT="${i#*=}"
    shift # Remove --alt= from processing
    ;;
  --photographer=*)
    PHOTOGRAPHER="${i#*=}"
    shift # Remove --photographer= from processing
    ;;
  --jwt=*)
    JWT="${i#*=}"
    shift # Remove --jwt= from processing
    ;;
  *) ;;
  esac
done

# Validate that all required arguments are provided
if [ -z "$FILE" ] || [ -z "$ALT" ] || [ -z "$PHOTOGRAPHER" ] || [ -z "$JWT" ]; then
  echo "Usage: ./upload_file.sh --file=<file> --alt=<alt> --photographer=<photographer> --jwt=<jwt>"
  exit 1
fi

echo "Uploading file: $FILE"

# Use curl to upload the file
curl -X POST "$URL" \
  -H "Authorization: JWT $JWT" \
  -F "file=@$FILE" \
  -F "alt=$ALT" \
  -F "photographer=$PHOTOGRAPHER"
