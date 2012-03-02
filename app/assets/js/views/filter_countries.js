/*
 * Countries edit view
 */
App.views.CountriesFilterEdit = Backbone.View.extend({

    el: jQuery('#countries_filter_edit'),

    events: {
        'click #finish-countries-edit': 'updateCountries'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'updateCountries', 'filterByRegion');
        this.bus = this.options.bus;
        this.regions = this.options.regions;
        this.countries = this.options.countries;

        this.countries.bind('reset', this.render);
        this.countries.bind('reset', this.updateCountries);
        this.bus.on('show_countries_selector', this.show);
        this.bus.on('update_list_of_countries', this.filterByRegion);
    },

    render: function() {
        // get the object to load the countries views into
        var $countries = this.$('div#countries_selector');
        $countries.empty();
        // Create a countries view inside $countries for each countries
        this.countries.visible().each(function(countries) {
            var view = new App.views.CountriesSelector({
                model: countries
            });
            $countries.append(view.render().el);
        });
        return this;
    },

    show: function() {
        this.el.slideDown();
    },

    updateCountries: function() {
        // Get the selected countries from the view, close the panel and 
        // fire the 'countries:change' event with the user selection
        var countries = [];

        _.each($(this.el).find("#countries_selector input:checked"), function(country) {
          countries.push($(country).val());
        });

        if(countries.length === 0) {
          _.each($(this.el).find("#countries_selector input"), function(country) {
            countries.push($(country).val());
          });
        }

        this.bus.emit('countries:change', countries);

        $('#countries_filter_edit span.selected').html('<a href="#"><span class="count">' + countries.length + '</span> selected</a>');
    },

    filterByRegion: function() {
      var selected_regions = _.map(this.regions.selected(), function(region){return region.get('id')});
      this.countries.each(function(country) {
        if(_.include(selected_regions, country.get('region_id'))){
            country.set({hidden: false});
        } else{
            country.set({hidden: true});
            country.set({selected: false});
          }
      });
      this.render();
    }
});

/*
 * Countries selection view
 */
App.views.CountriesSelector = Backbone.View.extend({
    template: JST['_countries_selector'],
    className: 'row',
    initialize: function() {
        _.bindAll(this, 'render', 'toggleSelected');
    },
    events: {
      'click input': 'toggleSelected'
    },
    render: function( event ){
        // render the template
        var renderedContent = this.template(this.model.toJSON());
        jQuery(this.el).html(renderedContent);
        return this;
    },
    toggleSelected: function() {
      this.model.toggle();
    }
});

