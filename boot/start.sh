# !/bin/bash

source /opt/venv/bin/activate

# Check if the virtual environment is activated
if [[ "$VIRTUAL_ENV" != "/opt/venv" ]]; then
    echo "Error: Virtual environment is not activated."
    exit 1

# execute the app on port 8080
cd /src_code
RUN_PORT=${RUN_PORT:-8080}
RUN_HOST=${RUN_HOST:-0.0.0.0}


# run the app
gunicorn -k uvicorn.workers.UvicornWorker -b $RUN_HOST:$RUN_PORT app.main:app --reload


# Check if the app is running
if pgrep -f "uvicorn app.main:app $RUN_HOST:$RUN_PORT" > /dev/null; then
    echo "App is already running."
else
    # Start the app
    echo "Starting the app..."
    exec uvicorn app.main:app --host $RUN_HOST --port $RUN_PORT
