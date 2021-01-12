const w = 850;
const h = 450;
const paddingLeft=80;
const paddingBottom=40;
const legendDimension=19;
const legendX=850;
const legendY=450;
const labelFontSize=9;
// const axisFontSize=10;

const timeFormat = d3.time.format("%M:%S");

const svg=d3.select('#plot')
    .append('svg')
    .attr('width',w)
    .attr('height',h)
    .style('border','1px solid black');

svg
    .append('text')  
    .attr('transform','rotate(-90)')
    .attr('x',-220)
    .attr('y',15)
    .style('font-weight','500')
    .style('letter-spacing','1.9px')
    .text('Time in Minutes');
svg
    .append('text')  
    .attr('x',legendX-167)
    .attr('y',legendY/2-22+13)
    .attr('font-size',labelFontSize)
    .style('font-weight','500')
    .text('No doping allegations');
svg
    .append('text')  
    .attr('x',legendX-205)
    .attr('y',legendY/2+13)
    .attr('font-size',labelFontSize)
    .style('font-weight','500')
    .text('Riders with doping allegations');
svg
    .append('rect')
    .attr('height',legendDimension)  
    .attr('width',legendDimension)  
    .attr('x',legendX-60)
    .attr('y',legendY/2-22)
    .attr('fill','#FF7F0E');
svg
    .append('rect')  
    .attr('height',legendDimension)  
    .attr('width',legendDimension) 
    .attr('x',legendX-60)
    .attr('y',legendY/2)
    .attr('fill','#1F77B4');

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then(response=>{
    response.json()
    .then(result=>{
        // Y axis values
        // const time=result.map(item=>timeFormat(new Date(`October 13, 2014 00:${item.Time}`)));
        const time=result.map(item=>item.Time);
        const timeExtent=d3.extent(time);
        // X axis values
        const year=result.map(item=>new Date(item.Year.toString()));
        const yearExtent=d3.extent(year);

        const yScale = d3.scale.linear()
            .domain(timeExtent).range([h-paddingBottom,10]);
            // .tickFormat(timeFormat); 

        const xScale= d3.time.scale()
            .domain(yearExtent)
            .range([paddingLeft,w]);

        const yAxis=d3.svg.axis()
            .orient('left')
            .scale(yScale)
            .tickFormat(timeFormat);

        const xAxis=d3.svg.axis()
            .orient('bottom')
            .scale(xScale)
            .ticks(12);

        svg.append('g')
            .attr('transform',`translate(${paddingLeft},0)`)
            .style("font-size",labelFontSize)
            .attr('id','y-axis')
            .call(yAxis);

        svg.append('g')
            .attr('transform',`translate(0,${h-paddingBottom})`)
            .style("font-size",labelFontSize)
            .attr('id','x-axis')
            .call(xAxis);

        //select domain using default domain classname
        var domain = d3.selectAll('.domain');
        domain.attr({
            fill: 'none',
            'stroke-width': 1,
            stroke: 'black'
        });

        //select ticks using default tick classname
        var ticks = d3.selectAll('.tick line');
        ticks.attr({
            fill: 'none',
            'stroke-width': 1,
            stroke: 'black'
        });
        


    })
})