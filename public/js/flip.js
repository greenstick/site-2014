/*
Basic Flipcard Prototype
*/

	var Flipcard = function (args) {
		this.element 		= args.element 		|| 	".flip-container .card",
		this.active 		= args.active  		||	"active",
		this.trigger 		= args.trigger 		|| 	".flip-container",
		this.eventTrigger 	= args.eventTrigger || 	"click"
	};

/*
Methods
*/

	Flipcard.prototype.toggle 		= function () {
		var card = this;
		$(card.element).toggleClass(card.active);
	};