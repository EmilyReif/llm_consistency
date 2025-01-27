
# Simple TS + Python app
A simple front and backend app for vis experiments.

# Demo
## Running the server

```
$ python -m venv ts_py_server && . ts_py_server/bin/activate && pip install -r requirements.txt
$ python -m server
```

## Watch the typescript/css/html
In a separate terminal window, build the frontend code, watching and rebuilding on new changes.

```
$ cd ui && yarn && yarn start
```
Navigate to 
http://localhost:5432/

## Jupyter notebook
Also a utility jupyter notebook for debugging and quick experimentation.
