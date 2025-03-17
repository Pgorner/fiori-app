sap.ui.define([
    "sap/suite/ui/generic/template/lib/deletionHelper",
     "sap/ui/core/routing/History"
], function (
    deletionHelper,
    History
){

    var oSandbox = null;
    var oTemplateContract = null;
    var oHistory = History.getInstance();

    QUnit.module("Testing the navigation after discard draft", {
        beforeEach: function () {
            oSandbox = sinon.sandbox.create();
            oTemplateContract = {
                oTemplatePrivateGlobalModel: {
                    getProperty: oSandbox.stub()
                },
                oNavigationControllerProxy: {
                    navigateBack: oSandbox.stub(),
                    navigateUpAfterDeletion: oSandbox.stub()
                }
            }
        },
        afterEach: function () {
            oSandbox.restore();
        }
    });

    QUnit.test("User directly landed on create page through external navigation - back navigation is possible", function (assert) {
        // Prepare
        oTemplateContract.oTemplatePrivateGlobalModel.getProperty.returns(true);
        oSandbox.stub(oHistory, "getPreviousHash").returns("SalesOrder-manage"); // Previous app is "SalesOrder-manage"
        // Act
        deletionHelper.getNavigateAfterDeletionOfCreateDraft(oTemplateContract)();
        // Assert
        assert.ok(oTemplateContract.oNavigationControllerProxy.navigateBack.calledOnce, "Discard draft should navigate back to the previous app");
    });

    QUnit.test("User directly landed on create page on new tab - back navigation is impossible", function (assert) {
        // Prepare
        oTemplateContract.oTemplatePrivateGlobalModel.getProperty.returns(true);
        oSandbox.stub(oHistory, "getPreviousHash").returns(null); // No previous hash found as the create draft is opened on new tab
        // Act
        deletionHelper.getNavigateAfterDeletionOfCreateDraft(oTemplateContract)();
        // Assert
        assert.ok(oTemplateContract.oNavigationControllerProxy.navigateUpAfterDeletion.calledOnce, "Discard draft should navigate to the root page");
    });

    QUnit.test("Regular use case - User opens create page from List Report", function (assert) {
        // Prepare
        oTemplateContract.oTemplatePrivateGlobalModel.getProperty.returns(false);
        // Act
        deletionHelper.getNavigateAfterDeletionOfCreateDraft(oTemplateContract)();
        // Assert
        assert.ok(oTemplateContract.oNavigationControllerProxy.navigateUpAfterDeletion.calledOnce, "Discard draft should navigate to the root page");
    });
});