---
layout: post
title:  "Predict and Visualize Traffic Collisions using Keras and tensorflow.js"
date:   2018-09-26 00:00:00 -0700
---
### A simple traffic collision predictor and visualization created using Keras, tensorflow.js, React and Mapbox.

Recently I began exploring the idea of using machine learning to predict traffic incidents. I was surprised to find a recent paper: [Predicting Traffic Accidents Through Heterogeneous Urban Data: A Case Study](http://urbcomp.ist.psu.edu/2017/papers/Predicting.pdf) by several researchers from the University of Iowa. They did a comparative analysis of using several machine learning methods (SVM, Decision Trees, Random Forest) including deep neural networks (DNN) to develop a binary classification model for predicting traffic incidents in Iowa using data over 8 years.  The authors considered many features in their model including temporal (hour, day, time to sunrise), weather (temperature, wind speed), road features (curvature, speed limit) and human factors (population density, average daily traffic). You can read the paper in more detail however the DNN performed best out of all methods with an F1 score of 90%.

I wanted to create a similar (simplified) DNN model along with a visualization using traffic incident data in Calgary. Using the Open Data portal and Socrata API, I was able to use [traffic incident data](https://data.calgary.ca/Transportation-Transit/Traffic-Incidents/35ra-9556) between 2016 to current day with approximately 10,000 data points. I then fed the training data into a DNN (basically a logistic regression model) that would classify, based on some input parameters, the probability of an traffic incident occurring in a given area. To visualize the data in a more convenient way, I mapped all the probabilities and created a user interface so the user could see how adjusting parameters would change the mapped probabilities. Below, I've outlined my process and methodology in creating the model and visualization.

#### Data Collection and Analysis

The authors of the paper performed a spectral clustering task of the Iowa road network to group the incidents into clusters. I instead used another method to group the incidents: [geohashes](https://en.wikipedia.org/wiki/Geohash). There were a couple reasons for this. First, it was a lot simpler to geohash the lat/lon coordinates and second it would later help me in the visualization. There was obviously a trade off in doing this since it would unbalance by data: some geohashes would have a lot more incidents than others. In exploring clustering methods I came across a spatial clustering algorithm called DBSCAN. It stands for _Density-based spatial clustering of applications with noise_ and clusters points based on proximity to other points and considers far away points as noise. As an exercise to understand the clustering of traffic collisions I clustered the points using the DBSCAN algorithm.

I used pandas mostly for the data collection and analysis. Using the Open Data Socrata API, I created a pandas dataframe. From there, I geohashed the lat/lon coordinates and extracted the temporal features from the datetime string (i.e. day, hour, month).

```python
df = pd.DataFrame(data)
df['start_dt'] = pd.to_datetime(df['start_dt'])
df['latitude'] = pd.to_numeric(df['latitude'])
df['longitude'] = pd.to_numeric(df['longitude'])
df["geohash"] = df.apply(lambda x: Geohash.encode(x["latitude"],x["longitude"],precision=5), axis = 1)
df = df[['start_dt','latitude','longitude','geohash']]

df.head()

start_dt latitude longitude geohash
0 2016-12-09 16:46:32 51.097316 -114.083318 c3nfe
1 2016-12-09 16:58:23 51.070539 -114.081378 c3nfs
2 2016-12-09 17:14:08 51.067299 -113.984934 c3nfw
3 2016-12-09 17:16:08 51.152736 -114.147933 c3ng4
4 2016-12-09 17:38:05 51.119684 -114.203241 c3nfc
```

Creating a histogram of the temporal features helped me to understand the distribution of traffic incidents during various periods. From the figure below, we can confirm our intuition about incidents occurrences being higher on weekdays and during rush hour periods. I was surprised to see more collisions in June than any other month.

Now, with binary classification tasks we always need negative samples. We have the positive samples from the data but how do we get the negative samples? The paper used negative sampling method of taking a positive data point and randomly adjusting the month, hour or road features and then checking if it was still a positive data point. If it was not, then they added it to the negative samples. For logistic regression it's important to ensure your dataset is representative of the overall population distribution. Traffic accidents may seem like they occur all time but when you consider a temporal viewpoint, they're quite rare events. Therefore when constructing an overall dataset, particularly with some artificial data, its important to make sure your dataset is representative of what you actually see in real life. The paper had a 1:3 ratio of positive to negative samples.

#### Feature Engineering

You always hear how important feature engineering is a machine learning project but you never really know until you're wondering why your model's performance sucks. You then realize that you haven't spent enough time exploring your data, and extracting good features.

For the time series data, it made sense to consider month, day of week and hour. An often forgotten aspect of time series data is that is cyclical. To help the model learn effectively, we need to encode the time series data and interpret the data as an (x,y) coordinate on a circle. Here is a really good example that shows how to do this.

```python
sin = np.sin(np.float64(2 * np.pi * month/12))
cos = np.cos(np.float64(2 * np.pi * month/12))
```

For the geohash location feature I used one hot categorical encoding.

#### Creating the Model

Once the data and features were sorted out, creating the model was trivial. I used Keras to create the model using an architecture similar to the paper. The model had three hidden layers with 100,160 and 200 nodes respectively with dropout regularization. I had more success with a simpler model so used three layers with 50 nodes each. This google article provides some insight into the advantages of using simpler models when it comes to overfitting. The results I achieved were comparable to the paper, around 95% accuracy and F1 score of 85%.

#### Creating the Visualization

Finally I used my go-to visualization combination at the present time: React and Mapbox! And this also gave me a chance to try out tensorflow.js, recently released, that allows us to perform inference and even training in the browser. Based on the amount of data we're playing with for this model, training in the browser was painfully slow, so we'll just stick to inference at the moment. Luckily we can load the Keras model and perform the inference using tensorflow.js. The final result can be found here and the github repo for the React/Mapbox visualization


**[1] Yuan, Z., Zhou, X., Yang, T., & Tamerius, J. (2017). Predicting Traffic Accidents Through Heterogeneous Urban Data : A Case Study.**
