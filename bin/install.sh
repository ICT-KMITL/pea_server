#!/bin/bash
set -e

if [ ! -e venv/bin/activate ]; then
  virtualenv venv
fi

source venv/bin/activate
pip install -r requirements.txt

mkdir -p static/js
npm install
npm run build

if [ "$ENV" == "PROD" ]; then
  python manage.py compress
  python manage.py collectstatic --noinput
fi
