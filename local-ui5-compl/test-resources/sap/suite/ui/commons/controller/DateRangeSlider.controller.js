sap.ui.define(["sap/ui/core/Element"], function (Element) {

    function handleChange(oEvent) {

        var dStartDate = oEvent.getParameter("value");
        var dEndDate = oEvent.getParameter("value2");
        oStartDateChangeValueField.setText(dStartDate.toString());
        oEndDateChangeValueField.setText(dEndDate.toString());
    }

    function handleLiveChange(oEvent) {

        var dStartDate = oEvent.getParameter("value");
        var dEndDate = oEvent.getParameter("value2");
        oStartDateLiveChangeValueField.setText(dStartDate.toString());
        oEndDateLiveChangeValueField.setText(dEndDate.toString());
    }

    function handleShowHideChange(oEvent) {

        oDateRangeSlider.setShowBubbles(oEvent.getParameter("checked"));
    }

    function handleShowHideStepLabels(oEvent) {

        oDateRangeSlider.setStepLabels(oEvent.getParameter("checked"));
    }

    function handleMinChange(oEvent) {

        var dMin = Element.getElementById("minDatePicker").getValue();
        if (dMin && 0 != dMin.length) {
            oDateRangeSlider.setMin(new Date(dMin));
        }
        oMinDateField.setText(oDateRangeSlider.getMin().toString());
    }

    function handleMaxChange(oEvent) {

        var dMax = Element.getElementById("maxDatePicker").getValue();
        if (dMax && 0 != dMax.length) {
            oDateRangeSlider.setMax(new Date(dMax));
        }
        oMaxDateField.setText(oDateRangeSlider.getMax().toString());
    }

    function handleValueChange(oEvent) {

        var dValue = Element.getElementById("valueDatePicker").getValue();
        if (dValue && 0 != dValue.length) {
            oDateRangeSlider.setValue(new Date(dValue));
        }
    }

    function handleValue2Change(oEvent) {

        var dValue2 = Element.getElementById("value2DatePicker").getValue();
        if (dValue2 && 0 != dValue2.length) {
            oDateRangeSlider.setValue2(new Date(dValue2));
        }
    }

    function handleDayGranularityChange(oEvent) {

        oDateRangeSlider.setDayGranularity();
        oMinDateField.setText(oDateRangeSlider.getMin().toString());
        oMaxDateField.setText(oDateRangeSlider.getMax().toString());
    }

    function handleMonthGranularityChange(oEvent) {

        oDateRangeSlider.setMonthGranularity();
        oMinDateField.setText(oDateRangeSlider.getMin().toString());
        oMaxDateField.setText(oDateRangeSlider.getMax().toString());
    }

    function handlePinUnpinChange(oEvent) {

        var oRadioButton = oEvent.oSource;
        var sKey = oRadioButton.getKey();

        if (sKey == "G") {
            oDateRangeSlider.setPinGrip(true);
            oDateRangeSlider.setPinGrip2(false);
        } else if (sKey == "G2") {
            oDateRangeSlider.setPinGrip2(true);
            oDateRangeSlider.setPinGrip(false);
        } else if (sKey == "B") {
            oDateRangeSlider.setPinGrip(true);
            oDateRangeSlider.setPinGrip2(true);
        } else if (sKey == "N") {
            oDateRangeSlider.setPinGrip(false);
            oDateRangeSlider.setPinGrip2(false);
        }
    }

    var oDateRangeSlider = new sap.suite.ui.commons.DateRangeSlider("sliderControl1");
    oDateRangeSlider.attachChange(handleChange);
    oDateRangeSlider.attachLiveChange(handleLiveChange);
    oDateRangeSlider.placeAt("sliderControl");
    oDateRangeSlider.setStepLabels(true);

    var oCheckBoxShowBubbles = new sap.ui.commons.CheckBox("showBubbles", {
        text: 'Show Bubbles',
        tooltip: 'Show/hide bubbles',
        checked: true
    });
    oCheckBoxShowBubbles.attachChange(handleShowHideChange);
    oCheckBoxShowBubbles.placeAt("showBubblesArea");

    var oCheckBoxShowStepLabels = new sap.ui.commons.CheckBox("showStepLabels", {
        text: 'Show Step Labels',
        tooltip: 'Show/hide step labels',
        checked: true
    });
    oCheckBoxShowStepLabels.attachChange(handleShowHideStepLabels);
    oCheckBoxShowStepLabels.placeAt("showStepLabelsArea");

    var oRightAlignment = {
        hAlign: sap.ui.commons.layout.HAlign.Right,
        vAlign: sap.ui.commons.layout.VAlign.Middle
    };
    var oLeftAlignment = {
        hAlign: sap.ui.commons.layout.HAlign.Left,
        vAlign: sap.ui.commons.layout.VAlign.Middle
    };

    var oDateLayout = new sap.ui.commons.layout.MatrixLayout({
        columns: 6,
        layoutFixed: false
    });

    oDateLayout.setWidths(["10%", "20%", "15%", "10%", "20%", "25%"]);

    var oMinLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    var oMinLabel = new sap.ui.commons.Label({
        text: "Min:",
        design: sap.ui.commons.LabelDesign.Bold
    });
    oMinLabelCell.addContent(oMinLabel);

    var oMinCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    var oMinDatePicker = new sap.ui.commons.DatePicker("minDatePicker", {
        yyyymmdd: ""
    });
    oMinCell.addContent(oMinDatePicker);

    var oMinButtonCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    var oMinButton = new sap.ui.commons.Button("minButton");
    oMinButton.setText("Set Min");
    oMinButton.setTooltip("Set Min");
    oMinButton.attachPress(handleMinChange);
    oMinButtonCell.addContent(oMinButton);

    var oMaxLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    var oMaxLabel = new sap.ui.commons.Label({
        text: "Max:",
        design: sap.ui.commons.LabelDesign.Bold
    });
    oMaxLabelCell.addContent(oMaxLabel);

    var oMaxCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    var oMaxDatePicker = new sap.ui.commons.DatePicker("maxDatePicker", {
        yyyymmdd: ""
    });
    oMaxCell.addContent(oMaxDatePicker);

    var oMaxButtonCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    var oMaxButton = new sap.ui.commons.Button("maxButton");
    oMaxButton.setText("Set Max");
    oMaxButton.setTooltip("Set Max");
    oMaxButton.attachPress(handleMaxChange);
    oMaxButtonCell.addContent(oMaxButton);

    oDateLayout.createRow(oMinLabelCell, oMinCell, oMinButtonCell, oMaxLabelCell, oMaxCell, oMaxButtonCell);
    oDateLayout.placeAt("minMaxArea");

    var oDateLayoutValueValue2 = new sap.ui.commons.layout.MatrixLayout({
        columns: 6,
        layoutFixed: false
    });

    oDateLayoutValueValue2.setWidths(["10%", "20%", "15%", "10%", "20%", "25%"]);

    var oValueLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    var oValueLabel = new sap.ui.commons.Label({
        text: "Value:",
        design: sap.ui.commons.LabelDesign.Bold
    });
    oValueLabelCell.addContent(oValueLabel);

    var oValueCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    var oValueDatePicker = new sap.ui.commons.DatePicker("valueDatePicker", {
        yyyymmdd: ""
    });
    oValueCell.addContent(oValueDatePicker);

    var oValueButtonCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    var oValueButton = new sap.ui.commons.Button("valueButton");
    oValueButton.setText("Set Value");
    oValueButton.setTooltip("Set Value");
    oValueButton.attachPress(handleValueChange);
    oValueButtonCell.addContent(oValueButton);

    var oValue2LabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    var oValue2Label = new sap.ui.commons.Label({
        text: "Value2:",
        design: sap.ui.commons.LabelDesign.Bold
    });
    oValue2LabelCell.addContent(oValue2Label);

    var oValue2Cell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    var oValue2DatePicker = new sap.ui.commons.DatePicker("value2DatePicker", {
        yyyymmdd: ""
    });
    oValue2Cell.addContent(oValue2DatePicker);

    var oValue2ButtonCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    var oValue2Button = new sap.ui.commons.Button("value2Button");
    oValue2Button.setText("Set Value2");
    oValue2Button.setTooltip("Set Value2");
    oValue2Button.attachPress(handleValue2Change);
    oValue2ButtonCell.addContent(oValue2Button);

    oDateLayoutValueValue2.createRow(oValueLabelCell, oValueCell, oValueButtonCell, oValue2LabelCell, oValue2Cell, oValue2ButtonCell);
    oDateLayoutValueValue2.placeAt("valueValue2Area");

    //add radio buttons for testing Day or Month selection for slider
    var oGranularityLayout = new sap.ui.commons.layout.MatrixLayout({
        columns: 3,
        layoutFixed: false
    });

    oGranularityLayout.setWidths(["30%", "35%", "35%"]);

    var oGranularityLabel = new sap.ui.commons.Label({
        text: "Granularity: ",
        design: sap.ui.commons.LabelDesign.Bold
    });
    var oDayGranularityRadio = new sap.ui.commons.RadioButton({
        text: "Day",
        selected: true,
        groupName: "granularity"
    });
    oDayGranularityRadio.attachSelect(handleDayGranularityChange);
    var oMonthGranularityRadio = new sap.ui.commons.RadioButton({
        text: "Month",
        groupName: "granularity"
    });
    oMonthGranularityRadio.attachSelect(handleMonthGranularityChange);

    var oGranularityLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oGranularityLabelCell.addContent(oGranularityLabel)

    var oGranularityDayCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    oGranularityDayCell.addContent(oDayGranularityRadio);

    var oGranularityMonthCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oGranularityMonthCell.addContent(oMonthGranularityRadio);

    oGranularityLayout.createRow(oGranularityLabelCell, oGranularityDayCell, oGranularityMonthCell);
    oGranularityLayout.placeAt("sliderGranularityArea");

    //radio buttons for pin/unpin grips    
    var oPinUnpinLayout = new sap.ui.commons.layout.MatrixLayout({
        columns: 5,
        layoutFixed: false
    });

    oPinUnpinLayout.setWidths(["30%", "17.5%", "17.5%", "17.5%", "17.5%"]);

    var oPinGripsLabel = new sap.ui.commons.Label({
        text: "Pin Grips: ",
        design: sap.ui.commons.LabelDesign.Bold
    });
    var oPinGripRadio = new sap.ui.commons.RadioButton({
        text: "Grip",
        key: "G",
        groupName: "pinUnpin"
    });
    oPinGripRadio.attachSelect(handlePinUnpinChange);
    var oPinGrip2Radio = new sap.ui.commons.RadioButton({
        text: "Grip2",
        key: "G2",
        groupName: "pinUnpin"
    });
    oPinGrip2Radio.attachSelect(handlePinUnpinChange);
    var oPinBothRadio = new sap.ui.commons.RadioButton({
        text: "Both",
        key: "B",
        groupName: "pinUnpin"
    });
    oPinBothRadio.attachSelect(handlePinUnpinChange);
    var oPinNoneRadio = new sap.ui.commons.RadioButton({
        text: "None",
        key: "N",
        selected: true,
        groupName: "pinUnpin"
    });
    oPinNoneRadio.attachSelect(handlePinUnpinChange);

    var oPinGripsLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oPinGripsLabelCell.addContent(oPinGripsLabel)

    var oPinGripCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    oPinGripCell.addContent(oPinGripRadio);

    var oPinGrip2Cell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oPinGrip2Cell.addContent(oPinGrip2Radio);

    var oPinBothCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oPinBothCell.addContent(oPinBothRadio);

    var oPinNoneCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oPinNoneCell.addContent(oPinNoneRadio);

    oPinUnpinLayout.createRow(oPinGripsLabelCell, oPinGripCell, oPinGrip2Cell, oPinBothCell, oPinNoneCell);
    oPinUnpinLayout.placeAt("pinUnpinArea");

    //properties display
    var oPropertiesLayout = new sap.ui.commons.layout.MatrixLayout({
        columns: 2,
        layoutFixed: false
    });
    oPropertiesLayout.setWidths("90%").setWidths("10%");

    var oStartDateChangeLabel = new sap.ui.commons.Label({
        text: "Left Grip Final Change:",
        design: sap.ui.commons.LabelDesign.Bold
    });
    var oStartDateChangeLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    oStartDateChangeLabelCell.addContent(oStartDateChangeLabel);

    var oStartDateChangeValueField = new sap.ui.commons.Label("leftFinal", {});
    oStartDateChangeValueField.setText("");
    var oStartDateChangeValueFieldCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oStartDateChangeValueFieldCell.addContent(oStartDateChangeValueField);

    oPropertiesLayout.createRow(oStartDateChangeLabelCell, oStartDateChangeValueFieldCell);

    var oStartDateLiveChangeLabel = new sap.ui.commons.Label({
        text: "Left Grip Live Change:",
        design: sap.ui.commons.LabelDesign.Bold
    });
    var oStartDateLiveChangeLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    oStartDateLiveChangeLabelCell.addContent(oStartDateLiveChangeLabel);

    var oStartDateLiveChangeValueField = new sap.ui.commons.Label("leftLive", {});
    oStartDateLiveChangeValueField.setText("");
    var oStartDateLiveChangeValueFieldCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oStartDateLiveChangeValueFieldCell.addContent(oStartDateLiveChangeValueField);

    oPropertiesLayout.createRow(oStartDateLiveChangeLabelCell, oStartDateLiveChangeValueFieldCell);

    var oEndDateChangeLabel = new sap.ui.commons.Label({
        text: "Right Grip Final Change:",
        design: sap.ui.commons.LabelDesign.Bold
    });
    var oEndDateChangeLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    oEndDateChangeLabelCell.addContent(oEndDateChangeLabel);

    var oEndDateChangeValueField = new sap.ui.commons.Label("rightFinal", {});
    oEndDateChangeValueField.setText("");
    var oEndDateChangeValueFieldCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oEndDateChangeValueFieldCell.addContent(oEndDateChangeValueField);

    oPropertiesLayout.createRow(oEndDateChangeLabelCell, oEndDateChangeValueFieldCell);

    var oEndDateLiveChangeLabel = new sap.ui.commons.Label({
        text: "Right Grip Live Change:",
        design: sap.ui.commons.LabelDesign.Bold
    });
    var oEndDateLiveChangeLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    oEndDateLiveChangeLabelCell.addContent(oEndDateLiveChangeLabel);

    var oEndDateLiveChangeValueField = new sap.ui.commons.Label("rightLive", {});
    oEndDateLiveChangeValueField.setText("");
    var oEndDateLiveChangeValueFieldCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oEndDateLiveChangeValueFieldCell.addContent(oEndDateLiveChangeValueField);

    oPropertiesLayout.createRow(oEndDateLiveChangeLabelCell, oEndDateLiveChangeValueFieldCell);

    var oMinDateLabel = new sap.ui.commons.Label({
        text: "Min Date:",
        design: sap.ui.commons.LabelDesign.Bold
    });
    var oMinDateLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    oMinDateLabelCell.addContent(oMinDateLabel);

    var oMinDateField = new sap.ui.commons.Label("min", {});
    oMinDateField.setText(oDateRangeSlider.getMin().toString());
    var oMinDateFieldCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oMinDateFieldCell.addContent(oMinDateField);

    oPropertiesLayout.createRow(oMinDateLabelCell, oMinDateFieldCell);

    var oMaxDateLabel = new sap.ui.commons.Label({
        text: "Max Date:",
        design: sap.ui.commons.LabelDesign.Bold
    });
    var oMaxDateLabelCell = new sap.ui.commons.layout.MatrixLayoutCell(oRightAlignment);
    oMaxDateLabelCell.addContent(oMaxDateLabel);

    var oMaxDateField = new sap.ui.commons.Label("max", {});
    oMaxDateField.setText(oDateRangeSlider.getMax().toString());
    var oMaxDateFieldCell = new sap.ui.commons.layout.MatrixLayoutCell(oLeftAlignment);
    oMaxDateFieldCell.addContent(oMaxDateField);

    oPropertiesLayout.createRow(oMaxDateLabelCell, oMaxDateFieldCell);
    oPropertiesLayout.placeAt("sliderPropertiesArea");

})