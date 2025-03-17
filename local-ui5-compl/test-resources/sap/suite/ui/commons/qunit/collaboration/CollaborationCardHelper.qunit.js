sap.ui.define([
	"sap/suite/ui/commons/collaboration/CollaborationCardHelper",
	"sap/ui/core/Lib"
], function (CollaborationCardHelper, Library) {

	QUnit.module("CollaborationCardHelper", {
		beforeEach: function () {
			this.oCollaborationCardHelper = CollaborationCardHelper;
			this.oSandbox = sinon.sandbox.create();
			this.fetchStub = sinon.stub(window, "fetch");
			this.fetchStub.withArgs("/sap/opu/odata4/sap/aps_ui_card_srv/srvd_a2x/sap/aps_ui_card/0001/").returns(Promise.resolve({
				ok: true,
				headers: {
					get: function () {
						return "token";
					}
				}
			}));
			this.fetchStub.withArgs("/sap/opu/odata4/sap/aps_ui_card_srv/srvd_a2x/sap/aps_ui_card/0001/Card")
				.returns(Promise.resolve({
					ok: true,
					json: function () {
						return Promise.resolve({
							id: "card"
						});
					}
				}));
		},
		afterEach: function () {
			this.oCollaborationCardHelper = null;
			this.oSandbox.restore();
			this.fetchStub.restore();
		}
	});

	QUnit.test("Should fetch CSRF token", async function (assert) {
		const result = await this.oCollaborationCardHelper.fetchCSRFToken();
		assert.ok(result, "CSRF token is fetched");
	});

	QUnit.test("Should post card", async function (assert) {
		const result = await this.oCollaborationCardHelper.postCard("123", "content");
		assert.equal(this.fetchStub.args[1][1].body, JSON.stringify({
				content: "ImNvbnRlbnQi",
				card_id: "123"
			}),
			"Card is posted with base64 content");
		assert.equal(result.id, "card", "Card is posted");
	});

	QUnit.test("Should post card in original content", async function (assert) {
		const content = {
			data: "שלום עולם"
		}
		const result = await this.oCollaborationCardHelper.postCard("123", content);
		assert.equal(this.fetchStub.args[1][1].body, JSON.stringify({
				content: JSON.stringify(content),
				card_id: "123"
			}),
			"Card is posted with original content");
		assert.equal(result.id, "card", "Card is posted");
	});

});