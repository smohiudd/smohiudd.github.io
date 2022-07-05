---
layout: post
title:  "Using Information Entropy to Evaluate Street Level Imagery"
date:   2021-01-04 00:00:00 -0700
description: ""
excerpt_separator: <!--more-->
---

### I explore the concept of information entropy and how it can be used to evaluate the uniqueness of a street.
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

#container1{
    background-color: rgb(70, 70, 70);
    padding:5px;
}

.tick{
    font-size: 13px;
    color: white;
}


</style>

#### What is Information Entropy?

<label for="feature">Choose a Feature:</label>
<select class='' name="feature" id="feature"></select>
<div class="content">
  <div id="container1">
  <div id="container2"></div>
  </div>
</div>




<script src="https://d3js.org/d3.v6.min.js"></script>
<script src="{{site.url}}/assets/js/2021_01_05_street_entropy.js"></script>