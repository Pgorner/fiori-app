// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Element",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/thirdparty/jquery"
], function (Log, Element, Controller, UIComponent, jQuery) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppStateFormSample.view.EditFormList", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberof view.Detail
         */
        onInit: function () {
            var val,
                oModel = this.getView() && this.getView().getModel("AppState");
            if (oModel) {
                val = this.getRouter().getRoute().getName() === "editForm";
                oModel.setProperty("/appState/formRecord", val);
            }
            this.getMyComponent().getEventBus().subscribe("sap.ushell.demoapps", "restoreUIState", this.restoreUIState.bind(this));
            this.getMyComponent().getEventBus().subscribe("sap.ushell.demoapps", "serializeUIState", this.serializeUIState.bind(this));
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        getFocusControlIndex: function () {
            var oControl,
                sFocusControlId,
                iIndexFocus = -1,
                that = this,
                oModel = this.getView() && this.getView().getModel("AppState"),
                aArr,
                aParentChain = [];
            sFocusControlId = Element.getActiveElement()?.getId();
            oControl = Element.getElementById(sFocusControlId);
            while (oControl && oControl.getParent()) {
                aParentChain.push(oControl.getId());
                oControl = oControl.getParent();
            }
            aArr = oModel.getProperty("/appState/chatList");
            aArr.forEach(function (oState, iIndex) {
                oControl = that.getControlByIndex(iIndex);
                if (oControl) {
                    oState.oFocusInfo = oControl.getFocusInfo();
                    if (aParentChain.indexOf(oControl.getId()) >= 0) {
                        Log.error("current focus control index " + iIndex);
                        iIndexFocus = iIndex;
                    }
                }
            });
            return iIndexFocus;
        },

        onInputChange: function (ev) {
            // if the change is not in the last control and the focus is not in
            // the last control and the last and next to last
            var idx = this.getFocusControlIndex(),
                oModel = this.getView() && this.getView().getModel("AppState"),
                oFs,
                that = this,
                aArr;
            oFs = ev.getSource().getFocusInfo();
            aArr = oModel.getProperty("/appState/chatList");
            Log.error("now change");
            while ((aArr.length > 3 && aArr.length > idx) && (aArr[aArr.length - 1].text === "") && (aArr[aArr.length - 2].text === "")) {
                aArr.splice(-1, 1);
                this.getView().byId("chatList").invalidate();
            }
            if ((aArr.length < 2) || ((aArr.length - 1) === idx) || (aArr[aArr.length - 1].text !== "")) {
                setTimeout(function () {
                    aArr.push({ text: "" });
                    that.getView().byId("chatList").invalidate();
                    setTimeout(function () {
                        var ctl;
                        ctl = that.getControlByIndex(idx);
                        ctl.applyFocusInfo(oFs);
                    }, 100);
                }, 20);
            }
            that.currentFocusIndex = idx;
            that.currentFocusInfo = oFs;
            Log.error("in event current focus control index " + idx + " info " + JSON.stringify(oFs));
        },

        handleBtn1Press: function () {
            this.getMyComponent().navTo("toView2");
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        getControlByIndex: function (iIndex) {
            var li;
            if (iIndex < 0) {
                li = this.getView().byId("chatList").getItems()[this.getView().byId("chatList").getItems().length - 1];
                return li.getContent()[0];
            }
            Log.error("iIndex is " + iIndex);
            li = this.getView().byId("chatList").getItems()[iIndex];
            if (li === undefined) {
                return undefined;
            }
            return li.getContent()[0];
        },

        serializeUIState: function () {
            var oModel = this.getView() && this.getView().getModel("AppState");
            Log.error("serializeUIState");
            // get the focusInfo of the nth list item.

            oModel.setProperty("/appState/uiState/editForm/focusInfo", this.currentFocusIndex);
            oModel.setProperty("/appState/uiState/editForm/focusInfo", this.currentFocusInfo);
            Log.error("serialize current focus control index " + this.currentFocusIndex + " info " + JSON.stringify(this.currentFocusInfo));
        },

        restoreUIState: function () {
            var oControl,
                iFocus,
                iFI,
                oModel = this.getView() && this.getView().getModel("AppState");
            Log.error("restoreUIState");
            iFocus = oModel.getProperty("/appState/uiState/editForm/focusIndex");
            iFI = oModel.getProperty("/appState/uiState/editForm/focusInfo");
            if (iFocus !== undefined) {
                oControl = this.getControlByIndex(iFocus);
                var oCurrentFI = oControl.getFocusInfo();
                Log.error("current uistate " + JSON.stringify(oCurrentFI));
                Log.error(" setting focus info on " + iFocus + " to " + JSON.stringify(iFI));
                if (iFI) {
                    oCurrentFI.cursoPos = iFI.cursorPos;
                    oCurrentFI.selectionEnd = iFI.selectionEnd;
                    oCurrentFI.selectionStart = iFI.selectionStart;
                    oControl.applyFocusInfo(oCurrentFI);
                    setTimeout(function () {
                        Log.error(" setting focus info on " + iFocus + " to " + JSON.stringify(oCurrentFI));
                        oControl.applyFocusInfo(oCurrentFI);
                        oControl.focus();
                    }, 100);
                }
                oControl.focus();
            }
        },

        findIndex: function (sId, aArray) {
            return aArray.reduce(function (prevValue, currentElement, index) {
                if (currentElement.Key === sId) {
                    return index;
                }
                return prevValue;
            }, aArray.length);
        },

        onBtnBackPressed: function () {
            this.getMyComponent().navTo("displayFavorites");
        },

        onUndoPress: function () {
            var aUndoStack,
                sLastKey,
                oModel;
            oModel = this.getView().getModel("AppState");
            this.getMyComponent().inEvent = true;
            // add the current model to the favorites (or update the values therein).
            aUndoStack = oModel.getProperty("/appState/uiState/editForm/undoStack");
            aUndoStack.pop();
            this.getMyComponent().inEvent = false;
            if (aUndoStack.length > 0) {
                sLastKey = aUndoStack[aUndoStack.length - 1];
                this.getRouter().navTo("editForm", { iAppState: sLastKey });
            } else {
                this.getMyComponent().inEvent = true;
                oModel.setProperty("/appState/uiState/editForm/undoStackPresent", aUndoStack.length > 0);
                this.getMyComponent().inEvent = false;
            }
        },

        onAfterRendering: function () {
            jQuery("input").on("focus", function (oEvent) {
                this.serializeUIState();
            }.bind(this));
            jQuery("input").on("focus", this.serializeUIState.bind(this));
            jQuery("input").change(this.serializeUIState.bind(this));
        },

        onDeletePress: function () {
            var that = this;
            // register a focus change event via jQuery

            jQuery("input").on("focus", function (oEvent) {
                that.serializeUIState();
            });
            jQuery("input").on("focus", this.serializeUIState.bind(this));
            jQuery("input").change(this.serializeUIState.bind(this));

            return;
        }
    });
});
