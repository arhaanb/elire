$('table#logsList tr').each(function () {
	var raw = $(this).children('td').children('.logTime').text();
	minutes = Math.floor(raw / 60000);
	hours = Math.floor(minutes / 60);
	days = Math.round(hours / 24);
	if (days > 1) {
		raw = days + ' days ago';
	} else if (days == 1) {
		raw = days + ' day ago';
	} else if (hours > 1) {
		raw = hours + ' hrs ago';
	} else if (hours == 1) {
		raw = hours + ' hrs ago';
	} else {
		raw = minutes + ' min ago';
	}
	$(this).children('td').children('.logTime').text(raw);
});



$(document).ready(function () {
	$("#lines").click(function () {
		$(this).hide();
		$('#cross').fadeIn(700);
		$('#nav-hid').fadeIn(700);
	});

	// $("#cross").click(function () {
	//     $(this).hide();
	//     $('#lines').css('display', 'block');
	//     $('#nav-hid').hide();
	// });
});

$(document).on('click', function (event) {
	// ... clicked on the 'body', but not inside of #nav-hid
	$('#cross').hide();
	$('#lines').fadeIn(700);
	$('#nav-hid').fadeOut(500);
});
$('#nav-hid').on('click', function (event) {
	event.stopPropagation();
});
$('#lines').on('click', function (event) {
	event.stopPropagation();
});