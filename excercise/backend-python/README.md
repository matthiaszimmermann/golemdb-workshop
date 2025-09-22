## Starting the Python Server (Backend)

1. If you don't have **uv** installed, visit [docs.astral.sh/uv](https://docs.astral.sh/uv/) for installation instructions.

2. Navigate to the `excercise/backend-python` directory in the workshop repo.

3. Start the server:

   ```bash
   uv run fastapi dev main.py
   ```

The server should now be running at [localhost:8000](http://localhost:8000).
Corresponding OpenAPI docs are available at [localhost:8000/docs](http://localhost:8000/docs).
