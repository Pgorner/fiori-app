/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/dsh/utils/BaseHandler"
  ],
  function (jQuery, BaseHandler) {
    "use strict";
    var ContextMenuHandler = function () {
      BaseHandler.apply(this, arguments);

      var that = this;

      this.aAllowedSemanticSources = [];
      this.oMenuItemToDialogJsonMap = {};

      /**
       * Create the Control
       */
      this.create = function (oChainedControl, oControlProperties) {
        var lId = oControlProperties.id;

        var loControl = this.createButton(lId);

        this.init(loControl, oControlProperties);
        loControl.setVisible(false);

        return loControl;
      };

      /**
       * Update the Control
       */
      this.update = function (oControl, oControlProperties) {
        if (!sap.zen.designmode && oControlProperties !== undefined) {
          // update may also be called when not actually invoked, e. g. when
          // a variable screen is invoked from the app and all components
          // on the page get updated
          if (!oControlProperties.entries) {
            return null;
          }

          this.aAllowedSemanticSources = [];

          if (oControlProperties.navigation) {
            if (oControlProperties.navigation.allowedSemanticSources) {
              var i = 0;
              var iLength = oControlProperties.navigation.allowedSemanticSources.length;
              if (iLength && iLength > 0) {
                for (i = 0; i < iLength; i++) {
                  this.aAllowedSemanticSources.push(oControlProperties.navigation.allowedSemanticSources[i].entry.semanticName);
                }
              }
            }
          }

          this.oMenuItemToDialogJsonMap = {};

          var ltEntries = oControlProperties.entries;
          if (oControlProperties.dialog === true && ltEntries) {
            var loEntry = ltEntries[0].entry;
            _openDialog(loEntry.dialog);
          } else {
            var loMenu = _createMenu(oControlProperties, ltEntries, "0");
            BaseHandler.dispatcher.registerContextMenu(loMenu);

            var eDock = sap.ui.core.Popup.Dock;
            if (loMenu.getItems().length > 0) {
              var lXCoord = that.clientX;
              if (sap.ui.getCore().getConfiguration().getRTL() === true) {
                lXCoord = jQuery(window).width() - that.clientX;
              }

              loMenu.open(
                false /* First item already highlighted */,
                oControl.getFocusDomRef(),
                /*
                 * Dom reference
                 * which gets the
                 * focus back when
                 * the menu is
                 * closed
                 */
                eDock.BeginTop,
                /*
                 * "Edge" of the menu (see
                 * sap.ui.core.Popup)
                 */
                eDock.BeginTop,
                /*
                 * "Edge" of the related opener
                 * position (see
                 * sap.ui.core.Popup)
                 */
                window,
                /*
                 * Related opener position (see
                 * sap.ui.core.Popup)
                 */
                "" + lXCoord + " " + that.clientY);

              _addJumpTargetsSubMenu(oControl, loMenu, oControlProperties.context, (oControlProperties.navigation && oControlProperties.navigation.onJumpToCommand) || "");
            }
          }
        }

        return oControl;
      };

      /**
       * Initialize Control (Create, Update)
       */
      this.init = function (oControl, oControlProperties) {
        if (!sap.zen.designmode) {
          // Attach click handler
          var loJqDocument = jQuery(document);
          loJqDocument.unbind("contextmenu");
          loJqDocument.bind("contextmenu", _handleContextMenuClick.bind(this, oControlProperties));
          loJqDocument.bind("keypress", function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == "13" && event.target && event.target.getBoundingClientRect) {
              var oRect = event.target.getBoundingClientRect();

              _handleContextMenuClick.apply(this, [oControlProperties, {
                clientX: oRect.left,
                clientY: oRect.top
              }]);
            }
          });
        }
      };

      this.getType = function () {
        return "contextmenu";
      };

      function _createMenu(oControlProperties, aEntries, sId) {
        var lMenuId = "menu" + sId;

        var loOldMenu = sap.ui.getCore().getControl(lMenuId);
        if (loOldMenu) {
          loOldMenu.destroyItems();
          loOldMenu.destroy();
        }

        var loMenu = that.createMenu(lMenuId);

        var lMenuItemId, loEntry, lEntryId;
        var lHasAtLeastOneEntry = false;
        if (aEntries) {
          for (var lEntryIndex = 0; lEntryIndex < aEntries.length; lEntryIndex++) {
            loEntry = aEntries[lEntryIndex].entry;
            lEntryId = sId + "-" + lEntryIndex;

            lMenuItemId = "item" + lEntryId;
            if (loEntry.key) {
              lMenuItemId = "CONTEXT_MENU_" + loEntry.key;
            }

            var oMenuItem = that.createMenuItem(lMenuItemId, {
              text: loEntry.text
            });

            if (loEntry.disabled) {
              oMenuItem.setEnabled(false);
            }

            if (loEntry.checked) {
              oMenuItem.setIcon("sap-icon://accept");
            }

            if (loEntry.onSelect) {
              oMenuItem.attachSelect(new Function(loEntry.onSelect));
            }

            if (loEntry.entries) {
              var oSubmenu = _createMenu(oControlProperties, loEntry.entries, lEntryId);
              oMenuItem.setSubmenu(oSubmenu);
            }

            if (loEntry.dialog) {
              that.oMenuItemToDialogJsonMap[lMenuItemId] = loEntry.dialog;
              oMenuItem.attachSelect(_openDialog.bind(that));
            }

            if (loEntry.startsSection && lHasAtLeastOneEntry) {
              oMenuItem.setStartsSection(true);
            }

            loMenu.addItem(oMenuItem);
            lHasAtLeastOneEntry = true;
          }
        }

        var lCssClass;
        if (oControlProperties.cssclass && oControlProperties.cssclass !== "") {
          lCssClass = oControlProperties.cssclass;
        }
        if (lCssClass) {
          loMenu.addStyleClass(lCssClass);
        }

        return loMenu;
      }

      function _addJumpTargetsSubMenu(oControl, oMenu, oContext, sNotifyFioriJumpCommand) {
        var aMappedDimensions = [];

        if (sap.ushell && sap.ushell.Container) {
          sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(
            function (oCrossApplicationService) {
              var aIntents = [];
              if (oContext.dimension && oContext.dimension.length > 0) {
                aMappedDimensions.push(oContext.dimension);
                if (jQuery.inArray(aMappedDimensions[0], that.aAllowedSemanticSources) === -1) {
                  return;
                }
              } else {
                // get all of them, e. g. when having clicked on a data cell
                aMappedDimensions = that.aAllowedSemanticSources;
              }

              // First create classic parameters. These are only for the actual click context, not the
              // existing filter context etc.
              // These will also be taken into account when creating the actual parameters for the
              // selection variant below.
              var oParams = fCreateParamsForContext(oContext);

              // Now create the selection variant, taking into account any overriding parameters
              var oSelectionVariant = fCreateSelectionVariantObject(oContext, oParams);

              // Now we can add the (redundant) selections to URL parameters.
              // first add filter information ...
              fAddNameSelectionPairFromArray(oContext.filter, oParams);

              // ... then add add variables
              fAddNameSelectionPairFromArray(oContext.variables, oParams);

              var sAppStateKey;

              // DSH.js ALWAYS creates sap.zen.dsh.sapbi_page. If later multiple DSH are allowed on one
              // page, this logic must change.
              if (oSelectionVariant !== undefined && sap.zen.dsh.sapbi_page && sap.zen.dsh.sapbi_page.appComponent) {
                var oAppState = oCrossApplicationService.createEmptyAppState(sap.zen.dsh.sapbi_page.appComponent);
                var oAppStateData = {
                  "selectionVariant": oSelectionVariant
                };
                oAppState.setData(oAppStateData);
                oAppState.save();
                sAppStateKey = oAppState.getKey();
              }

              var fNotifyFioriHelper = function (sShellHash) {
                if (sNotifyFioriJumpCommand && sNotifyFioriJumpCommand.length > 0) {
                  sNotifyFioriJumpCommand = sNotifyFioriJumpCommand.replace(
                    "__HASH__",
                    sShellHash
                  );
                  var fAction = new Function(sNotifyFioriJumpCommand);
                  fAction();
                  return true;
                }
                return false;
              };

              var aGetLinksArgs = [];
              aMappedDimensions.forEach(function (sSemanticObject) {
                aGetLinksArgs.push([{
                  semanticObject: sSemanticObject,
                  params: oParams,
                  ignoreFormFactor: false,
                  ui5Component: sap.zen.dsh.sapbi_page.appComponent,
                  appStateKey: sAppStateKey,
                  compactIntents: false
                }]);
              });

              var selfLink = oCrossApplicationService.hrefForAppSpecificHash("");
              if (selfLink) {
                var qm = selfLink.indexOf("?");
                selfLink = selfLink.substring(0, qm > 0 ? qm : selfLink.length - 2);
              }

              oCrossApplicationService.getLinks(aGetLinksArgs).done(function (paLinks) {
                //Will return an array of arrays of arrays of links.
                paLinks.forEach(function (aLinksForOneObject) {
                  aLinksForOneObject[0].forEach(function (oLink) {
                    if (oLink.text && oLink.intent && oLink.intent !== selfLink && oLink.intent.indexOf(selfLink + "?") !== 0) {
                      //Only take links which have a text and intent is not pointing to on the same app
                      aIntents.push(oLink);
                    }
                  });
                });

                //Sort the complete list by text
                aIntents.sort(function (a, b) {
                  return a.text.localeCompare(b.text);
                });

                if (aIntents && aIntents.length > 0) {
                  var sJumpMenuId = oMenu.getId() + "_JUMP_SUB";
                  // remove old submenu
                  var oOldJumpTargetsMenu = sap.ui.getCore().getControl(sJumpMenuId);
                  if (oOldJumpTargetsMenu) {
                    oOldJumpTargetsMenu.destroyItems();
                    oOldJumpTargetsMenu.destroy();
                  }
                  var oJumpTargetsMenu = null;

                  var idx;
                  var fSelect = function () {
                    if (sap.ushell && sap.ushell.Container) {
                      sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(
                        function (oCrossApplicationService) {
                          // request backend to create bookmark and trigger actual jump via fiori helper
                          if (!fNotifyFioriHelper(this.dsh_shellHash)) {
                            // In case there is no Fiori helper (non-updated App) jump directly.
                            oCrossApplicationService.toExternal({
                              target: {
                                shellHash: that.dsh_shellHash
                              }
                            });
                          }
                        }.bind(this)
                      );
                    }
                  };

                  for (idx = 0; idx < aIntents.length; ++idx) {
                    var oIntent = aIntents[idx];
                    if (!oMenu.bOpen) {
                      return null;
                    }
                    var sId = oControl.getId() + "_FIORINAV_" + idx;
                    var oMenuItemDynamic = sap.ui.getCore().getControl(sId);
                    if (!oMenuItemDynamic) {
                      oMenuItemDynamic = that.createMenuItem(sId, {
                        text: oIntent.text
                      });
                    } else {
                      oMenuItemDynamic.setText(oIntent.text);
                    }
                    oMenuItemDynamic.dsh_shellHash = oIntent.intent;

                    oMenuItemDynamic.attachSelect(fSelect.bind(oMenuItemDynamic));

                    if (!oJumpTargetsMenu) {
                      // create new submenu
                      oJumpTargetsMenu = sap.ui.getCore()
                        .getControl(sJumpMenuId);
                      if (!oJumpTargetsMenu) {
                        oJumpTargetsMenu = that
                          .createMenu(sJumpMenuId);
                      }
                    }
                    oJumpTargetsMenu.addItem(oMenuItemDynamic);
                  }

                  if (oJumpTargetsMenu !== null && oMenu.bOpen === true) {
                    var sMenuItemId = oControl.getId() + "_" + oContext.menuitemid;
                    var oJumpMenuItem = that.createMenuItem(
                      sMenuItemId,
                      {
                        text: oContext.text
                      });
                    oJumpMenuItem.setSubmenu(oJumpTargetsMenu);
                    oMenu.addItem(oJumpMenuItem);
                  }
                }
              });
            }.bind(that)
          );
        }
      }

      // Add select options for any not already set dimensions.
      var fAddSelectOptionsFromArray = function (aSelectionArray, oSelectOptions) {
        var sName;
        if (aSelectionArray) {
          var iLength = aSelectionArray.length;
          if (iLength > 0) {
            for (var i = 0; i < iLength; i++) {
              sName = aSelectionArray[i].dimension.name;
              if (sName && sName.length > 0 && !Object.prototype.hasOwnProperty.call(oSelectOptions, sName)) {
                if (aSelectionArray[i].dimension.selection) {
                  // Single string value, for single-value variable support. Might be soon
                  // removable.
                  oSelectOptions[sName] = [{
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": aSelectionArray[i].dimension.selection,
                    "High": null
                  }];

                } else if (aSelectionArray[i].dimension.selections && aSelectionArray[i].dimension.selections.length > 0) {
                  // In selectoption format: An array of individual range objects.
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

      // This is for selections. All kinds -- including range and multivalue, are supported
      var fGetSelectOptions = function (oContext, oClickContextParams) {
        var oSelectOptions = {};
        var aSelectOptions = [];

        oClickContextParams = oClickContextParams || {};

        // First pre-fill with clickcontext
        // Then apply the rest if any
        for (var sProperty in oClickContextParams) {
          if (Object.prototype.hasOwnProperty.call(oClickContextParams, sProperty)) {
            oSelectOptions[sProperty] = [{
              "Sign": "I",
              "Option": "EQ",
              "Low": oClickContextParams[sProperty],
              "High": null
            }];
          }
        }

        fAddSelectOptionsFromArray(oContext.filter, oSelectOptions);
        fAddSelectOptionsFromArray(oContext.variables, oSelectOptions);

        for (var sSelectOptionProperty in oSelectOptions) {
          if (Object.prototype.hasOwnProperty.call(oSelectOptions, sSelectOptionProperty)) {
            aSelectOptions.push({
              "PropertyName": sSelectOptionProperty,
              "Ranges": oSelectOptions[sSelectOptionProperty]
            });
          }
        }

        if (aSelectOptions.length > 0) {
          return aSelectOptions;
        }
      };

      // Add tuple elements as parameters
      var fCreateParamsForContext = function (oContext) {
        if (!oContext) {
          return;
        }

        var oParams = {};

        // main dim/member
        if (oContext.member && oContext.member.length > 0) {
          oParams[oContext.dimension] = oContext.member === "#" ? "" : oContext.member;
          if (oContext.memberType === "DATE") {
            oParams[oContext.dimension] = oParams[oContext.dimension] + "T00:00:00.000Z";
          }
        }

        // tuple elements for further specification of clicked context
        var oTupleElement, i, sName;

        var oTupleElements = oContext.tuple_elements;
        if (oTupleElements) {
          var iLength = oTupleElements.length;
          for (i = 0; i < iLength; i++) {
            oTupleElement = oTupleElements[i].tuple_element;
            if (oTupleElement.member && oTupleElement.member.length > 0) {
              sName = oTupleElement.dimension;
              if (!oParams[sName]) {
                oParams[sName] = oTupleElement.member === "#" ? "" : oTupleElement.member;
                if (oTupleElement.memberType === "DATE") {
                  oParams[sName] = oParams[sName] + "T00:00:00.000Z";
                }
              }
            }
          }
        }

        return oParams;
      };

      // Add selection and variable state as "Selection Variant".
      // omit things which are already in the Parameters...
      var fCreateSelectionVariantObject = function (oContext, oClickContextParams) {
        if (!oContext) {
          return;
        }

        var oSelectionVariantObject = {};

        // Mind the priorities after having added the main context information above:
        // first add filter information ...

        var oSelectOptions = fGetSelectOptions(oContext, oClickContextParams);

        if (oSelectOptions !== undefined) {
          oSelectionVariantObject.SelectOptions = oSelectOptions;
          oSelectionVariantObject.SelectionVariantID = new Date().toISOString();
          oSelectionVariantObject.Text = "Temporary Variant " + oSelectionVariantObject.SelectionVariantID;

          return oSelectionVariantObject;
        }
      };

      var fAddNameSelectionPairFromArray = function (aArray, oParams) {
        var sName, sSelection, aSelections;

        if (aArray && oParams) {
          var iLength = aArray.length;
          if (iLength > 0) {
            for (var i = 0; i < iLength; i++) {
              sName = aArray[i].dimension.name;
              if (sName && sName.length > 0) {
                if (!oParams[sName]) {
                  // A single "selection" entry means it's a variable value.
                  sSelection = aArray[i].dimension.selection;
                  if (sSelection && sSelection.length > 0) {
                    oParams[sName] = sSelection;
                  } else {
                    // "selections" means it's in the format of an array of selection
                    // objects.
                    // Only single-value == comparisons will be taken here, as others
                    // are not possible to express in URL-parameters.
                    aSelections = aArray[i].dimension.selections;
                    if (aSelections && aSelections.length === 1) {
                      if (aSelections[0].Sign && aSelections[0].Sign === "I" && aSelections[0].Option && aSelections[0].Option === "EQ") {
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
          }
        }
      };

      function _openDialog(e) {
        var lId, loJson;
        if (e.sId) {
          lId = e.getParameters().id;
          loJson = that.oMenuItemToDialogJsonMap[lId];
        } else {
          loJson = e;
        }

        that.oDialogResult = {};
        that.oDialogResult.dlgtype = loJson.dlgtype;
        that.aDlgControls = [];

        var loDialog = that.createDialog(lId + "_" + loJson.dlgtype, {
          "modal": true
        });
        loDialog.setResizable(false);
        loDialog.setTitle(loJson.title);
        loDialog.attachClosed(function () {
          loDialog.destroyContent();
          loDialog.destroy();
          that.aDlgControls = [];
          that.oDialogResult = {};
        });

        _addDialogButtons(loDialog, loJson);

        var loVLayout = new sap.ui.layout.VerticalLayout(lId + "_vlayout");
        loDialog.addContent(loVLayout);

        var loFuncOnSubmit = null;
        var lNumberOfElements = 0;
        if (loJson.elements) {
          lNumberOfElements = loJson.elements.length;
        }
        if (lNumberOfElements <= 1) {
          //if the dialog contains only one element it should be possible to submit via enter, without the need to click "ok"
          loFuncOnSubmit = _createOKButtonPressFunction(loDialog, loJson).bind(that);
        }
        for (var i = 0; i < lNumberOfElements; i++) {
          var loElementJson = loJson.elements[i].element;
          _createUI5Control(loElementJson, loVLayout, loFuncOnSubmit);
        }

        loDialog.open();
      }

      function _addDialogButtons(oDialog, oJson) {
        var loOkButton = that.createButton(oDialog.getId() + "OK_BTN");
        loOkButton.setText(oJson.okbtntext);
        loOkButton.attachPress(_createOKButtonPressFunction(oDialog, oJson).bind(that));

        var loCancelButton = that.createButton(oDialog.getId() + "CANCEL_BTN");
        loCancelButton.setText(oJson.cancelbtntext);
        loCancelButton.attachPress(function () {
          oDialog.close();
        });

        oDialog.addButton(loOkButton);
        oDialog.addButton(loCancelButton);
      }

      function _createOKButtonPressFunction(oDialog, oJson) {
        return function () {
          // handle control values
          var lNumOfControls = that.aDlgControls.length;
          for (var i = 0; i < lNumOfControls; i++) {
            var loCtrlInfo = that.aDlgControls[i];
            if (loCtrlInfo) {
              var loUi5Control = loCtrlInfo.control;
              loCtrlInfo.fOkHandler(loUi5Control);
            }
          }

          var lResultJSON = JSON.stringify(that.oDialogResult);
          var lFind = "\"";
          var loRegEx = new RegExp(lFind, "g");
          lResultJSON = lResultJSON.replace(loRegEx, "\\\"");
          oDialog.close();

          var lCommand = oJson.submitdialogcommand.replace("__JSON__", lResultJSON);
          var loFuncCommand = new Function(lCommand);
          loFuncCommand();
        };
      }

      function _createUI5Control(oElementJson, oVLayout, fOnSubmit) {
        var lType = oElementJson.type;
        var loLabel;
        var loCtrl = null;
        var loFuncOkHandler = null;

        if (lType === "dropdown") {
          if (oElementJson.text) {
            loLabel = that.createLabel(oElementJson.id + "_label");
            loLabel.setText(oElementJson.text);
            loLabel.setWidth("200px");
            oVLayout.addContent(loLabel);
          }

          loCtrl = that.createDropdownBox(oElementJson.id);
          loCtrl.setWidth(oElementJson.id === "dd_hierarchy" ? "400px" : "200px");
          var loSelectedItem;
          if (oElementJson.entries) {
            var lEntries = oElementJson.entries.length;
            for (var i = 0; i < lEntries; i++) {
              var loDdEntry = oElementJson.entries[i].entry;
              var loListItem = new sap.ui.core.ListItem();
              loListItem.setKey(loDdEntry.id);
              loListItem.setText(loDdEntry.text);
              if (loDdEntry.selected) {
                if (loDdEntry.selected === true) {
                  if (BaseHandler.dispatcher.isMainMode()) {
                    loSelectedItem = loListItem;
                  } else {
                    loSelectedItem = loDdEntry.text;
                  }
                }
              }
              loCtrl.addItem(loListItem);
            }
          }
          if (loSelectedItem) {
            if (BaseHandler.dispatcher.isMainMode()) {
              loCtrl.setSelectedItem(loSelectedItem);
            } else {
              loCtrl.setValue(loSelectedItem);
            }
          }
          loCtrl.attachChange(function () {
            var selectedKey = loCtrl.getSelectedKey();
            if (selectedKey !== "multiple") {
              var firstItem = loCtrl.getItems()[0];
              if (firstItem.getKey() === "multiple") {
                loCtrl.removeItem(firstItem);
              }
            }
          });
          oVLayout.addContent(loCtrl);
          loFuncOkHandler = _handleOnOKDropDown;
        } else if (lType === "checkbox") {
          loCtrl = that.createCheckBox(oElementJson.id);
          loCtrl.setText(oElementJson.text);
          if (oElementJson.checked) {
            loCtrl.setChecked(oElementJson.checked === true);
          } else {
            loCtrl.setChecked(false);
          }
          oVLayout.addContent(loCtrl);
          loFuncOkHandler = _handleOnOKCheckBox;
        } else if (lType === "input") {
          if (oElementJson.text) {
            loLabel = that.createLabel(oElementJson.id + "_label");
            loLabel.setText(oElementJson.text);
            loLabel.setWidth("200px");
            oVLayout.addContent(loLabel);
          }
          loCtrl = that.createTextField(oElementJson.id);
          if (fOnSubmit && loCtrl.attachSubmit) {
            loCtrl.attachSubmit(fOnSubmit);
          } else if (fOnSubmit && loCtrl.onsapenter) {
            loCtrl.addEventDelegate({
              onsapenter: fOnSubmit
            });
          }
          loCtrl.setValue(oElementJson.value);
          oVLayout.addContent(loCtrl);
          loFuncOkHandler = _handleOnOKInputField;
        } else if (lType === "numeric_input") {
          if (oElementJson.text) {
            loLabel = that.createLabel(oElementJson.id + "_label");
            loLabel.setText(oElementJson.text);
            loLabel.setWidth("200px");
            oVLayout.addContent(loLabel);
          }
          loCtrl = that.createTextField(oElementJson.id);
          loCtrl.attachBrowserEvent("keypress", function (e) {
            var ltKeyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8];
            if (!(jQuery.inArray(e.which, ltKeyCodes) >= 0)) {
              e.preventDefault();
            }
          });
          loCtrl.setValue(oElementJson.value);
          loCtrl.setWidth("100px");
          oVLayout.addContent(loCtrl);
          loFuncOkHandler = _handleOnOKInputField;
        }

        if (loCtrl) {
          that.aDlgControls.push({
            control: loCtrl,
            fOkHandler: loFuncOkHandler.bind(that)
          });
        }
      }

      function _handleOnOKDropDown(oDdBox) {
        that.oDialogResult[oDdBox.getId()] = oDdBox.getSelectedKey();
      }

      function _handleOnOKCheckBox(oCheckBox) {
        that.oDialogResult[oCheckBox.getId()] = "" + oCheckBox.getChecked();
      }

      function _handleOnOKInputField(oInputField) {
        that.oDialogResult[oInputField.getId()] = "" + oInputField.getValue();
      }

      function _handleContextMenuClick(oControlProperties, e) {
        if (!e.ctrlKey) {
          BaseHandler.dispatcher.cancelDragDropOperation();

          // Assumption: there is only one context menu in an application
          that.clientX = e.clientX;
          that.clientY = e.clientY;

          var loDomClickedElement = _handleContextMenuClick_determineClickedElement(e.clientX, e.clientY);
          var loDomClickedComponent;
          var loClickedUI5Component;

          if (jQuery.browser.msie && document.msElementsFromPoint !== undefined) {
            var ltZOrderElements = document.msElementsFromPoint(e.clientX, e.clientY);
            for (var i = 0; i < ltZOrderElements.length; i++) {
              var loJqZOrderElement = jQuery(ltZOrderElements[i]);
              var loZenControl = BaseHandler.dispatcher.getControlForId(loJqZOrderElement.attr("id"));
              if (loZenControl) {
                loClickedUI5Component = sap.ui.getCore().byId(loZenControl.getId());
                break;
              }
            }
          } else {
            loDomClickedComponent = loDomClickedElement.closest(".zenControl");
            loClickedUI5Component = sap.ui.getCore().byId(loDomClickedComponent.attr("id"));
          }

          if (loClickedUI5Component) {
            var ltHandlers = BaseHandler.dispatcher.getHandlers(loClickedUI5Component.zenControlType);
            if (ltHandlers && ltHandlers[0]) {
              var loHandler = ltHandlers[0];
              var loFuncContextMenuAction = loHandler.getContextMenuAction(oControlProperties.contextmenuid, loClickedUI5Component, loDomClickedElement);
              if (!loFuncContextMenuAction) {
                // do nothing
              } else {
                if (e) {
                  if (e.preventDefault) {
                    e.preventDefault();
                  }
                  if (e.stopPropagation) {
                    e.stopPropagation();
                  }
                  if (e.cancelBubble) {
                    e.cancelBubble = true;
                  }
                }

                loFuncContextMenuAction();
              }
            }
          }
        }
      }

      function _handleContextMenuClick_determineClickedElement(iClientX, iClientY) {
        var loJqElement = jQuery(window.document.elementFromPoint(iClientX, iClientY));
        var loJqClosest = loJqElement.closest(".zenControl");
        var lId = loJqClosest.attr("id");
        var loControl = BaseHandler.dispatcher.getControlForId(lId);

        var ltDisabledElements = [];
        if (loControl && loControl.zenControlType === "xtable") {
          lId = loJqElement.attr("id");
          while (lId && lId.indexOf("droparea") > -1) {
            ltDisabledElements.push(loJqElement);
            loJqElement.css("display", "none");
            loJqElement = jQuery(window.document.elementFromPoint(iClientX, iClientY));
            lId = loJqElement.attr("id");
          }
          for (var i = 0; i < ltDisabledElements.length; i++) {
            ltDisabledElements[i].css("display", "block");
          }
        }

        return loJqElement;
      }
    };

    var instance = new ContextMenuHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);
