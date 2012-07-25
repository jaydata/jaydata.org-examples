/*
* A master detail view, utilizing a native table view component and platform-specific UI and navigation. 
* A starting point for a navigation-based application with hierarchical data, or a stack of windows. 
* Requires Titanium Mobile SDK 1.8.0+.
* 
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*  
*/

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');	  	
}


// This is a single context application with mutliple windows in a stack
(function() {	
	
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	
	var Window;
	
	// iPhone and Mobile Web make use of the platform-specific navigation controller,
	// all other platforms follow a similar UI pattern
	if (osname === 'iphone' || osname === 'ipad') {
		Window = require('ui/handheld/ios/ApplicationWindow');
	}
	else {
		Window = require('ui/handheld/android/ApplicationWindow');
	}
	
	new Window().open();
})();
