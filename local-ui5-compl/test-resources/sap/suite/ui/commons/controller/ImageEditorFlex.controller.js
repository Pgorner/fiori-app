sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/suite/ui/commons/library",
    "sap/suite/ui/commons/imageeditor/ImageEditor",
    "sap/m/FlexBox"
], function (jQuery, library, ImageEditor, FlexBox) {
    var oImageEditor, oFlexBox;

    oImageEditor = new ImageEditor({
        mode: "CropRectangle",
        keepResizeAspectRatio: false
    });
    oImageEditor.setSrc(sap.ui.require.toUrl("") + "../test-resources/sap/m/images/demo/nature/ALotOfElephants.jpg");

    oFlexBox = new FlexBox({
        renderType: "Bare",
        width: "750px",
        height: "500px",
        items: [
            oImageEditor
        ]
    });

    oFlexBox.placeAt("content");
});
