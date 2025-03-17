// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/playground/controller/BaseController"
], function (
    BaseController
) {
    "use strict";

    return BaseController.extend("sap.ushell.playground.controller.CardsDesignTime", {

        onInit: function () {
            this._fnOnPress = this._onPress.bind(this);
        },

        configureCard: function (sCardId, sEditorId, oEvent) {
            this.oCard = this.byId(sCardId);
            this.oEditor = this.byId(sEditorId);

            this.oEditor.setValue("");

            if (!this.oDialogPromise) {
                this.oDialogPromise = this._createDialog();
            }

            if (!this.oCardEditorPromise) {
                this.oCardEditorPromise = this._getCardEditor();
            }

            Promise.all([
                this.oCardEditorPromise,
                this.oDialogPromise
            ]).then(function (aResults) {
                var CardEditor = aResults[0];
                this.oCardEditor = new CardEditor({
                    previewPosition: "right",
                    card: this.oCard,
                    mode: "admin"
                });
                this.oDialog = aResults[1];

                this.oDialog.removeAllContent();
                this.oDialog.addContent(this.oCardEditor);
                this.oDialog.getBeginButton()
                    .detachPress(this._fnOnPress)
                    .attachPress(this._fnOnPress);
                this.oDialog.open();
            }.bind(this));
        },

        _onPress: function () {
            this.oCard.setManifestChanges([this.oCardEditor.getCurrentSettings()]);
            this.oEditor.setValue(JSON.stringify(this.oCard.getManifestChanges(), null, 4));
            this.oDialog.close();
        },

        _getCardEditor: function () {
            return new Promise(function (resolve, reject) {
                sap.ui.require(["sap/ui/integration/designtime/editor/CardEditor"], resolve, reject);
            });
        },

        _createDialog: function () {
            return new Promise(function (resolve, reject) {
                sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/m/ButtonType"], function (Dialog, Button, ButtonType) {
                    var oDialog = new Dialog({
                        beginButton: new Button({
                            text: "Save",
                            type: ButtonType.Emphasized
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                oDialog.close();
                            }
                        }),
                        afterClose: function () {
                            // oDialog.destroy();
                        }
                    });
                    resolve(oDialog);
                }, reject);
            });
        }
    });
});
