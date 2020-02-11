from flask import Flask, jsonify, render_template, request

# Dependencies
from sklearn.svm import LinearSVC
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_extraction.text import CountVectorizer

# Import Classification Model from file
from sklearn.externals import joblib
tfidf = joblib.load('static/model/transf.pkl')
clf2  = joblib.load('static/model/tweet_classifier2.pkl')
id_to_category = joblib.load('static/model/id_reverse.pkl')

app = Flask(__name__)

@app.route("/")
def index():
    #Returns homepage
    return render_template("index.html")


@app.route("/predict", methods=['POST'])
def predict():

    #Gets tweet from text box
    tweet = [request.form['tweet']]

    #Need model manipulation

    """
    Classify a tweet by city 
    """

    # text_features = tfidf.transform(tweet)
    # predictions = clf2.predict(text_features)
    # location = id_to_category[predictions[0]]

    #Sample change output
    # output = tweet + "ADDED"

    output = {'name': 'Highland', 'prob': '98'}
    # output = tweet

    #Returns json
    return jsonify({'output': output})

if __name__ == "__main__":
    app.run(debug=True)