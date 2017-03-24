function visualizeData() {
  var canvas_width = 1000,
      canvas_height = 800;

  var scaling = d3.scaleLinear()
      .domain([0, 0])
      .range([0, canvas_height]);

  var canvas = d3.select(".svgContainer")
    .append("svg")
      .attr("width", canvas_width)
      .attr("height", canvas_height)
    .append("g")
      .attr("transform", "translate(90, 90)")

  var data_categories = ["expression", "awareness", "hope", "embarrassment", "empathy", "fear"], //"hunger", "joy", "memory", "morality", "joy", "pain", "personality", "attainment", "pleasure", "pride", "anger", "self-restraint", "thought"],
      scale_width = 500,
      scale_height = 25,
      fill_color = "Gainsboro"
      dy = 120;

  var scaleBars = canvas.selectAll("rect")
    .data(data_categories)
    .enter()
      .append("rect")
        .attr("y", function(d, i) {
          return i * dy;
        })
        .attr("width", scale_width)
        .attr("height", scale_height)
        .attr("fill", fill_color)

  var scaling_axis = d3.scaleLinear()
      .domain([0, 5])
      .range([0, scale_width - 1]);

  var axis = d3.axisBottom()
      .ticks(5)
      .scale(scaling_axis);

  var scaleAxis = scaleBars.select("g")
    .data(data_categories)
    .enter()
      .append("g")
        .attr("class", "scaleAxis")
        .attr("transform", function(d, i) {
          return "translate(0," + (i * dy + 25) + ")";
        })
        .call(axis);

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

  d3.json("test_data.json", function(data) {
    
  })
}
