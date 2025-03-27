
# Consistency 
Experiments and visualizations for better understanding and visusalizing inconsistency in LLM outputs.

# Demo
## Running the server

To run the server:

```
$ python -m venv ts_py_server && . ts_py_server/bin/activate && pip install -r requirements.txt
$ python -m server
```

NOTE: to run the server, you must first create an 'api_keys.py' file with your OpenAI API key. This is imported in various places to run the llm.

`OPENAI_API_KEY='...'`

## Watch the typescript/css/html
In a separate terminal window, build the frontend code, watching and rebuilding on new changes.

```
$ cd ui && yarn && yarn start
```
Navigate to 
http://localhost:5432/

## Jupyter notebook experiments
See individual ipynb notebooks for descriptions of each experiment.

NOTE: to run these notebooks, you must first create an 'api_keys.py' file with your OpenAI API key. This is imported in various places to run the llm.

`OPENAI_API_KEY='...'`