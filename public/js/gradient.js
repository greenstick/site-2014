var Gradient = function (args) {
	var grdnt 				= this;
		grdnt.namespace 	= args.namespace	|| 		'.gradient',
		grdnt.element 		= args.element		|| 		'.gradient-value',
		grdnt.array 		= [];	
};

Gradient.prototype.generate 	= function () {
	var grdnt = this;
		length = document.querySelectorAll(grdnt.namespace + ' ' + grdnt.element).length;
		// Generate Hex Values For Each Gradient Value
		for (var i = 0; i < length; i++) {
			var hex = '#' + Math.floor(((i + 1) / parseFloat(length)) * 16777215).toString(16);
			grdnt.array.push(hex);
		};
		// Append Hex Values For Each Gradient Value
		for (var i = 0; i < grdnt.array.length; i++) {
			var element = document.querySelectorAll(grdnt.namespace + ' ' + grdnt.element)[i];
			element.style.color = grdnt.array[i];
		};
};

// var gradient = new Gradient ({
// 	namespace	: '.filter-items',
// 	element 	: '.button'
// });

// gradient.generate();