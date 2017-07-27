/* initialize jquery-nice-select plugin */
$(document).ready(function() {
  $('select').niceSelect();
});

/* clears svgContainer then recreates visualization with new selection */
function revisualizeData() {
  var elements = document.getElementsByTagName("svg");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  visualizeData();
}

function visualizeData() {
  /* set width and height of svg image */
  var canvas_width = 1000,
  canvas_height = 2400;

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
  scale_height = 15,
  fill_color = "Gainsboro",
  dy = 130;

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
    return "translate(0," + (i * dy + 15) + ")";
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

    /* using plain javascript to get selected value from drop-down menus */
    var instructor = document.getElementsByClassName("filterByInstructor")[0];
    var selected_instructor = instructor.options[instructor.selectedIndex].value;
    /* local var SELECTED INSTRUCTOR */
    var term = document.getElementsByClassName("filterByTerm")[0];
    var selected_term = term.options[term.selectedIndex].value;
    /* local var SELECTED TERM */

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

      /* filter only by the instructor */
      if (document.getElementById("termFilterDefault").selected) {
      /* because the void default term filter option has been selected */
      switch(selected_instructor) {
        case "Janet Andrews":
        for (var i = 0; i < data.length; i++) {
          if (data[i].character == name &&
              data[i].instructor == "Janet Andrews") {
            array.push(data[i][category]);
          }
        }
        break;
        case "Joshua de Leeuw":
        for (var i = 0; i < data.length; i++) {
          if (data[i].character == name &&
              data[i].instructor == "Joshua de Leeuw") {
            array.push(data[i][category]);
          }
        }
        break;
        case "John Long":
        for (var i = 0; i < data.length; i++) {
          if (data[i].character == name &&
              data[i].instructor == "John Long") {
            array.push(data[i][category]);
          }
        }
        break;
        default:
        for (var i = 0; i < data.length; i++) {
          if (data[i].character == name) {
            array.push(data[i][category]);
          }
        }
      }
    } else {
      /* filter by both instructor and term */
      switch(selected_instructor) { /* because the void default term filter option was unselected */
        case "Janet Andrews":
        for (var i = 0; i < data.length; i++) {
          if (data[i].character == name &&
              data[i].instructor == "Janet Andrews" &&
              data[i].term == selected_term) {
            array.push(data[i][category]);
          }
        }
        break;
        case "Joshua de Leeuw":
        for (var i = 0; i < data.length; i++) {
          if (data[i].character == name &&
              data[i].instructor == "Joshua de Leeuw" &&
              data[i].term == selected_term) {
            array.push(data[i][category]);
          }
        }
        break;
        case "John Long":
        for (var i = 0; i < data.length; i++) {
          if (data[i].character == name &&
              data[i].instructor == "John Long" &&
              data[i].term == selected_term) {
            array.push(data[i][category]);
          }
        }
        break;
        default:
        for (var i = 0; i < data.length; i++) {
          if (data[i].character == name &&
              data[i].term == selected_term) {
            array.push(data[i][category]);
          }
        }
      }
    }
      return d3.median(array);
    }

    /* function concatenates median of given category for all characters */
    function concatMedians(category) {
      var array = [];
      for (var i = 0; i < charNames.length; i++) {
        var median = getMedian(charNames[i], category);
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
    /* 1A) DRAW TICKS */
    d3.select("#expression")
      .append("g")
      .attr("class", "tickMarks")
      .call(tickMarks_expression);
    /* 1B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#expression .tick")
      .classed("expression", true);
    /* 1C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#expression line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick expression")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < expressionResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(expressionResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 1D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#expression text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick expression")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < expressionResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(expressionResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 2) AWARENESS */
    var scaling_awareness = d3.scaleOrdinal()
    .domain(charNames)
    .range(awarenessResults); /* results for awareness in corresponding order */
    var tickMarks_awareness = d3.axisTop(scaling_awareness);
    /* 2A) DRAW TICKS */
    d3.select("#awareness")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + dy + ")")
      .call(tickMarks_awareness);
    /* 2B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#awareness .tick")
      .classed("awareness", true);
    /* 2C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#awareness line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick awareness")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < awarenessResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(awarenessResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 2D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#awareness text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick awareness")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < awarenessResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(awarenessResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 3) HOPE */
    var scaling_hope = d3.scaleOrdinal()
    .domain(charNames)
    .range(hopeResults); /* results for hope in corresponding order */
    var tickMarks_hope = d3.axisTop(scaling_hope);
    /* 3A) DRAW TICKS */
    d3.select("#hope")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 2) + ")")
      .call(tickMarks_hope);
    /* 3B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#hope .tick")
      .classed("hope", true);
    /* 3C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#hope line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick hope")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < hopeResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(hopeResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 3D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#hope text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick hope")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < hopeResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(hopeResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 4) EMBARRASSMENT */
    var scaling_embarrassment = d3.scaleOrdinal()
    .domain(charNames)
    .range(embarrassmentResults); /* results for embarrassment in corresponding order */
    var tickMarks_embarrassment = d3.axisTop(scaling_embarrassment);
    /* 4A) DRAW TICKS */
    d3.select("#embarrassment")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 3) + ")")
      .call(tickMarks_embarrassment);
    /* 4B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#embarrassment .tick")
      .classed("embarrassment", true);
    /* 4C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#embarrassment line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick embarrassment")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < embarrassmentResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(embarrassmentResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 4D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#embarrassment text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick embarrassment")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < embarrassmentResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(embarrassmentResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 5) EMPATHY */
    var scaling_empathy = d3.scaleOrdinal()
    .domain(charNames)
    .range(empathyResults); /* results for empathy in corresponding order */
    var tickMarks_empathy = d3.axisTop(scaling_empathy);
    /* 5A) DRAW TICKS */
    d3.select("#empathy")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 4) + ")")
      .call(tickMarks_empathy);
    /* 5B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#empathy .tick")
      .classed("empathy", true);
    /* 5C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#empathy line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick empathy")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < empathyResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(empathyResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 5D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#empathy text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick empathy")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < empathyResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(empathyResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 6) FEAR */
    var scaling_fear = d3.scaleOrdinal()
    .domain(charNames)
    .range(fearResults); /* results for fear in corresponding order */
    var tickMarks_fear = d3.axisTop(scaling_fear);
    /* 6A) DRAW TICKS */
    d3.select("#fear")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 5) + ")")
      .call(tickMarks_fear);
    /* 6B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#fear .tick")
      .classed("fear", true);
    /* 6C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#fear line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick fear")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < fearResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(fearResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 6D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#fear text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick fear")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < fearResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(fearResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 7) HUNGER */
    var scaling_hunger = d3.scaleOrdinal()
    .domain(charNames)
    .range(hungerResults); /* results for hunger in corresponding order */
    var tickMarks_hunger = d3.axisTop(scaling_hunger);
    /* 7A) DRAW TICKS */
    d3.select("#hunger")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 6) + ")")
      .call(tickMarks_hunger);
    /* 7B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#hunger .tick")
      .classed("hunger", true);
    /* 7C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#hunger line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick hunger")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < hungerResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(hungerResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 7D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#hunger text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick hunger")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < hungerResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(hungerResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 8) JOY */
    var scaling_joy = d3.scaleOrdinal()
    .domain(charNames)
    .range(joyResults); /* results for joy in corresponding order */
    var tickMarks_joy = d3.axisTop(scaling_joy);
    /* 8A) DRAW TICKS */
    d3.select("#joy")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 7) + ")")
      .call(tickMarks_joy);
    /* 8B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#joy .tick")
      .classed("joy", true);
    /* 8C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#joy line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick joy")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < joyResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(joyResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 8D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#joy text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick joy")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < joyResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(joyResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 9) MEMORY */
    var scaling_memory = d3.scaleOrdinal()
    .domain(charNames) /* domain is discrete (elements of array must be unique) */
    .range(memoryResults); /* results for memory in corresponding order */
    var tickMarks_memory = d3.axisTop(scaling_memory);
    /* 9A) DRAW TICKS */
    d3.select("#memory")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 8) + ")")
      .call(tickMarks_memory);
    /* 9B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#memory .tick")
      .classed("memory", true);
    /* 9C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#memory line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick memory")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < memoryResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(memoryResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 9D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#memory text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick memory")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < memoryResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(memoryResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 10) MORALITY */
    var scaling_morality = d3.scaleOrdinal()
    .domain(charNames)
    .range(moralityResults); /* results for morality in corresponding order */
    var tickMarks_morality = d3.axisTop(scaling_morality);
    /* 10A) DRAW TICKS */
    d3.select("#morality")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 9) + ")")
      .call(tickMarks_morality);
    /* 10B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#morality .tick")
      .classed("morality", true);
    /* 10C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#morality line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick morality")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < joyResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(moralityResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 10D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#morality text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick morality")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < moralityResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(moralityResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 11) PAIN */
    var scaling_pain = d3.scaleOrdinal()
    .domain(charNames)
    .range(painResults); /* results for pain in corresponding order */
    var tickMarks_pain = d3.axisTop(scaling_pain);
    /* 11A) DRAW TICKS */
    d3.select("#pain")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 10) + ")")
      .call(tickMarks_pain);
    /* 11B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#pain .tick")
      .classed("pain", true);
    /* 11C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#pain line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick pain")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < painResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(painResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 11D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#pain text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick pain")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < painResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(painResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 12) PERSONALITY */
    var scaling_personality = d3.scaleOrdinal()
    .domain(charNames)
    .range(personalityResults); /* results for personality in corresponding order */
    var tickMarks_personality = d3.axisTop(scaling_personality);
    /* 12A) DRAW TICKS */
    d3.select("#personality")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 11) + ")")
      .call(tickMarks_personality);
    /* 12B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#personality .tick")
      .classed("personality", true);
    /* 12C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#personality line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick personality")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < personalityResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(personalityResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 12D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#personality text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick personality")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < personalityResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(personalityResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 13) ATTAINMENT */
    var scaling_attainment = d3.scaleOrdinal()
    .domain(charNames)
    .range(attainmentResults); /* results for attainment in corresponding order */
    var tickMarks_attainment = d3.axisTop(scaling_attainment);
    /* 13A) DRAW TICKS */
    d3.select("#attainment")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 12) + ")")
      .call(tickMarks_attainment);
    /* 13B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#attainment .tick")
      .classed("attainment", true);
    /* 13C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#attainment line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick attainment")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < attainmentResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(attainmentResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 13D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#attainment text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick attainment")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < attainmentResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(attainmentResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 14) PLEASURE */
    var scaling_pleasure = d3.scaleOrdinal()
    .domain(charNames)
    .range(pleasureResults); /* results for pleasure in corresponding order */
    var tickMarks_pleasure = d3.axisTop(scaling_pleasure);
    /* 14A) DRAW TICKS */
    d3.select("#pleasure")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 13) + ")")
      .call(tickMarks_pleasure);
    /* 14B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#pleasure .tick")
      .classed("pleasure", true);
    /* 14C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#pleasure line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick pleasure")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < pleasureResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(pleasureResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 14D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#pleasure text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick pleasure")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < pleasureResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(pleasureResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 15) PRIDE */
    var scaling_pride = d3.scaleOrdinal()
    .domain(charNames)
    .range(prideResults); /* results for pride in corresponding order */
    var tickMarks_pride = d3.axisTop(scaling_pride);
    /* 15A) DRAW TICKS */
    d3.select("#pride")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 14) + ")")
      .call(tickMarks_pride);
    /* 15B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#pride .tick")
      .classed("pride", true);
    /* 15C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#pride line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick pride")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < prideResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(prideResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 15D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#pride text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick pride")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < prideResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(prideResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 16) ANGER */
    var scaling_anger = d3.scaleOrdinal()
    .domain(charNames)
    .range(angerResults); /* results for anger in corresponding order */
    var tickMarks_anger = d3.axisTop(scaling_anger);
    /* 16A) DRAW TICKS */
    d3.select("#anger")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 15) + ")")
      .call(tickMarks_anger);
    /* 16B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#anger .tick")
      .classed("anger", true);
    /* 16C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#anger line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick anger")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < angerResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(angerResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 16D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#anger text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick anger")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < angerResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(angerResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 17) SELF-RESTRAINT */
    var scaling_restraint = d3.scaleOrdinal()
    .domain(charNames)
    .range(self_restraintResults); /* results for self-restraint in corresponding order */
    var tickMarks_restraint = d3.axisTop(scaling_restraint);
    /* 17A) DRAW TICKS */
    d3.select("#self-restraint")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 16) + ")")
      .call(tickMarks_restraint);
    /* 17B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#self-restraint .tick")
      .classed("self-restraint", true);
    /* 17C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#self-restraint line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick self-restraint")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < self_restraintResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(self_restraintResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 17D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#self-restraint text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick self-restraint")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < self_restraintResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(self_restraintResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });

    /* 18) THOUGHT */
    var scaling_thought = d3.scaleOrdinal()
    .domain(charNames)
    .range(thoughtResults); /* results for thought in corresponding order */
    var tickMarks_thought = d3.axisTop(scaling_thought);
    /* 18A) DRAW TICKS */
    d3.select("#thought")
      .append("g")
      .attr("class", "tickMarks")
      .attr("transform", "translate(0," + (dy * 17) + ")")
      .call(tickMarks_thought);
    /* 18B) RENAME CLASS FOR TICKS TO BE UNIQUE */
    d3.selectAll("#thought .tick")
      .classed("thought", true);
    /* 18C) IF TICKS OVERLAP, THEN ADJUST THE TICK'S LINE HEIGHT */
    d3.selectAll("#thought line")
      .attr("y2", function(d, i) { /* i is the index for a list-like object that contains every selected line element */
       var lineHeight = "-6"; /* default line height */
       var overlappingTicks = 0; /* initialize overlapping tick count */
       var ticks = document.getElementsByClassName("tick thought")[i]; /* get the current line element */
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10); /* get said element's transform: "translate(x,y)" x-value */
           for (var j = i + 1; j < thoughtResults.length; j++) { /* iterate through array of medians */
                if (i === 0) { /* skip process when i index is 0 to prevent incorrect visualization */
                  break;
                }
                var horizontal_distance = currentTick - parseInt(thoughtResults[j], 10); /* get the horizontal distance between ticks */
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if ticks overlap */
                    overlappingTicks++; /* increment overlapping tick count */
                    lineHeight = (overlappingTicks * 2 + 1) * -6; /* increase the current tick's line height */
              }
           }
           return lineHeight; /* return either the default line height or the increased line height */
      });
    /* 18D) ADJUST THE TICK'S TEXT HEIGHT */
    d3.selectAll("#thought text")
      .attr("y", function(d, i) {
       var textHeight = "-9"; /* default text height */
       var overlappingTicks = 0;
       var ticks = document.getElementsByClassName("tick thought")[i];
       var currentTick = parseInt(ticks.getAttribute("transform").slice(10, -3), 10);
           for (var j = i + 1; j < thoughtResults.length; j++) {
                var horizontal_distance = currentTick - parseInt(thoughtResults[j], 10);
                if (horizontal_distance <= 20 && horizontal_distance >= 0) { /* if there's an overlapping tick */
                    overlappingTicks++;
                    textHeight = ((overlappingTicks * 2 + 1) * -6) - 3; /* increase text height */
                }
           }
           return textHeight;
     });
  })
}
