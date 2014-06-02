(function (window) {
    var utils = {
        $: function (id) {
            return typeof id == "object" && id.nodeType && id.nodeType == 4 ? id : document.getElementById(id);
        },
        //获取对象类型
        getType: function (obj) {
            if (!obj && obj != 0) {
                return undefined;
            }
            var baseType = /^(undefined|string|number|boolean|function)$/;
            return (!baseType.test(typeof (obj)) ?
                (obj.constructor ?
                    /function\s([^()]+)/.exec(obj.constructor + "")[1] :
                    Object.prototype.toString.call(obj).slice(8, -1))
                : typeof (obj)).toLowerCase();
        },
        //循环
        each: function (data, func) {
            var func = func || function () { };
            var i = 0, key, length = data.length;

            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    var b;
                    if (func.length == 2) {
                        b = func.apply(data[i], [i, data[i]]);
                    } else {
                        b = func.call(data[i], data[i]);
                    }
                    if (b != undefined) {
                        if (b == false) {
                            break;
                        }
                        if (b == true) {
                            continue;
                        }
                    }
                }
            } else {
                for (var key in data) {
                    var b;
                    if (func.length == 2) {
                        b = func.apply(date[key][key, data[key]]);
                    } else {
                        b = func.call(data[key], data[key]);
                    }
                    if (b != undefined) {
                        if (b == false) {
                            break;
                        }
                        if (b == true) {
                            continue;
                        }
                    }
                }

            }
        },
        hasClass: function (selector, elem) {
            var className = " " + selector + " ";

            if (elem.nodeType === 1 && (" " + elem.className + " ").replace(/[\r\n\t]/g, " ").indexOf(className) > -1) {
                return true;
            }

            return false;
        },

        getElementsByClassName: function (className, elem, tag) {
            var elem = elem || document;
            var tag = tag || "*";
            var selectors = elem.getElementsByTagName(tag);

            var elems = [];

            for (var i = 0, s; (s = selectors[i]) != null; i++) {
                if (utils.hasClass(className, s)) {
                    elems.push(s);
                }
            }

            return elems;

        },
        getOffset: function (elem) {
            var elem = elem && elem.nodeType ? elem : this.$(elem);
            var offset = {
                left: elem.offsetLeft,
                top: elem.offsetTop
            }
            var parent = elem.offsetParent;
            while (parent != null) {
                offset.left += parent.offsetLeft;
                offset.top += parent.offsetTop;
                parent = parent.offsetParent;
            }


            return offset;
        },

        //扩展
        extend: function () {
            if (arguments.length == 0) {
                return this;
            }
            var isSelf = arguments.length == 1;
            var extendObj = isSelf ? this : arguments[0];
            for (var i = (isSelf ? 0 : 1), data; (data = arguments[i]) != null; i++) {
                for (var key in data) {
                    //已存在的属性，不替换
                    if (!extendObj[key]) {
                        extendObj[key] = data[key];
                    }
                }
            }
            return extendObj;

        },
        ready: function (fn) {
            utils.addEvent("load", fn);
        },
        //时间格式化
        date: {
            format: function (dateformat, date) {
                var date = date || new Date();

                function getDobule(d) {
                    if (d > 9) {
                        return d;
                    }
                    return "0" + d;

                }

                if (utils.getType(date) == "number") {
                    return getDobule(date);
                }

                var format = {
                    "yyyy|YYYY": date.getFullYear(),
                    "yy|YY": date.getYear(),
                    "MM": getDobule(date.getMonth() + 1),
                    "M": date.getMonth() + 1,
                    "dd|DD": getDobule(date.getDate()),
                    "d|D": date.getDate(),
                    "hh|HH": getDobule(date.getHours()),
                    "mm": getDobule(date.getMinutes()),
                    "m": date.getMinutes(),
                    "ss|SS": getDobule(date.getSeconds()),
                    "s|S": date.getSeconds(),
                    "ww|WW|w|W": utils.CONST.CN_DIGIT.charAt(date.getDay())
                }
                for (var key in format) {
                    dateformat = dateformat.replace(new RegExp(key), format[key]);
                }

                return dateformat;
            },
            add: function (date, dateFmt) {
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                var exp = "yMdhms";
                var fnName = "FullYear|Month|Date|Hours|Minutes|Seconds".split("|");
                var i = 0, l = exp.length;
                for (; i < l; i++) {
                    var r = new RegExp("(-?\\d+)" + exp.charAt(i));
                    if (r.test(dateFmt)) {
                        (new Function("date", "date.set" + fnName[i] + "(date.get" + fnName[i] + "()+" + (r.exec(dateFmt)[1]) + ");")(date));
                    }
                }

                return date;
            },
            parse: function (strDate) {
                var tick = Date.parse(strDate);
                var date = new Date(tick);
                if (isNaN(date)) {
                    var s = strDate.split("-");

                    date = new Date(s[0], --s[1], s[2]);
                }
                return date;
            }
        },
        string: {
            trim: function (obj, operation) {
                var trimExp = {
                    left: /^\s+/,
                    right: /\s+$/
                }
                var str = obj.toString();
                return !operation ? str.replace(trimExp.left, "").replace(trimExp.right) :
                        operation.toLowerCase() == "left" ? str.replace(trimExp.left, "") : str.resplace(trimExp.right, "");

            },
            isEmpty: function (str) {
                return utils.string.trim(str) === "";
            }
        },
        event: function (e) {
            var e = window.event || e;
            return {
                srcElement: e.srcElement || e.target,
                keyCode: e.keyCode,
                cancelBubble: function () {
                    if (e.stopPropagation !== undefined) {
                        e.stopPropagation();
                    } else if (e.cancelBubble !== undefined) {
                        e.cancelBubble = true;
                    } else {
                        return false;
                    }
                },
                preventDefault: function () {
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else if (e.returnValue) {
                        e.returnValue = false;
                    }
                    return false;
                }
            }
        },
        addEvent: function (eventName, fn, elem) {
            var elem = elem || window;
            if (elem && elem.addEventListener) {
                elem.addEventListener(eventName, fn, false);
            } else if (elem && elem.attachEvent) {
                elem.attachEvent("on" + eventName, fn);
            } else {
                new Function("var oldEvent=elem.on" + eventName + ";elem.on" + eventName + "=function(){oldEvent();fn();}")(elem);
            }
        },
        CONST: {
            CN_DIGIT: "日一二三四五六",
            solar: {
                "0101": "元旦",
                "0404": "清明",
                "0501": "5.1",
                "1001": "国庆",
                "1225": "圣诞"

            },
            lunar: {
                "0101": "春节",
                "0115": "元宵",
                "0505": "端午",
                "0707": "七夕",
                "0815": "中秋",
                "0100": "除夕"
            }

        }
    }


    function datepicker(config) {
        var defaultOption = {
            startDate: new Date(),
            endDate: new Date(2099, 1, 1),
            doubleCalendar: false,
            isShowLunar: false,
            dateFmt: "yyyy-MM-dd"
        }
        var isCustomStartDate = config.startDate || config.minDate ? true : false;


        if (config.follow && !utils.string.isEmpty(utils.$(config.follow).value)) {
            config.startDate = utils.date.parse(utils.$(config.follow).value);
        }
        else if (config.startDate) {
            config.startDate = utils.date.parse(config.startDate);
        }

        else if (config.minDate) {
            config.startDate = utils.date.parse(config.minDate);
        }


        if (config.endDate) {
            config.endDate = utils.date.parse(config.endDate);
        }
        else if (config.maxDate) {
            config.endDate = utils.date.parse(config.maxDate);
        }

        if (config.endDate < config.startDate) {
            config.endDate = new Date(2099, 12, 1);
        }


        if (config.showDate) {
            config.buildDate = utils.date.parse(config.showDate);
        } else if (isCustomStartDate) {
            config.buildDate = config.startDate;
        } else {
            config.buildDate = new Date();
        }

        this.option = utils.extend(config, defaultOption);

        this.build();
        this.init();
    }


    //农历月份信息
    (function () {
        var lunarInfo = new Array(
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260,
        0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255,
        0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40,
        0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0,
        0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4,
        0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0,
        0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570,
        0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4,
        0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a,
        0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50,
        0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552,
        0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9,
        0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60,
        0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
        0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0,
        0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577,
        0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0);


        var numString = "十一二三四五六七八九十";
        var lMString = "正二三四五六七八九十冬臘";

        //====================================== 傳回農曆 y年的總天數
        function lYearDays(y) {
            ///<summary>傳回農曆 y年的總天數</summary>
            var i, sum = 348
            for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900] & i) ? 1 : 0
            return (sum + leapDays(y))
        }

        //====================================== 傳回農曆 y年閏月的天數
        function leapDays(y) {
            ///<summary>傳回農曆 y年閏月的天數</summary>
            if (leapMonth(y)) return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
            else return (0)
        }

        //====================================== 傳回農曆 y年閏哪個月 1-12 , 沒閏傳回 0
        function leapMonth(y) {
            ///<summary>傳回農曆 y年閏哪個月 1-12 , 沒閏傳回 0</summary>
            return (lunarInfo[y - 1900] & 0xf)
        }

        //====================================== 傳回農曆 y年m月的總天數
        function monthDays(y, m) {
            ///<summary>傳回農曆 y年m月的總天數</summary>
            return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29)
        }

        //====================================== 算出農曆, 傳入日期物件, 傳回農曆日期物件
        // 該物件屬性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
        function Lunar(objDate) {
            ///<summary>算出農曆, 傳入日期物件, 傳回農曆日期物件
            ///該物件屬性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
            ///</summary>
            var i, leap = 0, temp = 0
            var baseDate = new Date(1900, 0, 31)
            var offset = (objDate - baseDate) / 86400000


            this.dayCyl = offset + 40
            this.monCyl = 14

            for (i = 1900; i < 2050 && offset > 0; i++) {
                temp = lYearDays(i)
                offset -= temp
                this.monCyl += 12
            }

            if (offset < 0) {
                offset += temp;
                i--;
                this.monCyl -= 12
            }

            this.year = i
            this.yearCyl = i - 1864

            leap = leapMonth(i) //閏哪個月
            this.isLeap = false

            for (i = 1; i < 13 && offset > 0; i++) {
                //閏月
                if (leap > 0 && i == (leap + 1) && this.isLeap == false)
                { --i; this.isLeap = true; temp = leapDays(this.year); }
                else
                { temp = monthDays(this.year, i); }

                //解除閏月
                if (this.isLeap == true && i == (leap + 1)) this.isLeap = false

                offset -= temp
                if (this.isLeap == false) this.monCyl++
            }

            if (offset == 0 && leap > 0 && i == leap + 1)
                if (this.isLeap)
                { this.isLeap = false; }
                else
                { this.isLeap = true; --i; --this.monCyl; }

            if (offset < 0) { offset += temp; --i; --this.monCyl; }

            this.month = i
            this.day = offset + 1
            return this;
        }

        function getLunarDateStr(date) {
            var tY = date.getFullYear();
            var tM = date.getMonth();
            var tD = date.getDate();
            var l = new Lunar(date);
            var lM = l.month.toFixed(0);
            var pre = (l.isLeap) ? '閏' : '';
            var mStr = pre + lMString.charAt(lM - 1) + '月';
            var lD = l.day.toFixed(0);
            pre = (lD <= 10) ? '初' : ((lD <= 19) ? '十' : ((lD <= 29) ? '廿' : '三'));
            var dStr = pre + numString.charAt(lD % 10);
            if (l.day == 1) {
                return mStr;
            }
            return dStr;
        }
        var _lunar = {
            getLunarDateStr: getLunarDateStr,
            lYearDays: lYearDays,
            leapDays: leapDays,
            leapMonth: leapMonth,
            monthDays: monthDays,
            lunar: Lunar

        }
        datepicker.lunar = _lunar;
    }());

    //当前时间
    datepicker.prototype.now = function () {
        return new Date();
    }

    datepicker.prototype.init = function () {
        var el = utils.$(this.option.el);
        var year = el.getAttribute("year");
        var month = el.getAttribute("month");
        var ins = this;
        el.onfocus = el.onclick = function (e) {
            if (!ins.form) {
                return;
            }
            var offset = utils.getOffset(this);
            if (ins.option.follow && !utils.string.isEmpty(utils.$(ins.option.follow).value)) {
                ins.option.startDate = utils.date.parse(utils.$(ins.option.follow).value);
            }
            ins.option.buildDate = ins.option.startDate;
            if (!utils.string.isEmpty(el.value)) {
                ins.option.buildDate = utils.date.parse(el.value);
            }
            ins.build();
            ins.form.style.display = "inline-block";
            ins.form.style.left = offset.left + "px";
            ins.form.style.top = (offset.top + el.offsetHeight) + "px";
            if (!window.XMLHttpRequest && window.ActiveXObject) {
                var iframe = utils.getElementsByClassName("ie6bugfix", ins.form, "iframe")[0];
                iframe.style.width = ins.form.offsetWidth + "px";
                iframe.style.height = ins.form.offsetHeight + "px";
            }
            //this.onblur = function () {
            //    ins.form.style.display = "none";
            //    this.onblur = null;
            //}
        }
        el.onkeypress = function (e) {
            switch (utils.event(e).keyCode) {
                case 27:
                    ins.form.style.display = "none";
                    break;
            }
        }
        //utils.addEvent("click", function () {
        //    ins.form.style.display = "none";
        //}, document);
        el.onblur = function (e) {
            if (window.ActiveXObject && ins.isCapture) {

                return false;
            }
            ins.form.style.display = "none";
        }
    }
    //是否闰年
    datepicker.prototype.isLeap = function (year) {
        var year = year || this.now().getFullYear();
        return (year % 100 === 0 && year % 400 === 0) || year % 4 == 0 ? true : false;
    }

    //指定年份每月的天数
    datepicker.prototype.monthDays = function (year) {
        var year = year || this.now().getFullYear();
        return new Array(31, 28 + (this.isLeap(year) ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    }
    datepicker.prototype.getDayStr = function (year, month, day) {
        if (this.now().getFullYear() === year && this.now().getMonth() === month && this.now().getDate() == day) {
            return "今天";
        }

        //本月与本日的代码
        var _m = month + 1;
        var dayCode = (_m < 10 ? ("0" + _m) : _m) + "" + (day < 10 ? ("0" + day) : day);
        return utils.CONST.solar[dayCode] || (function () {
            var lunar = datepicker.lunar.lunar(new Date(year, month, day)),
                lunarDate = datepicker.lunar.lunar(new Date(year, month, day)),
                key = utils.date.format("MMdd", new Date(lunar.year, lunar.month - 1, lunar.day));

            if (utils.date.format("MMdd", new Date(lunar.year, lunar.month - 1, lunar.day)) == "0101") {
                key = "0100";
            }
            return utils.CONST.lunar[key];
        })() || day;
    }
    ///是否属于时间范围
    datepicker.prototype.isDisableDate = function (date) {
        if (date <= this.option.endDate && date >= this.option.startDate) {
            return false;
        }
        return true;
    }
    datepicker.prototype.isToday = function (y, m, d) {
        if (this.now().getFullYear() === year && this.now().getMonth() === month && this.now().getDate() == day) {
            return "selected";
        }
    };

    datepicker.prototype.isSelected = function (y, m, d) {
        var el = utils.$(this.option.el);
        var date = utils.string.trim(el.value).split("-");
        if (date.length != 3) {
            return false;
        }
        if (parseInt(date[0]) === y && parseInt(date[1]) === m && parseInt(date[2]) === d) {
            return true;
        }
        return false;
    }


    //创建日历
    datepicker.prototype.buildCalendar = function (year, month) {

        ///创建日历的时间
        var buildDate = utils.getType(year) === "number" && utils.getType(month) === "number" ?
                        new Date(year, month, 1) :
                        new Date(this.now().getFullYear(), this.now().getMonth(), 1);

        var year = buildDate.getFullYear();
        var month = buildDate.getMonth();
        var date = buildDate.getDate();
        var month_Days = this.monthDays(year)[month];
        var firstDay = buildDate.getDay();
        var tr_count = Math.ceil((month_Days + firstDay) / 7);

        var html = [];
        html.push('<div class="j_calendar">');
        html.push('<div class="j_calendar_title">');
        html.push('<span class="j_calendar_ctrl j_calendar_year_prev" fmt="-1y">&lt;&lt;</span>');
        html.push('<span class="j_calendar_ctrl j_calendar_month_prev" fmt="-1M">&lt;</span>');
        html.push('<span class="j_calendar_year_month">' + year + '年' + utils.date.format("MM", month + 1) + '月</span>');
        html.push('<span class="j_calendar_ctrl j_calendar_month_next" fmt="1M">&gt;</span>');
        html.push('<span class="j_calendar_ctrl j_calendar_year_next" fmt="1y">&gt;&gt;</span>');
        html.push('</div>');
        html.push('<table cellpadding="0" cellspacing="0" year="' + year + '" month="' + month + '" >');

        //创建头部
        html.push('<thead>');
        html.push('<tr>');
        for (var i = 0; i < 7; i++) {
            html.push('<td>' + utils.CONST.CN_DIGIT.charAt(i) + '</td>');
        }
        html.push('</tr>');
        html.push('</thead>');
        //头部结束

        //创建主体内容
        html.push('<tbody>');
        for (var i = 0; i < tr_count; i++) {
            html.push('<tr>');
            for (var j = 0; j < 7; j++) {
                var idx = i * 7 + j;
                var date_str = idx - firstDay + 1;
                var format_date_str = this.getDayStr(year, month, parseInt(date_str));
                var isHoliday = format_date_str != date_str;
                //过滤无效的日期
                format_date_str = date_str <= 0 || date_str > month_Days ? '' : format_date_str;
                html.push('<td ' + ' class="' + ((isHoliday ? " holiday " : "") +
                 (!this.isDisableDate(new Date(year, month, date_str)) && this.isSelected(parseInt(year), parseInt(month) + 1, parseInt(date_str)) ? "selected" : "") +
                 (this.isDisableDate(new Date(year, month, date_str)) || format_date_str == "" ? " disabled " : "")) + '"' +
                ' day="' + date_str + '">' + (format_date_str != "" && this.option.isShowLunar ? [format_date_str, '<p>', datepicker.lunar.getLunarDateStr(new Date(year, month, parseInt(date_str))), '</p>'].join("") : format_date_str) +
                 '</td>');
            }
            html.push('</tr>');
        }
        //主体内容结束

        html.push('</tbody>');
        html.push('</table>');
        html.push('</div>');

        return html.join('\r\n');
    }

    datepicker.prototype.build = function () {
        var instance = this;
        var _calendar_area = this.form;
        var eventObj = utils.$(this.option.el);

        if (!_calendar_area) {
            _calendar_area = document.createElement("div");
            utils.extend(_calendar_area.style, {
                "position": "absolute",
                "display": "none",
                "left": "-1000px",
                "top": "-1000px"
            });
            if (this.option.doubleCalendar) {
                _calendar_area.className = "j_calendar_area j_double_calendar";
                //_calendar_area.setAttribute("class", "j_calendar_area j_double_calendar");
            } else {
                _calendar_area.className = "j_calendar_area j_one_calendar";
                //_calendar_area.setAttribute("class", "j_calendar_area");
            }

            _calendar_area.onmouseenter = function () {
                //var oldBlur = eventObj.onblur || function () { };
                //eventObj.onblur = null;
                return false;
            }
            _calendar_area.onmouseleave = function () {
                instance.isCapture = false;
            }
          
            _calendar_area.onmousedown = function (e) {
                _calendar_area.setCapture && _calendar_area.setCapture();
                instance.isCapture = true;
                _calendar_area.releaseCapture && _calendar_area.releaseCapture();
                return false;
            }


            this.form = _calendar_area;
            document.body.appendChild(_calendar_area);
        }
        var html = [];
        if (window.ActiveXObject && !window.XMLHttpRequest) {
            html.push('<iframe class="ie6bugfix" src="about:blank" frameborder="0"></iframe>');
        }
        for (var i = 0; i < (this.option.doubleCalendar ? 2 : 1) ; i++) {
            var date = new Date(this.option.buildDate.getFullYear(), this.option.buildDate.getMonth() + i, 1);
            html.push('<div class="j_area j_calendar_' + i + '">' + this.buildCalendar(date.getFullYear(), date.getMonth()) + '</div>');
        }
        _calendar_area.innerHTML = html.join("");
        utils.each(utils.getElementsByClassName("j_calendar_ctrl", _calendar_area), function () {
            this.onmousedown = function () {
                instance.option.buildDate = utils.date.add(instance.option.buildDate, this.getAttribute("fmt"));
                instance.build();
                return false;
            }

        });

        var months = _calendar_area.getElementsByTagName("table");
        utils.each(months, function (i, v) {
            var body = this.getElementsByTagName("tbody")[0];
            var year = this.getAttribute("year");
            var month = this.getAttribute("month");
            var tds = body.getElementsByTagName("TD");
            utils.each(tds, function (i, v) {
                var day = this.getAttribute("day");
                if (utils.hasClass("disabled", this) || utils.string.isEmpty(this.innerHTML)) {
                    this.onmousedown = function () {
                        eventObj.focus();
                        return false;
                    };

                    return;
                }
                this.onclick = function (e) {
                    utils.each(_calendar_area.getElementsByTagName("TD"), function () {
                        if (this.className == "selected") {
                            this.className = "";
                            return false;
                        }
                    });

                    this.className = "selected";
                    instance.isCapture = false;
                    utils.event(e).cancelBubble();
                    var date = utils.date.format(instance.option.dateFmt, new Date(year, month, day));
                    if (instance.option.onpicker) {
                        instance.option.onpicker.call(utils.$(instance.option.el), date);
                    } else if (instance.option.el) {
                        utils.$(instance.option.el).value = date;
                    }

                    //eventObj.focus();
                    _calendar_area.style.display = "none";
                    return false;
                }
            });
        });
        return this;
    }
    window.jDatepicker = function (config) {
        config.el = config.el || this;
        var dp = new datepicker(config);
        dp.utils = datepicker.utils;
        return dp;
    }
    utils.extend(window.jDatepicker, {
        utils: utils,
        version: "1.2012.06.14"
    });
}(window));
