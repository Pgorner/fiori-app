/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["sap/base/Log", "sap/m/MessageBox", "sap/ui/core/library", "sap/ui/core/message/MessageType", "../i18n", "./errors", "../sinaNexTS/core/errors"], function (Log, MessageBox, sap_ui_core_library, MessageType, __i18n, ___errors, ___sinaNexTS_core_errors) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const TextDirection = sap_ui_core_library["TextDirection"];
  const i18n = _interopRequireDefault(__i18n);
  const ESHUIError = ___errors["ESHUIError"];
  const DataSourceAttributeMetadataNotFoundError = ___sinaNexTS_core_errors["DataSourceAttributeMetadataNotFoundError"];
  const ServerError = ___sinaNexTS_core_errors["ServerError"];
  const ServerErrorCode = ___sinaNexTS_core_errors["ServerErrorCode"];
  const SinaError = ___sinaNexTS_core_errors["SinaError"];
  /**
   * This ErrorHandler is used to handle thrown instances of ESHUIError.
   * The default implementation will log the error stack to the console
   * and will also show the error message to the user in a popup window.
   */
  class ErrorHandler {
    label; // label of this instance, used as logging prefix
    searchModel;
    static instance;
    externalOnErrorHandler;
    _oLogger = (() => Log.getLogger("sap.esh.search.ui.error.ErrorHandler"))();
    static getInstance(properties) {
      if (!ErrorHandler.instance) {
        ErrorHandler.instance = new ErrorHandler(properties);
      }
      return ErrorHandler.instance;
    }
    constructor(properties) {
      this.label = properties?.label;
      this.searchModel = properties?.model;
      this.externalOnErrorHandler = properties?.onErrorHandler;
    }

    /**
     * Will call the default error handler. The default implementation will
     * print error details to the console and shows an error message to the user.
     * @param error instance of error which happened
     * @returns void
     */
    onError(error, options) {
      if (typeof this.externalOnErrorHandler === "function") {
        try {
          this.externalOnErrorHandler(error, options);
        } catch (e) {
          this.handleError(e, options);
        }
      } else {
        this.handleError(error, options);
      }
    }

    /**
     * Will call the default error handler and then returns a resolved promise which
     * allows to continue with a registered .then() method.
     * The default implementation will
     * print error details to the console and shows an error message to the user.
     * @param error instance of error which happened
     * @returns Promise<true>
     */
    onErrorDeferred(error, options) {
      this.onError(error, options);
      return Promise.resolve(true);
    }
    handleError(error, options) {
      // log error in console
      this.logError(error);
      // show error in UI (message popup)
      this.showError(error, options);
    }
    setSearchModel(model) {
      this.searchModel = model;
    }
    setExternalOnErrorHandler(onErrorHandler) {
      this.externalOnErrorHandler = onErrorHandler;
    }
    getErrorTextGeneric(error) {
      // name
      let logMessage = error.name;
      // toString
      logMessage += " " + error;
      // stack
      if (typeof error.stack !== "undefined") {
        logMessage = "\n" + error.stack;
      }
      // previous
      if (error.previous instanceof Error) {
        logMessage += `\n--> Previous error was: ${this.getErrorText(error.previous)}`;
      }
      return logMessage;
    }
    getErrorTextEsh(error) {
      // name
      let logMessage = error.name;
      // code
      if (error instanceof ServerError) {
        logMessage += " code:" + error.code;
      }
      // message
      logMessage += " " + error.message;
      // details
      if (error?.details) {
        logMessage += "\n" + error.details;
      }
      // solution
      if (error?.solution) {
        logMessage += "\n" + error.solution;
      }
      // stack
      if (typeof error.stack !== "undefined") {
        logMessage += "\n" + error.stack;
      }
      // previous
      if (error.previous instanceof Error) {
        logMessage += `\n--> Previous error was: ${this.getErrorText(error.previous)}`;
      }
      return logMessage;
    }
    getErrorText(error) {
      if (error instanceof SinaError || error instanceof ESHUIError) {
        return this.getErrorTextEsh(error);
      } else {
        return this.getErrorTextGeneric(error);
      }
    }
    logError(error) {
      // error to string
      let logMessage = this.label ? this.label + ": " : "";
      logMessage += this.getErrorText(error) + "\n";
      // add debug info
      if (this.searchModel && this.searchModel.sinaNext) {
        logMessage += this.searchModel.sinaNext.getDebugInfo() + "\n";
      }
      // write into log
      this._oLogger.error(logMessage, "ErrorHandler");
    }
    convertErrorToMessage(error, options) {
      if (error instanceof ESHUIError || error instanceof SinaError) {
        return this.convertErrorToMessageEsh(error, options);
      } else {
        return this.convertErrorToMessageGeneric(error);
      }
    }
    convertErrorToMessageGeneric(error) {
      let title, description;
      switch (error.name) {
        case "TypeError":
          title = i18n.getText("error.TypeError.message");
          description = i18n.getText("error.TypeError.solution");
          break;
        case "URIError":
          title = i18n.getText("searchError");
          description = i18n.getText("error.URIError.solution");
          break;
        default:
          title = "" + error;
          description = "";
      }
      return {
        title,
        description,
        type: MessageType.Error
      };
    }
    convertErrorToMessageEsh(error, options) {
      // handle reload errors
      if (error instanceof ServerError && error.code === ServerErrorCode.E300 || error instanceof DataSourceAttributeMetadataNotFoundError) {
        this.showReloadPopup();
        return null;
      }

      // type
      let type = MessageType.Error;
      if (options?.showMinorErrorsAsWarnings) {
        switch (error.name) {
          case "ServerError":
            switch (error.code) {
              case ServerErrorCode.E100:
                // The search result is incomplete because some search connectors are temporary not available.
                type = MessageType.Warning;
                break;
              case ServerErrorCode.E400:
                //	Duplicate search result list items
                type = MessageType.Warning;
                break;
            }
        }
      }

      // title
      const title = error.message || i18n.getText("searchError");

      // description
      const description = [];
      if (error.details) {
        description.push(error.details);
      }
      if (error.solution) {
        description.push(error.solution);
      }
      let code = "";
      if (error.name === "ServerError") {
        code = " " + error.code;
      }
      description.push("(" + error.name + code + ")");
      return {
        title: title,
        description: description.join("\n"),
        type: type
      };
    }
    showReloadPopup() {
      MessageBox.confirm(i18n.getText("searchModelChanged"), {
        onClose: event => {
          if (event === "OK") {
            if (this.searchModel) {
              this.searchModel.resetDataSource(false);
              this.searchModel.resetAllFilterConditions(false);
              const reloadNavigationTarget = this.searchModel.createSearchNavigationTargetCurrentState();
              window.location.href = reloadNavigationTarget.targetUrl;
            }
            window.location.reload();
          }
        }
      });
    }
    showMessageBox(message) {
      const text = message.title + "\n" + message.description;
      const props = {
        onClose: null,
        styleClass: "",
        initialFocus: null,
        textDirection: TextDirection.Inherit
      };
      switch (message.type) {
        case MessageType.Information:
          MessageBox.information(text, props);
          break;
        case MessageType.Warning:
          MessageBox.warning(text, props);
          break;
        case MessageType.Error:
          MessageBox.error(text, props);
          break;
        default:
          MessageBox.error(text, props);
          break;
      }
    }
    showError(error, options) {
      const message = this.convertErrorToMessage(error, options);
      if (!message) {
        return;
      }
      if (this.searchModel) {
        // display in message popover
        this.searchModel.pushUIMessage(message);
      } else {
        // display in raw message box
        this.showMessageBox(message);
      }
    }
  }
  return ErrorHandler;
});
})();