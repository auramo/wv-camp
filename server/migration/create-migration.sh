#!/bin/bash

if [ -z "$1" ]
  then
    echo "Give the name of the migration as parameter"
    exit 2
fi

. .env
npx db-migrate --config migration/database.json --migrations-dir migration/migrations create $1 --sql-file
