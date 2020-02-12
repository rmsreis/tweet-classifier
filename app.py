from flask import Flask, jsonify, render_template, request, json

# Dependencies
from sklearn.svm import LinearSVC
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_extraction.text import CountVectorizer

# Import Classification Model from file
from sklearn.externals import joblib

#model
model_filename = 'static/model/svc_classifier.pkl' 

#transformer
transformer_filename = 'static/model/svc_transf.pkl'

#count_vect
counter_filename = 'static/model/svc_counter.pkl'

# County labels
labels_filename = 'static/model/county_labels.pkl'


# labels = joblib.load(labels_filename)
# tf = joblib.load(transformer_filename)
# count = joblib.load(counter_filename)

# clf = joblib.load(model_filename)

app = Flask(__name__)

@app.route("/")
def index():
    #Returns homepage
    return render_template("index.html")


@app.route("/predict", methods=['POST'])
def predict():

    labels = joblib.load(labels_filename)
    tf = joblib.load(transformer_filename)
    count = joblib.load(counter_filename)
    #Gets tweet from text box

    clf = joblib.load(model_filename)

    tweet = [request.form['tweet']]

    #Need model manipulation

    """
    Classify a tweet by city 
    """

    text_count = count.transform(tweet)
    text_features = tf.transform(text_count)
    predictions = pd.DataFrame(clf.predict_proba(text_features)*100, columns=labels.classes_).transpose()


    result = predictions.sort_values(0, ascending = False).head(10).to_json()
    #Sample change output
    # output = tweet + "ADDED"

    data = result['0']

    empty = []
    for county in data:
            # print(county)
        print(data[county])
        empty.append(json.loads('{"name": "' +county+ '", "prob": "' +str(data[county])+ '"}'))



    # output = {'name': 'Highland', 'prob': '98'}
    # output = tweet

    #Returns json
    return jsonify({'output': empty})

if __name__ == "__main__":
    app.run(debug=True)