let getValidDate = (start, end) => {
    let oneDay = 1000 * 60 * 60 * 24,
        dateList = '[';
    start = +new Date(start),
    end = +new Date(end);
    while(start < end) {
        let curr = new Date(start);
        dateList += `${curr.getFullYear()}-${curr.getMonth() + 1}-${curr.getDate()} `;
        start += oneDay;   
    }
    return dateList.slice(0, -1) + ']';
}
let result = getValidDate('2015-2-8', '2015-3-3')
console.log(result);