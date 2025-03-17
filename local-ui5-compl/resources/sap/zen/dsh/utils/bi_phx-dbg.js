/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, require */
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/zen/dsh/utils/dispatcher",
    "sap/sac/df/firefly/library"
  ],
  function( jQuery, Log, Dispatcher ){
    Log.info("Load bi_mobile_util");
    sap.zen.dsh.sapbi_showUI5Measures = false;
    sap.zen.dsh.sapbi_statisticsStepCounter = 0;

    sap.zen.dsh.sapbi_zen_recordrequests = false;
    sap.zen.dsh.sapbi_dummy = {};
    sap.zen.dsh.sapbi_zen_slvLoaded = true;

    sap.zen.dsh.sapbi_getslv = function () {
      return sap.zen.dsh.sapbi_dummy;
    };

    sap.zen.dsh.sapbi_loadUi5 = function(includeURL, attributes) {
      function onInit() {
        if (sap.zen.dsh.sapbi_isMobile === true) {
          jQuery.sap.initMobile({
            "preventScroll" : true,
            //Design Studio already adds viewport tag - so stop UI5 adding another one
            //Viewport handling needs to be revisited for 1.7
            "viewport" : false
          });
        }
        sap.ui.getCore().getLibraryResourceBundle("sap.ui.core");
        function _continue() {
          if (! sap.ui.getCore().isThemeApplied() ) {
            setTimeout(_continue, 100);
          } else {
            if (sap.ui.loader && !require.config) {
              sap.ui.loader.config({noConflict: true});
            }
            Dispatcher.resumeDispatching();
          }
        }
        _continue();
      }
      if(!sap.ui || !sap.ui.core){
        Dispatcher.pauseDispatching();
        window["sap-ui-config"] = {
          onInit: onInit
        };


        var se = document.createElement("script");
        se.type = "text/javascript";
        se.src = includeURL;
        se.charset = "utf-8";
        se.async = false;
        for (var attribute in attributes) {
          if(Object.prototype.hasOwnProperty.call(attributes, attribute) ) {
            se.setAttribute(attribute, attributes[attribute]);
          }
        }
        se.setAttribute("data-sap-ui-xx-bindingSyntax", "complex");  // Usefull for SAPUI5 binding having multiple bindings per property
        document.getElementsByTagName("head")[0].appendChild(se);
      }
    };

    function sapbi_snippet(json, tag) {
      if (Dispatcher.isPaused(function() {
        sapbi_snippet(json, tag);
      })){
        return;
      }

      var callback = function() {
        sap.zen.dsh.sapbi_registerHandlers(arguments);
        sap.zen.dsh.sapbi_phx(tag, eval("(" + json + ")"));
      };
      Log.error("Unexpected require call");
      require(sap.zen.dsh.sapbi_page.m_required, callback);
    }

    sap.zen.dsh.sapbi_snippet_ROOT = function (json) {
      sapbi_snippet(json, "sapbi_snippet_ROOT");
    };

    sap.zen.dsh.sapbi_snippet_ROOT_DIALOG  =function (json) {
      sapbi_snippet(json, "sapbi_snippet_ROOT_DIALOG");
    };

    sap.zen.dsh.sapbi_registerHandlers = function (modules) {
      for(var i=0; i<modules.length; i++) {
        var module = modules[i];
        if (module && module.getType) {
          if (module.getDecorator) {
            Dispatcher.addHandlers(module.getType(), module, module.getDecorator());
          } else {
            Dispatcher.addHandlers(module.getType(), module);
          }
        }
      }
    };
    function sapbi_phx_process_json(divid, json) {
      var addToDivFunc = function(oRootGrid) {
        oRootGrid.placeAt(divid, "only");
      };
      Dispatcher.dispatch(json, addToDivFunc);
      sap.zen.dsh.getLoadingIndicator().hide();
    }
    sap.zen.dsh.iNumberOfJavascriptErrorsLogged = 0;
    sap.zen.dsh.iMaxNumberOfJavascriptErrorsLogged = 10;
    function AsyncHandleJavascriptError(message) {

      if (sap.zen.dsh.sapbi_page.m_hasSendLock) {
        window.setTimeout(function() {
          AsyncHandleJavascriptError(message);
        }, 100);
        return;
      }
      sap.zen.MessageViewHandler.createMessage(
        sap.zen.MessageViewHandler.error, message,
        "Please contact your application designer"
      );
      sap.zen.MessageViewHandler.logMessage(sap.zen.MessageViewHandler.error, "A JavaScript error occurred", message);
    }

    sap.zen.dsh.sapbi_phx = function (divid, json) {
      if (sap.zen.dsh.sapbi_page.m_profileMode) {
        jQuery.sap.measure.setActive(true);
      }

      var searchString = "SHOWDEBUGJSON";
      var url = window.location.search.indexOf(searchString);
      if (url !== -1 || sap.zen.dsh.sapbi_page.m_isDebugMode) {
        Dispatcher.logJson(json, (url !== -1), divid);
      }

      jQuery.sap.measure.start("zen dispatch", "dispatch");

      if (jQuery.browser.msie) {
        window.onerror = function(msg, url, linenumber, pos) {
          if (sap.zen.dsh.iNumberOfJavascriptErrorsLogged < sap.zen.dsh.iMaxNumberOfJavascriptErrorsLogged) {
            var currentFunction = "";
            try {
              // arguments.callee.caller does not work in strict mode - so let's do this in a "try/catch"
              currentFunction = arguments.callee.caller;
            } catch (e) {
              currentFunction = "Unknown function name (strict mode)";
            }

            var fn = currentFunction.toString();
            if (!url) {
              url = "N/A";
            }
            if (!linenumber) {
              linenumber = "N/A";
            }
            fn = (fn + "").replace(/\r/g, " ");
            fn = (fn + "").replace(/\n/g, " ");

            var message = "Error message: " + msg + " Line Number: " + linenumber + " Pos: " + pos + " Function: "
                + fn + " URL: " + url;

            // We log a detailed error in eclipse if available
            if (window.eclipse_sendZenUrl) {
              window.eclipse_sendZenUrl("zen://message?severity=E&message=" + message); // call browser function
              // injected by Eclipse code
            }

            // We log a detailed error in the log
            Log.error("A JavaScript error occurred. " + message);

            // We give a general error message to the user
            if (sap && sap.zen && sap.zen.MessageViewHandler) {
              AsyncHandleJavascriptError(message);
            }

            sap.zen.dsh.getLoadingIndicator().hide();
            sap.zen.dsh.iNumberOfJavascriptErrorsLogged++;
          }
          return false;
        };

        sapbi_phx_process_json(divid, json);
      } else {

        try {
          sapbi_phx_process_json(divid, json);
        } catch (e) {
          if (sap.zen.dsh.iNumberOfJavascriptErrorsLogged < sap.zen.dsh.iMaxNumberOfJavascriptErrorsLogged) {
            var message = "A JavaScript error occurred. ";
            if (typeof e === "string") {
              message += e;
            } else {
              message += e.message + " ";
              if (e.stack) {
                message += e.stack + " ";
              }
              if (e.sourceURL) {
                message += e.sourceURL + " ";
              }
              if (e.line) {
                message += e.line + " ";
              }
              if (e.lineNumber) {
                message += e.lineNumber + " ";
              }
            }

            message = (message + "").replace(/\r/g, " ");
            message = (message + "").replace(/\n/g, " ");

            // We log a detailed error in the log
            Log.error(message);


            if (sap.zen.designmode) {
              window.eclipse_logJavaScriptMessage(message, "error");
            }

            // We give a general error message to the user
            if (sap && sap.zen && sap.zen.MessageViewHandler) {
              sap.zen.dsh.sapbi_page.m_hasSendLock = false;
              sap.zen.MessageViewHandler.createMessage(
                sap.zen.MessageViewHandler.error, message,
                "Please contact your application designer"
              );
              sap.zen.MessageViewHandler.logMessage(
                sap.zen.MessageViewHandler.error,
                "A JavaScript error occurred", message
              );
            }

            // We at least kill the loading indicator, so the user can see the message and act.
            sap.zen.dsh.getLoadingIndicator().hide();
            sap.zen.dsh.iNumberOfJavascriptErrorsLogged++;
          }
        }
      }
      jQuery.sap.measure.end("zen dispatch");
    };

    if (typeof sap.zen.dsh.sapbi_ParameterList !== "undefined") {
      sap.zen.dsh.sapbi_ParameterList.prototype.getIndices = function(name) {
        var uppercase_name = name.toUpperCase();
        var p = [];
        var cnt = 0;
        var i;
        for (i in this.m_list[uppercase_name]) {
          if (!isNaN(i)) {
            var numValue = parseInt(i, 10);
            p[cnt++] = numValue;
          }
        }
        return p;
      };
    }
  }
);
