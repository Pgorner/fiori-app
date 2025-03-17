sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/suite/ui/commons/library",
    "sap/suite/ui/commons/imageeditor/ImageEditor",
    "sap/suite/ui/commons/imageeditor/ImageEditorContainer",
    "sap/suite/ui/commons/imageeditor/ImageEditorResponsiveContainer",
    "sap/suite/ui/commons/imageeditor/CustomSizeItem"
], function (jQuery, library, ImageEditor, ImageEditorContainer, ImageEditorResponsiveContainer, CustomSizeItem) {
    var oImageEditor,
        oImageEditorContainer,
        sSrc = sap.ui.require.toUrl("") + "../test-resources/sap/m/images/demo/nature/ALotOfElephants.jpg";

    oImageEditor = new ImageEditor({
        src: sSrc,
        customShapeSrc: sap.ui.require.toUrl("sap/suite/ui/commons/statusindicator") + "/shapes/bulb.svg"
    });
    oImageEditorContainer = new ImageEditorResponsiveContainer({
        customResizeItems: [
            new CustomSizeItem({
                width: 1920,
                height: 1080,
                label: "1920x1080"
            }),
            new CustomSizeItem({
                width: 1920,
                height: 1200,
                label: "1920x1200"
            }),
            new CustomSizeItem({
                width: 2,
                height: 2,
                icon: "sap-icon://resize",
                label: "double size",
                relative: true
            }),
            new CustomSizeItem({
                width: 0.5,
                height: 0.5,
                icon: "sap-icon://resize",
                label: "half size",
                relative: true
            })
        ],
        customRectangleCropItems: [
            new CustomSizeItem({
                width: 16,
                height: 9,
                label: "16:9",
                relative: true
            }),
            new CustomSizeItem({
                width: 1,
                height: 1,
                label: "1:1",
                relative: true
            }),
            new CustomSizeItem({
                width: 150,
                height: 150,
                label: "150x150"
            })
        ],
        customEllipseCropItems: [
            new CustomSizeItem({
                width: 16,
                height: 9,
                label: "16:9",
                relative: true
            }),
            new CustomSizeItem({
                width: 1,
                height: 1,
                label: "1:1",
                relative: true
            }),
            new CustomSizeItem({
                width: 150,
                height: 150,
                label: "150x150"
            })
        ]
    });

    oImageEditorContainer.setImageEditor(oImageEditor);
    oImageEditorContainer.placeAt("content");


    jQuery("#uploadButton").on("change", function (oEvent) {
        var oFile = oEvent.target.files[0];

        if (!oFile) {
            return;
        }

        oImageEditor.setSrc(oFile);
    });
});