/* global  QUnit, sinon */

sap.ui.define([
	"sap/ui/comp/navpopover/SmartLinkFieldInfo",
	"sap/ui/mdc/link/Panel"
], function(
	SmartLinkFieldInfo,
	MDCPanel
) {
	"use strict";

	const _checkInitialCalls = function(assert) {
		assert.ok(this.fnGetParentStub.notCalled, "should not call 'getParent' initially.");
		assert.ok(this.fnGetInternalModelStub.notCalled, "should not call '_getInternalModel' initially.");
		assert.ok(this.fnGetExtraContentStub.notCalled, "should not call 'getExtraContent' initially.");
		assert.ok(this.fnGetMainNavigationStub.notCalled, "should not call 'getMainNavigation' initially.");
		assert.ok(this.fnBeforeNavigationCallbackStub.notCalled, "should not call '_beforeNavigationCallback' initially.");
		assert.ok(this.fnNavigateStub.notCalled, "should not call 'navigate' initially.");
		assert.ok(this.fnFireInnerNavigateStub.notCalled, "should not call 'fireInnerNavigate' initially.");
	};

	const _checkEarlyReturn = function(assert) {
		assert.ok(this.fnGetParentStub.calledOnce, "should call 'getParent'.");
		assert.ok(this.fnGetInternalModelStub.calledOnce, "should call '_getInternalModel'.");
		assert.ok(this.fnGetPropertyStub.calledOnce, "should call 'getProperty'.");
		assert.ok(this.fnGetPropertyStub.calledWith("/linkItems"), "should call 'getProperty' with '/linkItems'.");
		assert.ok(this.fnGetExtraContentStub.calledOnce, "should call 'getExtraContent'.");
	};

	const _checkFnNavigateNotCalled = function(assert) {
		assert.ok(this.fnBeforeNavigationCallbackStub.notCalled, "should not call '_beforeNavigationCallback'.");
		assert.ok(this.fnNavigateStub.notCalled, "should not call 'navigate'.");
		assert.ok(this.fnFireInnerNavigateStub.notCalled, "should not call 'fireInnerNavigate'.");
	};

	const _checkFnNavigateCalled = function(assert, oLink, oEventMock) {
		if (oLink) {
			assert.ok(this.fnBeforeNavigationCallbackStub.calledOnce, "should call '_beforeNavigationCallback'.");
			assert.ok(this.fnBeforeNavigationCallbackStub.calledWith({
				...oEventMock,
				oSource: oLink
			}), "should call '_beforeNavigationCallback' with correct parameters.");
			assert.ok(this.fnNavigateStub.calledOnce, "should call 'navigate'.");
			assert.ok(this.fnNavigateStub.calledWith(oLink.internalHref ?? oLink.href), `should call 'navigate' with correct parameter '${oLink.internalHref ? "internalHref" : "href"}'.`);
			assert.ok(this.fnFireInnerNavigateStub.calledOnce, "should call 'fireInnerNavigate'.");
			assert.ok(this.fnFireInnerNavigateStub.calledWith({
				text: oLink.text ?? oLink.title,
				href: oLink.href,
				internalHref: oLink.internalHref
			}), `should call 'fireInnerNavigate' with correct parameter '${oLink.text ? "text" : "title"}'.`);
		}
	};

	QUnit.module("checkDirectNavigation", {
		beforeEach: function() {
			this.sandbox = sinon.sandbox.create();
			this.fnGetExtraContentStub = this.sandbox.stub();
			this.fnFireInnerNavigateStub = this.sandbox.stub();
			this.fnGetMainNavigationStub = this.sandbox.stub();
			this.oSmartLink = {
				getExtraContent: this.fnGetExtraContentStub,
				fireInnerNavigate: this.fnFireInnerNavigateStub,
				getMainNavigation: this.fnGetMainNavigationStub
			};

			this.oSmartLinkFieldInfo = new SmartLinkFieldInfo();
			this.fnGetParentStub = this.sandbox.stub(this.oSmartLinkFieldInfo, "getParent").returns(this.oSmartLink);
			this.fnBeforeNavigationCallbackStub = this.sandbox.stub(this.oSmartLinkFieldInfo, "_beforeNavigationCallback");
			this.fnGetPropertyStub = this.sandbox.stub();
			this.fnGetInternalModelStub = this.sandbox.stub(this.oSmartLinkFieldInfo, "_getInternalModel").returns({
				getProperty: this.fnGetPropertyStub
			});

			this.fnNavigateStub = this.sandbox.stub(MDCPanel, "navigate");
		},
		afterEach: function() {
			this.fnGetExtraContentStub.reset();
			this.fnGetExtraContentStub = undefined;

			this.fnFireInnerNavigateStub.reset();
			this.fnFireInnerNavigateStub = undefined;

			this.fnGetMainNavigationStub.reset();
			this.fnGetMainNavigationStub = undefined;

			this.oSmartLink = undefined;

			this.fnGetParentStub.reset();
			this.fnGetParentStub = undefined;

			this.fnBeforeNavigationCallbackStub.reset();
			this.fnBeforeNavigationCallbackStub = undefined;

			this.fnGetPropertyStub.reset();
			this.fnGetPropertyStub = undefined;

			this.fnGetInternalModelStub.reset();
			this.fnGetInternalModelStub = undefined;

			this.oSmartLinkFieldInfo.destroy();
			this.oSmartLinkFieldInfo = undefined;

			this.fnNavigateStub.reset();
			this.fnNavigateStub = undefined;
			this.sandbox.restore();
		}
	});

	QUnit.test("should return false when there is extra content", async function(assert) {
		const done = assert.async();
		const oEventMock = {};

		this.fnGetPropertyStub.returns([1, 2, 3]);
		this.fnGetExtraContentStub.returns({});

		_checkInitialCalls.call(this, assert);

		const bReturnValue = await this.oSmartLinkFieldInfo.checkDirectNavigation(oEventMock);

		// Check calls before early return
		_checkEarlyReturn.call(this, assert);

		// Check calls to check if fnNavigate shall be called
		assert.ok(this.fnGetMainNavigationStub.notCalled, "should not call 'getMainNavigation'.");

		// Check calls in fnNavigate
		_checkFnNavigateNotCalled.call(this, assert);

		// Check return value
		assert.notOk(bReturnValue, "should return false.");

		done();
	});

	QUnit.test("should return false when there is more than one link", async function(assert) {
		const done = assert.async();
		const oEventMock = {};

		this.fnGetPropertyStub.returns([1, 2, 3]);
		this.fnGetExtraContentStub.returns(undefined);

		_checkInitialCalls.call(this, assert);

		const bReturnValue = await this.oSmartLinkFieldInfo.checkDirectNavigation(oEventMock);

		// Check calls before early return
		_checkEarlyReturn.call(this, assert);

		// Check calls to check if fnNavigate shall be called
		assert.ok(this.fnGetMainNavigationStub.notCalled, "should not call 'getMainNavigation'.");

		// Check calls in fnNavigate
		_checkFnNavigateNotCalled.call(this, assert);

		// Check return value
		assert.notOk(bReturnValue, "should return false.");

		done();
	});

	QUnit.test("should return false when there are no links and no mainNavigationLink", async function(assert) {
		const done = assert.async();
		const oEventMock = {};

		this.fnGetPropertyStub.returns([]);
		this.fnGetExtraContentStub.returns(undefined);
		this.fnGetMainNavigationStub.returns({});

		_checkInitialCalls.call(this, assert);

		const bReturnValue = await this.oSmartLinkFieldInfo.checkDirectNavigation(oEventMock);

		// Check calls before early return
		_checkEarlyReturn.call(this, assert);

		// Check calls to check if fnNavigate shall be called
		assert.ok(this.fnGetMainNavigationStub.calledOnce, "should call 'getMainNavigation'.");

		// Check calls in fnNavigate
		_checkFnNavigateNotCalled.call(this, assert);

		// Check return value
		assert.notOk(bReturnValue, "should return false.");

		done();
	});

	QUnit.test("should call 'fnNavigate' when there is only one link and no mainNavigationLink and then return false", async function(assert) {
		const done = assert.async();
		const oEventMock = {};
		const oLink = {
			propertyName: "value"
		};

		this.fnGetPropertyStub.returns([oLink]);
		this.fnGetExtraContentStub.returns(undefined);
		this.fnGetMainNavigationStub.returns({});
		this.fnBeforeNavigationCallbackStub.returns(Promise.resolve(false));

		_checkInitialCalls.call(this, assert);

		const bReturnValue = await this.oSmartLinkFieldInfo.checkDirectNavigation(oEventMock);

		// Check calls before early return
		_checkEarlyReturn.call(this, assert);

		// Check calls to check if fnNavigate shall be called
		assert.ok(this.fnGetMainNavigationStub.calledOnce, "should call 'getMainNavigation'.");

		// Check calls in fnNavigate
		assert.ok(this.fnBeforeNavigationCallbackStub.calledOnce, "should call '_beforeNavigationCallback'.");
		assert.ok(this.fnBeforeNavigationCallbackStub.calledWith({
			...oEventMock,
			oSource: oLink
		}), "should call '_beforeNavigationCallback' with correct parameters.");
		assert.ok(this.fnNavigateStub.notCalled, "should not call 'navigate'.");
		assert.ok(this.fnFireInnerNavigateStub.notCalled, "should not call 'fireInnerNavigate'.");

		// Check return value
		assert.notOk(bReturnValue, "should return false.");

		done();
	});

	QUnit.test("should call 'fnNavigate' when there is only one link and no mainNavigationLink, call MDCPanel.navigate with 'internalHref' and then return true", async function(assert) {
		const done = assert.async();
		const oEventMock = {};
		const oLink = {
			text: "text",
			title: "title",
			internalHref: "InternalHref",
			href: "Href"
		};

		this.fnGetPropertyStub.returns([oLink]);
		this.fnGetExtraContentStub.returns(undefined);
		this.fnGetMainNavigationStub.returns({});
		this.fnBeforeNavigationCallbackStub.returns(Promise.resolve(true));

		_checkInitialCalls.call(this, assert);

		const bReturnValue = await this.oSmartLinkFieldInfo.checkDirectNavigation(oEventMock);

		// Check calls before early return
		_checkEarlyReturn.call(this, assert);

		// Check calls to check if fnNavigate shall be called
		assert.ok(this.fnGetMainNavigationStub.calledOnce, "should call 'getMainNavigation'.");

		// Check calls in fnNavigate
		_checkFnNavigateCalled.call(this, assert, oLink, oEventMock);

		// Check return value
		assert.ok(bReturnValue, "should return true.");

		done();
	});

	QUnit.test("should call 'fnNavigate' when there is only one link and no mainNavigationLink, call MDCPanel.navigate with 'href' and then return true", async function(assert) {
		const done = assert.async();
		const oEventMock = {};
		const oLink = {
			title: "title",
			href: "Href"
		};

		this.fnGetPropertyStub.returns([oLink]);
		this.fnGetExtraContentStub.returns(undefined);
		this.fnGetMainNavigationStub.returns({});
		this.fnBeforeNavigationCallbackStub.returns(Promise.resolve(true));

		_checkInitialCalls.call(this, assert);

		const bReturnValue = await this.oSmartLinkFieldInfo.checkDirectNavigation(oEventMock);

		// Check calls before early return
		_checkEarlyReturn.call(this, assert);

		// Check calls to check if fnNavigate shall be called
		assert.ok(this.fnGetMainNavigationStub.calledOnce, "should call 'getMainNavigation'.");

		// Check calls in fnNavigate
		_checkFnNavigateCalled.call(this, assert, oLink, oEventMock);

		// Check return value
		assert.ok(bReturnValue, "should return true.");

		done();
	});

	QUnit.test("should not call 'fnNavigate' when there is no link and a mainNavigationLink without a href and then return false", async function(assert) {
		const done = assert.async();
		const oEventMock = {};
		const oMainNavigationLink = {
			href: ""
		};

		this.fnGetPropertyStub.returns([]);
		this.fnGetExtraContentStub.returns(undefined);
		this.fnGetMainNavigationStub.returns(oMainNavigationLink);
		this.fnBeforeNavigationCallbackStub.returns(Promise.resolve(false));

		_checkInitialCalls.call(this, assert);

		const bReturnValue = await this.oSmartLinkFieldInfo.checkDirectNavigation(oEventMock);

		// Check calls before early return
		_checkEarlyReturn.call(this, assert);

		// Check calls to check if fnNavigate shall be called
		assert.ok(this.fnGetMainNavigationStub.calledOnce, "should call 'getMainNavigation'.");

		// Check calls in fnNavigate
		_checkFnNavigateNotCalled.call(this, assert);

		// Check return value
		assert.notOk(bReturnValue, "should return false.");

		done();
	});

	QUnit.test("should call 'fnNavigate' when there is no link and a mainNavigationLink and then return false", async function(assert) {
		const done = assert.async();
		const oEventMock = {};
		const oMainNavigationLink = {
			href: "Href"
		};

		this.fnGetPropertyStub.returns([]);
		this.fnGetExtraContentStub.returns(undefined);
		this.fnGetMainNavigationStub.returns(oMainNavigationLink);
		this.fnBeforeNavigationCallbackStub.returns(Promise.resolve(false));

		_checkInitialCalls.call(this, assert);

		const bReturnValue = await this.oSmartLinkFieldInfo.checkDirectNavigation(oEventMock);

		// Check calls before early return
		_checkEarlyReturn.call(this, assert);

		// Check calls to check if fnNavigate shall be called
		assert.ok(this.fnGetMainNavigationStub.calledOnce, "should call 'getMainNavigation'.");

		// Check calls in fnNavigate
		assert.ok(this.fnBeforeNavigationCallbackStub.calledOnce, "should call '_beforeNavigationCallback'.");
		assert.ok(this.fnBeforeNavigationCallbackStub.calledWith({
			...oEventMock,
			oSource: oMainNavigationLink
		}), "should call '_beforeNavigationCallback' with correct parameters.");
		assert.ok(this.fnNavigateStub.notCalled, "should not call 'navigate'.");
		assert.ok(this.fnFireInnerNavigateStub.notCalled, "should not call 'fireInnerNavigate'.");

		// Check return value
		assert.notOk(bReturnValue, "should return false.");

		done();
	});

	QUnit.test("should call 'fnNavigate' when there is no link and a mainNavigationLink, call MDCPanel.navigate with 'internalHref' and then return true", async function(assert) {
		const done = assert.async();
		const oEventMock = {};
		const oMainNavigationLink = {
			text: "text",
			title: "title",
			internalHref: "InternalHref",
			href: "Href"
		};

		this.fnGetPropertyStub.returns([]);
		this.fnGetExtraContentStub.returns(undefined);
		this.fnGetMainNavigationStub.returns(oMainNavigationLink);
		this.fnBeforeNavigationCallbackStub.returns(Promise.resolve(true));

		_checkInitialCalls.call(this, assert);

		const bReturnValue = await this.oSmartLinkFieldInfo.checkDirectNavigation(oEventMock);

		// Check calls before early return
		_checkEarlyReturn.call(this, assert);

		// Check calls to check if fnNavigate shall be called
		assert.ok(this.fnGetMainNavigationStub.calledOnce, "should call 'getMainNavigation'.");

		// Check calls in fnNavigate
		_checkFnNavigateCalled.call(this, assert, oMainNavigationLink, oEventMock);

		// Check return value
		assert.ok(bReturnValue, "should return true.");

		done();
	});

	QUnit.test("should call 'fnNavigate' when there is no link and a mainNavigationLink, call MDCPanel.navigate with 'href' and then return true", async function(assert) {
		const done = assert.async();
		const oEventMock = {};
		const oMainNavigationLink = {
			title: "title",
			href: "Href"
		};

		this.fnGetPropertyStub.returns([]);
		this.fnGetExtraContentStub.returns(undefined);
		this.fnGetMainNavigationStub.returns(oMainNavigationLink);
		this.fnBeforeNavigationCallbackStub.returns(Promise.resolve(true));

		_checkInitialCalls.call(this, assert);

		const bReturnValue = await this.oSmartLinkFieldInfo.checkDirectNavigation(oEventMock);

		// Check calls before early return
		_checkEarlyReturn.call(this, assert);

		// Check calls to check if fnNavigate shall be called
		assert.ok(this.fnGetMainNavigationStub.calledOnce, "should call 'getMainNavigation'.");

		// Check calls in fnNavigate
		_checkFnNavigateCalled.call(this, assert, oMainNavigationLink, oEventMock);

		// Check return value
		assert.ok(bReturnValue, "should return true.");

		done();
	});

	QUnit.start();
});