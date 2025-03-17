/*global QUnit */

sap.ui.define([
    "./CommonUtil",
    "sap/base/i18n/Formatting",
    "sap/ui/qunit/utils/createAndAppendDiv",
    "../js/CalendarWeekData",
    "sap/base/i18n/date/CalendarType",
    "sap/base/i18n/date/CalendarWeekNumbering",
    "sap/ui/core/date/Japanese",
    "sap/ui/core/date/Islamic",
    "sap/viz/ui5/controls/Popover"
], function (CommonUtil, Formatting, createAndAppendDiv, vizFrameData, CalendarType, CalendarWeekNumbering, Japanese, Islamic, Popover) {
    "use strict";

    createAndAppendDiv("content").style = `width: ${window.screen.width - 16}+'px'; height: 800px`;

    var setCalendarType = Formatting.setCalendarType;
    var setCalendarWeekNumbering = Formatting.setCalendarWeekNumbering;
    var getCalendarType = Formatting.getCalendarType;
    var getCalendarWeekNumbering = Formatting.getCalendarWeekNumbering;

    var calendarTypes = [
        'Gregorian',
        'Japanese',
        'Islamic',
        'Buddhist',
        'Persian',
    ];
    var weekNumbers = [
        'WesternTraditional',
        'ISO_8601',
        'MiddleEastern',
    ];

    var chartTypes = {
        oModel: [
            'timeseries_line',
            'timeseries_scatter',
            'timeseries_bubble',
        ],
        oModel2: [
            'timeseries_combination',
            'dual_timeseries_combination'
        ]
    };

    var patternList = [
        ['year'],
        ['month'],
        ['day'],
        ['week'],
        ['year', 'week'],
        ['year', 'month', 'week'],
        ['year', 'month', 'day'],
        ['year', 'month'],
        ['month', 'day']
        ['year', 'quarter']
    ];

    QUnit.module("CVOM Charts Support of Calendar weeks");

    function getUpLabel() {
        return document.querySelector("#content .v-label.v-morphable-label.viz-axis-label .v-label-upperLevel").textContent;
    }

    function getBaseLabel() {
        return document.querySelector("#content .v-label.v-morphable-label.viz-axis-label .v-label-baseLevel").textContent;
    }

    QUnit.test("Calendar type and Week Number in Time Series Line Chart", async function (assert) {
        var done = assert.async();
        var oVizframe = vizFrameData.createTimeLineChart({ oModel: 'line' });

        function initRender(oEvent) {
            assert.equal(getUpLabel(), '2021');
            assert.equal(getBaseLabel(), 'CW 01');
            oVizframe.detachRenderComplete(initRender);
            setCalendarType(CalendarType.Japanese);
            oVizframe.attachRenderComplete(null, setJapaneseType);
        }
        oVizframe.attachRenderComplete(null, initRender);

        function setJapaneseType(oEvent) {
            assert.equal(getUpLabel(), '2021');
            assert.equal(getBaseLabel(), 'CW 01');
            oVizframe.detachRenderComplete(setJapaneseType);
            setCalendarWeekNumbering(CalendarWeekNumbering.ISO_8601);
            oVizframe.attachRenderComplete(null, setISO_8601Numbering);
        }

        function setISO_8601Numbering(oEvent) {
            assert.equal(getUpLabel(), '2020');
            assert.equal(getBaseLabel(), 'CW 53');
            oVizframe.detachRenderComplete(setISO_8601Numbering);
            setCalendarWeekNumbering(CalendarWeekNumbering.MiddleEastern);
            oVizframe.attachRenderComplete(null, setMiddleEasternNumbering);
        }

        function setMiddleEasternNumbering(oEvent) {
            assert.equal(getUpLabel(), '2021');
            assert.equal(getBaseLabel(), 'CW 01');
            oVizframe.detachRenderComplete(setMiddleEasternNumbering);
            setCalendarType(CalendarType.Default);
            setCalendarWeekNumbering(CalendarWeekNumbering.Default);
            CommonUtil.destroyVizFrame(oVizframe);
            done();
        }
    });

    QUnit.test("Calendar type and Week Number in Time Series Column Chart", async function (assert) {
        var done = assert.async();
        var oVizframe = vizFrameData.createTimeColumnChart({ oModel: 'column' });

        function initRender(oEvent) {
            assert.equal(getUpLabel(), '2020');
            assert.equal(getBaseLabel(), 'CW 52');
            oVizframe.detachRenderComplete(initRender);
            setCalendarType(CalendarType.Japanese);
            oVizframe.attachRenderComplete(null, setJapaneseType);
        }
        oVizframe.attachRenderComplete(null, initRender);

        function setJapaneseType(oEvent) {
            assert.equal(getUpLabel(), '2020');
            assert.equal(getBaseLabel(), 'CW 52');
            oVizframe.detachRenderComplete(setJapaneseType);
            setCalendarWeekNumbering(CalendarWeekNumbering.ISO_8601);
            oVizframe.attachRenderComplete(null, setISO_8601Numbering);
        }

        function setISO_8601Numbering(oEvent) {
            assert.equal(getUpLabel(), '2020');
            assert.equal(getBaseLabel(), 'CW 52');
            oVizframe.detachRenderComplete(setISO_8601Numbering);
            setCalendarWeekNumbering(CalendarWeekNumbering.MiddleEastern);
            oVizframe.attachRenderComplete(null, setMiddleEasternNumbering);
        }

        function setMiddleEasternNumbering(oEvent) {
            assert.equal(getUpLabel(), '2021');
            assert.equal(getBaseLabel(), 'CW 01');
            oVizframe.detachRenderComplete(setMiddleEasternNumbering);
            setCalendarType(CalendarType.Default);
            setCalendarWeekNumbering(CalendarWeekNumbering.Default);
            CommonUtil.destroyVizFrame(oVizframe);
            done();
        }
    });

    QUnit.test("UTC setting test", async function (assert) {
        var done = assert.async();
        var oVizframe = vizFrameData.createTimeColumnChart({ oModel: 'utc' });
        setCalendarWeekNumbering(CalendarWeekNumbering.ISO_8601);

        function initRender(oEvent) {
            assert.equal(getUpLabel(), '2020');
            assert.equal(getBaseLabel(), 'CW 53');
            oVizframe.detachRenderComplete(initRender);
            oVizframe.setVizProperties({ general: { showAsUTC: true } });
            oVizframe.attachRenderComplete(null, reSetUTC);
        }
        oVizframe.attachRenderComplete(null, initRender);

        function reSetUTC(oEvent) {
            assert.equal(getUpLabel(), '2020');
            assert.equal(getBaseLabel(), 'CW 52');
            oVizframe.detachRenderComplete(reSetUTC);
            oVizframe.setVizProperties({ general: { showAsUTC: false } });
            oVizframe.attachRenderComplete(null, setUTCAsFalse);
        }

        function setUTCAsFalse(oEvent) {
            assert.equal(getUpLabel(), '2020');
            assert.equal(getBaseLabel(), 'CW 53');
            oVizframe.detachRenderComplete(setUTCAsFalse);
            setCalendarWeekNumbering(CalendarWeekNumbering.Default);
            CommonUtil.destroyVizFrame(oVizframe);
            done();
        }
    });
    QUnit.test("Pattern setting test", async function (assert) {
        var done = assert.async();
        var oVizframe = vizFrameData.createTimeColumnChart({ oModel: 'pattern' });
        setCalendarType(CalendarType.Islamic);
        oVizframe.setVizProperties({ timeAxis: { levels: ['year'] } });

        function initRender(oEvent) {
            assert.equal(getBaseLabel(), '1442');
            oVizframe.detachRenderComplete(initRender);
            oVizframe.setVizProperties({ timeAxis: { levels: ['month'] } });
            setCalendarType(CalendarType.Islamic);
            oVizframe.attachRenderComplete(null, setMonth);
        }
        oVizframe.attachRenderComplete(null, initRender);

        function setMonth(oEvent) {
            assert.equal(getBaseLabel(), 'Jan');
            oVizframe.detachRenderComplete(setMonth);
            oVizframe.setVizProperties({ timeAxis: { levels: ['day'] } });
            oVizframe.attachRenderComplete(null, setDay);
        }

        function setDay(oEvent) {
            assert.equal(getBaseLabel(), 'Jan 04');
            oVizframe.detachRenderComplete(setDay);
            oVizframe.setVizProperties({ timeAxis: { levels: ['week'] } });
            oVizframe.attachRenderComplete(null, setWeek);
        }

        function setWeek(oEvent) {
            assert.equal(getBaseLabel(), 'CW 01');
            oVizframe.detachRenderComplete(setWeek);
            oVizframe.setVizProperties({ timeAxis: { levels: ['year', 'month', 'week'] } });
            oVizframe.attachRenderComplete(null, setYMW);
        }

        function setYMW(oEvent) {
            assert.equal(getUpLabel(), 'Jan 2021');
            assert.equal(getBaseLabel(), 'CW 01');
            oVizframe.detachRenderComplete(setYMW);
            oVizframe.setVizProperties({ timeAxis: { levels: ['year', 'month', 'day'] } });
            oVizframe.attachRenderComplete(null, setYMD);
        }

        function setYMD(oEvent) {
            assert.equal(getUpLabel(), '1442');
            assert.equal(getBaseLabel(), 'Jan 04');
            oVizframe.detachRenderComplete(setYMD);
            oVizframe.setVizProperties({ timeAxis: { levels: ['year', 'month'] } });
            oVizframe.attachRenderComplete(null, setYM);
        }

        function setYM(oEvent) {
            assert.equal(getUpLabel(), '1442');
            assert.equal(getBaseLabel(), 'Jan');
            oVizframe.detachRenderComplete(setYM);
            oVizframe.setVizProperties({ timeAxis: { levels: ['month', 'day'] } });
            oVizframe.attachRenderComplete(null, setMD);
        }

        function setMD(oEvent) {
            assert.equal(getBaseLabel(), 'Jan 04');
            oVizframe.detachRenderComplete(setMD);
            oVizframe.setVizProperties({ timeAxis: { levels: ['year', 'quarter'] } });
            oVizframe.attachRenderComplete(null, setYQ);
        }

        function setYQ(oEvent) {
            assert.equal(getUpLabel(), '1442');
            assert.equal(getBaseLabel(), 'Q1');
            oVizframe.detachRenderComplete(setYQ);
            oVizframe.setVizProperties({ timeAxis: { levels: ['year', 'week'] } });
            CommonUtil.destroyVizFrame(oVizframe);
            done();
        }
    });

    var EventTestUtil = {
        selectData: function (index) {
            console.log(d3.selectAll('#content').selectAll('.v-datapoint')[0][index]);
            var element = d3.selectAll('#content').selectAll('.v-datapoint')[0][index],
                o = element.getBoundingClientRect(),
                position = {
                    x: (o.left + o.right) / 2,
                    y: (o.top + o.bottom) / 2
                },
                mouseInit = {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: o.x,
                    clientY: o.y,
                };
            var mousedown = document.createEvent("MouseEvent");
            mousedown.initMouseEvent('mousedown', true, true, window, 0,
                undefined, undefined, o.x, o.y,
                undefined, undefined, undefined, undefined,
                0, null);
            element.dispatchEvent(mousedown);
            var mouseup = document.createEvent("MouseEvent");
            mouseup.initMouseEvent('mouseup', true, true, window, 0,
                undefined, undefined, o.x, o.y,
                undefined, undefined, undefined, undefined,
                0, null);
            element.dispatchEvent(mouseup);
        }
    };

    QUnit.test("check Time format with Popover's formatString.", function (assert) {
        assert.expect(3);
        var done = assert.async();
        var oVizframe = vizFrameData.createTimeLineChart({ oModel: 'popover' });
        var chartPopover = new Popover({});
        chartPopover.connect(oVizframe.getVizUid());

        chartPopover.setFormatString({ 'Date': 'yyyy-mm-dd' });
        var resPop = chartPopover._Popover._oPopover;

        function initRender(oEvent) {
            assert.ok(true, 'Time line chart is renderComplete.');
            oVizframe.detachRenderComplete(initRender);
            EventTestUtil.selectData(0);
            resPop.attachAfterOpen(checkTimeFormat);
        }
        oVizframe.attachRenderComplete(null, initRender);

        function checkTimeFormat(oEvent) {
            assert.equal(this.getPlacement(), 'VerticalPreferredTop', 'Popover should be opened with VerticalPreferredTop.');
            assert.equal(document.querySelector('.viz-controls-chartPopover-measure-labels .sapMObjectNumberText').innerText, "2021-01-04", "Follows chart's tooltip format");
            chartPopover.destroy();
            oVizframe.destroy();
            done();
        }
    });
});
