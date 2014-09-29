
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
	bookmarks = getChildNodes(bookmarks, bookmark_nodes);

	return bookmarks;
}

function dumpDirectoriesToArray(bookmark_nodes) {

	var directories = [];
	directories = getDirectoryNodes(directories, bookmark_nodes);

	return directories;
}

function getDirectoryNodes(master, array) {

	for( var i=0; i<array.length; i++) {
		if(array[i].children && array[i].children.length > 0) {
			master.push(array[i]);
			getDirectoryNodes(master, array[i].children);
		}
		else
		{
		}
	}

	return master;
}

function getChildNodes(master, array) {

	for( var i=0; i<array.length; i++) {
		if(array[i].children && array[i].children.length > 0) {
			getChildNodes(master, array[i].children);
		}
		else
		{
			master.push(array[i]);
		}
	}

	return master;
}

function process_bookmark(bookmarks) {

	var bookmark = bookmarks[0];
	var bookmark_bar = bookmark.children[0];

	// Start button disabled
	$('#cleanup').attr('disabled', 'disabled');

	var bookmarks = dumpNodesToArray(bookmark_bar.children);
	var directories = dumpDirectoriesToArray(bookmark_bar.children);

	// Sorts by Date by reference
	orderByDate(bookmarks);
	
	console.log("FINAL BOOKMARKS ARRAY");
	console.log(bookmarks);

	console.log("FINAL DIRECTORIES ARRAY");
	console.log(directories);

	// List of directories
	for(var i=0; i<directories.length; i++) {
		var tr = $('<tr class="directory_id warning">');

		// Done td
		tr.append('<td class="id">' + directories[i].id + '</td>');

		// Image td
		var img_td = $('<td>');
		var img = $('<img>');
		img.attr('src', "folder.png");
		img_td.append(img);
		tr.append(img_td);

		// Date added
		var dt = new Date(directories[i].dateAdded);
		var month = dt.getMonth()+1;
		tr.append('<td>' + month + '/' + dt.getDate() + '/' + dt.getFullYear() + '</td>');
		
		// Url td
		var td = $('<td>');
		var txt = $('<p>');
    		txt.text(directories[i].title + " - contains : " + directories[i].children.length);
		td.append(txt);
		tr.append(td);

		// Add tr to table
		$('.list').append(tr);
	}

	// List of bookmarks
	for(var i=0; i<bookmarks.length; i++) {

		var tr = $('<tr class="bookmark_id">');

		// Done td
		tr.append('<td class="id">' + bookmarks[i].id + '</td>');

		// Image td
		var img_td = $('<td>');
		var img = $('<img>');
		img.attr('src', "bookmark.png");
		img_td.append(img);
		tr.append(img_td);

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

	// Get Total
	$('.total_value').text(bookmarks.length);

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

		// Get Total
		var old_value = $('.total_value').text();
		var new_value = old_value - all.length;
		$('.total_value').text(new_value);

		// Remove old deleted to keep numbers clean if additional deleting takes place
		all.remove();
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
