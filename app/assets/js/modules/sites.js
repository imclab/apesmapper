/**
 * Site model and collection
*/
App.modules.Sites = function(app) {
  var Site = Backbone.Model.extend({
    defaults: function() {
      return {
        selected:  false
      };
    },
    toggle: function() {
      this.set({
        selected: !this.get("selected")
        });
    }
  });

  var AllSites = Backbone.Collection.extend({
    model: Site,
    initialize: function() {
      this.size = {};
      this.response = {};
      this.biodiversity = {};
      this.uncertainity = {};
    },
    url: function() {
      params = {};
      if(typeof this.size !== "undefined" && this.size !== null) {
        params.size_min = this.size.min;
        params.size_max = this.size.max;
      }
      if(typeof this.response !== "undefined" && this.response !== null) {
        params.response_min = this.response.min;
        params.response_max = this.response.max;
      }
      if(typeof this.biodiversity !== "undefined" && this.biodiversity !== null) {
        params.biodiversity_min = this.biodiversity.min;
        params.biodiversity_max = this.biodiversity.max;
      }

      return "json/sites_stats.json?" + jQuery.param(params);
    },
    filterBySize: function(min, max) {
      if(this.size.min === min && this.size.max === max) {
        return false;
      }

      this.size = {min: min, max: max};
      this.fetch({add: false});
      return true;
    },
    resetSize: function() {
      this.size = {};
    },
    filterByResponse: function(min, max) {
      if(this.response.min === min && this.response.max === max) {
        return false;
      }

      this.response = {min: min, max: max};
      this.fetch({add: false});
      return true;
    },
    resetResponse: function() {
      this.response = {};
    },
    filterByBiodiversity: function(min, max) {
      if(this.biodiversity.min === min && this.biodiversity.max === max) {
        return false;
      }

      this.biodiversity = {min: min, max: max};
      this.fetch({add: false});
      return true;
    },
    resetBiodiversity: function() {
      this.biodiversity = {};
    },
    filterByUncertainity: function(min, max) {
      if(this.uncertainity.min === min && this.uncertainity.max === max) {
        return false;
      }

      this.uncertainity = {min: min, max: max};
      this.fetch({add: false});
      return true;
    },
    resetUncertainity: function() {
      this.uncertainity = {};
    }
  });

  app.Sites = Class.extend({
    init: function() {
      // Initialise the sites collections
      this.allSites = new AllSites();
      this.allSites.fetch();
    }
  });
}