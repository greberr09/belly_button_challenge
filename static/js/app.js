

// "id": 940, "ethnicity": "Caucasian", "gender": "F", "age": 24.0, "location": "Beaufort/NC", "bbtype": "I", "wfreq": 2.0},

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const defaultID = 940;

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

let names = [];
let fieldnames = [];
let volunteers = [];
let samples = [];

let defaultItem = {};


function updateMetrics(item) {

  console.log("update Metrics for: " + item);

  metricsPanel = document.querySelector(".panel-body");

  // Create the table structure
  var table = document.createElement("table");
  var thead = document.createElement("thead");
  var tbody = document.createElement("tbody");
  
  // Create the header row
  headerRow = document.createElement("tr");
  hCell1 = document.createElement("th");
  hCell2 = document.createElement("th");
  hCell1.textContent = "Metric";
  hCell2.textContent = "Value";
  
  headerRow.appendChild(hCell1);
  headerRow.appendChild(hCell2);
  
  thead.appendChild(headerRow);
  
  // Create the table body rows


  // Iterate over the sample item and create table rows
  for (var index in item) {
    value = item[index];

    // Create a table row
    row = document.createElement("tr");

    // Create table data for metric
    indexData = document.createElement("td");
    indexData.textContent = index;
    indexData.style.paddingRight = "12px"; 

    // Create table data for value of metric
    valueData = document.createElement("td");
    valueData.textContent = value;
    valueData.style.paddingRight = "12px";

    // Append the table data to the row
    row.appendChild(indexData);
    row.appendChild(valueData);

    // Append the row to the table body
    tbody.appendChild(row);
  }

  // Append the table components to the containing panel element
  metricsPanel.appendChild(table);
  table.appendChild(thead);
  table.appendChild(tbody);

};

function getTopTen(item) {


  console.log("Get top ten for: " + item.id);
  let sample_data = {};

  var microbeDiv = document.getElementById("bar");

  sample_data = samples.find(function(item) {
    return samples.id === item.id;
  });


  // Define plot data and layout
  var microbe_data = [{
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    type: 'bar'
  }];

  var layout = {
    title: 'Top Ten Most Prevalent Microbes',
    xaxis: { title: 'X-axis' },
    yaxis: { title: 'Y-axis' }
  };
  
  
  // Create the plot using Plotly.js
  Plotly.newPlot(microbeDiv, microbe_data, layout);
  

};
  
function getWashings(item) {

  console.log("get washings for: " + item);
};
  
function drawBubbleChart(item) {

  console.log("Bubble chart for: " + item);
  
  
  var bubbleDiv = document.querySelector("#bubble");
  
  // Define plot data and layout
  var bubble_data = [{
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    type: 'bubble'
  }];
  
  var layout = {
    title: 'Bubble Plot',
    xaxis: { title: 'X-axis' },
    yaxis: { title: 'Y-axis' }
  };
  
  
  // Create the plot using Plotly.js
  Plotly.newPlot(bubbleDiv, bubble_data, layout);
  
  };

function init() {

    // Fetch the JSON data and log it
    d3.json(url).then(function(data) {
      console.log(data);

      names = data.names;
      volunteers = data.metadata;
      samples = data.samples;
      fieldnames = Object.keys(volunteers[0]);
      console.log(names);
      console.log(names.length);
      console.log(volunteers[0]["ethnicity"]);
      console.log(fieldnames);
      console.log(volunteers[2]);

      // Access the dropdown menu element
      var dropdownMenu = document.getElementById("selDataset");

      // Create options for the dropdown menu
      for (let i = 0; i < names.length; i++) {
        
        let sample1 = names[i];
 
        var option = document.createElement("option");
        option.value = sample1;
        option.text = sample1;
        dropdownMenu.appendChild(option);
      };
      
      defaultItem = volunteers.find(function(volunteer) {
        return volunteer.id === defaultID;
      });

      console.log (defaultItem);

      // update all of the plots and charts
      updateMetrics(defaultItem);
      getTopTen(defaultItem);
      drawBubbleChart(defaultID);
      getWashings(defaultID);
    });
};

// let australia = Object.values(data.australia);

//   backtick char for fstring   `



function optionChanged(idNum) {

  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a letiable
  let dataset = dropdownMenu.property("value");

  // Initialize an empty array for the country's data
  // let data = [];

  //if (dataset == 'australia') {
    //  data = australia;
  //}

  // Call function to update the chart
// updatePlotly(data);
};




// On change to the DOM, call getData()
// d3.selectAll("#selDataset").on("change", getData);



// Update the restyled plot's values
function updatePlotly(newdata) {
  Plotly.restyle("bar", "values", [newdata]);
};

init();
