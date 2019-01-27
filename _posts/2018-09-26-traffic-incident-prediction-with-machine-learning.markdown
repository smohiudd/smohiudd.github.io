---
layout: post
title:  "Using Open Data and Machine Learning to Predict Traffic Collisions"
date:   2018-09-26 00:00:00 -0700
description: "With the recent release of a traffic incident data set in Calgary, I was interested in utilizing the data to create a simple prediction model using machine learning. The availability of traffic incident data is still lacking in parts of Canada and its release can create an opportunity to analyze, interpret and predict urban transport behaviours."
---
### With the recent release of a traffic incident data set in Calgary, I was interested in utilizing the data to create a simple [prediction model][model] using machine learning. The availability of traffic incident data is still lacking in parts of Canada and its release can create an opportunity to analyze, interpret and predict urban transport behaviours.

Traffic collision data in Canada is not easy to find. Although municipalities, provinces and other jurisdictions collect and report data to the Transport Canada National Collision Database (NCDB), finding detailed data sets can be challenging. Sometimes the best you can find is statistical summary reports like [this](https://open.alberta.ca/dataset/25020446-adfb-4b57-9aaa-751d13dab72d/resource/9a5762e0-9113-4b87-bb4d-c05625431b6b/download/albertacollisionstatisticssummary2016.pdf) or [this](https://vancouver.ca/streets-transportation/collision-injury-data.aspx), but finding more granular information such as latitude and longitude coordinates of traffic collisions is next to impossible. The City of Calgary is one of the few jurisdictions that recently released a [traffic collision dataset](https://data.calgary.ca/Transportation-Transit/Traffic-Incidents/35ra-9556) through their Open Data portal and includes details such as lat/lon coordinates, time stamp and incident type and is updated in real time. With the lack of open vehicle collision data available in Canada, there has been some [attention](https://www.thestar.com/edmonton/2018/08/09/open-data-advocate-pushes-for-collision-information-after-alberta-road-deaths.html) brought to the issue. But more must be done to ensure governments provide data sets that can be used to interpret urban transport behaviours.

![collision map](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/collision-prediction/incident_screenshot3.png)

Although it sounds fancy, the machine learning model I created was basically a logistic regression statistical model, a method that been around since the 50s. After training the model, I developed a visualization using Mapbox. The user selects different parameters and sees a mapped probability of a traffic collision occurring at a given location in Calgary. 

I retrieved around 10,000 traffic incidents data points in Calgary between Dec 2016 and Sept 2018. After some data manipulation and ['feature engineering'](https://developers.google.com/machine-learning/crash-course/representation/feature-engineering), I trained the model with the training data using the architecture in this [academic paper](http://urbcomp.ist.psu.edu/2017/papers/Predicting.pdf). To simplify the model and the user interface, I only used temporal features (month, day of week, hour). The final result can be seen [here](https://smohiudd.github.io/calgary-traffic-collision/).

The results do align with the intuition of where collision incidents would occur at a given time. For example, peak hour traffic (i.e. 5pm) would see the highest probability distribution vs 2am or on Sunday. You can also see how the spatial distribution of incidents changes over time. Weekend and evenings will see more collisions outside the downtown core or major roads/intersections vs week days. And the usual hot spots such as Glenmore/Crowchild or Deerfoot/16 Ave seem to consistently light up.

10,000 data points over two and half years is not nearly enough data to develop an accurate machine learning model. The journal article listed above used over 450,000 data points over 8 years and had more features (temperature, wind speed, road geometry, etc.). However, the model and visualization for Calgary shows us how even a modest amount of data can give us the means to present interesting analysis and prediction.

_You can find out more [here](https://nodalscapes.wordpress.com/2018/09/11/traffic-incident-prediction-model-using-machine-learning/) about the technical details on how I developed the machine learning model._

[model]:https://smohiudd.github.io/calgary-traffic-collision/
