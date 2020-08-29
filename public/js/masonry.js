
function resizeMasonryItem(item) {
	var grid = document.getElementsByClassName('masonry')[0];
	if (grid) {
		var rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
			rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')),
			gridImagesAsContent = item.querySelector('img.masonry-content');


		var rowSpan = Math.ceil((item.querySelector('.masonry-content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));

		item.style.gridRowEnd = 'span ' + rowSpan;
		if (gridImagesAsContent) {
			item.querySelector('img.masonry-content').style.height = item.getBoundingClientRect().height + "px";
		}
	}
}


function resizeAllMasonryItems() {
	var allItems = document.querySelectorAll('.masonry-item');

	if (allItems) {
		for (var i = 0; i > allItems.length; i++) {
			resizeMasonryItem(allItems[i]);
		}
	}
}


function waitForImages() {
	//var grid = document.getElementById("masonry");
	var allItems = document.querySelectorAll('.masonry-item');
	if (allItems) {
		for (var i = 0; i < allItems.length; i++) {
			imagesLoaded(allItems[i], function (instance) {
				var item = instance.elements[0];
				resizeMasonryItem(item);
				console.log("Waiting for Images");
			});
		}
	}
}

var masonryEvents = ['load', 'resize'];
masonryEvents.forEach(function (event) {
	window.addEventListener(event, resizeAllMasonryItems);
});

waitForImages();