const url = "samples.json";
// var selected_id = d3.select("#selDataset").node().value;

function init() {
  // Grab a reference to the dropdown select element

  // Use the list of sample names to populate the select options
  d3.json(url).then(function(data){
    var names = data.names;
  var select = d3.select("#selDataset");
  for (i =0; i< names.length;i++){ 
      var optn = names[i];
      select
        .append("option")
        .text(optn)
        .property("value", optn)
  };
    // Use the first sample from the list to build the initial plots
    var firstSample = names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);  
};

function buildMetadata(sample) {
    d3.json(url).then(function(data){
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(EachSample => EachSample.id == sample);
    var result = resultArray[0];
    console.log(resultArray);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json(url).then((data)=>{
    // 3. Create a variable that holds the samples array. 
    var samples_array= data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var results_for_bar_graph=samples_array.filter(EachSample => EachSample.id == sample);
    //  5. Create a variable that holds the first sample in the array.  
// 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_array = results_for_bar_graph[0].otu_ids;
    var sample_counts = results_for_bar_graph[0].sample_values;
    //  Create bubble chart
    var trace_bubble = [{
      x: otu_ids_array,
      y: sample_counts,
      mode: 'markers',
      marker:{
        size: sample_counts
      }
    }];
    var bubbleLayout = {
      height: 600,
      width: 600
    };
    Plotly.newPlot("bubble",trace_bubble,bubbleLayout)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    var xticks = sample_counts.slice(0,10);
    var target_ids = otu_ids_array.slice(0,10);
    var yticks = [];
    for (i =0; i< 10;i++){ 
      var ytick = "OTU ".concat(target_ids[i]);
      yticks.push(ytick)
    };

    // 8. Create the trace for the bar chart. 
    var trace_bar = [{
      type:'bar',
      x: xticks,
      y: yticks,
      orientation:"h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      height: 600,
      width: 600
    };
    // 10. Use Plotly to plot the data with the layout. 
    
    Plotly.newPlot("bar",trace_bar,barLayout)});
  }

// d3.json(url).then(function(data) {
//   console.log(data)

//   var name = data['names']
//   console.log(name)

//   var select = document.getElementById(name)
//   for (i =0; i< name.length;i++){ 
//       var optn = name[i];
//       var el =document.createElement("option");
//       el.textContent= optn;
//       el.value= optn;
//       elect.appendChild(el);
//   }

// })






// function getData() {
//     var dropdownMenu = d3.select("#selDataset");
//     // Assign the value of the dropdown menu option to a variable
//     var dataset = dropdownMenu.property("value");
//     // Initialize an empty array for the country's data
//     var data = [];
  
//     if (dataset == 'us') {
//         data = us;
//     }
//     else if (dataset == 'uk') {
//         data = uk;
//     }
//     else if (dataset == 'canada') {
//         data = canada;
//     }
//     // Call function to update the chart
//     updatePlotly(data)
//https://www.geeksforgeeks.org/how-to-create-a-dropdown-list-with-array-values-using-javascript/
