---
layout: post
title:  "Using React and Mapbox to Map Bus Routes"
date:   2018-03-28 00:00:00 -0700
---
### With all the hype surrounding React and Angular and JavaScript frameworks lately, it's probably time to get familiar with this new fad. My recent post and project about [Network Analysis](https://nodalscapes.wordpress.com/2018/02/19/social-street-networks/) required some type of application UI so why not try out [React](https://reactjs.org/)?

My goal was to map all Calgary Transit bus routes in a quick, simply UI interface. That lead me to consider pairing React and Mapbox. Since I'm using the City of  Calgary Open Data API (through Socrata) there was no need to set up a database or model using the standard Model Viewer Controller (MVC) architecture so that made things a little simpler.

React is a JavaScript library that only focuses on the "V" aspect of MVC and is ideal for building user interfaces.  It's good at understanding what elements or components in the interface need changing and only re renders those parts. React has pretty good documentation and a [Quick Start](https://reactjs.org/docs/hello-world.html) on their website if you want to an overview.

React and Mapbox work really well together in building quick, efficient user interfaces. Mapbox's blog has an intro [(Mapbox GS JS + React)](https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a) in integrating the two and was my starting point in getting the map up and running.

After getting all the APIs calls working, I ran into issues updating the data source. Unfortunately, there's limited documentation on the Mapbox+React combination so I had to do some digging of my own. This first led me to understanding the [Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html) of a React Component. It's important to load the API calls and Mapbox map objects in [```componentDidMount()```](https://reactjs.org/docs/react-component.html#componentdidmount). Successfully updating the data source involved an implementation of Mapbox's [```setData()```](https://www.mapbox.com/mapbox-gl-js/api/#geojsonsource#setdata) method that did the trick in updating my data source and reloading the map for an onChange event.

Add in a little bit of [Turf](http://turfjs.org/) for simple geospatial analysis and the outcome is a simple, fast loading map that shows Calgary Transit bus routes. You can see the source code on [github](https://github.com/smohiudd/react-mapbox-bus-routes) and the final [working example](https://smohiudd.github.io/react-mapbox-bus-routes/).
