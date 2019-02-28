---
layout: post
title:  "Using Deep Learning to Perceive Streetscape Quality"
date:   2018-02-07 00:00:00 -0700
published: false
description: "With semantic segmentation of street images, the usual question is: how can this be applied to autonomous driving? With street features such as light poles, pedestrians and road markings identified in the output model inference, this can help us greatly in navigating the physical environment."
---
Through my research on the basic operations of Artificial Neural Networks (ANN) and deep learning I've experimented with Caffe and a (somewhat) dated program called [Segnet](http://mi.eng.cam.ac.uk/projects/segnet/). Although it was developed in 2015 I was intrigued by the application of pixel wise segmentation of streets.

With semantic segmentation of street images, the usual question is: how can this be applied to autonomous driving? With street features such as light poles, pedestrians and road markings identified in the output model inference, this can help us greatly in navigating the physical environment.

However, I'm curious how the neural network output can help us identify the quality of a street. What the ANN is interpreting and what we see as humans are not entirely different. For example, a well balanced streetscape includes a variety of features such as buildings, sidewalks, landscaping, while minimizing road space. Conversely, a street used mainly as an automobile skeleetal road would not have a diverse set of features.

The images below show a section view of an Urban Boulevard and Skeletal Road based on the [City of Calgary Complete Streets](http://www.calgary.ca/Transportation/TP/Pages/Planning/Calgary-Transportation-Plan/Complete-Streets.aspx) classification. Even without a real image of the street you immediately notice the difference in street quality. You can even infer the experience for pedestrians or cyclists based on features such as wider sidewalks, landscaping or street furniture.

!['Urban Boulevard'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/misc/urban_boulevard.jpg)

!['Skeletal'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/misc/skeletal.jpg)

If we look at real images and the corresponding ANN output of an urban boulevard and skeletal road you can see how easy it is to interpret street quality. That's what I'm hoping to achieve using neural networks to infer street features and determine a measure of perceived streetscape quality based on input images. The segmented output results aren't perfect but they will allow us to reasonably assess streetscape quality.

!['17 Ave'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/misc/17AVSW1.png)

!['17 Ave Segmentation'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/misc/17AveSeg.png)

!['Deerfoot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/misc/DEERFOOT.png)

!['Deerfoot Segmentation'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/misc/Deerfoot_seg.png)

By inputting images taken at regular intervals along a street into a ANN, interpreting the output and plotting the results on a map, how would that help us understand street quality throughout a City? That's what I'm hoping to explore in the coming weeks so stay tuned!
