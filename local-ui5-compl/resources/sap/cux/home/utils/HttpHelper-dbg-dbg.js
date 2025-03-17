/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/ui/base/Object", "./Constants"], function (Log, BaseObject, ___Constants) {
  "use strict";

  const REPO_BASE_URL = ___Constants["REPO_BASE_URL"];
  /**
   *
   * @class Provides the HttpHelper Class used for Get and Post Calls.
   *
   * @extends sap.ui.BaseObject
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121.0
   *
   * @private
   * @experimental Since 1.121
   * @hidden
   *
   * @alias sap.cux.home.util.HttpHelper
   */
  class AppManager extends BaseObject {
    constructor() {
      super();
    }

    /**
     * Fetches the CSRF Token
     * @returns {Promise<string | void>} Promise that resolves with the CSRF Token
     */
    static fetchCSRFToken() {
      return fetch(REPO_BASE_URL, {
        method: "HEAD",
        headers: {
          "X-CSRF-Token": "Fetch"
        }
      }).then(response => {
        const token = response.headers.get("X-CSRF-Token");
        if (response.ok && token) {
          return token;
        }
        throw new Error("Cannot fetch X-CSRF-Token.");
      }).catch(error => {
        Log.error(error.message);
      });
    }

    /**
     * Post Method
     * @param {string} url - The URL to post to
     * @param {object} payload - The payload to post
     * @returns {Promise<unknown>} Promise that resolves with the response
     */
    static Post(url, payload) {
      return AppManager.fetchCSRFToken().then(csrfToken => {
        return fetch(url, {
          method: "POST",
          headers: {
            "X-CSRF-Token": csrfToken,
            "content-type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      }).then(response => {
        return response.json();
      }).catch(error => {
        Log.error(error.message);
      });
    }

    /**
     * Get Method for JSON Data
     * @param {string} url - The URL to get from
     * @returns {Promise<unknown>} Promise that resolves with the JSON data response
     */
    static GetJSON(url) {
      return fetch(url).then(response => {
        return response.json();
      }).catch(error => {
        Log.error(error.message);
      });
    }
  }
  return AppManager;
});
//# sourceMappingURL=HttpHelper-dbg-dbg.js.map
