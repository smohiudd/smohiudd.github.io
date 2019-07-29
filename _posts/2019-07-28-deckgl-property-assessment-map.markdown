---
layout: post
title:  "Exploratory Geospatial Analysis of Property Assessments using Deck.gl"
date:   2019-07-28 00:00:00 -0700
description: ""
excerpt_separator: <!--more-->
---

### Deck.gl is a visualization framework developed by Uber to help visualize very large mobility datasets. Since being open sourced it’s been used in a variety of geospatial analysis. Let’s see how it works on visualizing property assessments with over 500,000 data points.

<!--more-->

<style>
.caption {
  font-size: 13px;
  font-style: italic;
  margin-top:0px;
  text-align: center;
}
</style>

!['nr screenshot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/deckgl-assessment/nr_screenshot.png)
Deck.gl [map](https://saadiqm.com/deck-gl-assessment-map-nr/) scatterplot layer of residential property values
{: .caption}

*Link to [Residential Map](https://saadiqm.com/deck-gl-assessment-map-re/) and [Non-Residential Map](https://saadiqm.com/deck-gl-assessment-map-nr/)*

Deck.gl was designed by Uber engineers to be a high performance, heavy duty visualization library for exploratory geospatial analysis. Since they were working with upwards of trillions of mobility data points (pickup/dropoff locations, traffic, etc.) they needed to create a custom framework to help their teams analyze vast amounts of data. The framework was open sourced in late 2016 and was initially integrated with React by default. The more recent versions have offered vanilla Javascript bundles but still use a “reactive” architecture, “diffing” changes under the
hood.  

Where Deck.gl differs from other mapping frameworks like Mapbox, is that it utilizes the client GPU to assist in Web Mercator projection calculations. Web Mercator projection is necessary to translate lat/lon coordinates to pixel coordinates. These projections are computationally expensive and would probably crash a browser if run on millions of data points. A framework like Mapbox would do these projection on the CPU but Deck.gl uses the GPU, which is well-suited to do these computations. The result is the ability to visualize and aggregate millions of data points in the browser on the fly.

#### Property Assessment Dataset

I thought a good dataset to try the framework on would be property assessment data. Most cities have open data sets of their residential and non residential property assessment going back a number of years. In Calgary, I was surprised to find a high quality [property assessment dataset](https://data.calgary.ca/dataset/Property-Assessments/6zp6-pxei/data). It goes back to 2005 and has assessment value, assessment class (residential, non-residential) and geolocation (lat/lon coordinates) for every building in the city.

After downloading the 1GB file with assessment values from 2005 to 2019, using R, I extracted the residential and non-residential rows for 2019 only and exported them as separate csv files. Thanks to the excellent quality of dataset, there was minimal data processing which was an unexpected surprise! The files size for the non-residential is relatively small at 1 MB but the residential, which includes over 500,000 properties was over 12MB. It’s not ideal for us to include such a huge file in a mapping application so we’ll need to find another way to deal with this - vector tiles. Vector tiles offer us some benefits in reducing the data transfer sizes since only data in the current viewport is loaded. We also have the option to reduce the number of points at lower zoom levels where the detail is less discernible.

The Mapbox tool tippecanoe can help in creating tilesets from our dataset which can then be loaded and served from Mapbox servers. Tippecanoe will automatically optimize the data at different zoom levels to ensure the correct level of detail in the points is shown. I used the following parameters on the non residential and residents sets:

***Residential:***

```shell
tippecanoe -z12 -Z7 -o RE2019.mbtiles -l RE --drop-densest-as-needed --extend-zooms-if-still-dropping 2019RE.csv
```
***Non-Residential:***
```shell
tippecanoe -z14 -Z7 -B9 -o NR2019.mbtiles -l NR -j '{ "*": [ "all", [ ">", "ASSESSED_VALUE", 10000000 ] ] }' 2019NR.csv
```
After creating the two Mapbox tilesets, we'll load them as new tilesets in Mapbox Studio.

#### Non-Residential Properties

There are 22,888 points for the non residential data set and doing a quick analysis of the we can see that the distribution is skewed to the lower end of the assessment values. Since we can see some small values and really high values, the best way to visualize these points would be something like a scatterplot with the size of the circle relative to the value of the property. However it’s becomes tricky to create a readable visualization because there is such a large spread between property values. There are different transformation we can make to the data to make continuous quantitative data to make a compelling visualization. The [D3 library](https://github.com/d3/d3-scale) has some great tools and resources explaining different continuous data transformation we can use.

!['nr continuous scale'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/deckgl-assessment/nr_contin.jpg)
Distribution of Non-Residential property values
{: .caption}

We’ll use a **power scale** to transform the assessment value. Power or log scales are great when visualizing data with uneven distributions.

As of deck.gl [version 7.0](https://medium.com/vis-gl/introducing-deck-gl-v7-0-c18bcb717457), the new ***Tile Layer*** will help us in loading the Mapbox vector tiles. The final deck.gl layer for the scatterplot layer will look like the following:

```
const scatter_layer =  new TileLayer({
      id: "assessment-NR",
      type: TileLayer,
      getTileData: ({x, y, z}) => {
        const mapSource = `https://a.tiles.mapbox.com/v4/saadiqm.azk20mv4/${z}/${x}/${y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`;
        return fetch(mapSource)
          .then(response => response.arrayBuffer())
          .then(buffer => {
            const tile = new VectorTile(new Protobuf(buffer));

            const features = [];
            let vectorTileLayer = tile.layers["NR"]

            for (let i = 0; i < vectorTileLayer.length; i++) {
              const vectorTileFeature = vectorTileLayer.feature(i);
              const feature = vectorTileFeature.toGeoJSON(x, y, z);
              features.push(feature);
            }
            return features;
          });
      },
      onTileError:(e) => console.error(e),
      maxZoom:14,
      onHover: info => this.setState({
       hoveredObject: info.object,
       pointerX: info.x,
       pointerY: info.y
      }),
      renderSubLayers: props => {
        return new ScatterplotLayer(props,{
            opacity:0.5,
            pickable: true,
            getLineWidth:0,
            radiusScale: Math.pow(2, Math.max(14 - this.state.zoom, 0)),
            radiusMinPixels: 1,
            radiusMaxPixels:90,
            getPosition: d => d.geometry.coordinates,
            getFillColor: d => [66, 135, 245],
            getRadius: d => Math.sqrt(d.properties.NR_ASSESSED_VALUE)/500,
          });
        }
      })
```


#### Residential Properties

There are a lot more residential point in our data set: 501,485. Again the distribution is quite skewed. Since there is such a high density of points, it wouldn't make sense to use a scatterplot so we’ll need to use another layer type. Deck.gl has something called aggregation layers that compute an aggregate value for a number of bundled points. This is something that makes sense when we want to visualize and quickly analyze a lot of points. Using the Deck.gl hexagonal aggregation layer, we can determine the average residential price in a given hexagonal unit.  

!['re continuous scale'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/deckgl-assessment/re_contin.jpg)
Distribution of Residential property values
{: .caption}

The color encoding of the hexagonal units is a little tricky because of the uneven distribution of the data points. We wan to use a color scale that will best visualize and distinguish the changes in the data. Therefore we'll use something called a ***quintile*** scale for the color encoding. You can find an excellent explanation of quantitative scales include quantile scales [here](https://roadtolarissa.com/coloring-maps/).  

!['re screenshot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/deckgl-assessment/re_screenshot.png)
Deck.gl [map](https://saadiqm.com/deck-gl-assessment-map-re/) hexagonal aggregation of residential property values
{: .caption}

The final deck.gl layer for the scatterplot layer will look like the following:

```
const hex_layer =  new TileLayer({
      id: "assessment-RE",
      type: TileLayer,
      getTileData: ({x, y, z}) => {
        const mapSource = `https://a.tiles.mapbox.com/v4/saadiqm.crsurd8i/${z}/${x}/${y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`;
        return fetch(mapSource)
          .then(response => response.arrayBuffer())
          .then(buffer => {
            const tile = new VectorTile(new Protobuf(buffer));

            const features = [];
            let vectorTileLayer = tile.layers["RE"]

            for (let i = 0; i < vectorTileLayer.length; i++) {
              const vectorTileFeature = vectorTileLayer.feature(i);
              const feature = vectorTileFeature.toGeoJSON(x, y, z);
              features.push(feature);
            }
            return features;
          });
      },
      onTileError:(e) => console.error(e),
      maxZoom:9,
      renderSubLayers: props => {

        function getWeight(point) {
          return point.properties.RE_ASSESSED_VALUE;
        }
        return new EnhancedHexagonLayer(props,{
          opacity:0.9,
          pickable: false,
          extruded: false,
          radius:80,
          coverage:0.8,
          colorAggregation:"MEAN",
          getColorWeight: getWeight,
          colorRange:COLOR_RANGE,
          colorScale:"quantile",
          getPosition: d => d.geometry.coordinates,
          });
        }
      })

```
