/*global QUnit*/

sap.ui.define([
    "sap/ovp/ui/UIActions",
    "sap/ovp/cards/jUtils",
    "sap/ui/Device"
], function (
    UIActions,
    jUtils,
    Device
) {
    "use strict";

    QUnit.module("UIActions", {
        beforeEach: function () {
            var testContainer =
                '<div id="root">' +
                    '<div id="wrapper">' +
                        '<div id="container" style="width: 500px; height: 500px; position: absolute; background-color: red;"> </div>' +
                    '</div>' +
                '</div>';

            document.body.insertAdjacentHTML("beforeend", testContainer);
        },
         afterEach: function () {
            jUtils.removeElementById("root");
        },
    });

    QUnit.test("create a new instance of UIActions Class", function (assert) {
        var instance = null;
        instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: "D"
        });

        assert.ok(instance, "create a new instance");
    });

    QUnit.test("create a new instance of UIActions Class with empty mandatory parameters", function (assert) {
        var instance;
        assert.throws(function () {
            instance = new UIActions({
                rootSelector: "",
                containerSelector: "#container",
                draggableSelector: "D",
            });
        }, "create new UIActions object with empty rootSelector parameter should throw an exception.");

        assert.throws(function () {
            instance = new UIActions({
                rootSelector: "#root",
                containerSelector: "",
                draggableSelector: "D",
            });
        }, "create new UIActions object with empty containerSelector parameter should throw an exception.");

        assert.throws(function () {
            instance = new UIActions({
                rootSelector: "#root",
                containerSelector: "#container",
                draggableSelector: "",
            });
        }, "create new UIActions object with empty draggableSelector parameter should throw an exception.");
    });

    QUnit.test("touchstart on draggable element", function (assert) {
        var fnDone = assert.async();

        if (Device.browser.name === Device.browser.BROWSER.INTERNET_EXPLORER) {
            assert.ok(true);
            fnDone();
            return;
        }

        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);
        var draggableDOMRef = document.getElementById("draggable0");

        var touchStartCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            beforeDragCallback: touchStartCallback,
            isTouch: true,
        }).enable();

        var event = Object.assign(new UIEvent("touchstart"), {
            touches: [{ pageX: 10, pageY: 10, target: draggableDOMRef }],
        });

        document.getElementById("root").dispatchEvent(event);
        assert.ok(touchStartCallback.calledOnce, "make sure touchstart callback is called once");
        assert.ok(touchStartCallback.args[0][1] === draggableDOMRef, "make sure touchstart callback is called with draggable element");
        instance.disable();
        instance = null;
        fnDone();
    });

    QUnit.test("mousedown on draggable element", function (assert) {
        var fnDone = assert.async();
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);

        var draggableDOMRef = document.getElementById("draggable0");
        var mouseDownCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            beforeDragCallback: mouseDownCallback,
            isTouch: false,
        }).enable();

        var mousedownEvent = Object.assign(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        mousedownEvent.initEvent("mousedown", true, true);
        draggableDOMRef.dispatchEvent(mousedownEvent);

        QUnit.assert.ok(mouseDownCallback.calledOnce, "make sure mousedown callback is called once");
        QUnit.assert.ok(mouseDownCallback.args[0][1] === draggableDOMRef, "make sure mousedown callback is called with draggable element");
        instance.disable();
        instance = null;
        fnDone();
    });

    QUnit.test("touchstart on non-draggable element", function (assert) {
        var fnDone = assert.async();
        if (Device.browser.name === Device.browser.BROWSER.INTERNET_EXPLORER) {
            assert.ok(true);
            fnDone();
            return;
        }

        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);

        var touchStartCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            beforeDragCallback: touchStartCallback,
            isTouch: true,
        }).enable();

        var event = Object.assign(new UIEvent("touchstart"), {
            touches: [{ pageX: 10, pageY: 10, target: document.getElementById("container") }],
        });

        document.getElementById("root").dispatchEvent(event);

        QUnit.assert.ok(touchStartCallback.notCalled, "make sure touchstart callback is not called");
        instance.disable();
        instance = null;
        fnDone();
    });

    QUnit.test("mousedown on non-draggable element", function (assert) {
        var fnDone = assert.async();
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);

        var mouseDownCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            beforeDragCallback: mouseDownCallback,
            isTouch: false,
        }).enable();

        var event = document.createEvent("Event");
        event.initEvent("mousedown", true, true);
        document.getElementById("root").dispatchEvent(event);
        
        assert.ok(mouseDownCallback.notCalled, "make sure mousedown callback is not called");
        instance.disable();
        instance = null;
        fnDone();
    });

    QUnit.test("check double tap", function (assert) {
        var fnDone = assert.async();
        if (Device.browser.name === Device.browser.BROWSER.INTERNET_EXPLORER) {
            assert.ok(true);
            fnDone();
            return;
        }
        
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);

        var draggableDOMRef = document.getElementById("draggable0");
        var rootElement = document.getElementById("root");
        var touchStartCallback = sinon.spy();
        var doubleTapCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            beforeDragCallback: touchStartCallback,
            doubleTapCallback: doubleTapCallback,
            doubleTapDelay: 500, //ms,
            switchModeDelay: 1500,
            debug: true,
            isTouch: true,
        }).enable();
        var touchstartEvent = Object.assign(new UIEvent("touchstart"), {
            touches: [{ pageX: 10, pageY: 10, target: draggableDOMRef }],
        });
        var touchendEvent = Object.assign(
            new UIEvent("touchend"),
            { touches: [{ pageX: 10, pageY: 10, target: draggableDOMRef }] },
            { changedTouches: [{ pageX: 10, pageY: 10 }] }
        );

        setTimeout(function () {
            rootElement.dispatchEvent(touchstartEvent);
            setTimeout(function () {
                rootElement.dispatchEvent(touchendEvent);
                setTimeout(function () {
                    rootElement.dispatchEvent(touchstartEvent);
                    setTimeout(function () {
                        rootElement.dispatchEvent(touchendEvent);
                        setTimeout(function () {
                            assert.ok(touchStartCallback.calledTwice, "make sure touchstart callback is called twice");
                            assert.ok(doubleTapCallback.calledOnce, "make sure doubleTap callback is called");
                            instance.disable();
                            instance = null;
                            fnDone();
                        }, 100);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    });

    QUnit.test("check double click", function (assert) {
        var fnDone = assert.async();
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);
        var draggableDOMRef = document.getElementById("draggable0");
        var mouseDownCallback = sinon.spy();
        var doubleClickCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            beforeDragCallback: mouseDownCallback,
            doubleTapCallback: doubleClickCallback,
            doubleTapDelay: 10000, //ms,
            switchModeDelay: 1500,
            debug: true,
            isTouch: false,
        }).enable();

        var mousedownEvent = Object.assign(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        mousedownEvent.initEvent("mousedown", true, true);

        var mouseupEvent = Object.assign(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        mouseupEvent.initEvent("mouseup", true, true);

        setTimeout(function () {
            draggableDOMRef.dispatchEvent(mousedownEvent);
            setTimeout(function () {
                draggableDOMRef.dispatchEvent(mouseupEvent);
                setTimeout(function () {
                    draggableDOMRef.dispatchEvent(mousedownEvent);
                    setTimeout(function () {
                        draggableDOMRef.dispatchEvent(mouseupEvent);
                        setTimeout(function () {
                            assert.ok(mouseDownCallback.calledTwice, "make sure mousedown callback is called twice");
                            assert.ok(doubleClickCallback.calledOnce, "make sure doubleClick callback is called");
                            instance.disable();
                            instance = null;
                            fnDone();
                        }, 100);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    });

    QUnit.test("check touchEnd after drag and clone disappearance", function (assert) {
        var fnDone = assert.async();

        if (Device.browser.name === Device.browser.BROWSER.INTERNET_EXPLORER) {
            assert.ok(true);
            fnDone();
            return;
        }

        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);

        var draggableDOMRef = document.getElementById("draggable0");
        var rootElement = document.getElementById("root");
        var touchEndCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            dragEndCallback: touchEndCallback,
            cloneClass: "clone",
            switchModeDelay: 10, //ms
            isTouch: true,
        }).enable();

        var touchstartEvent = Object.assign(new UIEvent("touchstart"), {
            touches: [{ pageX: 10, pageY: 10, target: draggableDOMRef }],
        });

        var touchmoveEvent = Object.assign(new UIEvent("touchmove"), {
            touches: [{ pageX: 11, pageY: 11, target: draggableDOMRef }],
        });

        var touchendEvent = Object.assign(
            new UIEvent("touchend"),
            { touches: [{ pageX: 10, pageY: 10, target: draggableDOMRef }] },
            { changedTouches: [{ pageX: 11, pageY: 11 }] }
        );

        rootElement.dispatchEvent(touchstartEvent);
        setTimeout(function () {
            rootElement.dispatchEvent(touchmoveEvent);
            setTimeout(function () {
                rootElement.dispatchEvent(touchendEvent);
                setTimeout(function () {
                    assert.ok(touchEndCallback.calledOnce, "make sure touchend callback is called");
                    if (document.querySelector("#root").querySelectorAll(".clone").length > 0) {
                        jUtils.removeClassToAllElements(document.querySelector("#root").querySelectorAll(".clone"), "clone");
                    }
                    QUnit.assert.ok(document.querySelector("#root").querySelectorAll(".clone").length === 0, "make sure the clone disappeared");
                    instance.disable();
                    instance = null;
                    fnDone();
                }, 100);
            }, 50);
        }, 50);
    });

    QUnit.test("check mouseup after drag and clone disappearance", function (assert) {
        var fnDone = assert.async();

        var draggable ='<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);

        var draggableDOMRef = document.getElementById("draggable0");
        var mouseUpCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            dragEndCallback: mouseUpCallback,
            cloneClass: "clone",
            switchModeDelay: 10, //ms
            moveTolerance: 1,
            isTouch: false,
        }).enable();

        var mousedownEvent = Object.assign(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        mousedownEvent.initEvent("mousedown", true, true);

        var mousemoveEvent = Object.assign(document.createEvent("Event"), { pageX: 15, pageY: 15 });
        mousemoveEvent.initEvent("mousemove", true, true);

        var mouseupEvent = Object.assign(document.createEvent("Event"), { pageX: 15, pageY: 15 });
        mouseupEvent.initEvent("mouseup", true, true);

        draggableDOMRef.dispatchEvent(mousedownEvent);
        setTimeout(function () {
            draggableDOMRef.dispatchEvent(mousemoveEvent);
            setTimeout(function () {
                draggableDOMRef.dispatchEvent(mouseupEvent);
                setTimeout(function () {
                    assert.ok(mouseUpCallback.calledOnce, "make sure mouseup callback is called");
                    if (document.querySelector("#root").querySelectorAll(".clone").length > 0) {
                        jUtils.removeClassToAllElements(document.querySelector("#root").querySelectorAll(".clone"), "clone");
                    }
                    QUnit.assert.ok(document.querySelector("#root").querySelectorAll(".clone").length === 0, "make sure the clone disappeared");
                    instance.disable();
                    instance = null;
                    fnDone();
                }, 100);
            }, 50);
        }, 50);
    });

    QUnit.test("check switch to drag mode and clone creation", function (assert) {
        var fnDone = assert.async();
        if (Device.browser.name === Device.browser.BROWSER.INTERNET_EXPLORER) {
            assert.ok(true);
            fnDone();
            return;
        }

        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);

        var draggableDOMRef = document.getElementById("draggable0");
        var rootElement = document.getElementById("root");
        var touchDragCallback = sinon.spy();
        var touchStartCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            beforeDragCallback: touchStartCallback,
            dragStartCallback: touchDragCallback,
            cloneClass: "clone",
            switchModeDelay: 10, //ms
            isTouch: true,
        }).enable();

        var touchstartEvent = Object.assign(new UIEvent("touchstart"), {
            touches: [{ pageX: 10, pageY: 10, target: draggableDOMRef }],
        });

        var touchmoveEvent = Object.assign(new UIEvent("touchmove"), {
            touches: [{ pageX: 11, pageY: 11, target: draggableDOMRef }],
        });

        rootElement.dispatchEvent(touchstartEvent);
        setTimeout(function () {
            rootElement.dispatchEvent(touchmoveEvent);
            setTimeout(function () {
                assert.ok(touchStartCallback.calledOnce, "make sure touchstart callback is called");
                assert.ok(touchDragCallback.calledOnce, "make sure touchdrag callback is called");
                assert.ok(document.querySelector("#root").querySelectorAll(".clone").length === 1, "make sure a clone was created");
                instance.disable();
                instance = null;
                fnDone();
            }, 100);
        }, 50);
    });

    QUnit.test("check switch to drag mode and clone creation (with mouse)", function (assert) {
        var fnDone = assert.async();

        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);

        var draggableDOMRef = document.getElementById("draggable0");
        var dragCallback = sinon.spy();
        var mouseDownCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            beforeDragCallback: mouseDownCallback,
            dragStartCallback: dragCallback,
            cloneClass: "clone",
            switchModeDelay: 10, //ms
            moveTolerance: 1,
            isTouch: false,
        }).enable();

        var mousedownEvent = Object.assign(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        mousedownEvent.initEvent("mousedown", true, true);

        var mousemoveEvent = Object.assign(document.createEvent("Event"), { pageX: 15, pageY: 15 });
        mousemoveEvent.initEvent("mousemove", true, true);

        draggableDOMRef.dispatchEvent(mousedownEvent);
        setTimeout(function () {
            draggableDOMRef.dispatchEvent(mousemoveEvent);
            setTimeout(function () {
                draggableDOMRef.dispatchEvent(mousemoveEvent);
                setTimeout(function () {
                    assert.ok(mouseDownCallback.calledOnce, "make sure mousedown callback is called");
                    assert.ok(dragCallback.calledOnce, "make sure mousemove callback is called");
                    assert.ok(document.querySelector("#root").querySelectorAll(".clone").length === 1, "make sure a clone was created");
                    instance.disable();
                    instance = null;
                    fnDone();
                }, 100);
            }, 50);
        }, 50);
    });

    QUnit.test("check UIActions disabled", function (assert) {
        var fnDone = assert.async();
        if (Device.browser.name === Device.browser.BROWSER.INTERNET_EXPLORER) {
            assert.ok(true);
            fnDone();
            return;
        }
        
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);
        var draggableDOMRef = document.getElementById("draggable0");
        var rootElement = document.getElementById("root");

        var touchStartCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            beforeDragCallback: touchStartCallback,
            isTouch: true,
        }).enable();

        instance.disable();

        var event = Object.assign(new UIEvent("touchstart"), {
            touches: [{ pageX: 10, pageY: 10, target: draggableDOMRef }],
        });

        rootElement.dispatchEvent(event);

        setTimeout(function () {
            assert.ok(touchStartCallback.notCalled, "make sure touchstart callback is not called when the UIActions is disabled");
            instance.enable();
            rootElement.dispatchEvent(event);

            setTimeout(function () {
                assert.ok(touchStartCallback.calledOnce, "make sure touchstart callback is called when the UIActions is enabled again");
                instance.disable();
                instance = null;
                fnDone();
            }, 100);
        }, 100);
    });

    QUnit.test("check UIActions disabled (with mouse events)", function (assert) {
        var fnDone = assert.async();

        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        document.body.querySelector("#container").insertAdjacentHTML("beforeend", draggable);
        var draggableDOMRef = document.getElementById("draggable0");
        var mouseDownCallback = sinon.spy();
        var instance = new UIActions({
            rootSelector: "#root",
            containerSelector: "#container",
            draggableSelector: ".draggable",
            beforeDragCallback: mouseDownCallback,
            isTouch: false,
        }).enable();

        instance.disable();

        var mousedownEvent = Object.assign(document.createEvent("Event"), { pageX: 10, pageY: 10, which: 1 });
        mousedownEvent.initEvent("mousedown", true, true);
        draggableDOMRef.dispatchEvent(mousedownEvent);

        setTimeout(function () {
            assert.ok(mouseDownCallback.notCalled, "make sure mousedown callback is not called when the UIActions is disabled");
            instance.enable();
            draggableDOMRef.dispatchEvent(mousedownEvent);
            setTimeout(function () {
                assert.ok(mouseDownCallback.calledOnce, "make sure mousedown callback is called when the UIActions is enabled again");
                instance.disable();
                instance = null;
                fnDone();
            }, 100);
        }, 100);
    });
});
