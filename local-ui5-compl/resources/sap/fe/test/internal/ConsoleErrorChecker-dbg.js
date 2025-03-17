/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  function wrapPatterns(pattern) {
    if (pattern instanceof RegExp) {
      return message => message.match(pattern) !== null;
    } else {
      return message => message.includes(pattern);
    }
  }

  /**
   * List of error message patterns that are always accepted.
   */
  const GLOBALLY_ACCEPTED_ERRORS = [/library-preload\.(json|js)/,
  // accept errors related to files that are not there when running from source to prevent false positives
  "/resources/sap/fe/macros/manifest.json" // see above
  ].map(wrapPatterns);
  let ConsoleErrorChecker = /*#__PURE__*/function () {
    function ConsoleErrorChecker(window) {
      this.matchers = [];
      this.messages = [];
      this.observer = new MutationObserver(mutations => {
        const opaFrame = mutations.reduce((iFrame, mutation) => {
          if (iFrame !== null) {
            return iFrame;
          }
          for (const node of Array.from(mutation.addedNodes)) {
            if (node instanceof Element) {
              const element = node.querySelector("#OpaFrame");
              if (element instanceof HTMLIFrameElement && element.contentWindow) {
                return element;
              }
            }
          }
          return iFrame;
        }, null);
        if (opaFrame && opaFrame.contentWindow) {
          this.prepareWindow(opaFrame.contentWindow);
        }
      });
      QUnit.moduleStart(() => {
        this.observer.observe(window.document.body, {
          childList: true
        });
      });
      QUnit.moduleDone(() => {
        this.observer.disconnect();
      });
      QUnit.testStart(() => {
        this.reset();
      });
      QUnit.log(() => {
        this.handleFailedMessages();
      });
      this.karma = window.__karma__;

      // either go for Karma config option "ui5.config.strictConsoleErrors" or use URL query parameter "strict"
      const search = new URLSearchParams(window.location.search);
      const urlParam = search.get("strictConsoleErrors");
      if (urlParam !== null) {
        this.isStrict = urlParam === "true";
      } else {
        this.isStrict = this.karma?.config.ui5?.config.strictconsoleerrors ?? false;
      }
      this.reset();
    }
    var _proto = ConsoleErrorChecker.prototype;
    _proto.handleFailedMessages = function handleFailedMessages() {
      const failedMessages = this.messages;
      this.messages = [];
      if (failedMessages.length > 0) {
        QUnit.assert.pushResult({
          result: false,
          source: "FE Console Log Check",
          message: `There were ${failedMessages.length} unexpected console errors`,
          actual: failedMessages,
          expected: []
        });
      }
    };
    _proto.reset = function reset() {
      this.messages = [];

      // this sets the default to apply if no allowed patterns are set via setAcceptedErrorPatterns().
      if (this.isStrict) {
        this.matchers = GLOBALLY_ACCEPTED_ERRORS;
      } else {
        this.matchers = [() => true];
      }
    };
    _proto.setAcceptedErrorPatterns = function setAcceptedErrorPatterns(patterns) {
      if (!patterns || patterns.length === 0) {
        this.matchers = GLOBALLY_ACCEPTED_ERRORS;
      } else {
        this.matchers = patterns.map(wrapPatterns).concat(GLOBALLY_ACCEPTED_ERRORS);
      }
    };
    _proto.checkAndLog = function checkAndLog(type) {
      for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }
      // only check the error messages
      if (type === "error") {
        const messageText = data[0];
        const isAllowed = this.matchers.some(matcher => matcher(messageText));
        if (!isAllowed) {
          this.messages.push(messageText);
        }
      }
      if (this.karma) {
        // wrap the data to facilitate parsing in the backend
        const wrappedData = data.map(d => [d]);
        this.karma.log(type, wrappedData);
      }
    };
    _proto.prepareWindow = function prepareWindow(window) {
      var _this = this;
      const console = window.console;

      // capture console.log(), console.debug(), etc.
      const patchConsoleMethod = method => {
        const fnOriginal = console[method];
        console[method] = function () {
          for (var _len2 = arguments.length, data = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            data[_key2] = arguments[_key2];
          }
          _this.checkAndLog(method, ...data);
          return fnOriginal.apply(console, data);
        };
      };
      patchConsoleMethod("log");
      patchConsoleMethod("debug");
      patchConsoleMethod("info");
      patchConsoleMethod("warn");
      patchConsoleMethod("error");

      // capture console.assert()
      // see https://console.spec.whatwg.org/#assert
      console.assert = function () {
        let condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        if (condition) {
          return;
        }
        const message = "Assertion failed";
        for (var _len3 = arguments.length, data = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          data[_key3 - 1] = arguments[_key3];
        }
        if (data.length === 0) {
          data.push(message);
        } else {
          let first = data[0];
          if (typeof first !== "string") {
            data.unshift(message);
          } else {
            first = `${message}: ${first}`;
            data[0] = first;
          }
        }
        console.error(...data);
      };

      // capture errors
      function onPromiseRejection(event) {
        const message = `UNHANDLED PROMISE REJECTION: ${event.reason}`;
        this.checkAndLog("error", message, event.reason?.stack);
      }
      function onError(event) {
        const message = event.message;
        this.checkAndLog("error", message, event.filename);
      }
      window.addEventListener("error", onError.bind(this), {
        passive: true
      });
      window.addEventListener("unhandledrejection", onPromiseRejection.bind(this), {
        passive: true
      });
    };
    ConsoleErrorChecker.getInstance = function getInstance(window) {
      // the global instance is needed to support multiple tests in a row (in Karma)
      if (!window.sapFEConsoleErrorChecker) {
        window.sapFEConsoleErrorChecker = new ConsoleErrorChecker(window);
      }
      return window.sapFEConsoleErrorChecker;
    };
    return ConsoleErrorChecker;
  }();
  return ConsoleErrorChecker.getInstance(window);
}, false);
//# sourceMappingURL=ConsoleErrorChecker-dbg.js.map
