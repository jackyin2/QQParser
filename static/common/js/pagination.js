/**
* simplePagination.js v1.6
* A simple jQuery pagination plugin.
* http://flaviusmatis.github.com/simplePagination.js/
*
* Copyright 2012, Flavius Matis
* Released under the MIT license.
* http://flaviusmatis.github.com/license.html
*/

(function ($) {
    var methods = {

        init: function (options) {
            var o = $.extend({
                items: 1,
                itemsOnPage: 1,
                pages: 0,
                displayedPages: 5,
                edges: 2,
                currentPage: 0,
                hrefTextPrefix: '?page-',
                hrefTextSuffix: '',
                pageType: 'hash',
                prevText: 'Prev',
                nextText: 'Next',
                ellipseText: '&hellip;',
                cssStyle: 'light-theme',
                listStyle: '',
                labelMap: [],
                selectOnClick: true,
                nextAtFront: false,
                invertPageOrder: false,
                useStartEdge: true,
                useEndEdge: true,
                onPageClick: function (pageNumber, event) {

                },
                onInit: function () {
                }
            }, options || {});

            var self = this;

            o.pages = o.pages ? o.pages : Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1;
            if (o.currentPage)
                o.currentPage = o.currentPage - 1;
            else
                o.currentPage = !o.invertPageOrder ? 0 : o.pages - 1;
            o.halfDisplayed = o.displayedPages / 2;

            this.each(function () {
                self.addClass(o.cssStyle + ' simple-pagination').data('pagination', o);

                //if (o.pages == 1) {
                //    methods._drawtotal.call(self);
                //} else {
                methods._draw.call(self);
                // }
            });
            o.onInit();
            return this;
        },

        selectPage: function (page) {
            methods._selectPage.call(this, page - 1);
            return this;
        },

        prevPage: function () {
            var o = this.data('pagination');
            if (!o.invertPageOrder) {
                if (o.currentPage > 0) {
                    methods._selectPage.call(this, o.currentPage - 1);
                }
            } else {
                if (o.currentPage < o.pages - 1) {
                    methods._selectPage.call(this, o.currentPage + 1);
                }
            }
            return this;
        },

        nextPage: function () {
            var o = this.data('pagination');
            if (!o.invertPageOrder) {
                if (o.currentPage < o.pages - 1) {
                    methods._selectPage.call(this, o.currentPage + 1);
                }
            } else {
                if (o.currentPage > 0) {
                    methods._selectPage.call(this, o.currentPage - 1);
                }
            }
            return this;
        },

        getPagesCount: function () {
            return this.data('pagination').pages;
        },

        setPagesCount: function (count) {
            this.data('pagination').pages = count;
        },

        getCurrentPage: function () {
            return this.data('pagination').currentPage + 1;
        },

        destroy: function () {
            this.empty();
            return this;
        },

        drawPage: function (page) {
            var o = this.data('pagination');
            o.currentPage = page - 1;
            this.data('pagination', o);
            methods._draw.call(this);
            return this;
        },

        redraw: function () {
            methods._draw.call(this);
            return this;
        },

        disable: function () {
            var o = this.data('pagination');
            o.disabled = true;
            this.data('pagination', o);
            methods._draw.call(this);
            return this;
        },

        enable: function () {
            var o = this.data('pagination');
            o.disabled = false;
            this.data('pagination', o);
            methods._draw.call(this);
            return this;
        },

        updateItems: function (newItems) {
            var o = this.data('pagination');
            o.items = newItems;
            o.pages = methods._getPages(o);
            this.data('pagination', o);
            methods._draw.call(this);
        },

        updateItemsOnPage: function (itemsOnPage) {
            var o = this.data('pagination');
            o.itemsOnPage = itemsOnPage;
            o.pages = methods._getPages(o);
            this.data('pagination', o);
            methods._selectPage.call(this, 0);
            return this;
        },

        _appendSelectPage: function (o) {

            var pageSizeArr = [10, 20, 50, 100];
            var pageString = '每页<select name="pageSize">'
            //var pageString = '<div style="float: left;width: 215px;text-align: left;margin-left:2em;">共 ' + o.items + ' 条 每页显示<select name="pageSize" style="display: inline-block;width: 60px;" class="ui-widget-content">'
            for (var i = 0; i < pageSizeArr.length; i++) {
                if (pageSizeArr[i] == o.itemsOnPage) {
                    pageString += (' <option value="' + pageSizeArr[i] + '"  selected="selected">' + pageSizeArr[i] + '</option>')
                } else {
                    pageString += (' <option value="' + pageSizeArr[i] + '">' + pageSizeArr[i] + '</option>')
                }

            }
            pageString += '</select>条记录 | &nbsp;';
            return pageString;
        },

        _appendSpan: function (o) {

            var pageString = '<span>第' + (o.currentPage + 1) + '页 共' + o.pages + '页/' + o.items + '条记录</span>';
            return pageString;

        },

        _appendCurrentPage: function (o) {

            var pageString = '第<input  name="currentPage" type="text" placeholder="' + (o.currentPage + 1) + '"> 页';
            pageString += '<a class="go" href="#">GO</a>';

            return pageString;
        },

        _drawtotal: function () {

            var o = this.data('pagination');
            var pageString = methods._appendSpan(o);

            // var pageString = methods._appendSelectPage(o);
            // pageString += ('</select>条</div>');
            var $panel = $(pageString).appendTo(this);
            methods._selectChange.call(this, o);
        },

        _selectChange: function (o) {

            $("select", this).on("change", function (e) {

                var form = $(this).parents("form:first");
                $("[name=page]", form).val("1");
                if (o.pageType == "hash") {
                    location.hash = "#" + decodeURIComponent(form.serialize(), true);
                }
                else if (o.pageType == "search") {
                    location.search = "?" + decodeURIComponent(form.serialize(), true);
                }
                else if (o.pageType == "ajax") {

                    var data = ("?" + decodeURIComponent(form.serialize(), true)).QueryStringToJSON(),
                        url = form.attr("action");
                    _.ajax(url, data, function (r) {
                        _.ajaxPagination(r, "nodia");
                    }, "json");
                }
                return false;
            });
        },
        _goChange: function (o) {
            var self = this, o = self.data('pagination');
            $(".go", this).click(function (event) {

                var pageIndex = $('input[name=currentPage]').val();

                if (pageIndex <= 0) {
                    pageIndex = 1;
                }
                if (pageIndex > o.pages) {
                    pageIndex = o.pages;
                }

                if (o.pageType == "hash") {
                    _.hash.page = pageIndex;
                    var query = _.obj2query(_.hash);
                    $(this).attr("href", "#" + query);
                    // $link = $('<a href="#' + query + '" class="page-link">' + (options.text) + '<span class="' + options.classes + '"></span></a>');

                    return methods._selectPage.call(self, pageIndex, event);

                } else if (o.pageType == "ajax") {

                    var form = $(this).parents("form:first");
                    //$("[name=page]", form).val("1");
                    var data = ("?" + decodeURIComponent(form.serialize(), true)).QueryStringToJSON(),
                        url = form.attr("action");
                    data.page = data.currentPage;
                    _.ajax(url, data, function (r) {
                        _.ajaxPagination(r, "nodia");
                    }, "json");
                    //if (data.page != "") {
                    //    _.ajax(url, data, function (r) {
                    //        _.ajaxPagination(r, "nodia");
                    //    }, "json");
                    //}
                    //else
                    //    return false;

                }
                else if (o.pageType == "search") {
                    _.url.page = pageIndex;
                    var query = _.obj2query(_.url);
                    $(this).attr("href", "?" + query);
                    return methods._selectPage.call(self, pageIndex, event);
                }

                return false;
            });
        },

        _draw: function () {

            var o = this.data('pagination'),
                interval = methods._getInterval(o),
                i,
                tagName;

            methods.destroy.call(this);

            tagName = (typeof this.prop === 'function') ? this.prop('tagName') : this.attr('tagName');
            //var pageString = methods._appendSelectPage(o);
            //pageString += ('</select>条</div><input type="hidden" name="page"/><ul' + (o.listStyle ? ' class="' + o.listStyle + '"' : '') + '></ul>');
            var pageString = methods._appendSpan(o);
            pageString += '<input type="hidden" name="page"/><ul class="page clearfix"><li> ' + methods._appendSelectPage(o) + '</li><li>' + methods._appendCurrentPage(o) + '</li></ul>';

            var $panel = tagName === 'UL' ? this : $(pageString).appendTo(this);
            methods._selectChange.call(this, o);

            methods._goChange.call(this, o);

            if (o.currentPage != 0) {
                methods._appendNewItem.call(this, 0, { text: o.firstText, classes: 'left' });
                methods._appendNewItem.call(this, (o.currentPage - 1), { text: o.prevText, classes: 'up' });
            }

            if (o.currentPage != o.pages - 1) {

                methods._appendNewItem.call(this, (o.currentPage + 1), { text: o.nextText, classes: 'next' });
                methods._appendNewItem.call(this, o.pages, { text: o.lastText, classes: 'right' });
            }
            // Generate Prev link
            //if (o.prevText) {
            //    methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage - 1 : o.currentPage + 1, { text: o.nextText, classes: 'prev' });
            //}

            // Generate Next link (if option set for at front)
            //if (o.nextText && o.nextAtFront) {
            //    methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage + 1 : o.currentPage - 1, { text: o.nextText, classes: 'next' });
            //}
            // Generate start edges
            //if (!o.invertPageOrder) {
            //    if (interval.start > 0 && o.edges > 0) {
            //        if (o.useStartEdge) {
            //            var end = Math.min(o.edges, interval.start);
            //            for (i = 0; i < end; i++) {
            //                methods._appendItem.call(this, i);
            //            }
            //        }
            //        if (o.edges < interval.start && (interval.start - o.edges != 1)) {
            //            $($panel[$panel.length - 1]).append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
            //        } else if (interval.start - o.edges == 1) {
            //            methods._appendItem.call(this, o.edges);
            //        }
            //    }
            //} else {
            //    if (interval.end < o.pages && o.edges > 0) {
            //        if (o.useStartEdge) {
            //            var begin = Math.max(o.pages - o.edges, interval.end);
            //            for (i = o.pages - 1; i >= begin; i--) {
            //                methods._appendItem.call(this, i);
            //            }
            //        }

            //        if (o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)) {
            //            $($panel[$panel.length - 1]).append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
            //        } else if (o.pages - o.edges - interval.end == 1) {
            //            methods._appendItem.call(this, interval.end);
            //        }
            //    }
            //}

            // Generate interval links
            //if (!o.invertPageOrder) {
            //    for (i = interval.start; i < interval.end; i++) {
            //        methods._appendItem.call(this, i);
            //    }
            //} else {
            //    for (i = interval.end - 1; i >= interval.start; i--) {
            //        methods._appendItem.call(this, i);
            //    }
            //}

            // Generate end edges
            //if (!o.invertPageOrder) {
            //    if (interval.end < o.pages && o.edges > 0) {
            //        if (o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)) {
            //            $($panel[$panel.length - 1]).append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
            //        } else if (o.pages - o.edges - interval.end == 1) {
            //            methods._appendItem.call(this, interval.end);
            //        }
            //        if (o.useEndEdge) {
            //            var begin = Math.max(o.pages - o.edges, interval.end);
            //            for (i = begin; i < o.pages; i++) {
            //                methods._appendItem.call(this, i);
            //            }
            //        }
            //    }
            //} else {
            //    if (interval.start > 0 && o.edges > 0) {
            //        if (o.edges < interval.start && (interval.start - o.edges != 1)) {
            //            $($panel[$panel.length - 1]).append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
            //        } else if (interval.start - o.edges == 1) {
            //            methods._appendItem.call(this, o.edges);
            //        }

            //        if (o.useEndEdge) {
            //            var end = Math.min(o.edges, interval.start);
            //            for (i = end - 1; i >= 0; i--) {
            //                methods._appendItem.call(this, i);
            //            }
            //        }
            //    }
            //}

            // Generate Next link (unless option is set for at front)
            //if (o.nextText && !o.nextAtFront) {
            //    methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage + 1 : o.currentPage - 1, { text: o.nextText, classes: 'next' });
            //}
        },

        _getPages: function (o) {
            var pages = Math.ceil(o.items / o.itemsOnPage);
            return pages || 1;
        },

        _getInterval: function (o) {
            return {
                start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) : 0),
                end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
            };
        },

        _appendNewItem: function (pageIndex, opts) {

            var self = this, options, $link, o = self.data('pagination'), $linkWrapper = $('<li></li>'), $ul = self.find('ul');
            pageIndex = pageIndex <= 0 ? 0 : (pageIndex < o.pages ? pageIndex : o.pages - 1);

            options = {
                text: pageIndex + 1,
                classes: ''
            };

            options = $.extend(options, opts || {});

            if (o.pageType == "hash") {

                _.hash.page = pageIndex + 1;
                var query = _.obj2query(_.hash);
                $link = $('<a href="#' + query + '" class="page-link">' + (options.text) + '<span class="' + options.classes + '"></span></a>');

                $link.click(function (event) {
                    return methods._selectPage.call(self, pageIndex + 1, event);
                });

            } else if (o.pageType == "search") {
                _.url.page = pageIndex + 1;
                var query = _.obj2query(_.url);
                $link = $('<a href="?' + query + '" class="page-link">' + (options.text) + '<span class="' + options.classes + '"></span></a>');
                $link.click(function (event) {
                    return methods._selectPage.call(self, pageIndex + 1, event);
                });
            } else if (o.pageType == "ajax") {

                $link = $('<a href="#" data-page="' + (pageIndex + 1) + '" class="page-link">' + (options.text) + '<span class="' + options.classes + '"></span></a>');
                $link.click(function (event) {
                    var form = $(this).parents("form:first");
                    $("[name=page]", form).val($(this).data("page"));
                    var data = ("?" + decodeURIComponent(form.serialize(), true)).QueryStringToJSON(),
                     url = form.attr("action");
                    _.ajax(url, data, function (r) {
                        /*调用common.js中的方法_.ajaxPagination*/
                        _.ajaxPagination(r);
                    }, "json");
                    return false;
                });
            }

            $linkWrapper.append($link);

            if ($ul.length) {
                $ul.append($linkWrapper);
            } else {
                self.append($linkWrapper);
            }


        },

        _appendItem: function (pageIndex, opts) {

            var self = this, options, $link, o = self.data('pagination'), $linkWrapper = $('<li></li>'), $ul = self.find('ul');

            pageIndex = pageIndex < 0 ? 0 : (pageIndex < o.pages ? pageIndex : o.pages - 1);

            options = {
                text: pageIndex + 1,
                classes: ''
            };

            if (o.labelMap.length && o.labelMap[pageIndex]) {
                options.text = o.labelMap[pageIndex];
            }

            options = $.extend(options, opts || {});

            if (pageIndex == o.currentPage || o.disabled) {
                if (o.disabled) {
                    $linkWrapper.addClass('disabled');
                } else {
                    $linkWrapper.addClass('active');
                }
                $link = $('<span class="current">' + (options.text) + '</span>');
            } else {
                if (o.pageType == "hash") {
                    _.hash.page = pageIndex;
                    var query = _.obj2query(_.hash);
                    $link = $('<a href="#' + query + '" class="page-link">' + (options.text) + '</a>');
                    $link.click(function (event) {
                        return methods._selectPage.call(self, pageIndex, event);
                    });
                } else if (o.pageType == "search") {
                    _.url.page = pageIndex;
                    var query = _.obj2query(_.url);
                    $link = $('<a href="?' + query + '" class="page-link">' + (options.text) + '</a>');
                    $link.click(function (event) {
                        return methods._selectPage.call(self, pageIndex, event);
                    });
                } else if (o.pageType == "ajax") {

                    $link = $('<a href="#" data-page="' + (pageIndex + 1) + '" class="page-link">' + (options.text) + '</a>');
                    $link.click(function (event) {
                        var form = $(this).parents("form:first");
                        $("[name=page]", form).val($(this).data("page"));
                        var data = ("?" + decodeURIComponent(form.serialize(), true)).QueryStringToJSON(),
                         url = form.attr("action");
                        _.ajax(url, data, function (r) {
                            /*调用common.js中的方法_.ajaxPagination*/
                            _.ajaxPagination(r);
                        }, "json");
                        return false;
                    });
                }
            }

            if (options.classes) {
                $link.addClass(options.classes);
            }

            $linkWrapper.append($link);

            if ($ul.length) {
                $ul.append($linkWrapper);
            } else {
                self.append($linkWrapper);
            }
        },


        _selectPage: function (pageIndex, event) {
            var o = this.data('pagination');
            o.currentPage = pageIndex;
            if (o.selectOnClick) {
                methods._draw.call(this);
            }
            return o.onPageClick(pageIndex + 1, event);
        }

    };

    $.fn.pagination = function (method) {
        if (methods[method] && method.charAt(0) != '_') {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.pagination');
        }
    };

})(jQuery);
