---
layout: post
title:  "Creating a Bus Drive Cycle Simulation"
date:   2020-12-15 00:00:00 -0700
description: ""
excerpt_separator: <!--more-->
---

### Drive cycles play an important role in determining the energy consumption of electric vehicles. Using OSM speed limit and intersection data along with bus stop locations, I created a [tool](http://saadiqm.com/transit-drive-cycle/) that simulated drive cycles for bus routes in different transit networks. 

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

<img src="{{site.baseurl}}/assets/img/drive_cycle_screen.gif">
Drive cycle [simulation tool](http://saadiqm.com/transit-drive-cycle/) using OSM data.
{: .caption}

Over the past year, I’ve been leading a project to demonstrate the viability of battery electric buses for a transit agency. It got me thinking a lot about drive cycles. I wasn’t too familiar with the term before but I’ve come to understand it’s important in determining efficiency particularly when it comes to electric vehicles. **Zero emissions buses** (ZEBs), which include both Battery Electric and Fuel Cell Electric Buses (FCEBs), have taken the spotlight recently. Major federal funding announcement in both Canada and the [United States](https://www.transit.dot.gov/about/news/us-department-transportation-announces-130-million-grants-nationwide-projects-expand#:~:text=WASHINGTON%20%E2%80%93%20The%20U.S.%20Department%20of,purchase%20or%20lease%20of%20zero%2D) have encouraged transit agencies and municipalities in North America to have a serious look at the viability of converting portions of their fleets to ZEBs. 

<img src="{{site.baseurl}}/assets/img/edmonton_bus.jpg">
Edmonton Transit System (ETS) rolled out one of the largest electric bus deployments in Canada in 2020. Source: edmonton.ca
{: .caption}

While there is no doubt about the environmental benefits of ZEBs through reduced GHG emissions there still some hesitation in widespread adoption because of when range limitations of electric buses. A typical 40ft, 300kWH bus may have a maximum range of 250km as compared to 350 to 500km for a diesel equivalent <sup>1</sup>. Range anxiety is something that transit agencies are rightly concerned about. However, modelling and simulating energy consumption are one of the most important tools when it comes to estimating ZEB range. This information can be used as input for transit service planning and to accomodate various constraints on technology, infrastructure and financing of ZEB rollout<sup>2</sup>.  



#### What is a Drive Cycle?

<img src="{{site.baseurl}}/assets/img/banglore_drive_cycle.png">
Above: This is a what a typical bus drive cycle looks when plotting GPS data. (https://theicct.org/publications/zev-bus-fleets-dev-drive-cycles)
{: .caption}

The drive cycle plays an important role when determining the energy consumption of an electric vehicle. It's defined as a representative profile of the driving conditions of a bus along a single route and is usually shown as velocity over time. Transportation engineers and planners can use the drive cycles to model the energy consumption along a route along with elevation data, vehicle mass, tire radius, gear ratio and other variables. But using this method depends of availability of high quality data GPS data that must be used to develop a drive cycle and the ability to clean, aggregate and validate the data to create a representative drive cycle for a route.

### I wanted to explore if there was a way to generalize a drive cycle using OSM speed limit data, OSM intersection nodes and stop locations in the absence GPS data. Would it be possible to use this drive cycle to determine a very rough estimation of energy consumption of a hypothetical electric bus on a route? 

#### Creating a Drive Cycle

Finding resources on creating sample drive cycles using speeds, segment lengths or stop distances was a little more difficult than I expected. Besides often cited papers such as [Akcelik and Biggs](https://www.jstor.org/stable/25768250?seq=1#metadata_info_tab_contents), which do a good job of representing vehicles in traffic, I wanted a more generalized method to create a drive cycle. Ultimately, I found that [trajectory planning](https://en.wikibooks.org/wiki/Robotics/Navigation/Trajectory_Planning#:~:text=Trajectory%20planning%20is%20sometimes%20referred,velocity%2C%20time%2C%20and%20kinematics) was the most applicable method in creating representative drive cycles using different road factors such as speed and stop locations.

<div id="container" class="svg-container"></div>
Drive cycle simulation for short length and only three stop 10 Van Horne route in Toronto
{: .caption}

I ended up using a combination of [Transitland](https://www.transit.land/) to get route shapes and [Valhalla routing engine](https://github.com/valhalla/valhalla) to match the route shapes to OSM edges. Transitland, through their API, also includes linearly referenced stop locations for ever route trip. By combining the stop locations with the OSM data, I created a graph of edges and nodes which could be used to create a drive cycle. 

<img src="{{site.baseurl}}/assets/img/Drive_Cycle.png">
Combining linearly referenced stop location with intersection locations.
{: .caption}

The trajectory planning algorithm would only stop at bus stop locations and nodes (intersections) that intersected with another tertiary road (OSM road classification). To add some stochasticity to the stop locations, their would be a 50% chance that the bus would stop at either a bus stop or tertiary road intersection. 

To make a more comprehensive tool to analyze a system wide collection of routes, I again tapped into the Transitland API to list all bus routes for a city, and along with Mapbox and D3, [visualized the results](http://saadiqm.com/transit-drive-cycle/). 

#### Next Steps

Of course, the method that I used provides a pretty rough approximation of drive cycle compared to a other method that use GPS data.The absence of traffic data or ridership numbers also greatly limits the estimation accuracy. But it could give transit agencies an order of magnitude idea of power consumption of potential electrifiable bus routes. My next step is to model power consumption using sample electric bus specs. 


##### References
1.	https://www.nap.edu/catalog/25842/guidebook-for-deploying-zero-emission-transit-buses
2.	https://theicct.org/publications/zev-bus-fleets-dev-drive-cycles
{: .references}






<script src="https://d3js.org/d3.v6.min.js"></script>
<script src="{{site.url}}/assets/js/2020_12_15_drivecycle.js"></script>


