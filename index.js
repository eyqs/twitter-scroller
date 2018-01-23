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

const chromeLauncher = require("chrome-launcher");
const CDP = require("chrome-remote-interface");
const fs = require("fs");

const MONTHS_PER_YEAR = 12;
const DAYS_PER_MONTH = 31;
const MAX_SCROLL_WAIT = 3000;
const MAX_PAGE_WAIT = 10000;

async function crawlTweets(Page, username, y, m, d) {
  const url =
`https://twitter.com/search?f=tweets&q=from%3A${username}%20since%3A\
${y}-${m}-${d}%20until%3A${y}-${m}-${d + 1}&src=typd`;
  console.log(`Crawling @${username}'s tweets on ${y}-${m}-${d}...`);
  await Page.navigate({url});
  await Page.loadEventFired();
  await new Promise(resolve => setTimeout(resolve, MAX_PAGE_WAIT));
}

exports.main = async function(username, start_year, start_month, start_day,
    end_year, end_month, end_day) {
  const tweets = {};
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--disable-gpu", "--no-sandbox", "--headless"]
  });
  const protocol = await CDP({port: chrome.port});
  const {Page, Runtime} = protocol;
  await Promise.all([Page.enable(), Runtime.enable()]);
  Page.loadEventFired(async () => {
    const result = await Runtime.evaluate({awaitPromise: true, expression: `
      (async () => {
        let new_tweet = true;
        let callback = () => {};
        const observer = new MutationObserver(function () {
          new_tweet = true;
          callback();
        });
        observer.observe(document.querySelector("div.stream-container"),
            {attributes: true, attributeFilter: ["data-min-position"]});
        while (new_tweet) {
          new_tweet = false;
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise(function (resolve) {
            callback = resolve;
            setTimeout(resolve, ${MAX_SCROLL_WAIT});
          });
        }
      })().then(resolve => JSON.stringify({
        ids: [...document.querySelectorAll("li.js-stream-item")]
            .map(id => id.getAttribute("data-item-id")).slice(1),
        tweets: [...document.querySelectorAll("p.js-tweet-text")]
            .map(tweet => tweet.textContent),
      }), reject => null);`
    });

    if (result.result.value) {
      const value = JSON.parse(result.result.value);
      const len = value.ids.length;
      console.log(`...${len} tweet${len == 1 ? "" : "s"} found.`);
      for (let i = 0; i < len; i++) {
        if (value.tweets[i].includes("pic.twitter.com")) {
          value.tweets[i] = value.tweets[i].slice(
              0, value.tweets[i].lastIndexOf("pic.twitter.com"));
        }
        if (value.tweets[i].includes("…")) {
          value.tweets[i] = value.tweets[i].slice(
              0, value.tweets[i].lastIndexOf("http"));
        }
        tweets[value.ids[i]] = value.tweets[i];
      }
    } else {
      console.log("...0 tweets found.");
    }
  });

  let year = start_year;
  let month = start_month;
  let day = start_day;
  while (year < end_year) {
    while (month < MONTHS_PER_YEAR) {
      while (day < DAYS_PER_MONTH - 1) {
        await crawlTweets(Page, username, year, month, day);
        ++day;
      }
      day = 1;
      ++month;
    }
    month = 1;
    ++year;
  }
  while (month < end_month) {
    while (day < DAYS_PER_MONTH - 1) {
      await crawlTweets(Page, username, year, month, day);
      ++day;
    }
    day = 1;
    ++month;
  }
  while (day < end_day) {
    await crawlTweets(Page, username, year, month, day);
    ++day;
  }

  const file_name = `${username}--${start_year}-${start_month}-${start_day}--\
${end_year}-${end_month}-${end_day}--tweets.json`;
  console.log(`Total number of tweets saved in "${file_name}": \
${Object.keys(tweets).length}.`);
  fs.writeFile(file_name, JSON.stringify(tweets),
      error => { console.log(error); process.exit(); })
  chrome.kill();
}
