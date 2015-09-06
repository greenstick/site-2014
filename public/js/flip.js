/*
Basic Flipcard Prototype
*/

var Flipcard = function (config) {
	return this.__init__(config);
};

/*
Methods
*/

Flipcard.prototype = {
	__init__	: function (config) {
		var card = this;
			card.element 		= typeof config.element 		=== 'string' ? config.element 		: ".flip-container .card",
			card.active 		= typeof config.active  		=== 'string' ? config.active 		: "active",
			card.trigger 		= typeof config.trigger 		=== 'string' ? config.trigger 		: ".flip-container",
			card.eventTrigger 	= typeof config.eventTrigger 	=== 'string' ? config.eventTrigger 	: "click";
		return this;
	}.
	toggle 		: function () {
		var card = this;
		$(card.element).toggleClass(card.active);
		return this;
	}
};