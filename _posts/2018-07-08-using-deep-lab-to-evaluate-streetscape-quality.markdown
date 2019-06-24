---
layout: post
title:  "Using Google DeepLab v3+ to Evaluate Streetscape Quality"
date:   2018-07-08 00:00:00 -0700
published: true
description: "I wrote a simple script that extracted the pedestrian routing options from Google Maps, cut the routes into smaller segments and finally applied an algorithm that scored the DeepLab output of Google Street View images. To visualize the scores, I made a simple interactive map with MapBox and React"
---
### I'm a little late posting a follow up to my [original article](https://nodalscapes.wordpress.com/2018/02/07/using-neural-networks-to-understand-street-quality/) about using Machine Learning, specifically Deep Learning to help segment and classify streetscapes. It was actually the release of [Google's Deep Lab V3+ Convolutional Neural Network (CNN)](https://ai.googleblog.com/2018/03/semantic-image-segmentation-with.html) in March 2018 that drew me back to this topic. Here is the [final result](final result) of evaluating pedestrian routes in the Ramsay neighbourhood of Calgary.

CNN's are considered the most effective in computer vision applications including image segmentation. In fact, my previous article used an older CNN architecture from 2015 called Segnet and I was curious to find out how DeepLab preformed. Thankfully, Google released some pre trained model [checkpoints](https://github.com/tensorflow/models/blob/master/research/deeplab/g3doc/model_zoo.md) which I was able to use as a quick proof of concept. DeepLab is trained on the [CityScapes dataset](https://www.cityscapes-dataset.com/) which was perfect for my task of assessing street scape quality.

I wrote a simple script that extracted the pedestrian routing options from Google Maps, cut the routes into smaller segments and finally applied an algorithm that scored the DeepLab output of Google Street View images. To visualize the scores, I made a simple [interactive map](https://smohiudd.github.io/street-score-map/) with MapBox and React - yellow represents higher scores, red are lower scores. The scores are normalized between 0 and 1 with the higher scores representing a more balanced street scape (less area for roads, and more for sidewalks and trees) which may have more aesthetic or walkable qualities.

![street score](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street-score/screenshot.jpg)

The results are predictable but not without some error - areas where you'd expect a higher score (i.e. areas with a lower ratio of roadway) were scored lower by the algorithm on some segments. Some areas shown as yellow in the map are no where near what you would consider a "quality" street. This was mainly due to the incorrect classification by the CNN. For example the image below shows how the CNN classified much of the image incorrectly as "vegetation". In reality you would score this street very low because of the lack of sidewalk.

![pic 1](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street-score/seg_image1.jpg)

Below is an example of what you'd expect for a correctly classified google street view image. The incorrectly classified image in the first example is expected since I'm using the model pre trained on the Cityscapes dataset. To improve accuracy, it would be best to utilize some transfer learning and re-train the last few CNN layers with a new Google Street View image data set.

![pic 2](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street-score/seg_image3.jpg)
