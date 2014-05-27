/*
Declare Arguments
*/

	var args 		= {
		parent: 		"#wrapper",
		element: 		"#explorer",
		tile: 			".tile",
		filter: 		".filter",
		loader: 		".loader",
		focus: 			".focus",
		duration: 		1000,
		routes: {
			getTiles: 	"retrieve"
		}
	},

/*
Instantiation & Initialization
*/
	explorer 		= new Explorer(args);
	explorer.init();

/*
Event Bindings
*/

	$(explorer.filter).on("click", function (e) {
		var data 	= e.currentTarget.data.filter;
			explorer.filterTiles(data);
	});