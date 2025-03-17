/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/ui/base/Object"], function (BaseObject) {
  "use strict";

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  var methods = /*#__PURE__*/function (methods) {
    methods["GET"] = "GET";
    methods["POST"] = "POST";
    methods["PUT"] = "PUT";
    methods["PATCH"] = "PATCH";
    methods["DELETE"] = "DELETE";
    methods["HEAD"] = "HEAD";
    return methods;
  }(methods || {});
  /**
   * Represents a multipart request.
   */
  class MultiPartRequest {
    batchRequests = [];
    /**
     * Creates a MultiPartRequest object.
     *
     * @param {string} url - The URL for the multipart request.
     * @constructor
     */
    constructor(url, csrfToken) {
      this.url = encodeURI(url);
      this.boundary = `batch_id_${Date.now()}_01`;
      this.options = {
        headers: {
          "Content-Type": `multipart/mixed;boundary=${this.boundary}`
        },
        method: methods.GET
      };

      // Add CSRF token to headers if available
      if (csrfToken) {
        this.options.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    /**
     * Constructs the body for the multipart request.
     *
     * @returns {string} - The constructed body.
     * @private
     */
    _constructBody() {
      const BOUNDARY = `--${this.boundary}`;
      const REQUEST_HEADERS = `Content-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n`;
      const REQUEST_BODY = `Accept: application/json\r\n\r\n\r\n`;
      let body = `${BOUNDARY}\r\n`;
      for (let index = 0; index < this.batchRequests.length; index++) {
        const request = this.batchRequests[index];
        const boundaryEnd = index === this.batchRequests.length - 1 ? "--\r\n" : "\r\n";
        body += `${REQUEST_HEADERS}\r\n`;
        body += `${request.options.method} ${request.url} HTTP/1.1\r\n${REQUEST_BODY}`;
        body += `${BOUNDARY}${boundaryEnd}`;
      }
      return body;
    }

    /**
     * Adds a request to the MultiPartRequest batch.
     *
     * @public
     * @param {Object} request - The request to add to the batch.
     */
    addRequest(request) {
      this.batchRequests.push(request);
    }
  }

  /**
   * Parses multipart body response and returns an array of values called in the batch request.
   *
   * @param {string} value - Multipart body response.
   * @returns {Object[]} - Array of values in the multipart request.
   * @returns {Object[]} - An array of values in the multipart request.
   */
  const getDataFromRawValue = function (value) {
    const parsedValue = value.split("\r\n").filter(data => data !== "");
    const finalData = [];
    let contentTypeValue = "";
    for (let index = 1; index < parsedValue.length - 1; index++) {
      contentTypeValue = parsedValue[index].includes("Content-Type: ") ? parsedValue[index].split("Content-Type: ")[1] : contentTypeValue;
      if (parsedValue[index + 1].includes(parsedValue[0])) {
        if (contentTypeValue === "application/json") {
          finalData.push(JSON.parse(parsedValue[index]));
        } else {
          finalData.push(parsedValue[index]);
        }
      }
    }
    return finalData;
  };

  /**
   * Fetches the CSRF token from the specified base URL.
   *
   * @async
   * @param {string} baseURL - The base URL to fetch the CSRF token from.
   * @returns {Promise<string>} A Promise that resolves when all batch requests are completed. A promise that resolves to the CSRF token.
   * @throws {Error} An error if the CSRF token cannot be fetched.
   */
  const fetchCSRFToken = function (baseURL) {
    try {
      return Promise.resolve(_catch(function () {
        return Promise.resolve(fetch(baseURL, {
          method: methods.HEAD,
          headers: {
            "X-CSRF-Token": "Fetch"
          }
        })).then(function (response) {
          if (response.ok) {
            const token = response.headers.get("X-CSRF-Token");
            if (token) {
              return token;
            }
          }
          throw new Error("Cannot fetch X-CSRF-Token.");
        });
      }, function (error) {
        throw new Error(error.message);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   *
   * Helper class for managing batch requests.
   *
   * @extends BaseObject
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.utils.BatchHelper
   */
  const BatchHelper = BaseObject.extend("sap.cux.home.utils.BatchHelper", {
    /**
     * Fetches data from a multipart request.
     *
     * @private
     * @param {MultiPartRequest} multiPartRequest - The multipart request object.
     * @returns {Promise<Array<string | object>>} - A promise that resolves to the data from the request.
     */
    fetchData: function _fetchData(multiPartRequest) {
      try {
        const _this = this;
        multiPartRequest.options.body = multiPartRequest._constructBody();
        multiPartRequest.options.method = methods.POST;
        return Promise.resolve(fetch(_this.url, multiPartRequest.options)).then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to fetch data from the server.");
          }
          return Promise.resolve(response.text()).then(getDataFromRawValue);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Builds a multipart request from an array of URLs.
     *
     * @private
     * @param {string[]} urls - An array of URLs for individual requests.
     * @returns {MultiPartRequest} - The multipart request object.
     */
    buildMultipartRequest: function _buildMultipartRequest(urls, csrfToken) {
      // create base request from first URL
      const request = new MultiPartRequest(urls[0], csrfToken);

      // Add all URLs as sub-requests
      urls.forEach(url => {
        request.addRequest(new MultiPartRequest(url, csrfToken));
      });
      return request;
    }
  });
  /**
   * Creates a multipart batch request with multiple URLs.
   *
   * @public
   * @param {string} baseURL - The base URL for creating the batch request.
   * @param {string[]} urls - An array of URLs for individual requests.
   * @returns {Promise<Array<string | object>>} - A promise that resolves to the data from the batch request.
   */
  BatchHelper.createMultipartRequest = function createMultipartRequest(baseURL, urls) {
    try {
      if (!BatchHelper.Instance) {
        BatchHelper.Instance = new BatchHelper();
      }
      BatchHelper.Instance.url = `${baseURL}$batch`;
      return Promise.resolve(fetchCSRFToken(baseURL)).then(function (csrfToken) {
        const request = BatchHelper.Instance.buildMultipartRequest(urls, csrfToken);
        return Promise.resolve(BatchHelper.Instance.fetchData(request));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  return BatchHelper;
});
//# sourceMappingURL=BatchHelper-dbg-dbg.js.map
