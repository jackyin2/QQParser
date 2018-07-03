$(function () {
    $('.video-button').on('click', function () {
        var _this = $(this),
		    parents = _this.parents('.video-list'),
		    prev = parents.prev(),
		    elem = prev.parent(),
		    nextSibling = $(elem).siblings(),
		    elemWidth = elem.width(),
		    nextSiblingWidth = nextSibling.width();

        var css = { height: '0%', prevHeight: '100%', width: nextSiblingWidth, nextWidth: elemWidth, left: 'auto', right: '0', nextLeft: '0', nextRight: 'auto' };

        nextSibling.children('.video-playBox').css({ 'height': '100%' });
        nextSibling.children('.video-list').css({ 'height': '0%' });
        parents.animate({ height: css.height });
        prev.animate({ height: css.prevHeight }, function () {

            nextSibling.animate({ 'left': nextSiblingWidth, 'width': css.nextWidth }, function () {
                $(this).css({ 'left': css.left, 'right': css.right }).removeClass('right').addClass('right');
            });

            elem.animate({ 'right': elemWidth, 'width': css.width }, function () {
                $(this).css({ 'left': css.nextLeft, 'right': css.nextRight }).removeClass('right');
                nextSibling.children('.video-playBox').animate({ 'height': '50%' });
                nextSibling.children('.video-list').animate({ 'height': '50%' });
            });
        });
    });

    var drag = {
        x: 0,
        dragStart: function (elem, event) {
            var _this = this;
            $elem = $(elem);

            this.x = event.clientX;
            $(document).on('mousemove', function (event) {
                _this.dragMove($elem, event);
            });
        },
        dragStop: function () {
            $(document).off('mousemove');
        },
        dragMove: function (elem, event) {
            var $elem = $(elem),
                $parentElem = $elem.parents('.video-inner'),
                $prevElem = $parentElem.siblings(),
                minX = $('#video-box').width() * 0.3 + 40,
                maxX = $('#video-box').width() * 0.7 + 40,
                width = $parentElem.width(),
                prevWidth = $prevElem.width(),
                x = event.clientX;

            if (x > maxX) x = maxX;
            if (x < minX) x = minX;

            var offset = this.x - x;
            width = (offset >= 0) ? width + Math.abs(offset) : width - Math.abs(offset);
            prevWidth = (offset >= 0) ? prevWidth - Math.abs(offset) : prevWidth + Math.abs(offset);

            $parentElem.css('width', width);
            $prevElem.css('width', prevWidth);

            this.x = x;
        }
    };

    $('.resizable-icon').on('mousedown', function (event) {
        drag.dragStart(this, event);
    });

    $(document).on('mouseup', drag.dragStop);

    $(window).on('resize', function () {
        var elem = $('#video-box .right'),
		    siblWidth = elem.siblings(),
		    winWidth = $('#video-box').width();

        siblWidth.width(winWidth * 0.7);
        elem.width(winWidth - siblWidth.width());
    });
});