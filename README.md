# belly_button_challenge

I had permission from my instructor to deliver this assignment late.

# Application overview:

Application to allow a user to explore data about the various microbes in the
human belly button, based on data from the North Carolina State Public Science Lab,
see http://robdunnlab.com/projects/belly-button-biodiversity/ for more information
about the study.  A dataset from this study is publically available at
"https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json".

This application allows a user to select a volunteer study participant from a drop-down
list of volunteer ids.  It then displays demographic data about that participant,
a gauge of the participant's weekly washing of the participant's belly button, a
bar chart showing the top ten microbes found in the samples taken, and a bubble
chart showing the microbes for all samples taken from that participant.  The study participants are identified by id number, and, in most cases, city and state, but no personallyidentifiying information is accessible.  

This application is also available on GitHub Pages at https://greberr09.github.io/belly_button_challenge/.

# Installation and packages used:

The application uses d3 and Plotly, both of which are loaded from the "index.html" file, so they do not
have to be installed on the user's machine to work.

# Bonus gauge:

The gauge to show washings per week is a bonus part of this project.  The code for that function is included here and not in the second javascript file, bonus.js, that initially was provided as an empty file.  An empty "bonus.js: file is included as part of the initial items provided, following the instructions to push all of those items to the repository.  A "samples.json" file is included for the same reason.  It contains data downloaded from the belly button diversity study, but the code recontacts the cite and downloads the data when it is initialized.

# Demographic table:

Multiple d3 versions of the function to build the demographic table were written, the first one using the same attributes as is done in the javascript version in the final verion of the "app.js" delivered, but they do not function in the same manner as they do in plain javascript with regard to long data fields.  After much online investigation and trial of different options, it appeared that it would be better to use javascript and css in order to format the data within the table data cell, as some online sources recommended.   One d3 example is below:

function updateMetrics(item) {

    var metricsPanel = d3.select(".panel-body");
    metricsPanel.html("");
    
    var table = metricsPanel.append("table");
    
    var thead = table.append("thead");
    var tbody = table.append("tbody");
    var headerRow = thead.append("tr");
    
    var hCell1 = headerRow.append("th")
        .text("Metric")
        .attr("width", "30px")
        .style("font-size", "12px")
        .style("padding-right", "12px");
    
    var hCell2 = headerRow.append("th")
        .text("Value")
        .style("font-size", "12px");

    for (var index in item) {

        var value = item[index];

        // Create a table row
        var row = tbody.append("tr");
    
        // Create table data for metric name
        var indexData = row.append("td")
            .text(index)
            .attr("width", "20px")
            .style("font-weight", "bold")
            .style("font-size", "12px");
    
        // Create table data for value of the metric
        var valueData = row.append("td")
            .attr("width", "120px")
            .style("font-weight", "bold")
            .style("white-space", "nowrap")
            .style("font-size", "12px");
    
        var div = valueData.append("div")
            .text(String(value))
            .style("max-width", "100%")
            .style("display", "inline-block")
            .style("white-space", "nowrap")
            .style("overflow", "hidden")
            .style("text-overflow", "ellipsis");
    }
    
    // Append the table body to the table
    table.append(tbody);
    
};
