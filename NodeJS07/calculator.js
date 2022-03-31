function add (num1, num2) {
    return num1 + num2;
}

function substract (num1, num2) {
    return num1 - num2;
}

/*
exports.add = add; // 把 add函數 賦予 module.exports object 裡的 add屬性
exports.substract = substract; 
*/

module.exports = {
    add,
    substract,
} 