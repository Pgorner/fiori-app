
/*global QUnit, sinon */
sap.ui.define([
	"sap/gantt/layouts/SidePanel",
	"sap/m/Text"
], function (SidePanel, Text) {
	"use strict";
	QUnit.module("Create SidePanel with default values.", {
		beforeEach: function () {
			this.oSidePanel = new SidePanel();
		},
		afterEach: function () {
			this.oSidePanel.destroy();
			this.oSidePanel = undefined;
		}
	});
	QUnit.test("Test with default configuration values.", function (assert) {
		assert.strictEqual(this.oSidePanel.getContent(), null);
		assert.strictEqual(this.oSidePanel.getVisible(), false);
	});
	QUnit.test("Should notify parent on attach", function (assert) {
		const oControlStub = sinon.stub(
			Object.getPrototypeOf(
				Object.getPrototypeOf(this.oSidePanel)
			),
			'setParent'
		);
		const oParentNoAttach = {
			onSidePanelAttach: undefined
		};
		const oParent = {
			onSidePanelAttach: () => { }
		};
		const oParentAttachSpy = sinon.spy(oParent, "onSidePanelAttach");
		this.oSidePanel.setParent(oParentNoAttach); // should not FindAndSelectUtils
		this.oSidePanel.setParent(oParent);
		assert.ok(oParentAttachSpy.calledOnce, "Parent attach called");
		oParentAttachSpy.restore();
		oControlStub.restore();
	});
	QUnit.test("Should create invalidations when required", function (assert) {
		const oControlStub = sinon.stub(
			Object.getPrototypeOf(
				Object.getPrototypeOf(this.oSidePanel)
			),
			'setAggregation'
		);
		const oParent = {
			invalidate: () => { }
		};
		const oParentSpy = sinon.spy(oParent, "invalidate");
		this.oSidePanel.getParent = () => oParent;
		this.oSidePanel.setVisible(true);
		assert.ok(oParentSpy.calledOnce, "invalidation created");
		this.oSidePanel._setPanelVisibility(false, true);
		assert.ok(oParentSpy.calledOnce, "no invalidation created when suppressed");
		this.oSidePanel.setVisible(true);
		oParentSpy.resetHistory();
		this.oSidePanel.setContent(new Text());
		assert.ok(oParentSpy.calledOnce, "invalidation created");
		this.oSidePanel.setContent(new Text(), true);
		assert.ok(oParentSpy.calledOnce, "no invalidation created when suppressed");
		oParentSpy.restore();
		oControlStub.restore();
	});
	QUnit.module("Create SidePanel with content.", {
		beforeEach: function () {
			this.oSidePanel = new SidePanel({
				content: new Text()
			});
			this.oDelegate = {
				"onActivated": () => { },
				"onDeactivated": () => { }
			};
			this.oActivatedSpy = sinon.spy(this.oDelegate, "onActivated");
			this.oDeactivatedSpy = sinon.spy(this.oDelegate, "onDeactivated");
		},
		afterEach: function () {
			this.oActivatedSpy.restore();
			this.oDeactivatedSpy.restore();
			this.oActivatedSpy = undefined;
			this.oDeactivatedSpy = undefined;
			this.oSidePanel.destroy();
			this.oSidePanel = undefined;
			this.oDelegate = undefined;
		}
	});
	QUnit.test("Should activate or deactivate the content when visible is set true or false.", function (assert) {
		this.oSidePanel.addEventDelegate(this.oDelegate);
		this.oSidePanel.setVisible(true);
		// should skip multiple calls
		this.oSidePanel.setVisible(true);
		assert.ok(this.oSidePanel.getVisible(), "Side panel enabled");
		assert.ok(this.oActivatedSpy.calledOnce, "Side panel activate delegate triggered");
		assert.ok(this.oDeactivatedSpy.notCalled, "Side panel deactivate delegate not triggered");
		this.oActivatedSpy.resetHistory();
		this.oDeactivatedSpy.resetHistory();
		this.oSidePanel.setVisible(false);
		// should skip multiple calls
		this.oSidePanel.setVisible(false);
		assert.notOk(this.oSidePanel.getVisible(), "Side panel disabled");
		assert.ok(this.oActivatedSpy.notCalled, "Side panel activate delegate not triggered");
		assert.ok(this.oDeactivatedSpy.calledOnce, "Side panel deactivate delegate triggered");
	});
	QUnit.test("Should set content aggregation when the side panel is active", function (assert) {
		this.oSidePanel.setVisible(true);
		this.oSidePanel.setAggregation("content", null, true);
		const oControlStub = sinon.stub(
			Object.getPrototypeOf(
				Object.getPrototypeOf(this.oSidePanel)
			),
			'setAggregation'
		);
		this.oSidePanel.setContent(new Text());
		assert.ok(oControlStub.calledOnce, "Side panel content aggregation set");
		oControlStub.restore();
	});
});
