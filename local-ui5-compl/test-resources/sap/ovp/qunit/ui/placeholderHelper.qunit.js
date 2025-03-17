/*global QUnit*/

sap.ui.define([
    "sap/ovp/placeholder/placeholderHelper",
    "sap/m/NavContainer"
], function (
    placeholderHelper, 
    NavContainer
) {
    "use strict";

    QUnit.test("Test isPlaceHolderEnabled method", function (assert) {
        var oResult = placeholderHelper.isPlaceHolderEnabled();
        assert.equal(oResult, true, "isPlaceHolderEnabled executed.");
    });

    QUnit.test("Test showPlaceholder and hideplaceholder", function (assert) {
        placeholderHelper.isPlaceHolderEnabled = function () {
            return true;
        };
        var oNavContainer = new NavContainer();
        assert.equal(
            placeholderHelper.hidePlaceholderNeeded(),
            undefined,
            "placeholder is not yet loaded and hideplaceholder is not needed."
        );
        placeholderHelper.showPlaceholder(oNavContainer);
        assert.equal(placeholderHelper.hidePlaceholderNeeded(), true, "placeholder is loaded and hideplaceholder is needed.");
        placeholderHelper.hidePlaceholder();
        assert.equal(
            placeholderHelper.hidePlaceholderNeeded(),
            false,
            "placeholder is hidden now, and hideplaceholder is not needed."
        );
    });

    QUnit.test("Test getPlaceholderInfo method", function (assert) {
        var oResult = placeholderHelper.getPlaceholderInfo();
        assert.equal(typeof oResult, "object", "placeholder is of object type.");
        assert.equal(oResult.bShow, false, "getPlaceholderInfo executed.");
    });
});
