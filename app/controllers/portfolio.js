var mongoose 			= require('mongoose');

// Site Index
exports.index 			= function (req, res) {
	res.render('', {
		title: 'Welcome'
	});
};
// Explore
exports.explore 		= function (req, res) {
	res.render('explore', {
		title: 'Explore'
	});
};
// Admin
exports.admin 			= function (req, res) {
	res.render('admin', {
		title: 'Admin Panel'
	});
};