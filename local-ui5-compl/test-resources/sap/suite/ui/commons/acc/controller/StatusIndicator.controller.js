sap.ui.define([
    "sap/m/FlexBox",
    "sap/suite/ui/commons/statusindicator/Rectangle",
    "sap/suite/ui/commons/statusindicator/StatusIndicator",
    "sap/suite/ui/commons/statusindicator/ShapeGroup",
    "sap/suite/ui/commons/statusindicator/Circle"
], function (FlexBox, Rectangle, StatusIndicator, ShapeGroup, Circle) {

    var oFlexBox = new FlexBox({
        fitContainer: true,
        wrap: "Wrap",
        items: [
            new StatusIndicator({
                value: 50,
                viewBox: "-1 -1 101 101",
                width: "100px",
                height: "auto",
                groups: new ShapeGroup({
                    shapes: new Rectangle({
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 100
                    })
                })
            }),
            new StatusIndicator({
                value: 50,
                viewBox: "-1 -1 101 101",
                width: "100px",
                height: "auto",
                groups: new ShapeGroup({
                    shapes: new Circle({
                        cx: 50,
                        cy: 50,
                        r: 20
                    })
                })
            })
        ]
    });

    oFlexBox.placeAt("content");
});
