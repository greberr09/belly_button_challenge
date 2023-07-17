
// Application to allow a user to explore data about the various microbes in the
// human belly button, based on data from the North Carolina State Public Science Lab,
// see http://robdunnlab.com/projects/belly-button-biodiversity/ for more information.
//
// This application allows a user to select a volunteer study participant from a drop-down
// list of volunteer ids.  It then displays demographic data about that participant,
// a gauge of the participant's weekly washing of the participant's belly button, a
// bar chart showing the top ten microbes found in the samples taken, and a bubble
// chart showing the microbes for all samples taken from that participant.  The study participants are 
// identified by id number, and, in most cases, city and state, but no personally
// identifiying information is accessible.  A dataset from this study is publically available at
// "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json".

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// the default volunteer for the initial display of all plots
const defaultID = 940;
let defaultItem = {};

// the changed ID that is returned from the html on change of selection
let newID = defaultID;

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// define arrays to hold data optained from the json

// the sets of demographic fields available about each volunter
let fieldnames = [];

// the list of volunter ids
let names = [];

// the demographic data about each volunteer
let volunteers = [];

// the sample data taken from each volunteer
let samples = [];

function getSampleData(item, sampleList) {

  sampleData = sampleList.find(function(sampleItem) {

    console.log("Finding sample data for: " + item.id);
    return sampleItem.id == item.id; 
  });

  if (sampleData) {
    console.log("sample data: " + sampleData.sample_values);}
    else { console.log ("No sample data found")};

  return sampleData;
};

// function to display a table of the demograpic data about the selected volunteer
function updateMetrics(item) {

    console.log("update Metrics for: " + item.id);

    //get panel where the table will be built and be
    // sure it is emptied of any rows from a prior id

    // the "fixed" attribute rather than auto has to be used 
    // to allow the ellipsis where a cell's data is very long

    let table = d3.select(".panel-body")
      .append("table")
      .style("tableLayout", "fixed")
      .style("width", 140);
    table.innerHTML = "";

    let thead = d3.create("thead");
    thead.innerHTML = "";

    let tbody = d3.create("tbody");
    tbody.innerHTML = "";
  
    // Create the header row
    let headerRow = thead.append("tr");

    let hCell1 = headerRow.append('th')
      .text('Metric');
    let hCell2 = headerRow.append('th')
      .text('Value');

    // Iterate over the sample item and create table rows
    for (var index in item) {

        value = item[index];

        // Create a table row
        let row = d3.create("tr");

        // Create table data for metric
        let indexData = d3.create("td")
          .text(index)
          .style("width", "9")
          .style("fontSize", "12px");

        // Create table data for value of metric
        let valueData = d3.create("td")
          .style("width", "120px")
          .style("font-weight", "bold")
          .style("white-space", "nowrap")
          .style("font-size", "12px")
          .style("overflow", "hidden");
        
        // A div has to be created inside the cell because
        // the ellipsis and hidden attributes work as needed on divs not cells.
        // Using a div within the cell and the use of "inline-block", 
        // "nowrap", "hidden", and "ellipsis" to handle very long 
        // text elements are a combination of extensive research on stackOverflow, 
        // Chatgpt, and some njavascript training cites aimed at people building 
        // their own websites, such as css visual dictionary.  While these 
        // attributes can be applied at the cell level without error, as these
        // sources discuss, and demonstrated during development, that will not produce 
        // the desired resulte.   MaxWidth also has to be set to 100% in the div
        // in order for the ellipsis to work, otherwise the "hidden" attribute will 
        // cut off the excess text but the ellipsis will not display to indicate 
        // the extra text.   The word=break and break-all attributes do not recognize 
        // forward slashes as a break or wrap character, so ellipsis was used rather than 
        // having the long line break for those few ids were either ethnicity or location overflow.

        // Set div attributes and add the value for this metric to the div
        let div = d3.create("div")
          .attr("id", "topTenDiv")
          .style("maxWidth", "100%")
          .style("display", "inline-block")
          .style("whiteSpace",  "nowrap")
          .style("overflow", "hidden")
          .style("textOverflow", "ellipsis")
          .text(value);

        // Append the div to the table cell
        valueData.append(div);

        // Append the table data to the row
        row.appendChild(indexData);
        row.appendChild(valueData);

        // Append the row to the table body
        tbody.appendChild(row);
    };

    // Append the table components to the panel element
    metricsPanel.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);
};

// function to display a bar graph of the top ten most prevalent microbes for this volunteer 
function getTopTen(item, sdata) {
    console.log("ttop ten: " + item.id);

    // get the div that holds the bar chart
    var microbeDiv = document.getElementById("bar");

    // get the sample values for this item id
    sdata = getSampleData(item, samples);

    // Reverse the sample data to be in descending number of microbes.
    // This makes use of the fact that the original study data are
    // entered in the samples array already ordered.
    if (sdata) {
      top_ten_otus = sdata.otu_ids.slice(0, 10);
      top_ten_otus.reverse();
      top_ten_values = sdata.sample_values.slice(0, 10); 
      top_ten_values.reverse();
      top_ten_labels = sdata.otu_labels.slice(0, 10);
      top_ten_labels.reverse();
    }

    // print results to the console
    console.log("top ten otus: " + top_ten_otus);
    console.log("top ten data: " + top_ten_values);
    console.log("top ten microbes: " + top_ten_labels);

    // Define plot data and layout
    var microbeData = [{
        x: top_ten_values,
        type: 'bar',
        orientation: 'h',
        text: top_ten_labels
    }];

    var layout = {
      title: {
          text: 'Top Ten Most Prevalent Microbes',
          font: {
            size: 18,
            weight: 'bold'
        }
      },
      xaxis: {
        title: {
          text: 'Number of Microbes',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        tickfont: {
          size: 12
        }
      },
      yaxis: {
        title: {
          text: 'OTU IDs',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticktext: top_ten_otus,
        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          tickfont: {
            size: 12
          }
      }
    };
  
    // Create the plot using Plotly
    Plotly.newPlot(microbeDiv, microbeData, layout);

};
  
// function to draw a bubble chart of the microbes in this volunteer's samples
function drawBubbleChart(item, itemSamples) {

    console.log("Bubble chart for: " + item.id);
    // get div for the bubble chart
    let bubbleDiv = document.getElementById("bubble");

    // Define plot data and layout.  Set sizemode to area of plot
    // rather than diameter to handle small sample sizes.
    // Set sizeref to value as small as possible so that bubbles are not 
    // too big for sample sizes of ten but are visible for sample sizes of 3 and 4
    // These settings were determined by trial and error on a selected set of
    // volunteer ids that had extremes, and then a varying set of others chosen
    // differently for each run.
  
    let bubbleData = [{
      x: itemSamples.otu_ids,
      y: itemSamples.sample_values,
      text: itemSamples.otu_labels,
      type: 'bubble',
      mode: 'markers',
      marker: {
        size: itemSamples.sample_values,
        color: itemSamples.otu_ids,
        colorscale: 'Viridis',
        sizemode: 'area',  
        sizeref: 0.05   
        }
    }];

    var layout = {
      title: 'Microbes per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Microbes' }
    };
  
    // Create the plot using Plotly
    Plotly.newPlot(bubbleDiv, bubbleData, layout);
  
  };

// bonus function to display a gauge of the times per week this volunteer scrubs the belly button
function getWashings(item) {

    console.log("get washings for: " + item.id);

    var washingDiv = document.getElementById("gauge");

    var numWashings = item.wfreq;
    console.log("num washings: " + numWashings);

    if (numWashings == null) {
        numWashings = 0};

    var gauge_data = [
        {
          type: "indicator",
          mode: "gauge+number+delta", 
          value: numWashings,
      
          title: { text: "Belly Button Washing Frequency <br><sub>Scrubs Per Week</sub>", font: { size: 18 } },  
      
          delta: { reference: 7, increasing: { color: "RebeccaPurple" } },
      
          gauge: {
            axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "grey",
      
            steps: [
              { range: [0, 1], color: "crimson" },
              { range: [1, 2], color: "red"},
              { range: [2, 3], color: "darkorange" },
              { range: [3, 4], color: "lightpink" },
              { range: [4, 5], color: "linen" },
              { range: [5, 6], color: "lightcyan" },
              { range: [6, 7], color: "greenyellow" },
              { range: [7, 8], color: "lightgreen" },
              { range: [8, 9], color: "limegreen" }
            ],
      
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 7
            }
          }
        }
      ];

      var layout = {
        //width: 400,
        //height: 350,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "darkblue", family: "Arial" }
      };
      
      Plotly.newPlot(washingDiv, gauge_data, layout);
};

// get initial study data from NC website
function fetchData(url) {
  return d3.json(url).then(data => {
    return {
      names: data.names,
      volunteers: data.metadata,
      samples: data.samples,
    };
  });
};

function buildDropdown(names) {

  // Access the dropdown menu element
  let dropdownMenu = document.getElementById("selDataset");

  // add the list of names to the selection
  names.forEach(name => {
    let option = document.createElement("option");
    option.value = name;
    option.text = name;
    dropdownMenu.appendChild(option);
  });
};

// initialize the drop down list with the list of ids from the json and display
// data in each panel for a default initial choice of id
function init() {

    // Fetch the JSON data and log ii
    fetchData(url).then(data => {
      names = data.names;
      volunteers = data.volunteers;
      samples = data.samples;

      console.log("names: " + names);

      // Build the drop down list of study participants
      buildDropdown(names);

      // Build all tables, charts, and gauges for the default id
    
      defaultItem = volunteers.find(function(volunteer) {
        return volunteer.id == defaultID;
      });

      if (defaultItem) {
          console.log ("Default item is: " + defaultItem.id);

          // get the sample values for this item id
          let sampleData = {};
          sampleData = getSampleData(defaultItem, samples);

          if (sampleData) {
            // update all of the plots and charts
            updateMetrics(defaultItem);
            getTopTen(defaultItem, sampleData);
            getWashings(defaultItem);
            drawBubbleChart(defaultItem, sampleData);
          }
          else {console.log("samples not found")};
      }
      else {console.log("item not found")};
    });
};

// This function is called when a dropdown menu item is selected
function optionChanged(newID) {

    console.log("Getting new data");
    console.log("New id is: " + newID);

    newItem = volunteers.find(function(newVolunteer) {
        return newVolunteer.id == newID;
    });

    if (newItem) {
        console.log("New item is: " + newItem.id);

        // Call function to update the charts and graphs
        updatePlotly(newItem);
      }  
      else {console.log("item not found")};
};

// Update the plots for the new data item
function updatePlotly(newVolunteer) {

     // update all of the plots and charts
    updateMetrics(newVolunteer);
    getTopTen(newVolunteer);
    drawBubbleChart(newVolunteer);
    getWashings(newVolunteer);

  // Plotly.restyle("bar", "values", [newdata]);
};


init();

d3.selectAll("#selDataset").on("change", optionChanged(newID));


