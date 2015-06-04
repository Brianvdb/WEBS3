/**
 * Created by Gebruiker on 23-5-2015.
 */
$(function(){
	for(var j = 2; j <= 5; j++) {
		var offset = (j * 50);
		var width = j * 48;
		$('body').append('<div class="box" data-length="' + j + '" style="background-image: url(assets/images/ship' + j + '.png); left: 100px; top:' + offset + 'px; width:' + width + 'px; height:48px;"></div>');
	}

	$('.box').draggable({ 
		cursorAt: { top: 24, left: 10 },
		stop: function(event, ui) {
			console.log(event);
			if (!event.toElement.hasAttribute("data-index")) {
				$('[data-length=' + event.toElement.getAttribute('data-length') + ']').
					css({
						top: $('[data-length=' + event.toElement.getAttribute('data-length') + ']').attr('data-length') * 50 + 'px',
						left: '100px'
					}).removeAttr('data-index');
			}
		}
	});

	for(var i = 0; i < 100; i++) {
		$('#grid').append('<div data-targetIndex="' + i + '"></div>');
	}

	$('div', '#grid').each(function() {
		var $div = $(this);
		$div.droppable({
			tolerance: "pointer",
			hoverClass: "hovergrid",
			drop: function(event, ui) {
				if (checkCollision(event)) {
					ui.draggable.
						css({
							top: $div.offset().top,
							left: $div.offset().left
						}).attr('data-index', $div.attr('data-targetIndex'));
				} else {
					ui.draggable.
						css({
							top: '0px',
							left: '100px'
						}).removeAttr('data-index');
				}
			}
		});
	});

	$(window).scroll(updatePositions);
	$(window).resize(updatePositions);
});

function updatePositions() {
	$('div[data-index]').each(function() {
		var target = $("[data-targetIndex='" + $(this).attr('data-index') + "']");
		$(this).
			css({
				top: target.offset().top,
				left: target.offset().left
			})
	});
}

function checkCollision(event) {
	var targetSpot  = event.target.getAttribute("data-targetIndex");
	var lastPos     = 10 - event.toElement.getAttribute('data-length');
	var verticalPos = parseInt(targetSpot.substr(targetSpot.length - 1));

	if (verticalPos > lastPos) {
		return false;
	}

	var elements = document.querySelectorAll('.box');


	return true;
}