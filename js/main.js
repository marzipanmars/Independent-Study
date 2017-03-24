function visualizeData() {
  /* set width and height of svg image */
  var canvas_width = 1000,
      canvas_height = 800;

  /* scaling to adjust height of scaleBars if they exceed the range */
  var scaling = d3.scaleLinear()
      .range([0, canvas_height]);

  /* create svg element via DOM manipulation */
  var canvas = d3.select(".svgContainer")
    .append("svg")
      .attr("width", canvas_width)
      .attr("height", canvas_height)
    .append("g")
      .attr("transform", "translate(90, 90)")

/* set scaleBar labels, width, height, fill-color, and y-offset */
  var data_categories = ["expression", "awareness", "hope", "embarrassment", "empathy", "fear", "hunger", "joy", "memory", "morality", "joy", "pain", "personality", "attainment", "pleasure", "pride", "anger", "self-restraint", "thought"],
      scale_width = 500,
      scale_height = 25,
      fill_color = "Gainsboro"
      dy = 120;

/* create as many rectangles as there are elements in "data_categories" */
  var scaleBars = canvas.selectAll("rect")
    /* binding data */
    .data(data_categories)
    .enter()
      .append("rect")
        /* set rectangle attributes */
        .attr("y", function(d, i) {
          /* "d" for data and "i" for the indices of the array */
          return i * dy;
        })
        .attr("width", scale_width)
        .attr("height", scale_height)
        .attr("fill", fill_color)

  /* create scaling for the scaleBar axes */
  var scaling_axis = d3.scaleLinear()
      /* set scale from 0-5 */
      .domain([0, 5])
      /* pixel data */
      .range([0, scale_width - 1]);

  /* create axis */
  var axis = d3.axisBottom()
      /* set number of ticks on axis */
      .ticks(5)
      /* pass scale as an argument */
      .scale(scaling_axis);

  /* append axes to scaleBars via group "g" svg element */
  var scaleAxis = scaleBars.select("g")
    .data(data_categories)
    .enter()
      .append("g")
        .attr("class", "scaleAxis")
        /* moves each axis to the bottom of its scaleBar */
        .attr("transform", function(d, i) {
          return "translate(0," + (i * dy + 25) + ")";
        })
        .call(axis);

  /* create a label for each scaleBar */
  var categories = scaleBars.select("text")
    .data(data_categories)
    .enter()
      .append("text")
        .attr("y", function(d, i) {
          return i * dy + (scale_height/1.5);
        })
        .attr("x", scale_width + 25)
        .attr("fill", "DarkSlateGray")
        .text(function(d) {
          return d;
        })

  /* import JSON */
  d3.json("test_data.json", function(data) {

  })
}
