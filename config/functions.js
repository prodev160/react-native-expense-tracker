export default function addCommas(number) {
    number = number + 0.00;
    try {
        return number.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    catch {
        number =  0;    
        return number.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
}