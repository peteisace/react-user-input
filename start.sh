#!/bin/bash

# first - start the golang server.
cd server
go build ./

if [ -f "./nimbus" ]; then
    ./nimbus &
    PID=$(ps -A | grep nimbus | cut -d' ' -f1)
    echo "PID for nimbus process is $PID"
else
    echo "Could not get server output. Abort!"
fi

# then set the dev environment - back to project root.
cd ../
echo "Setting node environment to development - and running the development server."

other_commands() {
    printf "ControlC caught"
    echo "Trying to kill $PID"
    $RESULT = $(kill $PID)
    echo "Result is $RESULT"

    exit 0
}

trap 'other_commands' INT TERM

$DEVOUTPUT = $(NODE_ENV="development" webpack-dev-server --hot --open)
