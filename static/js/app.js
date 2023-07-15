
// let australia = Object.values(data.australia);

//   backtick char for fstring 
// "id": 940, "ethnicity": "Caucasian", "gender": "F", "age": 24.0, "location": "Beaufort/NC", "bbtype": "I", "wfreq": 2.0},

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


// function to display a table of the demograpic data about the selected volunteer
function updateMetrics(item) {

    console.log("update Metrics for: " + item.id);

    metricsPanel = document.querySelector(".panel-body");
    var container = document.getElementById("your-div-id");
    metricsPanel.innerHTML = "";

    // Create the table structure
    var table = document.createElement("table");
    table.innerHTML = "";

    var thead = document.createElement("thead");
    thead.innerHTML = "";

    var tbody = document.createElement("tbody");
    tbody.innerHTML = "";
  
    // Create the header row
    headerRow = document.createElement("tr");
    hCell1 = document.createElement("th");
    hCell2 = document.createElement("th");
    hCell1.textContent = "Metric";
    hCell2.textContent = "Value";
  
    headerRow.appendChild(hCell1);
    headerRow.appendChild(hCell2);
  
    thead.appendChild(headerRow);
  
    // Iterate over the sample item and create table rows
    for (var index in item) {
        value = item[index];

        // Create a table row
        row = document.createElement("tr");

        // Create table data for metric
        indexData = document.createElement("td");
        indexData.textContent = index;
        indexData.style.paddingRight = "12px"; 
        indexData.style.fontSize = "13px";

        // Create table data for value of metric
        valueData = document.createElement("td");
        valueData.textContent = value;
        valueData.style.paddingRight = "50px";
        valueData.style.whiteSpace = "nowrap";
        valueData.style.fontSize = "13px";

        // Append the table data to the row
        row.appendChild(indexData);
        row.appendChild(valueData);

        // Append the row to the table body
        tbody.appendChild(row);
    };

    // Append the table components to the containing panel element
    metricsPanel.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);
};

// function to display a bar graph of the top ten most prevalent microbes for this volunteer 
function getTopTen(item) {

    console.log("Get top ten for: " + item.id);
    let sampleData = {};
    let top_ten_otus = [];
    let top_ten_values = [];
    let top_ten_labels = [];

    var microbeDiv = document.getElementById("bar");

    sampleData = samples.find(function(item) {

        for (let i = 0; i < samples.length; i++) {
          return samples[i].id == item.id;
        };
    });

    console.log("sample data: " + sampleData.otu_ids);

    // This is taking advantage of the fact that the data is already sorted
    top_ten_otus = sampleData.otu_ids.slice(0, 10);
    top_ten_values = sampleData.sample_values.slice(0, 10); 
    top_ten_labels = sampleData.otu_labels.slice(0, 10);

    console.log("top ten otus: " + top_ten_otus);
    console.log("top ten data: " + top_ten_values);
    console.log("top ten microbes: " + top_ten_labels);

    // Define plot data and layout
    var microbeData = [{
        x: top_ten_values,
        y: top_ten_otus,
        // mode:  'markers',
        type: 'bar',
        orientation: 'h',
        width: 225,
        text: top_ten_labels,
        // marker: {
          // color: 'blue',
          // width: 200
        //}
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
          text: 'OTU ID',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        // categoryorder: 'array',
        // tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
       // ticktext: top_ten_otus,
          tickfont: {
            size: 12
          }
      }
    };
  
    // Create the plot using Plotly.js
    Plotly.newPlot(microbeDiv, microbeData, layout);

};
  
// function to draw a bubble chart of the microbes in this volunteer's samples
function drawBubbleChart(itemSelected) {

    console.log("Bubble chart for: " + itemSelected.id);
  
    var bubbleDiv = document.getElementById("bubble");

    let sampleData = {};

    sampleData = samples.find(function(itemSelected) {

        for (let i = 0; i < samples.length; i++) {
          return samples[i].id == itemSelected.id;
        };
    });

    console.log("Bubble sample " + sampleData.otu_ids);

    // Define plot data and layout
    var bubbleData = [{
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      type: 'bubble',
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: 'Viridis'
      }
    }];
  
    var layout = {
      title: 'Microbes per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Microbes' }
    };
  
    // Create the plot using Plotly.js
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
        width: 400,
        height: 350,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "darkblue", family: "Arial" }
      };
      
      Plotly.newPlot(washingDiv, gauge_data, layout);
};

// initialize the drop down list with the list of ids from the json and display
// data in each panel for a default initial choice of id
function init() {

    // Fetch the JSON data and log it

    d3.json(url).then(function(data) {
      console.log(data);

      names = data.names;
      volunteers = data.metadata;
      samples = data.samples;
      fieldnames = Object.keys(volunteers[0]);
      samplenames = Object.keys(samples[0]);
      console.log("Volunteer ids: " + names);
      // console.log(names.length);
      // console.log(volunteers[0]["ethnicity"]);
      console.log(fieldnames);
      console.log(samplenames);
      console.log("getting data for volunter 3: " + samples[2].otu_ids);

      // Access the dropdown menu element
      var dropdownMenu = document.getElementById("selDataset");

      let sample = defaultID;

      // Create the options for the dropdown menu
      for (let i = 0; i < names.length; i++) {

        sample = names[i];

        option = document.createElement("option");
        option.value = sample;
        option.text = sample;
        dropdownMenu.appendChild(option);
      };
    
      defaultItem = volunteers.find(function(defaultID) {
        console.log("in find default id is: " + defaultID);
        return volunteers.id == defaultID;
      });

      if (defaultItem !== null) {
          console.log ("Default item is: " + defaultItem.id);

          // update all of the plots and charts
          updateMetrics(defaultItem);
          getTopTen(defaultItem);
          getWashings(defaultItem);
          drawBubbleChart(defaultItem);
      }
      else {console.log("item not found")};
    });
};

// This function is called when a dropdown menu item is selected
function optionChanged(newID) {

    console.log("Getting new data");
    console.log("New id is: " + newID);

    newItem = volunteers.find(function(newID) {
        return volunteers.id == newID;
    });

    if (newItem != null) {
        console.log("New item is: " + newItem.ethnicity);

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


