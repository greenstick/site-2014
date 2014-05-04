var mongoose = require('mongoose');

//Site Index
exports.index = function (req, res) {
		res.render('', {
		title: 'Welcome'
	});
};
//Portfolio Index
exports.portfolio = function (req, res) {
	res.render('portfolio', {
		title: 'Portfolio'
	});
};
//Interactives 
exports.interactives = function (req, res) {
	res.render('interactives', {
		title: 'Interactives'
	});
};
//Websites
exports.websites = function (req, res) {
	res.render('websites', {
		title: 'Websites'
	});
};
//Music
exports.music = function (req, res) {
	res.render('music', {
		title: 'Music'
	});
};
//Sound Design
exports.sounddesign = function (req, res) {
	res.render('sounddesign', {
		title: 'Sound Design'
	});
};
//Photography
exports.photography = function (req, res) {
	res.render('photography', {
		title: 'Photography'
	});s
};
//Graphic Desing
exports.technologies = function (req, res) {
	res.render('technologies', {
		title: 'Technologies'
	});
};