const drawHistogram = (data) => {
    // Step 6.1 Set the dimensions and margins of the chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`) // Ressponsive SVG

    // Create an inner chart group with margins
    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Step 6.2 Set up bins
    // First, in shared-constants.js, create a bin generator using d3.bin
    // Second, Generate the bins
    const bins = binGenerator(data); // Save the bins into an array

    console.log(bins); // Log the bins to the console for debugging

    // Step 6.3 Get the lower and upper bounds of bins
    const minEng = bins[0].x0; // Lower bound of the first bin
    const maxEng = bins[bins.length - 1].x1; // Upper bound of the last bin
    const binsMaxLength = d3.max(bins, d => d.length); // Get the maximum length of the bins

    // Define scales (from shared constants)
    xScale
        .domain([minEng, maxEng]) 
        .range([0, innerWidth]); 
    yScale
        .domain([0, binsMaxLength]) 
        .range([innerHeight, 0])
        .nice(); //Use the nice() method to round the y-axis values

    // Step 6.4 Draw the bars of the histogram
    innerChart
        .selectAll("rect")
        .data(bins)
        .join("rect")
            .attr("x", d => xScale(d.x0)) // Position the bar based on the lower bound of the bin
            .attr("y", d => yScale(d.length)) // Position the bar based on the count of items in the bin
            .attr("width", d => xScale(d.x1) - xScale(d.x0)) // Set the width of the bar based on the bin width
            .attr("height", d => innerHeight - yScale(d.length)) // Set the height of the bar based on the count of items in the bin
            .attr("fill", barColor) // Use a color from shared constants
            .attr("stroke", bodyBackgroundColor) // Use a color from shared constants
            .attr("stroke-width", 2); // Set the stroke width of the bars

    // Step 6.5 Add axes
    const bottomAxis = d3.axisBottom(xScale); // Create the bottom axis using the xScale

    // Add the x-axis to the bottom of the inner chart
    innerChart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`) // Move the axis to the bottom of the inner chart
        .call(bottomAxis); // Call the bottom axis
    
    // Add the x-axis label
    svg
        .append("text")
        .text("Labeled Energy Consumption (kWh/yr)") // Set the text of the label
        .attr("text-anchor", "end") // Center the text
        .attr("x", width -20) // Position the label at the right edge of the chart
        .attr("y", height -5) // Position the label at the bottom of the chart
        .attr("class", "axis-label"); // Set the color of the label in visualization.css

    // Step 6.6 Add left axis
    const leftAxis = d3.axisLeft(yScale); // Create the left axis using the yScale

    // Add the y-axis to the left of the chart relative to the inner chart
    innerChart
        .append("g")
        .call(leftAxis); // Call the left axis
    
    svg
        .append("text")
        .text("Frequency") // Set the text of the label
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label"); // Set the color of the label in visualization.css
};