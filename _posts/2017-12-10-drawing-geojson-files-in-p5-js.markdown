---
layout: post
title:  "Drawing GeoJSON files in p5.js"
date:   2017-12-10 00:00:00 -0700
description: "An example of how to use p5.js to draw geojson shapes"
---
Although using mapping application like Google Maps, Mapbox or Leaflet can be extremely useful, I was looking for a way to draw simple GeoJSON files in my Processing/p5.js sketches. I didn't want to use a library to integrate my GeoJSON files and I wanted more flexibility in how my maps could be drawn and manipulated. I came across this [post](http://mikefowler.me/journal/2014/06/10/drawing-geojson-in-a-canvas) by Mike Fowler that achieved exactly what I was considering so I went about implementing this method in p5.js.

I used the [city boundary](https://data.calgary.ca/browse?limitTo=maps) GeoJSON data available from the City of Calgary's Open data catalogue.

The getBoundingBox algorithm is almost exactly the same as Mike Fowler's:

```javascript
function getBoundingBox (boundary) {

	let coords,latitude, longitude;
  let data = boundary[0].the_geom.coordinates[0];

  for (var i = 0; i < data.length; i++) {
    coords = data[i];

    for (var j = 0; j < coords.length; j++) {
			longitude = coords[0];
      latitude = coords[1];
      bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude; bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
      bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude; bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
    }
  }
  return bounds;
}
```

The P5.js  Map() function allowed me to be quickly map the latitude and longitude values to the canvas width and height using the bounding box values determined above. From there, I simply created a shape using the Shape() function:

```javascript
function draw() {

let data = boundary[0].the_geom.coordinates[0];
noStroke();
fill(25,45,78);
beginShape();
	for (var i = 0; i < data.length; i++) {
		let lon = boundary[0].the_geom.coordinates[0][i][0];
		let lat = boundary[0].the_geom.coordinates[0][i][1];

		let x = map(lon, city_limit.xMin, city_limit.xMax, 0+padding, width-padding);
		let y = map(lat, .yMin, city_limit.yMax, height-padding, 0+padding);

		vertex(x,y);
	}
endShape(CLOSE);
}
```

The final result is a simple map that can be easily manipulated or used for other geospatial visualization.

!['Calgary outline'](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/misc/calgary_outline.png)

You can find the GitHub repo [here](https://github.com/smohiudd/Drawing-GeoJSON-in-p5.js).
