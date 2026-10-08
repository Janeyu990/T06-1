// Build the screen-technology buttons and connect them to histogram filtering.
const populateFilters = (data) => {
    // Step 7.3 Set up buttons and event listeners
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
            .attr("class", d => `filter ${d.isActive ? "active" : ""}`) // Add "active" class to the active button
            .text(d => d.label) // Set the button text to the label of the filter
            .on("click", (e, d) => {
                console.log("Clicked filter:", e);
                console.log("Clicked filter data:", d);

                if (!d.isActive) {

                    // make sure button clicked is not already active
                    filters_screen.forEach(filter => {
                        filter.isActive = d.id === filter.id ? true : false; // Update the isActive property of each filter
                    });

                    // update the filter buttons based onwhich one was clicked
                    d3.selectAll("#filters_screen .filter")
                        .classed("active", filter => filter.id === d.id ? true : false); 

                    updateHistogram(d.id, data); // Call the updateHistogram function with the clicked filter's id and the data
                }
            });
};

const updateHistogram = (filterId, data) => {
    // Step 7.4 Update the histogram
    const updatedData = filterId === "all" 
        ? data 
        : data.filter(tv => tv.screenTech === filterId); // Filter the data based on the selected filter

    const updatedBins = binGenerator(updatedData); // Generate new bins based on the updated data

    d3.select("#histogram")
        .select("svg")
        .selectAll("rect")
        .data(updatedBins)
        .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("y", d => yScale(d.length)) // Update the y position of the bars based on the new bin lengths
            .attr("height", d => innerHeight - yScale(d.length)); // Update the height of the bars based on the new bin lengths

};

// T06-2 Step 3: Creating a tooltip and adding function call to load-data.js
const createTooltip = () => {
    // Step 3.2 Append (a hidden) tooltip to innerChart
    const tooltip = innerChartS
        .append("g")
        .style("opacity", 0); // Initially hide the tooltip
    // Step 3.3 Append tooltip background rectangle
    tooltip
        .append("rect")
            .attr("width", tooltipWidth)
            .attr("height", tooltipHeight)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("fill", barColor)
            .attr("fill-opacity", 0.75);
    // Step 3.4 Apped tooltip text
    tooltip
        .append("text")
            .text("NA")
            .attr("x", tooltipWidth / 2)
            .attr("y", tooltipHeight / 2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("fill", "white")
            .attr("font-weight", 12);

};

// T06-2 Step 3.5 Add functions to react to mouse events
const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");

    // Step 3.6 Select all circles in scatter plot
    // Step 3.7 Attach event listeners to mouseenter and mouseleave events
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            tooltip.select("text")
                .text(`${d.screenSize} inches`);

            // Get the hovered circle's position
            const cx = +e.target.getAttribute("cx");
            const cy = +e.target.getAttribute("cy");

            // Centre the tooltip above the circle
            tooltip
                .interrupt()
                .attr(
                    "transform",
                    `translate(${cx - 0.5 * tooltipWidth},
                               ${cy - 1.5 * tooltipHeight})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .interrupt()
                .style("opacity", 0)
                .attr("transform", "translate(0, 500)");
        });
};