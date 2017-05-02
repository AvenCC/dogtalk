'use strict'

import QueryString from "query-string";
import lodash from "lodash";
import Mock from "mockjs";
import config from "./config";

let request = {};

request.get = function (url, param) {
  if (param) {
    url += '?' + QueryString.stringify(param);
  }
  return fetch(url)
    .then(response => response.json())
    .then(response => Mock.mock(response))
}

request.post = function (url, body) {
  let options = lodash.extend(config.header, {
    body: QueryString.stringify(body)
  });
  return fetch(url, options)
    .then((response) => response.json())
    .then(response => Mock.mock(response));
}

module.exports = request;