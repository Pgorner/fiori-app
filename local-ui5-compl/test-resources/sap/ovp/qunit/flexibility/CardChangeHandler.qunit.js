sap.ui.define([
    "sap/ovp/flexibility/changeHandler/CardChangeHandler",
    "sap/ui/fl/apply/_internal/flexObjects/UIChange",
    "sap/ui/core/util/reflection/JsControlTreeModifier",
    "sap/ovp/app/Component",
    "sap/ui/core/ComponentContainer",
    "sap/ovp/cards/CommonUtils",
    "sap/ui/core/Element",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function(
    CardChangeHandler,
    UIChange,
    JsControlTreeModifier,
    OVPAppComponent,
    ComponentContainer,
    CommonUtils,
    CoreElement,
    MessageBox,
    JSONModel
) {
    "use strict";

    var sandbox = sinon.createSandbox();

    /**
     * Test cases for when hideCardContainer and unhideCardContainer changes are created
     */
    QUnit.module("Create and apply hide/unhide-CardContainer changes", {
        before: function() {
            this.hideCardChangeHandler = CardChangeHandler.HideCardContainer.changeHandler;
            this.unhideCardChangeHandler = CardChangeHandler.UnhideCardContainer.changeHandler;

            this.oComponent = new OVPAppComponent();
            this.mPropertyBag = {
                modifier: JsControlTreeModifier,
                appComponent: this.oComponent
            };

            this.oCard = new ComponentContainer(this.oComponent.createId("mainView--card00"));
            this.oComponentContainer = new ComponentContainer(this.oComponent.createId("ovpLayout1"));

            this.oComponentContainer.addDependent(this.oCard);
            this.oComponentContainer.setComponent(this.oComponent);
            
            this.fnLayoutRerenderSpy = sandbox.spy();
            var oMainComponent = {
                getView: sandbox.stub().returns({
                    byId: sinon.stub().returns(this.oCard)
                }),
                getLayout: sinon.stub().returns({ 
                    invalidate: this.fnLayoutRerenderSpy
                }),
                deltaChanges: [],
                appendIncomingDeltaChange: function() {},
                getAllowedNumberOfCards: function () {
                    return {
                        numberOfCards: 3,
                        errorMessage: 'You have reached the maximum limit of 3 cards. To add a new card, you first have to deselect one from the list or hide a card if you are in key user mode.'
                    }; 
                },
                getUIModel: sinon.stub().returns(new JSONModel({})),
                bWarningDisplayedOnUnhidingCards: false
            };
            sandbox.stub(CommonUtils, "getApp").returns(oMainComponent);
        },
        afterEach: function() {
            this.fnLayoutRerenderSpy.reset();
        },
        after: function() {
            sandbox.restore();
        }
    });

    QUnit.test("Hide card with hideCardContainer as changetype when there is specific change info", function(assert){
        var oChange = new UIChange({
            selector: JsControlTreeModifier.getSelector(this.oComponentContainer, this.oComponent)
        });
        var mSpecificChangeInfo = {
            changeType: "hideCardContainer",
            removedElement: {id: 'application-preview-app-component---mainView--card00'},
            selector: {id: 'mainView--ovpLayout', idIsLocal: true}
        };

        assert.ok(this.oCard.getVisible() == true, "Card is visible before creating hideCardContainer change");
        return this.hideCardChangeHandler.completeChangeContent(oChange, mSpecificChangeInfo, this.mPropertyBag)
            .then(this.hideCardChangeHandler.applyChange.bind(this, oChange, this.oComponentContainer, this.mPropertyBag))
            .then(function(bHideCardContainerApplied) {
                assert.ok(bHideCardContainerApplied, "Hide card container change is applied");
                assert.ok(this.oCard.getVisible() == false, "Card is hidden from the view");
                assert.ok(this.fnLayoutRerenderSpy.calledOnce, "Layout is rerendered once after change is applied");
            }.bind(this));
    });
     
    QUnit.test("Unhide card with unhideCardContainer as changetype when there is specific change info", function(assert){
        var oChange = new UIChange({
            selector: JsControlTreeModifier.getSelector(this.oComponentContainer, this.oComponent)
        });
        var mSpecificChangeInfo = {
            changeType: "unhideCardContainer",
            revealedElementId: 'application-preview-app-component---mainView--card00',
            selector: {id: 'mainView--ovpLayout', idIsLocal: true}
        };
        assert.ok(this.oCard.getVisible() == false, "Card is not visible before creating unhideCardContainer change");
        var oComponentContainer = {
            getVisibleLayoutItems: function () {
                return [];
            }
        }
        return this.unhideCardChangeHandler.completeChangeContent(oChange, mSpecificChangeInfo, this.mPropertyBag)
            .then(this.unhideCardChangeHandler.applyChange.bind(this, oChange, oComponentContainer, this.mPropertyBag))
            .then(function(bUnhideCardContainerApplied) {
                assert.ok(bUnhideCardContainerApplied, "UnHide card container change is applied");
                assert.ok(this.oCard.getVisible() == true, "Card is visible in the view");
                assert.ok(this.fnLayoutRerenderSpy.calledOnce, "Layout is rerendered once after change is applied");
            }.bind(this));
    });

    /**
     * Test cases for when hideCardContainer and unhideCardContainer changes are applied on load of application
     */
    QUnit.test("Hide card with hideCardContainer as changetype", function(assert){
        var oChange = new UIChange({
            selector: JsControlTreeModifier.getSelector(this.oComponentContainer, this.oComponent)
        });
        oChange.setContent({
            "card": {
                "id": "mainView--card00",
                "idIsLocal": true
            }
        });

        assert.ok(this.oCard.getVisible() == true, "Card is visible before appling hideCardContainer change");
        return this.hideCardChangeHandler.applyChange(oChange, this.oComponentContainer, this.mPropertyBag)
            .then(function(bHideCardContainerApplied) {
                assert.ok(bHideCardContainerApplied, "Hide card container change is applied");
                assert.ok(this.oCard.getVisible() == false, "Card is hidden from the view");
                assert.ok(this.fnLayoutRerenderSpy.calledOnce, "Layout is rerendered once after change is applied");
            }.bind(this));
    });

    QUnit.test("Unhide card with unhideCardContainer as changetype", function(assert){
        var oChange = new UIChange({
            selector: JsControlTreeModifier.getSelector(this.oComponentContainer, this.oComponent)
        });
        oChange.setContent({
            "card": {
                "id": "mainView--card00",
                "idIsLocal": true
            }
        });
        var oComponentContainer = {
            getVisibleLayoutItems: function () {
                return [];
            }
        }
        assert.ok(this.oCard.getVisible() == false, "Card is not visible before appling unhideCardContainer change");
        return this.unhideCardChangeHandler.applyChange(oChange, oComponentContainer, this.mPropertyBag)
            .then(function(bUnhideCardContainerApplied) {
                assert.ok(bUnhideCardContainerApplied, "Unhide card container change is applied");
                assert.ok(this.oCard.getVisible() == true, "Card is visible in the view");
                assert.ok(this.fnLayoutRerenderSpy.calledOnce, "Layout is rerendered once after change is applied");
            }.bind(this));
    });

    QUnit.test("Unhide card with unhideCardContainer as changetype when, selected cards do not exceed card limit", function(assert){
        CoreElement.getElementById = function(sDialogId) {
            return {
                getModel: function() {
                    return {
                        getData: function() {
                            return {
                                elements: [
                                    { selected: true },
                                    { selected: true }
                                ]
                            };
                        }
                    };
                },
                setVisible: function() {},
                unbindProperty: function() {}
            };
        };
        MessageBox.warning = function(sWarningMsg, mOptions) {};

        var oChange = new UIChange({
            selector: JsControlTreeModifier.getSelector(this.oComponentContainer, this.oComponent)
        });
        oChange.setContent({
            "card": {
                "id": "mainView--card01",
                "idIsLocal": true
            }
        });
    
        var oComponentContainer = {
            getVisibleLayoutItems: function () {
                return [
                    {sId: 'application-sales-overview-component---mainView--card00' }
                ];
            }
        }
        return this.unhideCardChangeHandler.applyChange(oChange, oComponentContainer, this.mPropertyBag)
            .then(function(bUnhideCardContainerApplied) {
                assert.ok(bUnhideCardContainerApplied === true, "Unhide card container change is applied, when max limit is not exceeded");
            }.bind(this))
            .finally(function() {
                CoreElement.getElementById = CoreElement.getElementById;
            });
    });

    QUnit.test("Unhide card with unhideCardContainer as changetype when selected cards exceed card limit", function(assert){
        CoreElement.getElementById = function(sDialogId) {
            return {
                getModel: function() {
                    return {
                        getData: function() {
                            return {
                                elements: [
                                    { selected: true },
                                    { selected: true },
                                    { selected: true },
                                    { selected: true }
                                ]
                            };
                        }
                    };
                },
                setVisible: function() {},
                unbindProperty: function() {}
            };
        };
        MessageBox.warning = function(sWarningMsg, mOptions) {};

        var oChange = new UIChange({
            selector: JsControlTreeModifier.getSelector(this.oComponentContainer, this.oComponent)
        });
        oChange.setContent({
            "card": {
                "id": "mainView--card03",
                "idIsLocal": true
            }
        });

        var oComponentContainer = {
            getVisibleLayoutItems: function () {
                return [
                    {sId: 'application-sales-overview-component---mainView--card00' },
                    {sId: 'application-sales-overview-component---mainView--card01' },
                    {sId: 'application-sales-overview-component---mainView--card02' }
                ];
            }
        }
        return this.unhideCardChangeHandler.applyChange(oChange, oComponentContainer, this.mPropertyBag)
            .then(function(bUnhideCardContainerApplied) {
                assert.ok(bUnhideCardContainerApplied === false, "Unhide card container change is not applied, when max limit exceeds");
            }.bind(this))
            .finally(function() {
                CoreElement.getElementById = CoreElement.getElementById;
            });
    });
});
