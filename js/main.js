function visualizeData() {
  /* set width and height of svg image */
  var canvas_width = 1000,
      canvas_height = 700;

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
  var data_categories = ["expression", "awareness", "hope", "embarrassment", "empathy", "fear"], //"hunger", "joy", "memory", "morality", "joy", "pain", "personality", "attainment", "pleasure", "pride", "anger", "self-restraint", "thought"],
      scale_width = 500,
      scale_height = 25,
      fill_color = "Gainsboro"
      dy = 100;

  /* create as many rectangles as there are elements in "data_categories" */
  var scaleBars = canvas.selectAll("rect")
    /* binding data */
    .data(data_categories)
    .enter()
      .append("g")
      /* assign unique id to each scaleBar */
      .attr("id", function(d) {
        return d;
      })
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
          return i * dy + (scale_height/1.3);
        })
        .attr("x", scale_width + 10)
        .attr("fill", fill_color)
        .text(function(d) {
          return d;
        })

  /* import JSON */
  d3.json("test_data.json", function(data) {

    /* create array of values from each JSON property */
    var charNames = data.map(function(a) {return a.character;});
    var expressionResults = data.map(function(a) {return (a.expression * 100) - 1;});
    var awarenessResults = data.map(function(a) {return (a.awareness * 100) - 1;});
    var hopeResults = data.map(function(a) {return (a.hope * 100) - 1;});
    var embarrassmentResults = data.map(function(a) {return (a.embarrassment * 100) - 1;});
    var empathyResults = data.map(function(a) {return (a.empathy * 100) - 1;});
    var fearResults = data.map(function(a) {return (a.fear * 100) - 1;});

    /* 1) EXPRESSION */
    var scaling_expression = d3.scaleOrdinal()
      .domain(charNames)
      .range(expressionResults); /* results for expression in corresponding order */
    var tickMarks_expression = d3.axisTop(scaling_expression);
    d3.select("#expression")
      .append("g")
        .attr("class", "tickMarks")
        .call(tickMarks_expression);

    /* 2) AWARENESS */
    var scaling_awareness = d3.scaleOrdinal()
      .domain(charNames)
      .range(awarenessResults); /* results for awareness in corresponding order */
    var tickMarks_awareness = d3.axisTop(scaling_awareness);
    d3.select("#awareness")
      .append("g")
        .attr("class", "tickMarks")
        .attr("transform", "translate(0," + dy + ")")
        .call(tickMarks_awareness);

    /* 3) HOPE */
    var scaling_hope = d3.scaleOrdinal()
        .domain(charNames)
        .range(hopeResults); /* results for hope in corresponding order */
    var tickMarks_hope = d3.axisTop(scaling_hope);
    d3.select("#hope")
      .append("g")
        .attr("class", "tickMarks")
        .attr("transform", "translate(0," + (dy * 2) + ")")
        .call(tickMarks_hope);

    /* 4) EMBARRASSMENT */
    var scaling_embarrassment = d3.scaleOrdinal()
      .domain(charNames)
      .range(embarrassmentResults); /* results for embarrassment in corresponding order */
    var tickMarks_embarrassment = d3.axisTop(scaling_embarrassment);
    d3.select("#embarrassment")
      .append("g")
        .attr("class", "tickMarks")
        .attr("transform", "translate(0," + (dy * 3) + ")")
        .call(tickMarks_embarrassment);

    /* 5) EMPATHY */
    var scaling_empathy = d3.scaleOrdinal()
        .domain(charNames)
        .range(empathyResults); /* results for empathy in corresponding order */
    var tickMarks_empathy = d3.axisTop(scaling_empathy);
    d3.select("#empathy")
      .append("g")
        .attr("class", "tickMarks")
        .attr("transform", "translate(0," + (dy * 4) + ")")
        .call(tickMarks_empathy);

    /* 6) FEAR */
    var scaling_fear = d3.scaleOrdinal()
        .domain(charNames)
        .range(fearResults); /* results for fear in corresponding order */
    var tickMarks_fear = d3.axisTop(scaling_fear);
    d3.select("#fear")
      .append("g")
        .attr("class", "tickMarks")
        .attr("transform", "translate(0," + (dy * 5) + ")")
        .call(tickMarks_fear);
  })
}
