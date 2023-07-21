//---------------------------------------------------
// Application to allow a user to explore data about the various microbes in the
// human belly button, based on data from the North Carolina State Public Science Lab,
// see http://robdunnlab.com/projects/belly-button-biodiversity/ for more information
// about the study and the readme file in the github repository greberr09/belly_button_challenge
// for more information about this application project and the code.
//
// This application allows a user to select a volunteer study participant from a drop-down
// list of volunteer ids.  It then displays demographic data about that participant,
// a gauge of the participant's weekly washing of the participant's belly button, a
// bar chart showing the top ten microbes found in the samples taken, and a bubble
// chart showing the microbes for all samples taken from that participant.  The study participants are 
// identified by id number, and, in most cases, city and state, but no personally
// identifiying information is accessible.  
//
// A dataset from this study is publically available at
// "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json".
//
// The gauge to show washings per week is a bonus part of this project.  The code for that function is included 
// here and not in the second javascript file, bonus.js, that initially was provided as an empty file.
//---------------------------------------------------

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function getSampleData(item, sampleList) {

  sampleData = sampleList.find(function(sampleItem) {
    return sampleItem.id == item.id; 
  });

  if (!Object.keys(sampleData).length)
    {console.log ("No sample data found")};

  return sampleData;
};
//---------------------------------------------------
// Function to display a table of the demograpic data about the selected volunteer.
// A decision was made to write this function using raw javascript,
// as several online sources suggested to do to get certain table attribtues to work.
// Another way to write this function would be using d3.  A more streamlined version
// of this function was developed that way (see README), but the hidden and overflow 
// properties do not work the same way for long data rows in d3, and a css file would 
// be necessary for the table cell to format long data properly in all browsers.
// Adding the metric name and its value as a single string, and not in two table
// data cells, works fine in d3.  The sample solution showed the output that way, but  
// the data are not aligned for easy readability, so more verbose code was chosen for 
// better usability.
//---------------------------------------------------
function updateMetrics(item) {

    // get panel where the table will be built and be
    // sure it is emptied of any rows from a prior id

    metricsPanel = document.querySelector(".panel-body");
    metricsPanel.innerHTML = "";

    // Create the table structure and remove any old data
    var table = document.createElement("table");

    // the "fixed" attribute rather than auto has to be used to allow 
    // the ellipsis where a cell's data is very long
    table.style.tableLayout = "fixed";
    table.width = 140;
    table.innerHTML = "";

    metricsPanel.appendChild(table);

    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var headerRow = document.createElement("headerRow");

    hCell1 = document.createElement("th")
    hCell1.textContent = "Metric";
    hCell1.width = 9;
    hCell1.style.paddingRight = "24px";
    hCell2 = document.createElement("th");
    hCell2.textContent = "Value";
  
    headerRow.appendChild(hCell1);
    headerRow.appendChild(hCell2);
    thead.appendChild(headerRow);

    table.appendChild(thead);
  
    // Iterate over the sample item and create table rows
    for (var index in item) {

        value = item[index];

        // Create a table row
        row = document.createElement("tr");

        // Create table data for metric name
        indexData = document.createElement("td");
        indexData.textContent = index;
        indexData.width = 9;
        indexData.style.fontSize = "12px";

        // Create table data for value of metric
        valueData = document.createElement("td");
        valueData.style.width = 120;
        valueData.style.fontWeight = 'bold';
        valueData.style.whiteSpace = "nowrap";
        valueData.style.fontSize = "12px";
        valueData.style.overflow = "hidden";
        
        //---------------------------------------------------
        // A div has to be created inside the cell because
        // the ellipsis and hidden properties work as needed on divs not cells.
        // Using a div within the cell and the use of "inline-block", 
        // "nowrap", "hidden", and "ellipsis" to handle very long 
        // text elements, are a combination of extensive research on stackOverflow, 
        // Chatgpt, and some javascript training cites aimed at people building 
        // their own websites, such as css visual dictionary.  While these 
        // attributes can be applied at the cell level without error,  that will 
        // not produce the desired resulte.   
        //---------------------------------------------------
        
        var div = document.createElement("div");
        div.id = "topTenDiv";
        div.style.maxWidth = "100%";
        div.style.display = "inline-block"; 
        div.style.whiteSpace = "nowrap";
        div.style.overflow = "hidden";
        div.style.textOverflow = "ellipsis";

        // Add the value for this metric to the div
        div.textContent = value;

        // Append the div to the table cell, row, and table body
        valueData.appendChild(div);
        row.appendChild(indexData);
        row.appendChild(valueData);
        tbody.appendChild(row);
    };

    // Append the table body to the table
    table.appendChild(tbody);
};

// function to display a bar graph of the top ten most prevalent microbes for this volunteer 
function getTopTen(item, sdata) {

    // get the div that holds the bar chart
    var microbeDiv = document.getElementById("bar");

    // get the sample values for this item id
    sdata = getSampleData(item, samples);

    // Reverse the sample data to be in descending number of microbes.
    // This makes use of the fact that the original study data are
    // entered in the samples array already ordered.  Javascript
    // slice() includes the lower bound but not the upper bound.

    if (sdata) {
      top_ten_otus = sdata.otu_ids.slice(0, 10);
      top_ten_otus.reverse();
      top_ten_values = sdata.sample_values.slice(0, 10); 
      top_ten_values.reverse();
      top_ten_labels = sdata.otu_labels.slice(0, 10);
      top_ten_labels.reverse();
    }

    // Define plot data and layout
    var microbeData = [{
        x: top_ten_values,
        type: 'bar',
        orientation: 'h',
        text: top_ten_labels
    }];

    var microbeLayout = {
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
    Plotly.newPlot(microbeDiv, microbeData, microbeLayout);
};
  
// function to draw a bubble chart of the microbes in this volunteer's samples
function drawBubbleChart(item, itemSamples) {

    // get div for the bubble chart
    let bubbleDiv = document.getElementById("bubble");

    //---------------------------------------------------
    // Define plot data and layout.  Set sizemode to area of plot
    // rather than diameter to handle small sample sizes.
    // Set sizeref to value as small as possible so that bubbles are not 
    // too big for sample sizes of ten but are visible for sample sizes of 3 and 4
    // These settings were determined by trial and error on a selected set of
    // volunteer ids that had extremes, and then a varying set of others chosen
    // differently for each run.
    //---------------------------------------------------
  
    var bubbleData = [{
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

    var bubbleLayout = {
      title: 'Microbes per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Microbes' },
      hovermode: "closest",
    };
  
    // Create the plot using Plotly
    Plotly.newPlot(bubbleDiv, bubbleData, bubbleLayout);
  
  };

//---------------------------------------------------
// Bonus function to display a gauge of the times per week this volunteer scrubs the belly button
// This code is included here and not in the separate bonus.js file originally provided.
// The formatting of the gauge with the moving bar approaching the threshold is based on one
// of the sample gauges in the Plotly documentation, with modifications.
//---------------------------------------------------
function getWashings(item) {

    var washingDiv = document.getElementById("gauge");

    var numWashings = item.wfreq;

    if (numWashings == null) {
        numWashings = 0};

    var gaugeData = [
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

      var gaugeLayout = {
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "darkblue", family: "Arial" }
      };
      
      // draw the plot
      Plotly.newPlot(washingDiv, gaugeData, gaugeLayout);
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
  var dropdownMenu = document.getElementById("selDataset");

  // add the list of names to the selection
  names.forEach(name => {
    let option = document.createElement("option");
    option.value = name;
    option.text = name;
    dropdownMenu.appendChild(option);
  });
};

function updatePlotly(newVolunteer, newSample) {

    // Update the tables, gauges, and plots for the new data item
    updateMetrics(newVolunteer);
    getTopTen(newVolunteer, newSample);
    drawBubbleChart(newVolunteer, newSample);
    getWashings(newVolunteer);
};

//---------------------------------------------------
// initialize the drop down list with the list of ids from the json and display
// data in each panel for a default initial choice of id
//---------------------------------------------------
function init() {

    // Fetch the JSON data and log it
    fetchData(url).then(data => {
      names = data.names;
      volunteers = data.volunteers;
      samples = data.samples;

      console.log("names: " + names);

      // Build the drop down list of study participants
      buildDropdown(names);

      defaultID = names[0];

      // Build all tables, charts, and gauges for the default id
    
      defaultItem = volunteers.find(function(volunteer) {
        return volunteer.id == defaultID;
      });

      if (defaultItem) {

          // get the sample values for this item id
          var sampleData = getSampleData(defaultItem, samples);

          if (sampleData) {
              updatePlotly(defaultItem, sampleData);
          }
          else {console.log("samples not found for item " + defaultItem)};
      }
      else {console.log("No data for item " + defaultItem)};
      });
};

// This function is called within the index.html when a dropdown menu item is selected
function optionChanged(newID) {

    // Fetch the new JSON data and log ii
    fetchData(url).then(data => {
        names = data.names;
        volunteers = data.volunteers;
        samples = data.samples;

        newItem = volunteers.find(function(newVolunteer) {
          return newVolunteer.id == newID;
        });
   
        if (newItem) {
          // get the sample values for this item id        
          let newSampleData = getSampleData(newItem, samples);

          if (newSampleData) {
              // Call function to update the charts and graphs
              updatePlotly(newItem, newSampleData);
          }
            else {console.log("samples for" + newID + "not found")};
        }  
          else {console.log("item " + newID + " not found")
        };

  });
};

init();

d3.selectAll("#selDataset").on("change", optionChanged(newID));
