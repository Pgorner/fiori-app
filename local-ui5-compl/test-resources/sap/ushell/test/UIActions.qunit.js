// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.UIActions
 */

sap.ui.define([
    "sap/base/util/extend",
    "sap/ushell/UIActions"
], function (
    extend,
    UIActions
) {
    "use strict";

    /* global QUnit sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.UIActions", {
        beforeEach: function () {
            this.oContainer = document.createElement("div");
            this.oContainer.setAttribute("id", "container");
            this.oContainer.setAttribute("width", "500px");
            this.oContainer.setAttribute("height", "500px");
            this.oContainer.setAttribute("bgcolor", "red");

            var oWrapper = document.createElement("div");
            oWrapper.setAttribute("id", "wrapper");
            oWrapper.appendChild(this.oContainer);

            this.oWorkArea = document.createElement("div");
            this.oWorkArea.setAttribute("id", "root");
            this.oWorkArea.appendChild(oWrapper);

            document.body.appendChild(this.oWorkArea);

            this.oDraggable = document.createElement("div");
            this.oDraggable.setAttribute("id", "draggable0");
            this.oDraggable.classList.add("draggable");
            this.oDraggable.setAttribute("width", "100px");
            this.oDraggable.setAttribute("height", "100px");
            this.oDraggable.setAttribute("bgcolor", "blue");
            this.oContainer.appendChild(this.oDraggable);
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            document.body.removeChild(this.oWorkArea);
            sandbox.restore();
        }
    });

    QUnit.test("create a new instance of UIActions Class", function (assert) {
        // Act
        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: "D"
        });

        // Assert
        assert.ok(oInstance, "create a new instance");
    });

    QUnit.test("create and delete UIAction element validation", function (assert) {
        // Arrange
        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: "D"
        });

        // Act
        oInstance.delete = sandbox.spy();

        // Assert
        assert.ok(oInstance, "create a new instance");

        // Act
        oInstance.delete();

        // Assert
        assert.ok(oInstance.delete.calledOnce, "new instance deleted");
    });

    QUnit.test("create a new instance of UIActions Class with empty mandatory parameters", function (assert) {
        assert.throws(
            function () {
                new UIActions({
                    rootSelector: "",
                    containerSelector: "#container",
                    draggableSelector: "D"
                });
            },
            "create new UIActions object with empty rootSelector parameter should throw an exception."
        );

        assert.throws(
            function () {
                new UIActions({
                    rootSelector: "#root",
                    containerSelector: "",
                    draggableSelector: "D"
                });
            },
            "create new UIActions object with empty containerSelector parameter should throw an exception."
        );

        assert.throws(
            function () {
                new UIActions({
                    rootSelector: "#root",
                    containerSelector: "#container",
                    draggableSelector: ""
                });
            },
            "create new UIActions object with empty draggableSelector parameter should throw an exception."
        );
    });

    QUnit.test("touchstart on draggable element", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            isTouch: true
        }).enable();

        try {
            var oEvent = extend(
                new UIEvent("touchstart"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] }
            );

            // Act
            this.oWorkArea.dispatchEvent(oEvent);

            setTimeout(function () {
                // Assert
                assert.ok(oInstance.startCallback.calledOnce, "make sure touchstart callback is called once");
                assert.ok(oInstance.startCallback.args[0][1] === this.oDraggable, "make sure touchstart callback is called with draggable element");

                oInstance.disable();
                fnDone();
            }.bind(this), 100);
        } catch (err) {
            assert.ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            oInstance.disable();
            fnDone();
        }
    });

    QUnit.test("mousedown on draggable element", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            isTouch: false
        }).enable();

        var oMousedownEvent = extend(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        oMousedownEvent.initEvent("mousedown", true, true);

        // Act
        this.oDraggable.dispatchEvent(oMousedownEvent);

        setTimeout(function () {
            assert.ok(oInstance.startCallback.calledOnce, "make sure mousedown callback is called once");
            assert.ok(oInstance.startCallback.args[0][1] === this.oDraggable, "make sure mousedown callback is called with draggable element");

            oInstance.disable();
            oInstance = null;
            fnDone();
        }.bind(this), 100);
    });

    QUnit.test("touchstart on non-draggable element", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            isTouch: true
        }).enable();

        try {
            var oEvent = extend(
                new UIEvent("touchstart"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oContainer }] }
            );

            // Act
            this.oWorkArea.dispatchEvent(oEvent);

            setTimeout(function () {
                // Assert
                assert.ok(oInstance.startCallback.notCalled, "make sure touchstart callback is not called");

                oInstance.disable();

                fnDone();
            }, 100);
        } catch (err) {
            // Assert
            assert.ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            oInstance.disable();
            fnDone();
        }
    });

    QUnit.test("mousedown on non-draggable element", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            isTouch: false
        }).enable();

        var oEvent = document.createEvent("Event");
        oEvent.initEvent("mousedown", true, true);

        // Act
        this.oWorkArea.dispatchEvent(oEvent);

        setTimeout(function () {
            // Assert
            assert.ok(oInstance.startCallback.notCalled, "make sure mousedown callback is not called");

            oInstance.disable();

            fnDone();
        }, 100);
    });

    QUnit.test("check double tap", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            doubleTapCallback: sandbox.spy(),
            doubleTapDelay: 500, //ms,
            switchModeDelay: 1500,
            debug: true,
            isTouch: true
        }).enable();

        try {
            var oTouchstartEvent = extend(
                new UIEvent("touchstart"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] }
            );
            var oTouchendEvent = extend(
                new UIEvent("touchend"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] },
                {
                    changedTouches: [{
                        pageX: 10,
                        pageY: 10
                    }]
                }
            );

            // Act
            setTimeout(function () {
                this.oWorkArea.dispatchEvent(oTouchstartEvent);
                setTimeout(function () {
                    this.oWorkArea.dispatchEvent(oTouchendEvent);
                    setTimeout(function () {
                        this.oWorkArea.dispatchEvent(oTouchstartEvent);
                        setTimeout(function () {
                            this.oWorkArea.dispatchEvent(oTouchendEvent);
                            setTimeout(function () {
                                // Assert
                                assert.ok(oInstance.startCallback.calledTwice, "make sure touchstart callback is called twice");
                                assert.ok(oInstance.doubleTapCallback.calledOnce, "make sure doubleTap callback is called");

                                oInstance.disable();
                                fnDone();
                            }, 10);
                        }.bind(this), 5);
                    }.bind(this), 5);
                }.bind(this), 5);
            }.bind(this), 5);
        } catch (err) {
            // Assert
            assert.ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            oInstance.disable();
            fnDone();
        }
    });

    QUnit.test("check double click", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            doubleTapCallback: sandbox.spy(),
            doubleTapDelay: 10000, //ms,
            switchModeDelay: 1500,
            debug: true,
            isTouch: false
        }).enable();

        var oMousedownEvent = extend(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        oMousedownEvent.initEvent("mousedown", true, true);

        var oMouseupEvent = extend(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        oMouseupEvent.initEvent("mouseup", true, true);

        // Act
        this.oDraggable.dispatchEvent(oMousedownEvent);
        setTimeout(function () {
            this.oDraggable.dispatchEvent(oMouseupEvent);
            setTimeout(function () {
                this.oDraggable.dispatchEvent(oMousedownEvent);
                setTimeout(function () {
                    this.oDraggable.dispatchEvent(oMouseupEvent);
                    setTimeout(function () {
                        // Assert
                        assert.ok(oInstance.startCallback.calledTwice, "make sure mousedown callback is called twice");
                        assert.ok(oInstance.doubleTapCallback.calledOnce, "make sure doubleClick callback is called");

                        oInstance.disable();

                        fnDone();
                    }, 100);
                }.bind(this), 50);
            }.bind(this), 50);
        }.bind(this), 50);
    });

    QUnit.test("check touchEnd after drag and clone disappearance", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            endCallback: sandbox.spy(),
            cloneClass: "clone",
            switchModeDelay: 10, //ms
            isTouch: true
        }).enable();

        try {
            var oTouchstartEvent = extend(
                new UIEvent("touchstart"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] }
            );

            var oTouchmoveEvent = extend(
                new UIEvent("touchmove"),
                { touches: [{ pageX: 11, pageY: 11, target: this.oDraggable }] }
            );

            var oTouchendEvent = extend(
                new UIEvent("touchend"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] },
                {
                    changedTouches: [{
                        pageX: 11,
                        pageY: 11
                    }]
                }
            );

            // Act
            this.oWorkArea.dispatchEvent(oTouchstartEvent);
            setTimeout(function () {
                this.oWorkArea.dispatchEvent(oTouchmoveEvent);
                setTimeout(function () {
                    this.oWorkArea.dispatchEvent(oTouchendEvent);
                    setTimeout(function () {
                        // Assert
                        assert.ok(oInstance.endCallback.calledOnce, "make sure touchend callback is called");
                        assert.ok(this.oWorkArea.getElementsByClassName("clone").length === 0, "make sure the clone disappeared");

                        oInstance.disable();
                        fnDone();
                    }.bind(this), 100);
                }.bind(this), 50);
            }.bind(this), 50);
        } catch (err) {
            // Assert
            assert.ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            oInstance.disable();
            fnDone();
        }
    });

    QUnit.test("check mouseup after drag and clone disappearance", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            endCallback: sandbox.spy(),
            cloneClass: "clone",
            switchModeDelay: 10, //ms
            moveTolerance: 1,
            isTouch: false
        }).enable();

        var oMousedownEvent = extend(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        oMousedownEvent.initEvent("mousedown", true, true);

        var oMousemoveEvent = extend(document.createEvent("Event"), { pageX: 15, pageY: 15 });
        oMousemoveEvent.initEvent("mousemove", true, true);

        var oMouseupEvent = extend(document.createEvent("Event"), { pageX: 15, pageY: 15 });
        oMouseupEvent.initEvent("mouseup", true, true);

        // Act
        this.oDraggable.dispatchEvent(oMousedownEvent);
        setTimeout(function () {
            this.oDraggable.dispatchEvent(oMousemoveEvent);
            setTimeout(function () {
                this.oDraggable.dispatchEvent(oMouseupEvent);
                setTimeout(function () {
                    // Assert
                    assert.ok(oInstance.endCallback.calledOnce, "make sure mouseup callback is called");
                    assert.ok(this.oWorkArea.getElementsByClassName("clone").length === 0, "make sure the clone disappeared");

                    oInstance.disable();
                    fnDone();
                }.bind(this), 100);
            }.bind(this), 50);
        }.bind(this), 50);
    });

    QUnit.test("check switch to drag mode and clone creation", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            dragCallback: sandbox.spy(),
            cloneClass: "clone",
            switchModeDelay: 10, //ms
            isTouch: true
        }).enable();

        try {
            var oTouchstartEvent = extend(
                new UIEvent("touchstart"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] }
            );

            var oTouchmoveEvent = extend(
                new UIEvent("touchmove"),
                { touches: [{ pageX: 11, pageY: 11, target: this.oDraggable }] }
            );

            // Act
            this.oWorkArea.dispatchEvent(oTouchstartEvent);
            setTimeout(function () {
                this.oWorkArea.dispatchEvent(oTouchmoveEvent);
                setTimeout(function () {
                    // Assert
                    assert.ok(oInstance.startCallback.calledOnce, "make sure touchstart callback is called");
                    assert.ok(oInstance.dragCallback.calledOnce, "make sure touchdrag callback is called");
                    assert.ok(this.oWorkArea.getElementsByClassName("clone").length === 1, "make sure a clone was created");

                    oInstance.disable();
                    fnDone();
                }.bind(this), 100);
            }.bind(this), 50);
        } catch (err) {
            // Assert
            assert.ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            oInstance.disable();
            fnDone();
        }
    });

    QUnit.test("check switch to drag mode and clone creation (with mouse)", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            dragCallback: sandbox.spy(),
            cloneClass: "clone",
            switchModeDelay: 10, //ms
            moveTolerance: 1,
            isTouch: false
        }).enable();

        var oMousedownEvent = extend(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        oMousedownEvent.initEvent("mousedown", true, true);

        var oMousemoveEvent = extend(document.createEvent("Event"), { pageX: 15, pageY: 15 });
        oMousemoveEvent.initEvent("mousemove", true, true);

        // Act
        this.oDraggable.dispatchEvent(oMousedownEvent);
        setTimeout(function () {
            this.oDraggable.dispatchEvent(oMousemoveEvent);
            setTimeout(function () {
                this.oDraggable.dispatchEvent(oMousemoveEvent);
                setTimeout(function () {
                    // Assert
                    assert.ok(oInstance.startCallback.calledOnce, "make sure mousedown callback is called");
                    assert.ok(oInstance.dragCallback.calledOnce, "make sure mousemove callback is called");
                    assert.ok(this.oWorkArea.getElementsByClassName("clone").length === 1, "make sure a clone was created");

                    oInstance.disable();
                    fnDone();
                }.bind(this), 100);
            }.bind(this), 50);
        }.bind(this), 50);
    });

    QUnit.test("check UIActions disabled", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            isTouch: true
        }).enable();

        oInstance.disable();

        try {
            var oEvent = extend(
                new UIEvent("touchstart"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] }
            );

            // Act
            this.oWorkArea.dispatchEvent(oEvent);

            setTimeout(function () {
                // Assert
                assert.ok(oInstance.startCallback.notCalled, "make sure touchstart callback is not called when the UIActions is disabled");

                // Arrange
                oInstance.enable();

                // Act
                this.oWorkArea.dispatchEvent(oEvent);

                setTimeout(function () {
                    // Assert
                    assert.ok(oInstance.startCallback.calledOnce, "make sure touchstart callback is called when the UIActions is enabled again");

                    oInstance.disable();
                    fnDone();
                }, 100);
            }.bind(this), 100);
        } catch (err) {
            assert.ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            oInstance.disable();
            fnDone();
        }
    });

    QUnit.test("check UIActions disabled (with mouse events)", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            isTouch: false
        }).enable();

        oInstance.disable();

        var oMousedownEvent = extend(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        oMousedownEvent.initEvent("mousedown", true, true);

        this.oDraggable.dispatchEvent(oMousedownEvent);

        setTimeout(function () {
            assert.ok(oInstance.startCallback.notCalled, "make sure mousedown callback is not called when the UIActions is disabled");

            oInstance.enable();
            this.oDraggable.dispatchEvent(oMousedownEvent);

            setTimeout(function () {
                assert.ok(oInstance.startCallback.calledOnce, "make sure mousedown callback is called when the UIActions is enabled again");

                oInstance.disable();
                fnDone();
            }, 100);
        }.bind(this), 100);
    });

    QUnit.test("Do not call drag methods on scroll", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            doubleTapCallback: sandbox.spy(),
            doubleTapDelay: 500, //ms,
            switchModeDelay: 1500,
            debug: true,
            isTouch: true,
            onDragEndUIHandler: sandbox.spy(),
            onDragStartUIHandler: sandbox.spy()
        }).enable();

        try {
            var oTouchstartEvent = extend(
                new UIEvent("touchstart"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] }
            );

            var oTouchendEvent = extend(
                new UIEvent("touchend"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] },
                {
                    changedTouches: [{
                        pageX: 10,
                        pageY: 10
                    }]
                }
            );

            // Act
            setTimeout(function () {
                this.oWorkArea.dispatchEvent(oTouchstartEvent);
                setTimeout(function () {
                    this.oWorkArea.dispatchEvent(oTouchendEvent);
                    // Assert
                    assert.ok(oInstance.onDragEndUIHandler.callCount === 1, "make sure onDragEndUIHandler called once");
                    assert.ok(oInstance.onDragStartUIHandler.callCount === 0, "make sure onDragStartUIHandler never called");
                    oInstance.disable();
                    fnDone();
                }.bind(this), 50);
            }.bind(this), 50);
        } catch (err) {
            // Assert
            assert.ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            oInstance.disable();
            fnDone();
        }
    });

    QUnit.test("touchstart on elementToCapture selector element", function (assert) {
        // Arrange
        var fnDone = assert.async();

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            isTouch: true,
            elementToCapture: ".draggable"
        }).enable();

        try {
            var oEvent = extend(
                new UIEvent("touchstart"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] }
            );

            // Act
            this.oDraggable.dispatchEvent(oEvent);

            setTimeout(function () {
                // Assert
                assert.ok(oInstance.startCallback.calledOnce, "make sure touchstart callback is called once");
                assert.ok(oInstance.startCallback.args[0][1] === this.oDraggable, "make sure touchstart callback is called with draggable element");

                oInstance.disable();
                fnDone();
            }.bind(this), 100);
        } catch (err) {
            // Assert
            assert.ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            oInstance.disable();
            fnDone();
        }
    });
    QUnit.test("touchstart on 2 different elementToCapture selector element", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oDraggable2 = document.createElement("div");
        oDraggable2.setAttribute("id", "draggable0");
        oDraggable2.classList.add("draggable");
        oDraggable2.setAttribute("width", "100px");
        oDraggable2.setAttribute("height", "100px");
        oDraggable2.setAttribute("bgcolor", "blue");
        this.oContainer.appendChild(oDraggable2);

        var oInstance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            startCallback: sandbox.spy(),
            isTouch: true,
            elementToCapture: ".draggable"
        }).enable();

        try {
            var oEvent = extend(
                new UIEvent("touchstart"),
                { touches: [{ pageX: 10, pageY: 10, target: this.oDraggable }] }
            );
            var oEvent2 = extend(
                new UIEvent("touchstart"),
                {
                    touches: [{ pageX: 10, pageY: 10, target: oDraggable2 }],
                    changedTouches: []
                }
            );

            // Act
            this.oDraggable.dispatchEvent(oEvent);
            oDraggable2.dispatchEvent(oEvent2);

            setTimeout(function () {
                // Assert
                assert.ok(oInstance.startCallback.calledTwice, "make sure touchstart callback is called twice");
                assert.ok(oInstance.startCallback.args[0][1] === this.oDraggable, "make sure touchstart callback is called with draggable element");
                assert.ok(oInstance.startCallback.args[1][1] === oDraggable2, "make sure touchstart callback is called with draggable element");

                oInstance.disable();
                fnDone();
            }.bind(this), 100);
        } catch (err) {
            // Assert
            assert.ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            oInstance.disable();
            fnDone();
        }
    });
});
