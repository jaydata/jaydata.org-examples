//Master View Component Constructor
function MasterView() {
	
    //load jaydata library, OData provider and the netflix context definition
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
	
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createView({
		backgroundColor:'#ffffff'
	});
	
	var tableData = [];
	
	var ind = Ti.UI.createActivityIndicator({
			id: 'splash',
			color: '#ff0000',
			message: 'loading...'
	});
	ind.show();
    	
    	
    	// This is how we retrieve the movie list from Netflix over OData protocol, using JayData
	// The Netflix context an Title entity is defined in the netflix.js context definition
	// JavaScript Language Query (JSLQ) syntax can be used to define what to retrieve with JayData
	// more details: http://jaydata.org/blog/javascript-language-query-jslq-101
	// The Netflix context definition configures the OData provider and set up the service URL
	// 1. we want to retrieve records from the Titles entityset, which is contains the list of movies
	// 2. orderByDescending - we tell the Netflix server to return the movies in descending order, ordered by the avarage rating field
	// 3. take - we ask only for the TOP 50 records
	
	//JayData code begins here
	Netflix.context.Titles
        .orderByDescending(function (movie) { return movie.AverageRating; })
        .take(50) 
		.toArray(function(result) { 
			//end of JayData query, now we have got the result from server without explicit AJAX calls 
	    		//begin UI code
			result.forEach(function (movie) {
				var section = Ti.UI.createTableViewSection({ 
					headerTitle: movie.Name + '( ' + movie.ReleaseYear + ' )'
				});
				
				var row = Ti.UI.createTableViewRow({
					movieId: movie.Id
				});
								
				row.add(Ti.UI.createImageView({
					image: movie.BoxArt.SmallUrl, 
					width: 65, 
					left: 5,
					top: 5
				}));
				row.add(Ti.UI.createLabel({
					color: '#666666',
					text: movie.ShortSynopsis,
					left: 75,
					top: 5
				}));
				section.add(row);
				tableData.push(section);
			})
			var table = Ti.UI.createTableView({ data: tableData});
			self.add(table);
				
			ind.hide();		
		});
		return self;
};

module.exports = MasterView;