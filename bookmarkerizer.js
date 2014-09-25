
function orderByDate(bookmarks) {

	bookmarks.sort(function(x, y) {
		date1 = new Date(x.dateAdded);
		date2 = new Date(y.dateAdded);

		return date1 - date2 ;
	})

	return bookmarks;
}

function process_bookmark(bookmarks) {

	var bookmark = bookmarks[0];
	var actual_bookmarks = bookmark.children[0];

	// Sorts by Date by reference
	orderByDate(actual_bookmarks.children);

	for(var i=0; i<actual_bookmarks.children.length; i++) {

		var tr = $('<tr class="bookmark_id">');

		// Done td
		tr.append('<td>' + actual_bookmarks.children[i].id + '</td>');

		// Date added
		var dt = new Date(actual_bookmarks.children[i].dateAdded);
		tr.append('<td>' + dt.getMonth() + '/' + dt.getDay() + '/' + dt.getFullYear() + '</td>');

		// Url td
		var td = $('<td>');
		var anchor = $('<a>');
    		anchor.attr('href', actual_bookmarks.children[i].url);
		anchor.attr('target', "_blank");
    		anchor.text(actual_bookmarks.children[i].title);
		td.append(anchor);
		tr.append(td);

		// Add tr to table
		$('.list').append(tr);
	}

	$('.bookmark_id').on("click", function(e) {
		// If not already selected for deletion, add class
		if( $(this).not('danger') ) {
			$(this).addClass('danger');
		}
	});

	$('#cleanup').on('click', function() {
		var all = $('.danger');
		console.log(all);
		all.hide('slow');
	});
}

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({'url': chrome.extension.getURL('background.html')}, function(tab) {
	});
});

document.addEventListener('DOMContentLoaded', function () {
	console.log("Starting Extension");
	chrome.bookmarks.getTree( process_bookmark );
      	// dumpBookmarks();
});
