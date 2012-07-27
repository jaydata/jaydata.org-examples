//Master View Component Constructor
function MasterView() {
	
    //load jaydata library, OData provider and the netflix context definition
	if (Ti.Platform.osname == 'android'){
	    Ti.include(Ti.Filesystem.resourcesDirectory + 'jaydata.js');
	    Ti.include(Ti.Filesystem.resourcesDirectory + 'jaydataproviders/oDataProvider.js');
		Ti.include(Ti.Filesystem.resourcesDirectory + 'netflix.js');	
		
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
    					
	Netflix.context.Titles
        .orderByDescending(function (movie) { return movie.AverageRating; })
        .take(50)
		.toArray(function(result) {
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