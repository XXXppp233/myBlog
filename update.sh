#!/bin/bash

# Ensure we are in the script's directory
cd "$(dirname "$0")"

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies (quietly)
pip install pyyaml > /dev/null 2>&1

# Run the update script
echo "Running update script..."
python main.py

# Deactivate
deactivate

git add .
git commit -m "Automated update"
git push origin master 
