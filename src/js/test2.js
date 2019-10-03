$(function () {
	var pageTop = $('.totop');
	pageTop.hide();
	$(window).scroll(function () {
		if ($(this).scrollTop() > 600) {
			pageTop.fadeIn();
		} else {
			pageTop.fadeOut();
		}
	});
	pageTop.click(function () {
		$('body, html').animate({ scrollTop: 0 }, 500, 'swing');
		return false;
	});
	$('.slider').slick({
		infinite: true,
		arrows: false,
		autoplay: true,
		dots: true,
		fade: true,
		cssEase: 'linear',
	});
});