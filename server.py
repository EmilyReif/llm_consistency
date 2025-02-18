import collections
from absl import app, flags
from flask import Flask, make_response, request, send_file
from flask_cors import CORS
import functools
import json
import data_storage
import consistency_helpers
import pandas as pd



class Handler:

    def respond(self, request, content, content_type, code=200):
        return make_response(content)


def get_dataset(handler, request, inputs_data):
    # transforms = consistency_helpers.TRANSFORMS + ['original question']
    # dataset = {t: inputs_data[t].to_list() for t in transforms}
    dataset = inputs_data.to_dict()
    return handler.respond(request, json.dumps(dataset), "text/json", 200)

def get_generations(handler, request, generations):
    input = request.args.get("input")
    dataset = json.dumps({"generations": generations[input]})
    return handler.respond(request, dataset, "text/json", 200)


def get_handlers(inputs_data: pd.DataFrame, generations):
    return {
        "/get_dataset": functools.partial(get_dataset, inputs_data=inputs_data),
        "/get_generations": functools.partial(get_generations, generations=generations),
    }


def main(argv: collections.abc.Sequence[str]) -> None:
    """Create the flask app, and wrap the server api methods."""
    del argv
    flask_app = Flask(__name__, static_url_path="", static_folder="ui/build")
    CORS(flask_app, resources={r"*": {"origins": "http://localhost:3000"}})

    @flask_app.route("/")
    def index():
        return send_file("ui/build/index.html")

    inputs_data = pd.DataFrame(data_storage.load_or_create_stats()).transpose()
    generations = data_storage.load_or_create_multi_generations()

    default_handler = Handler()
    for route, handler in get_handlers(
        inputs_data=inputs_data, generations=generations
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
