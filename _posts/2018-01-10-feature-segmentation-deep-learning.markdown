---
layout: post
title:  "Streetscape Feature Segmentation with Deep Learning"
date:   2018-01-10 00:00:00 -0700
---
I've been a little obsessed with artificial neural networks recently. A couple weeks ago I came across some research by the Machine Intelligence Lab at Cambridge which led to a segmentation program called [SegNet](http://mi.eng.cam.ac.uk/projects/segnet/). The accuracy of predicting and segmenting streetscape features had me curious about how the program worked.

Way back in 2013 I was dabbling in OpenCV, machine learning and image segmentation and did a lot of research about segmentation methods. Beside algorithms such as histogram back projection or nearest neighbour methods it didn't seem like there was much open source code about any successful applications.  Any methods that I did use were either inaccurate or just too slow and computationally costly to be effective. So, I gave up on image segmentation for a while.

Picking up on the topic again in 2018 I was amazed by the progress that has been made over past 5 years. Artificial Neural Networks (ANN) and machine learning have taken off as the latest science to solve many segmentation problems in computer vision, speech recognition, medical diagnosis among other fields.

At its most basic level, an ANN is a sort of bio mimicry inspired by biological neural networks in animal brains. It consists of a collection of connected nodes and connections that "learn" based on a specific algorithm.

The math behind the concepts isn't that complicated for a basic ANN. I suggest reading ["Make Your Own Neural Network"](https://www.amazon.ca/Make-Your-Own-Neural-Network-ebook/dp/B01EER4Z4G) by Tariq Rashid that simply breaks down the assembly of your very own ANN that you can understand with even high school math.

As I mentioned, I was intrigued by the results of SegNet and wanted to get it running on my machine to test with input images. SegNet is based on [Caffe](http://caffe.berkeleyvision.org/) (and uses [Convolutional Neural Network](http://cs231n.github.io/convolutional-networks/), CNN Or Covnet, which I'm not even going to try and explain here), a deep learning library developed by [BAIR](http://bair.berkeley.edu/) at the University of Berkely. The program compiling process turned out to be way more complicated than I expected. The creators of SegNet have a very useful [tutorial](http://mi.eng.cam.ac.uk/projects/segnet/tutorial.html) but the process of installing Caffe involved a lot of troubleshooting. After a few days, I finally got Caffe with python bindings to work.

The thing about deep learning and neural networks is that they take a lot of resources to train. Like, I'm saying you need a 12GB Nvidia GPU to train an image data set in a reasonable amount of time. Otherwise your dinky GPU-less computer could take days running at full speed to train a model. Luckily, the folks of SegNet have [pre-trained models](https://github.com/alexgkendall/SegNet-Tutorial/blob/master/Example_Models/segnet_model_zoo.md) for personal or educational use.

After many grueling hours of work, the result is the image below which segments streetscape features. The results aren't bad but of course could use some refinement. This has been a pretty interesting experience learning about ANNs and how they work and I'm hoping to dig further into streetscape feature segmentation.

!['Street'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/misc/calgary3.png)

!['Segmentation'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/misc/seg.png)
