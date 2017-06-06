var Model = require("./Base"),
    model = new Model();
var ContentModel = model.extend({
 	insert: function(data, callback) {
		this.collection().insert(data, {}, callback || function(){ });
	},
	update: function(data, callback) {
		this.collection().update({ID: data.ID}, data, {}, callback || function(){ });	
	},
	getlist: function(callback, query) {
		this.collection().find(query || {},callback);
	},
	remove: function(ID, callback) {
		this.collection().findAndModify({ID: ID}, [], {}, {remove: true}, callback);
	}
});
module.exports = ContentModel;