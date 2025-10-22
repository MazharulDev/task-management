#!/bin/bash

echo "Starting Task Management Development Environment..."
echo

echo "Starting Backend Server..."
cd task-server
npm run dev &
BACKEND_PID=$!
cd ..

sleep 5

echo "Starting Frontend Server..."
cd task-client
npm run dev &
FRONTEND_PID=$!
cd ..

echo
echo "Development servers started!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID
wait $FRONTEND_PID