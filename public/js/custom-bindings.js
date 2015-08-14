/*
Custom Knockout Bindings
*/

ko.bindingHandlers.hiddenValue = {
	init: function (element, valueAccessor) {
		$(element).bind("change", function (event, data, formatted) { //hidden vars don't usually have change events, so we trigger $myElement.trigger("change");
			var value = valueAccessor();
			value(data); //rather than $(this).val(), might be best to pass our custom info in data
		});
	},
	update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
		var value = valueAccessor();
		$(element).val(value);
		console.log(value);
	}
};