#!/usr/bin/env node

/* Twitter Scroller v2.0.0
 * Copyright (c) 2017, 2018 Eugene Y. Q. Shen.
 *
 * Twitter Scroller is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version
 * 3 of the License, or (at your option) any later version.
 *
 * Twitter Scroller is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */

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
