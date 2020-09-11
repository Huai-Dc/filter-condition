/**
 * Created by huai on 2019-06-27
 * 时间日期格式化
 */
Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export function formatTimeToStr(times, pattern) {
    let d = new Date(times).Format("yyyy-MM-dd hh:mm:ss");
    if (pattern) {
        d = new Date(times).Format(pattern);
    }
    return d.toLocaleString();
}
// vant 日期控件 格式化
export function formatter(type, value) {
    console.log(type);
    if (type === 'year') {
        return `${value}年`;
    } else if (type === 'month') {
        return `${value}月`
    } else if (type === 'day') {
        return `${value}日`
    }else if(type === ''){

    }
    return value;
}

/**
 * 获取几年前的日期
 * @param [Number] year
 */
export function getDateAgo(year){
    let agoYear = new Date().setFullYear((new Date().getFullYear()-year))
    return new Date(agoYear).Format("yyyy-MM-dd")
}
