
function orderByDate(bookmarks) {

	bookmarks.sort(function(x, y) {
		date1 = new Date(x.dateAdded);
		date2 = new Date(y.dateAdded);

		return date1 - date2;
	});

	return bookmarks;
}

function removeBookmark(id) {
	chrome.bookmarks.remove(id, function () {
		console.log("removed bookmark");
	});
}

function dumpNodesToArray(bookmark_nodes) {

	var bookmarks = [];
	var directories = [];

	console.log("BOOKMARK NODES");
	console.log(bookmark_nodes);

	bookmarks = getChildNodes(bookmarks, bookmark_nodes);

	console.log(bookmarks);

	return bookmarks;
}

function getChildNodes(master, array) {

	for( var i=0; i<array.length; i++) {
		if(array[i].children && array[i].children.length > 0) {
			console.log("found dir");
			getChildNodes(master, array[i].children);
		}
		else
		{
			console.log("found bookmark");
			master.push(array[i]);
		}
	}

	console.log("RETURN MASTER");
	console.log(master);
	return master;
}

function process_bookmark(bookmarks) {

	var bookmark = bookmarks[0];
	var bookmark_bar = bookmark.children[0];

	// Bookmark Bar
	console.log(bookmark_bar);

	// Start button disabled
	$('#cleanup').attr('disabled', 'disabled');


	var bookmarks = dumpNodesToArray(bookmark_bar.children);
	console.log("FINAL OUTPUT ARRAY");
	console.log(bookmarks);

	// Sorts by Date by reference
	orderByDate(bookmarks);

	for(var i=0; i<bookmarks.length; i++) {

		var tr = $('<tr class="bookmark_id">');

		// Done td
		tr.append('<td class="id">' + bookmarks[i].id + '</td>');

		// Date added
		var dt = new Date(bookmarks[i].dateAdded);
		var month = dt.getMonth()+1;
		tr.append('<td>' + month + '/' + dt.getDate() + '/' + dt.getFullYear() + '</td>');

		// Url td
		var td = $('<td>');
		var anchor = $('<a>');
    		anchor.attr('href', bookmarks[i].url);
		anchor.attr('target', "_blank");
    		anchor.text(bookmarks[i].title);
		td.append(anchor);
		tr.append(td);

		// Add tr to table
		$('.list').append(tr);

		$('.id').hide();
	}

	$('.bookmark_id').on("click", function(e) {
		// Toggle danger class (marked for deletion)
		$(this).toggleClass('danger');

		// Check if 'danger' <1 disable button
		if( $('.danger').length < 1) {
			$('#cleanup').attr('disabled', 'disabled');
		}
		else
		{
			$('#cleanup').removeAttr('disabled');
		}

	});

	$('#cleanup').on('click', function() {
		var all = $('.danger');

		var ids_array = [];
		$.each(all, function(i, obj) {
			// Convert DOM to JQUERY object
			var jobj = $(obj);
			var id = jobj.find('.id').text();
			removeBookmark(id);
		});

		// Hide the deleted slowly for dramatic effect!
		all.hide('slow');
		$(this).attr('disabled', 'disabled');
	});
}

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({'url': chrome.extension.getURL('background.html')}, function(tab) {
	});
});

document.addEventListener('DOMContentLoaded', function () {
	console.log("Starting Extension");
	chrome.bookmarks.getTree( process_bookmark );
});
