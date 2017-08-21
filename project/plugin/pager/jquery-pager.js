(function ($) {
    var helper = {
        getPageNum: function (totalCount, pagSize) {
            return Math.ceil(totalCount / pagSize);
        },
        getUrlParams: function () {
            if (window.location.href.indexOf('?') == -1) {
                return false;
            }
            var vars = {}, hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
    };
    var methods = {
        init: function (totalCount, options) {
            // 在每个元素上执行方法
            return this.each(function () {
                var $this = $(this);
                $this.empty();
                var href = window.location.href;
                var url = href.indexOf("?") == -1 ? href : href.slice(0, window.location.href.indexOf('?'));
                var params = helper.getUrlParams();
                var settings = $this.data("pager");
                if (typeof settings === "undefined") {
                    var defaults = {
                        callback: function () {
                            alert("请传入分页callback函数");
                        },
                        ajax: true,
                        //2015/04/01
                        getparams: function () {
                            return {};
                        },
                        pagesize: 10,
                        showpage: 6,
                        startIndex: 1,
                        ellipse_text: "…",
                        selectsize: [5, 10,15, 20, 25, 30, 50, 100]
                    };
                    settings = $.extend({}, defaults, options);
                    $this.data("pager", settings);
                } else {
                    settings = $.extend({}, settings, options);
                    $this.data("pager", settings);
                }
                var currentIndex = settings.startIndex < 1 ? 1 : settings.startIndex;
                //正式开始逻辑代码
                if (!settings.ajax) {
                    var defaultIndexStr = params[settings.pageParam];
                    var defaultIndex = 1;
                    if (defaultIndexStr && !isNaN(defaultIndexStr)) {
                        defaultIndex = parseInt(defaultIndexStr) < 1 ? 1 : parseInt(defaultIndexStr);
                    }
                    currentIndex = defaultIndex;
                }
                var getRegion = function () {
                    var half = Math.ceil(settings.showpage / 2);
                    var num = helper.getPageNum(totalCount, settings.pagesize);
                    var limit = num - settings.showpage;
                    var start = currentIndex > half ? Math.max(Math.min(currentIndex - half, limit), 0) : 0;
                    var end = currentIndex > half ? Math.min(currentIndex + half, num) : Math.min(settings.showpage, num);
                    return [start + 1, end];
                }
                var createPage = function () {
                    var pageNum = helper.getPageNum(totalCount, settings.pagesize);

                    var indexChange = function (index) {
                        if (settings.ajax) {
                            return function (event) { return pageSelected(index, event); }
                        }
                        return true;
                    }
                    var interval = getRegion();
                    var paint = function (index, opts) {
                        index = index < 1 ? 1 : (index < pageNum ? index : pageNum);
                        //合并
                        opts = $.extend({ text: index, classes: "" }, opts || {});
                        var link = null;
                        if (index == currentIndex) {
                            link = $("<span class='current'>" + (opts.text) + "</span>");
                        }
                        else {
                            if (settings.ajax) {
                                link = $("<a>" + (opts.text) + "</a>")
                                    .bind("click", indexChange(index))
                                    .attr('href', "javascript:void(0)");
                            } else {
                                if (params && params.hasOwnProperty(settings.pageParam)) {
                                    params[settings.pageParam] = index;
                                }

                                link = $("<a>" + (opts.text) + "</a>")
                                   .bind("click", indexChange(index))
                                   .attr('href', url + "?" + (params ? $.param(params) : (settings.pageParam + "=" + (index))));
                            }
                        }
                        if (opts.classes) { link.addClass(opts.classes); }
                        $this.append(link);
                    }
                    paint(1, { text: "首页" });
                    paint(currentIndex - 1, { text: "上一页", classes: "prev" });
                    interval[0] = interval[0] == 0 ? 1 : interval[0];
                    for (var i = interval[0]; i <= interval[1]; i++) {
                        paint(i);
                    }
                    paint(currentIndex + 1, { text: "下一页", classes: "next" });
                    paint(pageNum, { text: "尾页" });
                }

                var builderJump = function () {
                    $this.append("<span>跳转到<input class='jump' type='text' style='width:40px'>页</span>");
                    $this.find(".jump").keyup(function (e) {
                        var jumpText = $(this);
                        var pageIndexStr = jumpText.val().trim();
                        var pageIndexInt = parseInt(pageIndexStr);
                        if (pageIndexStr) {
                            if (isNaN(pageIndexStr)) {
                                jumpText.val(1);
                                return;
                            }
                            var pageNum = helper.getPageNum(totalCount, settings.pagesize);
                            if (pageNum < pageIndexInt) {
                                jumpText.val(pageNum);
                            }
                            if (pageIndexInt <= 0) {
                                jumpText.val(pageNum);
                            }
                        }

                        if (e.keyCode == 13) {
                            $this.empty();
                            currentIndex = pageIndexInt;
                            if (settings.ajax) {
                                pageSelected(currentIndex, event);
                            } else {
                                window.location.href = (url + "?" + (settings.pageParam + "=" + (currentIndex)));

                            }
                            
                          
                        }

                    });
                }
                var builderCount = function (defaultSize) {
                    var pageNum = helper.getPageNum(totalCount, settings.pagesize);
                    var html = [];
                    if (settings.ajax) {
                        var sizeArray = settings.selectsize;
                        html.push("<select class='selectSize'>");
                        for (var i = 0; i < sizeArray.length; i++) {
                            var item = sizeArray[i];
                            if (defaultSize == item) {
                                html.push('<option selected value="' + item + '">' + item + '</option>');
                            } else {
                                html.push('<option  value="' + item + '">' + item + '</option>');
                            }
                        }
                        html.push("</select>");
                    }
                   
                    var countInfoArr = [];
                    countInfoArr.push("<span style='float:left'>");
                    countInfoArr.push("共<label style='color:orange;padding:0 3px;font-size:16px'>" + totalCount + "</label>条数据  ");
                    if (settings.ajax) {
                        countInfoArr.push("每页显示" + html.join("") + "  ");
                    }
                    countInfoArr.push("共<label style='color:orange;padding:0 3px;font-size:16px'>" + pageNum + "</label>页");
                    countInfoArr.push("</span>");
                    $this.append(countInfoArr.join(""));
                    $this.find(".selectSize").change(function (event) {
                        var $that = $(this);
                        currentIndex = 1;
                        options.pagesize = parseInt($that.val());
                        settings.pagesize = parseInt($that.val());
                        pageSelected(currentIndex, event);
                       
                    });
                }
                var callbackParams = {};
                if (settings.getparams && settings.getparams()) {
                    callbackParams = settings.getparams();
                }
                var pageSelected = function (index, event) {
                    $this.empty();
                    currentIndex = index;
                    //  builderSelectSize(settings.pagesize);
                    builderCount(settings.pagesize);
                    createPage(index);
                    builderJump();
                    //2015/04/01
                    settings.callback(index, callbackParams);

                    //分页完要滚动到顶部
                    $(window).scrollTop(0);
                }

                builderCount(settings.pagesize);
                createPage();
                builderJump();

                //   builderSelectSize(settings.pagesize);

                settings.callback(currentIndex, callbackParams);
                if (totalCount == 0) {
                    $this.hide();
                } else {
                    $this.show();
                }
            });
        },
        destroy: function (options) {
            // 在每个元素中执行代码
            return $(this).each(function () {
                var $this = $(this);
                // 执行代码
                // 删除元素对应的数据
                $this.removeData("pager");
            });
        }
    };
    $.fn.Pager = function () {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method === "object" || !method) {
            method = methods.init;
        } else {
            $.error("Method" + method + "does not exist on jQuery.pager");
            return this;
        }

        return method.apply(this, arguments);
    };
})(jQuery);
