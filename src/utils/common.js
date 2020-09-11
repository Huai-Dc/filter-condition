import accounting from 'accounting';
/**货币格式化过滤器
 *  把 分 转成 元 ，并格式化
 * 10000 => "10,000"
 * @param {number} price
 */
export function formatCurrencyFilter(price, symbol, decimal) {
    if (!symbol && symbol!== "") {
        symbol = '￥';
    }
    if (!decimal) {
        decimal = 2;
    }
    if (price === 0) {
        return accounting.formatMoney(price, symbol, decimal);
    } else if (price === '' || price === null || price === undefined) {
        return '';
    } else {
        return accounting.formatMoney(price, symbol, decimal);
    }
}
