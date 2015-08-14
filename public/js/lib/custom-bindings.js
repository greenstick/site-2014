/*
Custom Knockout Bindings
*/

ko.bindingHandlers.hiddenValue = {
	init: function (element, valueAccessor) {
		$(element).bind("change", function (event, data, formatted) { //hidden vars don't usually have change events, so we trigger $myElement.trigger("change");
			var value = valueAccessor();
			value($(this).val()); //rather than $(this).val(), might be best to pass our custom info in data
			console.log(value);
		});
	},
	update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
		var value = valueAccessor();
		console.log("binding meow")
		$(element).val(value);
	}
};