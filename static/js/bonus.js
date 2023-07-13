// https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json

// The following example shows how to style your gauge charts. For more information about all possible options check our reference page.

var data = [

  {

    type: "indicator",

    mode: "gauge+number+delta",

    value: 3,

    title: { text: "Belly Button Washing Frequency", font: { size: 16 } },

    subtitle: { text: "Scrubs Per Week", font: { size: 12 } },

    delta: { reference: 7, increasing: { color: "RebeccaPurple" } },

    gauge: {

      axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },

      bar: { color: "darkblue" },

      bgcolor: "white",

      borderwidth: 2,

      bordercolor: "gray",

      steps: [

        { range: [0, 1], color: "red" },
        { range: [2, 3], color: "orange" },
        { range: [4, 5], color: "green" },
        { range: [6, 7], color: "cyan" },
        { range: [8, 9], color: "royalblue" }

      ],

      threshold: {

        line: { color: "red", width: 4 },

        thickness: 0.75,

        value: 3

      }

    }

  }

];


var layout = {

  width: 400,

  height: 300,

  margin: { t: 25, r: 25, l: 25, b: 25 },

  paper_bgcolor: "lavender",

  font: { color: "darkblue", family: "Arial" }

};


Plotly.newPlot('gauge', data, layout);