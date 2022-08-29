---
layout: post
title:  "Energy Consumption Modelling for Electric Bus Schedule Design "
date:   2022-08-28 00:00:00 -0700
description: ""
excerpt_separator: <!--more-->
---

### Designing a schedule for electric buses takes more than simply replacing the same service delivered by diesel buses. Due to range limitations of EVs, understanding how battery state of charge changes over a route is important. In this post I introduce a way to determine energy consumption metrics using a <a href="http://drivecycle.eastus.azurecontainer.io" target="_blank">visualization tool</a> that uses the <a href="https://github.com/smohiudd/drivecycle" target="_blank">Drivecycle</a> python package.
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

.side-bar{
  width: 98%;
  background-color: #c1d6f7;
  padding: 10px;
  margin: 15px 0 15px 0;
      font-size:15px;
    line-height: 18px;
    color: #2e2d2d;
}

.side-bar-heading{
  font-size:12px;
  font-weight: bold;
  line-height: 1.6;
}

@media screen and (min-width: 600px) {
  .side-bar{
    float: right;
    width: 50%;
    background-color: #c1d6f7;
    padding: 20px;
    font-size:15px;
    line-height: 18px;
    color: #2e2d2d;
    margin: 15px 0 15px 15px;
  }
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

</style>

![](https://img.masstransitmag.com/files/base/cygnus/mass/image/2021/11/16x9/OCTranspo_batteryelectricbus_OCTranspo.61a43c506a9e9.png?auto=format,compress&w=1050&h=590&fit=clip)
Ottawa's OC Transpo was one of the latest transit agencies in Canada to announce a plan to transition to battery electric buses. Image Source: masstransitmag.com
{: .caption}
As Canadian transit agencies work furiously to take advantage of a gusher of [federal funding](https://www.infrastructure.gc.ca/zero-emissions-trans-zero-emissions/index-eng.html) to support Zero Emission Bus adoption, more attention is being paid to the practicalities of implementing these technologies. Compared to conventional diesel buses, the range limitation of battery electric buses for example, make their implementation a little more challenging. It’s typical to see more battery electric buses deployed to meet the same scheduling requirements of a diesel or gasoline bus. The main reason for this is the inefficiency in implementing the same service since schedules must be redesigned conform to the range limitations of electric buses. Therefore, it's likely that maintaining the same service would likely cost more due to increased operating costs. 

<img src="{{site.baseurl}}/assets/img/drivecycle.gif">
Screenshot from [Transit Drivecycle visualization](http://drivecycle.eastus.azurecontainer.io).
{: .caption}

<!-- <div class="side-bar">
  <span class="">TRANSIT SCHEDULING TERMINOLOGY</span>

  Route: A group of trips that are displayed to riders as a single service
  
  Trip: A sequence of two or more stops occuring at a specific time
  
  Block: A collection of trips
  
</div> -->

While I was working on the electric bus program at Calgary Transit, I was interested in how the range considerations of battery electric buses contribute to the transition from existing service schedules. The basic concept behind this is the energy drawn from the battery as it completes its route. I wrote an [article](https://saadiqm.com/2020/12/19/transit-drivecycle.html) about developing a method to simulate a bus drivecycle using open source mapping data from [OSM](https://en.wikipedia.org/wiki/OpenStreetMap) and route data from [Transitland](https://www.transit.land). It provided a way to estimate a vehicle drivecycle without having to collect telemetric data (i.e. GPS coordinates). Since then, I’ve further expanded the concept by developing a Python package called [Drivecyle](https://github.com/smohiudd/drivecycle) that uses trajectory planning algorithms to create sample vehicle drivecycles along with the energy consumption. You can read more about the details of Drivecycle and the assumptions that go into it [here](https://saadiqm.com/2022/07/03/battery-energy-model.html).

<img src="{{site.baseurl}}/assets/img/bus_blocks.png">

<h4>Designing an Electric Bus Schedule</h4>

When we take transit schedules driven by diesel buses and convert them to electric, it’s often not as simply as replacing one diesel bus with an electric bus. Depending on the range of the block, sometimes we may be required to re-block to ensure the electric buses can complete the same service. This is where predicting energy consumption and battery state of charge (SoC) is important. A number of factors can affect energy consumption, such as weight of the bus (i.e. number of passengers on board), elevation change or regeneration ratio (i.e. converting braking force back to battery charge). I created an online tool called [**Transit Drivecycle**](http://drivecycle.eastus.azurecontainer.io) that can show the estimated energy consumption and energy efficiency in kWh/km for various transit agencies in Canada. The user can manipulate variables such as bus weight, auxiliary power (i.e lighting and heating), frontal area or battery capacity and see how the energy consumption changes. Although this is a very simplified analysis compared to when transit planners would look at block schedules, it provides an estimate of how a route or single trip would preform if it was electrified. Further advancement of the visualization tool may include estimating energy consumption at the block level by aggregating a number of trips.  

<!-- <div class="side-bar" markdown="1">
  <h5>TRANSIT DRIVECYCLE TECHNICAL NOTES</h5>

  
  
</div> -->

<img width="400" class="center" src="{{site.baseurl}}/assets/img/transit-drivecycle-screenshot.png">
Screenshot from [Transit Drivecycle visualization](http://drivecycle.eastus.azurecontainer.io).
{: .caption}

<h4>Transit Drivecycle Technical Notes</h4>

Check out the [github link](https://github.com/smohiudd/transit-drivecycle) to the transit driveycle repository. The visualization tool is currently set up as three docker containers: [Valhalla](https://valhalla.readthedocs.io/en/latest/) for the routing engine, FastAPI to serve the Drivecycle data and a frontend using React. I also used this as an opportunity to test out [Maplibre](https://maplibre.org) since it was released following the Mapbox licensing change. The transit data is retrieved from [Transitland](https://www.transit.land) however I'm working on a way to include a local GTFS database to make all services containerized. The containers were deployed to Azure [Container Instance](https://docs.microsoft.com/en-us/azure/container-instances/) using the new [Docker integration](https://docs.docker.com/cloud/aci-integration/).