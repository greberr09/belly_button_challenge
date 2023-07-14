
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

// Fetch the JSON data and log it
// Do this only once so promise does not keep refreshing

d3.json(url).then(function(data) {
      console.log(data);

      names = data.names;
      volunteers = data.metadata;
      samples = data.samples;
      fieldnames = Object.keys(volunteers[0]);
      console.log("Volunteer ids: " + names);
      // console.log(names.length);
      // console.log(volunteers[0]["ethnicity"]);
      // console.log(fieldnames);
      console.log("getting data for volunter 3: " + volunteers[2]);

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
});

// function to display a table of the demograpic data about the selected volunteer
function updateMetrics(item) {

    console.log("update Metrics for: " + item.id);

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
    };

    // Append the table components to the containing panel element
    metricsPanel.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);

};

// function to display a bar graph of the top ten most prevalent microbes for this volunteer 
function getTopTen(item) {

    console.log("Get top ten for: " + item.id);
    let sample_data = {};
    let top_ten_otus = [];
    let top_ten_values = [];
    let top_ten_labels = [];

    var microbeDiv = document.getElementById("bar");

    // console.log("div: " + microbeDiv);
    console.log("samples: " + samples[0].otu_ids);

    sample_data = samples.find(function(item) {

        for (let i = 0; i < samples.length; i++) {
      
          return samples[i].id === item.id;
        };
    });

    console.log("sample data: " + sample_data.otu_ids);

    // This is taking advantage of the fact that the data is already sorted
    top_ten_otus = sample_data.otu_ids.slice(0, 10);
    top_ten_values = sample_data.sample_values.slice(0, 10); 
    top_ten_labels = sample_data.otu_labels.slice(0, 10);

    console.log("top ten otus: " + top_ten_otus);
    console.log("top ten data: " + top_ten_values);
    console.log("top ten microbes: " + top_ten_labels);

    // Define plot data and layout
    var microbe_data = [{
        x: top_ten_values,
        y: top_ten_otus,
        // mode:  'markers',
        type: 'bar',
        orientation: 'h',
        width: 225,
        text: top_ten_labels
        // marker: {
        //  color: 'blue',
        // width: 500
        //}
    }];

    var layout = {
        title: {
          text: 'Top Ten Most Prevalent Microbes',
          font: {
            size: 20,
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
          text: 'OTU',
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
    Plotly.newPlot(microbeDiv, microbe_data, layout);

};
  
// function to draw a bubble chart of the microbes in this volunteer's samples
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

// bonus function to display a gauge of the times per week this volunteer scrubs the belly button
function getWashings(item) {

    console.log("get washings for: " + item);

    var washingDiv = document.getElementById("gauge");

    var numWashings = item.wfreq;

};

// initialize the drop down list with the list of ids from the json and display
// data in each panel for a default initial choice of id
function init() {
      
      defaultItem = volunteers.find(function(volunteer) {
        console.log("in find default id is: " + defaultID);
        console.log("volunteers: " + volunteers);
        return volunteer.id == defaultID;
      });

      console.log ("Default item is: " + defaultItem.id);

      // update all of the plots and charts
      updateMetrics(defaultItem);
      getTopTen(defaultItem);
      drawBubbleChart(defaultID);
      getWashings(defaultItem);

};

// This function is called when a dropdown menu item is selected
function optionChanged(newID) {

    console.log("Getting new data");

    // let dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a letiable
    //let newID = dropdownMenu.property("value");

    console.log("New id is: " + newID);

    newItem = volunteers.find(function(volunteer) {
        return volunteer.id == newID;
    });

    console.log("New item is: " + newItem.ethnicity);

    // Call function to update the charts and graphs
    updatePlotly(newItem);
};


// Update the plots for the new data item
function updatePlotly(newVolunteer) {

     // update all of the plots and charts
    updateMetrics(newVolunteer);
    getTopTen(newVolunteer);
    drawBubbleChart(newVolunteer.id);
    getWashings(newVolunteer);

  // Plotly.restyle("bar", "values", [newdata]);
};


// On change to the DOM, call getNewData()
// d3.selectAll("#selDataset").on("change", optionChanged(newID));

init();

d3.selectAll("#selDataset").on("change", optionChanged(newID));


