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
    res.render('results', { results: kwResponse });
  });
  app.post('/saveResults', async (req, res) => {
    let metadata = [];
    let parts = req.body.parts.split(',').map((id) => parseInt(id));
    let items = req.body.items.split(',').map((id) => parseInt(id));
    console.log(req.body);
    console.log(parts);
    console.log(items);
    if (parts.length > 0) {
      await parts.forEachAsyncParallel(async function (item) {
        let itemResponse = await api.getPartMetadata(item);
        if (Array.isArray(itemResponse)) {
          metadata.push(itemResponse[0]);
        }
      });
    }
    if (items.length > 0) {
      await items.forEachAsyncParallel(async function (item) {
        let itemResponse = await api.getItemMetadata(item);

        if (Array.isArray(itemResponse)) {
          metadata.push(itemResponse[0]);
        }
      });
    }
    console.log(metadata);
    res.render('fullResults', { results: metadata });
  });
};
