function legend({
    color,
    title,
    tickSize = 6,
    width = 320,
    height = 75 + tickSize,
    marginTop = 35,
    marginRight = 30,
    marginBottom = 30 + tickSize,
    marginLeft = 30,
    ticks = width / 64,
    tickFormat,
    tickValues
  } = {}) {

    const svg = d3.select("div#container2").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible")
      .style("display", "block");
  
    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x;
  
    // Continuous
    if (color.interpolate) {
      const n = Math.min(color.domain().length, color.range().length);
  
      x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
  
      svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
    }
  
    // Sequential
    else if (color.interpolator) {
      x = Object.assign(color.copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)), {
          range() {
            return [marginLeft, width - marginRight];
          }
        });
  
      svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.interpolator()).toDataURL());
  
      // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
      if (!x.ticks) {
        if (tickValues === undefined) {
          const n = Math.round(ticks + 1);
          tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
        }
        if (typeof tickFormat !== "function") {
          tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
        }
      }
    }
  
    // Threshold
    else if (color.invertExtent) {
      const thresholds = color.thresholds ? color.thresholds() // scaleQuantize
        :
        color.quantiles ? color.quantiles() // scaleQuantile
        :
        color.domain(); // scaleThreshold
  
      const thresholdFormat = tickFormat === undefined ? d => d :
        typeof tickFormat === "string" ? d3.format(tickFormat) :
        tickFormat;
  
      x = d3.scaleLinear()
        .domain([-1, color.range().length - 1])
        .rangeRound([marginLeft, width - marginRight]);
  
      svg.append("g")
        .selectAll("rect")
        .data(color.range())
        .join("rect")
        .attr("x", (d, i) => x(i - 1))
        .attr("y", marginTop)
        .attr("width", (d, i) => x(i) - x(i - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", d => d);
  
      tickValues = d3.range(thresholds.length);
      tickFormat = i => thresholdFormat(thresholds[i], i);
    }
  
    // Ordinal
    else {
      x = d3.scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, width - marginRight]);
  
      svg.append("g")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);
  
      tickAdjust = () => {};
    }
  
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues))
      .call(tickAdjust)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 15)
        .attr("fill", "white")
        .attr("text-anchor", "start")
        .style("font-size", "15px")
        .text(title));
  
    return svg.node();
  }
  
  function ramp(color, n = 256) {
    var canvas = document.createElement('canvas');
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }

features = ["Sky","Building","Landscaping","Tree","Sidewalk","Concrete","Road","entropy"]


let margin = { top: 0, right: 0, bottom: 0, left: 0 }
    , width = 700
    , height = 900


const svg = d3.select("div#container1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

d3.select("select#feature").selectAll("option")
        .data(features)
        .enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => d)

const projection = d3.geoMercator()


d3.json("https://texas-education.s3-us-west-2.amazonaws.com/roads_entropy.json")
    .then(data => {

        let initialFeature = document.getElementById("feature").value
        createMapAndLegend(data, initialFeature )

        d3.select("select#feature").on("change", function () {
            var selectedFeature = d3.select(this).property('value')
            createMapAndLegend(data, selectedFeature)
            console.log(selectedFeature)
        });
    })

function createMapAndLegend(data, selectedFeature) {

    svg.selectAll('path').remove();
    d3.select("#container2").selectAll("*").remove();


    projection.fitExtent(
        [
            [0, 0],
            [width, height],
        ],
        data
    )
            
    let geoGenerator = d3.geoPath().projection(projection);

    let my_data = data.features.map(x => x.properties[selectedFeature])
    
    let quantile = d3.scaleQuantile()
        .domain(my_data)
        .range(d3.range(0.1, 0.98, 0.1))

    svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", geoGenerator)
    .attr("stroke", function (d) {
        return d3.interpolateInferno(quantile(d.properties[selectedFeature]))
    })
    .attr("stroke-width",1.7)

    legend({
        color: d3.scaleSequentialQuantile(my_data, d3.interpolateInferno),
        title: selectedFeature,
        tickFormat: ".3f",
        ticks: 3
      })
      
}