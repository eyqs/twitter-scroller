#!/usr/bin/env node

const twitter_scroller = require("../index.js");

if (process.argv.length < 9) {
  console.log(`Usage: twitter-scroller [username] \
[start_year] [start_month] [start_day] [end_year] [end_month] [end_day]`);
  process.exit();
}

const username = process.argv[2];
const start_year = parseInt(process.argv[3]);
const start_month = parseInt(process.argv[4]);
const start_day = parseInt(process.argv[5]);
const end_year = parseInt(process.argv[6]);
const end_month = parseInt(process.argv[7]);
const end_day = parseInt(process.argv[8]);

twitter_scroller.main(username, start_year, start_month, start_day,
    end_year, end_month, end_day);
