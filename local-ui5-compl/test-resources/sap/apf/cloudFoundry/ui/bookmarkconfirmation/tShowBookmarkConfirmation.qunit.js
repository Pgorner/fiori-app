sap.ui.define([
	"sap/apf/cloudFoundry/ui/bookmarkconfirmation/showBookmarkConfirmation",
	'sap/ui/core/routing/HashChanger',
	'sap/m/MessageBox',
	'sap/apf/cloudFoundry/ui/utils/LaunchPageUtils',
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (showBookmarkConfirmation, HashChanger, MessageBox, LaunchPageUtils, sinon) {
	'use strict';

	QUnit.module('show bookmark confirmation', {
		beforeEach: function() {
			var env = this;
			env.stubReplaceHash = sinon.stub(HashChanger.prototype, 'replaceHash');
			env.stubMessageBoxConfirm = sinon.stub(MessageBox, 'confirm');
			// stub LaunchPageUtils
			env.stubGenerateRuntimeLink = sinon.stub(LaunchPageUtils, 'generateRuntimeLink');
			env.stubGenerateRuntimeLink.returns('my-runtime-link');
			env.stubGenerateRuntimeHash = sinon.stub(LaunchPageUtils, 'generateRuntimeHash');
			env.stubGenerateRuntimeHash.returns('my-runtime-hash');
			env.stubSetBookmarkTile = sinon.stub(LaunchPageUtils, 'setBookmarkTile');
			// stub start parameters
			env.oStartParameters = {
				getAnalyticalConfigurationId: function() {
					return {
						configurationId: env.sConfigurationId
					};
				},
				getParameter: function(name) {
					switch (name) {
						case 'tile-header':
							return env.sTileHeader;
						case 'tile-subheader':
							return env.sTileSubheader;
						case 'tile-icon':
							return env.sTileIcon;
						case 'tile-group':
							return env.sTileGroup;
						default:
							return undefined;
					}
				}
			};
			env.spyGetAnalyticalConfigurationId = sinon.spy(env.oStartParameters, 'getAnalyticalConfigurationId');
			env.spyGetParameter = sinon.spy(env.oStartParameters, 'getParameter');
			// stub application config properties
			env.pApplicationConfigProperties = {
				then: function(fn) {
					fn({
						appTitle: env.sAppTitle
					});
				}
			};
			env.spyApplicationConfigPropertiesThen = sinon.spy(env.pApplicationConfigProperties, 'then');
			env.oApi = {
				getApplicationConfigProperties: function() {
					return env.pApplicationConfigProperties;
				},
				getTextNotHtmlEncoded: function(sKey, aArgs) {
					var sTranslated = 'translated ' + sKey;
					if (aArgs) {
						aArgs.forEach(function(sArg) {
							sTranslated += ' ' + sArg;
						});
					}
					return sTranslated;
				}
			};
			env.spyGetApplicationConfigProperties = sinon.spy(env.oApi, 'getApplicationConfigProperties');
			env.spyGetTextNotHtmlEncoded = sinon.spy(env.oApi, 'getTextNotHtmlEncoded');
		},
		afterEach: function() {
			this.stubReplaceHash.restore();
			this.stubMessageBoxConfirm.restore();
			this.stubGenerateRuntimeLink.restore();
			this.stubGenerateRuntimeHash.restore();
			this.stubSetBookmarkTile.restore();
		}
	});
	QUnit.test('getter calls', function(assert) {
		var env = this;
		// execute
		showBookmarkConfirmation.show(env.oApi, env.oStartParameters);
		// assert
		assert.ok(env.spyGetAnalyticalConfigurationId.calledOnce, 'getAnalyticalConfigurationId is called once');
		assert.ok(env.spyGetParameter.calledWith('tile-header'), 'getParameter is called with \'tile-header\'');
		assert.ok(env.spyGetParameter.calledWith('tile-subheader'), 'getParameter is called with \'tile-subheader\'');
		assert.ok(env.spyGetParameter.calledWith('tile-icon'), 'getParameter is called with \'tile-icon\'');
		assert.ok(env.spyGetParameter.calledWith('tile-group'), 'getParameter is called with \'tile-group\'');
	});
	QUnit.test('application config properties promise', function(assert) {
		var env = this;
		// execute
		showBookmarkConfirmation.show(env.oApi, env.oStartParameters);
		// assert
		assert.ok(env.spyGetApplicationConfigProperties.calledOnce, 'getApplicationConfigProperties is called once');
		assert.ok(env.spyApplicationConfigPropertiesThen.calledOnce, '\'then\' method of application config properties promise is called once');
		assert.ok(env.spyApplicationConfigPropertiesThen.getCall(0).args[0], 'function passed to \'then\' method is defined');
		assert.strictEqual(typeof env.spyApplicationConfigPropertiesThen.getCall(0).args[0], 'function', 'function passed to \'then\' method is in fact a function');
	});
	QUnit.test('translation with parameters', function(assert) {
		var env = this;
		// data
		env.sAppTitle = 'my-apptitle';
		env.sTileHeader = 'my-tile-header';
		env.sTileSubheader = 'my-tile-subheader';
		env.sTileIcon = 'my-tile-icon';
		env.sTileGroup = 'my-tile-group';
		// execute
		showBookmarkConfirmation.show(env.oApi, env.oStartParameters);
		// assert
		assert.strictEqual(env.spyGetTextNotHtmlEncoded.callCount, 2, 'getTextNotHtmlEncoded is called twice');
		assert.ok(env.spyGetTextNotHtmlEncoded.calledWith('bookmarkConfirmation', ['my-tile-header']), 'getTextNotHtmlEncoded is called with \'bookmarkConfirmation\'');
		assert.ok(env.spyGetTextNotHtmlEncoded.calledWith('bookmarkConfirmationTitle'), 'getTextNotHtmlEncoded is called with \'bookmarkConfirmationTitle\'');
	});
	QUnit.test('translation with defaults', function(assert) {
		var env = this;
		// data
		env.sAppTitle = 'my-apptitle';
		env.sTileHeader = null;
		env.sTileSubheader = null;
		env.sTileIcon = null;
		env.sTileGroup = null;
		// execute
		showBookmarkConfirmation.show(env.oApi, env.oStartParameters);
		// assert
		assert.strictEqual(env.spyGetTextNotHtmlEncoded.callCount, 4, 'getTextNotHtmlEncoded is called four times');
		assert.ok(env.spyGetTextNotHtmlEncoded.calledWith('my-apptitle'), 'getTextNotHtmlEncoded is called with \'my-apptitle\'');
		assert.ok(env.spyGetTextNotHtmlEncoded.calledWith('bookmarkSubheaderDefault'), 'getTextNotHtmlEncoded is called with \'bookmarkSubheaderDefault\'');
		assert.ok(env.spyGetTextNotHtmlEncoded.calledWith('bookmarkConfirmation', ['translated my-apptitle']), 'getTextNotHtmlEncoded is called with \'bookmarkConfirmation\'');
		assert.ok(env.spyGetTextNotHtmlEncoded.calledWith('bookmarkConfirmationTitle'), 'getTextNotHtmlEncoded is called with \'bookmarkConfirmationTitle\'');
	});
	QUnit.test('open MessageBox with parameters', function(assert) {
		var env = this;
		// data
		env.sAppTitle = 'my-apptitle';
		env.sTileHeader = 'my-tile-header';
		env.sTileSubheader = 'my-tile-subheader';
		env.sTileIcon = 'my-tile-icon';
		env.sTileGroup = 'my-tile-group';
		// execute
		showBookmarkConfirmation.show(env.oApi, env.oStartParameters);
		// assert
		assert.ok(env.stubMessageBoxConfirm.calledOnce, 'MessageBox.confirm is called once');
		assert.strictEqual(env.stubMessageBoxConfirm.getCall(0).args[0], 'translated bookmarkConfirmation my-tile-header', 'MessageBox.confirm is called with the translated bookmark confirmation');
		assert.strictEqual(env.stubMessageBoxConfirm.getCall(0).args[1].title, 'translated bookmarkConfirmationTitle', 'MessageBox.confirm is called with the translated bookmark confirmation title');
		assert.strictEqual(typeof env.stubMessageBoxConfirm.getCall(0).args[1].onClose, 'function', 'MessageBox.confirm is called with a close handler');
	});
	QUnit.test('open MessageBox with defaults', function(assert) {
		var env = this;
		// data
		env.sAppTitle = 'my-apptitle';
		env.sTileHeader = null;
		env.sTileSubheader = null;
		env.sTileIcon = null;
		env.sTileGroup = null;
		// execute
		showBookmarkConfirmation.show(env.oApi, env.oStartParameters);
		// assert
		assert.ok(env.stubMessageBoxConfirm.calledOnce, 'MessageBox.confirm is called once');
		assert.strictEqual(env.stubMessageBoxConfirm.getCall(0).args[0], 'translated bookmarkConfirmation translated my-apptitle', 'MessageBox.confirm is called with the translated bookmark confirmation');
		assert.strictEqual(env.stubMessageBoxConfirm.getCall(0).args[1].title, 'translated bookmarkConfirmationTitle', 'MessageBox.confirm is called with the translated bookmark confirmation title');
		assert.strictEqual(typeof env.stubMessageBoxConfirm.getCall(0).args[1].onClose, 'function', 'MessageBox.confirm is called with a close handler');
	});
	QUnit.test('close MessageBox with parameteres, action \'OK\'', function(assert) {
		var env = this;
		// data
		env.sConfigurationId = 'my-config-id';
		env.sAppTitle = 'my-apptitle';
		env.sTileHeader = 'my-tile-header';
		env.sTileSubheader = 'my-tile-subheader';
		env.sTileIcon = 'my-tile-icon';
		env.sTileGroup = 'my-tile-group';
		// execute
		showBookmarkConfirmation.show(env.oApi, env.oStartParameters);
		var onClose = env.stubMessageBoxConfirm.getCall(0).args[1].onClose;
		onClose(MessageBox.Action.OK);
		// assert
		assert.ok(env.stubGenerateRuntimeLink.calledOnce, 'generateRuntimeLink is called once');
		assert.ok(env.stubGenerateRuntimeLink.calledWith('my-config-id'), 'generateRuntimeLink is called with the configuration id');
		assert.ok(env.stubSetBookmarkTile.calledOnce, 'setBookmarkTile is called once');
		assert.ok(env.stubSetBookmarkTile.calledWith('my-runtime-link', 'my-tile-header', 'my-tile-subheader', 'my-tile-icon', 'my-tile-group'), 'setBookmarkTile is called with the tile definition');
		assert.ok(env.stubGenerateRuntimeHash.calledOnce, 'generateRuntimeHash is called once');
		assert.ok(env.stubGenerateRuntimeHash.calledWith('my-config-id'), 'generateRuntimeHash is called with the configuration id');
		assert.ok(env.stubReplaceHash.calledOnce, 'replaceHash is called once');
		assert.ok(env.stubReplaceHash.calledWith('my-runtime-hash'), 'replaceHash is called with the generate runtime hash');
	});
	QUnit.test('close MessageBox with parameteres, action \'Cancel\'', function(assert) {
		var env = this;
		// data
		env.sConfigurationId = 'my-config-id';
		env.sAppTitle = 'my-apptitle';
		env.sTileHeader = 'my-tile-header';
		env.sTileSubheader = 'my-tile-subheader';
		env.sTileIcon = 'my-tile-icon';
		env.sTileGroup = 'my-tile-group';
		// execute
		showBookmarkConfirmation.show(env.oApi, env.oStartParameters);
		var onClose = env.stubMessageBoxConfirm.getCall(0).args[1].onClose;
		onClose(MessageBox.Action.Cancel);
		// assert
		assert.ok(env.stubGenerateRuntimeLink.notCalled, 'generateRuntimeLink is not called');
		assert.ok(env.stubSetBookmarkTile.notCalled, 'setBookmarkTile is not called');
		assert.ok(env.stubGenerateRuntimeHash.calledOnce, 'generateRuntimeHash is called once');
		assert.ok(env.stubGenerateRuntimeHash.calledWith('my-config-id'), 'generateRuntimeHash is called with the configuration id');
		assert.ok(env.stubReplaceHash.calledOnce, 'replaceHash is called once');
		assert.ok(env.stubReplaceHash.calledWith('my-runtime-hash'), 'replaceHash is called with the generate runtime hash');
	});
	QUnit.test('close MessageBox with defaults, action \'OK\'', function(assert) {
		var env = this;
		// data
		env.sConfigurationId = 'my-config-id';
		env.sAppTitle = 'my-apptitle';
		env.sTileHeader = null;
		env.sTileSubheader = null;
		env.sTileIcon = null;
		env.sTileGroup = null;
		// execute
		showBookmarkConfirmation.show(env.oApi, env.oStartParameters);
		var onClose = env.stubMessageBoxConfirm.getCall(0).args[1].onClose;
		onClose(MessageBox.Action.OK);
		// assert
		assert.ok(env.stubGenerateRuntimeLink.calledOnce, 'generateRuntimeLink is called once');
		assert.ok(env.stubGenerateRuntimeLink.calledWith('my-config-id'), 'generateRuntimeLink is called with the configuration id');
		assert.ok(env.stubSetBookmarkTile.calledOnce, 'setBookmarkTile is called once');
		assert.ok(env.stubSetBookmarkTile.calledWith('my-runtime-link', 'translated my-apptitle', 'translated bookmarkSubheaderDefault', '', ''), 'setBookmarkTile is called with the default tile definition');
		assert.ok(env.stubGenerateRuntimeHash.calledOnce, 'generateRuntimeHash is called once');
		assert.ok(env.stubGenerateRuntimeHash.calledWith('my-config-id'), 'generateRuntimeHash is called with the configuration id');
		assert.ok(env.stubReplaceHash.calledOnce, 'replaceHash is called once');
		assert.ok(env.stubReplaceHash.calledWith('my-runtime-hash'), 'replaceHash is called with the generate runtime hash');
	});
	QUnit.test('close MessageBox with defaults, action \'Cancel\'', function(assert) {
		var env = this;
		// data
		env.sConfigurationId = 'my-config-id';
		env.sAppTitle = 'my-apptitle';
		env.sTileHeader = null;
		env.sTileSubheader = null;
		env.sTileIcon = null;
		env.sTileGroup = null;
		// execute
		showBookmarkConfirmation.show(env.oApi, env.oStartParameters);
		var onClose = env.stubMessageBoxConfirm.getCall(0).args[1].onClose;
		onClose(MessageBox.Action.Cancel);
		// assert
		assert.ok(env.stubGenerateRuntimeLink.notCalled, 'generateRuntimeLink is not called');
		assert.ok(env.stubSetBookmarkTile.notCalled, 'setBookmarkTile is not called');
		assert.ok(env.stubGenerateRuntimeHash.calledOnce, 'generateRuntimeHash is called once');
		assert.ok(env.stubGenerateRuntimeHash.calledWith('my-config-id'), 'generateRuntimeHash is called with the configuration id');
		assert.ok(env.stubReplaceHash.calledOnce, 'replaceHash is called once');
		assert.ok(env.stubReplaceHash.calledWith('my-runtime-hash'), 'replaceHash is called with the generate runtime hash');
	});

});
