from flask import Flask, jsonify, render_template, request, json
import pandas as pd
from sklearn.svm import LinearSVC
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.externals import joblib

app = Flask(__name__)

#model
model_filename = 'static/model/svc_classifier.pkl' 
#transformer
transformer_filename = 'static/model/svc_transf.pkl'
#count_vect
counter_filename = 'static/model/svc_counter.pkl'
# County labels
labels_filename = 'static/model/county_labels.pkl'

#Load parts of model
labels = LabelEncoder()
labels = joblib.load(labels_filename)
tf = joblib.load(transformer_filename)
count = joblib.load(counter_filename)
clf = joblib.load(model_filename)

@app.route("/")
def index():
    #Returns homepage
    return render_template("index.html")


@app.route("/predict", methods=['POST'])
def predict():

    # #Gets tweet from text box
    tweet = [request.form['tweet']]

    #Run model for tweet
    text_count = count.transform(tweet)
    text_features = tf.transform(text_count)

    #Place predictions in dataframe
    predictions = pd.DataFrame(clf.predict_proba(text_features)*100, columns=labels.classes_).transpose()
    
    #Round
    predictions[0] = predictions[0].round(2)

    #Get top 10
    result = predictions.sort_values(0, ascending = False).head(10).to_dict()
    data = result[0]

    #Format for Javascript variable probdata
    empty = []
    for county in data:
        empty.append(json.loads('{"name": "' +county+ '", "prob": "' +str(data[county])+ '"}'))

    #Returns json
    return jsonify({'output': empty})

if __name__ == "__main__":
    app.run(debug=True)