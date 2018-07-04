const environments = require('./environments.js');

const CronJob = require('cron').CronJob;

const Turndown = require('turndown');
const turndownService = new Turndown();

const request = require('request');
const cheerio = require('cheerio');

const { WebClient } = require('@slack/client');

const token = environments.token;
const web = new WebClient(token);
const channelId = environments.channel;

new CronJob('00 15 12 * * 1,2,3,4,5', function() {
    request('http://restaurantepossibilia.com/menu-diario/', function (error, response, body) {
        const $ = cheerio.load(body);
        $('img').remove();
        $('br').remove();
        const siteHtml = $('#menu-diario-content').html();
        const markdown = turndownService.turndown(siteHtml);
        web.chat.postMessage({ channel: channelId, text: markdown })
            .then((res) => {
                // `res` contains information about the posted message
                console.log('Message sent: ', res.ts);
            })
            .catch(console.error);
    });
}, null, true, 'Europe/Madrid');

