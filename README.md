#jDatePicker日期控件

**描述**

>日历控件，含放假节目，原生控件，无需引用jQuery

**参数说明（<em style='color: #f00;'>\*为必填参数</em>）**

<table>
    <thead>
        <tr>
            <td>名称</td>
            <td>说明</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                el<em>*</em>
            </td>
            <td>接收日期的文本框</td>
        </tr>
        <tr>
            <td>startDate</td>
            <td>开始时间，字串格式：例2012-01-01，默认为今天</td>
        </tr>
        <tr>
            <td>endDate</td>
            <td>结束时间，字串格式：例2012-12-12，默认为2099</td>
        </tr>
        <tr>
            <td>isShowLunar</td>
            <td>是否显示农历，默认不显示</td>
        </tr>
        <tr>
            <td>doubleCalendar</td>
            <td>是否显示双列日历，默认不显示</td>
        </tr>
        <tr>
            <td>dateFmt</td>
            <td>返回的时间格式,例yyyy-MM-dd 周W</td>
        </tr>
        <tr>
            <td>onpicker</td>
            <td>选择日期事件，不填则为文本框填充</td>
        </tr>
    </tbody>
</table>

**调用实例（代码）**

    <input id="datepicker" />
    <link type="stylesheet" href="https://raw.githubusercontent.com/uje/jDatePicker/master/jDatePicker-blue.css" />
    <script src="https://raw.githubusercontent.com/uje/jDatePicker/master/jDatePicker.js"></script>
    <script>
        var dp = jDatepicker({
             el: "datepicker",                //使用对象的文本框
             startDate: "2012-4-1", //开始日期（可不填,默认为今天）
             endDate: "2012-5-20",  //结束日期（可不填,默认为2099年)
             isShowLunar: false,               //是否显示农历（可不填，默认不显示）
             doubleCalendar: true,            //是否显示双列（可不填，默认显示单列）
             dateFmt: "yyyy-MM-dd"           //日期格式，（可不填，默认为yyyy-MM-dd）
         });
    </script>

