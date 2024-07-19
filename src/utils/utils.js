/*
    数字格式处理
*/
export function num(val) {
    if (!val) return '';
    return val.toLocaleString();
}
/* 
    处理数据html标签显示界面
*/
export function removeHTMLTag(htmlStr) {
    let html = htmlStr
        .replace(/<img.*?>/g, "[图片]")
        .replaceAll(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, "");
    return html;
}