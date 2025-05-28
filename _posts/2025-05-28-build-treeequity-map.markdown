---
layout: post
title:  "Building a Tree Equity Map"
date:   2025-05-28 00:00:00 -0700
description: ""
excerpt_separator: <!--more-->
---

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


### Creating a [Tree Equity Map for Calgary](https://calgarytreeequity.ca/) meant bringing together diverse datasets—tree canopy, census demographics, and urban heat. This post walks through the analytical and technical steps I took to transform raw data into an interactive tool that highlights areas most in need of increased tree cover.
<!--more-->


Trees are more than just greenery—they’re part of the urban infrastructure. They cool our streets, soak up stormwater, and improve mental health. But not all neighborhoods have equal access to the benefits of trees. A common trend across many North American cities is that neighborhoods with high populations of immigrants, visible minorities, or low-income residents often have the lowest distribution of urban trees and miss out on their benefits. The idea that all communities within a city have access to the benefits of trees is called **Tree Equity**. 

Organizations such as American Forests have pioneered work in understanding Tree Equity and developing a social equity and environmental justice lens to address it. They developed the [Tree Equity Score](https://www.americanforests.org/tools-research-reports-and-guides/tree-equity-score/), which quantifies whether there are enough trees in a neighborhood and what populations are most affected, and mapped these results for the United States. The [City of Toronto](https://www.toronto.ca/news/a-tree-equity-tool-for-greener-neighbourhoods/) adopted the same equity measure in 2024 to help them plan where to plant trees in the city.

<img src="{{site.baseurl}}/assets/img/tree-equity-map.png">
Mapping tree equity score and priority indicators in Calgary. [https://calgarytreeequity.ca/](https://calgarytreeequity.ca/)
{: .caption}


In this post, I share how I created a [Tree Equity Map for Calgary](https://calgarytreeequity.ca/) using local data sources and community indicators. While I drew on the [methodology](https://www.treeequityscore.org/methodology) developed by American Forests, I adapted it to Calgary by integrating Canadian census data and high-resolution tree cover data from the City’s Open Data Portal. The takeaway is clear: by combining diverse datasets, we can identify communities most impacted by low canopy cover and better target urban greening efforts where they’re needed most.


## From Canopy to Equity: Building on Earlier Work

I wrote a [previous post](https://saadiqm.com/2023/08/26/urban-tree-canopy.html) about mapping tree canopy cover in Calgary using a combination of satellite imagery, canopy height mapping (CHM), and LiDAR. The results were striking—some neighborhoods in the northeast had virtually no tree cover, while older communities were shaded by canopies. Building on that work and supporting the [Calgary Climate Hub](https://www.calgaryclimatehub.ca/), I wanted to take that work a step further by combining canopy coverage with demographic indicators and map tree equity.

## Data Sources and Methodology

American Forests has a detailed description of their methodology, which is generalized for a variety of biomes in North America including forest, grassland, Mediterranean, or desert environments. The biome helps inform the baseline canopy target for a region and can range between 15% (desert) to 40% (forest). The target is then adjusted by considering building density where regions with more buildings have less area to plant trees.

<img src="{{site.baseurl}}/assets/img/tree-equity-canopy-targets.png"> 

Canopy target considering biome and building density. [Source: American Forests](https://www.treeequityscore.org/methodology)
{: .caption}

As of 2024, Calgary's tree canopy was at 8.25%. Canopy goals vary depending on which policy document you read. The *Calgary Climate Strategy, Pathways to 2050* states a goal of 10% by 2030, 16% by 2050, while the *2023-2026 Climate Implementation Plan* aspires to 14-20% by 2058. 16% is often cited as the target so that’s what I used for the Calgary Tree Equity Score.

<img src="{{site.baseurl}}/assets/img/tree-equity-methodology.png">
Tree Equity Score formula. [Source: American Forests](https://www.treeequityscore.org/methodology)
{: .caption}

To create a Tree Equity Score using the American Forests methodology, I needed three sources of data: tree canopy coverage, census data (priority indicators), and land surface temperature (heat disparity). You can also refer to the [jupyter notebooks](https://github.com/smohiudd/calgary-tree-equity/tree/main/notebooks) to see all the data sources and analysis in detail.

### Canopy Data


The City of Calgary’s [open data portal](https://data.calgary.ca/) has consistently provided high-quality datasets that I've used over the years for urban analysis. Their [tree canopy data](https://data.calgary.ca/Environment/Tree-Canopy-2020/eymx-4za9/about_data) is a high-resolution, LiDAR-based dataset spanning from 2012 to 2022, ideal for calculating canopy coverage (i.e., the percentage of a neighborhood covered by trees) as well as temporal analysis. The City also offers [orthophoto imagery](https://maps.calgary.ca/calgaryimagery/) dating back to 1926, which is valuable for ground-truthing and verifying changes in tree canopy over time. With a resolution less than 1m, compared to satellite imagery which could have a resolution over 10m, orthophoto provides the greatest level of detail for this type of analysis.

<img src="{{site.baseurl}}/assets/img/tree-equity-1948-ortho.png">
[City of Calgary 1948 Orthophoto](https://maps.calgary.ca/calgaryimagery/)
{: .caption}

### Census Data

The Priority Index used in American Forests’ equity score is based on the "American Community Survey 2017–2021" and is available for every [Census Block Group](https://en.wikipedia.org/wiki/Census_block_group) in the U.S. Statistics Canada collects similar data (except for the Health Burden Index) and released it for the 2021 Census covering [Dissemination Areas](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/definition-eng.cfm?ID=geo021). Accessing census data through APIs was tricky at first—I wasn’t familiar with the [SDMX (Statistical Data and Metadata eXchange)](https://sdmx.org/about-sdmx/welcome/) standard that Statistics Canada uses. However, they provide a [guide](https://www.statcan.gc.ca/en/developers/sdmx/user-guide) and support for working with their APIs. The [pandasSDMX](https://pandasdmx.readthedocs.io/en/v1.0/) library was also helpful in downloading and transforming the data I needed. For the 2021 Census Profile, I used the following indicators, aggregated from multiple characteristics ([see the Jupyter notebook for more info](https://github.com/smohiudd/calgary-tree-equity/blob/fix/update-notebooks/notebooks/Canada_census.ipynb)):

- Proportion of seniors (65+) and children (0–4)
- Visible minorities
- Language isolation (no English or French spoken)
- Low-income households
- Unemployment rate

### Land Surface Temperature

To capture the urban heat island effect in the priority indicators, I used surface temperature data from [Landsat Collection 2 Level-2](https://www.usgs.gov/landsat-missions/landsat-collection-2-surface-temperature). The surface temperature product is derived from the Thermal Infrared Sensor (TIRS) and provides temperature data at a 30-meter resolution.

<img src="{{site.baseurl}}/assets/img/tree-equity-temperature_distribution.png">
Histogram of surface temperatures in Calgary on July 26, 2020.
{: .caption}

I used [Planetary Computer's STAC API](https://planetarycomputer.microsoft.com/docs/quickstarts/reading-stac/) to search the Landsat collection for a cloud free day in summer 2020. July 26 seemed to be the best selection with satellite coverage over the entire city. To determine heat disparity for the tree equity score I then averaged the temperatures across the entire city and determined the difference between each individual dissemination area.

<img src="{{site.baseurl}}/assets/img/tree-equity-LST-map.png">
Land surface temperature map of Calgary for July 26, 2020.
{: .caption}

## What the Map Shows

Combining it all together, I built an interactive map using MapLibre for rendering vector tiles, PMTiles for efficient, lightweight vector data storage and access, and React for the UI. GeoPandas, rasterio and other data analysis libraries were used to process the source datasets and generate aggregated metrics.

<img src="{{site.baseurl}}/assets/img/tree-equity-compare.gif">
Comparing tree canopy across years.
{: .caption}

The map allows users to zoom in to specific neighborhoods and explore tree equity score, canopy coverage and priority indicators. The temporal analysis tool lets users compare tree canopy between years while simultaneously viewing historical orthophoto imagery. This makes it possible to see not just where trees are today, but how tree coverage has changed over time.

## Final Thoughts

By combining local data and established methodologies we can create tools that not only inform policy but also empower residents and advocates. The Calgary Tree Equity Map is a step toward that vision, and I hope it inspires further action to grow a greener, fairer city.