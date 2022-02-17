const config = require('config');
const axios = require('axios');

module.exports = class BhlApi {
  constructor() {
    this.apiKey = config.get('bhlApi.apiKey');
    this.apiUrl = config.get('bhlApi.apiUrl');
  }

  fulltextSearch = async (keywords) => {
    let params = {
      op: 'PublicationSearch',
      searchterm: keywords,
      searchtype: 'F',
      page: '1',
      pagesize: '72',
    };
    // console.log('preparing req', params);
    const response = await this.Query(params);
    return response.data.Result;
  };
  getItemMetadata = async (itemId) => {
    let params = {
      op: 'ItemMetadata',
      itemid: itemId,
    };
  };
  getPartMetadata = async (partId) => {
    let params = {
      op: 'GetPartMetadata',
      id: partId,
      items: 't',
    };
    // console.log('preparing req', params);
    const response = await this.Query(params);
    if (response && response.data && response.data.Result) {
      return response.data.Result;
    } else {
      console.log('no data');
      return false;
    }
  };
  Query = async (params) => {
    params.apikey = this.apiKey;
    params.format = 'json';
    // console.log('sending req', params);
    try {
      return await axios.get(this.apiUrl, { params });
    } catch (error) {
      console.log(error);
      return false;
    }
  };
};
