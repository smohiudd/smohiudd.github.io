---
layout: post
title:  "Building a Curb Rules Map"
date:   2019-06-21 00:00:00 -0700
description: "Curbs have become the next public infrastructure digitizing opportunity. In this post, I discuss the process of creating my own curb map and rules API using on street parking rules data and SharedStreet CurbLR spec."
excerpt_separator: <!--more-->
---

### Curbs have become the next public infrastructure digitizing opportunity. In this post, I discuss the process of creating my own [curb map](http://saadiqm.com/curb-rules-map/) and rules API using on--street parking rules data and SharedStreets draft [CurbLR spec](https://github.com/sharedstreets/CurbLR).

<!--more-->

<style>
.caption {
  font-size: 13px;
  font-style: italic;
  margin-top:0px;
  text-align: center;
}
</style>

!['curb map'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/parking_rate.png)
[On-street parking rules map of Calgary](http://saadiqm.com/curb-rules-map/)
{: .caption}

It's amazing how quickly the curb became a public infrastructure mapping and digitizing focus. And it stands to reason why would it. Ridesharing and autonomous driving companies are often cited as one of the biggest motivators in digitizing curb space. Improved efficiency in drop offs and pickups dictated by available curb space not only improves productivity and customer experience but also keeps private companies on the good side of cities (and the parking authority). Mapping curb rules may also help us improve traffic, mobility and productivity in cities. An [analysis of various parking ‘cruising’ studies](https://www.sciencedirect.com/science/article/pii/S0967070X06000448) by Donald Shoup concluded that on average around 30% of road traffic could be attributed to people finding a place to park on the street. [Another study](https://qz.com/1182385/the-humble-curb-is-fast-becoming-the-citys-hottest-asset/) in Washington DC revealed that the City was losing approximately $650 million a year because of the lack of loading zones for delivery trucks. Trucks were double parking in passenger vehicle locations or just in the middle of the street.

It makes sense why some see the curb as an opportunity. And so, companies like [Coord](https://www.coord.co/), a spin-off of [Sidewalk Labs](https://www.sidewalklabs.com/), have been developing tools to help cites map curb rules in detail, releasing the data as part of the curb API – of course at a price. On the other hand [SharedStreets](https://sharedstreets.io/), a project of the non-profit Open Transport Partnership is taking a more open data/open-source approach. Their recent flurry of open source releases have paved the way for cities to use their own existing regulation or curb inventory data with SharedStreets [linear referencing tools](https://github.com/sharedstreets/sharedstreets-js) and [curb rule specification](https://github.com/sharedstreets/CurbLR), creating curb data which can then be shared and consumed by third parties.

To understand the potential opportunity in mapping curb rules I wanted to see how curb data in my own city could be used. In this post, I explore the process of **collecting on-street parking data, cleaning the data, creating a curb rules API, and finally a visualization**.

#### Finding the data

Like any city mapping project, I start with exploring the open data repositories. Unfortunately, in Calgary on-street parking maps and rules are not available as an open data set. The only option is this [map](https://www.calgaryparking.com/web/guest/findparking/onstreet).

!['cpa map'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/cpa_map.png)
Calgary Parking Authority (CPA) on-street parking map
{: .caption}

Inspecting the code, we see that it references a kml file which we can download. After converting the kml file to geojson using this [Mapbox utility](https://mapbox.github.io/togeojson) we now have a file we can work with. We are going to split the data into two tables: one for the **curb geometry** and one for the **curb rules**.

#### Processing the rules data

Inspecting the curb rules data we can see that the all the rules are in html tags. The days, hours, pricing, etc. are wrapped in various `<h1>` and `<p>` tags so that makes it possible to parse out the rules.

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

I’ll spare you all the countless lines of ugly code but eventually I was able extract all the rules using a **lot** of regular expressions (i.e. grepl, grep) functions. The result is a structured csv file with each row representing one **“restriction”**. The term restriction is used by the CurbLR specification to reference a curb rule and defines what is allowed or prohibited at a section of curb, and how the restriction should be applied. You can read more about the CurbLR specification [here](https://github.com/sharedstreets/CurbLR). Please keep in mind that the spec is currently in draft form and will probably change.

!['csv 1'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/csv_1.png)
On-street parking rules extracted from html tags
{: .caption}

Calgary’s paid on street parking is distinguished by unique zones. The zones were useful since I could utilize them as a unique IDs and for lookups between the geometry and rules tables. The restrictions for a given zone are defined by a specific time period that you’ll see on a parking sign. For example:

```html
Mon-Fri 9:00 AM to 11:00 AM
$4.25 per hour

Mon-Fri 11:00 AM to 3:30 PM
$4.50 per hour
```

But for our rules API to be effective we need restrictions to cover the full 24 day. I wrote a script to fill in the time gaps. We will assume that if a time period is not listed in the sign then it is free to park there until the next restriction starts. I realized later on that this is not a great assumption, particularly considering the absence of other curb rules not in our dataset which may conflict with my assumption. I will discuss later in the post.

We have a minor issue with the time boundaries. If we were to search for parking at 11:00 am then we have two restrictions that satisfy that query. Ideally, we want one parking restriction to govern at a given time. So, we are going to subtract one minute from the end time for each restriction. We also need to convert time variable into a feature that is easily searchable in our database so we'll convert it to seconds. The resulting table looks like this:

!['csv 1'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/csv_2.png)
On-street parking rules extracted from html tags
{: .caption}


Finally, we need to export the csv table to CurbLR json format. The resulting output for a single restriction in json will look like:

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
         "dayofweek": [1,2,3,4,5],
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

We’re not sure how the curb geometry was collected for the CPA map. They may have been surveyed in person or simply drawn in GIS using a base map. But we can see by [zooming into the map](http://saadiqm.com/curb-matching-shared-streets/) that it does not necessarily line up with the adjacent street.

!['matched geometry compare'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/match_compare.png)
[Comparing original geometry vs matched geometry](http://saadiqm.com/curb-matching-shared-streets/)
{: .caption}

SharedStreets referencing helps us in matching the curb geometries to road segments using unique referencing IDs. Although for our purposes this helps in cleaning up our geometries, the real power of the Referencing System comes when we have different datasets referencing the *same* segments. Geospatial datasets from different sources, for example movement data, rideshare pick-up or vehicle speeds are often difficult to relate to city geospatial datasets since they may reference different base maps. By using a shared referencing system, third parties and cities are better able to collaborate using their datasets.

Using the [SharedStreets matching CLI](https://github.com/sharedstreets/sharedstreets-js) we are able to match our curb geometries to the nearest road segment:

```shell
shst match original_geometry.geojson --search-radius=20 -out=curbmatched.geojson --best-direction
```

The output data from the matching API will produce the following for a single line feature:

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
#### Curb rules API

Once we have processed our restrictions and geometries we’re ready to create a database and API. From the previous processing steps we have two json files: one array of restriction objects and another of geometry objects. I’m going to use [mongodb Atlas](https://www.mongodb.com/cloud/atlas) and [Serverless](https://serverless.com/) to develop my API, loading each json file (rules and geometries) as a separate collections and query for rules based on time and day of week.

We then combine all the returned restrictions into a geojson FeatureCollection:

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
          }
        }
      }
```

The API endpoint will feed into our [visualization](http://saadiqm.com/curb-rules-map/) which is using Mapbox and Gatsby. We’re able to filter different features of the restriction using Mapbox. As an example, I’ve included two visualizations that toggle parking classes (i.e. Passenger Vehicle, Loading Zone, Taxi Zone etc.) and parking rates.

#### Challenges and Limitations

I discussed in the data processing section how I assumed that any time intervals that were not included in the parsed parking rules were available as free parking. The problem with this assumption is that we don’t have all the regulatory signage data available to us so we may have conflicting rules with what was included in our on street parking dataset and what rules are actually on the street.

For example the image below shows just that problem. Our on-street parking dataset included rules from the sign on the right but not stopping restrictions from the sign on the left. So therefore our assumption above is incorrect. This problem may stem from the siloed approach of inventory data in some cities. Signage from a revenue generating agency (i.e. on-street-paid parking signs) may be separate from regulatory road signage (i.e. no stopping signs) so you’re not able get a whole picture of the curb restrictions without exploring both datasets.

!['CPA Parkign Sign'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/IMG_1355.jpg)
Calgary Parking Authority on-street parking sign
{: .caption}


CurbLR deals with this by including a priority field for restrictions. The priority field in the spec defines how overlapping restrictions relate to one another (i.e. which one takes priority). In our example above the “no stopping” restriction would take priority over the parking rule. So if you generated rules based on the different datasets then you would know which restriction governs if you have conflicting rules.

!['CurbLR graphic'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/curb_rules/curblr_overview.png)
Overlapping parking restrictions (source: SharedStreets)
{: .caption}


#### Next steps

The CurbLR spec will probably go through more iterations following feedback from cities so I'm interested to see what it will look like later on. It currently does a good job of representing curb rules while still allowing flexibity to include custom fields.

I'm hoping to continue developing the curb API and map to include other curb rules including no stopping times, snow route parking zones, curb cuts and other curb features. Stay tuned for updates.
