(function() {
const SCALE_RANGE = [1, 5];

d3.scale = function() {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 0,
      ranges = scaleRanges,
      markers = scaleMarkers,
      width = 380,
      height = 30,
      tickFormat = null;

  // For each small multiple…
  function scale(g) {
    g.each(function(d, i) {
      var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
          markerz = markers.call(this, d, i).slice().sort(d3.descending),
          g = d3.select(this);

      // Compute the new x-scale.
      var x1 = d3.scaleLinear()
          .domain([1, Math.max(rangez[0])])
          .range(reverse ? [width, 0] : [0, width]);

      // Retrieve the old x-scale, if this is an update.
      var x0 = this.__chart__ || d3.scaleLinear()
          .domain([1, Math.max(rangez[0])])
          .range(x1.range());

      // Stash the new scale.
      this.__chart__ = x1;

      // Derive width-scales from the x-scales.
      var w0 = scaleWidth(x0),
          w1 = scaleWidth(x1);

      // Update the range rects.
      var range = g.selectAll("rect.range")
          .data(rangez);

      range.enter().append("rect")
          .attr("class", function(d, i) { return "range s" + i; })
          .attr("width", w0)
          .attr("height", height)
          .attr("x", reverse ? x0 : 0)
        .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : 0);

      range.transition()
          .duration(duration)
          .attr("x", reverse ? x1 : 0)
          .attr("width", w1)
          .attr("height", height);

      // Update the marker lines.
      var marker = g.selectAll("line.marker")
          .data(markerz);

      marker.enter().append("line")
          .attr("class", "marker")
          .attr("x1", x0)
          .attr("x2", x0)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6)
        .transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1);

      marker.transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6);

      // Compute the tick format.
      var format = tickFormat || x1.tickFormat(8);

      // Update the tick groups.
      var tick = g.selectAll("g.tick")
          .data(x1.ticks(10), function(d) {
            return this.textContent || format(d);
          });

      // Initialize the ticks with the old scale, x0.
      var tickEnter = tick.enter().append("g")
          .attr("class", "tick")
          .attr("transform", scaleTranslate(x0))
          .style("opacity", 1e-6);

      tickEnter.append("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickEnter.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr("y", height * 7 / 6)
          .text(format);

      // Transition the entering ticks to the new scale, x1.
      tickEnter.transition()
          .duration(duration)
          .attr("transform", scaleTranslate(x1))
          .style("opacity", 1);

      // Transition the updating ticks to the new scale, x1.
      var tickUpdate = tick.transition()
          .duration(duration)
          .attr("transform", scaleTranslate(x1))
          .style("opacity", 1);

      tickUpdate.select("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickUpdate.select("text")
          .attr("y", height * 7 / 6);

      // Transition the exiting ticks to the new scale, x1.
      tick.exit().transition()
          .duration(duration)
          .attr("transform", scaleTranslate(x1))
          .style("opacity", 1e-6)
          .remove();
    });
    d3.timerFlush();
  }

  // left, right, top, bottom
  scale.orient = function(x) {
    if (!arguments.length) return orient;
    orient = x;
    reverse = orient == "right" || orient == "bottom";
    return scale;
  };

  // marks the scores on a scale of 1 to 5
  scale.markers = function(x) {
    if (!arguments.length) return markers;
    markers = x;
    return scale;
  };

  scale.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return scale;
  };

  scale.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return scale;
  };

  scale.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return scale;
  };

  scale.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return scale;
  };

  return scale;
};

function scaleRanges(d) {
  return SCALE_RANGE;
}

// returns an array of "scores" key values from JSON file
function scaleMarkers(d) {
  var scoresArray = [];
  // console.log(d.data.length);
  for (var i = 0; i < d.data.length; i++) {
    // console.log(d.data[i].scores);
      scoresArray.push(d.data[i].scores);
    }
  console.log(scoresArray);
  return scoresArray;
}

function scaleTranslate(x) {
  return function(d) {
    return "translate(" + x(d) + ",0)";
  };
}

function scaleWidth(x) {
  var x0 = x(0);
  return function(d) {
    return Math.abs(x(d) - x0);
  };
}

})();
