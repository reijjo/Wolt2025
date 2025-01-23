#!/bin/bash

npm install
echo "\nAll dependencies installed\n"

cd e2e && npm install
echo "\nTesting environment ready\n"

echo "You can now run 'npm run dev' to start the application"
echo "Application can then be found at 'http://localhost:5173'\n"