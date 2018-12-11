---
layout: post
title:  "Transit Connectivity and Network Centrality"
date:   2018-04-16 00:00:00 -0700
---
### How do we know if transit routes are traveling through the most connected areas of a City? If we were to map bus routes and network centrality for communities what would that tell us about transit planning? Continuing on from my post about Social Street Networks, I've created an [interactive map](https://smohiudd.github.io/bus-route-closeness/) showing Calgary Transit bus routes and closeness centrality measures of the neighbourhoods they intersect.

Calgary Transit's recent [2018 Transit Service Review](https://engage.calgary.ca/BusReview) got me thinking about ways to visualize how bus routes are aligned. I wrote a [detailed post](https://nodalscapes.wordpress.com/2018/02/19/social-street-networks/) a couple months ago about network science and its application to transportation planning. The main concept I covered was Closeness Centrality or the measure of the importance of a node to its geodesic distance to other nodes. The closer a node is to other nodes, the more important the node is. Now, what happens when we map bus routes and closeness centrality?

![map](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/transit-connectivity/screenshot.png)

The thing about superimposing bus routes and closeness centrality is that it doesn't make much sense for long commuter routes. Since these routes are travelling through so many neighbourhoods with different street orientations and on different street types the centrality measures don't tell us much. But when we look at collector routes, particularly in outer suburban areas, it might tell us something about optimal route placement. The thing that makes this analysis feasible is that most suburban neighbourhoods are bounded by skeletal or arterial roads. These are the roads you absolutely dread crossing on foot and that carry something like 10,000 to 30,000 vehicles per day. So there is inherently less permeability between suburban neighbourhoods. If we run closeness centrality on these isolated networks, we can understand something about the hot spot areas that are the most connected. And if you throw a bus route on top of that visualization, then you can see some interesting things.

![468](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/transit-connectivity/468.png)

Looking at route 468 (above) going through Cranston you can see a deviation from a highly connected area - notice the difference in closeness centrality between the two areas. Of course there are several limitation when examining bus routes this way. The way I've mapped it, we can't see the actual stop locations (but would be interesting to see how that would look) and we don't usually know from the route alignment, the intent of the route. In most cases, you'll see that the routes actually do go through high centrality locations. In other cases, its obviously not practical to route through the most central areas given potential access restrictions, road classification, etc.

![50](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/transit-connectivity/route50.png)

You can find a working example [here](https://smohiudd.github.io/bus-route-closeness/) with a selection of bus routes that may work well with closeness centrality. I have to credit [Geoff Boeing](http://geoffboeing.com/publications/osmnx-complex-street-networks/) for developing OSMnx that helped me with the network analysis. You can find details about the relevant research:

**Boeing, G. 2017. “OSMnx: New Methods for Acquiring, Constructing, Analyzing, and Visualizing Complex Street Networks.” Computers, Environment and Urban Systems. 65, 126-139. doi:10.1016/j.compenvurbsys.2017.05.004**
