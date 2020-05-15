---
layout: post
title:  "Perceiving Streetscape Quality with Semantic Segmentation of Street-Level Imagery: Experimenting with Deeplab V3"
date:   2020-05-15 00:00:00 -0700
description: ""
excerpt_separator: <!--more-->
---

### I had previously posted an [article](https://saadiqm.com/2018/07/08/using-deep-lab-to-evaluate-streetscape-quality.html) about using the [DeepLab V3+](https://ai.googleblog.com/2018/03/semantic-image-segmentation-with.html) atrous convolution neural network model to segment street level images and use the output to assess streetscape quality. My prior results were poor because I was using an off-the-shelve model using the Cityscapes dataset. In this post I discuss training Deeplab V3+ on my own dataset using transfer learning and visualizing the segmentation of classes in a city.

<!--more-->



<style>
.caption {
  font-size: 13px;
  font-style: italic;
  margin-top:0px;
  text-align: left;
}

.references {
  font-size: 12px;
}

.post-meta, .page-link, .site-title, .footer-col, .username
{
  color:white !important;
}

.highlight{
  color:#000
}

a, a:visited{
  color:white !important;
}

a:hover{
  color:grey !important;
}

body {
  background-color: black;
  color: white;
}

</style>

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street_score_fraction/segmentation.png)

Over last couple years, I’ve written a number of posts about the concept of using computer vision and semantic segmentation of street-level imagery to help perceive streetscape quality. In one [post](https://saadiqm.com/2018/07/08/using-deep-lab-to-evaluate-streetscape-quality.html), I used a DeepLab V3+ model trained on the [CityScapes](https://www.cityscapes-dataset.com/) dataset to predict segmentation masks of street-level images. The results were poor because my input prediction images varied in quality from the images the model was trained on. Before explaining my process of transfer learning a new dataset on the Deeplab Model, let’s discuss the concept of streetscapes. 

### What is a Streetscape?

A streetscape comprises the elements of a street including the roadway, buildings, sidewalk, open spaces, street furniture, trees, landscaping and other elements that combine to form the street character. They are formed by layers that comprise a street and are divided into private frontage (porches, stoops, fences, and yards), public frontage (sidewalks, street planters, trees and other vegetated landscaping, benches, lamp posts, and other street furniture) and vehicular lanes (space from curb to curb)([pedshed](http://pedshed.net/?page_id=5)). Streets that are void of a particular element of public or private frontage layers in the street are seen by urban designers as generally of lower quality. Intuitively, if we think of, for example, arterial multi lane roadways with minimal building frontage, public amenities such as sidewalks, trees or landscaping, we often consciously or not, perceive these places as uninteresting or unsafe. 

### Perceiving Streetscape Quality

Is there a way to quantify our perception of streetscape quality? I came across an interesting paper by Ewing and Handy titled **“Measuring the Unmeasurable: Urban Design Qualities Related to Walkability”**. The authors attempt to objectively measure qualities of urban streets environments based on physical characteristics of streetscapes. By relating physical features of streets such as street width, tree canopy or building height to abstract urban design qualities and rating streetscape scenes they were able to determine which physical qualities are statistically associated with an urban design quality. The urban design qualities stated in the paper give us a good perspective into perceptual qualities that make some streets higher quality that others:

* **Imageability** - Quality of a physical environment that evokes a strong image in an observer and a sense of place. A highly imageable street contains distinct parts that are instantly recognizable.

* **Enclosure** - When sight lines are blocked, a sense of enclosure results in outdoor spaces seeming “room-like”. People react favorably to these boundaries as something safe and memorable.

* **Human Scale** - Keeping buildings and structures within certain and heights and proportions so as to be approachable by humans.

* **Transparency** - The literal idea of allowing light to pass between the indoors and outdoors (i.e. shop with display windows) or the idea of a street with many entryways inciting the perception of human activity.

* **Complexity** - Interesting things to look at along a street such as building details, signs, people, surfaces, changing light patterns and movement.


The difference in perceptual quality are recognizable when we examine the following streetscape examples. How do the perceptual qualities vary among these different scenes?

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street_score_fraction/IMG_2470.jpg)
This scene encompasses a good mix of all the perceptual qualities including imageability, enclosure, human scale, transparency and complexity.
{: .caption}

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street_score_fraction/IMG_2471.jpg)
Although this scene has a sense of enclosure it lacks human scale.
{: .caption}

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street_score_fraction/IMG_2474.jpg)
The large setbacks, lack of buildings and greater proportion of roadway in this scene downgrade the imageability and enclosure.
{: .caption}

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street_score_fraction/IMG_2477.jpg)
This scene has a decent mix of perceptual qualities but the greater proportion of roadway results in a poor enclosure quality.
{: .caption}

### Using Deeplab V3+ on a custom dataset

Semantic segmentation of street level images provides an interesting opportunity in using the proportion of streetscape elements (i.e. buildings, trees, sidewalk, etc.) present in an image to quantify something like streetscape quality. There are a number of ways to achieve this either by developing regression models or even training an entirely new deep learning architecture that would train on street level images and corresponding perceptual qualities scores. 

In this post, I didn’t go as far as creating a model that predicts street score quality based on an input image. I was mainly interested in experimenting with segmenting street features that could potentially give us another perspective on streetscape quality.  

Following my poor results in a previous experiment using a Deeplab V3 model trained on the Streetscapes dataset, this time I wanted to re-train the model using transfer learning on my own dataset and see how the performance changed. I found this [post](http://hellodfan.com/2018/07/06/DeepLabv3-with-own-dataset/) to be a helpful resource.

My dataset is a collection of 100 google street view images from five Canadian cities (Calgary, Edmonton, Saskatoon, Regina, Vancouver). I document my process in creating ground truth masks for eight different classes in this [post](https://saadiqm.com/2019/03/06/computer-vision-streets.html). 

After cloning the Deeplab [repo](https://github.com/tensorflow/models/tree/master/research/deeplab), the first step involved creating TFrecords of the training and validation images and masks. The Deeplab repo has a number of helpful util functions to help with some routine tasks. I chose to use the [Mobilnet](https://ai.googleblog.com/2018/04/mobilenetv2-next-generation-of-on.html) variation as I wanted to have quick inference for testing purposes and was ok sacrificing accuracy.

After creating a index folder containing txt files (a simple list of all the images) of my training and validation images (train.txt, val.txt), I ran the ``build_voc2012_data.py`` script to create the TFrecords.

```sh
python ./build_voc2012_data.py \
  --image_folder="streetscape_street_images" \
  --semantic_segmentation_folder="streetscape_street_masks" \
  --list_folder="index" \
  --image_format="jpg" \
  --output_dir="tfrecords"
  ```

I then had to modify the ``segmentation_dataset.py``  and ``train_utils.py`` files to reflect the eight classes I have for my dataset.

In ``segmentation_data.py`` I need to register my own dataset:

```sh
_STREETSCAPE_DATASET = DatasetDescriptor(
    splits_to_sizes={
        'train': 80,  # num of samples in images/training
        'val': 20,  # num of samples in images/validation
    },
    num_classes=8, #including background class
    ignore_label=255,
)
```

I then add my dataset:

```sh
_DATASETS_INFORMATION = {
    'cityscapes': _CITYSCAPES_INFORMATION,
    'pascal_voc_seg': _PASCAL_VOC_SEG_INFORMATION,
    'ade20k': _ADE20K_INFORMATION,
    'streetscape':_STREETSCAPE_DATASET 
}
```

In train_utils.py, added “logits” to the exclude list:

```sh
 # Variables that will not be restored.
  exclude_list = ['global_step','logits']
  if not initialize_last_layer:
    exclude_list.extend(last_layers)
```

Before starting to train, ensure your pythonpath variables are set, as the train script references the slim model for mobilenet. Use [this](https://github.com/tensorflow/models/blob/40773bb21aea37e90e7958aceb98d37376403181/research/deeplab/local_test_mobilenetv2.sh#L32) for reference.

To train the model I simply ran the train script with the following flags:

```sh
python deeplab/train.py \
--initialize_last_layer=True \
--training_number_of_steps=30000 \
--train_split="train"
--model_variant="mobilenet_v2" \
--output_stride=16 \
--train_crop_size="513,513" \
--train_batch_size=4 \
--fine_tune_batch_norm=true \
--tf_initial_checkpoint="deeplabv3_mnv2_cityscapes_train/model.ckpt-30000" \
--dataset_dir=streetscape_data \
--train_logdir=train_log
```

I set `initialize_last_layer` to True because I want to re-use the weights in the model trained on the Cityscapes dataset. Training on a AWS P2.xlarge instance took about 4 hours for 30,000 steps. 

Predicting segmentation classes using my newly trained model produced some decent results. I was quite surprised at the quality even when training on just 80 street-level images. The model seems to generalize quite well across different street typologies, and different regions:

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street_score_fraction/seg1099_2.png)

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street_score_fraction/seg5199_2.png)

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street_score_fraction/seg599_2.png)

 I wanted to visualize how the different proportions of segmentation classes varied across a city. So I ran the model on the entire primary, secondary and tertiary classification of streets according to OSM in Calgary. The result below shows how the fraction of trees, building, sidewalk, concrete, landscaping and roadway from street level imagery vary across the City. 

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/street_score_fraction/segmentation_fraction2.png)
