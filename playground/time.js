const moment = require('moment');

const date = moment();

// shorthand month - Jan Dec, etc.
console.log(date.format('MMM'));

// Dec 2018
console.log(date.format('MMM YYYY'));

// Dec 2nd, 2018:
console.log(date.format('MMM Do, YYYY'));

// manipulation
date.add(1, 'years');
date.subtract(9, 'months');

const time = moment();

// 1:03pm
console.log(time.format('h:mma'))

// using timestamp with moment (moment takes into account the local timezone automatically):
const timestamp = 9823482734;
const tDate = moment(timestamp);

// get timestamp in millisecs returned from passing in a date:
const someTS = moment().valueOf(); // returns UTC millisecs

