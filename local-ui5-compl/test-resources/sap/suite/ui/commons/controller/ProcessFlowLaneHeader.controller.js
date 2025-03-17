sap.ui.define(["sap/ui/qunit/utils/nextUIUpdate"], async function (nextUIUpdate){

    var i = 1, ii;
    var processFlowLaneHeader_ZL_1 = [], processFlowLaneHeader_ZL_2 = [], processFlowLaneHeader_ZL_3 = [],
        processFlowLaneHeader_ZL_4 = [], processFlowLaneHeader_ZL_5 = [], processFlowLaneHeader_ZL_6 = [],
        processFlowLaneHeader_ZL_7 = [], processFlowLaneHeader_ZL_8 = [], processFlowLaneHeader_ZL_9 = [],
        processFlowLaneHeader_ZL_10 = [], processFlowLaneHeader_ZL_11 = [];

    while (i <= 4) {
        ii = i - 1;
        processFlowLaneHeader_ZL_2[ii] = new sap.suite.ui.commons.ProcessFlowLaneHeader({
            laneId: "processFlowLaneHeader_" + i + "_2"
            , iconSrc: "sap-icon://order-status"
            , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 20 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Critical, value: 20 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 10 }]
            , position: 1
            , text: "In Order"
        });

        processFlowLaneHeader_ZL_4[ii] = new sap.suite.ui.commons.ProcessFlowLaneHeader({
            laneId: "processFlowLaneHeader_" + i + "_4"
            , iconSrc: "sap-icon://monitor-payments"
            , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 20 }]
            , position: 2
            , text: "In Delivery"
        });

        processFlowLaneHeader_ZL_6[ii] = new sap.suite.ui.commons.ProcessFlowLaneHeader({
            laneId: "processFlowLaneHeader_" + i + "_6"
            , iconSrc: "sap-icon://retail-store"
            , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 33 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 33 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 33 }]
            , position: 3
            , text: "In Invoice"
        });

        processFlowLaneHeader_ZL_8[ii] = new sap.suite.ui.commons.ProcessFlowLaneHeader({
            laneId: "processFlowLaneHeader_" + i + "_8"
            , iconSrc: "sap-icon://retail-store"
            , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 20 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 10 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 10 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Critical, value: 20 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 40 }]
            , position: 4
            , text: "In Accounting"
        });

        processFlowLaneHeader_ZL_10[ii] = new sap.suite.ui.commons.ProcessFlowLaneHeader({
            laneId: "processFlowLaneHeader_" + i + "_10"
            , iconSrc: "sap-icon://retail-store"
            , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 80 }
                , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 10 }]
            , position: 5
            , text: "In Payment"
        });

        processFlowLaneHeader_ZL_1[ii] = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewStartSymbol();
        processFlowLaneHeader_ZL_3[ii] = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
        processFlowLaneHeader_ZL_5[ii] = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
        processFlowLaneHeader_ZL_7[ii] = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
        processFlowLaneHeader_ZL_9[ii] = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
        processFlowLaneHeader_ZL_11[ii] = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewEndSymbol();

        processFlowLaneHeader_ZL_1[ii].placeAt("lane" + i + "-1");
        processFlowLaneHeader_ZL_2[ii].placeAt("lane" + i + "-2");
        processFlowLaneHeader_ZL_3[ii].placeAt("lane" + i + "-3");
        processFlowLaneHeader_ZL_4[ii].placeAt("lane" + i + "-4");
        processFlowLaneHeader_ZL_5[ii].placeAt("lane" + i + "-5");
        processFlowLaneHeader_ZL_6[ii].placeAt("lane" + i + "-6");
        processFlowLaneHeader_ZL_7[ii].placeAt("lane" + i + "-7");
        processFlowLaneHeader_ZL_8[ii].placeAt("lane" + i + "-8");
        processFlowLaneHeader_ZL_9[ii].placeAt("lane" + i + "-9");
        processFlowLaneHeader_ZL_10[ii].placeAt("lane" + i + "-10");
        processFlowLaneHeader_ZL_11[ii].placeAt("lane" + i + "-11");
        i++;
    }

    /* Single value type */
    var processFlowLaneHeader_5_2 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_5_2"
        , iconSrc: "sap-icon://payment-approval"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 1000 }]
        , position: 1
        , text: "100% Positive"
    });

    var processFlowLaneHeader_5_4 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_5_4"
        , iconSrc: "sap-icon://monitor-payments"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 1000 }]
        , position: 2
        , text: "100% Negative"
    });

    var processFlowLaneHeader_5_6 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_5_6"
        , iconSrc: "sap-icon://monitor-payments"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Critical, value: 1000 }]
        , position: 3
        , text: "100% Critical"
    });

    var processFlowLaneHeader_5_8 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_5_8"
        , iconSrc: "sap-icon://money-bills"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 1000 }]
        , position: 4
        , text: "100% Neutral"
    });

    var processFlowLaneHeader_5_10 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_5_10"
        , iconSrc: "sap-icon://loan"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 1000 }]
        , position: 5
        , text: "100% Planned"
    });

    var processFlowLaneHeader_5_1 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewStartSymbol();
    var processFlowLaneHeader_5_3 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_5_5 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_5_7 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_5_9 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_5_11 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewEndSymbol();

    processFlowLaneHeader_5_1.placeAt("lane5-1");
    processFlowLaneHeader_5_2.placeAt("lane5-2");
    processFlowLaneHeader_5_3.placeAt("lane5-3");
    processFlowLaneHeader_5_4.placeAt("lane5-4");
    processFlowLaneHeader_5_5.placeAt("lane5-5");
    processFlowLaneHeader_5_6.placeAt("lane5-6");
    processFlowLaneHeader_5_7.placeAt("lane5-7");
    processFlowLaneHeader_5_8.placeAt("lane5-8");
    processFlowLaneHeader_5_9.placeAt("lane5-9");
    processFlowLaneHeader_5_10.placeAt("lane5-10");
    processFlowLaneHeader_5_11.placeAt("lane5-11");

    /* Empty, zero and negative values */
    var processFlowLaneHeader_6_2 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_6_2"
        , iconSrc: "sap-icon://payment-approval"
        , state: []
        , position: 1
        , text: "Empty state set"
    });

    var processFlowLaneHeader_6_4 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_6_4"
        , iconSrc: "sap-icon://monitor-payments"
        , position: 2
        , text: "No state set"
    });

    var processFlowLaneHeader_6_6 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_6_6"
        , iconSrc: "sap-icon://money-bills"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 0 }]
        , position: 3
        , text: "Zero state value set"
    });

    var processFlowLaneHeader_6_8 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_6_8"
        , iconSrc: "sap-icon://loan"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: -1000 }]
        , position: 4
        , text: "Negative state value set"
    });

    var processFlowLaneHeader_6_1 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewStartSymbol();
    var processFlowLaneHeader_6_3 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_6_5 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_6_7 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_6_9 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewEndSymbol();

    processFlowLaneHeader_6_1.placeAt("lane6-1");
    processFlowLaneHeader_6_2.placeAt("lane6-2");
    processFlowLaneHeader_6_3.placeAt("lane6-3");
    processFlowLaneHeader_6_4.placeAt("lane6-4");
    processFlowLaneHeader_6_5.placeAt("lane6-5");
    processFlowLaneHeader_6_6.placeAt("lane6-6");
    processFlowLaneHeader_6_7.placeAt("lane6-7");
    processFlowLaneHeader_6_8.placeAt("lane6-8");
    processFlowLaneHeader_6_9.placeAt("lane6-9");

    /* 1, 2, 3, 4, 5 values */
    var processFlowLaneHeader_7_2 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_7_2"
        , iconSrc: "sap-icon://payment-approval"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 10 }]
        , position: 1
        , text: "1 value"
    });

    var processFlowLaneHeader_7_4 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_7_4"
        , iconSrc: "sap-icon://monitor-payments"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 }]
        , position: 2
        , text: "2 values"
    });

    var processFlowLaneHeader_7_6 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_7_6"
        , iconSrc: "sap-icon://money-bills"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 33 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 33 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 33 }]
        , position: 3
        , text: "3 values"
    });

    var processFlowLaneHeader_7_8 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_7_8"
        , iconSrc: "sap-icon://loan"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 25 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 25 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 25 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 25 }]
        , position: 4
        , text: "4 values"
    });

    var processFlowLaneHeader_7_10 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_7_10"
        , iconSrc: "sap-icon://loan"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 20 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 20 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 20 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Neutral, value: 20 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Critical, value: 20 }]
        , position: 5
        , text: "5 values"
    });

    var processFlowLaneHeader_7_1 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewStartSymbol();
    var processFlowLaneHeader_7_3 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_7_5 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_7_7 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_7_9 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_7_11 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewEndSymbol();

    processFlowLaneHeader_7_1.placeAt("lane7-1");
    processFlowLaneHeader_7_2.placeAt("lane7-2");
    processFlowLaneHeader_7_3.placeAt("lane7-3");
    processFlowLaneHeader_7_4.placeAt("lane7-4");
    processFlowLaneHeader_7_5.placeAt("lane7-5");
    processFlowLaneHeader_7_6.placeAt("lane7-6");
    processFlowLaneHeader_7_7.placeAt("lane7-7");
    processFlowLaneHeader_7_8.placeAt("lane7-8");
    processFlowLaneHeader_7_9.placeAt("lane7-9");
    processFlowLaneHeader_7_10.placeAt("lane7-10");
    processFlowLaneHeader_7_11.placeAt("lane7-11");

    /* Small percentage value scenarios */
    var processFlowLaneHeader_8_2 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_8_2"
        , iconSrc: "sap-icon://retail-store"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 1 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 39 }]
        , position: 1
        , text: "1 out of 40"
    });

    var processFlowLaneHeader_8_4 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_8_4"
        , iconSrc: "sap-icon://retail-store"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 1 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 79 }]
        , position: 2
        , text: "1 out of 80"
    });

    var processFlowLaneHeader_8_6 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_8_6"
        , iconSrc: "sap-icon://retail-store"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 1 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 19 }]
        , position: 3
        , text: "1 out of 20"
    });

    var processFlowLaneHeader_8_1 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewStartSymbol();
    var processFlowLaneHeader_8_3 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_8_5 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_8_7 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewEndSymbol();

    processFlowLaneHeader_8_1.placeAt("lane8-1");
    processFlowLaneHeader_8_2.placeAt("lane8-2");
    processFlowLaneHeader_8_3.placeAt("lane8-3");
    processFlowLaneHeader_8_4.placeAt("lane8-4");
    processFlowLaneHeader_8_5.placeAt("lane8-5");
    processFlowLaneHeader_8_6.placeAt("lane8-6");
    processFlowLaneHeader_8_7.placeAt("lane8-7");

    /* Long multi line text */
    var processFlowLaneHeader_1 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_1"
        , iconSrc: "sap-icon://order-status"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 33 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 33 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 33 }]
        , position: 1
        , text: "Lorem Ipsum je fiktívny text, používaný pri návrhu tlačovín a typografie. Lorem Ipsum je štandardným výplňovým textom už od 16. storočia."
    });

    processFlowLaneHeader_1.placeAt("div1");

    var processFlowLaneHeader_2 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_2"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 33 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 33 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Planned, value: 33 }]
        , position: 1
        , text: "No icon"
    });

    processFlowLaneHeader_2.placeAt("div2");

    /* Click handling */
    var processFlowLaneHeader_9_2 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_9_2"
        , iconSrc: "sap-icon://retail-store"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 }]
        , position: 1
        , text: "Click icon"
        , press: function (oEvent) {
            if (oEvent.mParameters.isIconClicked) {
                jQuery.sap.log.info("Node icon clicked: " + oEvent.oSource.getLaneId() + ", node contains text: " + oEvent.oSource.getText());
                jQuery.sap.require("sap.m.MessageToast");
                sap.m.MessageToast.show("Node icon clicked: " + oEvent.oSource.getLaneId() + ", node contains text: " + oEvent.oSource.getText(),
                    { my: sap.ui.core.Popup.Dock.LeftBottom, at: sap.ui.core.Popup.Dock.LeftBottom, of: processFlowLaneHeader_9_2, offset: '-30 100' });
            }
        }
    });

    var processFlowLaneHeader_9_4 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_9_4"
        , iconSrc: "sap-icon://retail-store"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 }]
        , position: 2
        , text: "Click body"
        , press: function (oEvent) {
            if (!oEvent.mParameters.isIconClicked) {
                jQuery.sap.log.info("Node body clicked: " + oEvent.oSource.getLaneId() + ", node contains text: " + oEvent.oSource.getText());
                jQuery.sap.require("sap.m.MessageToast");
                sap.m.MessageToast.show("Node body clicked: " + oEvent.oSource.getLaneId() + ", node contains text: " + oEvent.oSource.getText(),
                    { my: sap.ui.core.Popup.Dock.LeftBottom, at: sap.ui.core.Popup.Dock.LeftBottom, of: processFlowLaneHeader_9_4, offset: '-30 100' });
            }
        }
    });

    var processFlowLaneHeader_9_1 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewStartSymbol();
    var processFlowLaneHeader_9_3 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol();
    var processFlowLaneHeader_9_5 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewEndSymbol();
    processFlowLaneHeader_9_3.attachPress(function (oEvent) {
        if (oEvent.mParameters.isIconClicked) {
            jQuery.sap.log.info("Process icon clicked: " + oEvent.oSource.getLaneId());
            jQuery.sap.require("sap.m.MessageToast");
            sap.m.MessageToast.show("Process icon clicked: " + oEvent.oSource.getLaneId(),
                { my: sap.ui.core.Popup.Dock.LeftBottom, at: sap.ui.core.Popup.Dock.LeftBottom, of: processFlowLaneHeader_9_3, offset: '-90 50' });
        }
    });

    processFlowLaneHeader_9_1.placeAt("lane9-1");
    processFlowLaneHeader_9_2.placeAt("lane9-2");
    processFlowLaneHeader_9_3.placeAt("lane9-3");
    processFlowLaneHeader_9_4.placeAt("lane9-4");
    processFlowLaneHeader_9_5.placeAt("lane9-5");

    /* Header mode */
    var processFlowLaneHeader_10_2 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_10_2"
        , iconSrc: "sap-icon://monitor-payments"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 50 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 50 }]
        , position: 1
        , text: "In Order"
    });
    processFlowLaneHeader_10_2._setHeaderMode(true);

    var processFlowLaneHeader_10_4 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
        laneId: "processFlowLaneHeader_10_4"
        , iconSrc: "sap-icon://monitor-payments"
        , state: [{ state: sap.suite.ui.commons.ProcessFlowNodeState.Positive, value: 30 }
            , { state: sap.suite.ui.commons.ProcessFlowNodeState.Negative, value: 70 }]
        , position: 2
        , text: "In Delivery"
    });
    processFlowLaneHeader_10_4._setHeaderMode(true);

    var processFlowLaneHeader_10_1 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewStartSymbol(true);
    var processFlowLaneHeader_10_3 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewProcessSymbol(true);
    var processFlowLaneHeader_10_5 = sap.suite.ui.commons.ProcessFlowLaneHeader.createNewEndSymbol(true);

    processFlowLaneHeader_10_1.placeAt("lane10-1");
    processFlowLaneHeader_10_2.placeAt("lane10-2");
    processFlowLaneHeader_10_3.placeAt("lane10-3");
    processFlowLaneHeader_10_4.placeAt("lane10-4");
    processFlowLaneHeader_10_5.placeAt("lane10-5");

    await nextUIUpdate();

});