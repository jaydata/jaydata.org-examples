function ApplicationWindow() {
	

	// Include JayData and the OData context definition
    require('jaydata');
    require('jaydataproviders/oDataProvider');
	require('netflix');
	
	//set default values for JayData OData provider
	window.XMLHttpRequest = function(){
    	var xhr = Ti.Network.createHTTPClient();
    	xhr.getAllResponseHeaders = function(){
			return '';
		};
		xhr.timeout = 20000;
		return xhr;
	};
	
 	//  -------- Begin Your Application ---------
	
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
	masterContainerWindow.containingTab = masterTab;
	
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
	detailContainerWindow.containingTab = detailTab;
	
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
