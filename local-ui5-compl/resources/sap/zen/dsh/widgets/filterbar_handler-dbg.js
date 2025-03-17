/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/ui/comp/filterbar/FilterBar",
    "sap/m/Button",
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/comp/smartvariants/SmartVariantManagement",
    "sap/zen/dsh/utils/BaseHandler",
    "sap/zen/dsh/widgets/filterpanel_m_handler"
  ],
  function(jQuery, Log, FilterBar, Button,PersonalizableInfo,SmartVariantManagement, BaseHandler) {
    "use strict";
    var FilterBarHandler = function() {
      BaseHandler.apply(this, arguments);
      var dispatcher = BaseHandler.dispatcher;
      var me = this;
      me.create = function(oChainedControl, oControlProperties) {
        var id = oControlProperties["id"];
        var ZenFilterBar = FilterBar.extend(
          "sap.zen.ZenFilterBar", {
            renderer : {}
          }
        );
        ZenFilterBar.prototype._createVariantManagement = function() {
          this._smartVm = false;
          var loVariantManagement;
          // Variant Management is only possible for applications: sap.zen.dsh.sapbi_page.appComponent.getId() is required
          if (sap.zen.dsh.sapbi_page.appComponent) {
            loVariantManagement = new SmartVariantManagement(
              this.getId() + "-variant",
              {
                showExecuteOnSelection : false,
                showShare : true
              });
            this._smartVm = true;
          }
          return loVariantManagement;
        };
        // create FilterBar
        var filterBar = new ZenFilterBar(
          id,
          {
            advancedMode : false,
            considerGroupTitle : false,
            showRestoreButton : false,
            filterBarExpanded : oControlProperties.expanded,
            persistencyKey : oControlProperties.VARIANT_KEY
          }
        ).addStyleClass("zenFilterBarM");
        // Initialize Variant Management
        filterBar._initializeVariantManagementOriginal = sap.ui.comp.filterbar.FilterBar.prototype._initializeVariantManagement;
        filterBar._initializeVariantManagement = function() {
          if (this._smartVm) {
            if (this._oVariantManagement && this.getPersistencyKey()) {
              this._sOwnerId = sap.zen.dsh.sapbi_page && sap.zen.dsh.sapbi_page.appComponent.getId();
              var loPersInfo = new PersonalizableInfo(
                {
                  type : "filterBar",
                  keyName : "persistencyKey"
                });
              loPersInfo.setControl(this);
              this._oVariantManagement.addPersonalizableControl(loPersInfo);
              filterBar._initializeVariantManagementOriginal.call(filterBar);
            } else {
              this.fireInitialise();
            }
          } else {
            filterBar._initializeVariantManagementOriginal.call(filterBar);
          }
        };
        // overwrite _initialize to set standard variant
        if (filterBar._oVariantManagement) {
          filterBar._oVariantManagement._initializeOriginal = filterBar._oVariantManagement._initialize;
          filterBar._oVariantManagement._initialize = function( parameter, oCurrentControlWrapper) {
            if (oControlProperties.ignoreDefaultVariant) {
              this.setInitialSelectionKey(filterBar._oVariantManagement.STANDARDVARIANTKEY);
              var lModifyCurrentVariant = me.allowVariantSave(filterBar, oControlProperties);
              filterBar._oVariantManagement.currentVariantSetModified(lModifyCurrentVariant);
            }
            filterBar._oVariantManagement._initializeOriginal.call(filterBar._oVariantManagement, parameter, oCurrentControlWrapper);
          };
        }
        // overwrite applyVariant: load bookmark, skip anything else
        filterBar.applyVariant = function(oVariant, sContext, bInitial) {
          if (oVariant) {
            var lBookmarkContent = oVariant.filterBarVariant;
            if (lBookmarkContent) {
              var lCommandString = getCommand(filterBar, "loadSfinBookmark");
              if (lCommandString) {
                me.applyForChildren(filterBar, function(oDimFilter) {
                  var loDimFilterModel = oDimFilter.getModel();
                  var loAllFilters;
                  if (loDimFilterModel) {
                    loAllFilters = loDimFilterModel.getProperty("/filters");
                  }
                  if (loAllFilters) {
                    for (var lFilterKey in loAllFilters) {
                      if (Object.prototype.hasOwnProperty.call(loAllFilters, lFilterKey)) {
                        if (loAllFilters[lFilterKey].dirty) {
                          loAllFilters[lFilterKey].dirty = false;
                        }
                      }
                    }
                  }
                });
                if (lCommandString.indexOf("__bmId__") >= 0) {
                  lCommandString = me.prepareCommand(lCommandString, "__bmId__", "42");
                  lCommandString = me.prepareCommand(lCommandString, "__arg2__", lBookmarkContent);
                  new Function(lCommandString).call();
                }
              }
            }
            if (bInitial && this._isNewFilterBarDesign()) {
              this._fHandleResize();
            }
          }
        };
        // register + implement variant content fetch
        filterBar.registerFetchData(
          function() {
            if(!sap.zen.dsh.wnd){
              sap.zen.dsh.wnd = {};
            }
            var lBookmarkContent = sap.zen.dsh.wnd[oControlProperties.PAGE_ID].getWindow().getContext("BookmarkInternal").createBookmark().getBookmark();
            /*
             * VariantManagement holds a pointer to the object
             * when storing we overwrite the pointer content (when we load the current state of the application)
             * For this reason we need to provide Variant Management with a copy of the content
             */
            var lCopy = JSON.parse(JSON.stringify(lBookmarkContent));
            return lCopy;
          }
        );
        filterBar._initializeVariantManagement();
        if (!sap.zen.designmode && !oControlProperties.fbVisible) {
          filterBar.toggleStyleClass("zenFilterBarMHidden");
        }
        filterBar.custProp = {}; // to store local properties
        filterBar.custProp.i18n = {
          "expand" : oControlProperties.EXPAND_ACTION,
          "collapse" : oControlProperties.COLLAPSE_ACTION,
          "novariant" : oControlProperties.NO_VARIANT
        };
        filterBar.custProp.allChildrenSubmit = oControlProperties.allChildrenSubmit;
        me.addCustomExpandButton(filterBar);
        if (typeof (sap.zen.dsh.DSH_deployment) !== "undefined") { // only
          setCommand(filterBar, "loadSfinBookmark", oControlProperties.loadsfinbookmarkcmd);
        }
        filterBar.zenInitLater = function() {
          init(filterBar, oControlProperties);
          filterBar.zenInitLater = null;
        };
        setCommand(filterBar, "EXPAND", oControlProperties.expandcmd);
        setCommand(filterBar, "DELAYRERENDER", oControlProperties.delayrerendercmd);
        if (!sap.zen.designmode) {
          filterBar.addEventDelegate(
            {
              onAfterRendering : function(e) {
                e.srcControl.removeEventDelegate(this);
                me.updateEnablement(e.srcControl, oControlProperties);
                jQuery(
                  e.srcControl.getParent().getDomRef()
                ).addClass("zenFilterBarMParentCont");
              }
            }
          );
        }
        // Attach Handler for determining Button "Filter" Count value
        filterBar.registerGetFiltersWithValues(function() {
          return handleDetermineFilterCount(filterBar);
        });
        // Attach Handler when pressing Button Go in FilterBar
        filterBar.attachSearch(
          function() {
            handleFilterDialog_submit(filterBar);
          }
        );
        // Handle Filter Dialog
        handleFilterDialog(filterBar);
        // initialization for adding custom overflow expand button in filterbar
        me.initOverflowExpand(filterBar, oControlProperties);
        return filterBar;
      };
      /**
       * Update the Control
       */
      me.update = function(oControl, oControlProperties) {
        if (oControlProperties) {
          if (oControl.zenInitLater) {
            setTimeout(oControl.zenInitLater);
          } else {
            init(oControl, oControlProperties, true);
          }
          me.updateVisibility(oControl, oControlProperties);
          me.updateEnablement(oControl, oControlProperties);
          var lModifyCurrentVariant = me.allowVariantSave(oControl, oControlProperties);
          if (oControl._oVariantManagement) {
            oControl._oVariantManagement.currentVariantSetModified(lModifyCurrentVariant);
          }
        }
        return oControl;
      };
      /**
       * Initialize the Control (Create, Update)
       */
      function init(oControl, oControlProperties, bUpdate) {
        var ltChildren = oControlProperties.content;
        if (ltChildren && ltChildren[0]) {
          if (ltChildren[0].component.content && ltChildren[0].component.content.control.newds) {
            oControl.custProp.allChildrenSubmit = oControlProperties.allChildrenSubmit;
            if (bUpdate) {
              ltChildren.forEach(function(oChild) {
                if (oChild.component.content && oChild.component.content.control.newds) {
                  // this flag is not needed for updates in context of the filter bar...
                  oChild.component.content.control.newds = false;
                }
              });
            }
          }
          me.updateChildren(
            ltChildren,
            oControl,
            function(oNewControl, iIndex, componentData) {
              if (componentData) {
                var loFilterBarItem = new sap.ui.comp.filterbar.FilterGroupItem(
                  oControl.getId() + oNewControl.getId(),
                  {
                    name : oControl.getId() + "-" + oNewControl.getId(),
                    groupName : sap.ui.comp.filterbar.FilterBar.INTERNAL_GROUP,
                    partOfCurrentVariant : true,
                    visibleInFilterBar : false
                  }
                );
                loFilterBarItem.setControl(oNewControl);
                if (componentData.content && componentData.content.control && componentData.content.control.characteristics && componentData.content.control.characteristics.length > 0) {
                  loFilterBarItem.setLabel(componentData.content.control.characteristics[0].characteristic.text);
                }
                oNewControl.addStyleClass("zenFilterBarMFilter");
                if (oNewControl.ZEN_multiInput && oNewControl.ZEN_multiInput[0]) {
                  oNewControl.ZEN_multiInput[0].attachTokenChange(
                    function(oEvent) {
                      oControl.fireFilterChange(oEvent);
                    }
                  );
                }
                oControl.addFilterGroupItem(loFilterBarItem);
              }
            },
            function() {
              // do nothing
            });
          oControl.fireFilterChange();
        }
        if (oControlProperties.visibleDimensionNames) {
          var ltVisibleDimensions = oControlProperties.visibleDimensionNames;
          var ltFilterGroupItems = oControl.getFilterGroupItems();
          for (var i = 0; i < ltFilterGroupItems.length; i++) {
            var loFilterGroupItem = ltFilterGroupItems[i];
            var loFilterControl = oControl.determineControlByFilterItem(loFilterGroupItem);
            if (loFilterControl) {
              loFilterGroupItem.setVisibleInFilterBar(false);
              var oModel = loFilterControl.getModel();
              if(!oModel){
                Log.error("FilterControl " + loFilterControl.getId() + " has no model");
              } else {
                var lDimName = oModel.getProperty("/characteristics/0/characteristic/name");
                for (var j = 0; j < ltVisibleDimensions.length; j++) {
                  if (lDimName === ltVisibleDimensions[j]._n) {
                    loFilterGroupItem.setVisibleInFilterBar(true);
                    break;
                  }
                }
              }
            }
          }
        }
      }
      me.applyForChildren = function(oFilterBar, funclet) {
        var ltFilters = oFilterBar.getAllFilterItems();
        for (var i = 0; i < ltFilters.length; i++) {
          var loFilterControl = oFilterBar.determineControlByFilterItem(ltFilters[i]);
          if (loFilterControl) {
            var lResult = funclet(loFilterControl);
            if (lResult) {
              return lResult;
            }
          }
        }
        return null;
      };
      me.getType = function() {
        return "filterbar";
      };
      me.updateVisibility = function(oFilterBar, oControlProperties) {
        if (oControlProperties.visibilityChanged) {
          oFilterBar.toggleStyleClass("zenFilterBarMHidden");
        }
      };
      me.allowVariantSave = function(oFilterBar, oControlProperties) {
        if (oFilterBar._oVariantManagement) {
          var loVariantManagement = oFilterBar._oVariantManagement;
          if (loVariantManagement.getSelectionKey() !== loVariantManagement.STANDARDVARIANTKEY && oControlProperties.datasourcechanged) {
            return true;
          } else {
            return false;
          }
        }
        return null;
      };
      me.initOverflowExpand = function(oFilterBar, oControlProperties) {
        dispatcher.registerResizeHandler(
          oFilterBar, {
            endResize : function(e) {
              if (e) {
                // Dynamically Hide/Show Expand button
                if (getSampleDFWidth() === -1) {
                  me.sampleDimensionFilterWidth(oFilterBar);
                }
                if (oFilterBar.getFilterBarExpanded()) {
                  me.refreshCollapseVisibleDFCount(oFilterBar);
                }
                me.updateCustomExpandVisibility(oFilterBar);
              }
            }
          }
        );
        oFilterBar.orig_setFilterBarExpanded = oFilterBar.setFilterBarExpanded;
        oFilterBar.setFilterBarExpanded = function(showExpanded) {
          var lOldExpanded = this.getFilterBarExpanded();
          oFilterBar.orig_setFilterBarExpanded.call(oFilterBar, showExpanded);
          if (showExpanded !== lOldExpanded) {
            var lCommandString = getCommand(oFilterBar, "EXPAND");
            if (lCommandString) {
              eval(lCommandString);
            }
            new Function(oControlProperties.onToggle).call();
          }
        };
      };
      me.addCustomExpandButton = function(oFilterBar) {
        if (oFilterBar._oToolbar) {
          var lHideShowButtonIndex;
          if (oFilterBar._oHideShowButton) {
            lHideShowButtonIndex = oFilterBar._oToolbar.indexOfContent(oFilterBar._oHideShowButton);
          }
          if (lHideShowButtonIndex) {
            oFilterBar.customExpandButton = new Button(
              {
                text : oFilterBar.custProp.i18n.expand,
                visible : false,
                type : sap.m.ButtonType.Transparent
              }
            );
            oFilterBar.customExpandButton.attachPress(function() {
              me.toggleExpandOverlay(oFilterBar);
            });
            oFilterBar.customExpandButton.addStyleClass("zenCustomExpandButton");
            oFilterBar._oToolbar.insertContent(oFilterBar.customExpandButton, lHideShowButtonIndex);
          }
        }
      };
      /**
       * Update Expand Visibility
       */
      me.updateCustomExpandVisibility = function(oFilterBar) {
        var lExpandButtonVisible = false;
        if (oFilterBar.getFilterBarExpanded()) {
          lExpandButtonVisible = me.checkCustomExpandVisibility(oFilterBar) && oFilterBar.getFilterBarExpanded();
        }
        oFilterBar.customExpandButton && oFilterBar.customExpandButton.setVisible(lExpandButtonVisible);
        // this is the case when the overlay is expanded, the user opens filter dialog and hide dimension filters.
        // If the expand button should not be visible anymore, we'll collapse the overlay
        if (oFilterBar.custProp.customExpanded && !lExpandButtonVisible) {
          me.toggleExpandOverlay(oFilterBar, true);
        }
      };
      /**
       * Collapse
       */
      me.refreshCollapseVisibleDFCount = function(oFilterBar) {
        if (getSampleDFWidth() === -1) {
          me.sampleDimensionFilterWidth(oFilterBar);
        }
        var lCount = Math.floor(((jQuery(oFilterBar.getDomRef()).width()) / getSampleDFWidth()));
        var ltFilterGroupItems = oFilterBar.getFilterGroupItems();
        var lIndexVisible = 0;
        for (var i = 0; i < ltFilterGroupItems.length; i++) {
          var loFilterGroupItem = ltFilterGroupItems[i];
          if (loFilterGroupItem.getVisibleInFilterBar()) {
            var loFilterControl = oFilterBar.determineControlByFilterItem(loFilterGroupItem);
            if (loFilterControl) {
              var loParent = loFilterControl.getParent();
              if (loParent && loParent.addStyleClass && loParent.removeStyleClass) {
                if (lIndexVisible++ >= lCount) {
                  loParent.addStyleClass("zenFBIhidden");
                } else {
                  loParent.removeStyleClass("zenFBIhidden");
                }
              }
            }
          }
        }
      };
      /**
       * Check Expand Visibility
       */
      me.checkCustomExpandVisibility = function(oFilterBar) {
        var lRetValue = false;
        var lVisibleDFCount = getVisibleDFCount(oFilterBar);
        if (getSampleDFWidth() !== -1) {
          if ((lVisibleDFCount * getSampleDFWidth()) > (jQuery(oFilterBar.getDomRef()).width())) {
            lRetValue = true;
          }
        }
        return lRetValue;
      };
      /**
       *
       */
      me.sampleDimensionFilterWidth = function(oFilterBar) {
        var lWidth = -1;
        var ltFilters = oFilterBar.getAllFilterItems();
        if (ltFilters.length > 1) {
          var df = jQuery(oFilterBar.getDomRef()).find(".sapUiAFLayoutItem:first-of-type");
          if (df) {
            var lPaddings = parseInt(df.css("padding-left")) + parseInt(df.css("padding-right"));
            if (isNaN(lPaddings)) {
              lPaddings = 0;
            }
            var lMargin = parseInt(df.css("margin-left")) + parseInt(df.css("margin-right"));
            if (isNaN(lMargin)) {
              lMargin = 0;
            }
            lWidth = df.width() + lPaddings + lMargin;
          }
        }
        setSampleDFWidth(lWidth);
      };
      /**
       * Toggle Expand Overlay
       */
      me.toggleExpandOverlay = function(oFilterBar, manualClose) {
        if (oFilterBar.custProp.customExpanded || manualClose === true) {
          oFilterBar.removeStyleClass("zenCustomExpand");
          oFilterBar.custProp.customExpanded = false;
          oFilterBar.customExpandButton && oFilterBar.customExpandButton.setText(oFilterBar.custProp.i18n.expand);
        } else {
          oFilterBar.addStyleClass("zenCustomExpand");
          oFilterBar.custProp.customExpanded = true;
          oFilterBar.customExpandButton && oFilterBar.customExpandButton.setText(oFilterBar.custProp.i18n.collapse);
        }
      };
      /**
       * Determine Filter Count to be displayed within Button "Filter"
       *      amount of Filters containing values
       */
      function handleDetermineFilterCount(oFilterBar) {
        var ltFiltersWithValue = [];
        var ltFilterGroupItems = oFilterBar.getFilterGroupItems();
        for (var i = 0; i < ltFilterGroupItems.length; i++) {
          var loFilterControl = oFilterBar.determineControlByFilterItem(ltFilterGroupItems[i]);
          if ((loFilterControl && loFilterControl.ZEN_multiInput && loFilterControl.ZEN_multiInput[0] && loFilterControl.ZEN_multiInput[0].getTokens().length) || 
              (loFilterControl && Object.values(loFilterControl.getModel().getProperty("/filters"))[0].ranges.length > 0)) {
            ltFiltersWithValue.push(ltFilterGroupItems[i]);
          }
        }
        return ltFiltersWithValue;
      }
      /**
       * Initialize Filter Dialog
       *      - Handle Submit, Cancel
       *      - Change Header
       */
      function handleFilterDialog(oFilterBar) {
        // Attach Dialog Before Open Event
        oFilterBar.attachFiltersDialogBeforeOpen(function() {
          handleFilterDialog_show(oFilterBar);
        });
        // Attach Dialog Close Event: fired when OK or Cancel is pressed
        oFilterBar.attachFiltersDialogClosed(function() {
          handleFilterDialog_close(oFilterBar);
        });
        // Attach Dialog Cancel Event: fired when Cancel is pressed
        me.originalCancelFilterDialog = oFilterBar._cancelFilterDialog;
        oFilterBar.attachFiltersDialogCancel(function() {
          handleFilterDialog_cancel(oFilterBar);
        });
      }
      /**
       * Filter Dialog: Show
       */
      function handleFilterDialog_show(oFilterBar) {
        jQuery(document.body).addClass("zenFilterBarDialogOpened");
        me.applyForChildren(oFilterBar, function(oDimFilter) {
          oDimFilter.ZENFilterBeforeDialog = JSON.stringify(oDimFilter.getModel().getProperty("/filters"));
        });
      }
      /**
       * Filter Dialog: Close (OK, Cancel)
       *      Can be "OK" or "Cancel" depending on if FilterDialogCancel was called prior to FilterDialogProcessClose
       */
      function handleFilterDialog_close(oFilterBar) {
        // Submit or Cancel
        if (!me._bFilterDialogCancelled) {
          handleFilterDialog_submit(oFilterBar);
        }
        me._bFilterDialogCancelled = null;
        // Child Processing
        me.applyForChildren(oFilterBar, function(oDimFilter) {
          if (oDimFilter.ZENFilterBeforeDialog) {
            oDimFilter.ZENFilterBeforeDialog = null;
          }
        });
        jQuery(document.body).removeClass("zenFilterBarDialogOpened");
        if (oFilterBar.getFilterBarExpanded()) {
          me.refreshCollapseVisibleDFCount(oFilterBar);
        }
        me.updateCustomExpandVisibility(oFilterBar);
      }
      /**
       * Filter Dialog: Cancel
       */
      function handleFilterDialog_cancel(oFilterBar) {
        me._bFilterDialogCancelled = true;
        // Child Processing
        me.applyForChildren(oFilterBar, function(oDimFilter) {
          if (oDimFilter.ZENFilterBeforeDialog) {
            oDimFilter.getModel().setProperty("/filters", JSON.parse(oDimFilter.ZENFilterBeforeDialog));
            oDimFilter.ZENFilterBeforeDialog = null;
          }
        });
        if (me.originalCancelFilterDialog) {
          me.originalCancelFilterDialog.call(oFilterBar);
        }
      }
      /**
       * Filter Dialog: Submit (OK)
       */
      function handleFilterDialog_submit(oFilterBar) {
        var lSubmitMethod = oFilterBar.custProp.allChildrenSubmit;
        var lKeyWordToReplace = lSubmitMethod.indexOf("__STRING____");
        while (lKeyWordToReplace > 0) {
          var lKeyWeNeedToReplace;
          if (typeof (sap.zen.dsh.DSH_deployment) === "undefined") {
            lKeyWeNeedToReplace = lSubmitMethod.substring(lKeyWordToReplace, lSubmitMethod.indexOf("'", lKeyWordToReplace));
          } else {
            lKeyWeNeedToReplace = lSubmitMethod.substring(lKeyWordToReplace, lSubmitMethod.indexOf("\\x27", lKeyWordToReplace));
          }
          var lIdWeNeed = lKeyWeNeedToReplace.substring(12) + "_filter1";
          var loDimensionFilter = sap.ui.getCore().byId(lIdWeNeed);
          var lOriginalSubmitMethod = lSubmitMethod;
          lSubmitMethod = loDimensionFilter.ZEN_submit(lKeyWeNeedToReplace, lSubmitMethod);
          if (!lSubmitMethod) {
            lSubmitMethod = lOriginalSubmitMethod.replace(lKeyWeNeedToReplace, "{}");
          }
          lKeyWordToReplace = lSubmitMethod.indexOf("__STRING____");
        }
        var lDelayrerendercmdStart = getCommand(oFilterBar, "DELAYRERENDER");
        if (lDelayrerendercmdStart && lDelayrerendercmdStart.indexOf("__arg1__") >= 0) {
          lDelayrerendercmdStart = lDelayrerendercmdStart.replace("__arg1__", "true");
        }
        var lDelayrerendercmdEnd = getCommand(oFilterBar, "DELAYRERENDER");
        if (lDelayrerendercmdEnd && lDelayrerendercmdEnd.indexOf("__arg1__") >= 0) {
          lDelayrerendercmdEnd = lDelayrerendercmdEnd.replace("__arg1__", "false");
        }
        var lVisibleDimensions = me.getVisibleDimensions(oFilterBar);
        if (lVisibleDimensions && lDelayrerendercmdEnd && lDelayrerendercmdEnd.indexOf("__arg2__") >= 0) {
          lDelayrerendercmdEnd = lDelayrerendercmdEnd.replace("__arg2__", lVisibleDimensions);
        }
        lSubmitMethod = lDelayrerendercmdStart + lDelayrerendercmdEnd + lSubmitMethod;
        eval(lSubmitMethod);
      }
      /**
       * Get Visible Dimensions
       */
      me.getVisibleDimensions = function(oFilterBar) {
        if (typeof (sap.zen.dsh.DSH_deployment) !== "undefined") {
          var ltFilterGroupItems = oFilterBar.getFilterGroupItems();
          var ltVisibleDimensions = [];
          for (var i = 0; i < ltFilterGroupItems.length; i++) {
            var loFilterGroupItem = ltFilterGroupItems[i];
            if (loFilterGroupItem.getVisibleInFilterBar()) {
              var loFilterControl = oFilterBar.determineControlByFilterItem(loFilterGroupItem);
              if (loFilterControl) {
                var lDimName = loFilterControl.getModel().getProperty("/characteristics/0/characteristic/name");
                if (lDimName) {
                  ltVisibleDimensions.push(lDimName);
                }
              }
            }
          }
          return JSON.stringify(ltVisibleDimensions);
        }
        return null;
      };
      /**
       * Update Enabled
       */
      me.updateEnablement = function(oFilterBar) {
        if (oFilterBar._oVariantManagement) {
          oFilterBar._oVariantManagement.setEnabled(true);
        }
      };
      /**
       *
       */
      function getVisibleDFCount(oFilterBar) {
        var ltFilters = oFilterBar.getAllFilterItems(true);
        var lVisibleCount = 0;
        for (var i = 0; ltFilters && i < ltFilters.length; i++) {
          if (ltFilters[i].getVisibleInFilterBar()) {
            lVisibleCount++;
          }
        }
        return lVisibleCount;
      }
      /**
       *
       */
      function setSampleDFWidth(val) {
        me._sampleDFWidth = val;
      }
      /**
       *
       */
      function getSampleDFWidth() {
        if (!me._sampleDFWidth) {
          me._sampleDFWidth = -1;
        }
        return me._sampleDFWidth;
      }
      /**
       * Get Command
       */
      function getCommand(oControl, type) {
        var lCommand;
        if (oControl.custProp && oControl.custProp.commands) {
          lCommand = oControl.custProp.commands[type];
        }
        return lCommand;
      }
      /**
       * Set Command
       */
      function setCommand(oControl, type, command) {
        if (oControl.custProp) {
          if (!oControl.custProp.commands) {
            oControl.custProp.commands = {};
          }
          oControl.custProp.commands[type] = command;
        }
      }
      this.getDecorator = function() {
        return "DataSourceFixedHeightDecorator";
      };
    };
    var instance = new FilterBarHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);
