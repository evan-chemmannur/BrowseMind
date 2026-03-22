const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeDDG(query, site) {
  try {
    const { data } = await axios.get(`https://html.duckduckgo.com/html/?q=site:${site}+${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const $ = cheerio.load(data);
    const firstResult = $('.result__snippet').first().text();
    const title = $('.result__title > a').first().text();
    console.log(`[${site}]`, title, firstResult);
  } catch (e) {
    console.error('DDG Error', e.message);
  }
}

scrapeDDG('iphone 15', 'amazon.in');
scrapeDDG('iphone 15', 'flipkart.com');
