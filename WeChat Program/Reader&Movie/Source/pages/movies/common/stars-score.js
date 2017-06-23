function convertToStarsArray(stars){
    var star = stars.toString();
    var num1 = star.substr(0,1) - 0;
    var num2 = star.substr(1,1) - 0;
    var array = [];
    for(var i =1; i<=5;i++){
        if (i<=num1) {
            array.push(1);
        } else if (i == num1 + 1 && num2 == 5) {
            array.push(2);
        } else {
            array.push(0);
        }
    }
    return array;
}

module.exports = {
    convertToStarsArray: convertToStarsArray
}