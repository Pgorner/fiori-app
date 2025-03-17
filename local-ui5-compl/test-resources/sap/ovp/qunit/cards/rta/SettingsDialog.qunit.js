/*global QUnit*/
sap.ui.define([
    "sap/ovp/cards/rta/SettingsDialogConstants",
    "sap/ovp/cards/SettingsUtils",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Element"
], function(
    SettingsDialogConstants,
    SettingsUtils,
    Controller,
    JSONModel,
    CoreElement
) {
    "use strict";

    var oController;
    QUnit.module("sap.ovp.cards.rta.SettingsDialog", {
        beforeEach: function() {
            return Controller.create({
                name: "sap.ovp.cards.rta.SettingsDialog"
            }).then(function(controller) {
                oController = controller;
            });
        },
        afterEach: function() {
            oController.destroy();
        }
    });

    QUnit.test("Independent functions test", function(assert) {
        assert.ok(oController.getValueInRemString("48") === "48rem", "Function ---> getValueInRemString");
    });

    QUnit.test("Testing Reordering, Addition & Deletion of static link list line items", function(assert) {
        var oUpdateCardStub = sinon.stub(oController, "updateCard"),
            oSelectAndScrollStub = sinon.stub(oController, "_setSelectedItemAndScrollToElement"),
            oVisibilityModel = new JSONModel({
                staticLink: {},
                links: {},
                removeVisual: {},
                showMore: {},
                delete: true,
            }),
            oModel = new JSONModel({
                staticContent: ["first", "second", "third"],
                selectedItemIndex: 0,
                lineItemIdCounter: 2,
            }),
            oEvent = {
                getSource: function() {
                    return {
                        getModel: function(sModelName) {
                            if (sModelName) {
                                return oVisibilityModel;
                            } else {
                                return oModel;
                            }
                        },
                    };
                },
            },
            oResult,
            sId,
            sIndex,
            iLineItemIdCounter;

        // Moving Bottom
        oController.onPressMoveToTheBottom(oEvent);
        oResult = ["second", "third", "first"];
        assert.ok(
            oController._getStaticContentArray(oModel).toString() == oResult.toString(),
            "Reodering ---> Moving first line item to the bottom"
        );

        // Moving Down
        oController.onPressMoveDown(oEvent);
        oResult = ["third", "second", "first"];
        assert.ok(
            oController._getStaticContentArray(oModel).toString() == oResult.toString(),
            "Reodering ---> Moving first line item one position down"
        );
        oModel.setProperty("/selectedItemIndex", 1);

        // Moving Up
        oController.onPressMoveUp(oEvent);
        oResult = ["second", "third", "first"];
        assert.ok(
            oController._getStaticContentArray(oModel).toString() == oResult.toString(),
            "Reodering ---> Moving second line item one position up"
        );
        oModel.setProperty("/selectedItemIndex", 2);

        // Moving Top
        oController.onPressMoveToTheTop(oEvent);
        oResult = ["first", "second", "third"];
        assert.ok(
            oController._getStaticContentArray(oModel).toString() == oResult.toString(),
            "Reodering ---> Moving last line item to the top"
        );

        // Adding a line item
        iLineItemIdCounter = oModel.getProperty("/lineItemIdCounter");
        sId = oController._makeLinkListItemId(iLineItemIdCounter + 1);
        sIndex = oController._makeLinkListItemIndex(iLineItemIdCounter + 1);
        oController.onPressAdd(oEvent);
        oResult = {
            id: sId,
            index: sIndex,
            title: "Default Title",
            subTitle: "Default SubTitle",
            imageUri: "",
            imageAltText: "",
            targetUri: "",
            openInNewWindow: "",
        };

        assert.ok(
            JSON.stringify(oController._getStaticContentArray(oModel)[0]) == JSON.stringify(oResult),
            "Addition ---> Adding a new item on top --> Object compare"
        );
        assert.ok(
            oVisibilityModel.getProperty("/staticLink")[sIndex] == true,
            "Addition ---> Adding a new item on top --> Visibility Model staticLink property check"
        );
        assert.ok(
            oVisibilityModel.getProperty("/links")[sIndex] == false,
            "Addition ---> Adding a new item on top --> Visibility Model links property check"
        );
        assert.ok(
            oVisibilityModel.getProperty("/removeVisual")[sIndex] == false,
            "Addition ---> Adding a new item on top --> Visibility Model removeVisual property check"
        );
        assert.ok(
            oVisibilityModel.getProperty("/showMore")[sIndex] == false,
            "Addition ---> Adding a new item on top --> Visibility Model showMore property check"
        );
        oModel.setProperty("/selectedItemIndex", 0);

        // Deleting a line item
        oController.onPressDelete(oEvent);

        var oOkButton = CoreElement.getElementById("__mbox-btn-0");
        oOkButton.firePress();

        oResult = ["first", "second", "third"];
        var fnDone = assert.async();
        setTimeout(function() {
            assert.ok(
                oController._getStaticContentArray(oModel).length == 3,
                "Deletion ---> Deleting a new item on top --> Checking array length"
            );
            assert.ok(
                oController._getStaticContentArray(oModel).toString() == oResult.toString(),
                "Deletion ---> Deleting a new item on top --> Checking array"
            );
            assert.ok(
                !oVisibilityModel.getProperty("/staticLink")[sIndex],
                "Deletion ---> Deleting a new item on top --> Visibility Model staticLink property check"
            );
            assert.ok(
                !oVisibilityModel.getProperty("/links")[sIndex],
                "Deletion ---> Deleting a new item on top --> Visibility Model links property check"
            );
            assert.ok(
                !oVisibilityModel.getProperty("/removeVisual")[sIndex],
                "Deletion ---> Deleting a new item on top --> Visibility Model removeVisual property check"
            );
            assert.ok(
                !oVisibilityModel.getProperty("/showMore")[sIndex],
                "Deletion ---> Deleting a new item on top --> Visibility Model showMore property check"
            );
            oSelectAndScrollStub.restore();
            oUpdateCardStub.restore();
            fnDone();
        }, 300);
    });

    QUnit.test("Function test ---> addView ---> On Add view button clicked", function(assert) {
        var oResetAndSaveButtonStub = sinon.stub(oController, "setEnablePropertyForResetAndSaveButton"),
            oHandleErrorHandlingStub = sinon.stub(oController, "handleErrorHandling"),
            oSelectViewSwitchStub = sinon.stub(oController, "selectViewSwitch"),
            oViewStub = sinon.stub(oController, "getView").returns({
                getModel: function() {
                    return null;
                },
            }),
            oEvent = {};
        oController._oCardManifestSettings = {
            tabs: [{
                    entitySet: "A",
                },
                {
                    entitySet: "B",
                },
            ],
            aViews: [{}, {}, {}],
            lineItem: [{
                value: "LA",
            }, ],
            defaultViewSelected: 1,
            allEntitySet: [{
                    name: "My name is A",
                    value: "A",
                },
                {
                    name: 'No label defined - "B"',
                    value: "B",
                },
            ],
            newViewCounter: 0,
        };
        var result = {
            tabs: [{
                    entitySet: "A",
                },
                {
                    entitySet: "B",
                },
                {
                    annotationPath: "LA",
                    value: "View 1",
                    entitySet: "A",
                },
            ],
            aViews: [{},
                {},
                {},
                {
                    text: "View 1",
                    key: 3,
                    isLaterAddedView: true,
                    isViewResetEnabled: false,
                },
            ],
            lineItem: [{
                value: "LA",
            }, ],
            defaultViewSelected: 1,
            allEntitySet: [{
                    name: "My name is A",
                    value: "A",
                },
                {
                    name: 'No label defined - "B"',
                    value: "B",
                },
            ],
            newViewCounter: 1,
            showViewSwitchButton: true,
        };
        oController.addView(oEvent);
        assert.ok(
            JSON.stringify(oController._oCardManifestSettings) === JSON.stringify(result),
            "On click of add view entity set 'A' should be added as the default entity set for new tab"
        );
        oResetAndSaveButtonStub.restore();
        oHandleErrorHandlingStub.restore();
        oSelectViewSwitchStub.restore();
        oViewStub.restore();
        oController._oCardManifestSettings = {};
    });

    QUnit.test("Function test ---> selectViewSwitch ---> On Selection of a different view", function(assert) {
        var oResetAndSaveButtonStub = sinon.stub(oController, "setEnablePropertyForResetAndSaveButton"),
            oHandleErrorHandlingStub = sinon.stub(oController, "handleErrorHandling"),
            oCardWithRefreshStub = sinon.stub(oController, "_fCardWithRefresh"),
            oResetSupportingObjectsStub = sinon.stub(oController, "resetSupportingObjectsOnEntitySetChange"),
            oViewStub = sinon.stub(oController, "getView").returns({
                getModel: function() {
                    return {
                        refresh: function() {},
                    };
                },
                byId: function() {
                    return {
                        getVisible: function() {
                            return true;
                        },
                        getComponentInstance: function() {
                            return {
                                getRootControl: function() {
                                    return {
                                        getController: function() {
                                            return {
                                                changeSelection: function() {},
                                            };
                                        },
                                    };
                                },
                            };
                        },
                    };
                },
            }),
            iSelectedKey = 0,
            oEvent = {
                getSource: function() {
                    return {
                        getSelectedIndex: function() {
                            return iSelectedKey;
                        },
                    };
                },
            };
        oController._oCardManifestSettings = {
            tabs: [{
                    entitySet: "A",
                },
                {
                    entitySet: "B",
                },
            ],
            aViews: [{}, {}, {}],
            defaultViewSelected: 1,
            metaModel: {
                getODataEntitySet: function(sEntitySet) {
                    if (sEntitySet === "A") {
                        return {
                            entityType: "A",
                            name: "A",
                        };
                    } else if (sEntitySet === "B") {
                        return {
                            entityType: "B",
                            name: "B",
                        };
                    } else if (sEntitySet === "C") {
                        return {
                            entityType: "C",
                            name: "C",
                        };
                    }
                    return {};
                },
                getODataEntityType: function(sEntityType) {
                    if (sEntityType === "A") {
                        return {
                            "sap:label": "My name is A",
                        };
                    } else if (sEntityType === "B") {
                        return {
                            "sap:label": "My name is B",
                        };
                    } else if (sEntityType === "C") {
                        return {
                            "sap:label": "My name is C",
                        };
                    }
                    return {};
                },
            },
        };
        var result = {
            "sap:label": "My name is A",
        };
        oController.selectViewSwitch(oEvent);
        assert.ok(
            JSON.stringify(oController._oCardManifestSettings.entityType) === JSON.stringify(result),
            "Entity Type value is set to Entity Set 'A' object"
        );
        result = {
            "sap:label": "My name is B",
        };
        oController.selectViewSwitch(oEvent, 2);
        assert.ok(
            JSON.stringify(oController._oCardManifestSettings.entityType) === JSON.stringify(result),
            "Entity Type value is set to Entity Set 'B' object"
        );
        result = {
            "sap:label": "My name is A",
        };
        oController.selectViewSwitch(oEvent, 1);
        assert.ok(
            JSON.stringify(oController._oCardManifestSettings.entityType) === JSON.stringify(result),
            "Entity Type value is set to Entity Set 'A' object"
        );
        oResetAndSaveButtonStub.restore();
        oHandleErrorHandlingStub.restore();
        oCardWithRefreshStub.restore();
        oResetSupportingObjectsStub.restore();
        oViewStub.restore();
        oController._oCardManifestSettings = {};
    });

    QUnit.test("Function test ---> resetSupportingObjectsOnEntitySetChange", function(assert) {
        var oMetaModel = {
            getODataEntityContainer: function() {
                return {
                    entitySet: [{
                            entityType: "A",
                            name: "A",
                        },
                        {
                            entityType: "B",
                            name: "B",
                        },
                        {
                            entityType: "C",
                            name: "C",
                        },
                    ],
                };
            },
            getODataEntitySet: function(sEntitySet) {
                if (sEntitySet === "A") {
                    return {
                        entityType: "A",
                        name: "A",
                    };
                } else if (sEntitySet === "B") {
                    return {
                        entityType: "B",
                        name: "B",
                    };
                } else if (sEntitySet === "C") {
                    return {
                        entityType: "C",
                        name: "C",
                    };
                }
                return {};
            },
            getODataEntityType: function(sEntityType) {
                if (sEntityType === "A") {
                    return {
                        "sap:label": "My name is A",
                    };
                } else if (sEntityType === "B") {
                    return {
                        "sap:label": "My name is B",
                    };
                } else if (sEntityType === "C") {
                    return {
                        "sap:label": "My name is C",
                    };
                }
                return {};
            },
        };
        var oData = {
            addNewCard: false,
            tabs: [{
                    entitySet: "A",
                    value: "View A",
                },
                {
                    entitySet: "B",
                    value: "View B",
                },
            ],
            aViews: [{}, {}, {}],
            defaultViewSelected: 1,
            selectedKey: 0,
            metaModel: oMetaModel,
        };
        var result = {
            addNewCard: false,
            tabs: [{
                    entitySet: "A",
                    value: "View A",
                },
                {
                    entitySet: "B",
                    value: "View B",
                },
            ],
            aViews: [{
                    text: "Basic Card Attributes",
                    key: 0,
                    isLaterAddedView: false,
                    isViewResetEnabled: false,
                },
                {
                    text: "View A (Default View)",
                    key: 1,
                    initialSelectedKey: 1,
                    isLaterAddedView: false,
                    isViewResetEnabled: false,
                },
                {
                    text: "View B",
                    key: 2,
                    initialSelectedKey: 2,
                    isLaterAddedView: false,
                    isViewResetEnabled: false,
                },
            ],
            defaultViewSelected: 1,
            selectedKey: 0,
            metaModel: oMetaModel,
            allEntitySet: [{
                    name: "My name is A",
                    value: "A",
                },
                {
                    name: "My name is B",
                    value: "B",
                },
                {
                    name: "My name is C",
                    value: "C",
                },
            ],
            KPINav: "",
            newViewCounter: 0,
            isViewResetEnabled: false,
        };
        oController.resetSupportingObjectsOnEntitySetChange(oData, 1);
        assert.ok(
            JSON.stringify(oData) === JSON.stringify(result),
            "Case where selectedKey is 0 and defaultViewSelected is 1"
        );

        oData.selectedKey = 1;
        result = {
            addNewCard: false,
            tabs: [{
                    entitySet: "A",
                    value: "View A",
                },
                {
                    entitySet: "B",
                    value: "View B",
                },
            ],
            aViews: [{
                    text: "Basic Card Attributes",
                    key: 0,
                    isLaterAddedView: false,
                    isViewResetEnabled: false,
                },
                {
                    text: "View A",
                    key: 1,
                    initialSelectedKey: 1,
                    isLaterAddedView: false,
                    isViewResetEnabled: false,
                },
                {
                    text: "View B (Default View)",
                    key: 2,
                    initialSelectedKey: 2,
                    isLaterAddedView: false,
                    isViewResetEnabled: false,
                },
            ],
            defaultViewSelected: 2,
            selectedKey: 1,
            metaModel: {},
            allEntitySet: [{
                    name: "My name is A",
                    value: "A",
                },
                {
                    name: "My name is B",
                    value: "B",
                },
                {
                    name: "My name is C",
                    value: "C",
                },
            ],
            KPINav: "",
            newViewCounter: 0,
            isViewResetEnabled: false,
        };
        oController.resetSupportingObjectsOnEntitySetChange(oData, 2);
        assert.ok(
            JSON.stringify(oData) === JSON.stringify(result),
            "Case where selectedKey is 1 and defaultViewSelected is 2"
        );
    });

    QUnit.test("Function test ---> _fCardWithRefresh ---> updating entitySet property", function(assert) {
        var oManifest = {
                cards: {
                    card009: {
                        model: "salesOrder",
                        template: "sap.ovp.cards.list",
                        settings: {
                            title: "Contract Monitoring",
                            subTitle: "Per Supplier",
                            valueSelectionInfo: "Total contract volume",
                            listFlavor: "bar",
                            listType: "extended",
                            showLineItemDetail: true,
                            tabs: [{
                                    entitySet: "SalesOrderSet",
                                    dynamicSubtitleAnnotationPath: "com.sap.vocabularies.UI.v1.HeaderInfo#dynamicSubtitle",
                                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#View1",
                                    selectionAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#line1",
                                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#line",
                                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#line",
                                    value: "{{dropdown_value2}}",
                                },
                                {
                                    entitySet: "SalesOrderSet",
                                    dynamicSubtitleAnnotationPath: "com.sap.vocabularies.UI.v1.HeaderInfo#dynamicSubtitle",
                                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#View3",
                                    presentationAnnotationPath: "com.sap.vocabularies.UI.v1.PresentationVariant#SP3",
                                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification",
                                    dataPointAnnotationPath: "com.sap.vocabularies.UI.v1.DataPoint#line",
                                    value: "{{dropdown_value3}}",
                                },
                                {
                                    entitySet: "ProductSet",
                                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem",
                                    identificationAnnotationPath: "com.sap.vocabularies.UI.v1.Identification#identify1",
                                    value: "{{dropdown_value1}}",
                                },
                            ],
                        },
                    },
                },
            },
            oResetSupportingObjectsStub = sinon.stub(oController, "resetSupportingObjectsOnEntitySetChange"),
            oViewStub = sinon.stub(oController, "getView").returns({
                getModel: function() {
                    return {
                        refresh: function() {},
                    };
                },
                byId: function() {
                    return {
                        getVisible: function() {
                            return true;
                        },
                        getComponentInstance: function() {
                            return {
                                getRootControl: function() {
                                    return {
                                        getController: function() {
                                            return {
                                                changeSelection: function() {},
                                            };
                                        },
                                    };
                                },
                                getComponentData: function() {
                                    return {
                                        manifest: oManifest,
                                        cardId: "card009",
                                    };
                                },
                            };
                        },
                    };
                },
            }),
            oCreateCardStub = sinon.stub(oController, "createCard"),
            oEvent = {};
        oController._oCardManifestSettings = {
            tabs: [{
                    entitySet: "A",
                },
                {
                    entitySet: "B",
                    annotationPath: "com.sap.vocabularies.UI.v1.LineItem#View3",
                },
            ],
            dynamicSubtitleAnnotationPath: "com.sap.vocabularies.UI.v1.HeaderInfo#dynamicSubtitle",
            aViews: [{}, {}, {}],
            defaultViewSelected: 1,
            metaModel: {
                getODataEntitySet: function(sEntitySet) {
                    if (sEntitySet === "A") {
                        return {
                            entityType: "A",
                            name: "A",
                        };
                    } else if (sEntitySet === "B") {
                        return {
                            entityType: "B",
                            name: "B",
                        };
                    } else if (sEntitySet === "C") {
                        return {
                            entityType: "C",
                            name: "C",
                        };
                    }
                    return {};
                },
                getODataEntityType: function(sEntityType) {
                    if (sEntityType === "A") {
                        return {
                            "sap:label": "My name is A",
                        };
                    } else if (sEntityType === "B") {
                        return {
                            "sap:label": "My name is B",
                        };
                    } else if (sEntityType === "C") {
                        return {
                            "sap:label": "My name is C",
                        };
                    }
                    return {};
                },
            },
            entitySet: "C",
            selectedKey: 2,
        };
        var result = {
            "sap:label": "My name is C",
        };
        oController._fCardWithRefresh(oEvent, "entitySet");
        assert.ok(
            JSON.stringify(oController._oCardManifestSettings.entityType) === JSON.stringify(result),
            "Entity Type value is set to Entity Set 'C' object"
        );
        SettingsDialogConstants.resetTabFields.forEach(function(field) {
            assert.ok(
                !JSON.stringify(oController._oCardManifestSettings[field]),
                "Removed field '" + field + "' on Global Level"
            );
            assert.ok(
                !JSON.stringify(oController._oCardManifestSettings.tabs[1][field]),
                "Removed field '" + field + "' on Tab Level"
            );
        });
        oResetSupportingObjectsStub.restore();
        oViewStub.restore();
        oCreateCardStub.restore();
        oController._oCardManifestSettings = {};
    });
    //On card type select
    QUnit.test("Function test --> onCardTypeSelected --> Selecting list card from drop down", function(assert) {
        oController._oCardManifestSettings.addNewCard = true;
        oController._oCardManifestSettings.model = "ModelA";
        var oEvent = {
            getSource: function() {
                return {
                    getSelectedKey: function(sModelName) {
                        return "sap.ovp.cards.list";
                    },
                };
            },
            getParameters: function() {
                return {
                    id: "settingsView--sapOVPCardType",
                };
            },
        };
        var oCardProperties = {};
        var oViewStub = sinon.stub(oController, "getView").returns({
            getModel: function(modelName) {
                return {
                    setProperty: function(prop, bool) {
                        oCardProperties[prop] = bool;
                        return true;
                    },
                    refresh: function() {
                        return true;
                    },
                    getData: function() {
                        return oCardProperties;
                    },
                };
            },
            byId: function(id) {
                return {
                    setSelected: function(bool) {
                        return true;
                    },
                };
            },
        });
        var fnResetErrorHandling = sinon.stub(SettingsUtils, "resetErrorHandling");
        var fnsetEnablePropertyForResetAndSaveButton = sinon.stub(oController, "setEnablePropertyForResetAndSaveButton");
        oController.onCardTypeSelected(oEvent);
        assert.ok(SettingsUtils.oVisibility.addKPIHeader === true, "KPI header checkbox visibility is set to true");
        assert.ok(SettingsUtils.oVisibility.setEntitySet === true, "Entity set visibility is set to true");
        assert.ok(
            oCardProperties["/dataPoint"] === false,
            "Data point field wouldn't be visible when add kpi header checkbox is not selected"
        );
        assert.ok(
            oCardProperties["/valueSelectionInfo"] === false,
            "Data point field wouldn't be visible when add kpi header checkbox is not selected"
        );
        assert.ok(
            oCardProperties["/requiredSubTitle"] === false,
            "Subtitle field wouldn't be mandatory when add kpi header checkbox is not selected"
        );
        fnResetErrorHandling.restore();
        fnsetEnablePropertyForResetAndSaveButton.restore();
        oViewStub.restore();
    });

    //On Datasource select
    QUnit.test("Function test --> onDatasourceComboboxChanged -->  from drop down", function(assert) {
        oController._oCardManifestSettings.addNewCard = true;
        oController._oCardManifestSettings.datasources = [{
            name: "Z_OVP_DEMO_TESTING_CDS",
            getMetaModel: function() {},
        }, ];
        var oEvent = {
            getParameters: function() {
                return {
                    id: "settingsView--sapOVPDataSource",
                    value: "Z_OVP_DEMO_TESTING_CDS",
                };
            },
        };
        var oViewStub = sinon.stub(oController, "getView").returns({
            getModel: function(modelName) {
                return {
                    refresh: function() {
                        return true;
                    },
                };
            },
        });
        var fnAddSupportingObjects = sinon.stub(SettingsUtils, "addSupportingObjects").callsFake(function(oData) {
            oData.allEntitySet = [{
                entityType: "EntityType",
                name: "A",
                value: "Entity",
            }, ];
        });
        var fnHandleValueStateOfComboBox = sinon.stub(oController, "handleValueStateofComboBox");
        var fnResetErrorHandling = sinon.stub(SettingsUtils, "resetErrorHandling");
        var fnsetEnablePropertyForResetAndSaveButton = sinon.stub(oController, "setEnablePropertyForResetAndSaveButton");
        oController.onDatasourceComboboxChanged(oEvent);
        assert.ok(SettingsUtils.oVisibility.selectCardType === true, "Select card type visibility is set to true");
        assert.ok(oController._oCardManifestSettings.model === "Z_OVP_DEMO_TESTING_CDS", "model is selected");
        oViewStub.restore();
        fnAddSupportingObjects.restore();
        fnResetErrorHandling.restore();
        fnsetEnablePropertyForResetAndSaveButton.restore();
    });

    // On entity set select
    QUnit.test("Function test --> onEntitySetChanged --> Selecting entity set from drop down", function(assert) {
        var sEntityType = "Z_Ovp_Demo_TestingType";
        var sId = "settingsView--sapOVPEntitySetList";
        SettingsUtils.bAddNewCardFlag = true;
        oController._oCardManifestSettings = {
            addNewCard: true,
            bAddNewCardFlag: true,
            model: "ModelA",
            template: "sap.ovp.cards.list",
            entitySet: "Entity",
            addKPIHeaderCheckBox: false,
            metaModel: {
                getObject: function() {
                    return [{
                        entityType: [{
                            name: "Z_Ovp_Demo_TestingType",
                            "com.sap.vocabularies.UI.v1.Identification": [{
                                Action: {
                                    String: "Display",
                                },
                                Label: {
                                    String: "OVP",
                                },
                                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                                SemanticObject: {
                                    String: "ABC",
                                },
                            }, ],
                        }, ],
                    }, ];
                },
                getODataEntityContainer: function() {
                    return {
                        entitySet: [{
                            name: "Entity",
                            entityType: "Demo_CDS.EntityType",
                        }, ],
                        namespace: "Demo_CDS",
                    };
                },
                getODataEntityType: function(sEntityType) {
                    return {
                        "sap:label": "A",
                    };
                },
            },
        };
        var oViewStub = sinon.stub(oController, "getView").returns({
            byId: function(sId) {
                return {
                    setSelected: function(bool) {
                        return true;
                    },
                };
            },
            getModel: function(modelName) {
                return {
                    getData: function() {
                        return {
                            showViewSwitch: false,
                        };
                    },
                    refresh: function() {
                        return true;
                    },
                };
            },
        });

        var result = {
            name: "Z_Ovp_Demo_TestingType",
            "com.sap.vocabularies.UI.v1.Identification": [{
                Action: {
                    String: "Display",
                },
                Label: {
                    String: "OVP",
                },
                RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
                SemanticObject: {
                    String: "ABC",
                },
            }, ],
        };
        var oEntity = [{
            entityType: "EntityType",
            name: "A",
            value: "Entity",
        }, ];

        var fnResetErrorHandling = sinon.stub(SettingsUtils, "resetErrorHandling");
        var fnsetEnablePropertyForResetAndSaveButton = sinon.stub(oController, "setEnablePropertyForResetAndSaveButton");
        oController.onEntitySetChanged(sEntityType, sId);

        assert.deepEqual(
            oController._oCardManifestSettings.entityType,
            result,
            "Stores entity type name with annotations"
        );
        assert.deepEqual(oController._oCardManifestSettings.allEntitySet, oEntity, "set Entity set");
        assert.ok(SettingsUtils.oVisibility.selectCardType === true, "Select card type visibility is set to true");
        assert.ok(oController._oCardManifestSettings.model === "ModelA", "model is selected");
        assert.ok(
            SettingsUtils.oVisibility.addODataSelect === true,
            "Add OData select checkbox field visibility set to true"
        );
        assert.ok(SettingsUtils.oVisibility.title === true, "Title field visibility set to true");
        assert.ok(SettingsUtils.oVisibility.subTitle === true, "Subtitle field visibility set to true");
        assert.ok(SettingsUtils.oVisibility.subTitleRequired === false, "Subtitle field is not mandatory");
        assert.ok(
            SettingsUtils.oVisibility.setAnnotationCardProperties === true,
            "Annotation properties section would be visible"
        );
        assert.ok(SettingsUtils.oVisibility.identification === true, "identification field would be visible");
        assert.ok(
            SettingsUtils.oVisibility.setCardProperties === true,
            "General card properties section would be visible"
        );
        assert.ok(SettingsUtils.oVisibility.listType === true, "list type field would be visible");
        assert.ok(SettingsUtils.oVisibility.listFlavor === true, "list flavor field would be visible");
        assert.ok(SettingsUtils.oVisibility.valueSelectionInfo === false, "value selection info field would be visible");
        oViewStub.restore();
        fnResetErrorHandling.restore();
        fnsetEnablePropertyForResetAndSaveButton.restore();
    });
});