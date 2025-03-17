// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.Component
 */
sap.ui.define([
    "sap/ushell/components/workPageBuilder/Component"
], function (
    Component
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});



    QUnit.module("The Component", {
        beforeEach: function () {
            this.oComponent = new Component();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });
    QUnit.test("instantiation works", function (assert) {
        assert.ok(this.oComponent, "The component was instantiated.");
    });

    QUnit.test("The public APIs are defined", function (assert) {
        assert.ok(this.oComponent.setPageData, "The API setPageData is defined");
        assert.ok(this.oComponent.getPageData, "The API getPageData is defined");
        assert.ok(this.oComponent.getEditMode, "The API getEditMode is defined");
        assert.ok(this.oComponent.setEditMode, "The API setEditMode is defined");
        assert.ok(this.oComponent.getPreviewMode, "The API getPreviewMode is defined");
        assert.ok(this.oComponent.setPreviewMode, "The API setPreviewMode is defined");
        assert.ok(this.oComponent.setVisualizationData, "The API setVisualizationData is defined");
        assert.ok(this.oComponent.getNavigationDisabled, "The API getNavigationDisabled is defined");
        assert.ok(this.oComponent.setNavigationDisabled, "The API setNavigationDisabled is defined");
        assert.ok(this.oComponent.setShowFooter, "The API setShowFooter is defined");
        assert.ok(this.oComponent.setShowPageTitle, "The API setShowPageTitle is defined");
    });

    QUnit.test("The public events are defined", function (assert) {
        assert.ok(this.oComponent.getMetadata().getEvent("workPageEdited"), "workPageEdited is defined");
        assert.ok(this.oComponent.getMetadata().getEvent("visualizationFilterApplied"), "visualizationFilterApplied is defined");
        assert.ok(this.oComponent.getMetadata().getEvent("closeEditMode"), "closeEditMode is defined");
    });

    QUnit.module("setPageData", {
        beforeEach: function () {
            this.oPageData = {
                workPage: {
                    contents: {},
                    usedVisualizations: {
                        nodes: []
                    }
                }
            };
            this.oComponent = new Component();
            this.oSetPageDataStub = sandbox.stub();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    setPageData: this.oSetPageDataStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("setPageData calls setPageData on the controller", function (assert) {
        return this.oComponent.setPageData(this.oPageData).then(function () {
            assert.ok(this.oSetPageDataStub.calledOnce, "was called");
            assert.deepEqual(this.oSetPageDataStub.firstCall.args[0], this.oPageData, "was called with the expected arguments");
        }.bind(this));
    });

    QUnit.module("setVisualizationData", {
        beforeEach: function () {
            this.aVizData = [{
                id: "viz1"
            }, {
                id: "viz2"
            }];
            this.oComponent = new Component();
            this.oSetVisualizationDataStub = sandbox.stub().resolves();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    setVisualizationData: this.oSetVisualizationDataStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("setVisualizationData calls setVisualizationData on the controller", function (assert) {
        return this.oComponent.setVisualizationData({
            visualizations: {
                nodes: this.aVizData,
                totalCount: 100
            }
        }).then(function () {
            assert.ok(this.oSetVisualizationDataStub.calledOnce, "was called");
            assert.deepEqual(this.oSetVisualizationDataStub.firstCall.args[0], {
                visualizations: {
                    nodes: this.aVizData,
                    totalCount: 100
                }
            }, "was called with the expected arguments");
        }.bind(this));
    });

    QUnit.module("setCategoryTree", {
        beforeEach: function () {
            this.aCategories = [{
                id: "cat1"
            }, {
                id: "cat2"
            }];
            this.oComponent = new Component();
            this.oSetCategoryTreeDataStub = sandbox.stub().resolves();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    setCategoryTree: this.oSetCategoryTreeDataStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls setCategoryTree on the controller", function (assert) {
        return this.oComponent.setCategoryTree({
            aCategoryTree: {
                nodes: this.aCategories,
                totalCount: 100
            }
        }).then(function () {
            assert.ok(this.oSetCategoryTreeDataStub.calledOnce, "was called only once");
            assert.deepEqual(this.oSetCategoryTreeDataStub.firstCall.args[0], {
                aCategoryTree: {
                    nodes: this.aCategories,
                    totalCount: 100
                }
            }, "was called with the expected arguments");
        }.bind(this));
    });

    QUnit.module("setVisualizationDataPaginated", {
        beforeEach: function () {
            this.aVizData = [{
                id: "viz1"
            }, {
                id: "viz2"
            }];
            this.oComponent = new Component();
            this.oSetVisualizationDataPaginatedStub = sandbox.stub().resolves();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    setVisualizationData: this.oSetVisualizationDataPaginatedStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls setVisualizationDataPaginated on the controller", function (assert) {
        return this.oComponent.setVisualizationData({
            visualizations: {
                nodes: this.aVizData,
                totalCount: 99
            }
        }).then(function () {
            assert.ok(this.oSetVisualizationDataPaginatedStub.calledOnce, "was called");
            assert.deepEqual(this.oSetVisualizationDataPaginatedStub.firstCall.args[0], {
                visualizations: {
                    nodes: this.aVizData,
                    totalCount: 99
                }
            }, "was called with the expected arguments");
        }.bind(this));
    });

    QUnit.module("setPreviewMode", {
        beforeEach: function () {
            this.oComponent = new Component();
            this.oSetPreviewModeStub = sandbox.stub();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    setPreviewMode: this.oSetPreviewModeStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("setPreviewMode calls setPreviewMode on the controller", function (assert) {
        this.oComponent.setPreviewMode(true);
        assert.ok(this.oSetPreviewModeStub.calledOnce, "was called");
        assert.ok(this.oSetPreviewModeStub.calledWith(true), "was called with the expected arguments");
    });

    QUnit.module("getPreviewMode", {
        beforeEach: function () {
            this.oComponent = new Component();
            this.oGetPreviewModeStub = sandbox.stub().returns(true);
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    getPreviewMode: this.oGetPreviewModeStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls getPreviewMode on the controller and returns the value", function (assert) {
        var bResult = this.oComponent.getPreviewMode();
        assert.ok(this.oGetPreviewModeStub.calledOnce, "was called");
        assert.strictEqual(bResult, true, "returned true");
    });

    QUnit.module("setEditMode", {
        beforeEach: function () {
            this.oComponent = new Component();
            this.oSetEditModeStub = sandbox.stub();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    setEditMode: this.oSetEditModeStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("setEditMode calls setEditMode on the controller", function (assert) {
        this.oComponent.setEditMode(true);
        assert.ok(this.oSetEditModeStub.calledOnce, "was called");
        assert.ok(this.oSetEditModeStub.calledWith(true), "was called with the expected arguments");
    });

    QUnit.module("getEditMode", {
        beforeEach: function () {
            this.oComponent = new Component();
            this.oGetEditModeStub = sandbox.stub().returns(true);
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    getEditMode: this.oGetEditModeStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls getEditMode on the controller and returns the value", function (assert) {
        var bResult = this.oComponent.getEditMode();
        assert.ok(this.oGetEditModeStub.calledOnce, "was called");
        assert.strictEqual(bResult, true, "returned true");
    });

    QUnit.module("getPageData", {
        beforeEach: function () {
            this.oComponent = new Component();
            this.oGetPageDataStub = sandbox.stub().returns({ workPage: { contents: { rows: [] } } });
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    getPageData: this.oGetPageDataStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls getPageData on the controller and returns the value", function (assert) {
        var oResult = this.oComponent.getPageData();
        assert.ok(this.oGetPageDataStub.calledOnce, "was called");
        assert.deepEqual(oResult, { workPage: { contents: { rows: [] } } }, "returned the result");
    });

    QUnit.module("getNavigationDisabled", {
        beforeEach: function () {
            this.oComponent = new Component();
            this.oGetNavigationDisabledStub = sandbox.stub().returns(false);
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    getNavigationDisabled: this.oGetNavigationDisabledStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls getNavigationDisabled on the controller and returns the value", function (assert) {
        var bResult = this.oComponent.getNavigationDisabled();
        assert.ok(this.oGetNavigationDisabledStub.calledOnce, "was called");
        assert.strictEqual(bResult, false, "returned false");
    });

    QUnit.module("setNavigationDisabled", {
        beforeEach: function () {
            this.oComponent = new Component();
            this.oSetNavigationDisabledStub = sandbox.stub();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    setNavigationDisabled: this.oSetNavigationDisabledStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls setNavigationDisabled on the controller", function (assert) {
        this.oComponent.setNavigationDisabled(true);
        assert.ok(this.oSetNavigationDisabledStub.calledOnce, "was called");
        assert.ok(this.oSetNavigationDisabledStub.calledWith(true), "was called with true");
    });

    QUnit.module("setShowFooter", {
        beforeEach: function () {
            this.oComponent = new Component();
            this.oSetShowFooterStub = sandbox.stub();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    setShowFooter: this.oSetShowFooterStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls setShowFooter on the controller", function (assert) {
        //Act
        this.oComponent.setShowFooter(true);

        //Assert
        assert.ok(this.oSetShowFooterStub.calledOnce, "was called once");
        assert.strictEqual(this.oSetShowFooterStub.calledWith(true), true, "was called with true");
    });

    QUnit.module("setShowPageTitle", {
        beforeEach: function () {
            this.oComponent = new Component();
            this.oSetShowPageTitleStub = sandbox.stub();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    setShowPageTitle: this.oSetShowPageTitleStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls setShowPageTitle on the controller", function (assert) {
        //Act
        this.oComponent.setShowPageTitle(true);

        //Assert
        assert.ok(this.oSetShowPageTitleStub.calledOnce, "was called once");
        assert.strictEqual(this.oSetShowPageTitleStub.calledWith(false), false, "was called with false");
    });

});
