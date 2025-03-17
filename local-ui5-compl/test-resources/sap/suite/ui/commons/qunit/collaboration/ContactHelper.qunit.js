/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/suite/ui/commons/collaboration/ContactHelper",
    "sap/ui/model/json/JSONModel",
    "sap/m/library",
    "sap/ui/core/Core"
], function (ContactHelper, JSONModel, mLibrary, sapUi){
	"use strict";

    var oMockedData = null;
    var oJsonModel = new JSONModel();
    var globalURLHelper;
    oJsonModel.loadData(sap.ui.require.toUrl("test-resources") + "/sap/suite/ui/commons/qunit/collaboration/ContactHelperMock.json").then(function(){
        oMockedData = oJsonModel.getData();
    });

    QUnit.module("ContactHelper Service Test Cases", {
		beforeEach: function() {
            globalURLHelper = mLibrary.URLHelper;
            mLibrary.URLHelper.redirect = function () {
                return;
            };
			this.oSandbox = sinon.sandbox.create();
            this.oProviderConfig = {};
            this.oProviderConfig["applicationId"] = "757953cf-7d8e-4586-a375-050c6f21b1b6";
            this.oProviderConfig["tenantId"] = "https://login.microsoftonline.com/1b0f7603-f987-4314-a473-7ae253c7569a";
            this.oContactHelper = new ContactHelper(this.oProviderConfig);
		},
		afterEach: function() {
			this.oSandbox.restore();
            this.oContactHelper.destroy();
            mLibrary.URLHelper = globalURLHelper;
		}
	});

    QUnit.test("Test handleMSTeamsPress function - Chat", function(assert) {
        var oEvent = {
            getSource: function() {
                return {
                    data: function(data) {
                        if (data === "email") {
                            return "FrankW%40t25ws.onmicrosoft.com";
                        } else if (data === "type") {
                            return "chat";
                        }
                    }
                };
            }
        };
        var oSpy = sinon.spy(mLibrary.URLHelper, "redirect");
        var sChatUrl = "https://teams.microsoft.com/l/chat/0/0?users=FrankW%40t25ws.onmicrosoft.com";
        this.oContactHelper.handleMSTeamsPress(oEvent);
        assert.ok(oSpy.called, "Redirect was, at least, called");
        assert.ok(oSpy.calledWith(sChatUrl, true), "Redirect was called with the right arguments");
    });

    QUnit.test("Test handleMSTeamsPress function - videoCall", function(assert) {
        var oEvent = {
            getSource: function() {
                return {
                    data: function(data) {
                        if (data === "email") {
                            return "FrankW%40t25ws.onmicrosoft.com";
                        } else if (data === "type") {
                            return "videoCall";
                        }
                    }
                };
            }
        };
        var oSpy = sinon.spy(mLibrary.URLHelper, "redirect");
        var sVideoUrl = "https://teams.microsoft.com/l/call/0/0?users=FrankW%40t25ws.onmicrosoft.com&withVideo=true";
        this.oContactHelper.handleMSTeamsPress(oEvent);
        assert.ok(oSpy.called, "Redirect was, at least, called");
        assert.ok(oSpy.calledWith(sVideoUrl, true), "Redirect was called with the right arguments");
    });

    QUnit.test("Test handleMSTeamsPress function - call", function(assert) {
        var oEvent = {
            getSource: function() {
                return {
                    data: function(data) {
                        if (data === "email") {
                            return "FrankW%40t25ws.onmicrosoft.com";
                        } else if (data === "type") {
                            return "call";
                        }
                    }
                };
            }
        };
        var oSpy = sinon.spy(mLibrary.URLHelper, "redirect");
        var sCallUrl = "https://teams.microsoft.com/l/call/0/0?users=FrankW%40t25ws.onmicrosoft.com";
        this.oContactHelper.handleMSTeamsPress(oEvent);
        assert.ok(oSpy.called, "Redirect was, at least, called");
        assert.ok(oSpy.calledWith(sCallUrl, true), "Redirect was called with the right arguments");
    });

    QUnit.test("Test handleMSTeamsPress function - Negative case", function(assert) {
        var oEvent = {
            getSource: function() {
                return {
                    data: function(data) {
                        if (data === "email") {
                            return "FrankW%40t25ws.onmicrosoft.com";
                        } else if (data === "type") {
                            return "";
                        }
                    }
                };
            }
        };
        var oSpy = sinon.spy(mLibrary.URLHelper, "redirect");
        this.oContactHelper.handleMSTeamsPress(oEvent);
        assert.ok(oSpy.called, "Redirect was, at least, called");
        assert.ok(oSpy.calledWith("", true), "Redirect was called with the right arguments");
    });

    QUnit.test("Test formatUri function - mail", function(assert) {
        var sValue = "FrankW@t25ws.onmicrosoft.com";
        var sFormattedUri = this.oContactHelper.formatUri(sValue);
        assert.equal(sFormattedUri === "mailto:FrankW@t25ws.onmicrosoft.com", true, "uri is formatted to email with");
    });

    QUnit.test("Test formatUri function - telephone", function(assert) {
        var sValue = "+1 858 555 0110";
        var sFormattedUri = this.oContactHelper.formatUri(sValue);
        assert.equal(sFormattedUri === "tel:+1 858 555 0110", true, "uri is formatted to telephone with");
    });
});
