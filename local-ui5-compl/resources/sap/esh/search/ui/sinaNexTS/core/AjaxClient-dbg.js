/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./AjaxBaseClient", "./Log", "./ajax", "./errors"], function (___AjaxBaseClient, ___Log, ___ajax, ___errors) {
  "use strict";

  const AjaxBaseClient = ___AjaxBaseClient["AjaxBaseClient"];
  const Log = ___Log["Log"];
  const applyResponseFormattersAndUpdateJSON = ___ajax["applyResponseFormattersAndUpdateJSON"];
  const InternalSinaError = ___errors["InternalSinaError"];
  /* eslint-disable @typescript-eslint/no-this-alias */
  var RecordingMode = /*#__PURE__*/function (RecordingMode) {
    RecordingMode["NONE"] = "none";
    RecordingMode["RECORD"] = "record";
    RecordingMode["REPLAY"] = "replay";
    return RecordingMode;
  }(RecordingMode || {});
  class AjaxClient extends AjaxBaseClient {
    records;
    recordOptions;
    replayResponseFormatters = [];
    constructor(properties) {
      super(properties);
      this.log = new Log("ajax client");
      this.recordOptions = {
        headers: properties.recordingHeaders,
        mode: properties.recordingMode ?? RecordingMode.NONE,
        path: properties.recordingPath,
        requestNormalization: properties.requestNormalization || this.defaultRequestNormalization
      };
      if (typeof window !== "undefined" && this.recordOptions.mode !== RecordingMode.NONE) {
        throw new InternalSinaError({
          message: "Record/Replay is only supported on Node.js"
        });
      }
      this.records = {};
      if (this.recordOptions.mode === RecordingMode.REPLAY) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        this.records = require(properties.recordingPath);
      }
      this.authorization = undefined;
      if (properties.authorization) {
        this.authorization = {
          user: properties.authorization.user,
          password: properties.authorization.password
        };
      }
      this.replayResponseFormatters = properties.replayResponseFormatters ?? [];
    }
    createUrlMatchingReplayResponseFormatter(url, formatter) {
      const replayResponseFormatter = (requestProperties, responseProperties) => {
        if (requestProperties.url.indexOf(url) !== 0) {
          return responseProperties;
        }
        return formatter(requestProperties, responseProperties);
      };
      this.addReplayResponseFormatter(replayResponseFormatter);
      return {
        delete: () => this.removeReplayResponseFormatter(replayResponseFormatter)
      };
    }
    addReplayResponseFormatter(formatter) {
      this.replayResponseFormatters.push(formatter);
    }
    removeReplayResponseFormatter(formatter) {
      const index = this.replayResponseFormatters.indexOf(formatter);
      if (index >= 0) {
        this.replayResponseFormatters.splice(index);
      }
    }
    applyReplayResponseFormatters(request, response) {
      return applyResponseFormattersAndUpdateJSON(request, response, this.replayResponseFormatters);
    }
    async requestInternal(requestProperties) {
      if (this.recordOptions.mode === "replay") {
        let replayResponse = await this.replay(requestProperties);
        replayResponse = this.applyReplayResponseFormatters(requestProperties, replayResponse);
        return replayResponse;
      }
      const responseProperties = await super.requestInternal(requestProperties);
      if (this.recordOptions.mode === "record") {
        await this.record(requestProperties, responseProperties);
      }
      return responseProperties;
    }
    normalizeRequestData(data) {
      if (!data) {
        return {
          data: "",
          notToRecord: false
        };
      }
      const normalizedJsonData = this.recordOptions.requestNormalization(JSON.parse(data));
      if (typeof normalizedJsonData === "object" && normalizedJsonData["NotToRecord"]) {
        return {
          data: "",
          notToRecord: true
        };
      }
      return {
        data: JSON.stringify(normalizedJsonData),
        notToRecord: false
      };
    }
    calculateKey(request) {
      const normalizationResult = this.normalizeRequestData(request.data);
      if (normalizationResult.notToRecord) {
        return;
      }
      return request.url + normalizationResult.data;
    }
    async record(request, response) {
      const key = this.calculateKey(request);
      response = JSON.parse(JSON.stringify(response)); // store copy
      delete response.dataJSON; // parsed JSON is not stored
      this.records[key] = response;
      await this.saveRecording(this.recordOptions.path, this.records);
    }
    async replay(requestProperties) {
      const key = this.calculateKey(requestProperties);
      let response = JSON.parse(JSON.stringify(this.records[key])); // return copy
      if (!response) {
        throw new InternalSinaError({
          message: "No recording found for request '" + key + "' in file " + this.recordOptions.path
        });
      }
      response = this.supportDeprecatedRecording(response);
      try {
        response.dataJSON = JSON.parse(response.data); // restore JSON
      } catch (e) {
        this.log.warn("Could not parse response data as JSON: " + response?.data + " (" + e + ")");
      }
      return response;
    }
    supportDeprecatedRecording(response) {
      if (response.statusText) {
        return response; // new format, no conversion
      }
      if (typeof response === "object") {
        return {
          status: 200,
          statusText: "OK",
          headers: {},
          data: JSON.stringify(response)
        }; // convert old to new format
      } else {
        return {
          status: 200,
          statusText: "OK",
          headers: {},
          data: response
        }; // convert old to new format
      }
    }
    async saveRecording(file, data) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      return new Promise((resolve, reject) => {
        fs.writeFile(file, JSON.stringify(data, null, 4), "utf8", error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
    defaultRequestNormalization(payload) {
      if (payload === null) {
        return "";
      }
      if (typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "SessionID")) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete payload.SessionID;
      }
      if (typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "SessionTimestamp")) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete payload.SessionTimestamp;
      }
      return payload;
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.RecordingMode = RecordingMode;
  __exports.AjaxClient = AjaxClient;
  return __exports;
});
})();