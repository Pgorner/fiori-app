/*global QUnit*/

sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ovp/ui/EasyScanLayout",
    "sap/ovp/ui/CustomData",
    "sap/ui/events/KeyCodes",
    "sap/ovp/cards/jUtils",
    "sap/m/Button",
    "sap/m/VBox",
    "sap/ui/Device"
], function (
    jQuery,
    EasyScanLayout,
    CustomData,
    Keycodes,
    jUtils,
    Button,
    VBox,
    Device
) {
    "use strict";

    QUnit.module("EasyScanLayout", {
        beforeEach: function () {
            if (!this.easyScanLayout) {
                this.easyScanLayout = new EasyScanLayout();
            }
        },
        afterEach: function () { }
    });

    QUnit.test("Constructor Test", function (assert) {
        assert.ok(this.easyScanLayout.columnCount === 1, "initial column count is 1");
    });

    QUnit.test("5 Resolutions Media Listeners Test", function (assert) {
        //IE version 9 or less doesn't support the current test
        if (!(Device.browser.msie && Device.browser.version > 9)) {
            assert.ok("IE version 9");
            return;
        }

        var columnResolutionList = [
            { minWidth: 0, styleClass: "columns-block", columnCount: 1 },
            { minWidth: 768, styleClass: "columns-narrow", columnCount: 2 },
            { minWidth: 900, styleClass: "columns-wide", columnCount: 2 },
            { minWidth: 1024, styleClass: "columns-narrow", columnCount: 3 },
            { minWidth: 1440, styleClass: "columns-wide", columnCount: 3 },
        ];
        var mediaListeners = this.easyScanLayout.initMediaListeners(columnResolutionList);

        assert.ok(/(max-width: *767px)/.test(mediaListeners[0].media), "Test 1 bounds top");
        assert.ok(/(min-width: *0px)/.test(mediaListeners[0].media), "Test 1 bounds bottom");
        assert.ok(mediaListeners[0].media.indexOf("and") !== -1, "Test lower 1 condition");
        assert.ok(/(max-width: *899px)/.test(mediaListeners[1].media), "Test 2 bounds top");
        assert.ok(/(min-width: *768px)/.test(mediaListeners[1].media), "Test 2 bounds bottom");
        assert.ok(mediaListeners[1].media.indexOf("and") !== -1, "Test lower 2 condition");
        assert.ok(/(max-width: *1023px)/.test(mediaListeners[2].media), "Test 3 bounds top");
        assert.ok(/(min-width: *900px)/.test(mediaListeners[2].media), "Test 3 bounds bottom");
        assert.ok(mediaListeners[2].media.indexOf("and") !== -1, "Test lower 3 condition");
        assert.ok(/(max-width: *1439px)/.test(mediaListeners[3].media), "Test 4 bounds top");
        assert.ok(/(min-width: *1024px)/.test(mediaListeners[3].media), "Test 4 bounds bottom");
        assert.ok(mediaListeners[3].media.indexOf("and") !== -1, "Test lower 4 condition");
        assert.ok(/(min-width: *1440px)/.test(mediaListeners[4].media), "Test 5 bounds bottom");
    });

    QUnit.test("columnResolutionList Test", function (assert) {
        var columnResolutionList = this.easyScanLayout.getColumnResolutionList();
        assert.ok(columnResolutionList.length === 16, "Test columnResolutionList count");
    });

    QUnit.test("ResizeHandler Test", function (assert) {
        var columnResolutionList = [];
        var resizeHandlerId = this.easyScanLayout.initResizeHandler(columnResolutionList);
        assert.ok(resizeHandlerId.indexOf("rs") !== -1, "Test ResizeHandler Id");
    });

    QUnit.test("1 Resolutions Media Listeners Test", function (assert) {
        //IE version 9 or less doesn't support the current test
        if (!(Device.browser.msie && Device.browser.version > 9)) {
            assert.ok("IE version 9");
            return;
        }
        var columnResolutionList = [{ minWidth: 768, styleClass: "columns-narrow", columnCount: 2 }];
        var mediaListeners = this.easyScanLayout.initMediaListeners(columnResolutionList);
        assert.ok(/(min-width: *768px)/.test(mediaListeners[0].media), "Test max bounds");
    });

    QUnit.test("0 Resolutions Media Listeners Test", function (assert) {
        var columnResolutionList = [];
        var mediaListeners = this.easyScanLayout.initMediaListeners(columnResolutionList);
        assert.ok(mediaListeners.length === 0, "Test no bounds");
    });

    QUnit.test("EasyScan Layout - disable drag and drop", function (assert) {
        var easyScan = new EasyScanLayout({ dragAndDropEnabled: false });
        easyScan.onAfterRendering();
        assert.ok(easyScan.layoutDragAndDrop === undefined);
    });

    QUnit.test("EasyScan Layout - Key Handle", function (assert) {
        var btn = new Button("btnId1");
        var easyScan = new EasyScanLayout();
        easyScan.addAggregation("content", btn);
        document.body.insertAdjacentHTML("beforeend", '<div id="testContainer">');
        var testContainer = document.querySelector("#testContainer");
        var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);
        var fnDone = assert.async();

        easyScan.onAfterRendering = function () {
            easyScanAfterRender();
            var keyboardNavigation = easyScan.keyboardNavigation;

            var keysHandlerStub = sinon.stub(keyboardNavigation, "tabButtonHandler");
            var event = { keyCode: 9 }; //TAB
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "tabButtonHandler was called once after pressing tab");

            keysHandlerStub = sinon.stub(keyboardNavigation, "shiftTabButtonHandler");
            event.shiftKey = true;
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "shiftTabButtonHandler was called once after pressing shift + tab");

            event.shiftKey = false;

            keysHandlerStub = sinon.stub(keyboardNavigation, "f7Handler");
            event.keyCode = 118; //F7
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "f7Handler was called once after pressing F7");

            keysHandlerStub = sinon.stub(keyboardNavigation, "arrowUpDownHandler");
            event.keyCode = 38; //Arrow UP
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "arrowUpDownHandler was called once after pressing arrow up");

            event.keyCode = 40; //Arrow DOWN
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledTwice, "arrowUpDownHandler was called once after pressing arrow down");

            keysHandlerStub = sinon.stub(keyboardNavigation, "ctrlArrowHandler");
            event.ctrlKey = true;
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "ctrlArrowHandler was called once after pressing arrow down + ctrl");

            event.keyCode = 38; //Arrow UP
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledTwice, "ctrlArrowHandler was called once after pressing arrow up + ctrl");

            event.keyCode = 37; //Arrow LEFT
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledThrice, "ctrlArrowHandler was called once after pressing arrow left + ctrl");

            event.keyCode = 39; //Arrow RIGHT
            keyboardNavigation.keydownHandler(event);
            sinon.assert.callCount(
                keysHandlerStub,
                4,
                "ctrlArrowHandler was called once after pressing arrow right + ctrl"
            );

            event.ctrlKey = false;

            keysHandlerStub = sinon.stub(keyboardNavigation, "arrowRightLeftHandler");
            event.keyCode = 39; //Arrow RIGHT
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "arrowRightLeftHandler was called once after pressing arrow right");

            event.keyCode = 37; //Arrow LEFT
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledTwice, "arrowRightLeftHandler was called once after pressing arrow left");

            keysHandlerStub = sinon.stub(keyboardNavigation, "altPageUpAndHomeHandler");
            event.keyCode = 36; //Home
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "altPageUpAndHomeHandler was called once after pressing home button");
            event.keyCode = 33; //Page Up
            event.altKey = true;
            assert.ok(keysHandlerStub.calledOnce, "altPageUpAndHomeHandler was called once after pressing pageup button");

            keysHandlerStub = sinon.stub(keyboardNavigation, "altPageDownAndEndHandler");
            event.keyCode = 35; //End
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "altPageDownAndEndHandler was called once after pressing end button");
            event.keyCode = 34; //Page Down
            event.altKey = true;
            assert.ok(
                keysHandlerStub.calledOnce,
                "altPageDownAndEndHandler was called once after pressing pagedown button"
            );

            event.altKey = false;

            keysHandlerStub = sinon.stub(keyboardNavigation, "ctrlHomeHandler");
            event.keyCode = 36; //Home
            event.ctrlKey = true;
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "ctrlHomeHandler was called once after pressing ctrl + home");

            keysHandlerStub = sinon.stub(keyboardNavigation, "ctrlEndHandler");
            event.keyCode = 35; //End
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "ctrlEndHandler was called once after pressing ctrl + end");

            event.ctrlKey = false;

            keysHandlerStub = sinon.stub(keyboardNavigation, "pageUpDownHandler");
            event.keyCode = 33; //Page Up
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "pageUpDownHandler was called once after pressing page up");

            event.keyCode = 34; //Page Down
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledTwice, "pageUpDownHandler was called once after pressing page down");

            keysHandlerStub = sinon.stub(keyboardNavigation, "spacebarHandler");
            event.keyCode = 32; //Spacebar
            keyboardNavigation.keyupHandler(event);
            assert.ok(keysHandlerStub.calledOnce, "spacebarHandler was called once after pressing spacebar");

            event.keyCode = 13; //enter
            keyboardNavigation.keydownHandler(event);
            assert.ok(keysHandlerStub.calledTwice, "spacebarHandler was called once after pressing enter");

            easyScan.destroy();
            fnDone();
        };
        easyScan.placeAt("testContainer");
    });

    QUnit.test("EasyScan Layout - Ctrl-Arrow D&D Handle", function (assert) {
        var btn = new Button("btnId1");
        var btn25 = new Button("btnId25");
        var easyScan = new EasyScanLayout();
        easyScan.addAggregation("content", btn);
        easyScan.addAggregation("content", btn25);
        document.body.insertAdjacentHTML("beforeend", '<div id="testContainer">');
        var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);
        var fnDone = assert.async();

        easyScan.onAfterRendering = function () {
            easyScanAfterRender();
            var keyboardNavigation = easyScan.keyboardNavigation;
            var event = { keyCode: null, ctrlKey: true, preventDefault: function () { } };
            event.preventDefault = function () { };

            event.keyCode = Keycodes.ARROW_RIGHT;
            keyboardNavigation.keydownHandler(event);
            event.keyCode = Keycodes.END;
            keyboardNavigation.keydownHandler(event);
            assert.ok(
                easyScan.$().find(".easyScanLayoutItemWrapper:first").is(btn.$().parent()),
                "First item should not move"
            );
            assert.ok(setTimeout(function () {
                jUtils.getIndex(document.activeElement) == 1;
            }, 500), "Focus stay on second item"
            );

            event.ctrlKey = true;
            event.keyCode = Keycodes.ARROW_LEFT;
            keyboardNavigation.keydownHandler(event);
            assert.ok(
                setTimeout(function () {
                    btn25.$().parent().hasClass("dragHovered");
                }, 500),
                "Second item is marked as dragged"
            );
            assert.ok(
                setTimeout(function () {
                    jUtils.getIndex(document.activeElement) == 0;
                }, 500),
                "Focus move to first item"
            );

            event.ctrlKey = false;
            event.keyCode = Keycodes.CONTROL;
            keyboardNavigation.keyupHandler(event);
            assert.ok(
                setTimeout(function () {
                    easyScan.$().find(".easyScanLayoutItemWrapper:first").is(btn25.$().parent());
                }, 500),
                "Second item was moved to first position"
            );
            assert.ok(
                setTimeout(function () {
                    jUtils.getIndex(document.activeElement) == 0;
                }, 500),
                "Focus is on first item"
            );

            assert.ok(!btn25.$().parent().hasClass("dragHovered"), "Item is not marked as dragged");
            easyScan.destroy();
            fnDone();
        };
        easyScan.placeAt("testContainer");
    });

    // TODO : Fix this test case
    // QUnit.test("EasyScan Layout - F6,F7 Handle", function (assert) {
    //     var btn = new Button("btnId1");
    //     btn.addCustomData(
    //         new CustomData({
    //             key: "tabindex",
    //             value: "0",
    //             writeToDom: true,
    //         })
    //     );

    //     var vBox = new VBox({ items: [btn] });
    //     var easyScan = new EasyScanLayout();
    //     easyScan.removeStyleClass("columns-blank");
    //     easyScan.addStyleClass("columns-block");
    //     easyScan.columnStyle = "columns-block";
    //     easyScan.addAggregation("content", vBox);
    //     document.body.insertAdjacentHTML("beforeend", '<div id="testContainer">');
    //     var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);
    //     var fnDone = assert.async();
    //     easyScan.onAfterRendering = function () {
    //         easyScanAfterRender();
    //         var keyboardNavigation = easyScan.keyboardNavigation;
    //         var event = { keyCode: null, preventDefault: function () { } };
    //         event.preventDefault = function () { };
            
    //         vBox.$().parent().focus();
    //         event.keyCode = Keycodes.F7;
    //         event.shiftKey = false;
    //         keyboardNavigation.keydownHandler(event);
    //         assert.ok(jQuery(document.activeElement).is(btn.$()), "focus on internal button");
    //         keyboardNavigation.keydownHandler(event);
    //         assert.ok(jQuery(document.activeElement).is(vBox.$().parent()), "focus on item");

    //         btn.$().focus();
    //         keyboardNavigation._ignoreSelfFocus = true;
    //         keyboardNavigation.layoutFocusHandler();
    //         assert.ok(jQuery(document.activeElement).is(btn.$()), "focus does not changed");
    //         keyboardNavigation.layoutFocusHandler();
    //         assert.ok(jQuery(document.activeElement).is(vBox.$().parent()), "focus changed to first item");

    //         keyboardNavigation.destroy();
    //         assert.ok(!keyboardNavigation.jqElement, "keyboardNavigation jqElement deleted");
    //         assert.ok(!keyboardNavigation.jqElement, "keyboardNavigation easyScanLayout deleted");
    //         easyScan.destroy();
    //         fnDone();
    //     };
    //     easyScan.placeAt("testContainer");
    // });

    QUnit.test("EasyScan Layout - tabIndex check", function (assert) {
        var btn1 = new Button("btnId1");
        var btn2 = new Button("btnId2");
        var btn3 = new Button("btnId3");
        var easyScan = new EasyScanLayout();
        easyScan.addAggregation("content", btn1);
        easyScan.addAggregation("content", btn2);
        easyScan.addAggregation("content", btn3);
        document.body.insertAdjacentHTML("beforeend", '<div id="testContainer">');
        var testContainer = document.querySelector("#testContainer");
        var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);

        var fnDone = assert.async();
        easyScan.onAfterRendering = function () {
            easyScanAfterRender();
            var easyScanItems = document.querySelectorAll(".easyScanLayoutItemWrapper");
            assert.ok(
                easyScanItems[0].getAttribute("tabindex") == 0,
                "tabindex value of the first item in the layout is '0'"
            );

            //all other "tabindex" attributes value is "-1"
            assert.ok(
                easyScanItems[1].getAttribute("tabindex") == -1,
                "tabindex value of the second item in the layout is '-1'"
            );
            assert.ok(
                easyScanItems[2].getAttribute("tabindex") == -1,
                "tabindex value of the third item in the layout is '-1'"
            );
            easyScan.destroy();
            fnDone();
        };
        easyScan.placeAt("testContainer");
    });

    QUnit.test("EasyScan Layout - KBN focus change check", function (assert) {
        var btn1 = new Button("btnId1");
        btn1.addCustomData(new CustomData({ key: "tabindex", value: "0", writeToDom: true }));

        var vbox1 = new VBox({ items: [btn1] });
        var vbox2 = new VBox({ items: [new Button("btnId2")] });
        var vbox3 = new VBox({ items: [new Button("btnId3")] });
        var vbox4 = new VBox({ items: [new Button("btnId4")] });
        var vbox5 = new VBox({ items: [new Button("btnId5")] });

        var easyScan = new EasyScanLayout();
        easyScan.removeStyleClass("columns-blank");
        easyScan.addStyleClass("columns-block");
        easyScan.columnStyle = "columns-block";
        easyScan.addAggregation("content", vbox1);
        easyScan.addAggregation("content", vbox2);
        easyScan.addAggregation("content", vbox3);
        easyScan.addAggregation("content", vbox4);
        easyScan.addAggregation("content", vbox5);
        document.body.insertAdjacentHTML("beforeend", '<div id="testContainer">');
        var testContainer = document.querySelector("#testContainer");

        var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);
        var fnDone = assert.async();

        easyScan.onAfterRendering = function () {
            easyScanAfterRender();
            var keyboardNavigation = easyScan.keyboardNavigation;
            var easyScanItems = document.querySelectorAll(".easyScanLayoutItemWrapper");

            //Create and trigger focus on qunit
            var focusEvent = jQuery.Event("focus"),
                jqItem = jQuery(easyScanItems[0]);
            jqItem.trigger(focusEvent);

            var focusedElement = document.activeElement;

            var event = { keyCode: 35 }; //END
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            setTimeout(function () {
                assert.ok(document.activeElement != focusedElement, "End button KBN");
            }, 0);

            event = { keyCode: 36 }; //Home
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            assert.ok(document.activeElement == focusedElement, "Home button KBN");

            event = { keyCode: 9 }; //TAB
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            assert.ok(document.activeElement == focusedElement, "TAB button KBN");

            event = { keyCode: 40 }; //Down
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            setTimeout(function () {
                assert.ok(document.activeElement != focusedElement, "Down button KBN");
            }, 0);

            event = { keyCode: 38 }; //Up
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            assert.ok(document.activeElement == focusedElement, "UP button KBN");

            event = { keyCode: 34 }; //PageDown
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            setTimeout(function () {
                assert.ok(document.activeElement != focusedElement, "Page Down button KBN");
            }, 0);

            event = { keyCode: 33 }; //pageUp
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            assert.ok(document.activeElement == focusedElement, "Page Up button KBN");

            this.refreshColumnCount(2, this.getContent());
            focusedElement.focus();

            event = { keyCode: 39 }; //Right
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            setTimeout(function () {
                assert.ok(document.activeElement != focusedElement, "Right button KBN");
            }, 0);

            event = { keyCode: 37 }; //Left
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            assert.ok(document.activeElement == focusedElement, "Left  button KBN");

            event = { keyCode: 35, ctrlKey: true }; // CTRL End
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            setTimeout(function () {
                assert.ok(document.activeElement != focusedElement, "Ctrl End button KBN");
            }, 0);

            event = { keyCode: 36, ctrlKey: true }; // CTRL Home
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            assert.ok(document.activeElement == focusedElement, "Ctrl Home button KBN");

            event = { keyCode: 34, altKey: true }; //CTRL PageDown
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            setTimeout(function () {
                assert.ok(document.activeElement != focusedElement, "alt pageDown button KBN");
            }, 0);

            event = { keyCode: 33, altKey: true }; // CTRL pageUp
            event.preventDefault = function () { };
            keyboardNavigation.keydownHandler(event);
            assert.ok(document.activeElement == focusedElement, "alt pageUp button KBN");
            easyScan.destroy();
            fnDone();
        };
        easyScan.placeAt("testContainer");
    });
});
