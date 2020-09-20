const today = Date.now();
const unixDay = 4 * 60 * 60;
const now = Math.floor(Date.now() / 1000);
const yesterday = now - unixDay;
const dayStart = Math.floor(now / 86400);
const yesterdayStart = Math.floor(yesterday / 86400);

//console.log(dayStart);
console.log(yesterdayStart);

//var percentchange = ((last - current) / current) * 100.0;
