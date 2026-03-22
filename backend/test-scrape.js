const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape(query) {
  try {
    const { data: fkData } = await axios.get(`https://www.flipkart.com/search?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const $ = cheerio.load(fkData);
    const title = $('div._4rR01T').first().text() || $('a.s1Q9rs').first().text() || $('a.IRpwTa').first().text();
    const priceStr = $('div._30jeq3').first().text();
    const image = $('img').not('img.logo').attr('src');
    
    console.log('FLIPKART:', { title, priceStr, image });
  } catch(e) { console.error('Flipkart blocked', e.message); }

  try {
    const { data: amzData } = await axios.get(`https://www.amazon.in/s?k=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const $$ = cheerio.load(amzData);
    const amzTitle = $$('span.a-size-medium.a-color-base.a-text-normal').first().text() || $$('span.a-size-base-plus.a-color-base.a-text-normal').first().text();
    const amzPrice = $$('span.a-price-whole').first().text();
    const amzImg = $$('img.s-image').first().attr('src');
    
    console.log('AMAZON:', { title: amzTitle, price: amzPrice, image: amzImg });
  } catch(e) { console.error('Amazon blocked', e.message); }
}

testScrape('iphone 15')
