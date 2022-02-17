const axios = require('axios');
require('dotenv').config();

module.exports = class BhlApi {
  constructor() {
    this.apiKey = process.env.BHL_API_KEY;
    this.apiUrl = process.env.BHL_API_URL;
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
    if (response.status === 200) {
      return response.data.Result;
    }
  };
  getItemMetadata = async (itemId) => {
    let params = {
      op: 'ItemMetadata',
      itemid: itemId,
    };
    const response = await this.Query(params);
    if (response && response.data && response.data.Result) {
      return response.data.Result;
    } else {
      console.log('no data');
      return [];
    }
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
      return [];
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
      return [];
    }
  };
};
