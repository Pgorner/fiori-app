/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./Log", "./ajax", "./ajaxUtil", "./core", "./defaultAjaxErrorFactory", "./errors"], function (___Log, ___ajax, ___ajaxUtil, ___core, ___defaultAjaxErrorFactory, ___errors) {
  "use strict";

  const Log = ___Log["Log"];
  const applyResponseFormattersAndUpdateJSON = ___ajax["applyResponseFormattersAndUpdateJSON"];
  const request = ___ajax["request"];
  const addEncodedUrlParameters = ___ajaxUtil["addEncodedUrlParameters"];
  const isBrowserEnv = ___core["isBrowserEnv"];
  const createDefaultAjaxErrorFactory = ___defaultAjaxErrorFactory["createDefaultAjaxErrorFactory"];
  const ResponseFormatError = ___errors["ResponseFormatError"];
  const LanguageHeaderError = ___errors["LanguageHeaderError"];
  class AjaxBaseClient {
    handleCookies;
    cookieStore = {};
    csrf;
    csrfByPassCache;
    csrfToken;
    csrfFetchRequest;
    csrfFetchRequestPromise;
    getLanguage;
    authorization;
    requestFormatters = [];
    responseFormatters = [];
    defaultParameters = {};
    errorFactories = [];
    errorFormatters = [];
    log;
    constructor(properties) {
      this.csrf = properties.csrf;
      this.csrfByPassCache = properties.csrfByPassCache || false;
      this.csrfToken = null;
      this.csrfFetchRequest = properties.csrfFetchRequest || null;
      this.getLanguage = properties?.getLanguage;
      this.authorization = undefined;
      if (properties.authorization) {
        this.authorization = {
          user: properties.authorization.user,
          password: properties.authorization.password
        };
      }
      this.requestFormatters = properties.requestFormatters ?? [];
      this.responseFormatters = properties.responseFormatters ?? [];
      this.defaultParameters = properties.defaultParameters ?? {};
      this.errorFactories = properties.errorFactories ?? [createDefaultAjaxErrorFactory()];
      this.errorFormatters = properties.errorFormatters || [];
      // for node env   : cookies are handled by ajax base client
      // for browser env: cookies are handled by browser
      this.handleCookies = !isBrowserEnv();
      this.log = new Log("ajax base client");
    }
    getJsonHeaders() {
      const header = {
        "Content-Type": "application/json",
        Accept: "application/json"
      };
      this.addLanguageToHeader(header);
      this.addDefaultHeaders(header);
      return header;
    }
    getXmlHeaders() {
      const header = {
        "Content-Type": "application/xml",
        Accept: "application/xml"
      };
      this.addLanguageToHeader(header);
      this.addDefaultHeaders(header);
      return header;
    }
    addDefaultHeaders(header) {
      header["Cache-Control"] = "no-cache";
    }
    addLanguageToHeader(header) {
      if (typeof this.getLanguage === "function") {
        try {
          header["Accept-Language"] = this.getLanguage();
        } catch (error) {
          throw new LanguageHeaderError({
            previous: error
          });
        }
      }
    }
    async getJson(url) {
      const responseProperties = await this.request({
        headers: this.getJsonHeaders(),
        method: "GET",
        url: url
      });
      try {
        responseProperties.data = JSON.parse(responseProperties.data);
      } catch (error) {
        if (error.name === "SyntaxError") {
          throw new ResponseFormatError(error, "JSON", responseProperties.data);
        } else {
          throw error;
        }
      }
      return responseProperties;
    }
    async postJson(url, data) {
      const responseProperties = await this.request({
        headers: this.getJsonHeaders(),
        method: "POST",
        url: url,
        data: JSON.stringify(data)
      });
      try {
        if (responseProperties.data?.length > 0) {
          responseProperties.data = JSON.parse(responseProperties.data);
        }
      } catch (error) {
        if (error.name === "SyntaxError") {
          throw new ResponseFormatError(error, "JSON", responseProperties.data);
        } else {
          throw error;
        }
      }
      return responseProperties;
    }
    async mergeJson(url, data) {
      const responseProperties = await this.request({
        headers: this.getJsonHeaders(),
        method: "MERGE",
        url: url,
        data: JSON.stringify(data)
      });
      try {
        if (responseProperties.data?.length > 0) {
          responseProperties.data = JSON.parse(responseProperties.data);
        }
      } catch (error) {
        if (error.name === "SyntaxError") {
          throw new ResponseFormatError(error, "JSON", responseProperties.data);
        } else {
          throw error;
        }
      }
      return responseProperties;
    }
    async getXML(url) {
      const responseProperties = await this.request({
        headers: this.getXmlHeaders(),
        method: "GET",
        url: url
      });
      return responseProperties.data;
    }
    fetchCsrf() {
      if (this.csrfFetchRequestPromise) {
        return this.csrfFetchRequestPromise;
      }
      this.csrfFetchRequest.headers = this.csrfFetchRequest.headers || {};
      this.csrfFetchRequest.headers["x-csrf-token"] = "fetch";
      this.csrfFetchRequest.parameters = this.csrfFetchRequest.parameters || {};
      if (this.csrfByPassCache) {
        this.csrfFetchRequest.parameters._ = Date.now(); // bypass cache;
      }
      this.csrfFetchRequestPromise = this.requestPlain(this.csrfFetchRequest).then(function (response) {
        this.csrfFetchRequestPromise = null;
        this.csrfToken = response.headers["x-csrf-token"];
        return response;
      }.bind(this));
      return this.csrfFetchRequestPromise;
    }
    async requestWithCsrf(properties, renewCsrf) {
      // if request is identical to csrf fetch request -> always fetch a new csrf token
      if (addEncodedUrlParameters(this.csrfFetchRequest.url, this.csrfFetchRequest.parameters) === addEncodedUrlParameters(properties.url, properties.parameters)) {
        return await this.fetchCsrf();
      }

      // no csrf -> fetch csrf
      if (renewCsrf && !this.csrfToken) {
        await this.fetchCsrf();
      }

      // do request with csrf token
      properties.headers = properties.headers || {};
      properties.headers["x-csrf-token"] = this.csrfToken;
      const response = await this.requestPlain(properties);

      // check response, csrf token maybe outdated: fetch csrf, repeat request
      const csrfHeader = response?.headers["x-csrf-token"];
      if (renewCsrf && csrfHeader && csrfHeader.toLowerCase() === "required") {
        await this.fetchCsrf();
        return await this.requestWithCsrf(properties, false);
      }
      return response;
    }
    createUrlMatchingResponseFormatter(url, formatter) {
      const responseFormatter = (request, response) => {
        if (request.url.indexOf(url) !== 0) {
          return response;
        }
        return formatter(request, response);
      };
      this.addResponseFormatter(responseFormatter);
      return {
        delete: () => this.removeResponseFormatter(responseFormatter)
      };
    }
    addResponseFormatter(formatter) {
      this.responseFormatters.push(formatter);
    }
    removeResponseFormatter(formatter) {
      const index = this.responseFormatters.indexOf(formatter);
      if (index >= 0) {
        this.responseFormatters.splice(index);
      }
    }
    removeAllResponseFormatters() {
      this.responseFormatters = [];
    }
    applyRequestFormatters(request) {
      for (const requestFormatter of this.requestFormatters) {
        request = requestFormatter(request);
      }
      return request;
    }
    applyResponseFormatters(request, response) {
      return applyResponseFormattersAndUpdateJSON(request, response, this.responseFormatters);
    }
    setBasicAuth(properties) {
      properties.headers = Object.assign({}, properties.headers);
      if (this.authorization !== undefined) {
        if (typeof Buffer === "function") {
          // node.js encode
          properties.headers.Authorization = "Basic " + Buffer.from(this.authorization.user + ":" + this.authorization.password).toString("base64");
        } else if (window && typeof window.btoa === "function") {
          // javascript encode
          properties.headers.Authorization = "Basic " + window.btoa(this.authorization.user + ":" + this.authorization.password);
        }
      }
    }
    async request(requestProperties) {
      const responseProperties = await this.requestInternal(requestProperties);
      this.checkForErrors(requestProperties, responseProperties);
      return responseProperties;
    }
    async requestInternal(properties) {
      // set authorization header
      this.setBasicAuth(properties);

      // no csrf -> fire plain request
      if (!this.csrf) {
        return await this.requestPlain(properties);
      }

      // if csrf fetch request is not set -> treat first request as csrf fetch request
      if (!this.csrfFetchRequest) {
        this.csrfFetchRequest = properties;
      }

      // main request with csrf renew if neccessary
      return await this.requestWithCsrf(properties, true);
    }
    saveCookies(properties) {
      const setCookieHeaders = properties?.headers["set-cookie"];
      if (!setCookieHeaders) {
        return;
      }
      for (const setCookieHeader of setCookieHeaders) {
        const parts = setCookieHeader.split(";");
        if (parts.length === 0) {
          continue;
        }
        const setPart = parts[0];
        const assignmentOperatorIndex = setPart.indexOf("=");
        if (assignmentOperatorIndex < 0) {
          continue;
        }
        const name = setPart.slice(0, assignmentOperatorIndex).trim();
        if (name.length === 0) {
          continue;
        }
        const value = setPart.slice(assignmentOperatorIndex + 1).trim();
        if (value.length === 0) {
          continue;
        }
        this.cookieStore[name] = value;
      }
    }
    pasteCookies(properties) {
      const cookieEntries = Object.entries(this.cookieStore);
      if (cookieEntries.length === 0) {
        return;
      }
      properties.headers = properties.headers || {};
      properties.headers["Cookie"] = cookieEntries.map(([name, value]) => `${name}=${value}`).join(";");
    }
    addDefaultParameters(properties) {
      for (const [name, value] of Object.entries(this.defaultParameters)) {
        properties.parameters = properties.parameters || {};
        if (typeof properties.parameters[name] !== "undefined") {
          continue; // do not overwrite
        }
        properties.parameters[name] = value;
      }
    }
    applyErrorFormatters(requestProperties, responseProperties, error) {
      for (const errorFormatter of this.errorFormatters) {
        error = errorFormatter(requestProperties, responseProperties, error);
      }
      return error;
    }
    checkForErrors(requestProperties, responseProperties) {
      for (const errorFactory of this.errorFactories) {
        let error;
        try {
          error = errorFactory(requestProperties, responseProperties);
        } catch (e) {
          this.log.error(`ajax error factory raised exception ${e}`); // log and continue with next factory
        }
        if (error) {
          error = this.applyErrorFormatters(requestProperties, responseProperties, error);
          throw error;
        }
      }
    }
    async requestPlain(requestProperties) {
      this.addDefaultParameters(requestProperties);
      if (this.handleCookies) {
        this.pasteCookies(requestProperties);
      }
      requestProperties = this.applyRequestFormatters(requestProperties);
      let responseProperties = await request(requestProperties);
      responseProperties = this.applyResponseFormatters(requestProperties, responseProperties);
      if (this.handleCookies) {
        this.saveCookies(responseProperties);
      }
      return responseProperties;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.AjaxBaseClient = AjaxBaseClient;
  return __exports;
});
})();