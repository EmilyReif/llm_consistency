import collections
from absl import app
from flask import Flask, make_response, request, send_file
from flask_cors import CORS, cross_origin
import functools
import time
import json


class Handler:

    def respond(self, request, content, content_type, code=200):
        return make_response(content)


def hi_world(handler, request, useful_arg: str):
    time.sleep(1)
    result = json.dumps({"a test key": useful_arg})
    return handler.respond(request, result, "text/json", 200)


def get_handlers(useful_arg: str):
    return {
        "/hi_world": functools.partial(hi_world, useful_arg=useful_arg),
    }


def main(argv: collections.abc.Sequence[str]) -> None:
    """Create the flask app, and wrap the server api methods."""
    del argv
    flask_app = Flask(__name__, static_url_path="", static_folder="ui/build")
    CORS(flask_app, resources={r"*": {"origins": "http://localhost:3000"}})

    @flask_app.route("/")
    def index():
        return send_file("ui/build/index.html")

    # Managers or data to be passed to handlers.
    useful_arg = "hello world"
    default_handler = Handler()
    for route, handler in get_handlers(useful_arg).items():
        flask_app.add_url_rule(
            route,
            endpoint=route,
            view_func=handler,
            defaults={"request": request, "handler": default_handler},
        )
    flask_app.run(debug=True, host="0.0.0.0", port=5432)


if __name__ == "__main__":
    app.run(main)
