/*
 ===============================================
 main enter point
 ===============================================
*/

App.modules.Carbon = function(app) {

   // app router
   var Router = Backbone.Router.extend({
      routes: {
        "":        "create_work",  // #work
        "w/:work":        "work",  // #work
        "w/:work/*state": "work"   // #work/state
      },

      create_work: function() {
        // This triggers the route:create_work event,
        // which actually does the scoped work in app.Carbon.create_work
        app.Log.log("route: landing");
      },

      work: function() {
        app.Log.log("route: work");
      }

    });

    // the app
    app.Carbon = Class.extend({

        init: function() {
            _.bindAll(this, 'create_work');
            _.bindAll(this, 'on_route');
            jQuery.ajaxSetup({
                cache: false
            });
        },

        run: function() {
            _.bindAll(this, 'on_route_to', '_state_url');
            var self = this;

            // init Models
            this.bus = new app.Bus();
            app.bus = this.bus; // set a global bus
            this.work = new app.Work(this.bus);
            this.categories = new app.Categories();
            this.apes = new app.Apes();
            this.species = new app.Species();
            this.regions = new app.Regions();
            this.countries = new app.Countries();
            this.sites = new app.Sites();
            this.species_ials = new app.SpeciesIals();
            this.map = new app.Map({bus:this.bus, species_ials: this.species_ials.allSpeciesIals}); // This actually contains the map view...
            this.species_ials_table = new app.SpeciesIalsTable();

            // init Views
            this.selectedFilterView = new App.views.SelectedSpeciesCountries({bus:this.bus, species: this.species.allSpecies, countries: this.countries.allCountries});

            this.categoriesFilterEdit = new App.views.CategoriesFilterEdit({bus:this.bus, categories: this.categories.allCategories});
            this.apesFilterEdit = new App.views.ApesFilterEdit({bus:this.bus, categories: this.categories.allCategories, apes: this.apes.allApes});
            this.speciesFilterEdit = new App.views.SpeciesFilterEdit({bus:this.bus, species: this.species.allSpecies, categories: this.categories.allCategories, apes: this.apes.allApes});

            this.regionsFilterEdit = new App.views.RegionsFilterEdit({bus:this.bus, regions: this.regions.allRegions});
            this.countriesFilterEdit = new App.views.CountriesFilterEdit({bus:this.bus, countries: this.countries.allCountries, regions: this.regions.allRegions});
            this.slideFilters = new App.views.SlideFilters({bus:this.bus, species: this.species.allSpecies, countries: this.countries.allCountries, sites: this.sites.allSites, species_ials: this.species_ials.allSpeciesIals, species_ials_table: this.species_ials_table.allSpeciesIalsTable});
            this.graph = new App.views.Graph({species_ials: this.species_ials.allSpeciesIals});
            this.resultTable = new App.views.ResultTable({sites: this.sites.allSites, species_ials_table: this.species_ials_table.allSpeciesIalsTable});
            this.resultSummary = new App.views.ResultSummary({species_ials: this.species_ials.allSpeciesIals});
            this.header = new app.Header();

            // init routing and bind methods requiring this scope to routes
            this.router = new Router({bus: this.bus});
            this.router.bind('route:create_work', this.create_work);
            this.router.bind('route:work', this.on_route);

            this.bus.on('app:route_to', this.on_route_to);

            this.bus.on('view:show_error', function(error) {
              app.Error.show(error);
            });

            this.state_url = _.debounce(this._state_url, 200);
            this.map.map.bind('center_changed', this.state_url);
            this.map.map.bind('zoom_changed', this.state_url);
            this.bus.on('map:reorder_layers', this.state_url);

            this.bus.on('species:change', this.species_ials.allSpeciesIals.selectSpecies);
            this.bus.on('species:change', this.species_ials_table.allSpeciesIalsTable.selectSpecies);

            this.bus.on('countries:change', this.species_ials.allSpeciesIals.selectCountries);
            this.bus.on('countries:change', this.species_ials_table.allSpeciesIalsTable.selectCountries);

            // ready, launch
            Backbone.history.start();
            //this.router.navigate('w/work_test');
        },

        _state_url: function() {
            var self = this;
            if(self.work_id === undefined) return;
            var center = self.map.map.get_center();
            var zoom = self.map.map.get_zoom();
            var data = [];
            data.push(zoom, center.lat(), center.lng());
            var map_pos = data.join(',');

            var layers = self.map.map.layers;
            var layer_data = [];
            var layer_indexes = _.pluck(app.config.MAP_LAYERS,'name');
            _(self.map.map.layers_order).each(function(name) {
                var layer = layers[name];
                var idx = _.indexOf(layer_indexes, name);
                layer_data.push(idx);
                layer_data.push(layer.enabled?1:0);
            });

            self.router.navigate('w/' + self.work_id + '/' + map_pos + '|' + layer_data.join(','));
        },

        set_state: function(st) {
          var self = this;
          //self.map.map.set_center(new google.maps.LatLng(st.lat,st.lon));
          //self.map.map.set_zoom(st.zoom);
          //_.each(st.layers, function(layer) {
          //  self.map.enable_layer(layer.name, layer.enabled);
          //});
          //self.map.layer_editor.sort_by(st.layers.reverse());
          //self.bus.emit('map:reorder_layers', _.pluck(st.layers, 'name'));
          self.speciespecies.setSelectedFromIds(st.species);
       },

       //State expected format:
       //#categories_ids|apes_ids|species_ids|region_id|countries_ids|ResoSelected,min,max|BioSelected,min,max|UncertSelected,min,max|SizeSelected,min,max
       //categories_ids= comma spearated integers or -1
       //apes_ids= comma spearated integers or -1
       //species_ids= comma separated integers or -1
       //region_id= an integer or -1
       //countries_ids= comma separated integers or -1
       //ResoSelected= 1 is selected, 0 is not selected - slider min-max
       //BioSelected= 1 is selected, 0 is not selected - slider min-max
       //UncertSelected= 1 is selected, 0 is not selected - slider min-max
       //SizeSelected= 1 is selected, 0 is not selected - slider min-max
       //Only one of Reso, Bio, Uncert, or Size can be selected at a time
       decode_state: function(state) {
          var states = state.split('|');
          var categories = states[0];
          var apes = states[1];
          var species = states[2];
          var region = states[3];
          var countries = states[4];
          var resoDetails = states[5];
          var bioDetails = states[6];
          var uncertDetails = states[7];
          var sizeDetails = states[8];

          return {
            categories: categories,
            apes: apes,
            species: species,
            region: region,
            countries: countries,
            resoDetails: resoDetails,
            bioDetails: bioDetails,
            uncertDetails: uncertDetails,
            sizeDetails: sizeDetails
          };
       },

       on_route: function(work_id, state) {
            this.work_id = work_id;
            this.map.work_mode();
            if(jQuery.browser.msie === undefined) {
                clearInterval(this.animation);
            }
            // show the panel and set mode to adding polys

            app.Log.debug("route: work => ", work_id);
            this.bus.emit('work', work_id);
            if(state) {
              this.set_state(this.decode_state(state));
            }
        },

        create_work: function() {
            this.bus.emit('model:create_work');
        },

        on_route_to: function(route) {
            app.Log.debug("route => ", route);
            this.router.navigate(route, true);
        }

    });
};

