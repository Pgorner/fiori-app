// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/shell/Settings/userDefaults/controller/UserDefaultsSetting.controller",
    "sap/ushell/resources",
    "sap/m/MessageBox",
    "sap/ui/base/ManagedObject",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    Log,
    XMLView,
    Controller,
    JSONModel,
    UserDefaultsSettingController,
    resources,
    MessageBox,
    ManagedObject,
    ODataModel,
    jQuery,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("onInit", {
        beforeEach: function () {

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").rejects();
            this.oGetServiceAsyncStub.withArgs("UserDefaultParameters").resolves({});
            sandbox.stub(Container, "getLogonSystem").returns({
                isTrial: sandbox.stub().returns(false)
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Create View", function (assert) {
        // Act
        return XMLView.create({
            id: "defaultParametersSelector",
            viewName: "sap.ushell.components.shell.Settings.userDefaults.view.UserDefaultsSetting"
        }).then(function (oView) {
            // Assert
            var oController = oView.getController();
            assert.deepEqual(oController.oModelRecords, {}, "The map of models was initalized.");
            assert.deepEqual(oController.aChangedParamsNames, [], "The map of changed parameters was initalized.");
            assert.deepEqual(oController.oBlockedParameters, {}, "The map of blocked parameters was initalized.");
            assert.deepEqual(oController.oOriginalParameters, {}, "The map of original parameters was initalized.");
            assert.deepEqual(oController.aDisplayedUserDefaults, [], "The array of displayed parameters was initalized.");
            assert.strictEqual(oController.oDirtyStateModel.getProperty("/isDirty"), false, "The dirty flag was initalized.");
            assert.strictEqual(oController.oDirtyStateModel.getProperty("/selectedVariant"), null, "The variantSelected flag was initalized.");

            oView.destroy();
        });
    });

    QUnit.module("The function getSystemContextsModel", {
        beforeEach: function () {

            this.oGetSystemContextStub = sandbox.stub().resolves({ id: "defaultSystemContext" });
            this.oGetSystemContextStub.withArgs("firstContentProvider").resolves({ id: "firstSystemContext" });
            this.oGetSystemContextStub.withArgs("secondContentProvider").resolves({ id: "secondSystemContext" });
            this.oGetSystemContextStub.withArgs("thirdContentProvider").resolves({ id: "thirdSystemContext" });


            this.oHasRelevantMaintainableParametersStub = sandbox.stub().callsFake(function (oSystemContext) {
                var sSystemContextId = oSystemContext.id;
                if (sSystemContextId === "firstSystemContext") {
                    return Promise.resolve(true);
                } else if (sSystemContextId === "secondSystemContext") {
                    return Promise.resolve(true);
                } else if (sSystemContextId === "thirdSystemContext") {
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            });

            sandbox.stub(Container, "getServiceAsync").callsFake(function (sServiceName) {
                if (sServiceName === "CommonDataModel") {
                    return Promise.resolve({
                        getContentProviderIds: this.oGetContentProviderIdsStub
                    });
                }
                if (sServiceName === "ClientSideTargetResolution") {
                    return Promise.resolve({ getSystemContext: this.oGetSystemContextStub });
                }
                if (sServiceName === "UserDefaultParameters") {
                    return Promise.resolve({
                        hasRelevantMaintainableParameters: this.oHasRelevantMaintainableParametersStub
                    });
                }
                return undefined;
            }.bind(this));



            this.oController = new UserDefaultsSettingController();

            this.oGetContentProviderIdsStub = sandbox.stub(this.oController, "_getContentProviderIds")
                .resolves(["firstContentProvider", "secondContentProvider", "thirdContentProvider"]);
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls the right functions and sets the correct model", function (assert) {
        // Arrange
        var oExpectedSystemContexts = {
            selectedKey: "firstSystemContext",
            systemContexts: [
                { id: "firstSystemContext" },
                { id: "secondSystemContext" },
                { id: "thirdSystemContext" }
            ]
        };

        // Act
        return this.oController.getSystemContextsModel().then(function (oModel) {
            //Assert
            assert.deepEqual(oModel.getData(), oExpectedSystemContexts, "the correct systemContexts model was created");
        });
    });

    QUnit.test("Filters out non relevant systemContexts", function (assert) {
        // Arrange
        var oExpectedSystemContexts = {
            selectedKey: "firstSystemContext",
            systemContexts: [
                { id: "firstSystemContext" },
                { id: "secondSystemContext" }
            ]
        };

        this.oHasRelevantMaintainableParametersStub = sandbox.stub().callsFake(function (oSystemContext) {
            var sSystemContextId = oSystemContext.id;
            if (sSystemContextId === "firstSystemContext") {
                return Promise.resolve(true);
            } else if (sSystemContextId === "secondSystemContext") {
                return Promise.resolve(true);
            } else if (sSystemContextId === "thirdSystemContext") {
                return Promise.resolve(false);
            }
            return Promise.resolve(false);
        });

        // Act
        return this.oController.getSystemContextsModel().then(function (oModel) {
            //Assert
            assert.deepEqual(oModel.getData(), oExpectedSystemContexts, "the correct systemContexts model was created");
        });
    });

    QUnit.test("Adds an empty contentProvider if there are none", function (assert) {
        // Arrange
        this.oGetContentProviderIdsStub.resolves([]);
        var oExpectedSystemContexts = { systemContexts: [], selectedKey: "" };

        // Act
        return this.oController.getSystemContextsModel().then(function (oModel) {
            //Assert
            assert.deepEqual(this.oGetSystemContextStub.getCall(0).args, [""], "getSystemContext was called with the right arguments");
            assert.strictEqual(this.oGetSystemContextStub.callCount, 1, "getSystemContext was called exactly once");
            assert.deepEqual(oModel.getData(), oExpectedSystemContexts, "the correct systemContexts model was created");
        }.bind(this));
    });

    QUnit.module("The function _getContentProviderIds", {
        beforeEach: function () {
            this.SystemContextIds = { id: "SomeSystemContexts" };

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetContentProviderIdsStub = sandbox.stub().resolves(this.SystemContextIds);
            this.oGetServiceAsyncStub.withArgs("CommonDataModel").resolves({
                getContentProviderIds: this.oGetContentProviderIdsStub
            });

            this.oController = new UserDefaultsSettingController();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns a promise which resolves to the default systemContext if CDM Service is not available", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("CommonDataModel").rejects();

        // Act
        return this.oController._getContentProviderIds().then(function (oReturn) {
            // Assert
            assert.deepEqual(oReturn, [""], "The return resolved to an array with an empty string");
            assert.strictEqual(this.oGetContentProviderIdsStub.callCount, 0, "getContentProviderIds was not called");
        }.bind(this));
    });

    QUnit.test("Returns a promise which resolves to systemContexts provided by CSTR if CDM Servcice is available", function (assert) {
        // Arrange

        // Act
        return this.oController._getContentProviderIds().then(function (oReturn) {
            // Assert
            assert.deepEqual(oReturn, this.SystemContextIds, "The return resolved to defaultcontexts");
            assert.strictEqual(this.oGetContentProviderIdsStub.callCount, 1, "getContentProviderIds was called once");
        }.bind(this));
    });

    QUnit.module("The function handleSystemContextChanged", {
        beforeEach: function () {
            this.oController = new UserDefaultsSettingController();
            this.oMessageBoxShowStub = sandbox.stub(MessageBox, "show");
            this.oFillGroupsStub = sandbox.stub(this.oController, "_fillGroups");
            this.oOnSaveStub = sandbox.stub(this.oController, "onSave");

            this.oSetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub().withArgs("systemContexts").returns({
                setProperty: this.oSetPropertyStub
            });
            this.oGetViewStub = sandbox.stub(this.oController, "getView").returns({ getModel: this.oGetModelStub });

            this.sLastSelectedKeyMock = "LastSelectedKey";
            this.oController.sLastSelectedKey = this.sLastSelectedKeyMock;

            this.oController.oDirtyStateModel = new JSONModel({
                isDirty: true,
                selectedVariant: null
            });
            sandbox.stub(this.oController, "_setSmartVariantModified");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls _fillGroups if the dirty state is false", function (assert) {
        // Arrange
        this.oController.oDirtyStateModel.setProperty("/isDirty", false);

        // Act
        this.oController.handleSystemContextChanged();

        // Assert
        assert.strictEqual(this.oMessageBoxShowStub.callCount, 0, "There was no MessageBox shown");
        assert.strictEqual(this.oFillGroupsStub.callCount, 1, "fillGroups was called exactly once");
    });

    QUnit.test("onClose of the created messageBox calls the right functions when called with 'discard'", function (assert) {
        // Arrange

        // Act
        this.oController.handleSystemContextChanged();
        this.oMessageBoxShowStub.getCall(0).args[1].onClose(resources.i18n.getText("userDefaultsDiscard"));

        // Assert
        assert.strictEqual(this.oController.oDirtyStateModel.getProperty("/isDirty"), false, "bIsDirty was set to false");
        assert.strictEqual(this.oFillGroupsStub.callCount, 1, "fillGroups was called exactly once");
        assert.strictEqual(this.oOnSaveStub.callCount, 0, "onSave was not called");
    });

    QUnit.test("onClose of the created messageBox calls the right functions when called with 'save'", function (assert) {
        // Arrange

        // Act
        this.oController.handleSystemContextChanged();
        this.oMessageBoxShowStub.getCall(0).args[1].onClose(resources.i18n.getText("userDefaultsSave"));

        // Assert
        assert.strictEqual(this.oController.oDirtyStateModel.getProperty("/isDirty"), false, "bIsDirty was set to false");
        assert.strictEqual(this.oFillGroupsStub.callCount, 1, "fillGroups was called exactly once");
        assert.strictEqual(this.oOnSaveStub.callCount, 1, "onSave was called exactly once");
    });

    QUnit.test("onClose of the created message Box calls the right functions when called with something else than 'discard' or 'save'", function (assert) {
        // Arrange

        // Act
        this.oController.handleSystemContextChanged();
        this.oMessageBoxShowStub.getCall(0).args[1].onClose("Not Discard");

        // Assert
        assert.strictEqual(this.oController.oDirtyStateModel.getProperty("/isDirty"), true, "bIsDirty was not changed");
        assert.strictEqual(this.oFillGroupsStub.callCount, 0, "fillGroups was not called");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/selectedKey", this.sLastSelectedKeyMock], "The right selectedKey was set");
    });

    QUnit.test("Creates a messageBox with the right properties", function (assert) {
        // Arrange

        // Act
        this.oController.handleSystemContextChanged();
        var oMessageBoxProperties = this.oMessageBoxShowStub.getCall(0).args[1];

        // Assert
        assert.strictEqual(
            this.oMessageBoxShowStub.getCall(0).args[0],
            resources.i18n.getText("userDefaultsUnsavedChangesMessage"),
            "The messageBox has the right title"
        );
        assert.deepEqual(
            oMessageBoxProperties.actions,
            [resources.i18n.getText("userDefaultsSave"), resources.i18n.getText("userDefaultsDiscard"), MessageBox.Action.CANCEL],
            "The messageBox has the right actions"
        );
        assert.strictEqual(
            oMessageBoxProperties.emphasizedAction,
            resources.i18n.getText("userDefaultsSave"),
            "The messageBox has the right emphasizedAction"
        );
    });

    QUnit.module("The function _setDirtyState", {
        beforeEach: function () {
            this.oController = new UserDefaultsSettingController();

            this.oPropertyStub = { id: "someProperty" };

            this.oGetModelStub = sandbox.stub().withArgs("systemContexts").returns({
                getProperty: function () {
                    return this.oPropertyStub;
                }.bind(this)
            });
            this.oGetViewStub = sandbox.stub(this.oController, "getView").returns({ getModel: this.oGetModelStub });
            this.oSetVariantModifiedStub = sandbox.stub(this.oController, "_setSmartVariantModified");

            this.oController.oDirtyStateModel = new JSONModel({
                isDirty: true,
                selectedVariant: null
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("sets dirtyState and lastSelectedKey if called with true", function (assert) {
        // Arrange
        this.oController.oDirtyStateModel.setProperty("/isDirty", false);

        // Act
        this.oController._setDirtyState(true);

        // Assert
        assert.strictEqual(this.oController.oDirtyStateModel.getProperty("/isDirty"), true, "dirtyState was set to true");
        assert.strictEqual(this.oController.sLastSelectedKey, this.oPropertyStub, "The right key was set");
        assert.ok(this.oSetVariantModifiedStub.calledWith(true), "_setSmartVariantModified was called with true.");
    });

    QUnit.test("removes dirtyState and lastSelectedKey if called with false", function (assert) {
        // Arrange
        this.oController.oDirtyStateModel.setProperty("/isDirty", true);

        // Act
        this.oController._setDirtyState(false);

        // Assert
        assert.strictEqual(this.oController.oDirtyStateModel.getProperty("/isDirty"), false, "dirtyState was set to false");
        assert.ok(this.oSetVariantModifiedStub.calledWith(false), "_setSmartVariantModified was called with true.");
        assert.strictEqual(this.oController.sLastSelectedKey, undefined, "The key was not set");
    });

    QUnit.module("The function _setVariantSelected", {
        beforeEach: function () {
            this.oController = new UserDefaultsSettingController();
            this.oController.oDirtyStateModel = new JSONModel({
                isDirty: true,
                selectedVariant: null
            });

            this.oStoreChangedDataStub = sandbox.stub(this.oController, "storeChangedData");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("sets the selected variant to the given parameter", function (assert) {
        // Arrange
        this.oController.oDirtyStateModel.setProperty("/selectedVariant", null);

        // Act
        this.oController._setSelectedVariant("test-variant");

        // Assert
        assert.ok(this.oStoreChangedDataStub.calledOnce, "The storeChangedData method was called once.");
        assert.strictEqual(this.oController.oDirtyStateModel.getProperty("/selectedVariant"), "test-variant", "selectedVariant was set to the expected value.");
    });

    QUnit.module("The function _fillGroups", {
        beforeEach: function () {
            this.oController = new UserDefaultsSettingController();

            this.oSmartForm = {
                addGroup: sandbox.stub(),
                removeAllGroups: sandbox.stub()
            };

            this.oGetFormattedParametersStub = sandbox.stub(this.oController, "_getFormattedParameters");
            this.oEditorGetParametersStub = sandbox.stub().resolves();

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetServiceAsyncStub.withArgs("UserDefaultParameters").resolves({ editorGetParameters: this.oEditorGetParametersStub});

            this.oByIdStub = sandbox.stub().withArgs("userDefaultsSmartForm").returns(this.oSmartForm);
            this.oGetPropertyStub = sandbox.stub().returns({});
            this.oGetPropertyStub.withArgs("/systemContexts").returns([
                { id: "firstSystemContext" },
                { id: "secondSystemContext" },
                { id: "thirdSystemContext" }
            ]);
            this.oGetPropertyStub.withArgs("/selectedKey").returns("secondSystemContext");

            this.oSetModelStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub().withArgs("systemContexts").returns({
                getProperty: this.oGetPropertyStub,
                setProperty: this.oSetPropertyStub
            });
            this.oGetViewStub = sandbox.stub(this.oController, "getView")
                .returns({
                    setModel: this.oSetModelStub,
                    getModel: this.oGetModelStub,
                    byId: this.oByIdStub
                });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Remove all groups from the form when update content", function (assert) {
        // Arrange
        this.oExpectedSystemContext = {
            id: "secondSystemContext"
        };
        this.oGetFormattedParametersStub.resolves([]);

        // Act
        return this.oController._fillGroups().then(function () {
            //Assert
            assert.strictEqual(this.oSmartForm.removeAllGroups.callCount, 1, "smart form should be cleaned");
            assert.deepEqual(this.oEditorGetParametersStub.getCall(0).args, [this.oExpectedSystemContext], "editorGetParameters was called with the right args");
        }.bind(this));
    });

    QUnit.module("the function _getFormattedParameters", {
        beforeEach: function () {
            this.oController = new UserDefaultsSettingController();
            this.oController.oBlockedParameters = {};
            this.oMockJsonModel = new JSONModel({});

            this.oSetModelStub = sandbox.stub(this.oController, "storeChangedData");
            this.oGetODataServiceDataStub = sandbox.stub(this.oController, "_getODataServiceData");
            sandbox.stub(Log, "error");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("no parameters", function (assert) {
        // Arrange
        var oModelMock = {getData: function () {
                return {};
            }
        };

        // Act
        return this.oController._getFormattedParameters(oModelMock).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, [], "empty array should be return when no parameters");
        });
    });

    QUnit.test("Format plain parameter", function (assert) {
        // Arrange
        var oParameters = {
            param: {
                editorMetadata: {
                    groupId: "B",
                    parameterIndex: 13
                },
                valueObject: { value: "test" }
            }
        };
        var oModelMock = new JSONModel(oParameters);
        var aExpectedResult = [{
            editorMetadata: {
                groupId: "B",
                parameterIndex: 13
            },
            valueObject: { value: "test" },
            modelBind: {
                isOdata: false,
                model: oModelMock,
                extendedModel: oModelMock,
                sFullPropertyPath: "/param/valueObject/value",
                sPropertyName: "{/param/valueObject/value}"
            },
            parameterName: "param"
        }];
        // Act
        return this.oController._getFormattedParameters(oModelMock).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "The parameters is correct.");
        });
    });

    QUnit.test("Format Odata parameter: return plain model binding when metadata was not loaded", function (assert) {
        // Arrange
        this.oGetODataServiceDataStub.returns({
            metadataLoaded: Promise.reject()
        });
        var oParameters = {
            param: {
                editorMetadata: {
                    groupId: "B",
                    parameterIndex: 13,
                    editorInfo: {
                        odataURL: "someUrl",
                        bindingPath: "",
                        propertyName: "paramName1"
                    }
                },
                valueObject: { value: "test" }
            }
        };
        var oModelMock = new JSONModel(oParameters);
        var aExpectedResult = [{
            editorMetadata: {
                groupId: "B",
                parameterIndex: 13,
                editorInfo: {
                    odataURL: "someUrl",
                    bindingPath: "",
                    propertyName: "paramName1"
                }
            },
            valueObject: { value: "test" },
            modelBind: {
                isOdata: false,
                model: oModelMock,
                extendedModel: oModelMock,
                sFullPropertyPath: "/param/valueObject/value",
                sPropertyName: "{/param/valueObject/value}"
            },
            parameterName: "param"
        }];

        // Act
        return this.oController._getFormattedParameters(oModelMock).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "The parameters is correct.");
            assert.deepEqual(this.oController.aDisplayedUserDefaults, aExpectedResult, "the aDisplayedUserDefaults variable was updated.");
            assert.ok(this.oGetODataServiceDataStub.calledOnce, "_getODataServiceData was called");
            assert.ok(Log.error.calledOnce, "Log.error was called");
            assert.equal(this.oController.oBlockedParameters.param, false, "the parameter should not be blocked");
        }.bind(this));
    });

    QUnit.test("Format Odata parameter: return odata model binding when metadata was loaded succesful", function (assert) {
        // Arrange
        var oParameters = {
            param: {
                editorMetadata: {
                    groupId: "B",
                    parameterIndex: 13,
                    editorInfo: {
                        odataURL: "someUrl",
                        bindingPath: "",
                        propertyName: "paramName1"
                    }
                },
                valueObject: { value: "test" }
            }
        };
        var oFakeOdataModel = new JSONModel(oParameters);
        this.oGetODataServiceDataStub.returns({
            metadataLoaded: Promise.resolve(),
            model: oFakeOdataModel
        });

        var aExpectedResult = [{
            editorMetadata: {
                groupId: "B",
                parameterIndex: 13,
                editorInfo: {
                    odataURL: "someUrl",
                    bindingPath: "",
                    propertyName: "paramName1"
                }
            },
            valueObject: { value: "test" },
            modelBind: {
                isOdata: true,
                model: oFakeOdataModel,
                extendedModel: oFakeOdataModel,
                sFullPropertyPath: "/paramName1",
                sPropertyName: "{paramName1}"
            },
            parameterName: "param"
        }];

        // Act
        return this.oController._getFormattedParameters(oFakeOdataModel).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "The parameters is correct.");
            assert.ok(this.oGetODataServiceDataStub.calledOnce, "_getODataServiceData was called");
        }.bind(this));
    });

    QUnit.test("Parameters should be sorted by groupID", function (assert) {
        // Arrange
        var oParameters = {
            param2: {
                editorMetadata: {
                    groupId: "B",
                    parameterIndex: 13
                },
                valueObject: {}
            },
            param1: {
                editorMetadata: {
                    groupId: "A",
                    parameterIndex: 10
                },
                valueObject: {}
            }
        };
        var oFakeOdataModel = new JSONModel(oParameters);
        var aExpectedResult = [{
            editorMetadata: {
                groupId: "A",
                parameterIndex: 10
            },
            valueObject: { value: "" },
            modelBind: {
                isOdata: false,
                model: oFakeOdataModel,
                extendedModel: oFakeOdataModel,
                sFullPropertyPath: "/param1/valueObject/value",
                sPropertyName: "{/param1/valueObject/value}"
            },
            parameterName: "param1"
        }, {
            editorMetadata: {
                groupId: "B",
                parameterIndex: 13
            },
            valueObject: { value: "" },
            modelBind: {
                isOdata: false,
                model: oFakeOdataModel,
                extendedModel: oFakeOdataModel,
                sFullPropertyPath: "/param2/valueObject/value",
                sPropertyName: "{/param2/valueObject/value}"
            },
            parameterName: "param2"
        }];

        // Act
        return this.oController._getFormattedParameters(oFakeOdataModel).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "The parameters are correctly sorted.");
        });
    });

    QUnit.test("Parameters should be sorted by parameterIndex", function (assert) {
        // Arrange
        var oParameters = {
            param2: {
                editorMetadata: {
                    groupId: "A",
                    parameterIndex: 13
                },
                valueObject: {}
            },
            param1: {
                editorMetadata: {
                    groupId: "A",
                    parameterIndex: 10
                },
                valueObject: {}
            }
        };
        var oFakeOdataModel = new JSONModel(oParameters);
        var aExpectedResult = [{
            editorMetadata: {
                groupId: "A",
                parameterIndex: 10
            },
            valueObject: { value: "" },
            modelBind: {
                isOdata: false,
                model: oFakeOdataModel,
                extendedModel: oFakeOdataModel,
                sFullPropertyPath: "/param1/valueObject/value",
                sPropertyName: "{/param1/valueObject/value}"
            },
            parameterName: "param1"
        }, {
            editorMetadata: {
                groupId: "A",
                parameterIndex: 13
            },
            valueObject: { value: "" },
            modelBind: {
                isOdata: false,
                model: oFakeOdataModel,
                extendedModel: oFakeOdataModel,
                sFullPropertyPath: "/param2/valueObject/value",
                sPropertyName: "{/param2/valueObject/value}"
            },
            parameterName: "param2"
        }];

        // Act
        return this.oController._getFormattedParameters(oFakeOdataModel).then(function (aResult) {
            // Assert
            assert.deepEqual(aResult, aExpectedResult, "The parameters are correctly sorted.");
        }.bind(this));
    });

    QUnit.module("the function _overrideOdataModelValue", {
        beforeEach: function (assert) {
            this.oController = new UserDefaultsSettingController();
            this.oController.oBlockedParameters = {};
            this.oMockJsonModel = new JSONModel({
                "someBindingPath": {}
            });
        },
        afterEach: function () {
        }
    });

    QUnit.test("1 of 2 parameters should update and get unblocked", function (assert) {
        // Arrange
        var oEvent = {
            getSource: sinon.stub().returns(this.oMockJsonModel),
            getParameter: function (sParameter) {
                if (sParameter === "url") {
                    return "someBindingPath?someParameter=someValue";
                }
                return null;
            }
        };

        this.oController.oBlockedParameters = {
            paramName1: true,
            paramName2: true
        };
        var oParameter = {
            editorMetadata: {
                editorInfo: {
                    odataURL: "",
                    bindingPath: "/someBindingPath",
                    propertyName: "paramName1"
                }
            },
            valueObject: { value: "someValue" },
            parameterName: "paramName1"
        };

        // Act
        this.oController._overrideOdataModelValue(oParameter, oEvent);

        // Assert
        assert.strictEqual(this.oMockJsonModel.getProperty("/someBindingPath/paramName1"), oParameter.valueObject.value);
        assert.strictEqual(this.oController.oBlockedParameters.paramName1, false, "The first parameter was unblocked.");
        assert.strictEqual(this.oController.oBlockedParameters.paramName2, true, "The second parameter is still blocked.");
    });

    QUnit.test("unblocks a value if the url contains no parameters", function (assert) {
        // Arrange
        var oEvent = {
            getParameter: sinon.stub().returns("someBindingPath"),
            getSource: sinon.stub().returns({
                getProperty: sinon.stub().returns("someValue")
            })
        };
        var oParameter = {
            parameterName: "someParameterName",
            editorMetadata: {
                editorInfo: {
                    odataURL: "someUrl",
                    bindingPath: "/someBindingPath"
                }
            },
            valueObject: { value: "someValue" }
        };

        this.oController.oBlockedParameters = {
            someParameterName: true
        };

        // Act
        this.oController._overrideOdataModelValue(oParameter, oEvent);

        // Assert
        assert.strictEqual(this.oController.oBlockedParameters[oParameter.parameterName], false, "The parameter is unblocked.");
    });

    QUnit.test("unblocks a value if the url contains a parameter", function (assert) {
        // Arrange
        var oEvent = {
            getParameter: sinon.stub().returns("someBindingPath"),
            getSource: sinon.stub().returns({
                getProperty: sinon.stub().returns("someValue")
            })
        };
        var oParameter = {
            parameterName: "someParameterName",
            editorMetadata: {
                editorInfo: {
                    odataURL: "someUrl",
                    bindingPath: "/someBindingPath"
                }
            },
            valueObject: { value: "someValue" }
        };

        this.oController.oBlockedParameters = {};

        // Act
        this.oController._overrideOdataModelValue(oParameter, oEvent);

        // Assert
        assert.strictEqual(this.oController.oBlockedParameters[oParameter.parameterName], false, "The parameter is unblocked.");
    });

    QUnit.module("the function _getODataServiceData", {
        beforeEach: function () {
            sandbox.stub(ODataModel.prototype, "addAnnotationXML").callsFake(function () {

            });
            this.oController = new UserDefaultsSettingController();
            this.oController.oModelRecords = {};
            this.oController.oBlockedParameters = {};
        },

        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("the correct model is returned", function (assert) {
        // Arrange
        var sUrl = "someUrl?someParameter=someValue";

        // Act
        var oReturnedModel = this.oController._getODataServiceData(sUrl, {
            parameterName: "param"
        });

        // Assert
        assert.strictEqual(oReturnedModel.model.getDefaultCountMode(), "None", "Default count mode is \"None\".");
        assert.deepEqual(oReturnedModel.attachedListeners, ["param"], "Attach listener was set.");
        assert.strictEqual(oReturnedModel.model.getDefaultBindingMode(), "TwoWay", "Default binding mode is \"TwoWay\".");
        assert.strictEqual(this.oController.oBlockedParameters.param, true, "the parameter should be blocked");
        assert.deepEqual(oReturnedModel.model, this.oController.oModelRecords[sUrl].model, "The model is stored in the model records map.");
        assert.ok(oReturnedModel.model.oMetadata.sUrl.indexOf("sap-lang-cachebuster=") > -1, "The sap-lang-cache-buster param was added to the metadata url.");
        assert.ok(oReturnedModel.model.oMetadata.sUrl.indexOf("sap-documentation=") > -1, "The sap-documentation param was added to the metadata url.");
        assert.ok(oReturnedModel.model.oMetadata.sUrl.indexOf("sap-value-list=") > -1, "The sap-value-list param was added to the metadata url.");
    });

    QUnit.module("The function onSave", {
        beforeEach: function (assert) {
            this.oSystemContext = {};
            this.oKeyMock = "someKey";

            this.oGetSystemContextStub = sandbox.stub().resolves(this.oSystemContext);

            var oCSTRService = {
                getSystemContext: this.oGetSystemContextStub
            };

            sandbox.stub(Container, "getServiceAsync").withArgs("ClientSideTargetResolution").resolves(oCSTRService);

            return Controller.create({
                name: "sap.ushell.components.shell.Settings.userDefaults.controller.UserDefaultsSetting"
            }).then(function (oController) {
                this.oController = oController;
                this.oController.getView = function () {
                    return {
                        getModel: function () {
                            return {
                                getProperty: function () {
                                    return this.oKeyMock;
                                }.bind(this)
                            };
                        }.bind(this)
                    };
                };

                this.oSetDirtyStub = sandbox.stub(this.oController, "_setDirtyState");
                this.oSaveParameterValuesStub = sandbox.stub(this.oController, "_saveParameterValues").resolves();
                this.oResetSmartVarianManagementStub = sandbox.stub(this.oController, "_resetSmartVariantManagement").resolves();
                this.oSetDefaultVariantManagementStub = sandbox.stub(this.oController, "_setDefaultVariant").resolves();
            }.bind(this));
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Does not call _saveParameterValues if no parameters changed", function (assert) {
        // Arrange
        this.oController.aChangedParamsNames = [];
        this.oFakeStoreChangedData = sandbox.spy(this.oController, "storeChangedData");

        // Act
        return this.oController.onSave()
            .then(function () {
                // Assert
                assert.ok(this.oFakeStoreChangedData.called);
                assert.strictEqual(this.oSaveParameterValuesStub.callCount, 0, "The function _saveParameterValues has not been called.");
            }.bind(this))
            .catch(function (e) {
                assert.ok(false, "The promise should have been resolved.");
            });
    });

    QUnit.test("Calls _saveParameterValues with the correct parameter name list", function (assert) {
        // Arrange
        this.oController.aChangedParamsNames = ["foo"];

        // Act
        return this.oController.onSave()
            .then(function () {
                // Assert
                assert.strictEqual(this.oSaveParameterValuesStub.callCount, 1, "The function _saveParameterValues has been called once.");
                assert.deepEqual(this.oSaveParameterValuesStub.firstCall.args[0], ["foo"], "The function _saveParameterValues has been called with the correct parameter.");
                assert.strictEqual(this.oSaveParameterValuesStub.firstCall.args[1], this.oSystemContext, "The function _saveParameterValues has been called with the correct systemContext.");
            }.bind(this))
            .catch(function () {
                assert.ok(false, "The promise should have been resolved.");
            });
    });

    QUnit.test("Calls _saveParameterValues with a system context", function (assert) {
        // Arrange
        this.oController.aChangedParamsNames = ["foo"];

        // Act
        return this.oController.onSave()
            .then(function () {
                // Assert
                assert.strictEqual(this.oSaveParameterValuesStub.firstCall.args[1], this.oSystemContext, "The function _saveParameterValues has been called with the correct parameter.");
            }.bind(this))
            .catch(function () {
                assert.ok(false, "The promise should have been resolved.");
            });
    });

    QUnit.test("Calls getSystemContext with the last selected key", function (assert) {
        // Arrange
        var sLastSelectedKey = "myKey";
        this.oController.aChangedParamsNames = ["foo"];
        this.oController.sLastSelectedKey = sLastSelectedKey;

        // Act
        return this.oController.onSave()
            .then(function () {
                // Assert
                assert.strictEqual(this.oGetSystemContextStub.getCall(0).args[0], sLastSelectedKey, "The function getSystemContext has been called with the correct parameter.");
            }.bind(this))
            .catch(function () {
                assert.ok(false, "The promise should have been resolved.");
            });
    });

    QUnit.test("Calls _resetSmartVariantManagement", function (assert) {
        // Arrange
        var sLastSelectedKey = "myKey";
        this.oController.aChangedParamsNames = ["foo"];
        this.oController.sLastSelectedKey = sLastSelectedKey;

        // Act
        return this.oController.onSave()
            .then(function () {
                // Assert
                assert.strictEqual(this.oResetSmartVarianManagementStub.callCount, 1, "The function _resetSmartVariantManagement has been called.");
            }.bind(this))
            .catch(function () {
                assert.ok(false, "The promise should have been resolved.");
            });
    });

    QUnit.test("Calls _setDefaultVariant", function (assert) {
        // Arrange
        var sLastSelectedKey = "myKey";
        this.oController.aChangedParamsNames = ["foo"];
        this.oController.sLastSelectedKey = sLastSelectedKey;

        // Act
        return this.oController.onSave()
            .then(function () {
                // Assert
                assert.strictEqual(this.oSetDefaultVariantManagementStub.callCount, 1, "The function _resetSmartVariantManagement has been called.");
            }.bind(this))
            .catch(function () {
                assert.ok(false, "The promise should have been resolved.");
            });
    });

    QUnit.test("Calls _setDirtyState with false", function (assert) {
        // Act
        this.oController.aChangedParamsNames = [];
        return this.oController.onSave()
            .then(function () {
                // Assert
                assert.ok(this.oSetDirtyStub.calledWith(false), "The function _setDirtyState was called with false.");
            }.bind(this))
            .catch(function () {
                assert.ok(false, "The promise should have been resolved.");
            });
    });

    QUnit.module("The function _saveParameterValues", {
        beforeEach: function () {
            this.oSystemContext = {};

            return Controller.create({
                name: "sap.ushell.components.shell.Settings.userDefaults.controller.UserDefaultsSetting"
            }).then(function (oController) {
                this.oController = oController;

                this.oSaveParameterValueStub = sinon.stub(this.oController, "_saveParameterValue");

                this.oFooValueObject = {};
                this.oFooOriginalValueObject = {};
                this.oController.oModel = new JSONModel({
                    foo: {
                        valueObject: this.oFooValueObject
                    },
                    bar: {}
                });

                this.oController.oOriginalParameters = {
                    foo: {
                        valueObject: this.oFooOriginalValueObject
                    },
                    bar: {}
                };
            }.bind(this));
        },
        afterEach: function () {
            this.oController.destroy();
        }
    });

    QUnit.test("Returns and resolves a promise if no parameters changed", function (assert) {
        // Arrange
        // Act
        return this.oController._saveParameterValues([])
            .then(function () {
                // Assert
                assert.strictEqual(this.oSaveParameterValueStub.callCount, 0, "The function _saveParameterValue has not been called.");
            }.bind(this));
    });

    QUnit.test("Returns and resolves a promise if no parameter value changed", function (assert) {
        // Arrange


        // Act
        return this.oController._saveParameterValues(["foo", "bar"])
            .then(function () {
                // Assert
                assert.strictEqual(this.oSaveParameterValueStub.callCount, 0, "The function _saveParameterValue has not been called.");
            }.bind(this));
    });

    QUnit.test("Resolves once all promises from _saveParameterValue are resolved", function (assert) {
        // Arrange
        this.oController.oModel = new JSONModel({
            foo: {
                valueObject: { value: "newFoo" }
            },
            bar: {
                valueObject: { value: "newBar" }
            }
        });
        this.oSaveParameterValueStub.resolves();

        // Act
        return this.oController._saveParameterValues(["foo", "bar"])
            .then(function () {
                // Assert
                assert.strictEqual(this.oSaveParameterValueStub.callCount, 2, "The function _saveParameterValue has been called twice.");
            }.bind(this));
    });

    QUnit.test("Rejects if any promise from _saveParameterValue is rejected", function (assert) {
        // Arrange
        this.oController.oModel = new JSONModel({
            foo: {
                valueObject: { value: "newFoo" }
            },
            bar: {
                valueObject: { value: "newBar" }
            }
        });
        this.oSaveParameterValueStub.onFirstCall().resolves();
        this.oSaveParameterValueStub.onSecondCall().rejects();

        // Act
        return this.oController._saveParameterValues(["foo", "bar"])
            .then(function () {
                // Assert
                assert.ok(false, "The promise must be rejected.");
            })
            .catch(function () {
                assert.strictEqual(this.oSaveParameterValueStub.callCount, 2, "The function _saveParameterValue has been called twice.");
            }.bind(this));
    });

    QUnit.test("Calls _saveParameterValue with the correct parameters", function (assert) {
        // Arrange
        this.oFooValueObject.value = "newValue";

        // Act
        return this.oController._saveParameterValues(["foo"], this.oSystemContext)
            .then(function () {
                // Assert
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "foo", "The function _saveParameterValue has been called with the correct parameter.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[1], this.oFooValueObject, "The function _saveParameterValue has been called with the correct parameter.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], this.oFooOriginalValueObject, "The function _saveParameterValue has been called with the correct parameter.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], this.oSystemContext, "The function _saveParameterValue has been called with the correct parameter.");
            }.bind(this));
    });

    QUnit.test("Calls _saveParameterValue with the correct parameters if a value is null", function (assert) {
        // Arrange
        this.oFooValueObject.value = null;

        // Act
        return this.oController._saveParameterValues(["foo"], this.oSystemContext)
            .then(function () {
                // Assert
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "foo", "The function _saveParameterValue has been called with the correct parameter.");
                assert.deepEqual(this.oSaveParameterValueStub.firstCall.args[1], { value: undefined }, "The function _saveParameterValue has been called with the correct parameter.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], this.oFooOriginalValueObject, "The function _saveParameterValue has been called with the correct parameter.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], this.oSystemContext, "The function _saveParameterValue has been called with the correct parameter.");
            }.bind(this));
    });

    QUnit.test("Calls _saveParameterValue with the correct parameters if a value is an empty string", function (assert) {
        // Arrange
        this.oFooValueObject.value = "";

        // Act
        return this.oController._saveParameterValues(["foo"], this.oSystemContext)
            .then(function () {
                // Assert
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "foo", "The function _saveParameterValue has been called with the correct parameter.");
                assert.deepEqual(this.oSaveParameterValueStub.firstCall.args[1], { value: undefined }, "The function _saveParameterValue has been called with the correct parameter.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], this.oFooOriginalValueObject, "The function _saveParameterValue has been called with the correct parameter.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], this.oSystemContext, "The function _saveParameterValue has been called with the correct parameter.");
            }.bind(this));
    });

    QUnit.test("Calls _saveParameterValue with the correct parameters if the extended value does not contain any ranges", function (assert) {
        // Arrange
        this.oFooValueObject.extendedValue = {
            Ranges: []
        };

        // Act
        return this.oController._saveParameterValues(["foo"], this.oSystemContext)
            .then(function () {
                // Assert
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[0], "foo", "The function _saveParameterValue has been called with the correct parameter.");
                assert.deepEqual(this.oSaveParameterValueStub.firstCall.args[1], { extendedValue: undefined }, "The function _saveParameterValue has been called with the correct parameter.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[2], this.oFooOriginalValueObject, "The function _saveParameterValue has been called with the correct parameter.");
                assert.strictEqual(this.oSaveParameterValueStub.firstCall.args[3], this.oSystemContext, "The function _saveParameterValue has been called with the correct parameter.");
            }.bind(this));
    });

    QUnit.module("The function _saveParameterValue", {
        beforeEach: function () {
            this.oSystemContext = {};
            this.oEditorSetValueStub = sinon.stub().resolves();
            var oUserDefaultParametersService = {
                editorSetValue: this.oEditorSetValueStub
            };

            sandbox.stub(Container, "getServiceAsync").withArgs("UserDefaultParameters").resolves(oUserDefaultParametersService);

            this.oValueObject = {
                value: "bar"
            };
            this.oOriginalValueObject = {
                value: "foo"
            };

            return Controller.create({
                name: "sap.ushell.components.shell.Settings.userDefaults.controller.UserDefaultsSetting"
            }).then(function (oController) {
                this.oController = oController;
            }.bind(this));
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls editorSetValue with the correct parameters", function (assert) {
        // Arrange
        // Act
        return this.oController._saveParameterValue("param", this.oValueObject, this.oOriginalValueObject, this.oSystemContext)
            .then(function () {
                // Assert
                assert.strictEqual(this.oEditorSetValueStub.firstCall.args[0], "param", "The function editorSetValue has been called with the correct parameter.");
                assert.strictEqual(this.oEditorSetValueStub.firstCall.args[1], this.oValueObject, "The function editorSetValue has been called with the correct parameter.");
                assert.strictEqual(this.oEditorSetValueStub.firstCall.args[2], this.oSystemContext, "The function editorSetValue has been called with the correct parameter.");
            }.bind(this));
    });

    QUnit.test("Updates the parameter cache for change detection", function (assert) {
        // Arrange
        // Act
        return this.oController._saveParameterValue("param", this.oValueObject, this.oOriginalValueObject, this.oSystemContext)
            .then(function () {
                // Assert
                assert.strictEqual(this.oOriginalValueObject.value, this.oValueObject.value, "The correct value has been found.");
            }.bind(this));
    });

    QUnit.test("Returns and rejects a promise if the call to editorSetValue fails", function (assert) {
        // Arrange
        this.oEditorSetValueStub.rejects(new Error("Some error"));

        // Act
        return this.oController._saveParameterValue("param", this.oValueObject, this.oOriginalValueObject, this.oSystemContext)
            .then(function () {
                assert.ok(false, "The promise must be rejected.");
            })
            .catch(function (oError) {
                // Assert
                assert.ok(true, "The promise has been rejected.");
                assert.strictEqual(oError.message, "Some error", "The correct error message has been found.");
            });
    });

    QUnit.module("The function saveExtendedValue", {
        beforeEach: function () {
            var sParameterName = "myParameterName";
            this.oController = new UserDefaultsSettingController();
            this.oGetParameterStub = sandbox.stub().withArgs("_tokensHaveChanged").returns(true);
            this.oControlEvent = {
                getParameters: function () {
                    return {};
                },
                getParameter: this.oGetParameterStub,
                getSource: sandbox.stub().returns({
                    getModel: sandbox.stub().returns({
                        getProperty: sandbox.stub().returns(sParameterName)
                    })
                })
            };
            this.oController.oCurrentParameters = {
                myParameterName: {
                    valueObject: {}
                }
            };

            this.oExtendedModelStub = {
                getProperty: sandbox.stub(),
                setProperty: sandbox.stub()
            };
            this.oParameter = {
                parameterName: sParameterName,
                valueObject: {},
                modelBind: {
                    extendedModel: this.oExtendedModelStub
                }
            };

            this.oSetDirtyStateStub = sandbox.stub(this.oController, "_setDirtyState");
            this.oData = { parameterName: "myParameterName" };
            this.oController.oModel = {
                getProperty: sandbox.stub().withArgs(sParameterName).returns(this.oParameter),
                setProperty: function () { }
            };
            this.oController.aChangedParamsNames = [];
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls _setDirtyState if a value was changed", function (assert) {
        //Arrange

        // Act
        this.oController.saveExtendedValue(this.oControlEvent);

        // Assert
        assert.strictEqual(this.oSetDirtyStateStub.callCount, 1, "_setDirtyState was called exactly once");
    });

    QUnit.test("Doesn't call _setDirtyState if no value was changed", function (assert) {
        //Arrange
        this.oGetParameterStub.withArgs("_tokensHaveChanged").returns(false);

        // Act
        this.oController.saveExtendedValue(this.oControlEvent, this.oData, this.oModel, this.oValueHelpDialog);

        // Assert
        assert.strictEqual(this.oSetDirtyStateStub.callCount, 0, "_setDirtyState was not called");
    });

    QUnit.module("the function storeChangedData", {
        beforeEach: function (assert) {
            this.oController = new UserDefaultsSettingController();
            this.oController.oBlockedParameters = {};
            this.oController.aChangedParamsNames = [];

            this.oController.oModel = this.oMockJsonModel = new JSONModel({
                param1Path: "",
                param1: {
                    valueObject: { extendedValue: { Ranges: [] } }
                }
            });

            this.oController.aDisplayedUserDefaults = [{
                parameterName: "param1",
                modelBind: {
                    model: this.oMockJsonModel,
                    extendedModel: this.oMockJsonModel,
                    sFullPropertyPath: "/param1Path"
                }
            }];
        }
    });

    QUnit.test("don't adjust aChangedParamsNames if result was not changed", function (assert) {
        // Arrange

        // Act
        this.oController.storeChangedData();
        // Assert
        assert.equal(this.oController.aChangedParamsNames.indexOf("param1"), -1, "param1 should not be in aChangedParamsNames");
    });

    QUnit.test("adjust aChangedParamsNames value was changed", function (assert) {
        // Arrange
        this.oMockJsonModel.setProperty("/param1Path", "newValue");
        // Act
        this.oController.storeChangedData();
        // Assert
        assert.equal(this.oController.aChangedParamsNames.indexOf("param1"), 0, "param1 should be in aChangedParamsNames");
    });

    QUnit.test("adjust aChangedParamsNames if the extended value was changed", function (assert) {
        // Arrange
        var oExtendedValue = {
            Sign: "E",
            Option: "CP",
            Low: "100",
            High: "200"
        };
        this.oMockJsonModel.setProperty("/param1Path", "value");
        this.oMockJsonModel.setProperty("/param1/valueObject/extendedValue/Ranges", [oExtendedValue]);
        // Act
        this.oController.storeChangedData();
        // Assert
        assert.equal(this.oController.aChangedParamsNames.indexOf("param1"), 0, "param1 should be in aChangedParamsNames");
    });

    QUnit.test("do not adjust aChangedParamsNames and oCurrentParameters if the extended value was null", function (assert) {
        // Arrange
        this.oMockJsonModel.setProperty("/param1Path", undefined);
        this.oMockJsonModel.setProperty("/param1/valueObject/extendedValue", undefined);

        // Act

        this.oController.storeChangedData();
        // Assert
        assert.equal(this.oController.aChangedParamsNames.indexOf("param1"), -1, "param1 should not be in aChangedParamsNames");
    });

    QUnit.module("the function _setDefaultVariant", {
        beforeEach: function () {
            this.oSetCurrentVariantIdStub = sandbox.stub();
            this.oController = new UserDefaultsSettingController();
            this.oSetSelectedVariantStub = sandbox.stub(this.oController, "_setSelectedVariant");
            sandbox.stub(this.oController, "getView").returns({
                byId: sandbox.stub().returns({
                    getDefaultVariantKey: sandbox.stub().returns("test-key-123"),
                    setCurrentVariantId: this.oSetCurrentVariantIdStub
                })
            });
            this.oController._bIsSupportedPlatform = true;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("sets the expected current variantId", function (assert) {
        this.oController._setDefaultVariant();
        assert.ok(this.oSetCurrentVariantIdStub.calledOnce, "The function setCurrentVariantId was called once.");
        assert.strictEqual(this.oSetCurrentVariantIdStub.firstCall.args[0], "test-key-123", "The function setCurrentVariantId was called once.");
    });

    QUnit.test("calls _setSelectedVariant", function (assert) {
        this.oController._setDefaultVariant();
        assert.ok(this.oSetCurrentVariantIdStub.calledOnce, "The function _setSelectedVariant was called.");
    });

    QUnit.module("the function _resetSmartVariantManagement", {
        beforeEach: function () {
            this.oController = new UserDefaultsSettingController();
            this.oInitializeSmartVariantManagementStub = sandbox.stub(this.oController, "_initializeSmartVariantManagement");
            this.oRemoveAllPersonalizedControlsStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                byId: sandbox.stub().returns({
                    removeAllPersonalizableControls: this.oRemoveAllPersonalizedControlsStub
                })
            });

            this.oController._bIsSupportedPlatform = true;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("removes all personalized controls and initializes the SmartVariantManagement", function (assert) {
        this.oController._resetSmartVariantManagement();
        assert.ok(this.oRemoveAllPersonalizedControlsStub.calledOnce, "The function removeAllPersonalizableControls was called once.");
        assert.ok(this.oInitializeSmartVariantManagementStub.calledOnce, "The function _initializeSmartVariantManagement was called once.");
    });

    QUnit.module("the function _initializeSmartVariantManagement", {
        beforeEach: function () {
            this.oController = new UserDefaultsSettingController();
            this.oUserDefaultsForm = new ManagedObject("UserDefaultsFormTestID");
            this.oAddPersonalizableControlStub = sandbox.stub();
            this.oAttachSelectStub = sandbox.stub();
            this.oDetachSelectStub = sandbox.stub();
            this.oAttachAfterSaveStub = sandbox.stub();
            this.oDetachAfterSaveStub = sandbox.stub();
            this.oInitialiseStub = sandbox.stub();
            this.oGetSelectionKeyStub = sandbox.stub();
            this.oSetVisibleStub = sandbox.stub();

            this.oVariantManagement = {
                addPersonalizableControl: this.oAddPersonalizableControlStub,
                attachSelect: this.oAttachSelectStub,
                detachSelect: this.oDetachSelectStub,
                attachAfterSave: this.oAttachAfterSaveStub,
                detachAfterSave: this.oDetachAfterSaveStub,
                initialise: this.oInitialiseStub,
                getSelectionKey: this.oGetSelectionKeyStub,
                setVisible: this.oSetVisibleStub
            };

            this.oAddPersonalizableControlStub.returns(this.oVariantManagement);
            this.oAttachSelectStub.returns(this.oVariantManagement);
            this.oDetachSelectStub.returns(this.oVariantManagement);
            this.oAttachAfterSaveStub.returns(this.oVariantManagement);
            this.oDetachAfterSaveStub.returns(this.oVariantManagement);
            this.oSetVisibleStub.returns(this.oVariantManagement);
            this.oGetSelectionKeyStub.returns("test-key");

            this.oByIdStub = sandbox.stub();
            this.oByIdStub
                .withArgs("userDefaultsForm").returns(this.oUserDefaultsForm)
                .withArgs("defaultSettingsVariantManagement").returns(this.oVariantManagement);

            sandbox.stub(this.oController, "getView").returns({
                byId: this.oByIdStub
            });

            this.oSetSelectedVariantStub = sandbox.stub(this.oController, "_setSelectedVariant");

            this.oController._bIsSupportedPlatform = true;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds the UserDefaults form as personalizable control", function (assert) {
        var oPromise = this.oController._initializeSmartVariantManagement().then(function () {
            assert.ok(this.oAddPersonalizableControlStub.calledOnce, "The function addPersonalizableControl was called once.");
            assert.strictEqual(
                this.oAddPersonalizableControlStub.firstCall.args[0].getType(),
                "wrapper",
                "The function addPersonalizableControl was called with the expected params."
            );

            assert.strictEqual(
                this.oAddPersonalizableControlStub.firstCall.args[0].getKeyName(),
                "persistencyKey",
                "The function addPersonalizableControl was called with the expected params."
            );

            assert.strictEqual(
                this.oAddPersonalizableControlStub.firstCall.args[0].getDataSource(),
                "none",
                "The function addPersonalizableControl was called with the expected params."
            );

            assert.strictEqual(
                this.oAddPersonalizableControlStub.firstCall.args[0].getControl(),
                "UserDefaultsFormTestID",
                "The function addPersonalizableControl was called with the expected params."
            );

            assert.ok(this.oSetSelectedVariantStub.calledWith("test-key"));
        }.bind(this));

        this.oInitialiseStub.firstCall.args[0]();

        return oPromise;
    });

    QUnit.test("Initializes the SmartVariantManagement", function (assert) {
        var oPromise = this.oController._initializeSmartVariantManagement().then(function () {
            assert.ok(this.oInitialiseStub.calledOnce, "The function initialise was called once.");
            assert.strictEqual(
                typeof this.oInitialiseStub.firstCall.args[0],
                "function",
                "The function initialise was called with the expected params."
            );

            assert.deepEqual(
                this.oInitialiseStub.firstCall.args[1],
                this.oUserDefaultsForm,
                "The function initialise was called with the expected params."
            );

            assert.ok(this.oSetVisibleStub.calledWith(true), "setEnabled was called with true");
        }.bind(this));
        this.oInitialiseStub.firstCall.args[0]();

        return oPromise;
    });

    QUnit.test("Attaches to the 'select' and 'afterSave' events", function (assert) {
        var oPromise = this.oController._initializeSmartVariantManagement().then(function () {
            assert.ok(this.oDetachSelectStub.calledOnce, "The function detachSelect was called once.");
            assert.ok(this.oDetachAfterSaveStub.calledOnce, "The function detachAfterSave was called once.");
            assert.ok(this.oAttachSelectStub.calledOnce, "The function attachSelect was called once.");
            assert.ok(this.oAttachAfterSaveStub.calledOnce, "The function attachAfterSave was called once.");
        }.bind(this));
        this.oInitialiseStub.firstCall.args[0]();
        return oPromise;
    });

    QUnit.module("the formatter displayDiffText", {
        beforeEach: function () {
            this.oController = new UserDefaultsSettingController();
            this.oByIdStub = sandbox.stub();

            this.oStandardKeyStub = sandbox.stub().returns("standard-test");
            this.oSelectionKeyStub = sandbox.stub().returns("selection-test");
            this.oGetVariantContentStub = sandbox.stub();

            this.oUserDefaultsForm = { test: "control" };
            this.oSmartVariantManagement = {
                getStandardVariantKey: this.oStandardKeyStub,
                getSelectionKey: this.oSelectionKeyStub,
                getVariantContent: this.oGetVariantContentStub
            };

            this.oStandardContent = {
                standard: "content",
                test: { deeper: "nesting" }
            };

            this.oViewContent = {
                view: "content",
                test: { deeper: "nesting" }
            };

            this.oGetVariantContentStub.withArgs(this.oUserDefaultsForm, "standard-test").returns(this.oStandardContent);
            this.oGetVariantContentStub.withArgs(this.oUserDefaultsForm, "selection-test").returns(this.oViewContent);

            this.oSmartVariantManagement = {
                getStandardVariantKey: this.oStandardKeyStub,
                getSelectionKey: this.oSelectionKeyStub,
                getVariantContent: this.oGetVariantContentStub
            };

            this.oByIdStub.withArgs("defaultSettingsVariantManagement").returns(this.oSmartVariantManagement);
            this.oByIdStub.withArgs("userDefaultsForm").returns(this.oUserDefaultsForm);

            sandbox.stub(this.oController, "getView").returns({
                byId: this.oByIdStub
            });

            this.oController._bIsSupportedPlatform = true;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns false if standard view is selected", function (assert) {
        // Arrange
        this.oSelectionKeyStub.returns("standard-test");
        // Act
        var bResult = this.oController.displayDiffText();
        // Assert
        assert.notOk(bResult, "The result was false.");
    });

    QUnit.test("Returns false if custom view is selected but has the same content as standard view", function (assert) {
        // Arrange
        this.oGetVariantContentStub.withArgs(this.oUserDefaultsForm, "selection-test").returns({
            standard: "content",
            test: { deeper: "nesting" }
        });
        // Act
        var bResult = this.oController.displayDiffText();
        // Assert
        assert.notOk(bResult, "The result was false.");
    });

    QUnit.test("Returns false if in the custom view only the executeOnSelection property differs from the standard view", function (assert) {
        // Arrange
        this.oGetVariantContentStub.withArgs(this.oUserDefaultsForm, "selection-test").returns({
            standard: "content",
            test: { deeper: "nesting" },
            executeOnSelection: true
        });
        // Act
        var bResult = this.oController.displayDiffText();
        // Assert
        assert.notOk(bResult, "The result was false.");
    });

    QUnit.test("Returns true if standard view and custom view differ", function (assert) {
        // Act
        var bResult = this.oController.displayDiffText();
        // Assert
        assert.ok(bResult, "The result was true.");
    });

    QUnit.module("Integration test: _createSystemContextSelectGroup", {
        beforeEach: function () {
            var oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync").rejects();
            oGetServiceAsyncStub.withArgs("UserDefaultParameters").resolves({});

            return XMLView.create({
                id: "defaultParametersSelector",
                viewName: "sap.ushell.components.shell.Settings.userDefaults.view.UserDefaultsSetting"
            }).then(function (oView) {
                this.oView = oView;
                //i18n set centrally for all settings. For the test need to set seperatly
                this.oView.setModel(resources.i18nModel, "i18n");
                this.oController = oView.getController();
            }.bind(this));
        },
        afterEach: function () {
            this.oView.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("creates the right controls", function (assert) {
        // Arrange

        // Assert
        var oVBox = this.oView.getContent()[0];
        assert.ok(oVBox.isA("sap.m.VBox"), "VBox added to content aggregation of the view.");

        var oLabel = oVBox.getItems()[0].getItems()[0];
        var oSystemContextSelect = oVBox.getItems()[0].getItems()[1];
        var oSystemSelectInfoText = oVBox.getItems()[1];

        assert.ok(oLabel.isA("sap.m.Label"), "The label is the right type");
        assert.strictEqual(oLabel.getText(), resources.i18n.getText("userDefaultsSystemTitle"), "The label has the right text");

        assert.ok(oSystemContextSelect.isA("sap.m.Select"), "The select is the right type");
        assert.strictEqual(oSystemContextSelect.getBindingPath("items"), "/systemContexts", "The 'items' binding path is correct");
        assert.strictEqual(oSystemContextSelect.getBindingInfo("items").template.getBindingPath("key"), "id", "The 'key' binding path of the template is correct");
        assert.strictEqual(oSystemContextSelect.getBindingInfo("items").template.getBindingPath("text"), "label", "The 'text' binding path of the template is correct");
        assert.strictEqual(oSystemContextSelect.getBindingPath("selectedKey"), "/selectedKey", "The 'selectedKey' binding path is correct");

        assert.strictEqual(oSystemSelectInfoText.getText(), resources.i18n.getText("userDefaultsSystemContextInfo"), "The ino text has the right text");
        assert.ok(oSystemSelectInfoText.hasStyleClass("sapUshellFlpSettingsWideDescription"), "The info text has the style class \"sapUshellFlpSettingsWideDescription\".");

        assert.ok(this.oView.getContent()[1].getItems()[0].isA("sap.ui.comp.smartvariants.SmartVariantManagement"), "SmartVariantManagement added to content aggregation of the view.");
        assert.ok(this.oView.getContent()[3].isA("sap.ushell.components.shell.Settings.userDefaults.UserDefaultsForm"), "UserDefaultsForm added to content aggregation of the view.");
    });

    QUnit.module("Integration test: Create content", {
        beforeEach: function () {
            this.oGetSystemContextStub = sandbox.stub().resolves({ id: "firstSystemContext" });
            this.oHasRelevantMaintainableParametersStub = sandbox.stub().resolves(true);

            this.oParameters = {};
            this.oEditorGetParametersStub = sandbox.stub().resolves(this.oParameters);

            sandbox.stub(Container, "getServiceAsync").callsFake(function (sServiceName) {
                if (sServiceName === "CommonDataModel") {
                    return Promise.resolve({
                        getContentProviderIds: sandbox.stub().returns(Promise.resolve(["firstSystemContext"]))
                    });
                }
                if (sServiceName === "ClientSideTargetResolution") {
                    return Promise.resolve({ getSystemContext: this.oGetSystemContextStub });
                }
                if (sServiceName === "UserDefaultParameters") {
                    return Promise.resolve({
                        hasRelevantMaintainableParameters: this.oHasRelevantMaintainableParametersStub,
                        editorGetParameters: this.oEditorGetParametersStub
                    });
                }
                return undefined;
            }.bind(this));

            sandbox.stub(Container, "getLogonSystem").returns({ sTrial: () => false });

            return XMLView.create({
                id: "defaultParametersSelector",
                viewName: "sap.ushell.components.shell.Settings.userDefaults.view.UserDefaultsSetting"
            }).then(function (oView) {
                this.oView = oView;
                //i18n set centrally for all settings. For the test need to set seperatly
                this.oView.setModel(resources.i18nModel, "i18n");
                this.oController = oView.getController();
            }.bind(this));
        },
        afterEach: function () {
            this.oView.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("creates form with plain (not smart) controls", function (assert) {
        // Arrange
        this.oParameters = {
            param1: {
                valueObject: { value: "someValue" }
            }
        };
        this.oEditorGetParametersStub = sandbox.stub().resolves(this.oParameters);

        // Act
        return this.oController._fillGroups().then(function () {
            // Assert
            var oSmartVariantManagement = this.oView.getContent()[1].getItems()[0];
            var oForm = this.oView.getContent()[3];
            var aGroups = oForm.getGroups();

            assert.ok(oSmartVariantManagement.isA("sap.ui.comp.smartvariants.SmartVariantManagement"), "SmartVariantManagement added to content aggregation of the view.");
            assert.ok(oForm.isA("sap.ushell.components.shell.Settings.userDefaults.UserDefaultsForm"), "SmartForm added to content aggregation of the view.");
            assert.equal(aGroups.length, 1, "One group was added");
            assert.ok(aGroups[0].isA("sap.ui.comp.smartform.Group"), "Group added to content aggregation of the SmartForm.");
            assert.equal(aGroups[0].getTitle().getText(), "", "Group has correct title");

            var aGroupElement = aGroups[0].getGroupElements();
            assert.equal(aGroupElement.length, 1, "One GroupElement was added to the group");
            assert.ok(aGroupElement[0].isA("sap.ui.comp.smartform.GroupElement"), "GroupElement added to content aggregation of the Group.");

            var aElements = aGroupElement[0].getElements();
            var oGroupLabel = aGroupElement[0].getLabel();
            assert.equal(aElements.length, 2, "Two element were added to the GroupElement");

            assert.ok(oGroupLabel.isA("sap.ui.comp.smartfield.SmartLabel"), "Label added to content.");
            assert.equal(oGroupLabel.getText(), "param1", "Label has correct text.");
            assert.equal(oGroupLabel.getTooltip(), "param1", "Label has correct Tooltip.");

            assert.equal(aElements[0].getName(), "param1", "input has correct name");
            assert.equal(aElements[0].getValue(), "someValue", "input has correct value");
            assert.equal(aElements[0].getType(), "Text", "input has correct type");

        }.bind(this));
    });

    QUnit.test("creates 2 groups", function (assert) {
        // Arrange
        this.oParameters = {
            param1: {
                valueObject: { value: "someValue1" },
                editorMetadata: {
                    groupTitle: "group1",
                    groupId: "group1"
                }
            },
            param2: {
                valueObject: { value: "someValue2" },
                editorMetadata: {
                    groupTitle: "group2",
                    groupId: "group2"
                }
            }
        };
        this.oEditorGetParametersStub = sandbox.stub().resolves(this.oParameters);

        // Act
        return this.oController._fillGroups().then(function () {
            // Assert
            var oSmartVariantManagement = this.oView.getContent()[1].getItems()[0];
            var oForm = this.oView.getContent()[3];
            var aGroups = oForm.getGroups();

            assert.ok(oSmartVariantManagement.isA("sap.ui.comp.smartvariants.SmartVariantManagement"), "SmartVariantManagement added to content aggregation of the view.");
            assert.ok(oForm.isA("sap.ushell.components.shell.Settings.userDefaults.UserDefaultsForm"), "SmartForm added to content aggregation of the view.");
            assert.equal(aGroups.length, 2, "One group was added");

            assert.equal(aGroups[0].getTitle().getText(), "group1", "Group has correct title");
            assert.equal(aGroups[1].getTitle().getText(), "group2", "Group has correct title");

        }.bind(this));
    });

    QUnit.test("put 2 fields in the same group", function (assert) {
        // Arrange
        this.oParameters = {
            param1: {
                valueObject: { value: "someValue1" },
                editorMetadata: {
                    groupTitle: "group1",
                    groupId: "group1",
                    parameterIndex: 1
                }
            },
            param2: {
                valueObject: { value: "someValue2" },
                editorMetadata: {
                    groupTitle: "group1",
                    groupId: "group1",
                    parameterIndex: 2
                }
            }
        };
        this.oEditorGetParametersStub = sandbox.stub().resolves(this.oParameters);

        // Act
        return this.oController._fillGroups().then(function () {
            // Assert
            var oSmartVariantManagement = this.oView.getContent()[1].getItems()[0];
            var oForm = this.oView.getContent()[3];
            var aGroups = oForm.getGroups();

            assert.ok(oSmartVariantManagement.isA("sap.ui.comp.smartvariants.SmartVariantManagement"), "SmartVariantManagement added to content aggregation of the view.");
            assert.ok(oForm.isA("sap.ushell.components.shell.Settings.userDefaults.UserDefaultsForm"), "SmartForm added to content aggregation of the view.");
            assert.equal(aGroups.length, 1, "One group was added");
            assert.ok(aGroups[0].isA("sap.ui.comp.smartform.Group"), "Group added to content aggregation of the SmartForm.");
            assert.equal(aGroups[0].getTitle().getText(), "group1", "Group has correct title");

            var aGroupElement = aGroups[0].getGroupElements();
            assert.equal(aGroupElement.length, 2, "Two GroupElement was added to the group");
            assert.ok(aGroupElement[0].isA("sap.ui.comp.smartform.GroupElement"), "GroupElement added to content aggregation of the Group.");
            assert.ok(aGroupElement[1].isA("sap.ui.comp.smartform.GroupElement"), "GroupElement added to content aggregation of the Group.");

            assert.equal(aGroupElement[0].getLabel().getText(), "param1", "Label has correct text.");
            assert.equal(aGroupElement[1].getLabel().getText(), "param2", "Label has correct text.");

        }.bind(this));
    });

    QUnit.test("creates form with plain (not smart) controls with extendValue button", function (assert) {
        // Arrange
        this.oParameters = {
            param1: {
                valueObject: { value: "someValue" },
                editorMetadata: {
                    extendedUsage: true
                }
            }
        };
        this.oEditorGetParametersStub = sandbox.stub().resolves(this.oParameters);

        // Act
        return this.oController._fillGroups().then(function () {
            // Assert
            var oForm = this.oView.getContent()[3];
            var aGroups = oForm.getGroups();

            var aGroupElement = aGroups[0].getGroupElements();

            var aElements = aGroupElement[0].getElements();

            //input
            assert.equal(aElements[0].getName(), "param1", "input has correct name");
            assert.equal(aElements[0].getValue(), "someValue", "input has correct value");
            assert.equal(aElements[0].getType(), "Text", "input has correct type");
            //button
            assert.ok(aElements[1].isA("sap.m.Button"), "Button was added to the form");
            assert.equal(aElements[1].getText(), resources.i18n.getText("userDefaultsExtendedParametersTitle"), "Button has correct text");
            assert.equal(aElements[1].getTooltip(), resources.i18n.getText("userDefaultsExtendedParametersTooltip"), "Button has correct tooltip");
            assert.equal(aElements[1].getType(), "Transparent", "Button has correct type");

        }.bind(this));
    });
});
