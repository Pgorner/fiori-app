var mMyGraphData = {
    renderType: "Html",
    orientation: "LeftRight",
    backgroundColor: "White",
    backgroundimage: "",
    enableWheelZoom: true,
    enableZoom: true,
    noData: false,
    noDataText: "",
    nodes: [
        {
            key: "0",
            group: "0",
            status: "custom",
            icon: "sap-icon://bubble-chart",
            title: "some title",
            statusIcon: "sap-icon://bubble-chart",
            description: "asdas asd asd asd asd asd asd asd asd asd asdasda das das das dasd asda",
            attributes: [{ label: "label", value: "value" }]
        },
        {
            key: "1",
            group: "1",
            status: "custom",
            shape: "Box",
            title: "some title",
            icon: "sap-icon://bubble-chart",
            description: "asdas asd asd asd asd asd asd asd asd asd asdasda das das das dasd asda",
            imageSrc: "../../../../../resources../test-resources/sap/m/images/demo/nature/ALotOfElephants.jpg",
            attributes: [{
                label: "label",
                value: "value",
                icon: "sap-icon://bubble-chart",
                labelStatus: "custom",
                valueStatus: "blue"
            }, { label: "", value: "value", valueStatus: "custom" }, {
                label: "label",
                value: "",
                valueStatus: "blue"
            }, { icon: "sap-icon://bubble-chart", labelStatus: "blue" }]
        },
        { key: "2", group: "2", status: "custom", statusIcon: "sap-icon://bubble-chart" },
        { key: "3", group: "0", status: "custom", icon: "sap-icon://bubble-chart" },
        { key: "4", group: "1", status: "custom" },
        { key: "5", group: "1", status: "custom" },
        {
            key: "6",
            status: "custom",
            title: "some title",
            description: "asdas asd asd asd asd asd asd asd asd asd asdasda das das das dasd asda"
        },
        { key: "7", status: "custom" },
        { key: "8", status: "custom", group: "2", shape: "Box", title: "some title 2" },
        { key: "9", status: "custom" },
        { key: "10", status: "custom" }
    ],
    lines: [
        { from: "0", to: "1", arrowPosition: "Middle", status: "custom" },
        { from: "2", to: "3", arrowPosition: "Middle", status: "custom" },
        { from: "4", to: "5", arrowPosition: "Middle", status: "custom" },
        { from: "6", to: "7", status: "custom" },
        { from: "7", to: "6", status: "custom" },
        { from: "9", to: "3", status: "custom" }
    ],
    groups: [
        {
            key: "0",
            status: "custom",
            title: "group title",
            description: "group descr",
            icon: "sap-icon://bubble-chart"
        },
        { key: "1" },
        { key: "2" }
    ],
    statuses: [
        {
            key: "custom",
            title: "happy status",
            legendColor: "lime",
            borderStyle: "10 2",
            borderWidth: "2px",
            backgroundColor: "#B0D0D3",
            borderColor: "#C08497",
            contentColor: "#F7AF9D",
            headerContentColor: "#F7E3AF",
            hoverBackgroundColor: "#000022",
            hoverBorderColor: "#001242",
            hoverContentColor: "#0094C6",
            selectedBackgroundColor: "#FFF275",
            selectedBorderColor: "#6699CC",
            selectedContentColor: "#FF3C38"
        },
        {
            key: "blue",
            title: "blue status",
            legendColor: "#6699CC",
            borderStyle: "10 9",
            borderWidth: "3px",
            backgroundColor: "#9DBEDE",
            borderColor: "#4B7095",
            contentColor: "#385470",
            headerContentColor: "#385470",
            hoverBackgroundColor: "blue",
            hoverBorderColor: "blue",
            hoverContentColor: "blue",
            selectedBackgroundColor: "blue",
            selectedBorderColor: "blue",
            selectedContentColor: "blue"
        }
    ]
};

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/m/Popover",
    "sap/m/OverflowToolbarButton",
    "sap/suite/ui/commons/networkgraph/GraphMap",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView"
], async function (JSONModel, Popover, OverflowToolbarButton, GraphMap, Controller, XMLView) {
    Controller.extend("myController", {
        onInit: async function () {
            this.oModel = new JSONModel(mMyGraphData);
            this.getView().setModel(this.oModel);
            this.aSelectedItems = [];

            var oNodeControlsPromise = XMLView.create({
                definition: jQuery("#nodeControls").html()
            }),
                oLineControlsPromise = XMLView.create({
                    definition: jQuery("#lineControls").html()
                });

            var [oNodeControls, oLineControls] = await Promise.all([oNodeControlsPromise, oLineControlsPromise]);

            oNodeControls.setModel(this.oModel);
            this.oNodeControlsPopover = new Popover({
                content: [oNodeControls]
            });
            oLineControls.setModel(this.oModel);
            this.oLineControlsPopover = new Popover({
                content: [oLineControls]
            });

        },

        onAfterRendering: function () {
            this.oStatusSelect = this.getView().byId("statusSelect");
            this.oGraph = this.getView().byId("graph");

            var oMap = new GraphMap({

            }),
                oMapPopover = new Popover({
                    content: [
                        oMap
                    ]
                }),
                oButton = new OverflowToolbarButton({
                    icon: "sap-icon://alert",
                    press: function () {
                        oMapPopover.openBy(oButton)
                        oMap.setGraph(this.oGraph);
                    }
                });

            this.oGraph.getToolbar().addContent(oButton);

            mMyGraphData.nodes.forEach(function (oNode) {
                oNode.actionButtons = [{ icon: "sap-icon://legend", title: "controls", position: "Left" }];
            });
            mMyGraphData.lines.forEach(function (oLine) {
                oLine.actionButtons = [{ icon: "sap-icon://legend", title: "controls", position: "Left" }];
            });

            this.oModel.refresh();
        },

        openNodeControls: function (oEvent) {
            var oSource = oEvent.getSource();

            this.oNodeControlsPopover.setBindingContext(oSource.getParent().getBindingContext());
            this.oNodeControlsPopover.openBy(oSource);
        },

        openLineControls: function (oEvent) {
            var oSource = oEvent.getSource();

            this.oLineControlsPopover.setBindingContext(oSource.getParent().getBindingContext());
            this.oLineControlsPopover.openBy(oSource);
        },

        onRenderTypeChange: function (oEvent) {
            this.oGraph.setRenderType(oEvent.getParameter("selectedItem").getKey());
        },

        applyStatusOnSelected: function () {
            var sStatus = this.oStatusSelect.getSelectedKey(),
                aSelectedItems = [];

            this.oGraph.getNodes().forEach(function (oNode) {
                if (oNode.getSelected()) {
                    aSelectedItems.push(oNode);
                    oNode.getAttributes().forEach(function (oAttribute) {
                        oAttribute.setLabelStatus(sStatus);
                        oAttribute.setValueStatus(sStatus);
                    });
                }
            });

            this.oGraph.getLines().forEach(function (oLine) {
                if (oLine.getSelected()) {
                    aSelectedItems.push(oLine);
                }
            });

            aSelectedItems.forEach(function (oItem) {
                oItem.setStatus(sStatus);
            });
        },

        applyStatusonAll: function () {
            var sStatus = this.oStatusSelect.getSelectedKey();

            this.oGraph.getNodes().forEach(function (oNode) {
                oNode.setStatus(sStatus);
                oNode.getAttributes().forEach(function (oAttribute) {
                    oAttribute.setLabelStatus(sStatus);
                    oAttribute.setValueStatus(sStatus);
                });
            });

            this.oGraph.getLines().forEach(function (oLine) {
                oLine.setStatus(sStatus);
            });

            this.oGraph.getGroups().forEach(function (oGroup) {
                oGroup.setStatus(sStatus);
            });
        }
    });

    Controller.extend("nodeController", {
        descriptionChange: function (oEvent) {
            this.getParent().setDescription("test");
        }
    });
    var oView = await XMLView.create({ definition: jQuery("#myXml").html() });
    oView.placeAt("content");
});