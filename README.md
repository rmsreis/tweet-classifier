# Tweet-Geolocation-Classifier

A multi-text app to geolocate tweets in United Kingdom and Ireland

- Data was downloaded from: http://followthehashtag.com/datasets/170000-uk-geolocated-tweets-free-twitter-dataset/

- We used Python (in Jupyter Notebook) to implement LinearSVC (Support Vector Classifier) within Scikit-Learn package.
- From more the 170 000 tweets we have succesfully reverse geocoded more than 50 000 using geotagged 'latitude' and 'logitude' in the dataset and Google Geocoding API to feed our traning model.
- LinearSVC Model scores about 60 % on the testing data
- Data and model were transported using Flask to a font end prepared with html, bootstrap and js

## Tools/Packages Used
- Scikit Learn (for models LinearSVC, Random Forest, etc..)
- Keras (for Deep Learning/LSMT)
- Pandas
- Numpy
- Matplotlib (and Seaborn)

## How to use:

- Insert a text on the box and click submit, the model will predict the most likely county in the UK or Ireland from where your tweet is from (including the probabilities!!)

App is available on Heroku: https://uk-tweet-classifier.herokuapp.com Enjoy!

Roberto (@rmsreis), Jonathan(@jonathanpiech) and Patrick(@pqmurphy) 
