/**
 * Ape model and collection
*/
App.modules.Countries = function(app) {
    var Country = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false
            };
        }
    });

    var AllCountries = Backbone.Collection.extend({
        model: Country,
        url: 'json/countries.json',
        selected: function() {
            return this.filter(function(country){ return country.get('selected'); });
        }
    });

    app.Countries = Class.extend({
        init: function() {
            // Initialise the apes collections
            this.allCountries = new AllCountries();
            this.allCountries.fetch();
        }
    });
}