from flask import Flask, jsonify, render_template, request, json
from tensorflow.keras.models import load_model

app = Flask(__name__)

@app.route("/")
def index():
    #Returns homepage
    return render_template("index.html")


@app.route("/predict", methods=['POST'])
def predict():

    #Gets tweet from text box
    tweet = request.form['tweet']

    #Need model manipulation

    #Sample change output
    output = tweet + "ADDED"

    #Returns json
    return jsonify({'output': output})


if __name__ == "__main__":
    app.run(debug=True)