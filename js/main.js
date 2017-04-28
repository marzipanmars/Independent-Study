function visualizeData() {
  /* set width and height of svg image */
  var canvas_width = 1200,
  canvas_height = 2000;

  /* scaling to adjust height of scaleBars if they exceed the range */
  // var scaling = d3.scaleLinear()
  //    .range([0, canvas_height]);

  /* create svg element via DOM manipulation */
  var canvas = d3.select(".svgContainer")
  .append("svg")
  .attr("width", canvas_width)
  .attr("height", canvas_height)
  .append("g")
  .attr("transform", "translate(90, 90)")

  /* set scaleBar labels, width, height, fill-color, and y-offset */
  var data_categories = ["expression", "awareness", "hope", "embarrassment",
  "empathy", "fear", "hunger", "joy", "memory", "morality", "pain", "personality",
  "attainment", "pleasure", "pride", "anger", "self-restraint", "thought"],
  scale_width = 801,
  scale_height = 25,
  fill_color = "Gainsboro",
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
  /* sets the height of the ticks in pixels */
  .tickSize(1)
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
    return i * dy + (scale_height/1.25);
  })
  .attr("x", scale_width + 10)
  .attr("fill", fill_color)
  .text(function(d) {
    return d;
  })

  /* import JSON */
  d3.json("parsedata.php", function(data) {

    /* get array of character names from JSON file */
    function getCharNames() {
      var new_array = [];
      for (var i = 0; i < data.length; i++) {
        var name = data[i].character;
        new_array.push(name);
      }
      return new_array;
    }

    var charNames = getCharNames();
    //console.log(charNames);

    /* function to remove duplicates from charNames */
    function rem_dupes(a) {
      var seen = {}; /* create new object */
      var out = [];
      var len = a.length;
      var j = 0;
      for(var i = 0; i < len; i++) {
        var item = a[i];
        /* seen[object_property] */
        if(seen[item] !== 1) {
          seen[item] = 1; /* set object property value to 1 */
          out[j++] = item; /* put charName in output array */
        }
      }
      return out;
    }

    /* call rem_dupes() to remove duplicates from charName */
    charNames = rem_dupes(charNames);
    //console.log(charNames);

    /* function to get median of any category for any character */
    function getMedian(name, category) {
      var array = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].character == name) {
          array.push(data[i][category]);
        }
      }
      return d3.median(array);
    }

    /* function concatenates median of given category for all characters */
    function concatMedians(category) {
      var array = [];
      for (var i = 0; i < charNames.length; i++) {
        var median = getMedian(charNames[i], category);
        // console.log(median);
        array.push(median);
      }
      return array;
    }

    /* create array of median values for each category */
    var expressionResults = concatMedians("expression");
    var awarenessResults = concatMedians("awareness");
    var hopeResults = concatMedians("hope");
    var embarrassmentResults = concatMedians("embarrassment");
    var empathyResults = concatMedians("empathy");
    var fearResults = concatMedians("fear");
    var hungerResults = concatMedians("hunger");
    var joyResults = concatMedians("joy");
    var memoryResults = concatMedians("memory");
    var moralityResults = concatMedians("morality");
    var painResults = concatMedians("pain");
    var personalityResults = concatMedians("personality");
    var attainmentResults = concatMedians("attainment");
    var pleasureResults = concatMedians("pleasure");
    var prideResults = concatMedians("pride");
    var angerResults = concatMedians("anger");
    var self_restraintResults = concatMedians("self-restraint");
    var thoughtResults = concatMedians("thought");

    /* function to adjust the median values to properly fit the scale */
    function adjustToScaleSize(array) {
      for (var i = 0; i < array.length; i++) {
        array[i] = array[i] * (Math.floor(scale_width/5));
      }
    }

    /* adjust all array of medians to fit the scale */
    adjustToScaleSize(expressionResults);
    adjustToScaleSize(awarenessResults);
    adjustToScaleSize(hopeResults);
    adjustToScaleSize(embarrassmentResults);
    adjustToScaleSize(empathyResults);
    adjustToScaleSize(fearResults);

    adjustToScaleSize(hungerResults);
    adjustToScaleSize(joyResults);
    adjustToScaleSize(memoryResults);
    adjustToScaleSize(moralityResults);
    adjustToScaleSize(painResults);
    adjustToScaleSize(personalityResults);

    adjustToScaleSize(attainmentResults);
    adjustToScaleSize(pleasureResults);
    adjustToScaleSize(prideResults);
    adjustToScaleSize(angerResults);
    adjustToScaleSize(self_restraintResults);
    adjustToScaleSize(thoughtResults);

    /* 1) EXPRESSION */
    var scaling_expression = d3.scaleOrdinal()
    .domain(charNames) /* domain is discrete (elements of array must be unique) */
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

    /* 7) HUNGER */
    var scaling_hunger = d3.scaleOrdinal()
    .domain(charNames)
    .range(hungerResults); /* results for hunger in corresponding order */
    var tickMarks_hunger = d3.axisTop(scaling_hunger);
    d3.select("#hunger")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 6) + ")")
    .call(tickMarks_hunger);

    /* 8) JOY */
    var scaling_joy = d3.scaleOrdinal()
    .domain(charNames)
    .range(joyResults); /* results for joy in corresponding order */
    var tickMarks_joy = d3.axisTop(scaling_joy);
    d3.select("#joy")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 7) + ")")
    .call(tickMarks_joy);

    /* 9) MEMORY */
    var scaling_memory = d3.scaleOrdinal()
    .domain(charNames) /* domain is discrete (elements of array must be unique) */
    .range(memoryResults); /* results for memory in corresponding order */
    var tickMarks_memory = d3.axisTop(scaling_memory);
    d3.select("#memory")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 8) + ")")
    .call(tickMarks_memory);

    /* 10) MORALITY */
    var scaling_morality = d3.scaleOrdinal()
    .domain(charNames)
    .range(moralityResults); /* results for morality in corresponding order */
    var tickMarks_morality = d3.axisTop(scaling_morality);
    d3.select("#morality")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 9) + ")")
    .call(tickMarks_morality);

    /* 11) PAIN */
    var scaling_pain = d3.scaleOrdinal()
    .domain(charNames)
    .range(painResults); /* results for pain in corresponding order */
    var tickMarks_pain = d3.axisTop(scaling_pain);
    d3.select("#pain")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 10) + ")")
    .call(tickMarks_pain);

    /* 12) PERSONALITY */
    var scaling_personality = d3.scaleOrdinal()
    .domain(charNames)
    .range(personalityResults); /* results for personality in corresponding order */
    var tickMarks_personality = d3.axisTop(scaling_personality);
    d3.select("#personality")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 11) + ")")
    .call(tickMarks_personality);

    /* 13) ATTAINMENT */
    var scaling_attainment = d3.scaleOrdinal()
    .domain(charNames)
    .range(attainmentResults); /* results for attainment in corresponding order */
    var tickMarks_attainment = d3.axisTop(scaling_attainment);
    d3.select("#attainment")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 12) + ")")
    .call(tickMarks_attainment);

    /* 14) PLEASURE */
    var scaling_pleasure = d3.scaleOrdinal()
    .domain(charNames)
    .range(pleasureResults); /* results for pleasure in corresponding order */
    var tickMarks_pleasure = d3.axisTop(scaling_pleasure);
    d3.select("#pleasure")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 13) + ")")
    .call(tickMarks_pleasure);

    /* 15) PRIDE */
    var scaling_pride = d3.scaleOrdinal()
    .domain(charNames)
    .range(prideResults); /* results for pride in corresponding order */
    var tickMarks_pride = d3.axisTop(scaling_pride);
    d3.select("#pride")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 14) + ")")
    .call(tickMarks_pride);

    /* 16) ANGER */
    var scaling_anger = d3.scaleOrdinal()
    .domain(charNames)
    .range(angerResults); /* results for anger in corresponding order */
    var tickMarks_anger = d3.axisTop(scaling_anger);
    d3.select("#anger")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 15) + ")")
    .call(tickMarks_anger);

    /* 17) SELF-RESTRAINT */
    var scaling_restraint = d3.scaleOrdinal()
    .domain(charNames)
    .range(self_restraintResults); /* results for self-restraint in corresponding order */
    var tickMarks_restraint = d3.axisTop(scaling_restraint);
    d3.select("#self-restraint")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 16) + ")")
    .call(tickMarks_restraint);

    /* 18) THOUGHT */
    var scaling_thought = d3.scaleOrdinal()
    .domain(charNames)
    .range(thoughtResults); /* results for thought in corresponding order */
    var tickMarks_thought = d3.axisTop(scaling_thought);
    d3.select("#thought")
    .append("g")
    .attr("class", "tickMarks")
    .attr("transform", "translate(0," + (dy * 17) + ")")
    .call(tickMarks_thought);
  })
}
