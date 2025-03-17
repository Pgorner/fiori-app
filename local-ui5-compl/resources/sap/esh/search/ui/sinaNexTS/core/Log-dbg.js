/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
  "use strict";

  var Severity = /*#__PURE__*/function (Severity) {
    Severity[Severity["ERROR"] = 1] = "ERROR";
    Severity[Severity["WARN"] = 2] = "WARN";
    Severity[Severity["INFO"] = 3] = "INFO";
    Severity[Severity["DEBUG"] = 4] = "DEBUG";
    return Severity;
  }(Severity || {});
  /**
   * This is equivalent to:
   * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
   */
  class Log {
    static level = (() => Severity.ERROR)();
    static persistency = (() => console)();
    constructor(name = "default-log") {
      this.name = name;
    }
    debug(messageOrError) {
      this.printMessageOrError("DEBUG", messageOrError);
    }
    info(messageOrError) {
      this.printMessageOrError("INFO", messageOrError);
    }
    warn(messageOrError) {
      this.printMessageOrError("WARN", messageOrError);
    }
    error(messageOrError) {
      this.printMessageOrError("ERROR", messageOrError);
    }
    printMessageOrError(severity, messageOrError) {
      if (messageOrError instanceof Error) {
        if (messageOrError.stack) {
          this.printMessage(severity, messageOrError.stack);
        } else {
          this.printMessage(severity, messageOrError + "");
        }
      } else {
        this.printMessage(severity, messageOrError);
      }
    }
    printMessage(severity, text) {
      const num = Severity[severity];
      const msg = "[" + this.name + "]: " + text;
      if (num <= Log.level) {
        switch (num) {
          case Severity.DEBUG:
            {
              if (typeof Log.persistency.debug === "function") {
                Log.persistency.debug(msg);
                return;
              }
            }
            break;
          case Severity.INFO:
            {
              if (typeof Log.persistency.info === "function") {
                Log.persistency.info(msg);
                return;
              }
            }
            break;
          case Severity.WARN:
            {
              if (typeof Log.persistency.warn === "function") {
                Log.persistency.warn(msg);
                return;
              }
            }
            break;
          case Severity.ERROR:
            {
              if (typeof Log.persistency.error === "function") {
                Log.persistency.error(msg);
                return;
              }
            }
        }
        console.log(msg);
      }
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.Severity = Severity;
  __exports.Log = Log;
  return __exports;
});
})();