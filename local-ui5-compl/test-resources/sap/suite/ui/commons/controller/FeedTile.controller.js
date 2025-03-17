sap.ui.define(["sap/ui/core/Element"], function (Element) {

    function handlePress(oEvent) {

        sap.m.MessageToast.show("The tile is pressed");
        var label = Element.getElementById("selectedArticle");
        var itemId = oEvent.getParameter("itemId");
        if (itemId) {
            var feedItem = Element.getElementById(itemId);
            label.setText(feedItem.getTitle());
        }
    }

    var feedTile = new sap.suite.ui.commons.FeedTile({
        press: handlePress
    });
    feedTile.setTooltip("Feed Tile 1");

    var worstCase = new sap.suite.ui.commons.FeedItem({
        title: "Worst case tile Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox",
        image: "images/balloons.jpg",
        link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20769",
        source: "Some really long source text to test ellipsis",
        publicationDate: new Date()
    });
    feedTile.addItem(worstCase);

    var oldDateVal = "May 21, 2012";
    var item2 = new sap.suite.ui.commons.FeedItem({
        title: "Old article from " + oldDateVal,
        image: "images/grass.jpg",
        link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=19910",
        source: "SAP News",
        publicationDate: new Date(oldDateVal)
    });
    feedTile.addItem(item2);

    var item3 = new sap.suite.ui.commons.FeedItem({
        title: "Article without a source",
        image: "images/grass.jpg",
        link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20676",
        publicationDate: new Date()
    });
    feedTile.addItem(item3);

    var item4 = new sap.suite.ui.commons.FeedItem({
        title: "Article without an age",
        image: "images/grass.jpg",
        link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20676",
        source: "SAP News"
    });
    feedTile.addItem(item4);

    var item5 = new sap.suite.ui.commons.FeedItem({
        image: "images/grass.jpg",
        link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20676",
        source: "SAP News",
        publicationDate: new Date()
    });
    feedTile.addItem(item5);

    feedTile.placeAt("feedTile");

    var oLabel = new sap.ui.commons.Label({
        text: "Article Title:",
        design: sap.ui.commons.LabelDesign.Bold
    });

    oLabel.placeAt("selectedLabel");
    var oLabelPressValue = new sap.ui.commons.Label("selectedArticle");
    oLabelPressValue.placeAt("pressResult");

    var oImageSizeTestTile = new sap.suite.ui.commons.FeedTile("tmpFeedTile1");
    oImageSizeTestTile.setDisplayDuration(300);
    oImageSizeTestTile.setTooltip("Feed Tile 2");

    var oImageSizeTestFeedItem = new sap.suite.ui.commons.FeedItem({
        title: "2013 SAP 5O5 Ñagçyfox World Championship Sets Sail in Barbados Ñagçyfox",
        image: "images/tile_1x2_0_5xh.png",
        link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20769",
        source: "SAP Ñagçyfox News",
        publicationDate: new Date()
    });

    oImageSizeTestTile.addItem(oImageSizeTestFeedItem);

    var oImageMap = {};
    oImageMap["img-1"] = "images/tile_raw_1x2.png";
    oImageMap["img-2"] = "images/tile_1x2_0_5xw.png";
    oImageMap["img-3"] = "images/tile_1x2_0_5xh.png";
    oImageMap["img-4"] = "images/tile_1x2_0_5xw_h.png";
    oImageMap["img-5"] = "images/tile_1x2_2xw.png";
    oImageMap["img-6"] = "images/tile_1x2_2xh.png";
    oImageMap["img-7"] = "images/tile_1x2_2xw_h.png";
    oImageMap["img-8"] = "images/tile_rss_88x31.png";

    var oImageSizeTestDropDown = new sap.ui.commons.DropdownBox("DropdownBox1", {
        change: changeImage
    });

    oImageSizeTestDropDown.setEditable(true);
    oImageSizeTestDropDown.setWidth("300px");

    function changeImage(oEvent) {

        var sKey = oImageSizeTestDropDown.getSelectedItemId();
        var image = oImageMap[sKey];
        oImageSizeTestFeedItem.setImage(image);
    }

    var oItem = new sap.ui.core.ListItem("img-1");
    oItem.setText("Size of a 1x2 tile");
    oImageSizeTestDropDown.addItem(oItem);

    oItem = new sap.ui.core.ListItem("img-2");
    oItem.setText("Half the width");
    oImageSizeTestDropDown.addItem(oItem);

    oItem = new sap.ui.core.ListItem("img-3");
    oItem.setText("Half the height");
    oImageSizeTestDropDown.addItem(oItem);

    oItem = new sap.ui.core.ListItem("img-4");
    oItem.setText("Half the width and half the height");
    oImageSizeTestDropDown.addItem(oItem);

    oItem = new sap.ui.core.ListItem("img-5");
    oItem.setText("Twice the width");
    oImageSizeTestDropDown.addItem(oItem);

    oItem = new sap.ui.core.ListItem("img-6");
    oItem.setText("Twice the height");
    oImageSizeTestDropDown.addItem(oItem);

    oItem = new sap.ui.core.ListItem("img-7");
    oItem.setText("Twice the width and twice the height");
    oImageSizeTestDropDown.addItem(oItem);

    oItem = new sap.ui.core.ListItem("img-8");
    oItem.setText("Size of the RSS “default” (88x31)");
    oImageSizeTestDropDown.addItem(oItem);

    oImageSizeTestTile.placeAt("testImageSizes");
    oImageSizeTestDropDown.placeAt("dropDown");

    var oDisplayArticleImageTile = new sap.suite.ui.commons.FeedTile("disableArticleImageTile");
    oDisplayArticleImageTile.setDefaultImages(["images/grass.jpg"]);
    oDisplayArticleImageTile.setTooltip("Feed Tile 3");
    var oDisableImageItem1 = new sap.suite.ui.commons.FeedItem({
        title: "HANA destroys Oracle",
        image: "images/grass.jpg",
        link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20676",
        source: "SAP News",
        publicationDate: new Date()
    });
    oDisplayArticleImageTile.addItem(oDisableImageItem1);

    var oDisableImageItem2 = new sap.suite.ui.commons.FeedItem({
        title: "SAP overtakes Apple in revenue",
        image: "images/balloons.jpg",
        link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20676",
        source: "SAP News",
        publicationDate: new Date()
    });
    oDisplayArticleImageTile.addItem(oDisableImageItem2);

    oDisplayArticleImageTile.placeAt("feedTile2");

    var displayImageCheckbox = new sap.ui.commons.CheckBox({
        text: "Check to display the article image. Uncheck to display the default tile image.",
        checked: true,
        change: function () {

            oDisplayArticleImageTile.setDisplayArticleImage(displayImageCheckbox.getChecked());
        }
    });

    // attach it to some element in the page
    displayImageCheckbox.placeAt("checkbox");

    // tablet and phone tiles
    var tabletFeedItem = new sap.suite.ui.commons.FeedItem({
        title: "Worst case tile Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox",
        image: "images/balloons.jpg",
        link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20769",
        source: "Some really long source text to test ellipsis",
        publicationDate: new Date()
    });
    var tabletFeedTile = new sap.suite.ui.commons.FeedTile({});
    tabletFeedTile.setTooltip("Feed Tile 4");
    tabletFeedTile.addItem(tabletFeedItem);
    tabletFeedTile.placeAt("tabletFeedTile");
    var phoneFeedItem = new sap.suite.ui.commons.FeedItem({
        title: "Worst case tile Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox Ñagçyfox",
        image: "images/balloons.jpg",
        link: "http://www.sap.com/corporate-en/press-and-media/newsroom/press.epx?PressID=20769",
        source: "Some really long source text to test ellipsis",
        publicationDate: new Date()
    });
    var phoneFeedTile = new sap.suite.ui.commons.FeedTile({});
    phoneFeedTile.setTooltip("Feed Tile 5");
    phoneFeedTile.addItem(phoneFeedItem);
    phoneFeedTile.placeAt("phoneFeedTile");

    var sEmptyFeedTile = "emptyFeedTile";
    var emptyFeedTile = new sap.suite.ui.commons.FeedTile({
        id: sEmptyFeedTile,
        defaultImages: ["images/grass.jpg"], //define default image for tile
    });
    emptyFeedTile.setTooltip("Feed Tile 6");

    emptyFeedTile.placeAt("feedTile3");

    var sTestDefaultImagesTile = "sTestDefaultImagesTile";
    var oTestDefaultImagesTile = new sap.suite.ui.commons.FeedTile({
        id: sTestDefaultImagesTile,
        defaultImages: ["images/NewsImage1.png",
            "images/NewsImage2.png",
            "images/NewsImage3.png",
            "images/NewsImage4.png"]
    });

    var oDefaultImageItem1 = new sap.suite.ui.commons.FeedItem({
        title: "Article 1 - This news has default image",
        source: "SAP News"
    });

    var oDefaultImageItem2 = new sap.suite.ui.commons.FeedItem({
        title: "Article 2 - This news has default image",
        source: "SAP News"
    });

    var oDefaultImageItem3 = new sap.suite.ui.commons.FeedItem({
        title: "Article 3 - This news does not have default image",
        source: "SAP News",
        image: "images/grass.jpg"
    });

    var oDefaultImageItem4 = new sap.suite.ui.commons.FeedItem({
        title: "Article 4 - This news has default image",
        source: "SAP News"
    });

    var oDefaultImageItem5 = new sap.suite.ui.commons.FeedItem({
        title: "Article 5 - This news has default image",
        source: "SAP News"
    });

    var oDefaultImageItem6 = new sap.suite.ui.commons.FeedItem({
        title: "Article 6 - This news has default image",
        source: "SAP News"
    });

    oTestDefaultImagesTile.addItem(oDefaultImageItem1);
    oTestDefaultImagesTile.addItem(oDefaultImageItem2);
    oTestDefaultImagesTile.addItem(oDefaultImageItem3);
    oTestDefaultImagesTile.addItem(oDefaultImageItem4);
    oTestDefaultImagesTile.addItem(oDefaultImageItem5);
    oTestDefaultImagesTile.addItem(oDefaultImageItem6);

    oTestDefaultImagesTile.placeAt("feedTile4");


});