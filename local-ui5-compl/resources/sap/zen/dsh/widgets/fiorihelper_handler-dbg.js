/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/* eslint-disable no-undef */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "jquery.sap.global",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/base/security/encodeURL"
  ],
  function (Log, jQuery, BaseHandler, EncodeURL) {
    "use strict";
    var FioriHelperHandler = function () {
      BaseHandler.apply(this, arguments);

      var that = this;

      this.sCmdOnSetShellUrl = null;
      this.oAppState = null;

      this.aAllowedSemanticSources = [];
      this.aValidJumpTargets = [];

      this.sSelection = null;

      /**
       * Create the Control
       */
      this.create = function (oChainedControl, oControlProperties) {
        this.oAppState = null;
        this.sSelection = null;

        var lId = oControlProperties.id;
        var loControl = this.createDefaultProxy(lId);

        this.init(loControl, oControlProperties);
        loControl.setVisible(false);

        return loControl;
      };

      /**
       * Update the Control
       */
      this.update = function (oControl, oControlProperties) {
        this.init(oControl, oControlProperties);
        return oControl;
      };

      /**
       * Initialize Control (Create, Update)
       */
      this.init = function (oControl, oControlProperties) {
        if (oControlProperties) {
          this.sCmdOnSetShellUrl = oControlProperties.onSetShellUrlCommand;

          // Application Title
          if (oControlProperties.shellAppTitle) {
            this.setTitle(oControlProperties.shellAppTitle);
          }

          // Application State (should not be set on Initial Call)
          if (oControlProperties.appState) {
            this.setAppState(oControlProperties.appState, oControlProperties.hostUI5Control);
          }

          // Navigation Context
          if (oControlProperties.context) {
            this.setNavigationContext(oControlProperties.context, oControlProperties.hostUI5Control);
          }

          var lClientAction = oControlProperties.clientAction;
          if (lClientAction && lClientAction.length > 0) {
            if (lClientAction === "NAVIGATE_BACK") {
              this.navigateBack();
            } else if (lClientAction === "GET_SHELL_URL") {
              this.setShellUrl();
            } else if (lClientAction === "SET_APP_TITLE") {
              this.setTitle(oControlProperties.shellAppTitle);
            } else if (lClientAction === "SAVE_TILE") {
              this.saveTile(oControlProperties);
            } else if (lClientAction === "SEND_EMAIL") {
              this.sendEmail(oControlProperties);
            } else if (lClientAction === "FETCH_JUMP_TARGETS") {
              this.fetchJumpTargets(oControlProperties);
            } else if (lClientAction === "JUMP_TO") {
              this.jumpToTarget(oControlProperties);
            }
          }
        }
      };

      function getCrossAppNav() {
        return sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
      }

      function getShellNav() {
        return sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("ShellNavigation");
      }

      /**
       * Set Shell Url to Backend Control
       */
      this.setShellUrl = function () {
        if (this.sCmdOnSetShellUrl && this.sCmdOnSetShellUrl.length > 0) {
          sap.ushell.Container.getFLPUrlAsync(true).then(
            function (sUrl) {
              var lCommand = this.sCmdOnSetShellUrl;
              lCommand = that.prepareCommand(lCommand, "__URL__", sUrl);
              var loFunc = new Function(lCommand);
              loFunc();
            }.bind(this)
          );
        }
      };

      /**
       * Set Title
       */
      this.setTitle = function (sTitle) {
        sap.zen.dsh.sapbi_page && sap.zen.dsh.sapbi_page.appComponent && sap.zen.dsh.sapbi_page.appComponent.getService("ShellUIService").then(
          function (oShellUIService) {
            if (oShellUIService) {
              oShellUIService.setTitle(sTitle);
            }
          },
          function () {
            // silently do nothing in case the service is not present
          });
      };

      /**
       * Set Application State
       */
      this.setAppState = function (sAppState, sHostUI5Control) {
        if (sAppState) {
          var loHostUI5Control = sHostUI5Control && sap.ui.getCore().byId(sHostUI5Control);
          if (loHostUI5Control && loHostUI5Control.fireStateChange) {
            return loHostUI5Control.fireStateChange({
              state: sAppState
            });
          }

          // only possible within Fiori Shell
          if (!sap.zen.dsh.sapbi_page.appComponent) {
            return;
          }

          var loCrossAppNav = getCrossAppNav();
          var loShellNav = getShellNav();
          if (loShellNav) {
            if (this.oAppState) {
              var loExistingData = this.oAppState.getData();
              //Avoid overwriting with identical appState
              if (loExistingData && loExistingData.customData && loExistingData.customData.bookmarkedAppState === sAppState) {
                return;
              }
            }

            loCrossAppNav.createEmptyAppStateAsync(sap.zen.dsh.sapbi_page.appComponent).then(
              function (oAppState) {
                this.oAppState = oAppState;

                var loAppStateData = {
                  "customData": {
                    "bookmarkedAppState": sAppState
                  }
                };
                this.oAppState.setData(loAppStateData);
                this.oAppState.save();

                /**
                 * - oShellService.hashChanger.replaceHash("sap-iapp-state=" + this.oAppState.getKey());
                 *		No History is written
                 *		Refresh is triggered!
                 *		Back Button: goes to the initial Caller
                 * - oShellService.hashChanger.setHash("sap-iapp-state=" + this.oAppState.getKey());
                 *		No History is written
                 *		Refresh is not triggered on initial load
                 *		Back Button: goes through each hash created <<< ERROR
                 * - oShellService.toAppHash("sap-iapp-state=" + this.oAppState.getKey(), false);
                 * 		No History is written
                 * 		Refresh is triggered on initial load <<< ERROR
                 * 		Back Button: goes to the initial Caller
                 */
                loShellNav.hashChanger.toAppHash("sap-iapp-state=" + this.oAppState.getKey(), false);

                //On new state creation, the app hash would change so we need to capture this.
                this.setShellUrl();
              }.bind(this)
            );
            /*this.oAppState = loCrossAppNav.createEmptyAppState(sap.zen.dsh.sapbi_page.appComponent);
            var loAppStateData = {
              "customData": {
                "bookmarkedAppState": sAppState
              }
            };
            this.oAppState.setData(loAppStateData);
            this.oAppState.save();

            /**
             * - oShellService.hashChanger.replaceHash("sap-iapp-state=" + this.oAppState.getKey());
             *		No History is written
             *		Refresh is triggered!
             *		Back Button: goes to the initial Caller
             * - oShellService.hashChanger.setHash("sap-iapp-state=" + this.oAppState.getKey());
             *		No History is written
             *		Refresh is not triggered on initial load
             *		Back Button: goes through each hash created <<< ERROR
             * - oShellService.toAppHash("sap-iapp-state=" + this.oAppState.getKey(), false);
             * 		No History is written
             * 		Refresh is triggered on initial load <<< ERROR
             * 		Back Button: goes to the initial Caller
             */
            /*loShellNav.toAppHash("sap-iapp-state=" + this.oAppState.getKey(), false);
            //loShellNav.hashChanger.setHash("sap-iapp-state=" + this.oAppState.getKey());

            //On new state creation, the app hash would change so we need to capture this.
            this.setShellUrl();*/
          }
        }
      };

      /**
       * Set Navigation Context
       */
      this.setNavigationContext = function (oContext, sHostUI5Control) {
        var loHostUI5Control = sHostUI5Control && sap.ui.getCore().byId(sHostUI5Control);
        if (loHostUI5Control && loHostUI5Control.fireSelectionChange) {
          var lNewSelection = JSON.stringify(oContext);
          if (this.sSelection !== lNewSelection) {
            this.sSelection = lNewSelection;
            loHostUI5Control.fireSelectionChange({
              selection: this.createSelectionVariantObject(oContext)
            });
          }
        }
      };

      /**
       * Save Tile
       */
      this.saveTile = function (oControlProperties) {
        var loSaveTileButton = new sap.ushell.ui.footerbar.AddBookmarkButton({
          beforePressHandler: function () {
            if (oControlProperties.shellAppTitle) {
              loSaveTileButton.setTitle(oControlProperties.shellAppTitle);
            }
            if (oControlProperties.tile && oControlProperties.tile.subTitle) {
              loSaveTileButton.setSubtitle(oControlProperties.tile.subTitle);
            }
            if (oControlProperties.tile && oControlProperties.tile.info) {
              loSaveTileButton.setInfo(oControlProperties.tile.info);
            }
            // loSaveTileButton.setServiceRefreshInterval("10");
          }
        });
        loSaveTileButton.firePress();
      };

      /**
       * Send Email
       */
      this.sendEmail = function (oControlProperties) {
        var lDestination = oControlProperties.email && oControlProperties.email.destination;
        var lSubject = oControlProperties.email && oControlProperties.email.subject;
        var lMessage = oControlProperties.email && oControlProperties.email.text;
        sap.m.URLHelper.triggerEmail(lDestination, lSubject, lMessage);
      };

      /**
       * Navigate Back
       */
      this.navigateBack = function () {
        var loCrossAppNav = getCrossAppNav();
        if (loCrossAppNav) {
          loCrossAppNav.backToPreviousApp();
        }
      };

      /**
       * Fetch Jump Targets
       */
      this.fetchJumpTargets = function (oControlProperties) {
        // call this first to ensure we have the information before Context is modified
        this.getAllowedSemanticSources(oControlProperties);

        var loContext = oControlProperties.context;
        var loSelectionVariant = this.createSelectionVariantObject(loContext);

        var loParams = {}; //These will be passed as URL parameters -- extra info only.
        // add selection information
        this.addNameSelectionPairFromArray(loContext.selections, loParams);
        // dd filter information
        this.addNameSelectionPairFromArray(loContext.filter, loParams);
        // add variable information
        this.addNameSelectionPairFromArray(loContext.variables, loParams);

        var loCrossAppNav = getCrossAppNav();
        var lAppStateKey;
        if (loSelectionVariant !== undefined && sap.zen.dsh.sapbi_page && sap.zen.dsh.sapbi_page.appComponent) {
          var loAppState = loCrossAppNav.createEmptyAppState(sap.zen.dsh.sapbi_page.appComponent);
          var loAppStateData = {
            "selectionVariant": loSelectionVariant
          };
          loAppState.setData(loAppStateData);
          loAppState.save();
          lAppStateKey = loAppState.getKey();
        }

        this.getValidJumpTargets(loCrossAppNav, loParams, lAppStateKey, oControlProperties);
      };

      /**
       * Get Allowed Semantic Sources
       */
      this.getAllowedSemanticSources = function (oControlProperties) {
        this.aAllowedSemanticSources = [];

        if (oControlProperties.navigation && oControlProperties.navigation.allowedSemanticSources) {
          var lLength = oControlProperties.navigation.allowedSemanticSources.length;
          if (lLength && lLength > 0) {
            for (var i = 0; i < lLength; i++) {
              this.aAllowedSemanticSources.push(oControlProperties.navigation.allowedSemanticSources[i].entry.semanticName);
            }
          }
        }

        return this.aAllowedSemanticSources;
      };

      /**
       * Get Valid Jump Targets
       */
      this.getValidJumpTargets = function (oCrossAppNav, oParams, sAppStateKey, oControlProperties) {
        this.aValidJumpTargets = [];

        var ltLinks = [];
        this.aAllowedSemanticSources.forEach(function (sSemanticObject) {
          ltLinks.push([{
            semanticObject: sSemanticObject,
            params: oParams,
            ignoreFormFactor: false,
            ui5Component: sap.zen.dsh.sapbi_page.appComponent,
            appStateKey: sAppStateKey,
            compactIntents: false
          }]);
        });

        var lSelfLink = oCrossAppNav.hrefForAppSpecificHash("");
        if (lSelfLink) {
          var lIndex = lSelfLink.indexOf("?");
          lSelfLink = lSelfLink.substring(0, lIndex > 0 ? lIndex : lSelfLink.length - 2);
        }

        var ltIntents = [];
        oCrossAppNav.getLinks(ltLinks).done(
          function (tObjectLinks) {
            //Will return an array of arrays of arrays of links.
            tObjectLinks.forEach(function (tLinks) {
              tLinks[0].forEach(function (oLink) {
                if (oLink.text && oLink.intent && oLink.intent !== lSelfLink && oLink.intent.indexOf(lSelfLink + "?") !== 0) {
                  //Only take links which have a text and intent is not pointing to on the same app
                  ltIntents.push(oLink);
                }
              });
            });

            //Sort the complete list by text
            ltIntents.sort(function (a, b) {
              return a.text.localeCompare(b.text);
            });

            if (ltIntents && ltIntents.length > 0) {
              for (var i = 0; i < ltIntents.length; ++i) {
                var loIntent = ltIntents[i];
                this.aValidJumpTargets.push({
                  "text": loIntent.text,
                  "hash": loIntent.intent
                });
              }
            }

            if (oControlProperties.navigation && oControlProperties.navigation.onJumpTargetsFetchedCommand && oControlProperties.navigation.onJumpTargetsFetchedCommand.length > 0) {
              var lResultJSON = JSON.stringify(this.aValidJumpTargets);
              lResultJSON = EncodeURL(lResultJSON);

              var lMethod = that.prepareCommand(oControlProperties.navigation.onJumpTargetsFetchedCommand, "__JUMPTARGETS__", lResultJSON);
              var loFuncAction = new Function(lMethod);
              loFuncAction();
            }
          }.bind(this)
        );
      };

      /**
       * Jump to Target
       */
      this.jumpToTarget = function (oControlProperties) {
        if (!oControlProperties.navigation) {
          return;
        }

        var lJumpTarget = oControlProperties.navigation.jumpTarget;
        var loCrossAppNav = getCrossAppNav();
        if (loCrossAppNav && lJumpTarget && lJumpTarget.length > 0) {
          if (oControlProperties.navigation && oControlProperties.navigation.navigateInPlace) {
            loCrossAppNav.toExternal({
              target: {
                shellHash: lJumpTarget
              }
            });
          } else {
            window.open(lJumpTarget);
          }
        }
      };

      /**
       * Create Selection Variant Object
       */
      this.createSelectionVariantObject = function (oContext) {
        if (!oContext) {
          return;
        }

        // Mind the priorities after having added the main context information above:
        // first add filter information ...
        var loSelectionVariantObject = {};
        var loSelectOptions = this.getContextSelectOptions(oContext);
        if (loSelectOptions !== undefined) {
          loSelectionVariantObject.SelectOptions = loSelectOptions;
          loSelectionVariantObject.SelectionVariantID = new Date().toISOString();
          loSelectionVariantObject.Text = "Temporary Variant " + loSelectionVariantObject.SelectionVariantID;
          return loSelectionVariantObject;
        }
      };

      /**
       * Get Context Select Options
       */
      this.getContextSelectOptions = function (oContext) {
        var loSelectOptions = {};
        var ltSelectOptions = [];

        this.addSelectOptionsFromArray(oContext.selections, loSelectOptions);
        this.addSelectOptionsFromArray(oContext.filter, loSelectOptions);
        this.addSelectOptionsFromArray(oContext.variables, loSelectOptions);

        for (var lSelectOptionProperty in loSelectOptions) {
          if (Object.prototype.hasOwnProperty.call(loSelectOptions, lSelectOptionProperty)) {
            ltSelectOptions.push({
              "PropertyName": lSelectOptionProperty,
              "Ranges": loSelectOptions[lSelectOptionProperty]
            });
          }
        }

        if (ltSelectOptions.length > 0) {
          return ltSelectOptions;
        }
      };

      /**
       * Add Select Options from Array
       */
      this.addSelectOptionsFromArray = function (aSelectionArray, oSelectOptions) {
        if (aSelectionArray) {
          var iLength = aSelectionArray.length;
          if (iLength > 0) {
            for (var i = 0; i < iLength; i++) {
              var sName = aSelectionArray[i].dimension.name;

              if (sName && sName.length > 0 && !Object.prototype.hasOwnProperty.call(oSelectOptions, sName)) {
                if (aSelectionArray[i].dimension.selection) {
                  //Single string value, for single-value variable support.  Might be soon removable.
                  oSelectOptions[sName] = [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": aSelectionArray[i].dimension.selection,
                    "High": null
                  }];
                } else if (aSelectionArray[i].dimension.selections && aSelectionArray[i].dimension.selections.length > 0) {
                  //In selectoption format:  An array of individual range objects.
                  oSelectOptions[sName] = aSelectionArray[i].dimension.selections.map(function (selection) {
                    if (selection.LowType !== "DATE") {
                      return selection;
                    }
                    //clone object and "extend" the date
                    var to = {};
                    for (var nextKey in selection) {
                      if (Object.prototype.hasOwnProperty.call(selection, nextKey)) {
                        to[nextKey] = (nextKey === "Low" || nextKey === "High") && selection[nextKey] ? selection[nextKey] + "T00:00:00.000Z" : selection[nextKey];
                      }
                    }
                    return to;
                  });
                }
              }
            }
          }
        }
      };

      /**
       * Add Name Selection Pair from Array
       */
      this.addNameSelectionPairFromArray = function (aArray, oParams) {
        var sName, sSelection, aSelections;

        if (aArray && oParams) {
          var iLength = aArray.length;
          if (iLength > 0) {
            for (var i = 0; i < iLength; i++) {
              sName = aArray[i].dimension.name;
              if (sName && sName.length > 0 && !oParams[sName]) {
                //A single "selection" entry  means it's a variable value.
                sSelection = aArray[i].dimension.selection;
                if (sSelection && sSelection.length > 0) {
                  oParams[sName] = sSelection;
                } else {
                  //"selections" means it's in the format of an array of selection objects.
                  //Only single-value == comparisons will be taken here, as others are not possible to express in URL-parameters.
                  aSelections = aArray[i].dimension.selections;
                  if (aSelections && aSelections.length === 1 && aSelections[0].Sign && aSelections[0].Sign === "I" && aSelections[0].Option && aSelections[0].Option === "EQ") {
                    oParams[sName] = aSelections[0].Low === "#" ? "" : aSelections[0].Low;
                    if (aSelections[0].LowType === "DATE") {
                      oParams[sName] = oParams[sName] + "T00:00:00.000Z";
                    }
                  }
                }
              }
            }
          }
        }
      };

      /**
       * Get Default Proxy Class
       */
      this.getDefaultProxyClass = function () {
        return ["sap.m.Button", "sap.ui.commons.Button"];
      };

      /**
       * Get Type
       */
      this.getType = function () {
        return "fiorihelper";
      };
    };

    var instance = new FioriHelperHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);