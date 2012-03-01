/**
 * Ape model and collection
*/
App.modules.Apes = function(app) {
    var Ape = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false,
              the_type: "ape",
              hidden: false,
              show_next: true
            };
        },
        toggle: function() {
          this.set({selected: !this.get("selected")});
        },
        idAttribute: 'id'
    });

    var AllApes = Backbone.Collection.extend({
        model: Ape,
        url: 'json/apes.json',
        selected: function() {
            return this.filter(function(ape){ return ape.get('selected'); });
        },
        toUrl: function() {
          var selected_ids = this.selected().map(function(ape){ return ape.get('id').toString();});
          return _.size(selected_ids) > 0 ? selected_ids.join(",") : "0";
        },
        fromUrl: function(apes_ids) {
        },
        filterByCategory: function(category_id){
          return this.filter(function(ape){ return ape.get('category_id') == category_id;})
        },
        filterByRegion: function(region_id){
          return this.filter(function(ape){return ape.get('region_id') == region_id;})
        },
        filterByCountry: function(country_id){
          return this.filter(function(ape){return _.include(ape.get("country_id").split(','), country_id);})
        },
        visible: function() {
          return this.filter(function(ape) { return ape.get('hidden') == false; })
        }
    });

    app.Apes = Class.extend({
        init: function() {
            // Initialise the apes collections
            this.allApes = new AllApes();
        }
    });
};

