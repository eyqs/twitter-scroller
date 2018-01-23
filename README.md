# twitter-scroller

Twitter Scroller is a tool that scrapes more tweets than allowed by Twitter's
API. It works by literally scrolling down, using the Chrome DevTools Protocol.

## Rationale

Twitter's API has a limit of 180 GET requests per user per 15 minutes.
This is prohibitively small when scraping tens of thousands of tweets, so
Twitter Scroller deals with this by opening Twitter in Chrome and scrolling
down on the search results of every single day, scraping every single tweet.
This idea was translated from the original Python/Selenium program,
[twitter_scraping][], because I couldn't use headless Chrome with Selenium.

## Installation

    $ npm install -g twitter-scroller

## Usage

    $ twitter-scroller realDonaldTrump 2017 1 20 2017 11 7

After running `twitter-scroller`, the tweets will be stored in the file
`realDonaldTrump--2017-1-17--2017-11-7--tweets.json`. The keys of the JSON
object are the ids of the tweets, and the values are the text of the tweets.

It is recommended to scrape a month at a time, so that you don't lose all your
progress if your internet cuts out or your computer spontaneously combusts.

## Customization

If Twitter Scroller is missing some tweets, it may be moving too fast.
In `index.js`, `MAX_SCROLL_WAIT` controls the amount of time to wait
before scrolling down and `MAX_PAGE_WAIT` controls the amount of time
to wait before moving to the next day. Clone the git repository,
adjust these constants, and run Twitter Scroller again if you wish:

    $ git clone https://github.com/eyqs/twitter-scroller.git/
    $ cd twitter-scroller/
    $ vim index.js
    $ node bin/scroll.js realDonaldTrump 2017 1 20 2017 11 7

## License

Copyright &copy; 2017, 2018, Eugene Y. Q. Shen.

Twitter Scroller is free software: you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation, either version
3 of the License, or (at your option) any later version.

Twitter Scroller is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License in [LICENSE.md][] for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

[twitter_scraping]:          https://github.com/bpb27/twitter_scraping
[license.md]:                ../master/LICENSE.md
                               "The GNU General Public License"
