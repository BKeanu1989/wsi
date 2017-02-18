$(document).ready(function(){
	// Der Button wird mit JavaScript erzeugt und vor dem Ende des body eingebunden.
	var back_to_top_button = ['<a href="#top" class="back-to-top"><i class="fa fa-arrow-up" aria-hidden="true"></i></a>'].join("");
	$("body").append(back_to_top_button);

	// Der Button wird ausgeblendet
	$(".back-to-top").hide();

	// Funktion für das Scroll-Verhalten
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) { 
				$('.back-to-top').fadeIn();
			} else {
				$('.back-to-top').fadeOut();
			}
		});

		$('.back-to-top').click(function () { 
			$('body,html').animate({
				scrollTop: 0,
				// backgroundColor: transparent
			}, 800);
			return false;
		});
	});

	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				$('nav').addClass('greyish');
			}  else {
				$('nav').removeClass('greyish');
			}
		});
	});

});