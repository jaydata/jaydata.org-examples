function ApplicationWindow() {


	var MasterView = require('ui/common/MasterView'),
		DetailView = require('ui/common/DetailView');
		
	var self = Ti.UI.createTabGroup();
		
	//Master tab
	var masterView = new MasterView();
	var masterContainerWindow = Ti.UI.createWindow({
		title:'Movies'
	});
	
	
	masterContainerWindow.add(masterView);
	
	var masterTab = Ti.UI.createTab({
		title: 'Movies list',
		window: masterContainerWindow
	});
	
	
	//Detail tab
	var detailView = new DetailView();
	var detailContainerWindow = Ti.UI.createWindow({
		title:'Movie Details'
	});
	detailContainerWindow.add(detailView);
	
	var detailTab = Ti.UI.createTab({
		title: 'Movie details',
		window: detailContainerWindow
	});
	
	//Append tabs to tabgroup
	self.addTab(masterTab);
	self.addTab(detailTab);
		
	
	masterView.addEventListener('click', function(e) {
		detailView.fireEvent('showMovieDetail', {
			movieId: e.row.movieId
		});
		self.setActiveTab(1);
	});
		
	
	
	self.open();
	return self;
};

module.exports = ApplicationWindow;
