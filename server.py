import collections
from absl import app, flags
from flask import Flask, make_response, request, send_file
from flask_cors import CORS
import functools
import json
import data_storage
import consistency_helpers
import pandas as pd
import llm_manager
api_key = ''



class Handler:

    def respond(self, request, content, content_type, code=200):
        return make_response(content)


def get_dataset(handler, request, inputs_data):
    # transforms = consistency_helpers.TRANSFORMS + ['original question']
    # dataset = {t: inputs_data[t].to_list() for t in transforms}
    dataset = inputs_data.fillna('').to_dict() # TODO: where do the NANs come from?
    return handler.respond(request, json.dumps(dataset), "text/json", 200)

def get_generations(handler, request, generations, llm: llm_manager.ConcurrentOpenAILLM):
    input = request.args.get("input")
    n = int(request.args.get("n")) or None
    temp = float(request.args.get("temp")) or None

    if input in generations:
        dataset = generations[input]
    else:
        print('OUTPUTS')
        print(input, n, temp)
        dataset = llm.call(input, n, temp)
        print(dataset)
    dataset = json.dumps({"generations": dataset})
    return handler.respond(request, dataset, "text/json", 200)


def get_handlers(inputs_data: pd.DataFrame, generations, llm):
    return {
        "/get_dataset": functools.partial(get_dataset, inputs_data=inputs_data),
        "/get_generations": functools.partial(get_generations, generations=generations, llm=llm),
    }


def main(argv: collections.abc.Sequence[str]) -> None:
    """Create the flask app, and wrap the server api methods."""
    del argv
    flask_app = Flask(__name__, static_url_path="", static_folder="ui/build")
    CORS(flask_app, resources={r"*": {"origins": "http://localhost:3000"}})

    @flask_app.route("/")
    def index():
        return send_file("ui/build/index.html")

    llm = llm_manager.ConcurrentOpenAILLM(api_key=api_key)
    inputs_data = pd.DataFrame(data_storage.load_or_create_stats()).transpose()
    generations = data_storage.load_or_create_multi_generations()

    default_handler = Handler()
    for route, handler in get_handlers(
        inputs_data=inputs_data, generations=generations, llm=llm
    ).items():
        flask_app.add_url_rule(
            route,
            endpoint=route,
            view_func=handler,
            defaults={"request": request, "handler": default_handler},
        )
    flask_app.run(debug=True, host="0.0.0.0", port=5432)


if __name__ == "__main__":
    app.run(main)
