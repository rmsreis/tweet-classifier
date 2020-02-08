# Dependencies
import numpy as np
import pandas as pd
from sklearn import *
from sklearn.svm import LinearSVC
from sklearn.model_selection import cross_val_score
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer

# Import Classification Model from file
from sklearn.externals import joblib
tfidf = joblib.load('transf.pkl')
clf2  = joblib.load('ML_model/tweet_classifier2.pkl')
id_to_category = joblib.load('ML_model/id_reverse.pkl')

def classify_tweet(tweet):
    """
    Classify a tweet by city 
    """
    text_features = tfidf.transform(tweet)
    predictions = clf2.predict(text_features)
    # print("  - Predicted as: '{}'".format(id_to_category[predictions[0]]))
    location = id_to_category[predictions[0]]
    
    return print(f' - Predicted as: {location}')

print("type a tweet")
text = [str(input())]

classify_tweet(text)


