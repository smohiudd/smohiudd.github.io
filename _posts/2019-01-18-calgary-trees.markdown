---
layout: post
title:  "Exploratory Data Analysis of Urban Trees in Calgary"
date:   2019-01-17 00:00:00 -0700
excerpt_separator: <!--more-->
---

### The City of Calgary estimates there are almost 7 million trees growing within city limits. The urban forest we see today is the result of over a century of careful planning, planting and maintenance. Using a dataset of public trees, I did a short exploratory data analysis to understand the distribution of tree species.

<!--more-->

The number of trees we see in Calgary is actually quite impressive considering that climatic conditions and geography make tree growth challenging. The city’s arid climate is characterized by short growing seasons, long cold winters and a general scarcity of water. A pre-settled Calgary would have had no trees in the landscape, save for some small forests in the river valleys.

Of the almost 7 million trees in Calgary, the City of Calgary provides a dataset of public owned trees. These are the trees on public land such as parks, boulevards, road ROW, City of Calgary property, etc. I wanted to explore this data and learn more about the urban forest distribution in Calgary. I’ll save the technical details of how I did the analysis for later in the post but first let’s get into the data. I ran the analysis in R which is an effective tool in running analysis on large datasets.

The data comes from the [Calgary Open Data portal][open_data]. The website has a nice summary of the columns of the dataset. There are 20 features for each row. The features I’m most interested in are:

* **COMMON_NAME** – The non-scientific name given to the tree
* **GENUS** - The first part in the binomial species name of a tree.
* **SPECIES** - The second part in the binomial species name of a tree.
* **DBH_CM** - The diameter at breast height (approximately 1.4 m) of a tree in centimeters.
* **COMM_CODE** - The short-hand code used to identify the community an asset resides in.
* **LONGITUDE** - The latitude of the tree
* **LATITUDE** - The latitude of the tree

A quick summary of the data reveals there are `484,265` observations (trees) in the data. I’m only looking for trees that include the Common Name because that what’s going to help me with some of my visualization and analysis. So if I remove observations that do not include the Common Name I’m left with `459,933` trees.

Moving forward with `459,933` trees lets count the most common tree types.

#### Common Tree Types

!['Calgary Trees'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/calgary-trees/count.png)

Colorado Spruce and Green Ash are the most common by far. There is a total of 225 different types of public trees in the dataset.

Next, let’s look at the Diameter at Breast Height feature. Let’s plot a histogram to see the distribution of diameters. I’ve also included the Common Name types to break out the distribution.

#### Trunk Diameter Distribution

!['Calgary Trees'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/calgary-trees/hist.png)

It looks like the trees are generally quite narrow. This could be attributed to the unfavourable growing conditions in Calgary.

Now let’s plot the location of trees. Since the location points are so close together and overlapping, a plot of all he trees together would be quite useless. So, let’s break out the nine most common trees.

#### Tree Locations by Common Name

!['Calgary Trees'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/calgary-trees/points.png)

Based, on the plot, we can see some variation in density of trees. As expected the Colorado spruce is ever present in almost all locations in the city. Deciduous trees seem to be less common, except for the Green Ash and Poplar Species. In almost all plots, we can see a lack of trees in the outer limits of the city in the new suburban developments. Since these areas are still developing, we would expect a lack of trees there.

Next let’s examine trees by Community.

#### Tree Location Density based on Community Name

!['Calgary Trees'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/calgary-trees/density2.png)

Queen's Park Village has the most trees per sq km (I believe this is because of Queens Park Cemetery).

What if we break out density by tree common name? Again, if we plot the nine most common trees, we get the following graphs:

#### Tree Location Density based on Community Name and Common Name

!['Calgary Trees'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/calgary-trees/density.png)

We see some interesting patterns from the above graphs. The Deciduous trees are mainly located in the inner city. Spruce trees seem to almost everywhere.

#### The Technical Stuff

This is my first attempt at using R for data analysis. After mostly using Python + Pandas, it was interesting to test out a different workflow and syntax. Overall, I found R effective in processing large datasets. It was also very useful in rendering tiles and facet grids, something that’s a little challenging in Python using Matplotlib. I usually use the Shapely package in Python for my geospatial analysis. Sf for R (a new package that is still gaining traction in the R community) was just as simple to use for geospatial analysis. The real winner in my opinion was ggplot2. The ease of graphing was amazing and something I will definitely come back to in the future.

[open_data]:https://data.calgary.ca/Environment/Public-Trees/tfs4-3wwa
