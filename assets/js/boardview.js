/**
 * Created by Gebruiker on 23-5-2015.
 */
$(function(){
    $('.box').draggable({ cursorAt: { top: 25, left: 10 } });

    for(var i = 0; i < 100; i++) {
        $('#grid').append('<div data-targetIndex="' + i + '"></div>');
    }

    $('div', '#grid').each(function() {
        var $div = $(this);
        $div.droppable({
            tolerance: "pointer",
            hoverClass: "hovergrid",
            drop: function(event, ui) {

                ui.draggable.
                    css({
                        top: $div.offset().top,
                        left: $div.offset().left
                    }).attr('data-index', $div.attr('data-targetIndex'));
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
        console.log(target);
    });
}