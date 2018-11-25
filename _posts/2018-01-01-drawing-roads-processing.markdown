---
layout: post
title:  "Drawing Roads with GeoJSON and Processing"
date:   2018-01-02 00:00:00 -0700
---

![roads](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/misc/calgary_road.jpg)
Continuing with my 3D mapping theme, I've built onto my previous map with GeoJSON road data from the City of Calgary Open Data catalogue. It was definitely a struggle to get this one to work. I was using the [Socrata API](https://dev.socrata.com/foundry/data.calgary.ca/tqjs-vnhy) but the lines just weren't rendering properly - they were showing up as fragments. Thought it might be an issue with my JSON object and array indexing. But then I looked at the original shape files and they showed up ok on QGIS so I new the data was ok. So I went about recreating the GeoJSON file and using [this](https://gist.github.com/YKCzoli/b7f5ff0e0f641faba0f47fa5d16c4d8d) as a reference. Tried it again and it worked perfectly. The road network referenced in the file (and shown by the light grey lines) was quite extensive and looked confusing so I simply filtered the data for "skeletal" roads only and the result is the green outline.

I'm not sure where I'm going with the elevated road layer yet but just experimenting with different layer orientations to see if I can come up with an interesting visualization.
