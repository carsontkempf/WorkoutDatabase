#!/bin/bash

# Check for Python 3 and pip installation
if ! command -v python3 &>/dev/null; then
    echo "Python 3 is not installed. Please install it first."
    exit 1
fi

if ! command -v pip3 &>/dev/null; then
    echo "pip is not installed. Please install it first."
    exit 1
fi

# Create a virtual environment
if [ ! -d "venv" ]; then
    echo "Creating a virtual environment..."
    python3 -m venv venv
fi

# Activate the virtual environment
echo "Activating the virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# Check for SQLite3 installation
if ! command -v sqlite3 &>/dev/null; then
    echo "SQLite3 is not installed. Attempting to install..."
    sudo apt-get install sqlite3
fi

# Set the FLASK_APP environment variable
export FLASK_APP=app.py
export FLASK_ENV=development

# Run the Flask application
echo "Starting Flask application..."
flask run
