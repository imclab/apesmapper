/*
 * Render the species_ials as a graph
 */
App.views.Graph = Backbone.View.extend({
  el: 'div#graph',

  initialize: function() {
    _.bindAll(this, 'render', 'addOne', 'color', 'createGraph');

    this.species_ials = this.options.species_ials;
    this.species_ials.bind("all", this.render);

    // We need to know the max area to scale the graph sizes correctly
    $.getJSON('http://carbon-tool.cartodb.com/api/v1/sql?q=SELECT MAX(area_km2) AS max_area_km2 FROM species_ials', this.createGraph);
  },
  createGraph: function(data) {
    // Create the graph
    this.bubbleSize = 60;
    this.max_area_km2 = data.rows[0].max_area_km2;
    this.bubbleChart = new Chart.Bubble('graph', {
      width: 651,
      height: 538,
      lineColor: '#3f3f3f',
      zmin: 0, zmax: 100,
      bubbleSize: this.bubbleSize
    });
    this.render();
  },
  addAll: function() {
    this.species_ials.each(this.addOne);
  },

  addOne: function(species_ial) {
    var color = "#000000", tooltip = '';

    if(this.species_ials.filter_selected === "response") {
      color = "#" + this.color(species_ial, 'response_score') + "0000";
      tooltip = 'Response: ' + species_ial.get('response_score');
    } else if(this.species_ials.filter_selected === "biodiversity") {
      color = "#00" + this.color(species_ial, 'biodiversity_score') + "00";
      tooltip = 'Biodiversity: ' + species_ial.get('biodiversity_score');
    }

    this.bubbleChart.addBubble(species_ial.get('habitat_score')*100, species_ial.get('pressure_score')*100, species_ial.get('area_km2')/this.max_area_km2*this.bubbleSize, color, tooltip);
  },

  render: function() {
    if(typeof(this.bubbleChart) !== 'undefined') {
      this.bubbleChart.empty();
      this.addAll();
      this.bubbleChart.redraw();
    }

    return this;
  },
  
  color: function(species_ial, property) {
    var color = Math.round(species_ial.get(property) * 255).toString(16);
    while(color.length < 2) {
      color = '0' + color;
    }
    return color;
  }
});
