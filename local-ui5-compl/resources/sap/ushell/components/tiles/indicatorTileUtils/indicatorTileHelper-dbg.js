// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Indicator Tile Helper
 * This SAP Smart Business module is only used for SAP Business Suite hub deployments.
 *
 * @deprecated since 1.96
 */
sap.ui.define([], function () {
    "use strict";

    var IndicatorTileHelper = function (tile) {
        this.tile = tile;
    };

    IndicatorTileHelper.prototype.setErrorState = function () {
        this.getTile().setState(sap.suite.ui.commons.LoadState.Failed);
    };

    IndicatorTileHelper.prototype.setLoadingState = function () {
        this.getTile().setState(sap.suite.ui.commons.LoadState.Loading);
    };

    IndicatorTileHelper.prototype.setLoadedState = function () {
        this.getTile().setState(sap.suite.ui.commons.LoadState.Loaded);
    };

    IndicatorTileHelper.prototype.setTrendDown = function () {
        this.getTile().setIndicator(sap.suite.ui.commons.DeviationIndicator.Down);
    };

    IndicatorTileHelper.prototype.setTrendUp = function () {
        this.getTile().setIndicator(sap.suite.ui.commons.DeviationIndicator.Up);
    };

    IndicatorTileHelper.prototype.setTrendNeutral = function () {
        this.getTile().setIndicator(sap.suite.ui.commons.DeviationIndicator.None);
    };

    IndicatorTileHelper.prototype.setThresholdGood = function () {
    };

    IndicatorTileHelper.prototype.setThresholdBad = function () {
    };

    IndicatorTileHelper.prototype.setThresholdCritical = function () {
    };

    IndicatorTileHelper.prototype.setThresholdNeutral = function () {
    };

    IndicatorTileHelper.prototype.calculateThreshold = function (/*actualValue, variantValue, improvementDirection*/) {
    };

    IndicatorTileHelper.prototype.setTile = function (tile) {
        this.tile = tile;
    };

    IndicatorTileHelper.prototype.getTile = function () {
        return this.tile;
    };

    return IndicatorTileHelper;
});
