function responsivefy(svg) {
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style('width'), 10),
        height = parseInt(svg.style('height'), 10),
        aspect = width / height;
   
    svg.attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMid')
        .call(resize);
   
    d3.select(window).on(
        'resize.' + container.attr('id'), 
        resize
    );
   
    function resize() {
        const w = parseInt(container.style('width'));
        svg.attr('width', w);
        svg.attr('height', Math.round(w / aspect));
    }
  }

const transitland_endpoint = 'http://transit.land/'
const drivecycle_endpoint = 'https://b9d8625q6c.execute-api.us-east-1.amazonaws.com/'

var margin = { top: 40, right: 50, bottom: 60, left: 60 }
    , width = 600
    , height = 400

const svg = d3.select("div#container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const params = {
    onestop_id:"r-dpz94d-10-5649ea-de8e01"
}

const transitland = new URL('/api/v1/route_stop_patterns.geojson',transitland_endpoint)
const url = new URL('/dev/drivecycle',drivecycle_endpoint)

Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
Object.keys(params).forEach(key => transitland.searchParams.append(key, params[key]))

const drivecycle_url = decodeURIComponent(url.href)
const transitland_route_url = decodeURIComponent(transitland.href)

Promise.all([
    d3.json(drivecycle_url),
    d3.json(transitland_route_url)
]).then(([drivecycle,route]) =>{

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(d3.extent(drivecycle.data, d => d[0]));
    yScale.domain(d3.extent(drivecycle.data, d => d[1]));

    const yaxis = d3.axisLeft()
        .scale(yScale);

    const xaxis = d3.axisBottom()
        .scale(xScale)

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);

    svg.append("g")
        .attr("class", "axis")
        .call(yaxis);

    svg.append("path")
    .datum(drivecycle.data)
    .attr("fill", "none")
    .attr("stroke", "#4096ff")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return xScale(d[0]) })
        .y(function(d) { return yScale(d[1]) })
        )

        // Add the text label for X Axis
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")  // centre below axis
        .text("Time (s)")
        .style("font", "12px sans-serif")

    // Add the text label for Y Axis
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (0 - 50) + "," + (height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Speed (m/s)")
        .style("font", "12px sans-serif")


})

const svg2 = d3.select("div#container2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const params2 = {
    onestop_id:"r-c3nf-1-702631-be6946"
}

const transitland2 = new URL('/api/v1/route_stop_patterns.geojson',transitland_endpoint)
const url2 = new URL('/dev/drivecycle',drivecycle_endpoint)

Object.keys(params).forEach(key => url2.searchParams.append(key, params2[key]))
Object.keys(params).forEach(key => transitland2.searchParams.append(key, params2[key]))

const drivecycle_url2 = decodeURIComponent(url2.href)
const transitland_route_url2 = decodeURIComponent(transitland2.href)

Promise.all([
    d3.json(drivecycle_url2),
    d3.json(transitland_route_url2)
]).then(([drivecycle,route]) =>{

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain(d3.extent(drivecycle.data, d => d[0]));
    yScale.domain(d3.extent(drivecycle.data, d => d[1]));

    const yaxis = d3.axisLeft()
        .scale(yScale);

    const xaxis = d3.axisBottom()
        .scale(xScale)

    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);

    svg2.append("g")
        .attr("class", "axis")
        .call(yaxis);

    svg2.append("path")
    .datum(drivecycle.data)
    .attr("fill", "none")
    .attr("stroke", "#4096ff")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return xScale(d[0]) })
        .y(function(d) { return yScale(d[1]) })
        )

        // Add the text label for X Axis
    svg2.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")  // centre below axis
        .text("Time (s)")
        .style("font", "12px sans-serif")

    // Add the text label for Y Axis
    svg2.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + (0 - 50) + "," + (height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Speed (m/s)")
        .style("font", "12px sans-serif")


})
