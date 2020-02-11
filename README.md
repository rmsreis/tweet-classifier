# Tweet-Geolocation-Classifier

A multi-text app to geolocate tweets in United Kingdom and Ireland

- Data was downloaded from: http://followthehashtag.com/datasets/170000-uk-geolocated-tweets-free-twitter-dataset/

- We use Python/Jupyter Notebook to implement LinearSVC (Support Vector Classifier) within Scikit-Learn package.
- From more the 170 000 tweets we have succesfully reverse geocoded more than 50 000 using Google API to feed our traning model.
- Model scores ... % on the testing data
- Data was transported using Flask to a font end prepared with html, bootstrap and js

## How to use:

- Insert a text on the box and click submit, the model will predict the most likely county from where your tweet is from (including the probabilities)

The final app is deployed on Heroku here: 

Enjoy!

Roberto (@rmsreis), Jonathan(@jonathanpiech) and Patrick(@pqmurphy)
