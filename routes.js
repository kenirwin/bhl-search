const Api = require('./models/bhlApi');
const api = new Api();

Array.prototype.forEachAsyncParallel = async function (fn) {
  await Promise.all(this.map(fn));
};

module.exports = function (app) {
  app.get('/', (req, res) => {
    res.render('index');
  });
  app.post('/', async (req, res) => {
    const search = req.body.search;
    let kwResponse = await api.fulltextSearch(search);
    let message = '';
    if (kwResponse == undefined || kwResponse.length == 0) {
      message = 'No results found for search: ' + search;
    }

    res.render('results', { results: kwResponse, message: message });
  });
  app.post('/saveResults', async (req, res) => {
    let metadata = [];
    let parts = req.body.parts.split(',').map((id) => parseInt(id));
    let items = req.body.items.split(',').map((id) => parseInt(id));
    console.log('req.body:', req.body);
    console.log('parts:', parts);
    console.log('items:', items);
    if (parts.length > 0) {
      await parts.forEachAsyncParallel(async function (item) {
        let itemResponse = await api.getPartMetadata(item);
        if (Array.isArray(itemResponse)) {
          metadata.push(itemResponse[0]);
        }
        console.log('finished awaiting parts');
      });
    }
    if (items.length > 0) {
      console.log('about to await items');
      await items.forEachAsyncParallel(async function (item) {
        let itemResponse = await api.getItemMetadata(item);
        console.log('response for item', item, itemResponse);
        if (Array.isArray(itemResponse)) {
          metadata.push(itemResponse[0]);
        }
      });
      console.log('finished awaiting items');
    }
    console.log('metadata:', metadata);
    res.render('fullResults', { results: metadata });
  });
};
