sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/suite/ui/commons/CalculationBuilder",
    "sap/suite/ui/commons/CalculationBuilderVariable"
], function (JSONModel, CalculationBuilder, CalculationBuilderVariable) {

    var oCalculationBuilder = new CalculationBuilder({
        expression: "1+15+abs(-25) + Balance",
        variables: [new CalculationBuilderVariable({
            "key": "Balance",
            "label": "Balance"
        })]
    });

    oCalculationBuilder.placeAt("content");
});
