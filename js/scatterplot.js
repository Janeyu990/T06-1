const drawScatterplot = (data) => {
    // T06-2 Step 2.2
    /// Set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`); // Responsive SVG

    /// Create an inner chart group with margins
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // T06-2 Step 2.3
    /// Set up x and y scales using data extents
    const xExtent = d3.extent(data, d => d.star); // Get the extent of star ratings
    const yExtent = d3.extent(data, d => d.screenSize); // Get the extent of screen sizes

    const xScaleS = d3.scaleLinear()
        .domain([xExtent[0] - 0.5, xExtent[1] + 0.5]) // Add some padding to the x-axis
        .range([0, innerWidth]); // Map star ratings to positions within the chart area

    const yScaleS = d3.scaleLinear()
        .domain([yExtent[0], yExtent[1]]) // Set the domain to the extent of screen sizes
        .range([innerHeight, 0]) // Map screen sizes to positions within the chart area
        .nice();

    /// Map star ratings and screen sizes to positions within the chart area.

    // T06-2 Step 2.4
    /// (Corrected code) Set up colours for screen technologies
    const uniqueTechs = [...new Set(data.map(d => d.screenTech))];

    colorScale
        .domain(data.map(d => d.screenTech)) // Get unique screenTech values
        .range(d3.schemeCategory10); // Use predefined color scheme

    
    // T06-2 Step 2.5 Draw the circles
    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
            .attr("cx", d => xScaleS(d.star)) // Position the circle based on star rating
            .attr("cy", d => yScaleS(d.screenSize)) // Position the circle based on screen size
            .attr("r", 4) // Set a fixed radius for the circles
            .attr("fill", d => colorScale(d.screenTech)) // Color the circle based on screen technology
            .attr("opacity", 0.5); // Set opacity for better visibility

    // T06-2 Step 2.6 Add bottom and left axis
    /// Add axes
    const bottomAxisS = d3.axisBottom(xScaleS); // Create the bottom axis using the xScaleS
    innerChartS.append("g")
        .attr("transform", `translate(0, ${innerHeight})`) // Move the axis to the bottom of the inner chart
        .call(bottomAxisS); // Call the bottom axis

    svg.append("text")
        .text("Star Rating") // Set the text of the label
        .attr("text-anchor", "end") // Center the text
        .attr("x", width - 20) // Position the label at the right edge of the chart
        .attr("y", height - 5) // Position the label at the bottom of the chart
        .attr("class", "axis-label"); // Set the color of the label in visualization.css

    const leftAxis = d3.axisLeft(yScaleS); // Create the left axis using the yScaleS
    innerChartS.append("g")
        .call(leftAxis); // Call the left axis

    svg.append("text")
        .text("Screen Size (inches)") // Set the text of the label
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label"); // Set the color of the label in visualization.css

    // T06-2 Step 2.7 Add legend
    /// Add a legend on the right-hand side
    const legend = svg.append("g")
        .attr('class', 'legend')
        .attr("transform", `translate(${width - 140}, ${margin.top})`); // Position the legend

    uniqueTechs.forEach((tech, i) => {
        const g = legend.append('g').attr("transform", `translate(0, ${i * 22})`); // Position each legend item
        g.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', colorScale(tech)); // Color the rectangle based on screen technology
        g.append('text')
            .attr('x', 18)
            .attr('y', 10)
            .text(tech) // Label the rectangle with the screen technology
            .attr('class', 'axis-label'); // Set the color of the legend text in visualization.css
    });
    // Show each screen technology with its matching point colour.

};