/*global sap, QUnit, sinon*/
sap.ui.define([
    "sap/suite/ui/commons/collaboration/CollaborationHelper",
    "sap/ui/core/Lib"
], function (CollaborationHelper, Library){

    var longURL = "https://host.abc.com/ui#PurchaseOrder-manage&/?sap-iapp-state--history=TASLUM48KWGGA7ZEWUQL9KI1NW3KWFGEIKXWBSZ2O&sap-iapp-state=ASJD635429RBLG9X60V80WOJ4LZX93QQHAM6IHPE";
    var sURLWithoutSO = "https://host.abc.com/ui";

    QUnit.module("CollaborationHelper", {
		beforeEach: function() {
            var oMockContainer = {
                getServiceAsync: function (params) {
                    if (params === "URLParsing"){
                        return Promise.resolve({
                            parseParameters: function() {
                                return {
                                    "sap-collaboration-teams":["true"],
                                    "sap-ushell-config": ["lean"]
                                };
                            },
                            parseShellHash: function() {
                                return {
                                    contextRaw:'contextRaw',
                                    semanticObject:'semanticObject',
                                    action:'action'
                                };
                            }
                        });
                    } else {
                        return Promise.resolve({
                            createEmptyAppState: function () {
                                return {
                                    getKey: function () {
                                        return "ASLNEL23BUZSMF8KM0Q0V1HVJ3ZAH5Y1LR4PZG8T";
                                    }
                                };
                            },
                            getAppState: function () {
                                return Promise.resolve(longURL);
                            },
                            _oConfig: {
                                "transient": false
                            }
                        });
                    }
                },
                getFLPUrlAsync: function() {
                    return new jQuery.Deferred().resolve(longURL).promise();
                },
                getService: function(params) {
                    if (params === "URLParsing"){
                        return {
                            parseParameters: function() {
                                return {
                                    "sap-collaboration-teams":["true"],
                                    "sap-ushell-config": ["lean"]
                                };
                            },
                            parseShellHash: function() {
                                return {
                                    contextRaw:'contextRaw',
                                    semanticObject:'semanticObject',
                                    action:'action'
                                };
                            }
                        };
                    }
                }
            };
            var byId = function () {
                return {
                    setVisible: function() {}
                };
            };
			this.oSandbox = sinon.sandbox.create();
            this.oLibraryStub = this.oSandbox.stub(Library, "isLoaded").returns(true);
            this.oRequireStub = this.oSandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs('sap/ushell/Container').returns(oMockContainer);
		},
		afterEach: function() {
			this.oSandbox.restore();
            this.oRequireStub.restore();
            this.oLibraryStub.restore();
		}
	});

    QUnit.test("Compact hash - Negative Scenario: When backend persistency toggle is not enabled.", function(assert) {
        //Arrange
        var oMockContainerAtTest = {
            getServiceAsync: function () {
                return Promise.resolve({
                    createEmptyAppState: function () {
                        return {
                            getKey: function () {
                                return "ASLNEL23BUZSMF8KM0Q0V1HVJ3ZAH5Y1LR4PZG8T";
                            }
                        };
                    },
                    _oConfig: {
                        "transient": true
                    }
                });
            }
        };
        this.oRequireStub.withArgs('sap/ushell/Container').returns(oMockContainerAtTest);
        //Act
        return CollaborationHelper.compactHash(longURL).then(function(shortURL){
            //Assert
            assert.ok(typeof shortURL === "object","CompactHash should have returned an object.");
            assert.equal(longURL,shortURL.url,'Url is not minified as the system does not support appstate persistency.');
        });
    });

    QUnit.test("Compact hash - Negative Scenario: When semantic object and action is not defined.", function(assert) {
        var oMockContainerAtTest =  {
            getServiceAsync: function (params) {
                if (params === "URLParsing"){
                    return Promise.resolve({
                        parseShellHash: function() {
                            return undefined;
                        }
                    });
                } else {
                    return Promise.resolve({
                        createEmptyAppState: function () {
                            return {
                                getKey: function () {
                                    return "ASLNEL23BUZSMF8KM0Q0V1HVJ3ZAH5Y1LR4PZG8T";
                                }
                            };
                        },
                        getAppState: function () {
                            return Promise.resolve(longURL);
                        },
                        _oConfig: {
                            "transient": false
                        }
                    });
                }
            }
        };
        this.oRequireStub.withArgs('sap/ushell/Container').returns(oMockContainerAtTest);
        //Act
        return CollaborationHelper.compactHash(sURLWithoutSO).then(function(shortURL){
            //Assert
            assert.ok(typeof shortURL === "object","CompactHash should have returned an object.");
            assert.equal(sURLWithoutSO,shortURL.url,'longURL should be equal to the shortened URL');
        });
    });

    QUnit.test("Compact hash - Positive Scenario: When saving the URL is successfull.", function(assert) {
        //Arrange
        var sExpectedURL = "https://host.abc.com/ui#PurchaseOrder-manage&/sap-url-hash=ASLNEL23BUZSMF8KM0Q0V1HVJ3ZAH5Y1LR4PZG8T";
        this.oSandbox.stub(CollaborationHelper,"_getNextKey").returns('ASLNEL23BUZSMF8KM0Q0V1HVJ3ZAH5Y1LR4PZG8T');
        this.oSandbox.stub(CollaborationHelper,"_isMinificationFeasible").returns(true);
        this.oSandbox.stub(CollaborationHelper,"_extractURLBeforeHash").returns("https://host.abc.com/ui");
        this.oSandbox.stub(CollaborationHelper,"_extractSemanticObjectAndAction").returns("PurchaseOrder-manage");
        this.oSandbox.stub(CollaborationHelper,"_storeUrl").returns(Promise.resolve());
        //Act
        return CollaborationHelper.compactHash(longURL).then(function(shortURL){
            //Assert
            assert.ok(typeof shortURL === "object","CompactHash should have returned an object.");
            assert.equal(sExpectedURL,shortURL.url,'URL Minified');
        });
    });

    QUnit.test("GetCurrentUrl - When getting the current url via shell Container",function(assert) {
        //Act
        return CollaborationHelper._getCurrentUrl().then(function(currentUrl){
            //Assert
            assert.equal(longURL,currentUrl,'Able to get Current URL');
        });
    });

    QUnit.test("IsTeamsModeActive - Positive Scenario: When appstate is lean and app is running in teams", function(assert) {
        //Arange
        var sExpectedURL = "https://host:port/ui?sap-collaboration-teams=true&sap-ushell-config=lean#sematicobject-action&/";
        this.oSandbox.stub(CollaborationHelper,"_getCurrentUrl").returns(Promise.resolve(sExpectedURL));
        //Act
        return CollaborationHelper.isTeamsModeActive().then(function(result){
            //Assert
            assert.ok(result, true,"App should be running in Teams environment");
        });
    });

    QUnit.test("RetrieveURL - Positive case",function(assert){
        //Act
        return CollaborationHelper._retrieveURL().then(function(data){
            //Assert
            assert.equal(data,longURL, "Retrive URL successfully");
        });
    });

    QUnit.test("IsEligibleForBackendPersistency - Positive case",function(assert){
        //Arrange
        var oAppStateInstance = { _oConfig:{"transient": false}};
        //Act
        var result =  CollaborationHelper._isEligibleForBackendPersistency(oAppStateInstance);
        //Assert
        assert.equal(result,true);
    });

    QUnit.test("GetNextKey - Positive case",function(assert){
        //Arrange
        var oAppStateInstance = {getKey:function(){
            return 'ASLNEL23BUZSMF8KM0Q0V1HVJ3ZAH5Y1LR4PZG8T';
        }};
        //Act
        var key = CollaborationHelper._getNextKey(oAppStateInstance);
        //Assert
        assert.equal(key,'ASLNEL23BUZSMF8KM0Q0V1HVJ3ZAH5Y1LR4PZG8T');
    });
    QUnit.test("ExtractSemanticObjectAndAction", async function(assert){
        var oMockContainerAtTest = {
            getServiceAsync: function(params) {
                if (params === "URLParsing"){
                    return Promise.resolve({
                        parseShellHash: function() {
                            return {
                                contextRaw:'contextRaw',
                                semanticObject:'semanticObject',
                                action:'action'
                            };
                        }
                    });
                }
            }
        };
        this.oRequireStub.withArgs('sap/ushell/Container').returns(oMockContainerAtTest);
        var oParsedShellHash = await CollaborationHelper._extractSemanticObjectAndAction(longURL);
        assert.equal(oParsedShellHash, "semanticObject-action~contextRaw", "extracted semantic object, action and the context.");
    });
    QUnit.test("ExtractURLBeforeHash - Positive case where URL before the hash is returned successfully",function(assert){
        var sUrl = "https://host:port/?ui#sematicobject-action&/?sap-url-hash=ASLNEL23BUZSMF8KM0Q0V1HVJ3ZAH5Y1LR4PZG8T";
        var sUrlBeforeHash = CollaborationHelper._extractURLBeforeHash(sUrl);
        assert.ok(sUrlBeforeHash);
        assert.equal(sUrlBeforeHash,"https://host:port/?ui");
    });
    QUnit.test("ExtractURLHash - Positive case where hash of the url is returned successfully", function(assert){
        var sUrl = "https://host:port/?ui#sematicobject-action&/?sap-url-hash=ASLNEL23BUZSMF8KM0Q0V1HVJ3ZAH5Y1LR4PZG8T";
        var sUrlHash = CollaborationHelper._extractURLHash(sUrl);
        assert.ok(sUrlHash);
        assert.equal(sUrlHash, '#sematicobject-action&/?sap-url-hash=ASLNEL23BUZSMF8KM0Q0V1HVJ3ZAH5Y1LR4PZG8T');
    });
    QUnit.test("storeURL - Positive case when the url is saved successfully in the backend persistency", function(assert){
        var oAppStateService = {
            setData:function() {
                return;
            },
            save:function(){
                return true;
            }
        };
        var result = CollaborationHelper._storeUrl(longURL,oAppStateService);
        assert.ok(result);
    });
});