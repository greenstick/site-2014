/**
 *	Image Editor Class
 **/

var ImageEditor = function (args) {
	var editor 					= this;
		editor.ui 				= $(args.ui),
		editor.filter 			= $(args.filter),
		editor.image 			= $(args.image),
		editor.tar 				= args.image,
		editor.file 			= $(args.file),
		editor.viewport 		= $(args.viewport),
		editor.container 		= $(args.container),
		editor.slider 			= $(args.slider),
		editor.width 			= args.width,
		editor.height 		 	= args.height,
		editor.selectedFilter 	= [],
		editor.imageDimensions 	= {};
};

/**
 *	Image Editor Methods
 **/

//Initialize
ImageEditor.prototype.init = function () {
	var editor = this;
		editor.image = $(editor.tar);
	this.renderImage({element: this, filter: ""});
	editor.ui.fadeIn(600);
	editor.image.focus();
};

//Render Image
ImageEditor.prototype.renderImage = function (filter, resize) {
	var editor = this, input = editor.file[0]; 
		editor.image = $(editor.tar);

	//Set Filter & Resize to Default Values if Undefined
	filter = filter || "";
	resize = resize || 1;

	//Dimensions to Resize To
	var rWidth 	= editor.imageDimensions.width * resize,
		rHeight = editor.imageDimensions.height * resize;

	//Render to User Generated Specs
	if (typeof reader === 'object' && filter !== "" && resize !== 1) {
		Caman(editor.tar, function () {
			this.revert();
			this.resize({
				width:  rWidth,
				height: rHeight
			});
			if (filter !== "noFilter") {
				this[filter]();
			};
			this.render();
		});
		reader.readAsDataURL(input.files[0]);
	} else if (typeof reader === 'object' && filter === "" && resize !== 1) {
		Caman(editor.tar, function () {
			this.revert();
			this.resize({
				width:  rWidth,
				height: rHeight
			});
			this.render();
		});
		reader.readAsDataURL(input.files[0]);
	} else if (typeof reader === 'object' && filter !== "") {
		Caman(editor.tar, function () {
			this.revert();
			if (filter !== "noFilter") {
				this[filter]();
			};
			this.render();
		})
		reader.readAsDataURL(input.files[0]);
	} else {
		if (input.files && input.files[0]) {
			reader = new FileReader();
			reader.onload = function (e) {
				editor.image.attr('src', e.target.result);
				Caman(editor.tar, function () {
					this.render();
					editor.imageDimensions.width = this.imageWidth();
					editor.imageDimensions.height = this.imageHeight();
					$('.resizeSlider').slider("option", "min", imgEditor.setMinResize(editor.imageDimensions.width, editor.imageDimensions.height, '.resizeSlider'));
				});
			};
			reader.readAsDataURL(input.files[0]);
		};
	};
};

ImageEditor.prototype.setMinResize = function (width, height, slider) {
	var editor = this, resize = null;
		editor.image = $(editor.tar);
		editor.w = width, 
		editor.h = height;
		if (editor.w <= editor.width || editor.h <= editor.width) {
			$(slider).hide();
		} else {
			//Adding 5% so image is never smaller than viewport
			editor.w > editor.h ? resize = (editor.width/editor.h) * 105 : resize = (editor.width/editor.w) * 105;
		}
		return resize;
};

//Select Filter
ImageEditor.prototype.selectFilter = function (element) {
	var editor = this, e = $(element);
	editor.filter.removeClass('selected');
	e.addClass('selected');
	editor.selectedFilter.splice(0, 1);
	editor.renderImage(e.data('filter'));
	editor.selectedFilter.push(e.data('filter'));
};

//Resize Image
ImageEditor.prototype.resizeImage = function (filter, resize) {
	var editor = this, percent = resize/100;
	editor.renderImage(filter, percent);
};

//Drag to Crop
ImageEditor.prototype.dragImage = function () {
	var editor = this, img;
		editor.image = $(editor.tar);

	if (editor.image.width() > editor.width || editor.image.height > editor.width) {
		img 	= 	editor.image.draggable({containment: editor.container}),
		h 		= 	img.height(),
		w 		= 	img.width(), 
		outer	= 	editor.viewport,
		oH 		= 	outer.height(),
		oW		= 	outer.width(),
		iH		= 	h + (h - oH),
		iW		= 	w + (w - oW),
		iT 		= 	'-' + ((iH - oH)/2) + 'px',
		iL 		= 	'-' + ((iW - oW)/2) + 'px';

		if (editor.image.width() > editor.width && editor.image.height > editor.height) {
			editor.container.css({
				width 	: iW, 
				height 	: iH, 
				top 	: iT, 
				left 	: iL
			});
			editor.image.css({
				top 	: editor.image.height() - editor.height, 
				left 	: editor.image.width() - editor.width
			});
		} else if (editor.image.width() > editor.width && editor.image.height() < editor.height) {
			editor.container.css({
				width 	: iW, 
				height 	: editor.height, 
				top 	: iT, 
				left 	: iL
			});
			editor.image.css({
				top 	: editor.image.height() - editor.height, 
				left 	: editor.image.width() - editor.width
			});
		} else {
			editor.container.css({
				width 	: editor.width, 
				height 	: iH, 
				top 	: iT, 
				left 	: iL
			});
			editor.image.css({
				top 	: editor.image.height() - editor.height, 
				left 	: editor.image.width() - editor.width
			});
		};
	} else {
		editor.container.css({
			width 	: editor.width, 
			height 	: editor.height, 
			top 	: 0, 
			left 	: 0
		});
	};
};
//Submit Edit
ImageEditor.prototype.submitImage = function () {
	var editor = this, x = 0, y = 0;
		editor.image = $(editor.tar);
	if (editor.image.width() > editor.width && editor.image.height() > editor.height) {
		x 	= 	editor.image.width() - editor.image.position().left - editor.width;
		y 	= 	editor.image.height() - editor.image.position().top - editor.height;
	} else if (editor.image.width() > editor.width && editor.image.height() < editor.height) {
		x 	= 	editor.image.width() - editor.image.position().left - editor.width;
		y	=	editor.image.height()/2 - editor.height/2;
	} else if (editor.image.height() > editor.height) {
		y 	= 	editor.image.height() - editor.image.position().top - editor.height;
		x 	= 	editor.image.width()/2 - editor.width/2;
	} else {
		x 	= 	editor.image.width()/2 - editor.width;
		y 	= 	editor.image.height()/2 - editor.height;
	};
	//Cropping Image, Encoding to Base64, & Saving to Local Storage
	Caman(editor.tar, function () {
		this.crop(editor.width, editor.height, x, y);
		this.render(function () {
			image = this.toBase64();
			localStorage.setItem("image-edited", image);
		});
	});
	editor.ui.fadeOut(400);
};

/**
 *	Instantiation
 **/

//New Image Editor
var imgEditor = new ImageEditor({
	ui 			: '#imageEditor', 
	filter 		: '.filter', 
	image 		: '#uploadedImage', 
	file 		: '#uploadImage', 
	viewport 	: '.mainImage', 
	container 	: '.containment', 
	slider 		: '.resizeSlider',
	width 		: 600,
	height 		: 600
});

//Init Resize Slider
$('.resizeSlider').slider({
	min: 1,
	max: 100,
	value: 100,
	range: false,
	orientation: "vertical",
	slide: function (event, ui) {
		$('.resizeSlider').val(ui.value);
	}
});

/**
 *	Event Bindings
 **/

$('#uploadImage').change(function () {
	imgEditor.init();
});

$('.filter').on("touchend click", function () {
	imgEditor.selectFilter(this);
});

$('.resizeSlider').on("touchend mouseup", function () {
	imgEditor.resizeImage(imgEditor.selectedFilter[0], $(this).val());
});

$('.doneEditing').on("touchend click", function (event) {
	imgEditor.submitImage();
});

$('.mainImage').on("touchend click", function () {
	imgEditor.dragImage();
});