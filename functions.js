/**
 * Portamento Microsite JS Functions
 * 
 * Copyright Kris Noble 2011, but there's not much here worth copying anyway...
 * 
 */

function initSidebar() {
	$('#sidebar').portamento({wrapper: $('#wrapper')});	
}

function initLinkEvents() {
	$('#download_link').click(function(){ 
		_gaq.push(['_trackEvent', 'Portamento', 'Download', 'Download Zip']);
	});
	
	$('#fork_link').click(function(){ 
		_gaq.push(['_trackEvent', 'Portamento', 'Fork', 'Fork on Github']);
	});
}

$(document).ready(function() {		
	// Portamento
	initSidebar();
	
	// Some GA tracking for downloads/forks
	initLinkEvents();
});