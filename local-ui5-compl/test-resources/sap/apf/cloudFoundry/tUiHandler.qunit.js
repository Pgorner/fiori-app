sap.ui.define([
	'sap/apf/cloudFoundry/uiHandler',
	'sap/apf/cloudFoundry/ui/sharedialog/showShareDialog',
	'sap/apf/cloudFoundry/ui/valuehelp/showValueHelp',
	'sap/apf/cloudFoundry/ui/bookmarkconfirmation/showBookmarkConfirmation',
	'sap/ui/thirdparty/sinon'
], function (uiHandler, showShareDialog, showValueHelp, showBookmarkConfirmation, sinon) {
	'use strict';

	QUnit.module('check show ui functions origin', {
		beforeEach: function() {},
		afterEach: function() {}
	});
	QUnit.test('show share dialog', function(assert) {
		assert.strictEqual(uiHandler.showShareDialog, showShareDialog.show, 'is equal to the function loaded from showShareDialog.js');
	});
	QUnit.test('show value help', function(assert) {
		assert.strictEqual(uiHandler.showValueHelp, showValueHelp.show, 'is equal to the function loaded from showValueHelp.js');
	});

	QUnit.module('init runtime function', {
		beforeEach: function() {
			var env = this;
			env.oStartParameterFacade = {
				getAnalyticalConfigurationId: function() {
					return {
						configurationId: env.sConfigurationId
					};
				},
				getParameter: function(name) {
					if (name === 'bookmark') {
						return env.sBookmark;
					}
					return undefined;
				}
			};
			env.spyGetAnalyticalConfigurationId = sinon.spy(env.oStartParameterFacade, 'getAnalyticalConfigurationId');
			env.spyGetParameter = sinon.spy(env.oStartParameterFacade, 'getParameter');
			env.oApi = {
				getStartParameterFacade: function() {
					return env.oStartParameterFacade;
				}
			};
			env.oComponent = {
				getApi: function() {
					return env.oApi;
				}
			};
			env.stubShowBookmarkConfirmation = sinon.stub(showBookmarkConfirmation, 'show');
		},
		afterEach: function() {
			this.stubShowBookmarkConfirmation.restore();
		}
	});
	QUnit.test('no configuration id', function(assert) {
		var env = this;
		// data
		env.sConfigurationId = undefined;
		env.sBookmark = 'true';
		// execute
		uiHandler.initRuntime(env.oComponent);
		// assert
		assert.ok(this.spyGetAnalyticalConfigurationId.calledOnce, 'getAnalyticalConfigurationId is called once');
		assert.ok(this.spyGetParameter.calledOnce, 'getParameter is called once');
		assert.strictEqual(this.spyGetParameter.getCall(0).args[0], 'bookmark', 'getParameter is called with \'bookmark\'');
		assert.ok(this.stubShowBookmarkConfirmation.notCalled, 'showBookmarkConfirmation.show is not called');
	});
	QUnit.test('no bookmark parameter', function(assert) {
		var env = this;
		// data
		env.sConfigurationId = 'my-config-id';
		env.sBookmark = undefined;
		// execute
		uiHandler.initRuntime(env.oComponent);
		// assert
		assert.ok(this.spyGetAnalyticalConfigurationId.calledOnce, 'getAnalyticalConfigurationId is called once');
		assert.ok(this.spyGetParameter.calledOnce, 'getParameter is called once');
		assert.strictEqual(this.spyGetParameter.getCall(0).args[0], 'bookmark', 'getParameter is called with \'bookmark\'');
		assert.ok(this.stubShowBookmarkConfirmation.notCalled, 'showBookmarkConfirmation.show is not called');
	});
	QUnit.test('bookmark parameter is false', function(assert) {
		var env = this;
		// data
		env.sConfigurationId = 'my-config-id';
		env.sBookmark = 'false';
		// execute
		uiHandler.initRuntime(env.oComponent);
		// assert
		assert.ok(this.spyGetAnalyticalConfigurationId.calledOnce, 'getAnalyticalConfigurationId is called once');
		assert.ok(this.spyGetParameter.calledOnce, 'getParameter is called once');
		assert.strictEqual(this.spyGetParameter.getCall(0).args[0], 'bookmark', 'getParameter is called with \'bookmark\'');
		assert.ok(this.stubShowBookmarkConfirmation.notCalled, 'showBookmarkConfirmation.show is not called');
	});
	QUnit.test('configuration id and bookmark parameter is true', function(assert) {
		var env = this;
		// data
		env.sConfigurationId = 'my-config-id';
		env.sBookmark = 'true';
		// execute
		uiHandler.initRuntime(env.oComponent);
		// assert
		assert.ok(this.spyGetAnalyticalConfigurationId.calledOnce, 'getAnalyticalConfigurationId is called once');
		assert.ok(this.spyGetParameter.calledOnce, 'getParameter is called once');
		assert.strictEqual(this.spyGetParameter.getCall(0).args[0], 'bookmark', 'getParameter is called with \'bookmark\'');
		assert.ok(this.stubShowBookmarkConfirmation.calledOnce, 'showBookmarkConfirmation.show is called once');
		assert.strictEqual(this.stubShowBookmarkConfirmation.getCall(0).args[0], this.oApi, 'showBookmarkConfirmation.show is called with the api');
		assert.strictEqual(this.stubShowBookmarkConfirmation.getCall(0).args[1], this.oStartParameterFacade, 'showBookmarkConfirmation.show is called with the start parameter facade');
	});

});
