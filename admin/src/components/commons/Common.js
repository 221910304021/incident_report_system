export function formatZeros(date) {
    var month = date.getMonth()+1;
    var day = date.getDate();
    var year = date.getFullYear();
    month = month < 10 ? '0'+month : month;
    day = day < 10 ? '0'+day : day;

    return `${month}/${day}/${year}`
    
}

export function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    hours = hours < 10 ? '0'+hours : hours
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return  `${hours}:${minutes} ${ampm}`;
}