---
layout: post
title:  "Urban Tree Canopy and Tree Equity using Satellite Data"
date:   2023-08-26 00:00:00 -0700
description: ""
excerpt_separator: <!--more-->
---

### Research has shown how urban forests have a number of social, environmental and economic benefits in cities. They will play an important role in climate change adaptation in urban areas.
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

</style>

Advancements and access to earth observation satellite data as well as LIDAR technology has made it possible to analyze a wide range or parameters when it comes to urban livability. One such area is urban tree cover which will become an ever more important way to assess climate change adaptation in cities. In this post I the use of three different datasets to explore urban tree canopy cover in Calgary. Being situated in prairie grassland, the growth of urban trees can be challenging. There has been discussion in recent years about the [loss of greenness](https://www150.statcan.gc.ca/n1/pub/16-002-x/2021001/article/00002-eng.htm), and [tree equity in the NE quadrant](https://www.cbc.ca/newsinteractives/features/calgary-city-of-haves-and-have-nots-when-it-comes-to-trees) (which also happens to have the highest immigrant population), pointing to the need for accurate and accessible data to assess tree canopy cover.

# Mapping Trees

It’s common for medium to large cities in North America to maintain inventories of public and some private trees with detailed records of various features including species, stem diameter, etc. Some cities like Calgary also release canopy cover data which are obtained by [LiDAR](https://www.earthdatascience.org/courses/use-data-open-source-python/data-stories/what-is-lidar-data/) that pick-up trees above certain heights. These data sources provide valuable information about tree cover and whether targets are being met.

<img src="{{site.baseurl}}/assets/img/tree-equity-screen.png">

The [US Tree Equity Score](https://www.treeequityscore.org/) map from 2021 may be the most comprehensive analysis of satellite imagery and census data relating to tree equity in the world. Canada currently does not have a similar national Tree Equity map despite the federal government’s wide reaching [2 billion trees](https://www.canada.ca/en/campaign/2-billion-trees.html) program. The Canadian Institute of Forestry has been working to address this by collaborating with a number of partners, including some of my old colleagues at [Sparkgeo](https://sparkgeo.com/), to develop a [national database on urban forestry geospatial data](https://www.cif-ifc.org/wp-content/uploads/2022/12/CIF-IFC-Media-Release_Open-Urban-Forests-Project_Bilingual.pdf). Having accurate, up to date urban tree cover data would help greatly in allocating resources for tree planting programs like 2 Billion Trees.


# Urban Design and the Benefits of Urban Tree Cover 

Research has shown how urban forests have a number of [social, environmental and economic benefits](https://treecanada.ca/resources/canadian-urban-forest-compendium/3-benefits-of-urban-forests/#:~:text=Urban%20forests%20promote%20mental%20well,Neill%2DDunne%2C%202012) in cities. There has been increasing attention lately to urban tree cover and how it relates to social equity and climate resilience. Urban trees reduce heat island effect through passive cooling, improve stormwater management and storm surges, improve property values and have many public health benefits and generally support an improved quality of life for communities. They play an important role in climate change adaptation in urban areas. 

The way cities and neighbourhoods are designed play a crucial part in this level of potential adaptation. In the case of Calgary, new suburban developments built on prairie grassland lack the natural ecosystem to support dense tree cover and therefore require careful planning of infrastructure and maintenance around trees. Unfortunately, modern subdivision developers  are more concerned with rapidly building out, leaving tree planting as an afterthought. More often than not, this kind of development practice is often supported by public planning policy. We can see how subdivision lack permeable surfaces, or adequate top soil depths that are needed for healthy tree growth. Therefore we see a marked differences in the tree canopy cover in different parts of the city with low income, immigrant communities or new subdivision which house large number of families with tree cover at effectively 0%!

<img src="{{site.baseurl}}/assets/img/tree_1.JPG">
Post WWII developments in Calgary (Normount Drive shown above), although car centric with wide vehicle travel lanes, are able to support impressive tree growth because of sufficient permeable surfaces from large front lawns and lots. 
{: .caption}

<img src="{{site.baseurl}}/assets/img/tree_4.JPG">
Pre WWII developments in Calgary (community of Mount Pleasant shown above) nurtured a diverse urban forest on prairie grassland that provide ample shade to homes.
{: .caption}

<img src="{{site.baseurl}}/assets/img/tree_2.JPG">
Typical suburban developments with front driveways and small lot sizese (Saddleridge shown above) lack sufficient permeable surfaces to support tree growth. 
{: .caption}

<img src="{{site.baseurl}}/assets/img/tree_3.JPG">
At over 10 years old, the community of Saddleridge (shown above) in Calgary still has areas with less than 1% tree cover. This area of Calgary also has some of the highest immigrant populations. 
{: .caption}


# Mapping Tree Cover using Three Data Sources

With the crucial need for tree canopy cover data, using it to ultimately understand tree equity in the city, I wanted to compare determining tree cover in Calgary using three available data sources: NDVI, Satellite Data and LiDAR. Each of these sources have different resolutions and therefore will produce varying accuracies. 

#### Normalized Difference Vegetation Index (NDVI)

Normalized Difference Vegetation Index is a commonly used, accurate and simple to calculate measure of the "greeness" of an area which correlates to the quantity of vegetation. This measure typically [calculated by a ratio of infrared and colour optical bands](https://www.earthdatascience.org/courses/earth-analytics/multispectral-remote-sensing-data/vegetation-indices-NDVI-in-R/) which can be obtained from Landsat or Sentinel satellites. The ratio can be thresholded to filter out the most green areas. Both Landsat and Sentinel sources are accessible via a modern metadata standard called [STAC](https://stacspec.org/en). A cloud free image obtained in the summer of 2022 was used to develop an NDVI measure for the City of Calgary. 

<img src="{{site.baseurl}}/assets/img/ndvi.png">
Above: NDVI using mosaic Sentinel-2 satellite imagery between Aug 1 and Aug 30 2022. A complete Sentinel-2 mosaic of Calgary was not available for 2020.
{: .caption}

Alhough NDVI will pick up greeness from the tree canopy, it will also classify grassland in the same way. If we use this as a proxy for tree cover, then we may over estimate the canopy since some grassland areas may not have any trees. This can be seen the outer undeveloped suburban areas of the map above which shows many green areas that we kno contain no trees. 

#### Canopy Height Model (CHM)

A canopy height model helps us to represent the height of trees by calculating the distance between the ground and tops of trees. The CHM may be determined using LiDAR by subtracting a digital terrain model (DTM) from a digital surface model (DSM). LiDAR is a form of active remote sensing where lighting emitted from a rapidly firing laser reflects off buildings, trees, structures or the ground and returns to the sensor and can help measure the height of these features with extremely high resolution. Despite the high accuracy of LiDAR is expensive to deploy and because of this usually covers a limited geographic area. 

Recently, there has been a growing area of research that combines different satellite data sources along with deep learning to gather global scale CHM, although at a lower resolution that what’s achievable with LiDAR. In 2022 researchers at KTH (Lang et. al.) developed a [probabilistic CHM](https://langnico.github.io/globalcanopyheight/) that fuse satellite mounted LiDAR using [NASA’s GEDI](https://www.earthdata.nasa.gov/sensors/gedi) program with optical satellite images from the European Space Agency’s (ESA) [Sentinel-2](https://sentinel.esa.int/web/sentinel/missions/sentinel-2). The result is a global scale CHM at a resolution of 10m. [Meta Research](https://research.facebook.com/blog/2023/4/every-tree-counts-large-scale-mapping-of-canopy-height-at-the-resolution-of-individual-trees/) also released a CHM deep learning architecture using Maxar high resolution optical satellite imagery, LiDAR CHM and GEDI data. The result is a scalable CHM with a resolution of 0.5m. 

<img src="{{site.baseurl}}/assets/img/chm.png">
Above: Satellite Data CHM using 2020 Sentinel-2 and GEDI data (Lang et. al, 2022). The 10m resolution from satellite data results in chunkier blocks of tree canopy with less accuracy that LiDAR CHM.
{: .caption}

For the Calgary tree canopy, I was able to gather two CHMs. One [2020 LiDAR data product](https://data.calgary.ca/Environment/Tree-Canopy-2020/eymx-4za9) from the City of Calgary Open Data portal and another from the Lang et. al hosted on [Google Earth Engine](https://nlang.users.earthengine.app/view/global-canopy-height-2020). Both results are better able to classify grassland areas with low tree count compared to the NDVI method. The Satellite CHM is not as accurate as LiDAR and has considerable differences in some areas.

<img src="{{site.baseurl}}/assets/img/lidar.png">
Above: LiDAR CHM using 2020 data from [City of Calgary Open Data](https://data.calgary.ca/Environment/Tree-Canopy-2020/eymx-4za9). The high resolution of the data shows a finer depiction of the tree canopy.
{: .caption}


# Tree Cover by Community

By doing a comparison on the tree cover by community we can see how each of the methods compares when assessing tree cover. The tables below show the ten highest and ten lowest tree cover neighbourhoods ordered by the LiDAR CHM. We can see how the CHM methods (LiDAR and Satellite) more accurately convey the tree cover in the grassland areas.

<img src="{{site.baseurl}}/assets/img/tree_cover.png">

# Lowest Canopy Cover by Community

| Community Name | CHM (LiDAR) | CHM (Satellite) | NDVI |
| --- | --- | --- | ---: |
| Cornerstone | 0.0027 | 0.0178 | 0.5258 |
| Redstone | 0.0063 | 0.0231 | 0.2231 |
| Skyview Ranch | 0.0108 | 0.0203 | 0.2331 |
| Sherwood | 0.02446 | 0.0161 | 0.3478 |
| Saddle Ridge | 0.0250 | 0.0137 | 0.1908 |
| Taradale | 0.0272 | 0.0424 | 0.1967 |
| Coral Springs | 0.0316 | 0.0796 | 0.2878 |
| New Brighton | 0.0370 | 0.0096 | 0.2181 |
| Kincora | 0.0476 | 0.0440 | 0.4391 |
| Country Hills Village | 0.0499 | 0.0835 | 0.2979 |

# Highet Canopy Cover by Community

| Community Name | CHM (LiDAR) | CHM (Satellite) | NDVI |
| --- | --- | --- | ---: |
| Rideau Park | 0.8678 | 0.5430 | 0.5671 |
| Parkdale | 0.8138 | 0.2699 | 0.2772 |
| Shawnee Slopes | 0.7746 | 0.3758 | 0.1981 |
| Wildwood | 0.7728 | 0.5086 | 0.5743 |
| Point McKay | 0.7642 | 0.1645 | 0.5201 |
| Medicine Hill | 0.7499 | 0.3501 | 0.6191 |
| Lakeview | 0.7314 | 0.1782 | 0.2448 |
| Elbow Park | 0.6940 | 0.5996 | 0.5371 |
| Patterson | 0.6888 | 0.4344 | 0.4551 |
| Bowness | 0.6656 | 0.5043 | 0.3362 |

#### References

Lang, N., Jetz, W., Schindler, K., & Wegner, J. D. (2022). A high-resolution canopy height model of the Earth. arXiv preprint arXiv:2204.08322

Dandridge, L. (2023). Trees and Urban Heat. https://www.youtube.com/watch?v=pXL_P_Ffcg0&t=1979s