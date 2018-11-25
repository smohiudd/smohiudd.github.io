---
layout: post
title:  "Mapping Pies - Visualizing Housing Type Data in Calgary"
date:   2017-11-25 00:00:00 -0700
---
Over the past few months I've been learning and developing my skills in Processing and P5.js. Processing was brought by my attention earlier this summer by a graphic designer friend who thought I should give it a try. At that time I was learning python and looking for a more creative platform for coding. Since then I've been studying the tutorials by [Daniel Shiffman](http://shiffman.net/), a contributor to Processing and associate professor at NYU's Tisch School of the Arts. His [youtube channel](https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw) has been an awesome resources in getting started with Processing as well as picking up some basic Java and Javascript.

![map](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/mapping-pies/mapping-pies-single.gif)

I had been looking for some inspiration to get me started on a small Processing project of my own, particularly something to do with geospatial data visualization. While going through my weekly Daniel Shiffman videos I came across this [video](https://www.youtube.com/watch?v=ZiYdOwOrGyc&list=PLRqwX-V7Uu6a-SQiI4RtIwuOrLJGnel0r&index=11) about mapping earthquake data using the [Mapbox static map API](https://www.mapbox.com/api-documentation/#static). Using that video as inspiration I decided to use census data from the City of Calgary's [Open Data](https://data.calgary.ca/) catalogue to map pie charts of housing type (single family, town house, duplex, apartment, etc.) by community.

The process of creating my map in P5.js has been in interesting exercise in understanding map projection and converting latitude and longitude to pixel coordinate. Web Mercator is the the standard projection for all web mapping applications. I don't want to get into all the details in this blog but you can find out more information [here](https://en.wikipedia.org/wiki/Web_Mercator). In order to optimize how maps are displayed in mapping applications, the world map is split into tiles either 256x256 or 512x512 (depending on the platform. Mapbox uses 512px tiles). The number of tiles is proportionate to zoom level. The higher the zoom level, the more tiles. I found a good resource on Microsoft's [Bing Maps page](https://msdn.microsoft.com/en-gb/library/bb259689.aspx) that describes this well:

The XY pixel coordinates of a point on the map was calculated using the equations on the Bing page

```javascript
function xtile(lon){
	return ((lon+180)/360)*512*pow(2,zoom);
}

function ytile(lat){
	let sinLatitude = sin(lat *(PI/180));
	return (0.5 - log((1+sinLatitude)/(1-sinLatitude))/(4*PI))*512*pow(2,zoom);
}
```
I also wrote a simple class to draw the pie chart using the census data:

```javascript
class Pie{
	constructor(lon,lat,dwellings, comm_name){
		this.x = lon+width/2;//readjust for translation
		this.y = lat+height/2;//readjust for translation
		this.pop = dwellings;
		this.name = comm_name;
		this.total = 0;
		this.angle = 0;
		this.radius = 55;
		this.change = 0;
	}

	display(){
		this.calc_total();

		if(this.total>3000){
	  	for (let i=0; i<this.pop.length; i++){

      	this.change = TWO_PI*(this.pop[i]/this.total);

				fill(226,66,244,230-(65*i));
				noStroke();
      	arc(this.x, this.y, this.radius, this.radius, this.angle, this.angle+this.change);
				fill(255);
				textSize(12);

				text(this.name,this.x,this.y+13,1000)
      	this.angle += this.change;
			}
    }
	}

	calc_total(){
		for (let i=0; i<this.pop.length; i++){
			this.total+=this.pop[i];
		}
	}
}
```
The final map shows a pie chart with a split of single family, town house, duplex, apartment, and multiplex for each community shown in pie charts. You can find the code for this work [here](https://github.com/smohiudd/Mapping-Pies).

![final map](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/mapping-pies/mapping-pies-full.png)
