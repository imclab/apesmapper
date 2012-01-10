/*
 * Code for species and country editing views
 */

App.views.FilterEdit = Backbone.View.extend({

    el: $('#filter_edit'),

    events: {
        'click #save_filter': 'update_filter'
    },

    initialize: function() {
        this.bus = this.options.bus;
        this.apes = this.options.apes;
        // create the species selector view
        this.speciesSelector = new App.views.SpeciesSelector({collection: this.apes});
    },

    update_filter: function(e) {
        var self = this;
        if(e) e.preventDefault();
        if(!this.creating) {
          self.bus.emit('model:create_work');
          this.$('.button_info').html("creating...");
        }
        this.creating = true;
    },

    show: function() {
        this.el.show();
    },

    hide: function() {
        this.el.hide();
    }


});

/*
 * Species selection view
 */
App.views.SpeciesSelector = Backbone.View.extend({
    el: $('#species_selector'),

    initialize: function() {
      this.collection.bind('reset', this.render, this);
    },
    render: function( event ){
      var compiled_template = _.template( $("#species-selector-tmpl").html() );
      this.el.html( compiled_template({apes:this.collection.toJSON()}));
      return this;
    },
});
