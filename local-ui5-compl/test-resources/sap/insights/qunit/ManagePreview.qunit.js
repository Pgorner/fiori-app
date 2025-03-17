/*global QUnit, sinon */
sap.ui.define([
    "sap/insights/ManagePreview",
    "sap/insights/utils/DeviceType",
    "sap/insights/manageCardPreview/Preview",
    "sap/insights/manageCardPreview/ColumnListPreview",
    "sap/m/MessageToast",
    "sap/insights/utils/CardPreviewManager",
    'sap/insights/CardHelper',
    "sap/insights/manageCardPreview/HouseOfCards"
], function (ManagePreview, DeviceType, Preview, ColumnListPreview, MessageToast, CardPreviewManager, CardHelper, HouseOfCards) {
    "use strict";
    QUnit.module("ManagePreview controller test cases", {
        beforeEach: function () {
            this.oSandbox = sinon.sandbox.create();
            this.oManagePreview = new ManagePreview();
            this.oManagePreview._oPreviewPage = new Preview();
            this.oManagePreview._oColumnListPreview = new ColumnListPreview();
            this.oManagePreview._oHouseOfCards = new HouseOfCards();
        },
        afterEach: function () {
            this.oSandbox.restore();
            this.oManagePreview.destroy();
            this.oManagePreview._oPreviewPage.destroy();
            this.oManagePreview._oColumnListPreview.destroy();
            this.oManagePreview._oHouseOfCards.destroy();
        }
    });
    QUnit.test("init", function (assert) {
        var stubGetId = sinon.stub(this.oManagePreview, "getId");
        stubGetId.returns("testId");
        var stubCreateStaticCtrl = sinon.stub(this.oManagePreview, "_createStaticControls");
        stubCreateStaticCtrl.returns();
        this.oManagePreview.init();
        assert.ok(stubCreateStaticCtrl, "_createStaticControls getting called");
        assert.ok(stubGetId, "getId getting called");
        stubGetId.restore();
        stubCreateStaticCtrl.restore();
    });
    QUnit.test("setConfirmButtonText: Setter for the ConfirmButtonText property", function (assert) {
        var stubGetId = sinon.stub(this.oManagePreview, "setProperty"),
            chkFnCall = 0,
            chkFnTextCall = 0,
            oAddButton = this.oManagePreview.oAddButton,
            stubSetText = sinon.stub(oAddButton, "setText");
        stubGetId.returns(chkFnCall++);
        stubSetText.returns(chkFnTextCall++);
        var sConfirmButtonText = "Test text";
        this.oManagePreview.setConfirmButtonText(sConfirmButtonText);
        assert.ok(chkFnCall, 1, "setProperty getting called");
        assert.ok(chkFnTextCall, 1, "setText getting called");
        stubGetId.restore();
        stubSetText.restore();
    });
    QUnit.test("_afterCloseDialog", function (assert) {
        var oManifest = {},
            stubManifest = sinon.stub(this.oManagePreview._oPreviewPage, "setManifest"),
            stubSetCardMessageInfo = sinon.stub(this.oManagePreview._oPreviewPage, "setCardMessageInfo"),
            stubSetConfirmButtonText = sinon.stub(this.oManagePreview, "setConfirmButtonText"),
            stubGetTransformation = sinon.stub(this.oManagePreview, "getTransformation");
        stubManifest.returns(oManifest);
        stubSetCardMessageInfo.returns();
        stubSetConfirmButtonText.returns(null);
        stubGetTransformation.returns(true);

        this.oManagePreview._oColumnListPreview.bShowPreview = true;
        this.oManagePreview._oColumnListPreview.bDialogOpen = true;
        this.oManagePreview._oColumnListPreview.oConfCard = {};
        this.oManagePreview._oColumnListPreview.oOrgCard = {};
        var oColumnSearch = this.oManagePreview._oColumnListPreview.oColumnSearch,
            stubSetValue = sinon.stub(oColumnSearch, "setValue");
        stubSetValue.returns('');
        this.oManagePreview._afterCloseDialog();

        assert.equal(this.oManagePreview._oColumnListPreview.bShowPreview, false);
        assert.ok(stubGetTransformation, "getTransformation getting called");
        assert.ok(stubSetConfirmButtonText, "setConfirmButtonText getting called");
        stubSetConfirmButtonText.restore();
        stubGetTransformation.restore();
        stubSetValue.restore();
        stubSetCardMessageInfo.restore();
        stubManifest.restore();
    });
    QUnit.test("_setEnableButton: Enables/disables the footer buttons, LROP Page", function (assert) {
        var chkFnCall = 0,
            oEvent = {
                getParameter: function () {
                    return true;
                }
            },
            oNextButton = this.oManagePreview.oNextButton,
            stubSetEnabled = sinon.stub(oNextButton, "setEnabled"),
            stubGetTransformation = sinon.stub(this.oManagePreview, "getTransformation");
        stubSetEnabled.returns(chkFnCall++);
        stubGetTransformation.returns(true);
        this.oManagePreview.bColumnPage = false;
        this.oManagePreview._setEnableButton(oEvent);
        assert.ok(chkFnCall, 1, "setEnabled getting called");
        stubSetEnabled.restore();
        stubGetTransformation.restore();
    });
    QUnit.test("_setEnableButton: Enables/disables the footer buttons, OverView Page", function (assert) {
        var chkFnCall = 0,
            oEvent = {
                getParameter: function () {
                    return true;
                }
            },
            oAddButton = this.oManagePreview.oAddButton,
            stubSetEnabled = sinon.stub(oAddButton, "setEnabled"),
            stubGetTransformation = sinon.stub(this.oManagePreview, "getTransformation");
        stubSetEnabled.returns(chkFnCall++);
        stubGetTransformation.returns(false);
        this.oManagePreview.bColumnPage = false;
        this.oManagePreview._setEnableButton(oEvent);
        assert.ok(chkFnCall, 1, "setEnabled getting called");
        stubSetEnabled.restore();
        stubGetTransformation.restore();
    });
    QUnit.test("openPreviewDialog: Opens the dialog for manage preview/add card to insights", function (assert) {
        var stubManifest = sinon.stub(this.oManagePreview, "getManifest"),
            sManifest = '{"sap.card":{"type":"Table"}}',
            chkFnCall = 0,
            oNextButton = this.oManagePreview.oNextButton,
            oBackButton = this.oManagePreview.oBackButton,
            oAddButton = this.oManagePreview.oAddButton,

            stubSetVisibleBackBtn = sinon.stub(oBackButton, "setVisible"),
            stubSetVisibleNextBtn = sinon.stub(oNextButton, "setVisible"),
            stubSetVisibleAddBtn = sinon.stub(oAddButton, "setVisible"),

            stubGetTransformation = sinon.stub(this.oManagePreview, "getTransformation");
        stubGetTransformation.returns(true);
        stubManifest.returns(sManifest);
        this.oManagePreview.oManifest = sManifest;

        var stubShowPreview = sinon.stub(this.oManagePreview, "_showPreview");
        stubShowPreview.returns();

        stubSetVisibleBackBtn.returns(false);
        stubSetVisibleNextBtn.returns(chkFnCall++);
        stubSetVisibleAddBtn.returns(false);

        this.oManagePreview.openPreviewDialog();
        assert.ok(chkFnCall, 1, "setVisible getting called");
        assert.ok(stubGetTransformation, "getTransformation getting called");
        stubShowPreview.restore();
        stubManifest.restore();
        stubGetTransformation.restore();
        stubSetVisibleBackBtn.restore();
        stubSetVisibleNextBtn.restore();
        stubSetVisibleAddBtn.restore();

    });
    QUnit.test("_createColumnListDialog: Creates ColumnListPreview control if the card type is list/table", function (assert) {
        var _oNavContainer = this.oManagePreview._oNavContainer,
            chkFnCall = 0,
            chkFnToCall = 0;
        var stubAddPage = sinon.stub(_oNavContainer, "addPage"),
            stubTo = sinon.stub(_oNavContainer, "to");
        this.oManagePreview.setDialogTitle("testTitle");
        var sDialogTitle = this.oManagePreview.getDialogTitle();
        var stubDialogTile = sinon.stub(this.oManagePreview._oPreviewPage, "setDialogTitle");
        stubAddPage.returns(chkFnCall++);
        stubTo.returns(chkFnToCall++);
        this.oManagePreview._createColumnListDialog();
        assert.ok(chkFnCall, 1, "addPage getting called");
        assert.ok(chkFnToCall, 1, "to getting called");
        stubDialogTile.calledWith(sDialogTitle);
    });
    QUnit.test("_createColumnListDialog: Creates ColumnListPreview control if the card type is list/table, and dialogTitle is not provided", function (assert) {
        var _oNavContainer = this.oManagePreview._oNavContainer,
            chkFnCall = 0,
            chkFnToCall = 0;
        var stubAddPage = sinon.stub(_oNavContainer, "addPage"),
            stubTo = sinon.stub(_oNavContainer, "to");
        this.oManagePreview.setDialogTitle("");
        var sDialogTitle = "Add Insights Card";
        var stubDialogTile = sinon.stub(this.oManagePreview._oColumnListPreview, "setDialogTitle");
        var stubHashListener = sinon.stub(this.oManagePreview, "hasListeners");
        stubHashListener.returns(true);
        this.oManagePreview.i18Bundle = {
            getText: function () {
                return sDialogTitle;
            }
        };
        stubAddPage.returns(chkFnCall++);
        stubTo.returns(chkFnToCall++);
        this.oManagePreview._createColumnListDialog();
        assert.ok(chkFnCall, 1, "addPage getting called");
        assert.ok(chkFnToCall, 1, "to getting called");
        stubDialogTile.calledWith(sDialogTitle);
    });
    QUnit.test("_createHocDialog: Creates HouseOfCards control if the card type is analytical", function (assert) {
        var chkFnCall = 0,
            stubManifest = sinon.stub(this.oManagePreview._oPreviewPage, "getManifest");
        stubManifest.returns(chkFnCall++);
        this.oManagePreview.setDialogTitle("testTitle");
        var sDialogTitle = this.oManagePreview.getDialogTitle();
        var stubDialogTile = sinon.stub(this.oManagePreview._oPreviewPage, "setDialogTitle");
        this.oManagePreview._createHocDialog();
        assert.ok(chkFnCall, 1, "getManifest getting called");
        stubDialogTile.calledWith(sDialogTitle);
    });
    QUnit.test("_createHocDialog: Creates HouseOfCards control if the card type is analytical and dialogTitle is not provided", function (assert) {
        var chkFnCall = 0,
            stubManifest = sinon.stub(this.oManagePreview._oPreviewPage, "getManifest");
        stubManifest.returns(chkFnCall++);
        this.oManagePreview.setDialogTitle("");
        var sDialogTitle = "Add Card to Insights";
        var stubDialogTile = sinon.stub(this.oManagePreview._oHouseOfCards, "setDialogTitle");
        var stubHashListener = sinon.stub(this.oManagePreview, "hasListeners");
        stubHashListener.returns(false);
        this.oManagePreview.i18Bundle = {
            getText: function () {
                return sDialogTitle;
            }
        };
        this.oManagePreview._createHocDialog();
        assert.ok(chkFnCall, 1, "getManifest getting called");
        stubDialogTile.calledWith(sDialogTitle);
    });
    QUnit.test("_save: header title is there - promise resolve", function (assert) {
        var oCard = {
            "sap.card": {
                header: {
                    title: "testTitle"
                }
            },
            "sap.insights": {
                visible: true
            }
        },
            sCard = '{"sap.card":{"header":{"title":"testTitle"}},"sap.insights":{"visible":true}}',
            stubGetManifest = sinon.stub(this.oManagePreview._oPreviewPage, "getManifest"),
            chkFnCall = 0,
            chkFnCall1 = 0;
        this.oManagePreview._oColumnListPreview.oConfCard = oCard;
        var stubMessageToast = sinon.stub(MessageToast, "show");
        stubMessageToast.returns();
        stubGetManifest.returns(sCard);
        var stubGetConfText = sinon.stub(this.oManagePreview, "getConfirmButtonText");
        stubGetConfText.returns(false);
        var stubSetBusy = sinon.stub(this.oManagePreview._oManageDialog, "setBusy");
        stubSetBusy.returns();
        var stubCloseDialog = sinon.stub(this.oManagePreview, "_closeDialog");
        stubCloseDialog.returns(chkFnCall1++);
        var stubCardPreviewManager = sinon.stub(CardPreviewManager, "insertActionsManifest");
        stubCardPreviewManager.returns(oCard);
        var stubGetServiceAsync = sinon.stub(CardHelper, "getServiceAsync");
        stubGetServiceAsync.returns(Promise.resolve({
            _createCard: function () {
                chkFnCall++;
                return Promise.resolve();
            }
        }));
        this.oManagePreview.i18Bundle = {
            getText: function () { }
        };
        var done = assert.async();
        this.oManagePreview._save();
        setTimeout(function () {
            assert.ok(stubCloseDialog.called, "closeDialog has been called once");
            assert.equal(chkFnCall, 1, "_createCard getting called");
            assert.equal(chkFnCall1, 1, "closeDialog getting called");
            stubCloseDialog.restore();
            stubGetServiceAsync.restore();
            stubMessageToast.restore();
            done();
        });
    });
    QUnit.test("save: header title is there - promise reject", function (assert) {
        var oCard = {
            "sap.card": {
                header: {
                    title: "testTitle"
                }
            },
            "sap.insights": {
                visible: true
            }
        },
            sCard = '{"sap.card":{"header":{"title":"testTitle"}},"sap.insights":{"visible":true}}',
            stubGetManifest = sinon.stub(this.oManagePreview._oPreviewPage, "getManifest"),
            chkFnCall = 0;
        this.oManagePreview._oColumnListPreview.oConfCard = oCard;
        var stubMessageToast = sinon.stub(MessageToast, "show");
        stubMessageToast.returns();
        stubGetManifest.returns(sCard);
        var stubGetConfText = sinon.stub(this.oManagePreview, "getConfirmButtonText");
        stubGetConfText.returns(false);
        var stubSetBusy = sinon.stub(this.oManagePreview._oManageDialog, "setBusy");
        stubSetBusy.returns();
        var stubGetServiceAsync = sinon.stub(CardHelper, "getServiceAsync");
        stubGetServiceAsync.returns(Promise.resolve({
            _createCard: function () {
                chkFnCall++;
                return Promise.reject({ "message": "error" });
            }
        }));
        this.oManagePreview.i18Bundle = {
            getText: function () { }
        };
        var done = assert.async();
        this.oManagePreview._save();
        setTimeout(function () {
            assert.equal(chkFnCall, 1, "_createCard getting called");
            stubGetServiceAsync.restore();
            stubMessageToast.restore();
            done();
        });
    });
    QUnit.test("save: header title is not there and getConfirmButtonText returns true", function (assert) {
        var oCard = {
            "sap.card": {
                header: {
                    title: "testTitle"
                },
                "content": {
                    "item": {
                        "actions": {}
                    }
                }
            },
            "sap.insights": {
                visible: true
            }
        },
            oEvent = {
                getSource: function () {
                    return {
                        setValueState: function () { },
                        setValueStateText: function () { },
                        getValue: function () {
                            return "titleText ";
                        }
                    };
                }
            },
            sCard = '{"sap.card":{"header":{"title":"testTitle"}},"sap.insights":{"visible":true}}',
            stubGetManifest = sinon.stub(this.oManagePreview._oPreviewPage, "getManifest"),
            chkFnCall = 0,
            chkFnCall1 = 0;
        this.oManagePreview.oManifest = {
            "sap.card": {
                "header": {
                    title: "testTitle",
                    actions: "testAction"
                },
                "type": "Analytical",
                "content": {
                    "row": {
                        "actions": {}
                    }
                }
            },
            "sap.insights": {
                visible: true
            }
        };
        this.oManagePreview._oColumnListPreview.oConfCard = oCard;
        this.oManagePreview._oHouseOfCards.oConfCard = oCard;
        stubGetManifest.returns(sCard);
        var stubGetConfText = sinon.stub(this.oManagePreview, "getConfirmButtonText");
        stubGetConfText.returns(true);
        var stubFireOnPress = sinon.stub(this.oManagePreview, "fireOnConfirmButtonPress");
        stubFireOnPress.returns(chkFnCall++);
        var stubCloseDialog = sinon.stub(this.oManagePreview, "_closeDialog");
        stubCloseDialog.returns(chkFnCall1++);

        var done = assert.async();
        this.oManagePreview._save(oEvent);
        setTimeout(function () {
            assert.equal(chkFnCall, 1, "fireOnConfirmButtonPress getting called");
            assert.equal(chkFnCall1, 1, "fireOnConfirmButtonPress getting called");
            stubCloseDialog.restore();
            stubFireOnPress.restore();
            stubGetConfText.restore();
            done();
        });
    });
    QUnit.test("save: when conf card is empty", function (assert) {
        var sCard = '{"sap.card":{"header":{"title":"testTitle"},"type":"Analytical","content":{"item":{"actions":{}}}},"sap.insights":{"visible":true}}',
            stubGetManifest = sinon.stub(this.oManagePreview._oPreviewPage, "getManifest"),
            chkFnCall = 0,
            chkFnCall1 = 0;
        this.oManagePreview.oManifest = {
            "sap.card": {
                "header": {
                    title: "testTitle",
                    actions: "testAction"
                },
                "type": "Analytical",
                "content": {
                    "item": {
                        "actions": {}
                    }
                }
            },
            "sap.insights": {
                visible: true
            }
        };
        this.oManagePreview._oColumnListPreview.oConfCard = {};
        this.oManagePreview._oHouseOfCards.oConfCard = {};
        stubGetManifest.returns(sCard);
        var stubGetConfText = sinon.stub(this.oManagePreview, "getConfirmButtonText");
        stubGetConfText.returns(true);
        var stubFireOnPress = sinon.stub(this.oManagePreview, "fireOnConfirmButtonPress");
        stubFireOnPress.returns(chkFnCall++);
        var stubCloseDialog = sinon.stub(this.oManagePreview, "_closeDialog");
        stubCloseDialog.returns(chkFnCall1++);

        var done = assert.async();
        this.oManagePreview._save();
        setTimeout(function () {
            assert.equal(chkFnCall, 1, "fireOnConfirmButtonPress getting called");
            assert.equal(chkFnCall1, 1, "fireCloseDialog getting called");
            stubCloseDialog.restore();
            stubFireOnPress.restore();
            stubGetConfText.restore();
            done();
        });
    });
    QUnit.test("_callNextPage: Handler when 'next' button is clicked for transformation enbaled cards, LROP cards", function (assert) {
        DeviceType.getDialogBasedDevice = function () { return "Desktop"; };
        var sCard = '{"sap.card":{"header":{"title":"testTitle"},"type":"Table"},"sap.insights":{"visible":true}}',
            stubGetManifest = sinon.stub(this.oManagePreview._oPreviewPage, "getManifest"),
            chkFnCall = 0,
            chkFnCall1 = 0,
            chkFnCall2 = 0;
        stubGetManifest.returns(sCard);
        var stubCreateColList = sinon.stub(this.oManagePreview, "_createColumnListDialog");
        stubCreateColList.returns(chkFnCall++);
        var stubSelectedKey = sinon.stub(this.oManagePreview._oColumnListPreview.oColumnSegButton, "getSelectedKey");
        stubSelectedKey.returns(false);
        var stubOnColumnSearch = sinon.stub(this.oManagePreview._oColumnListPreview, "_onColumnSearch");
        stubOnColumnSearch.returns(chkFnCall1++);

        var stubSetVisibleAddBtn = sinon.stub(this.oManagePreview.oAddButton, "setVisible");
        stubSetVisibleAddBtn.returns(chkFnCall2++);

        var done = assert.async();
        this.oManagePreview._callNextPage();
        setTimeout(function () {
            assert.equal(chkFnCall, 1, "_createColumnListDialog getting called");
            assert.equal(chkFnCall1, 1, "_onColumnSearch getting called");
            assert.ok(chkFnCall2, 1, "setVisible getting called for Add button");
            stubCreateColList.restore();
            stubOnColumnSearch.restore();
            stubSetVisibleAddBtn.restore();
            done();
        });
    });
    QUnit.test("_callNextPage: Handler when 'next' button is clicked for transformation enbaled cards, Analytic cards", function (assert) {
        DeviceType.getDialogBasedDevice = function () { return "Desktop"; };
        var sCard = '{"sap.card":{"header":{"title":"testTitle"},"type":"Analytical"},"sap.insights":{"visible":true}}',
            stubGetManifest = sinon.stub(this.oManagePreview._oPreviewPage, "getManifest"),
            chkFnCall = 0,
            chkFnCall1 = 0,
            chkFnCall2 = 0;
        stubGetManifest.returns(sCard);
        var stubCreateHOC = sinon.stub(this.oManagePreview, "_createHocDialog");
        stubCreateHOC.returns(chkFnCall++);
        var stubHouseOfCardsDialog = sinon.stub(this.oManagePreview._oHouseOfCards, "showHouseOfCardsDialog");
        stubHouseOfCardsDialog.returns(chkFnCall2++);

        var stubSetVisibleAddBtn = sinon.stub(this.oManagePreview.oAddButton, "setVisible");
        stubSetVisibleAddBtn.returns(chkFnCall1++);
        var done = assert.async();
        this.oManagePreview._callNextPage();
        setTimeout(function () {
            assert.equal(chkFnCall, 1, "_createHocDialog getting called");
            assert.equal(chkFnCall1, 1, "setVisible getting called forAdd button");
            assert.equal(chkFnCall2, 1, "showHouseOfCardsDialog getting called");
            stubHouseOfCardsDialog.restore();
            stubSetVisibleAddBtn.restore();
            stubGetManifest.restore();
            done();
        });
    });

    QUnit.test("_callPreviewPage: Loads the Preview page and pass manifest to it", function (assert) {
        DeviceType.getDialogBasedDevice = function () { return "Desktop"; };
        var oManifest = {
            "sap.card": {
                "header": {
                    "title": "title "
                },
                "type": "Table"
            }
        },
            chkFnCall = 0,
            chkFnCall1 = 0,
            chkFnCall2 = 0,
            chkFnCall3 = 0;
        this.oManagePreview._oColumnListPreview.bShowPreview = true;
        var stubNavTo = sinon.stub(this.oManagePreview._oNavContainer, "to");
        stubNavTo.returns(chkFnCall++);
        var stubAdjustLayoutStyles = sinon.stub(this.oManagePreview._oPreviewPage, "_adjustLayoutStyles");
        stubAdjustLayoutStyles.returns(chkFnCall1++);
        var stubSetEnabled = sinon.stub(this.oManagePreview.oNextButton, "setEnabled");
        stubSetEnabled.returns(chkFnCall2++);

        var oStubSetValueState = sinon.stub(this.oManagePreview._oPreviewPage.oTitleTextInput, "setValueState");
        var oStubSetValueStateText = sinon.stub(this.oManagePreview._oPreviewPage.oTitleTextInput, "setValueStateText");
        oStubSetValueState.returns();
        oStubSetValueStateText.returns();

        var stubSetPreview = sinon.stub(this.oManagePreview._oPreviewPage.oDefaultPreviewCardLS, "setPreviewMode");
        stubSetPreview.returns(chkFnCall3++);
        var stubSetManifest = sinon.stub(this.oManagePreview._oPreviewPage, "setManifest");
        stubSetManifest.returns();
        this.oManagePreview._oColumnListPreview.iVisibleColumnCount = 1;
        this.oManagePreview._callPreviewPage(oManifest);
        assert.equal(chkFnCall1, 1, "_adjustLayoutStyles getting called");
        assert.equal(chkFnCall, 1, "navigation has happened");
        assert.equal(chkFnCall2, 1, "setEnabled getting called once");
        assert.equal(chkFnCall3, 1, "setPreviewMode getting called once");
        assert.ok(stubSetManifest, "setManifest getting called once");

        stubNavTo.restore();
        stubAdjustLayoutStyles.restore();
        stubSetManifest.restore();
        oStubSetValueStateText.restore();
        stubSetEnabled.restore();
    });

    QUnit.test("_showPreview", function (assert) {
        var oManifest = {
            "sap.card": {
                "header": {
                    "title": "title "
                },
                "type": "Table"
            },
            "sap.insights": {
                visible: true
            }
        },
            chkFnCall = 0,
            chkFnToCall = 0,
            chkFnToCall2 = 0;
        this.oManagePreview.setDialogTitle("testTitle");
        var stubGetServiceAsync = sinon.stub(CardHelper, "getServiceAsync");
        var sDialogTitle = this.oManagePreview.getDialogTitle();
        stubGetServiceAsync.returns(Promise.resolve({
            _getUserAllCards: function () {
                return Promise.resolve([
                    {
                        "visibility": true
                    }
                ]);
            }
        }));
        var stubDialogTile = sinon.stub(this.oManagePreview._oPreviewPage, "setDialogTitle");
        var stubAddPage = sinon.stub(this.oManagePreview._oNavContainer, "addPage"),
            stubTo = sinon.stub(this.oManagePreview._oNavContainer, "to"),
            stubSetPreviewMode = sinon.stub(this.oManagePreview._oPreviewPage, "setPreviewModeOfCard");
        stubAddPage.returns(chkFnCall++);
        stubTo.returns(chkFnToCall++);
        stubSetPreviewMode.returns(chkFnToCall2++);
        var stubOpenDialog = sinon.stub(this.oManagePreview._oManageDialog, "open");
        stubOpenDialog.returns();
        var oStubSetValueState = sinon.stub(this.oManagePreview._oPreviewPage.oTitleTextInput, "setValueState");
        oStubSetValueState.returns();
        var stubCardPreviewManager = sinon.stub(CardPreviewManager, "getCardPreviewManifest");
        stubCardPreviewManager.returns(oManifest);

        return this.oManagePreview._showPreview(oManifest).then(function () {
            assert.ok(stubOpenDialog, "Dialog is Opened");
            assert.ok(oStubSetValueState, "setValueState is getting called");
            assert.ok(stubGetServiceAsync.called, "getServiceAsync is called");

            assert.ok(chkFnCall, 1, "addPage is called");
            assert.ok(chkFnToCall, 1, "Navigation to is called");
            assert.ok(chkFnToCall2, 1, "setPreviewModeOfCard is called");
            stubDialogTile.calledWith(sDialogTitle);

            stubSetPreviewMode.restore();
            stubGetServiceAsync.restore();
            stubAddPage.restore();
            stubTo.restore();
            oStubSetValueState.restore();
            stubOpenDialog.restore();
            stubCardPreviewManager.restore();
        });
    });

    QUnit.test("_onNavBack: Handler for back button on the footer", function (assert) {
        var chkFnCall = 0;
        this.oManagePreview._oColumnListPreview.oConfCard = {
            "sap.card": {
                "header": {
                    "title": "title "
                },
                "type": "Table"
            },
            "sap.insights": {
                visible: true
            }
        };
        var stubCallPreviewPage = sinon.stub(this.oManagePreview, "_callPreviewPage");
        stubCallPreviewPage.returns(chkFnCall++);
        this.oManagePreview._onNavBack();
        assert.ok(chkFnCall, 1, "_callPreviewPage getting called");
        stubCallPreviewPage.restore();
    });

    QUnit.test("_closeDialog: Closes the ManagePreview Dialog", function (assert) {
        var chkFnCall = 0;
        var stubClose = sinon.stub(this.oManagePreview._oManageDialog, "close");
        stubClose.returns(chkFnCall++);
        this.oManagePreview._closeDialog();
        assert.ok(chkFnCall, 1, "Dialog close fn getting called");
        stubClose.restore();
    });
});