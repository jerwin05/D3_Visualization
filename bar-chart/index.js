let paddingLeft=80;
let paddingBottom=60;
let paddingRight=35;

let h=450;
let w=850;
let barWidth=w/275;
let overlayWidth=(w-paddingLeft-paddingRight)/275;

const axisFontSize=14;

const svg=d3.select('#chart')
    .append('svg')
    .attr('height',h)
    .attr('width',w);

svg.append('text')
    .attr('transform','rotate(-90)')
    .attr('x',-275)
    .attr('y',12)
    .text('Gross Domestic Product');

svg.append('text')
    .attr('x',w/2.5-paddingRight)
    .attr('y',h-5)
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf');

const overlay=d3
    .select('#chart')
    .append('div')
    .attr('class','overlay')
    .style('opacity',0);

const tooltip=d3
    .select('#chart')
    .append('div')
    .attr('id','tooltip')
    .style('opacity',0);

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response=>response.json()
        .then(result=>{

            //get GDP values
            const GDP=result.data.map(item=>item[1]);

            //get year values
            const year = result.data.map(item=>new Date(item[0]));

            //get year with their respective quarter
            const yearDate = result.data.map(item=>{
                var quarter,
                    year=item[0].substring(0,4),
                    tempQuarter=item[0].substring(5,7);

                switch(tempQuarter){
                    case '01':quarter='Q1';break;
                    case '04':quarter='Q2';break;    
                    case '07':quarter='Q3';break;
                    case '10':quarter='Q4';break;
                }

                return `${year} ${quarter}`;
            })

            const maxDate=new Date(d3.max(year));
            maxDate.setMonth(maxDate.getMonth()+3);

            const xScale= d3.time.scale()
              .domain([d3.min(year),maxDate])
              .range([paddingLeft,w-paddingRight]);
                
            const yAxisScale = d3.scale.linear()
                .domain([0,d3.max(GDP)]).range([h-paddingBottom,10]); 

            const barYScale=d3.scale.linear()
                .domain([0,d3.max(GDP)]).range([10,h-paddingBottom]);

            const scaledGDP = result.data    
                .map(item=>barYScale(item[1]));

            const yAxis= d3.svg.axis()
                .orient('left')
                .scale(yAxisScale);

            const xAxis=d3.svg.axis()
                .orient('bottom')
                .scale(xScale)
                .ticks(14);
            //----------------------------------

            // call x and y axis
            svg.append('g')
                .attr('transform',`translate (${paddingLeft},0)`)
                .style("font-size",axisFontSize)
                .attr('id','y-axis')
                .call(yAxis);

            svg.append('g')
                .attr('transform',`translate (0,${h-paddingBottom})`)
                .style("font-size",axisFontSize)
                .attr('id','x-axis')
                .call(xAxis);

            //----------------------------------

            //select line using default classname
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

            svg.selectAll('rect')
                .data(scaledGDP) 
                .enter()
                .append('rect')
                .attr('y',d=>h-(d+paddingBottom+1))   
                .attr('x',(d,i)=>xScale(year[i]))
                .attr('class','bar')
                .attr('data-gdp',(d,i)=>GDP[i])
                .attr('data-date',(d,i)=>year[i])
                .attr('width',barWidth)
                .attr('fill','#33ADFF')
                .attr('height',d=>d)
                .on('mouseover',(d,i)=>{
                    overlay
                        .style('height',d+'px')
                        .style('width',barWidth+'px')
                        .style('left',`${i*overlayWidth}px`)
                        .style('top',`${h-paddingBottom-d-1}px`)
                        .style('opacity',0.9)
                        .style('transform',`translate(${paddingLeft}px,0px)`);
                    tooltip
                        .style('opacity',0.9);
                    tooltip
                        .html(yearDate[i] +'<br>$'+     
                            GDP[i].toString().replace(/(\d)(?=(\d{3})+\.)/g,'$1,')
                            +' Billion')
                        .attr('data-date',result.data[i][0])
                        .style('left',`${i*overlayWidth+50}px`);
                })
                .on('mouseout',(d,i)=>{
                    overlay
                        .transition()
                        .duration(200)
                        .style('opacity',0);
                    tooltip
                        .transition()
                        .duration(200)
                        .style('opacity',0);
                });
        }
    )
)