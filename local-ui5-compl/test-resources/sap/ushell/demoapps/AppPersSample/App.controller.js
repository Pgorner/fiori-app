// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/m/MessageToast",
    "sap/ui/base/Object",
    "sap/ui/core/Component",
    "sap/ui/core/mvc/Controller"
], function (Log, MessageToast, BaseObject, Component, Controller) {
    "use strict";

    return Controller.extend("sap.ushell.demo.AppPersSample.App", {
        onInit: function () {
            // Read potentially existing personalization favorites.
            var that = this;
            var oId = {
                container: "sap.ushell.demo.FruitFavorites",
                item: "favorites"
            };

            this.oPersonalizationPromise = this.getOwnerComponent().getService("Personalization").then(function (oPersonalization) {
                var oPersonalizer,
                    oConstants;

                oConstants = oPersonalization.constants;
                oPersonalizer = oPersonalization.getPersonalizer(
                    oId, {
                    keyCategory: oConstants.keyCategory.FIXED_KEY,
                    writeFrequency: oConstants.writeFrequency.LOW,
                    clientStorageAllowed: true
                }, that.getMyComponent()
                );

                return {
                    personalizer: oPersonalizer,
                    constants: oConstants,
                    service: oPersonalization
                };
            }, function (oError) {
                throw new Error("Cannot get Personalization service: " + oError);
            });

            this.applyExistingFruitFavorites(oId);
            this.initIceCreamFavorites();
            this.initMilkshakeFavorites();
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        initIceCreamFavorites: function () {
            var that = this;

            //retrieve constants from namespace 'constants' of personalization service
            this.oPersonalizationPromise.then(function (oPersonalization) {
                var oConstants;
                oConstants = oPersonalization.constants;

                // Ice cream favorites
                that.getView().byId("btnSaveIceCream").setEnabled(false);

                oPersonalization.service.getContainer("sap.ushell.IceCreamFavorites", {
                    validity: 2,
                    keyCategory: oConstants.keyCategory.FIXED_KEY,
                    writeFrequency: oConstants.writeFrequency.LOW,
                    clientStorageAllowed: false
                }, that.getMyComponent())
                    .done(function (oContainer) {
                        var i,
                            aPanelIceCreamFavorites = that.getView() && that.getView().byId("PanelIceCreamFavorites") && that.getView().byId("PanelIceCreamFavorites").getContent();
                        if (!aPanelIceCreamFavorites) {
                            Log.error("View or control PanelIceCreamFavorites no longer present");
                            return;
                        }
                        that.oIceCreamContainer = oContainer;
                        for (i = 0; i < aPanelIceCreamFavorites.length; i = i + 1) {
                            if (BaseObject.isObjectA(aPanelIceCreamFavorites[i], "sap.m.CheckBox")) {
                                aPanelIceCreamFavorites[i].setSelected(that.oIceCreamContainer.getItemValue(String(i)) || false);
                            }
                        }
                        that.getView().byId("btnSaveIceCream").setEnabled(true);
                    });
            });
        },

        initMilkshakeFavorites: function () {
            // Ice cream favorites
            var that = this;

            //retrieve constants from namespace 'constants' of personalization service
            this.oPersonalizationPromise.then(function (oPersonalization) {
                var i,
                    aPanelMilkshakeFavorites = that.getView().byId("PanelMilkshakeFavorites").getContent(),
                    oConstants;

                oConstants = oPersonalization.constants;

                for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                    aPanelMilkshakeFavorites[i].setEnabled(false);
                }

                oPersonalization.service.getContainer("sap.ushell.MilkshakeFavorites", {
                    keyCategory: oConstants.keyCategory.FIXED_KEY,
                    clientStorageAllowed: true,
                    writeFrequency: oConstants.writeFrequency.LOW,
                    validity: 0 /*FLP window!*/
                }, that.getMyComponent())
                    .done(function (oContainer) {
                        aPanelMilkshakeFavorites = that.getView() && that.getView().byId("PanelMilkshakeFavorites") && that.getView().byId("PanelMilkshakeFavorites").getContent();
                        if (!aPanelMilkshakeFavorites) {
                            Log.error("View or control aPanelMilkshakeFavorites no longer present");
                            return;
                        }
                        that.oMilkshakeContainer = oContainer;
                        for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                            if (BaseObject.isObjectA(aPanelMilkshakeFavorites[i], "sap.m.CheckBox")) {
                                aPanelMilkshakeFavorites[i].setSelected(that.oMilkshakeContainer.getItemValue(String(i)) || false);
                            }
                            aPanelMilkshakeFavorites[i].setEnabled(true);
                        }
                    });
            });
        },

        /**
         * Gets the favorites from browser storage
         */
        applyExistingFruitFavorites: function () {
            var that = this;
            this.oPersonalizationPromise.then(function (oPersonalization) {
                oPersonalization.personalizer.getPersData()
                    .done(that.onFruitFavoritesRead.bind(that))
                    .fail(
                        function () {
                            Log.error("Reading personalization data failed");
                        });
            });
        },

        /**
         * Called by applyExistingFavorites Sets the check-boxes if
         * favorites were saved
         */
        onFruitFavoritesRead: function (aCheckBoxValues) {
            if (!aCheckBoxValues) {
                return;
            }

            for (var i = 0; i < aCheckBoxValues.length; i = i + 1) {
                this.getView().byId("PanelFruitFavorites")
                    .getContent()[i]
                    .setSelected(aCheckBoxValues[i]);
            }
        },

        /**
         * Called when "Save Fruit Favorites" button is pressed
         */
        onSaveFruitFavorites: function () {
            var aCheckBoxValues = [],
                i,
                aPanelFavorites = this._getNestedControl("PanelFruitFavorites", "sap.m.CheckBox");

            for (i = 0; i < aPanelFavorites.length; i = i + 1) {
                aCheckBoxValues[i] = aPanelFavorites[i].getSelected();
            }

            this.oPersonalizationPromise.then(function (oPersonalization) {
                oPersonalization.personalizer.setPersData(aCheckBoxValues);
            });
            // neither the done nor the fail is checked
        },

        /**
         * Called when "Save ice cream favorites is changed
         */
        onSaveIceCreamFavorites: function () {
            // the button is only available if we have loaded the data
            var aPanelIceCreamFavorites = this._getNestedControl("PanelIceCreamFavorites", "sap.m.CheckBox");

            for (var i = 0; i < aPanelIceCreamFavorites.length; i = i + 1) {
                var bSelected = aPanelIceCreamFavorites[i].getSelected();
                this.oIceCreamContainer.setItemValue(String(i), bSelected);
            }

            this.oIceCreamContainer.save()
                .then(function () {
                    MessageToast.show("Ice cream personalization was saved");
                }, function (oError) {
                    MessageToast.show("Error!");
                    Log.error("An error occurred while deleting ice cream personalization", oError);
                });
        },
        /**
         * Called when "Save ice cream favorites is changed
         */
        onMilkshakeChanged: function () {
            // the button is only available if we have loaded the data
            var aPanelMilkshakeFavorites = this.getView().byId("PanelMilkshakeFavorites").getContent(),
                i;
            for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                if (BaseObject.isObjectA(aPanelMilkshakeFavorites[i], "sap.m.CheckBox")) {
                    this.oMilkshakeContainer.setItemValue(String(i), aPanelMilkshakeFavorites[i].getSelected());
                }
            }
            this.oMilkshakeContainer.save(); // TODO Deferred
            // neither the done nor the fail is checked
        },

        onDeleteFruitPersonalization: function () {
            this.oPersonalizationPromise.then(function (oPersonalization) {
                oPersonalization.personalizer.delPersData()
                    .then(function () {
                        MessageToast.show("Fruit Personalization was deleted");
                        this._deselectAllCheckboxes("PanelFruitFavorites");
                    }.bind(this), function (oError) {
                        MessageToast.show("Error!");
                        Log.error("An error occurred while deleting fruit personalization", oError);
                    });
            }.bind(this));
        },

        onDeleteIceCreamPersonalization: function () {
            this.oIceCreamContainer.getItemKeys().forEach(function (sPersKey) {
                this.oIceCreamContainer.delItem(sPersKey);
            }.bind(this));
            this.oIceCreamContainer.save()
                .then(function () {
                    MessageToast.show("Ice cream personalization was deleted");
                    this._deselectAllCheckboxes("PanelIceCreamFavorites");
                }.bind(this), function (oError) {
                    MessageToast.show("Error!");
                    Log.error("An error occurred while deleting ice cream personalization", oError);
                });
        },

        onDestroy: function () {
            this.oMilkshakeContainer.save();
        },

        _deselectAllCheckboxes: function (sParentControlId) {
            this._getNestedControl(sParentControlId, "sap.m.CheckBox").forEach(function (oCheckbox) {
                oCheckbox.setSelected(false);
            });
        },

        _getNestedControl: function (sParentControlId, sType) {
            return this.getView().byId(sParentControlId).getContent()
                .filter(function (oContent) {
                    return oContent.isA(sType);
                });
        }
    });
});
