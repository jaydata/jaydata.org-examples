function DetailView() {
	
	
	if (Ti.Platform.osname == 'android'){
<<<<<<< HEAD
	    Ti.include(Ti.Filesystem.resourcesDirectory + 'jaydata.js');
	    Ti.include(Ti.Filesystem.resourcesDirectory + 'jaydataproviders/oDataProvider.js');
=======
		Ti.include(Ti.Filesystem.resourcesDirectory + 'JayData-standalone.js');
		//load the Netflix context definition
>>>>>>> 466738fee9d5e273d67936d7d1a362c53e8bc297
		Ti.include(Ti.Filesystem.resourcesDirectory + 'netflix.js');	
		
		//inject the Titanium HTTPClient class to JayData in order to use it for requests (instead of XMLHttpRequest)
		window.XMLHttpRequest = Ti.Network.HTTPClient;
	}
	
	
	var self = Ti.UI.createView({
		backgroundColor:'#fff'
	});
	
	var dummyData = [];
	var dummyTitleRow = Ti.UI.createTableViewRow();
	
	dummyTitleRow.add(Ti.UI.createLabel({
		text: 'Please select a movie',
		left: 5,
		top: 5,
		color: '#0000000',
		font: { fontSize: 24 }
		
	}))
	
	dummyData.push(dummyTitleRow);
	
	var dummyView = Ti.UI.createTableView({data: dummyData, top: 5});
	self.add(dummyView);
	
	self.addEventListener('showMovieDetail', function(e) {
		buildMovieDetailView(e.movieId);
	});
	
	function buildMovieDetailView(movieId){
		
		var ind = Ti.UI.createActivityIndicator({
			id: 'splash',
			color: '#ff0000',
			message: 'loading...'
		});
		ind.show();
	
	//This is how we retrieve the selected movie from Netflix over OData protocol, using JayData
	//The Netflix context an Title entity is defined in the netflix.js context definition
	//JavaScript Language Query (JSLQ) syntax can be used to define what to retrieve with JayData
	//more details: http://jaydata.org/blog/javascript-language-query-jslq-101
	Netflix.context.Titles
	    .filter(function(it){ return it.Id == this.id; }, { id: movieId })
	    .include('Cast')
	    .toArray(function(movies){ 
	    	//end of JayData query, now we have got the result from server without explicit AJAX calls 
	    	//begin UI code
    		var movie = movies[0];
    		
    		var tableData = [];
			var titleRow = Ti.UI.createTableViewRow();
			
			titleRow.add(Ti.UI.createLabel({
						text: movie.Name,
						left: 5,
						top: 5,
						color: '#000000',
						font: { fontSize: 24}
					}));
	
			tableData.push(titleRow);
	
			var imageRow = Ti.UI.createTableViewRow();
			imageRow.add(
						Ti.UI.createImageView({
							image: movie.BoxArt.SmallUrl, 
							width: 65, 
							left: 5,
			}));
			imageRow.add(Ti.UI.createLabel({
						text: movie.ShortSynopsis,
						left: 75,
						top: 5,
						color: '#555555',
						font: { fontSize: 14}
			}));
			
			tableData.push(imageRow);
			
			var castRow = Ti.UI.createTableViewRow();
			castRow.add(Ti.UI.createLabel({
					text: 'Cast',
						left: 5,
						top: 5,
						color: '#000',
						font: { fontSize: 16}
			}));
			var castArray = [];
			movie.Cast.forEach( function(person) { castArray.push(person.Name )});
			
			castRow.add(Ti.UI.createLabel({
					text: castArray.join(),
					left: 50,
					top: 5,
					color: '#555555',
					font: { fontSize: 14}
			}))
			
			tableData.push(castRow);
			
			if (self.children.length == 0){
				var tableView = Ti.UI.createTableView({data: tableData, top: 5});
				self.add(tableView);
			}
			else{
				self.children[0].setData(tableData);
			}
				
	    	ind.hide();
	   });	
	}
	
	return self;
};

module.exports = DetailView;
