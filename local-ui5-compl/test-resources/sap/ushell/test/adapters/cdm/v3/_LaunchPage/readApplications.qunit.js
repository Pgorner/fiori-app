// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.v3._LaunchPage.readApplications
 */
sap.ui.define([
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications"
], function (
    readApplications
) {
    "use strict";

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    QUnit.module("The method getId");

    QUnit.test("returns a value if the property is present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
                id: "appIdMock"
            }
        };
        //Act
        var oResult = readApplications.getId(oApplication);
        //Assert
        assert.strictEqual(oResult, "appIdMock", "returned the correct Value");
    });

    QUnit.test("returns undefined if property is not present", function (assert) {
        //Arrange
        //Act
        var oResult = readApplications.getId();
        //Assert
        assert.strictEqual(oResult, undefined, "returned the correct Value");
    });

    QUnit.module("The method getTitle");

    QUnit.test("returns a value if the property is present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
                title: "titleMock"
            }
        };
        //Act
        var oResult = readApplications.getTitle(oApplication);
        //Assert
        assert.strictEqual(oResult, "titleMock", "returned the correct Value");
    });

    QUnit.test("returns undefined if property is not present", function (assert) {
        //Arrange
        //Act
        var oResult = readApplications.getTitle();
        //Assert
        assert.strictEqual(oResult, undefined, "returned the correct Value");
    });

    QUnit.module("The method getSubTitle");

    QUnit.test("returns a value if the property is present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
                subTitle: "subTitleMock"
            }
        };
        //Act
        var oResult = readApplications.getSubTitle(oApplication);
        //Assert
        assert.strictEqual(oResult, "subTitleMock", "returned the correct Value");
    });

    QUnit.test("returns undefined if property is not present", function (assert) {
        //Arrange
        //Act
        var oResult = readApplications.getSubTitle();
        //Assert
        assert.strictEqual(oResult, undefined, "returned the correct Value");
    });

    QUnit.module("The method getIcon");

    QUnit.test("returns a value if the property is present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.ui": {
                icons: {
                    icon: "iconMock"
                }
            }
        };
        //Act
        var oResult = readApplications.getIcon(oApplication);
        //Assert
        assert.strictEqual(oResult, "iconMock", "returned the correct Value");
    });

    QUnit.test("returns undefined if property is not present", function (assert) {
        //Arrange
        //Act
        var oResult = readApplications.getIcon();
        //Assert
        assert.strictEqual(oResult, undefined, "returned the correct Value");
    });

    QUnit.module("The method getInfo");

    QUnit.test("returns a value if the property is present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
                info: "infoMock"
            }
        };
        //Act
        var oResult = readApplications.getInfo(oApplication);
        //Assert
        assert.strictEqual(oResult, "infoMock", "returned the correct Value");
    });

    QUnit.test("returns undefined if property is not present", function (assert) {
        //Arrange
        //Act
        var oResult = readApplications.getInfo();
        //Assert
        assert.strictEqual(oResult, undefined, "returned the correct Value");
    });

    QUnit.module("The method getKeywords");

    QUnit.test("returns a value if the property is present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
                tags: {
                    keywords: ["keywordMock"]
                }
            }
        };
        //Act
        var aResult = readApplications.getKeywords(oApplication);
        //Assert
        assert.deepEqual(aResult, ["keywordMock"], "returned the correct Value");
    });

    QUnit.test("returns undefined if property is not present", function (assert) {
        //Arrange
        //Act
        var aResult = readApplications.getKeywords();
        //Assert
        assert.strictEqual(aResult, undefined, "returned the correct Value");
    });

    QUnit.module("The method getContentProviderId");

    QUnit.test("returns a value if the property is present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
                contentProviderId: "contentProviderIdMock"
            }
        };
        //Act
        var sResult = readApplications.getContentProviderId(oApplication);
        //Assert
        assert.deepEqual(sResult, "contentProviderIdMock", "returned the correct Value");
    });

    QUnit.test("returns undefined if property is not present", function (assert) {
        //Arrange
        //Act
        var sResult = readApplications.getContentProviderId();
        //Assert
        assert.strictEqual(sResult, undefined, "returned the correct Value");
    });

    QUnit.module("The method getInbounds");

    QUnit.test("Returns the inbound object if present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
                crossNavigation: {
                    inbounds: {
                        id: "inboundsMock"
                    }
                }
            }
        };
        //Act
        var oResult = readApplications.getInbounds(oApplication);
        //Assert
        assert.strictEqual(oResult, oApplication["sap.app"].crossNavigation.inbounds, "returned the correct result");
    });

    QUnit.test("Returns undefined if no inbound is present", function (assert) {
        //Arrange
        var oApplication = {};
        //Act
        var oResult = readApplications.getInbounds(oApplication);
        //Assert
        assert.strictEqual(oResult, undefined, "returned the correct result");
    });

    QUnit.module("The method getInbound");

    QUnit.test("Returns a specific inbound object if present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
                crossNavigation: {
                    inbounds: {
                        inboundsMock: {
                            id: "inboundsMock"
                        }
                    }
                }
            }
        };
        //Act
        var oResult = readApplications.getInbound(oApplication, "inboundsMock");
        //Assert
        assert.strictEqual(oResult, oApplication["sap.app"].crossNavigation.inbounds.inboundsMock, "returned the correct result");
    });

    QUnit.test("Returns undefined if no inbound is present", function (assert) {
        //Arrange
        var oApplication = {};
        //Act
        var oResult = readApplications.getInbound(oApplication);
        //Assert
        assert.strictEqual(oResult, undefined, "returned the correct result");
    });

    QUnit.module("getInboundTarget", {
        beforeEach: function () {
            this.oApplicationsMock = {
                appId1: {
                    inboundId1: {
                        semanticObject: "Action",
                        action: "toSample"
                    }
                }
            };

            this.oGetInboundStub = sandbox.stub(readApplications, "getInbound");
            this.oGetInboundStub.withArgs(this.oApplicationsMock.appId1, "inboundId1").returns(this.oApplicationsMock.appId1.inboundId1);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct result if inbound is present", function (assert) {
        // Arrange
        var oExpectedResult = {
            semanticObject: "Action",
            action: "toSample"
        };
        // Act
        var oResult = readApplications.getInboundTarget(this.oApplicationsMock, "appId1", "inboundId1");
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Returned the correct result");
        assert.strictEqual(this.oGetInboundStub.callCount, 1, "getInbound was called once");
    });

    QUnit.test("Returns the undedfined if inbound is not present", function (assert) {
        // Arrange
        // Act
        var oResult = readApplications.getInboundTarget(this.oApplicationsMock, "appId1", "inboundId2");
        // Assert
        assert.deepEqual(oResult, undefined, "Returned undefined");
        assert.strictEqual(this.oGetInboundStub.callCount, 1, "getInbound was called once");
    });

    QUnit.test("Returns the undedfined if app is not present", function (assert) {
        // Arrange
        // Act
        var oResult = readApplications.getInboundTarget(this.oApplicationsMock, "appId2", "inboundId1");
        // Assert
        assert.deepEqual(oResult, undefined, "Returned undefined");
        assert.strictEqual(this.oGetInboundStub.callCount, 1, "getInbound was called once");
    });

    QUnit.module("The method getTechnicalAttributes");

    QUnit.test("Returns undefined if no tags are present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
            }
        };
        //Act
        var oResult = readApplications.getTechnicalAttributes(oApplication);
        //Assert
        assert.strictEqual(oResult, undefined, "returned the correct result");
    });

    QUnit.test("Returns undefined if no technical attributes present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
                tags: {
                }
            }
        };
        //Act
        var oResult = readApplications.getTechnicalAttributes(oApplication);
        //Assert
        assert.strictEqual(oResult, undefined, "returned the correct result");
    });

    QUnit.test("Returns the array of technical attributes if present", function (assert) {
        //Arrange
        var oApplication = {
            "sap.app": {
                tags: {
                    technicalAttributes: ["ATTRIBUTE1", "ATTRIBUTE2"]
                }
            }
        };
        //Act
        var oResult = readApplications.getTechnicalAttributes(oApplication);
        //Assert
        assert.deepEqual(oResult, ["ATTRIBUTE1", "ATTRIBUTE2"], "returned the correct result");
    });

});
