---
layout: post
title:  "Visualizing Bus Schedule Deviation using Vehicle Position and GTFS Data"
date:   2020-01-05 00:00:00 -0700
description: ""
excerpt_separator: <!--more-->
---

### Using data released as part of the Canadian Urban Transit Association "Data Blitz" I created a system wide [visualization of bus schedule deviation](http://saadiqm.com/bus-on-time-performance/) for Calgary Transit buses. The analysis and visualization help us understand how well certain bus routes perform and potentially where to focus improvements.

<!--more-->

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/on-time-performance/screen2.png)
[Visualization](http://saadiqm.com/bus-on-time-performance/) of average schedule deviation for Calgary Transit buses.
{: .caption}

<style>
.caption {
  font-size: 13px;
  font-style: italic;
  margin-top:0px;
  text-align: center;
}

.references {
  font-size: 12px;
}
</style>

In November 2019 the City of Calgary hosted the [Canadian Urban Transit Association (CUTA) annual conference](https://cutaactu.ca/en/events-training/cuta-annual-conference-and-transit-show-2019) and introduced the inaugural “CUTA Data Blitz”. The conference organizers engaged teams of consultants, academics, data scientists and others to explore a set AVL (Automatic Vehicle Location) and GTFS data and evaluate the efficacy of systemwide bus route changes in Calgary between 2018 and 2019. The system changes were a result of implementing a number of [Bus Rapid Transit (BRT)](https://www.calgarytransit.com/plans-projects/bus-rapid-transit-brt) Lines in Calgary in December 2018.

Although I didn’t personally participate in the challenge, I wanted to see what I could do with the data which was released on the Calgary [Open Data portal](https://data.calgary.ca/).

#### The Objective

Calgary Transit was asking for some creative analysis of the given data and to see how system performance changed between 2018 and 2019. I wanted to visualize how **On-Time Performance** (and more specifically Schedule Deviation), an important measure of the reliability of a transit system and one of the most widely used metrics in North America, changed between 2018 and 2019.

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/on-time-performance/screen4.png)
Average schedule deviation in May 2018 & 2019 for Route 10 Southcentre, afternoon rush hour (3pm-6pm) on a weekday.
{: .caption}

#### The Data

As part of the challenge, Calgary Transit released the following datasets to be used by the teams:

*GTFS*
-       [**2018 GTFS**](https://data.calgary.ca/Transportation-Transit/Calgary-Transit-Scheduling-Data-June-6-Sept-2-2018/vq7n-3cqv) (pre system wide route changes)
-       [**2019 GTFS**](https://data.calgary.ca/Transportation-Transit/Calgary-Transit-Scheduling-Data-May-8-June-23-2019/3ft9-tk4d) (post system wide route changes)

*Automatic Passenger Counter (APC)*
-       [**Sample**](https://data.calgary.ca/Transportation-Transit/SAMPLE/mdn5-ybwg) – data sample collected per vehicle
- [**Detail**](https://data.calgary.ca/Transportation-Transit/DETAIL/kymh-8ust) - shows further details of the sample conducted

*Automatic Vehicle Location (AVL)*
-       [**Incident Log**](https://data.calgary.ca/Transportation-Transit/Transit-Incident-Log/9m8z-ibsn) (2.6M rows) – all incidents at timepoints used to determine On Time Performance
-       [**Vehicle Position Log**](https://data.calgary.ca/Transportation-Transit/Vehicle-Position-Log/jkyn-p9x4) (20M rows) – physical location of each bus every 45 seconds

The time period covered in the datasets are approximately between May 1- May 30 for both 2018 and 2019. This is obviously a short time period to conclusively compare the performance of buses between years, but the process should give some reasonable results.

#### Using Vehicle Position Data

AVL and APC systems are increasingly used by transit agencies to closely monitor efficiency and reliability, ultimately using the data to improve performance and customer satisfaction. On Time Performance and Schedule Adherence are two measures that are commonly used to determine service reliability of buses in a transit system (NCTR, 2016). Schedule adherence refers to the difference between real-time and scheduled times of arrival and departure. On Time Performance measures the percentage of all schedule deviations that are within a defined range (i.e 1 min early or 5 min late):

> On-time performance = services on time/all services x 100

Given the abundant AVL data available in the dataset, I wanted to see how I could use it in combination with the APC data to determine the average schedule deviation per stop pre and post route changes. The incident log dataset only provides on-time performance measurements (schedule deviation) at certain **time points** along the route. Time points are used as part of a holding control dispatching strategy where buses must wait at time point stops if they arrive early, only departing at the designated time (Klumpenhower, 2018). Since I want schedule deviation at every stop, I’ll need to use the AVL vehicle position dataset.

!['time points'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/on-time-performance/time_point.jpg)


Using the vehicle position data and associated timestamp I want to get an approximate arrival time at every stop for every trip on every day in the dataset. In GTFS terms, a *trip* is a sequence of stops a particular route takes at a specific time of day. So the same route can have have multiple trips on a given day.

I’ll need to match the vehicle position GPS point to the nearest bus stop for a given trip. Since the AVL is gathering location data every 45 seconds, the GPS points will likely not match up with the exact bus stop location. So what I’ll do is match the point to a stop if it’s within a 15m range. However there are occasions where vehicle position are bunched up in the same locations close together within similar timestamps, such as a bus waiting at a time point. In this case I’ll take the earlier timestamp of a bunch of points. This will effectively give us the closest possible arrival timestamp to the bus stop location so we can determine schedule deviation, or in other words the difference between actual time of arrival and scheduled arrival stop time.


!['vehicle positions'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/on-time-performance/vehicle_positions.jpg)
Vehicle positions within a 15m radius of the bus stop
{: .caption}

#### Using GTFS Data

Now that we have the actual arrival time of a bus at each stop along a trip we need something to compare it to to determine schedule deviation. GTFS will help us in gathering the stop times for each route using standardized well-structured set of tables. In the GTFS Stop Times table, each stop has an arrival and departure time. For the vast majority of bus stops, the arrival and departure times are the same with the notable exception being time points as described above. It’s important to note that we are considering on-time performance of arrival at the stop and not departure. This is mainly because we can estimate the arrival time at stop but not easily the departure given the data we have.

Now that we have the actual arrival time and schedule arrival time we can calculate the schedule deviation for each trip and each stop:

> diff = scheduled time - vehicle position timestamp


#### Creating a Visualization and Analyzing the Results

After matching the timestamp of the vehicle position data to the stop time for a particular route and then calculating the schedule deviation for each stop we can input the results into a database (POSTGRES/POSTGIS) that we can query and aggregate using different filters. We can then visualize the data in a number of different ways. For example we can manipulate the data to only show average schedule deviation for a route on weekdays during morning rush (6am to 9am).

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
The results of the visualization seem reasonable and intuitively make sense (*of course there should be a lot more validation done on these results but this example is just a proof of concept*). There are outliers in the data that will need to be filtered out. For example, I’ve excluded any schedule deviations that are greater than 1000 seconds. These outliers could be attributed to bad data (incorrect GPS location or timestamp) or some other factors (i.e. customer emergency, traffic accidents, etc.) that would have greatly skewed the schedule deviation value. The results generally seem to indicate that many routes have a high on-time performance if we consider 1 min early and 5 min late as our cutoffs.

!['sceen shot'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/on-time-performance/screen3.png)
Final visualization with the ability to filter various parameters
{: .caption}

**Here is a link to the visualization [repo](https://github.com/smohiudd/bus-on-time-performance). Made using React/Gatsby and Mapbox.**

#### Further Analysis

I calculated the aggregate average schedule deviation given a set of filter parameters (i.e. time of day, day of week). Standard deviation of the schedule deviation would also be be useful output. A lower standard deviation would imply a greater stability in performance at a given stop and could give us some insight into the reliability at certain stops (Chakrabarti, 2015).

!['standard deviation'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/on-time-performance/stand_dev.jpg)

Different schedule deviation distributions for a bus stop (Chakrabarti, 2015)
{: .caption}


Since we have APC data available to us we can also determine the alightings and boardings per stop or even if the wheelchair ramp was used or a bike was placed in the rack. I may include this in another visualization.

### References

1. Chakrabarti, S. (2015) “The demand for reliable transit service: New evidence using stop level data from Los Angeles Metro bus system”. Journal of Transport Geography 48 (2015) 154-164.

2. Klumpenhower W., Wirasinghe S.C. (2018). “Optimal time point configuration of a bus route - A Markovian approach”. Transportation Research Part B 17, 209-227.

3. National Center for Transit Research. (2016). “Transit Service Reliability: Analyzing Automatic Vehicle Location (AVL) Data for On-Time Performance and Identifying Conditions Leading to Service Degradation.

4. Pi X. et. al (2018). “Understanding Transit System Performance Using AVL-APC Data: An Analytics Platform with Case Studies for the Pittsburgh Region”. Journal of Public Transportation Vol 21 No. 2, 19-40
{: .references}
