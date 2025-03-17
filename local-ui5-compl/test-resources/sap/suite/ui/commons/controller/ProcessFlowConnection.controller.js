sap.ui.define(["sap/ui/qunit/utils/nextUIUpdate"], async function (nextUIUpdate) {

  //jQuery.sap.initMobile();

  drawProcessFlowConnections = function(flowLine) {

    var draw = function(id) {
      var connectionData = [];
      connectionData.push(getSingleConnectionData(id));

      var processFlowConnection = new sap.suite.ui.commons.ProcessFlowConnection(flowLine + "_" + id);
      processFlowConnection.setDrawData(connectionData);
      processFlowConnection.placeAt("processFlowConnection_" + flowLine + "_" + id);
    };

      var getSingleConnectionData = function(id) {
      var singleConnectionData = {};
      singleConnectionData.flowLine = flowLine;
      singleConnectionData.targetNodeState = getTargetNodeState(id);
      singleConnectionData.displayState = getDisplayState(id);
      if (flowLine.indexOf("r") >= 0) {
        singleConnectionData.hasArrow = getArrowState(id);
      } else {
        singleConnectionData.hasArrow = false;
      }

      return singleConnectionData;
    };

    var getTargetNodeState = function(id) {
      var connectionTypes = id.split("_");
      switch (connectionTypes[0]) {
        case "created":
          return sap.suite.ui.commons.ProcessFlowNodeState.Positive;
        case "planned":
          return sap.suite.ui.commons.ProcessFlowNodeState.Planned;
        default:
          return null;
      }
    };

    var getDisplayState = function(id) {
      var connectionTypes = id.split("_");
      switch (connectionTypes[1]) {
        case "regular":
          return sap.suite.ui.commons.ProcessFlowDisplayState.Regular;
        case "highlighted":
          return sap.suite.ui.commons.ProcessFlowDisplayState.Highlighted;
        case "dimmed":
          return sap.suite.ui.commons.ProcessFlowDisplayState.Dimmed;
        default:
          return null;
      }
    };

    var getArrowState = function(id) {
      var connectionTypes = id.split("_");
      if (connectionTypes.length == 3 && connectionTypes[2]=="arrow") {
        return true;
      } else {
        return false;
      }
    };

    draw("created_regular");
    draw("created_regular_arrow");
    draw("planned_regular");
    draw("planned_regular_arrow");
    draw("created_highlighted");
    draw("created_highlighted_arrow");
    draw("planned_highlighted");
    draw("planned_highlighted_arrow");
    draw("created_dimmed");
    draw("created_dimmed_arrow");
    draw("planned_dimmed");
    draw("planned_dimmed_arrow");
  };

  drawProcessFlowConnections("rtlb");
  drawProcessFlowConnections("rtl");
  drawProcessFlowConnections("rtb");
  drawProcessFlowConnections("rlb");
  drawProcessFlowConnections("tlb");
  drawProcessFlowConnections("rt");
  drawProcessFlowConnections("rl");
  drawProcessFlowConnections("rb");
  drawProcessFlowConnections("tl");
  drawProcessFlowConnections("tb");
  drawProcessFlowConnections("lb");

  await nextUIUpdate();
});