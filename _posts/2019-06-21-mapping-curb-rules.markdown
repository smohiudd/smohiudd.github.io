---
layout: post
title:  "Building a Curb Rules Map"
date:   2019-06-21 00:00:00 -0700
description: "Most of us rarely spare a second thought about curbs but they're coming in to sharp focus by cities and private companies alike. By creating inventories and maps of curb regulations they can do so much more with an often-overlooked asset. In this post, I discuss the process of mapping curb regulations and create my own curb map and rules engine using on street parking rules data."
excerpt_separator: <!--more-->
---

### Most of us rarely spare a second thought about curbs but they're coming in to sharp focus by cities and private companies alike. By creating inventories and maps of curb regulations they can do so much more with an often-overlooked asset. In this post, I discuss the process of mapping curb regulations and create my own curb map and rules engine using on street parking rules data.

<!--more-->

It's amazing how quickly the curb became the next up-and-coming public infrastructure mapping and digitizing focus. And it stands to reason why would it. Ridesharing and autonomous driving companies are often cited as one of the biggest motivators in digitizing curb space. Improved efficiency in drop offs and pickups dictated by available curb space not only improves productivity and customer experience but also keeps private companies on the good side of cities (and the parking authority). Mapping curb rules may also generally improve traffic and mobility in cities. An analysis of various parking ‘cruising’ studies by Donald Shoup concluded that on average around 30% of road traffic could be attributing to people finding a place to park on the street. Another study in Washington DC revealed that the City was losing approximately $650 million a year because of the lack of loading zones for delivery trucks. Trucks were double parking in passenger vehicle locations or just in the middle of the street.

It makes sense why some see the curb as an opportunity. And so, companies like [Coord](https://www.coord.co/), a spin-off of [Sidewalk Labs](https://www.sidewalklabs.com/), have been developing tools to help cites map curb rules in detail, releasing the data as part of the curb API – of course at a price. Other endeavors like [SharedStreets](https://sharedstreets.io/), a project of the non-profit Open Transport Partnership are taking a more open data/open-source approach. Their recent flurry of open source releases have paved the way for cities to use their own existing regulation or curb inventory data with SharedStreets [linear referencing tools](https://github.com/sharedstreets/sharedstreets-js) and [curb rule specification](https://github.com/sharedstreets/CurbLR), creating curb data which can then be shared and consumed by third parties.

To understand the potential opportunity in mapping curb rules I wanted to see how the data was used in my own city. In this post, I explore the process of collecting on street parking data, processing it and then creating a curb rules API, and finally a visualization. This was mostly an exercise in understanding the potential pipeline in processing curb data while using a standard curb rule spec.

#### Finding the data

Like any city mapping project, I start with exploring the open data repositories. Unfortunately, in Calgary, on-street parking maps and rules are not available as an open data set. They are only available in this [map](https://www.calgaryparking.com/web/guest/findparking/onstreet).

!['cpa map'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/cpa_map.png)

Inspecting the code, we see that it references a kml file which we can download. After converting the kml file to geojson using this [Mapbox utility](https://mapbox.github.io/togeojson) we now have file we can work with. We are going to split the data into two tables: one for the curb geometry and one for the curb rules.

!['kml map'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/kml_1.png)

!['kml map'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/kml_2.png)

#### Processing the rules data

Inspecting the curb rules data we can see that the all the rules are actually in html tags. The days, hours, pricing, etc. are wrapped in various `<h1>` and `<p>` tags so that makes it possible for us to parse out the rules.

```html
<b>1 Av  - 6 St  to 7 St SW - N side</b><br/>
<H4>Mon-Fri 9:00 AM to 11:00 AM</H4>
<ul><li>$2.75 per Hour</li></ul>
<H4>Mon-Fri 11:00 AM to 3:30 PM</H4>
<ul><li>$3.00 per Hour</li></ul>
<H4>Mon-Fri 3:30 PM to 6:00 PM</H4>
<ul><li>$1.75 per Hour</li></ul>
<H4>Saturday: 9:00 AM to 6:00 PM</H4>
<ul><li>$0.50 per 2 Hours</li><li>Max Stay 3 Hours</li></ul>
<H4>Sunday/Holidays:</H4>
<ul><li>Free parking</li></ul>
```

I’ll spare you all the countless lines of ugly code but eventually I was able extract all the rules using a **lot** of regular expressions (i.e. grepl, grep) functions. The result is a structured csv file with each row representing one “restriction”. The term restriction is used by the CurbLR specification to reference a curb rule. You can read more about the CurbLR specification [here](https://github.com/sharedstreets/CurbLR).

!['csv 1'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/csv_1.png)

Calgary’s paid on street parking is distinguished by unique zones. Each zone has identical rules regardless of the location and zones are usually grouped in close proximity and often on the same side of the street. The zones were useful since I could utilize them as a unique IDs. This caused me to separate my curb geometries from the rules, essentially creating two tables linked by the zone id.

All the restrictions for a given zone correspond to a specific time period that you’ll see on a parking sign. For example:

```html
Mon-Fri 9:00 AM to 11:00 AM
$4.25 per hour

Mon-Fri 11:00 AM to 3:30 PM
$4.50 per hour
```

But for our rules API to be really effective we need restrictions to cover the full 24 day. I wrote a script in R to fill in the gaps. We will assume that if a time period is not listed in the sign then it is free to park there until the next restriction starts. I realized later on that this is not a great assumption, particularly considering the absence of other curb rules, which I will discuss later in the post.

We have a minor issue with the time boundaries. If we were to search for parking at 11:00 am then we have two restrictions that satisfy that query. Ideally, we want one parking restriction to govern at a given time. So, we are going to subtract one minute from the end time for each restriction. We also need to convert time variable into a feature that is easily searchable in our database so we'll convert it to seconds. The resulting table looks like this:

!['csv 1'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/csv_2.png)

Finally, we need to export the csv table to CurbLR json format using the following script in Python.

```python
restrictions = []
for _, row in data.iterrows():
    restriction = {
        "zone": row["zone"],
        "what":{
            "activity":row["activity"]
        },
        "when":[
            {
                "dayofweek":row["days"]
                ,
                "timeofDay":{
                    "from":row["start"],
                    "until":row["end"]
                }
            }
        ],
        "who":{
            "class":row["class"]
        },
        "payment":{
            "rate":row["cost"],
            "interval":row["interval"],
            "maxCost":row["maxcost"],
            "maxTime":row["maxtime"]
        }
    }
    restrictions.append(restriction)
```
The resulting output for a single restriction in json will look like:

```python
{
   "what": {
      "activity": "park"
   },
   "who": {
      "class": "Passenger Vehicle"
   },
   "when": [
      {
         "dayofweek": [
            1,
            2,
            3,
            4,
            5
         ],
         "timeofDay": {
            "from": 0,
            "until": 32340
         }
      }
   ],
   "payment": {
      "rate": 0.0,
      "interval": null,
      "maxCost": null,
      "maxTime": null
   },
   "zone": 1000
}
```

#### Processing the geometries using SharedStreet Referencing

We’re not sure how the curb geometry was collected for the CPA map. They may have been surveyed in person or simply drawn in GIS using a base map. But we can see by zooming into the map that it does not necessarily line up with adjacent street.

SharedStreets referencing helps us in matching the curb geometries to road segments using unique referencing IDs. Although for our purposes this just helps in cleaning up our geometries, the real power of the Referencing System comes when we have different datasets referencing the same segments. Geospatial datasets from different sources, for example movement data, rideshare pick-up or vehicle speeds are often difficult to relate to city geospatial datasets since they may reference different base maps. By using a shared referencing system, third parties and cities are better able to collaborate using their datasets.

Using the [SharedStreets matching CLI](https://github.com/sharedstreets/sharedstreets-js) we are able to match our curb geometries to the nearest road segment:

```shell
shst match 07-18.geojson --search-radius=20 -out=curbmatched.geojson --best-direction
```

The output data from the matching CLI will produce the following:

```javascript
{
  "type":"Feature",
  "properties":
    {
      "shstReferenceId":"94dbf6370698f1e7f777900513afec79",
      "shstGeometryId":"41d5869d47bb1f55056e5d8c3d8df6a8",
      "shstFromIntersectionId":"b13ae3358bb40d8a3f450805d09bddea",
      "shstToIntersectionId":"7c8274c8c4a4e5f9f28a70a5627d994f",
      "gisReferenceId":"fbafbb5007d10712e00a2a22d9a52178",
      "gisGeometryId":"b3e61d5a100493f6ca638ec6256faa22",
      "gisTotalSegments":1,
      "gisSegmentIndex":1,
      "gisFromIntersectionId":"68b88df59d68d7638d675c21b23a83b7",
      "gisToIntersectionId":"ac52f499d4c678b4fe88934fad2f53d7",
      "startSideOfStreet":"right",
      "endSideOfStreet":"right",
      "sideOfStreet":"right",
      "score":5.49,
      "matchType":"hmm",
      "pp_name":"Zone # 1000"},
  "geometry":
    {
      "type":"LineString",
      "coordinates":[[-114.07619731002377,51.052302503709235],
      [-114.07651305645928,51.05230351664216]]
    }
}
```


We will use the “sideOfStreet” property to offset or curb geometry to the correct side of the street.

<figure class="map_container">
  <iframe src="http://saadiqm.com/curb-matching-shared-streets/" frameborder="0" width="100%" height="500px"> </iframe>
</figure>

#### Curb rules API

Once we have processed our restrictions and geometries we’re ready to create a database and API. From the previous processing steps we have two json files: one array of restriction objects and another of geometry objects. I’m going to use [mongodb Atlas]((https://www.mongodb.com/cloud/atlas)) and [Serverless](https://serverless.com/) to develop my API. We're going to load each json file (rules and geometries) as a separate collections in mongodb.

I ran the following query to access the rules data for a given time and day:

```javascript
let rules = await db.collection("curbrules").aggregate([
  {
    $match: {"$and": [
         {"when.timeofDay.from":{$lte:start_seconds}},
         {"when.timeofDay.until":{$gte:start_seconds}},
         {"when.dayofweek":{$elemMatch:{$in:[day]}}}
       ]}
  },
  {
    $project:{
      _id:0,
      zone:1,
      restrictions:{
        "what":"$what",
        "who":"$who",
        "payment":"$payment"
      }
    }
  },
  {
   $lookup: {
      from: "shapes",
      localField: "zone",
      foreignField: "zone",
      as: "geometry"
    },
  }
  ]).toArray()
```

We then combine the returned restrictions into a geojson FeatureCollection:

```javascript
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "zone": 1000,
        "restrictions": {
          "what": {
            "activity": "park"
          },
          "who": {
            "class": "Passenger Vehicle"
          },
          "payment": {
            "rate": 2.75,
            "interval": 60,
            "maxCost": null,
            "maxTime": null
          }
        },
        "side": "right"
      },
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [
          [
            [
              -114.076197310024,
              51.0523025037092
            ]...

```
