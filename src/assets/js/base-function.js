/*
*获取当前日期和时间
*/
const getCurrentDateTime = () => {
    const date = new Date(); // 获取当前日期和时间
    const year = date.getFullYear(); // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，注意要加 1，并填充为两位数
    const day = String(date.getDate()).padStart(2, '0'); // 获取日期，填充为两位数
    const hours = String(date.getHours()).padStart(2, '0'); // 获取小时，填充为两位数
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 获取分钟，填充为两位数
    const seconds = String(date.getSeconds()).padStart(2, '0'); // 获取秒数，填充为两位数

    return `${year}-${month}-${day}:${hours}:${minutes}:${seconds}`; // 格式化为 YYYY-MM-DD:HH:mm:ss
};

export { getCurrentDateTime }