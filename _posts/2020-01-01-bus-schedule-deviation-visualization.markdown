---
layout: post
title:  "Visualizing Bus Schedule Deviation using Vehicle Position and GTFS Data"
date:   2020-01-01 00:00:00 -0700
description: ""
excerpt_separator: <!--more-->
---

### Using data released as part of the Canadian Urban Transit Association "Data Challenge" I created a system wide [visualization of bus schedule deviation](http://saadiqm.com/bus-on-time-performance/). The analysis and visualization gives us an understanding of how well certain bus routes perform and potentially where to focus improvements.

<!--more-->

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/on-time-performance/screen2.png)
[Visualization](http://saadiqm.com/bus-on-time-performance/) of schedule deviation for Calgary Transit buses.
{: .caption}

<style>
.caption {
  font-size: 13px;
  font-style: italic;
  margin-top:0px;
  text-align: center;
}
</style>

In November 2019 the City of Calgary hosted the [Canadian Urban Transit Association annual conference](https://cutaactu.ca/en/events-training/cuta-annual-conference-and-transit-show-2019). The conference introduced the inaugural “CUTA Data Challenge” which requested teams to explore a set of CAD/AVL (Computer Automated Dispatch/Automatic Vehicle Location) and GTFS data and evaluate the efficacy of systemwide bus route changes in Calgary between 2018 and 2019. The system design changes were a result of the implementation of a number of [Bus Rapid Transit (BRT) Lines](https://www.calgarytransit.com/plans-projects/bus-rapid-transit-brt) in December 2018.

Although I didn’t personally participate in the challenge, I wanted to see what I could do with the data which was released on the Calgary [Open Data portal](https://data.calgary.ca/).

#### The Data

As part of the challenge, Calgary Transit released the following datasets to be used by the teams:

*GTFS*
-       **2018 GTFS** (pre system wide route changes)
-       **2019 GTFS** (post system wide route changes)

*Automatic Passenger Counter (APC)*
-       **Route** – all active routes
-       **Trip** – all active trips
-       [**Sample Detail**](https://data.calgary.ca/Transportation-Transit/SAMPLE/mdn5-ybwg) – data sample collected per vehicle (i.e. # of passengers)
-       **Stop** – description of all active stops

*CAD AVL*
-       [**Incident Log**](https://data.calgary.ca/Transportation-Transit/Transit-Incident-Log/9m8z-ibsn) (2.6M rows) – all incidents at timepoints used to determine On Time Performance
-       [**Vehicle Position Log**](https://data.calgary.ca/Transportation-Transit/Vehicle-Position-Log/jkyn-p9x4) (20M rows) – physical location of each bus every 45 seconds

The time period covered in the datasets are approximately between May 1- May 30 for both 2018 and 2019. This is obviously a short time period to conclusively compare the performance of buses between years, but I wanted to see what results I would get even with these limited datasets.

#### The Objective

Calgary Transit was asking for some creative analysis of the given data and to see what conclusions could be reached about how bus performance changed between 2018 and 2019. I specifically wanted to see how **On Time Performance**, an important measure of the level of success of a transit system, changed between 2018 and 2019.

#### Using Vehicle Position Data

AVL systems are increasingly common in transit agencies around the world and are useful in determining fleet positions and to measure, monitor and improve service reliability. *On Time Performance* and *Schedule Adherence* are two measures that are commonly used to determine service reliability of buses in a transit system. Schedule adherence refers to the difference between real-time and scheduled times of arrival and departure. On Time Performance measures the percentage of all services that are on time.

Given the abundant realtime vehicle position data available, I wanted to see how I could use it in combination with the trip and stop level data to determine the average schedule deviation in May 2018 and May 2019, pre and post route changes.

Using the vehicle position data and associated timestamp, I first wanted to match the point to the nearest bus stop for a given route and trip within a 15m range of a particular bus stop. This will effectively give us the closest possible timestamp to the bus stop location so we can determine schedule deviation, or the difference between actual time of arrival and scheduled stop time.

!['vehicle positions'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/on-time-performance/vehicle_positions.jpg)
Vehicle positions within a 15m radius of the bus stop
{: .caption}

#### Assumptions

To determine the schedule deviation I made the following assumptions:

- The  bus arrival and departure time at a particular stop is the same.

- Since AVL data is continuously gathering in realtime, there will be points where vehicle position points that are bunched up. In this case I’ll take the earlier timestamp of a bunch of points that are within the distance limit of the stop.

- Along a trip, a bus will have an arrival time and departure time at a particular stop. Often times the arrival and departure are equal since the bus will simply drop off/pick up and immediately move along the route – no holding at time points. Some stops are time point stops which have differing arrival and departure times (often time which are minutes apart). In this case we will take the midpoint of these times to determine one arrival/departure time.

#### Limitations

There is inherently some error built into determining schedule deviation using this approach - the primary challenge being you won’t know exactly when the vehicle arrives/departs a particular stop using the vehicle position data since the GPS point won’t fall exactly on the bus stop location. Also the error in the GPS position and update rate of the locations will also factor into the accuracy of the location.

#### Creating a Visualization

After matching the timestamp of the vehicle position data to the stop time for a particular route and trip my final result was a database with vehicle position locations at bus stop locations for all the bus trips in May 2018 and May 2019.

I then determined the schedule deviation for each bus stop for each trip:

> diff = scheduled time - vehicle position timestamp

A query of the database was then able to determine the the average schedule deviation for each stop along a route

```
route_short_name | route_long_name | trip_headsign | direction_id |          diff          | sign | stop_id | stop_lat  |  stop_lon   | booking
------------------+-----------------+---------------+--------------+------------------------+------+---------+-----------+-------------+---------
              19 | 16 Avenue North | 16TH AVE N    |            0 |    54.2500000000000000 |    1 |    2084 | 51.072897 | -113.991726 | CT6
              19 | 16 Avenue North | 16TH AVE N    |            0 |    94.6000000000000000 |    1 |    2084 | 51.073069 | -113.991742 | CT19
              19 | 16 Avenue North | 16TH AVE N    |            0 |   193.6000000000000000 |    1 |    2254 | 51.059082 | -114.028984 | CT19
              19 | 16 Avenue North | 16TH AVE N    |            0 |   138.5000000000000000 |    1 |    2254 | 51.059082 | -114.028984 | CT6
              19 | 16 Avenue North | 16TH AVE N    |            0 |    45.1666666666666667 |    1 |    5433 | 51.067514 | -114.122587 | CT6
              19 | 16 Avenue North | 16TH AVE N    |            0 |    20.6000000000000000 |   -1 |    5455 | 51.065328 | -114.094011 | CT19
              19 | 16 Avenue North | 16TH AVE N    |            0 |    32.6000000000000000 |    1 |    5455 | 51.065862 | -114.094011 | CT6
              19 | 16 Avenue North | 16TH AVE N    |            0 |   136.1666666666666667 |    1 |    5677 | 51.058835 | -114.036273 | CT19
```
This data was fed into a [visualization](http://saadiqm.com/bus-on-time-performance/) that shows the schedule deviation for each route at each stop by averaging the schedule deviation by stop.
