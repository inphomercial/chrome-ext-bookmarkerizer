
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

function process_bookmark(bookmarks) {

	var bookmark = bookmarks[0];
	var actual_bookmarks = bookmark.children[0];

	console.log(actual_bookmarks);

	// Start button disabled
	$('#cleanup').attr('disabled', 'disabled');

	// Sorts by Date by reference
	orderByDate(actual_bookmarks.children);

	// Used to store directory arrays
	// var directories = [];
	for(var i=0; i<actual_bookmarks.children.length; i++) {

		// if(actual_bookmarks.children.children().length > 0) {
		// 	console.log("directory");
		// }

		var tr = $('<tr class="bookmark_id">');

		// Done td
		tr.append('<td class="id">' + actual_bookmarks.children[i].id + '</td>');

		// Date added
		var dt = new Date(actual_bookmarks.children[i].dateAdded);
		var month = dt.getMonth()+1;
		tr.append('<td>' + month + '/' + dt.getDate() + '/' + dt.getFullYear() + '</td>');

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
