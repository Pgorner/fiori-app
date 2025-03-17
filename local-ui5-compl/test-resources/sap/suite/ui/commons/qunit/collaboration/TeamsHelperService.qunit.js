/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/suite/ui/commons/collaboration/TeamsHelperService",
	"sap/suite/ui/commons/collaboration/CollaborationHelper",
	"sap/suite/ui/commons/collaboration/CollaborationCardHelper",
	"sap/base/security/URLListValidator",
	"sap/suite/ui/commons/collaboration/ContactHelper",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"sap/ui/core/Lib"
], function (Core, TeamsHelperService, CollaborationHelper, CollaborationCardHelper, URLListValidator, ContactHelper, Device, Fragment, Library) {

	var sURL = "https://host.abc.com/ui#manage-product";
	QUnit.module("TeamsHelperService", {
		beforeEach: function () {
            var oMockContainer =  {
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
									action:'action',
									params: {}
								};
							},
							constructShellHash: function() {
								return "semanticObject-action";
							}
						});
					} else {
						return Promise.resolve({
							createEmptyAppState: function () {
								return {
									getKey: function () {
										return "ABC123";
									}
								};
							},
							getAppState: function () {
								return Promise.resolve(sURL);
							},
							_oConfig: {
								"transient": false
							}
						});
					}
				},
				getFLPUrlAsync: function() {
					return new jQuery.Deferred().resolve(sURL).promise();
				}
			};
			this.oSandbox = sinon.sandbox.create();
			this.oResourceBundleStub = this.oSandbox.stub(Library, "getResourceBundleFor").returns({
				getText: function () {
					return 'Text';
				}
			});
			this.oSandbox = sinon.sandbox.create();
            this.oLibraryStub = this.oSandbox.stub(Library, "isLoaded").returns(true);
            this.oRequireStub = this.oSandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs('sap/ushell/Container').returns(oMockContainer);
		},
		afterEach: function () {
			this.oSandbox.restore();
			this.oRequireStub.restore();
            this.oLibraryStub.restore();
            this.oResourceBundleStub.restore();
		}
	});

	QUnit.test("GetOptions - Chat, Tab and Card options are enabled", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "ENABLED"
		});
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].subOptions.length, 3, "Three options enabled");
	});

	QUnit.test("GetOptions - Chat, Tab and Card options are enabled", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "AUTHENABLE"
		});
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].subOptions.length, 3, "Three options enabled");
	});

	QUnit.test("GetOptions - Share as Link Disabled from CommunicationArrangement", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "DISABLED"
		});
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].key, "COLLABORATION_MSTEAMS_TAB", "one options enabled");
	});

	QUnit.test("GetOptions - Share as Card should enable if isShareAsCardEnabled is Enabled", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "",
			isShareAsTabEnabled: "",
			isShareAsCardEnabled: "ENABLED"
		});
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].key, "COLLABORATION_MSTEAMS_CARD", "one options enabled");
	});

	QUnit.test("GetOptions - Share as Card should enable if isShareAsCardEnabled value not available but isShareAsTabEnabled is enable", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "",
			isShareAsTabEnabled: "X"
		});
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].subOptions.length, 2, "two options enabled");
	});

	QUnit.test("GetOptions - Share as Card should enable if isShareAsCardEnabled value is not set but isShareAsTabEnabled is enable", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: ""
		});
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].subOptions.length, 2, "two options enabled");
	});

	QUnit.test("GetOptions - Share as Card should disabled if isShareAsCardEnabled value not available and isShareAsTabEnabled is also disabled", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: ""
		});
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].key, "COLLABORATION_MSTEAMS_CHAT", "two options enabled");
	});

	QUnit.test("GetOptions - Share as Card should disabled if isShareAsCardEnabled value is not set and isShareAsTabEnabled is disable", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "",
			isShareAsCardEnabled: ""
		});
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].key, "COLLABORATION_MSTEAMS_CHAT", "two options enabled");
	});

	QUnit.test("GetOptions - Share as Card should disabled if isShareAsCardEnabled value is not set and isShareAsTabEnabled is disable", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "",
			isShareAsCardEnabled: "NO_MATCHING_CASE"
		});
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].key, "COLLABORATION_MSTEAMS_CHAT", "two options enabled");
	});

	QUnit.test("GetOptions - Share as Link Disabled by Consumer", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "ENABLED"
		});
		this.sandbox.stub(teamsHelperInstance, "isFeatureFlagEnabled").returns(true);
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsLinkEnabled: false,
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].subOptions.length, 2, "Two options enabled");
	});

	QUnit.test("GetOptions - Feature flag is disabled", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "ENABLED"
		});
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].subOptions.length, 3, "Two option enabled");
	});

	QUnit.test("GetOptions - Share as Tab Disabled by Consumer", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "ENABLED"
		});
		this.sandbox.stub(teamsHelperInstance, "isFeatureFlagEnabled").returns(true);
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsTabEnabled: false,
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options[0].subOptions.length, 2, "Two options enabled");
	});

	QUnit.test("GetOptions - Share as Card Disabled by Consumer", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X"
		});
		this.sandbox.stub(teamsHelperInstance, "isFeatureFlagEnabled").returns(true);
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: false
		});
		//Assert
		assert.equal(options[0].subOptions.length, 2, "Share as Card options disabled");
	});

	QUnit.test("GetOptions - Only Share as Tab is Enabled", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "",
			isShareAsTabEnabled: "X"
		});
		this.sandbox.stub(teamsHelperInstance, "isFeatureFlagEnabled").returns(true);
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: false
		});
		//Assert
		assert.equal(options[0].key, "COLLABORATION_MSTEAMS_TAB", "COLLABORATION_MSTEAMS_TAB option enabled");
	});

	QUnit.test("GetOptions - Mobile Device", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "x",
			isShareAsTabEnabled: "x"
		});
		this.sandbox.stub(teamsHelperInstance, "isFeatureFlagEnabled").returns(true);
		Device.system.desktop = false;
		//Act
		var options = teamsHelperInstance.getOptions({
			isShareAsCardEnabled: true
		});
		//Assert
		assert.equal(options.length, 0, "Collaboration Options skipped as device is not Desktop");
	});

	QUnit.test("Share - Share as Chat when Invalid URL", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: true
		});
		teamsHelperInstance._shareAsChat = function () {
			return;
		};
		var oOption = {
			key: 'COLLABORATION_MSTEAMS_CHAT'
		};
		var oParams = {
			url: sURL,
			minifyUrlForChat: true
		};
		this.oSandbox.stub(URLListValidator, "validate").returns(false);
		var oSpy = sinon.spy(teamsHelperInstance, "_shareAsChat");
		//Act
		teamsHelperInstance.share(oOption, oParams);
		//Assert
		assert.notOk(oSpy.called, "The URL provided is not valid, and the \"shareAsChat\" method has not been triggered or called.");
	});

	QUnit.test("Share - Share as Chat when there is no URL", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: true
		});
		teamsHelperInstance._shareAsChat = function () {
			return;
		};
		var oOption = {
			key: 'COLLABORATION_MSTEAMS_CHAT'
		};
		var oParams = {
			url: undefined,
			minifyUrlForChat: true
		};
		this.oSandbox.stub(URLListValidator, "validate").returns(false);
		var oSpy = sinon.spy(teamsHelperInstance, "_shareAsChat");
		//Act
		teamsHelperInstance.share(oOption, oParams);
		//Assert
		assert.notOk(oSpy.called, "The function \"shareAsChat\" was not called because the URL is absent in the \"oParams\" parameter.");
	});

	QUnit.test("Share - Postive Case when key is 'COLLABORATION_MSTEAMS_CHAT'", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: true
		});
		teamsHelperInstance._shareAsChat = function () {
			return;
		};
		var oOption = {
			key: 'COLLABORATION_MSTEAMS_CHAT'
		};
		var oParams = {
			url: sURL,
			minifyUrlForChat: true
		};
		this.oSandbox.stub(URLListValidator, "validate").returns(true);
		var oSpy = sinon.spy(teamsHelperInstance, "_shareAsChat");
		//Act
		teamsHelperInstance.share(oOption, oParams);
		//Assert
		assert.ok(oSpy.called, "The \"shareAsChat\" method was called.");
	});

	QUnit.test("Share - Postive Case when key is 'COLLABORATION_MSTEAMS_TAB'", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: true
		});
		teamsHelperInstance._shareAsTab = function () {
			return;
		};
		var oOption = {
			key: 'COLLABORATION_MSTEAMS_TAB'
		};
		var oParams = {
			url: sURL,
			minifyUrlForChat: true
		};
		this.oSandbox.stub(URLListValidator, "validate").returns(true);
		var oSpy = sinon.spy(teamsHelperInstance, "_shareAsTab");
		//Act
		teamsHelperInstance.share(oOption, oParams);
		//Assert
		assert.ok(oSpy.called, "The \"shareAsTab\" method was called.");
	});

	QUnit.test("Share - Postive Case when key is 'COLLABORATION_MSTEAMS_CARD'", function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: true
		});
		teamsHelperInstance._shareAsCard = function () {
			return;
		};
		var oOption = {
			key: 'COLLABORATION_MSTEAMS_CARD'
		};
		var oParams = {
			url: sURL,
			minifyUrlForChat: true
		};
		this.oSandbox.stub(URLListValidator, "validate").returns(true);
		var oSpy = sinon.spy(teamsHelperInstance, "_shareAsCard");
		//Act
		teamsHelperInstance.share(oOption, oParams);
		//Assert
		assert.ok(oSpy.called, "The \"shareAsCard\" method was called.");
	});

	QUnit.test("_shareAsTab", async function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: true
		});
		sap.m.URLHelper.redirect = function () {
			return;
		};
		var oParams = {
			url: sURL
		};
		var oSpy = sinon.spy(sap.m.URLHelper, "redirect");
		var oMockContainerAtTest = {
            getServiceAsync: function(params) {
                if (params === "URLParsing"){
                    return Promise.resolve({
                        parseShellHash: function() {
                            return {
                                contextRaw:'contextRaw',
                                semanticObject:'semanticObject',
                                action:'action',
								params: {}
                            };
                        },
						constructShellHash: function(){
							return "manage-product";
						}
                    });
                }
            }
        };
        this.oRequireStub.withArgs('sap/ushell/Container').returns(oMockContainerAtTest);
		//Act
		await teamsHelperInstance._shareAsTab(oParams);
		//Assert
		assert.ok(oSpy.called, "The \"redirect\" method was called.");
	});

	QUnit.test("should append PARAM_SAP_CARD_TITLE to the URL when it doesn't exist", function (assert) {
		// Arrange
		var oParams = {
			url: "http://example.com/ui?param1=value1#semanticobject-action/",
			appTitle: "MyAppTitle"
		};
		var teamsHelperInstance = new TeamsHelperService({});

		// Act
		var result = teamsHelperInstance._addCardParamsInUrl(oParams.url, oParams.appTitle, {cardId:"abc", version: "1"});

		// Assert
		assert.equal(result,teamsHelperInstance._providerConfig.shareAsLinkUrl + "?href=" + encodeURIComponent(
			"http://example.com/ui?param1=value1#semanticobject-action/&sap-ui-cardId=abc&sap-ui-cardVersion=1&sap-ui-cardTitle=MyAppTitle"));
	});

	// QUnit.test("_shareAsCard ", function (assert) {
	// 	// Arrange
	// 	window.open = function() {
	// 		return {
	// 			opener: {}
	// 		};
	// 	};
	// 	var oParams = {
	// 		url: "http://example.com/ui?param1=value1#semanticobject-action/",
	// 		appTitle: "MyAppTitle"
	// 	};
	// 	var teamsHelperInstance = new TeamsHelperService({});
	// 	sinon.stub(Fragment, "load").returns(Promise.resolve({
	// 		open: function() {},
	// 		close: function() {},
	// 		destroy: function() {}
	// 	}));
	// 	sinon.stub(CollaborationCardHelper, "postCard").returns(Promise.resolve({}));
	// 	var oSpy = sinon.spy(CollaborationHelper, "compactHash");
	// 	// Act
	// 	teamsHelperInstance._shareAsCard(oParams);

	// 	// Assert
	// 	assert.ok(!oSpy.called, "The \"_closeBusyDailog\" method was called.");
	// 	oSpy.restore();
	// });

	// QUnit.test("_shareAsCard when minifyUrlForChat is true", function (assert) {
	// 	// Arrange
	// 	window.open = function() {
	// 		return {
	// 			opener: {}
	// 		};
	// 	};
	// 	var oParams = {
	// 		url: "http://example.com/ui?param1=value1#semanticobject-action/",
	// 		appTitle: "MyAppTitle",
	// 		minifyUrlForChat: true
	// 	};
	// 	sinon.stub(Fragment, "load").returns(Promise.resolve({
	// 		open: function() {},
	// 		close: function() {},
	// 		destroy: function() {}
	// 	}));
	// 	sinon.stub(CollaborationCardHelper, "postCard").returns(Promise.resolve({}));
	// 	var teamsHelperInstance = new TeamsHelperService({});
	// 	var oSpy = sinon.spy(CollaborationHelper, "compactHash");
	// 	// Act
	// 	teamsHelperInstance._shareAsCard(oParams);

	// 	// Assert
	// 	assert.ok(oSpy.called, "The \"compactHash\" method was called.");
	// 	oSpy.restore();
	// });

	// QUnit.test("_shareAsTab when minifyUrlForChat is true", async function (assert) {
	// 	// Arrange
	// 	window.open = function() {
	// 		return {
	// 			opener: {}
	// 		};
	// 	};
	// 	var oParams = {
	// 		url: sURL,
	// 		appTitle: "MyAppTitle",
	// 		minifyUrlForChat: true
	// 	};
	// 	var teamsHelperInstance = new TeamsHelperService({});
	// 	var oSpy = sinon.spy(CollaborationHelper, "compactHash");
	// 	// Act
	// 	await teamsHelperInstance._shareAsTab(oParams);

	// 	// Assert
	// 	assert.ok(oSpy.called, "The \"compactHash\" method was called.");
	// 	oSpy.restore();
	// });

	// Test case 1: URL with no hash or query parameters
	QUnit.test('should modify URL correctly when no hash or query parameters exist', async (assert) => {
		const teamsHelperInstance = new TeamsHelperService({});
		const inputUrl = 'https://example.com';
		const expectedUrl = 'https://example.com';

		const result = await teamsHelperInstance._modifyUrlForShareAsTab(inputUrl);

		assert.equal(result, expectedUrl);
	});

	// Test case 2: URL with a hash but no query parameters
	QUnit.test('should modify URL correctly when a hash exists but no query parameters', async (assert) => {
		const teamsHelperInstance = new TeamsHelperService({});
		const inputUrl = 'https://example.com/#semanticObject-action';
		const expectedUrl = 'https://example.com/?sap-ushell-config=lean&sap-collaboration-teams=true&sap-ui-fesr-env=MST:C#semanticObject-action';

		const result = await teamsHelperInstance._modifyUrlForShareAsTab(inputUrl, "MST:C");

		assert.equal(result, expectedUrl);
	});

	// Test case 3: URL with both hash and query parameters
	QUnit.test('should modify URL correctly when both hash and query parameters exist', async (assert) => {
		const teamsHelperInstance = new TeamsHelperService({});
		const inputUrl = 'https://example.com?param1=value1#semanticObject-action';
		const expectedUrl = 'https://example.com?sap-ushell-config=lean&sap-collaboration-teams=true&sap-ui-fesr-env=MST:T&param1=value1#semanticObject-action';

		const result = await teamsHelperInstance._modifyUrlForShareAsTab(inputUrl, "MST:T");

		assert.equal(result, expectedUrl);
	});

	QUnit.test('_updateUrl with minifyUrlForChat enabled and ShareAsTab enabled', async (assert) => {
        // Arrange
		const teamsHelperInstance = new TeamsHelperService({
			isShareAsTabEnabled: "X"
		});
        const oParams = { minifyUrlForChat: true, url: 'original-url' };
        const oResponseData = {};
        const oTeamsParams = { isShareAsTabEnabled: true };
		var oSpy = sinon.spy(CollaborationHelper, "compactHash");
		
		window.open = function() {
			return {
				opener: {}
			};
		};

        // Act
        await teamsHelperInstance._updateUrl(oParams, oResponseData, oTeamsParams);

        // Assert
		assert.ok(oSpy.called, "The \"compactHash\" method was called.");

		oSpy.restore();
    });

	QUnit.test('_updateUrl with minifyUrlForChat enabled and ShareAsTab disabled', async (assert) => {
        // Arrange
		const teamsHelperInstance = new TeamsHelperService({});
        const oParams = { minifyUrlForChat: true, url: 'original-url' };
        const oResponseData = {};
        const oTeamsParams = { isShareAsTabEnabled: false };
		var oSpy = sinon.spy(CollaborationHelper, "compactHash");

		window.open = function() {
			return {
				opener: {}
			};
		};
		
        // Act
        await teamsHelperInstance._updateUrl(oParams, oResponseData, oTeamsParams);

        // Assert
        assert.ok(oSpy.called, "The \"compactHash\" method was called.");

		oSpy.restore();
    });

	QUnit.test('_updateUrl with minifyUrlForChat disabled and ShareAsTab enabled', async (assert) => {
        // Arrange
		const teamsHelperInstance = new TeamsHelperService({
			isShareAsTabEnabled: "X"
		});
        const oParams = { minifyUrlForChat: false, url: 'original-url' };
        const oResponseData = {};
        const oTeamsParams = { isShareAsTabEnabled: true };
		var oSpy = sinon.spy(CollaborationHelper, "compactHash");
		window.open = function() {
			return {
				opener: {}
			};
		};

        // Act
        await teamsHelperInstance._updateUrl(oParams, oResponseData, oTeamsParams);

        // Assert
        assert.equal(oSpy.called, false, "The \"compactHash\" method was not called.");

		oSpy.restore();
    });

	QUnit.test('_updateUrl with minifyUrlForChat disabled and ShareAsTab disabled', async (assert) => {
        // Arrange
		const teamsHelperInstance = new TeamsHelperService({});
        const oParams = { minifyUrlForChat: false, url: 'original-url' };
        const oResponseData = {};
        const oTeamsParams = { isShareAsTabEnabled: false };
		var oSpy = sinon.spy(CollaborationHelper, "compactHash");
		window.open = function() {
			return {
				opener: {}
			};
		};

        // Act
        await teamsHelperInstance._updateUrl(oParams, oResponseData, oTeamsParams);

        // Assert
        assert.equal(oSpy.called, false, "The \"compactHash\" method was not called.");

		oSpy.restore();
    });

	QUnit.test('Test _closeBusyDailog method when busy dialog is not defined', (assert) => {
		// Arrange
		const teamsHelperInstance = new TeamsHelperService({});
		var oSpy = sinon.spy(window, "clearTimeout");

		// Act
		teamsHelperInstance._closeBusyDailog();

		// Assert
		assert.equal(oSpy.called, false, "The \"clearTimeout \" method was not called.");
		oSpy.restore();

	});

	QUnit.test("isFeatureFlagEnabled should return true when conditions are met", function (assert) {
		// Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "AUTHENABLE"
		});

		// Act
		const result = teamsHelperInstance.isFeatureFlagEnabled();

		// Assert
		assert.strictEqual(result, true, "Feature flag should be enabled");
	});


	QUnit.test("isFeatureFlagEnabled should return false when conditions are not met", function (assert) {
		// Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "DISABLED"
		});

		// Act
		const result = teamsHelperInstance.isFeatureFlagEnabled();

		// Assert
		assert.strictEqual(result, false, "Feature flag should be disabled");
	});

	QUnit.test("getCollaborationPopover - should return logger error message if the data is empty or undefined", function(assert) {
        //Arrange
        var teamsHelperInstance = new TeamsHelperService({
            isShareAsLinkEnabled: "X"
        });
        var oParams = {
            isShareAsLinkEnabled : true
        };
        var oData = {
            title: "APP_TITLE"
        };
        var isLink = true;
        var oButton = new sap.m.Button({
            text: "TEST",
            press: () => {
                teamsHelperInstance.getCollaborationPopover(oParams, oData, oButton, isLink);
            }
        });
        var oSpy = sinon.spy(teamsHelperInstance, "_getPopover");
        //Act
        oButton.firePress();
        //Assert
        assert.ok(oSpy.notCalled, "Popover is not created and logger error message is thrown");
    });

	QUnit.test("getCollaborationPopover - should trigger the shareData function (1 option & isLink value - false)", function(assert) {
		//Arrange
		Device.system.desktop = true;
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "ENABLED"
		});
		var oParams = {
			isShareAsLinkEnabled : false
		};
		var oData = {
			title: "APP_TITLE",
			data: "www.hostname.com"
		};
		var isLink = false;
		var oButton = new sap.m.Button({
			text: "TEST",
			press: () => {
				teamsHelperInstance.getCollaborationPopover(oParams, oData, oButton, isLink);
			}
		});
		var oSpy = sinon.spy(teamsHelperInstance, "_shareData");
		//Act
		oButton.firePress();
		//Assert
		assert.ok(oSpy.called, "Popover is not created and data is shared directly incase of one option");
	});

	QUnit.test("getCollaborationPopover - create a popover with given options in horizontal order", function(assert) {
		Device.system.desktop = true;
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "ENABLED"
		});
		var oParams = {
			isShareAsLinkEnabled : true
		};
		var oData = {
			title: "APP_TITLE",
			data: "www.hostname.com"
		};
		var isLink = true;
		var oButton = new sap.m.Button({
			text: "TEST",
			press: () => {
				teamsHelperInstance.getCollaborationPopover(oParams, oData, oButton, isLink);
			}
		});
		//Act
		oButton.firePress();
		//Assert
		assert.ok("Collaboration Popover is created - Horizontal case");
	});

	QUnit.test("getCollaborationPopover - create a popover with given options in vertical order", function(assert) {
		Device.system.desktop = true;
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "ENABLED"
		});
		var oParams = {
			isShareAsLinkEnabled : true
		};
		var oData = {
			title: "APP_TITLE",
			data: "www.hostname.com",
			sFormat: "Vertical"
		};
		var isLink = true;
		var oButton = new sap.m.Button({
			text: "TEST",
			press: () => {
				teamsHelperInstance.getCollaborationPopover(oParams, oData, oButton, isLink);
			}
		});
		//Act
		oButton.firePress();
		//Assert
		assert.ok("Collaboration Popover is created - Vertical case");
	});

	QUnit.test("share data to teams from Collbaoration Popover", function(assert) {
		//Arrange
        var teamsHelperInstance = new TeamsHelperService({
            isShareAsLinkEnabled: "X",
            isShareAsTabEnabled: "X",
            isShareAsCardEnabled: "ENABLED"
        });
        const oData = {
            title: "APP_TITLE",
            data: "www.hostname.com"
        };
        const oOption = {
            key: "COLLABORATION_POPOVER_TEAMS"
        };
        teamsHelperInstance._shareSummary = function() {
            return "";
        }
        const oSpy = sinon.spy(teamsHelperInstance, "_shareSummary");

		//Act
        teamsHelperInstance._shareData(oData,oOption);
		//Assert
        assert.ok(oSpy.called, "Share as Chat function is called");
    });

    QUnit.test("share data to Mail from Collbaoration Popover", function(assert) {
		//Arrange
        var teamsHelperInstance = new TeamsHelperService({
            isShareAsLinkEnabled: "X",
            isShareAsTabEnabled: "X",
            isShareAsCardEnabled: "ENABLED"
        });
        const oData = {
            title: "APP_TITLE",
            data: "www.hostname.com"
        };
        const oOption = {
            key: "COLLABORATION_POPOVER_MAIL"
        };
        const oSpy = sinon.spy(sap.m.URLHelper, "triggerEmail");
		//Act
        teamsHelperInstance._shareData(oData, oOption);
		//Assert
        assert.ok(oSpy.called, "Email window is openend");
    });

	QUnit.test("getPopover - returns the popover with the share options and copy link option", function(assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "ENABLED"
		});
		var aOptions = [
			{
				"text": "MS Teams",
				"icon": "sap-icon://discussion",
				"key": "COLLABORATION_POPOVER_TEAMS"
			},
			{
				"text": "Email",
				"icon": "sap-icon://email",
				"key": "COLLABORATION_POPOVER_MAIL"
			}
		]
		var oData = {
			title: "APP_TITLE",
			data: "www.hostname.com",
			sFormat: "Horizontal"
		};
		var isLink = true;

		//Act
		var result = teamsHelperInstance._getPopover(oData, aOptions, isLink);

		//Assert
		assert.equal(result.getContent()[0].getItems().length, 2, "Two flex box (for option and copy link) is added to the popover")
		assert.equal(result.getContent()[0].getItems()[0].getItems().length, 2, "Two options are added in the First flexbox");
		// assert.equal(result.getContent()[0].getItems()[1].getItems()[1].getText(), "Copy URL", "Copy link option is added to the Popover");
	});

	QUnit.test("getPopover - returns the popover with the share options and without copy link option", function(assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "ENABLED"
		});
		var aOptions = [
			{
				"text": "MS Teams",
				"icon": "sap-icon://discussion",
				"key": "COLLABORATION_POPOVER_TEAMS"
			},
			{
				"text": "Email",
				"icon": "sap-icon://email",
				"key": "COLLABORATION_POPOVER_MAIL"
			}
		]
		var oData = {
			title: "APP_TITLE",
			data: "www.hostname.com",
			sFormat: "Horizontal"
		};
		var isLink = false;

		//Act
		var result = teamsHelperInstance._getPopover(oData, aOptions, isLink);
		//Assert
		assert.equal(result.getContent()[0].getItems().length, 1, "One flex box(for share options) is added to the popover")
		assert.equal(result.getContent()[0].getItems()[0].getItems().length, 2, "Two options are added in the Flexbox");
	});

	QUnit.test("_shareSummary", async function (assert) {
		//Arrange
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: true
		});
		sap.m.URLHelper.redirect = function () {
			return;
		};
		var oParams = {
			appTitle: "APP_TITLE",
            message: "MESSAGE"
		};
		var oSpy = sinon.spy(sap.m.URLHelper, "redirect");
		//Act
		await teamsHelperInstance._shareSummary(oParams);
		//Assert
		assert.ok(oSpy.called, "The \"redirect\" method was called.");
	});

	QUnit.test("should consider config options and add options to Popover", function(assert) {
		Device.system.desktop = true;
		var teamsHelperInstance = new TeamsHelperService({
			isShareAsLinkEnabled: "X",
			isShareAsTabEnabled: "X",
			isShareAsCardEnabled: "ENABLED"
		});
		var oParams = {
			isShareAsLinkEnabled : true
		};
		var oData = {
			title: "APP_TITLE",
			data: "www.hostname.com",
			sFormat: "Vertical"
		};
		var isLink = true;
		var oConfig = {
			shareToTeams: true,
			shareToEmail: true,
			shareToCM: false
		}
		var oButton = new sap.m.Button({
			text: "TEST",
			press: () => {
				teamsHelperInstance.getCollaborationPopover(oParams, oData, oButton, isLink, oConfig);
			}
		});
		var oSpy = sinon.spy(teamsHelperInstance, "_getPopover");
		//Act
		oButton.firePress();
		//Assert
		assert.ok(oSpy.called, "Collaboration Popover is created");
	});
	
	QUnit.test("should return same url if it matches", async function (assert) {
		// Arrange
		var teamsHelperInstance = new TeamsHelperService({});
		var originalUrl = "https://host.abc.com/ui#manage-product";
		var sURL = "https://host.abc.com/ui#manage-product";
		//Act
		var result = await teamsHelperInstance._modifyUrlForNavigationContext(originalUrl, sURL);
		//Assert
		assert.equal(result, sURL, "URL is same");
	});

	QUnit.test("should returns same url if there is no parameter", async function (assert) {
		// Arrange
		var teamsHelperInstance = new TeamsHelperService({});
		var originalUrl = "https://host.abc.com/ui#manage-product";
		var sURL = "https://host.abc.com/ui?sap-collaboration-teams=true#manage-product";
		//Act
		var result = await teamsHelperInstance._modifyUrlForNavigationContext(originalUrl, sURL);
		//Assert
		assert.equal(result, sURL, "URL modified");
	});

	QUnit.test("should modify url", async function (assert) {
		// Arrange
		var teamsHelperInstance = new TeamsHelperService({});
		var originalUrl = "https://host.abc.com/ui#manage-product?abc=def";
		var sURL = "https://host.abc.com/ui?sap-collaboration-teams=true#manage-product";

		var oMockContainerAtTest = {
            getServiceAsync: function(params) {
                if (params === "URLParsing"){
                    return Promise.resolve({
                        parseShellHash: function() {
                            return {
                                contextRaw:'contextRaw',
                                semanticObject:'semanticObject',
                                action:'action',
								params: {
									abc: ['def']
								}
                            };
                        },
						constructShellHash: function(){
							return "manage-product";
						}
                    });
                }
            }
        };
        this.oRequireStub.withArgs('sap/ushell/Container').returns(oMockContainerAtTest);

		//Act
		var result = await teamsHelperInstance._modifyUrlForNavigationContext(originalUrl, sURL);
		//Assert
		assert.equal(result, "https://host.abc.com/ui#manage-product", "URL modified");
	});
});
