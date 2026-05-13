import os
from flask import Flask, request, jsonify
from app.calculator import add, sub, mul, div

app = Flask(__name__)


def parse_params():
    a_raw = request.args.get("a")
    b_raw = request.args.get("b")
    if a_raw is None or b_raw is None:
        return None, (jsonify({"error": "Paramètres 'a' et 'b' requis"}), 400)
    try:
        return (float(a_raw), float(b_raw)), None
    except ValueError:
        return None, (jsonify({"error": "Paramètres 'a' et 'b' doivent être numériques"}), 400)


@app.route("/add", methods=["GET"])
def route_add():
    params, error = parse_params()
    if error:
        return error
    a, b = params
    return jsonify({"result": add(a, b)})


@app.route("/sub", methods=["GET"])
def route_sub():
    params, error = parse_params()
    if error:
        return error
    a, b = params
    return jsonify({"result": sub(a, b)})


@app.route("/mul", methods=["GET"])
def route_mul():
    params, error = parse_params()
    if error:
        return error
    a, b = params
    return jsonify({"result": mul(a, b)})


@app.route("/div", methods=["GET"])
def route_div():
    params, error = parse_params()
    if error:
        return error
    a, b = params
    try:
        return jsonify({"result": div(a, b)})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
