/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../i18n", "./SearchText", "sap/esh/search/ui/SearchHelper", "./SearchRelatedObjectsToolbar", "../../SearchUtil", "sap/m/Button", "sap/m/library", "sap/m/Label", "sap/m/Text", "sap/m/CheckBox", "sap/ui/core/Icon", "sap/ui/core/IconPool", "sap/ui/core/InvisibleText", "sap/ui/core/Control", "sap/ui/base/ManagedObject", "../../eventlogging/UserEvents", "../../UIUtil", "../SearchLink", "../../sinaNexTS/sina/NavigationTarget", "../../uiConstants"], function (__i18n, __SearchText, SearchHelper, __SearchRelatedObjectsToolbar, SearchUtil, Button, sap_m_library, Label, Text, CheckBox, Icon, IconPool, InvisibleText, Control, ManagedObject, ____eventlogging_UserEvents, ____UIUtil, __SearchLink, ____sinaNexTS_sina_NavigationTarget, ____uiConstants) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const SearchText = _interopRequireDefault(__SearchText);
  const SearchRelatedObjectsToolbar = _interopRequireDefault(__SearchRelatedObjectsToolbar);
  const ButtonType = sap_m_library["ButtonType"];
  const ListType = sap_m_library["ListType"];
  const UserEventType = ____eventlogging_UserEvents["UserEventType"];
  const registerHandler = ____UIUtil["registerHandler"];
  const SearchLink = _interopRequireDefault(__SearchLink);
  const NavigationTarget = ____sinaNexTS_sina_NavigationTarget["NavigationTarget"];
  const initialValueUnicode = ____uiConstants["initialValueUnicode"];
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchResultListItem = Control.extend("sap.esh.search.ui.controls.SearchResultListItem", {
    renderer: {
      apiVersion: 2,
      render(oRm, oControl) {
        // static function, so use the given "oControl" instance instead of "this" in the renderer function
        oControl._renderer(oRm, oControl);
      }
    },
    // the control API:
    metadata: {
      properties: {
        dataSource: "object",
        // sina data source
        itemId: "string",
        title: "string",
        isTitleHighlighted: "boolean",
        titleDescription: "string",
        isTitleDescriptionHighlighted: "boolean",
        titleNavigation: "object",
        titleIconUrl: "string",
        titleInfoIconUrl: "string",
        geoJson: "object",
        type: "string",
        imageUrl: "string",
        imageFormat: "string",
        imageNavigation: "object",
        attributes: {
          type: "object",
          multiple: true
        },
        navigationObjects: {
          type: "object",
          multiple: true
        },
        selected: "boolean",
        selectionEnabled: "boolean",
        customItemStyleClass: "string",
        expanded: "boolean",
        parentListItem: "object",
        additionalParameters: "object",
        positionInList: "int",
        resultSetId: "string",
        layoutCache: "object",
        countBreadcrumbsHiddenElement: "object"
      },
      aggregations: {
        _titleLink: {
          type: "sap.esh.search.ui.controls.SearchLink",
          multiple: false,
          visibility: "hidden"
        },
        _titleText: {
          type: "sap.esh.search.ui.controls.SearchText",
          multiple: false,
          visibility: "hidden"
        },
        _titleLinkDescription: {
          type: "sap.esh.search.ui.controls.SearchText",
          multiple: false,
          visibility: "hidden"
        },
        _titleInfoIcon: {
          type: "sap.ui.core.Icon",
          multiple: false,
          visibility: "hidden"
        },
        _titleDelimiter: {
          type: "sap.m.Text",
          multiple: false,
          visibility: "hidden"
        },
        _typeText: {
          type: "sap.esh.search.ui.controls.SearchText",
          multiple: false,
          visibility: "hidden"
        },
        _typeLink: {
          type: "sap.esh.search.ui.controls.SearchLink",
          multiple: false,
          visibility: "hidden"
        },
        _typeLinkAriaDescription: {
          type: "sap.ui.core.InvisibleText",
          multiple: false,
          visibility: "hidden"
        },
        _multiLineDescriptionText: {
          type: "sap.esh.search.ui.controls.SearchText",
          multiple: false,
          visibility: "hidden"
        },
        _selectionCheckBox: {
          type: "sap.m.CheckBox",
          multiple: false,
          visibility: "hidden"
        },
        _expandButton: {
          type: "sap.m.Button",
          multiple: false,
          visibility: "hidden"
        },
        _attributeLabels: {
          type: "sap.m.Label",
          multiple: true,
          visibility: "hidden"
        },
        _attributeValues: {
          type: "sap.ui.core.Control",
          multiple: true,
          visibility: "hidden"
        },
        _attributeValuesWithoutWhyfoundHiddenTexts: {
          type: "sap.ui.core.InvisibleText",
          multiple: true,
          visibility: "hidden"
        },
        _relatedObjectActionsToolbar: {
          type: "sap.esh.search.ui.controls.SearchRelatedObjectsToolbar",
          multiple: false,
          visibility: "hidden"
        },
        _titleLabeledByText: {
          type: "sap.ui.core.InvisibleText",
          multiple: false,
          visibility: "hidden"
        },
        _attributesLabeledByText: {
          type: "sap.ui.core.InvisibleText",
          multiple: false,
          visibility: "hidden"
        },
        _expandStateLabeledByText: {
          type: "sap.ui.core.InvisibleText",
          multiple: false,
          visibility: "hidden"
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      Control.prototype.constructor.call(this, sId, settings);
      // dash
      this._visibleAttributes = undefined;
      this._detailsArea = undefined;
      this._showExpandButton = false;
      this.setAggregation("_titleLink", new SearchLink(`${this.getId()}--titleLink`).addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-Title").addStyleClass("sapUshellSearchResultListItem-MightOverflow"));
      this.setAggregation("_titleText", new SearchText(`${this.getId()}--titleText`, {
        wrapping: false
      }).addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-Title").addStyleClass("sapUshellSearchResultListItem-MightOverflow"));
      this.setAggregation("_titleLinkDescription", new SearchText(`${this.getId()}--titleLinkDescription`, {
        wrapping: false
      }).addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-TitleDescription").addStyleClass("sapUshellSearchResultListItem-MightOverflow"));
      const iconSetting = {
        src: {
          path: "titleInfoIconUrl"
        }
      };
      const titleInfoIcon = new Icon(`${this.getId()}--titleInfoIcon`, iconSetting);
      titleInfoIcon.addStyleClass("sapUiSmallMarginEnd");
      this.setAggregation("_titleInfoIcon", titleInfoIcon);
      titleInfoIcon.addStyleClass("sapUshellSearchResultListItem-TitleInfoIcon");
      const titleDelimiter = new Text(`${this.getId()}--titleDelimiter`, {
        text: "|"
      });
      titleDelimiter.addEventDelegate({
        onAfterRendering: () => {
          $(titleDelimiter.getDomRef()).attr("aria-hidden", "true");
        }
      });
      this.setAggregation("_titleDelimiter", titleDelimiter.addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-TitleDelimiter").addStyleClass("sapUshellSearchResultListItem-MightOverflow"));
      this.setAggregation("_typeText", new SearchText(`${this.getId()}--typeText`).addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-TitleCategory").addStyleClass("sapUshellSearchResultListItem-MightOverflow"));
      this.setAggregation("_typeLinkAriaDescription", new InvisibleText({
        text: i18n.getText("result_list_item_type_link_description")
      }));
      this.setAggregation("_typeLink", new SearchLink(`${this.getId()}--typeLink`).addStyleClass("sapUshellSearchResultListItem-HeaderEntry").addStyleClass("sapUshellSearchResultListItem-TitleCategoryLink").addStyleClass("sapUshellSearchResultListItem-MightOverflow").addAriaDescribedBy(this.getAggregation("_typeLinkAriaDescription")));
      this.setAggregation("_multiLineDescriptionText", new SearchText(`${this.getId()}--multilineDescription`, {
        maxLines: 5
      }).addStyleClass("sapUshellSearchResultListItem-MultiLineDescription").addStyleClass("sapUshellSearchResultListItem-MightOverflow").data("islongtext", "true", true));
      this.setAggregation("_selectionCheckBox", new CheckBox(`${this.getId()}--selectionCheckbox`, {
        select: oEvent => {
          this.setProperty("selected", oEvent.getParameter("selected"), true // no re-rendering needed, change originates in HTML
          ); // see section Properties for explanation
          const oModel = this.getModel();
          oModel.updateMultiSelectionSelected();
          if (oEvent.getParameter("selected")) {
            this.addStyleClass("sapUshellSearchResultListItem-Selected");
          } else {
            this.removeStyleClass("sapUshellSearchResultListItem-Selected");
          }
        }
      }));
      this.setAggregation("_expandButton", new Button(`${this.getId()}--expandButton`, {
        type: ButtonType.Transparent,
        press: () => {
          this.toggleDetails();
        }
      }));
      this.setAggregation("_relatedObjectActionsToolbar", new SearchRelatedObjectsToolbar(`${this.getId()}--relatedObjectActionsToolbar`));
      this.setAggregation("_titleLabeledByText", new InvisibleText());
      this.setAggregation("_attributesLabeledByText", new InvisibleText());
      this.setAggregation("_expandStateLabeledByText", new InvisibleText());
    },
    // the part creating the HTML:
    _renderer: function _renderer(oRm, oControl) {
      const resultListItem = $(this.getDomRef());
      const relatedObjectsToolbar = resultListItem.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");
      if (relatedObjectsToolbar.css("display") === "none") {
        const oModel = this.getModel();
        if (oModel.config.optimizeForValueHelp) {
          relatedObjectsToolbar.css("display", "block");
        }
      }
      this._registerItemPressHandler();
      this._resetPrecalculatedValues();
      this._renderContainer(oRm, oControl);
      this._renderAccessibilityInformation(oRm);
    },
    _renderContainer: function _renderContainer(oRm, oControl) {
      const oModel = this.getModel();
      oRm.openStart("div", this);
      if (this.getProperty("customItemStyleClass")) {
        oRm.class(this.getProperty("customItemStyleClass"));
      }
      oRm.class("sapUshellSearchResultListItem-Container");
      if (this.getProperty("imageUrl")) {
        oRm.class("sapUshellSearchResultListItem-WithImage");
      }
      if (this.getProperty("imageFormat")?.toLowerCase() === "documentthumbnail") {
        oRm.class("sapUshellSearchResultListItem-Document");
      }
      oRm.openEnd();
      this._renderContentContainer(oRm, oControl);
      if (!oModel.config.optimizeForValueHelp) {
        this._renderExpandButtonContainer(oRm);
      }
      oRm.close("div");
    },
    _renderContentContainer: function _renderContentContainer(oRm, oControl) {
      const oModel = oControl.getModel();
      oRm.openStart("div", oControl.getId() + "-content");
      oRm.class("sapUshellSearchResultListItem-Content");
      if (!oModel.config.optimizeForValueHelp) {
        oRm.class("sapUshellSearchResultListItem-ContentValueHelp");
      }
      oRm.openEnd();
      this._renderTitleContainer(oRm, oControl);
      this._renderAttributesContainer(oRm);
      oRm.close("div");
    },
    _renderExpandButtonContainer: function _renderExpandButtonContainer(oRm) {
      oRm.openStart("div", this.getId() + "-expand-button-container");
      oRm.class("sapUshellSearchResultListItem-ExpandButtonContainer");
      oRm.openEnd();
      oRm.openStart("div", this.getId() + "-expand-button");
      oRm.class("sapUshellSearchResultListItem-ExpandButton");
      oRm.openEnd();
      let icon, tooltip;
      const expanded = this.getProperty("expanded");
      if (expanded) {
        icon = IconPool.getIconURI("slim-arrow-up");
        tooltip = i18n.getText("hideDetailBtn_tooltip");
      } else {
        icon = IconPool.getIconURI("slim-arrow-down");
        tooltip = i18n.getText("showDetailBtn_tooltip");
      }
      const expandButton = this.getAggregation("_expandButton");
      expandButton.setIcon(icon);
      expandButton.setTooltip(tooltip);
      expandButton.addEventDelegate({
        onAfterRendering: () => {
          this.setAriaExpandedState();
        }
      });
      oRm.renderControl(expandButton);
      oRm.close("div");
      oRm.close("div");
    },
    _renderTitleContainer: function _renderTitleContainer(oRm, oControl) {
      const oModel = this.getModel();
      if (!oModel.config.optimizeForValueHelp) {
        oRm.openStart("div", this.getId() + "-title-and-image-container");
        oRm.class("sapUshellSearchResultListItem-TitleAndImageContainer");
        oRm.openEnd();
      }
      oRm.openStart("div", this.getId() + "-title-container");
      oRm.class("sapUshellSearchResultListItem-TitleContainer");
      if (oModel.config.optimizeForValueHelp) {
        oRm.class("sapUshellSearchResultListItem-TitleContainerValueHelp");
      }
      oRm.openEnd();
      this._renderCheckbox(oRm);

      /// Title
      const titleNavigation = this.getProperty("titleNavigation");
      let titleText = this.getProperty("title");
      let titleControl;
      if (!titleText || titleText.trim().length === 0) {
        titleText = SearchResultListItem.noValue;
        titleControl = this.getAggregation("_titleText");
      } else if (!titleNavigation && !this.isHierarchyItem()) {
        titleControl = this.getAggregation("_titleText");
      } else {
        titleControl = this.getAggregation("_titleLink");
        titleControl.setNavigationTarget(titleNavigation);
        if (this.isHierarchyItem()) {
          setTimeout(() => {
            if (this.supportsDragAndDrop(titleControl, oModel)) {
              // no drag&drop of title link (<a>-tag)
              titleControl.getDomRef()["draggable"] = false;
              this.addStyleClass("sapUshellSearchResultListItem-NotDraggableNotClickable");
            }
          }, 100);
        } else if (oModel.config.optimizeForValueHelp) {
          setTimeout(() => {
            if (this.supportsDragAndDrop(titleControl, oModel)) {
              // no drag&drop of title link (<a>-tag)
              titleControl.getAggregation("_link").getDomRef()["draggable"] = false;
              const oTitleLinkIcon = titleControl.getAggregation("icon");
              if (oTitleLinkIcon instanceof Icon) {
                oTitleLinkIcon.getDomRef()["draggable"] = false;
              }
            }
          }, 100);
        }
      }
      titleControl.setText(titleText);
      if (this.getProperty("isTitleHighlighted")) {
        titleControl.addStyleClass("sapUshellSearchResultItem-AttributeValueHighlighted");
      }
      const titleLinkIcon = titleControl.getAggregation("icon");
      if (titleLinkIcon instanceof Icon) {
        titleLinkIcon.addStyleClass("sapUshellSearchResultListItem-Clickable");
      } else if (this.getProperty("titleIconUrl")) {
        const oIcon = new Icon(`${this.getId()}--titleIcon`, {
          src: ManagedObject.escapeSettingsValue(this.getProperty("titleIconUrl"))
        });
        oIcon?.addStyleClass("sapUshellSearchResultListItem-Clickable");
        titleControl.setIcon(oIcon);
        setTimeout(() => {
          if (!this.isHierarchyItem() && this.supportsDragAndDrop(titleControl, oModel)) {
            const domElement = oIcon?.getDomRef();
            if (domElement) {
              domElement["draggable"] = false;
            }
          }
        }, 100);
      }
      oRm.renderControl(titleControl);
      if (oControl.getProperty("titleInfoIconUrl")) {
        const titleInfoIcon = oControl.getAggregation("_titleInfoIcon");
        if (titleInfoIcon) {
          if (oModel.config.optimizeForValueHelp) {
            titleInfoIcon.addStyleClass("sapUshellSearchResultListItem-TitleInfoIconValueHelp");
          }
          oRm.renderControl(titleInfoIcon);
        }
      }

      /// sub-title aka Title Description
      if (!oModel.config.optimizeForValueHelp) {
        const titleDescription = this.getProperty("titleDescription");
        if (titleDescription && titleDescription.trim().length > 0) {
          const titleLinkDescription = this.getAggregation("_titleLinkDescription");
          titleLinkDescription.setText(titleDescription);
          if (this.getProperty("isTitleDescriptionHighlighted")) {
            titleLinkDescription.addStyleClass("sapUshellSearchResultItem-AttributeValueHighlighted");
          }
          oRm.renderControl(titleLinkDescription);
        }
      }
      if (oModel.config.optimizeForValueHelp) {
        this._renderRelatedObjectsToolbar(oRm);
      } else if (!oModel.config.exclusiveDataSource) {
        // delimiter between title and sub-title or object type
        const titleDelimiter = this.getAggregation("_titleDelimiter");
        oRm.renderControl(titleDelimiter);

        // object type
        if (oModel.getDataSource() === this.getProperty("dataSource")) {
          const typeText = this.getAggregation("_typeText");
          typeText.setText(this.getProperty("type"));
          oRm.renderControl(typeText);
        } else {
          const uiFilterClone = this.getModel().getProperty("/uiFilter").clone();
          uiFilterClone.setDataSource(this.getProperty("dataSource"));
          const navigationTarget = oModel.createSearchNavigationTarget(uiFilterClone, this.getProperty("type"));
          const typeLink = this.getAggregation("_typeLink");
          typeLink.setNavigationTarget(navigationTarget);
          typeLink.setText(this.getProperty("type"));
          typeLink.setTooltip(i18n.getText("searchInDataSourceTooltip", [this.getProperty("dataSource").labelPlural]));
          oRm.renderControl(this.getAggregation("_typeLinkAriaDescription")); // ToDo
          oRm.renderControl(typeLink);
        }
      }
      oRm.close("div");
      if (!oModel.config.optimizeForValueHelp) {
        this._renderImageForPhone(oRm);
        oRm.close("div");
      }
    },
    _renderCheckbox: function _renderCheckbox(oRm) {
      oRm.openStart("div", this.getId() + "-checkbox-expand-container");
      oRm.class("sapUshellSearchResultListItem-CheckboxExpandContainer");
      oRm.openEnd();
      oRm.openStart("div", this.getId() + "-checkbox-container");
      oRm.class("sapUshellSearchResultListItem-CheckboxContainer");
      oRm.openEnd();
      oRm.openStart("div", this.getId() + "-checkbox-alignment-container");
      oRm.class("sapUshellSearchResultListItem-CheckboxAlignmentContainer");
      oRm.openEnd();
      const checkbox = this.getAggregation("_selectionCheckBox");
      const selected = this.getProperty("selected");
      const selectionEnabled = this.getProperty("selectionEnabled");
      checkbox.setSelected(selected);
      checkbox.setEnabled(selectionEnabled);
      oRm.renderControl(checkbox);
      oRm.close("div");
      oRm.close("div");
      oRm.close("div");
    },
    _renderImageForPhone: function _renderImageForPhone(oRm) {
      if (this.getProperty("imageUrl")) {
        oRm.openStart("div", this.getId() + "-title-image");
        oRm.class("sapUshellSearchResultListItem-TitleImage");
        if (this.getProperty("imageFormat") === "round") {
          oRm.class("sapUshellSearchResultListItem-ImageContainerRound");
        }
        oRm.openEnd();
        oRm.openStart("div", this.getId() + "-image-container-aligmnent-helper");
        oRm.class("sapUshellSearchResultListItem-ImageContainerAlignmentHelper");
        oRm.openEnd();
        oRm.close("div");
        oRm.openStart("img", this.getId() + "-image-1");
        oRm.class("sapUshellSearchResultListItem-Image");
        oRm.attr("src", this.getProperty("imageUrl"));
        oRm.openEnd();
        oRm.close("div");
        oRm.close("div");
      }
    },
    _renderImageForDocument: function _renderImageForDocument(oRm) {
      if (this.getProperty("imageFormat") && this.getProperty("imageFormat").toLowerCase() === "documentthumbnail") {
        const imageNavigation = this.getProperty("imageNavigation");
        const imageNavigationUrl = imageNavigation ? imageNavigation.targetUrl : "";
        if (typeof this._zoomIcon !== "undefined") {
          this._zoomIcon.destroy();
        }
        this._zoomIcon = new Icon("", {
          // ToDo: Stable ID, see below
          // this._zoomIcon = new Icon(`${this.getId()}--zoomIcon`, {
          // -> duplicate ID ?!?
          src: IconPool.getIconURI("search"),
          useIconTooltip: false
        });
        this._zoomIcon.addStyleClass(`${this.getId()}--zoomIcon`); // ToDo -> remove as soon as stable ID works
        this._zoomIcon.addStyleClass("sapUshellSearchResultListItem-DocumentThumbnailZoomIcon");
        const imageUrl = this.getProperty("imageUrl");
        oRm.openStart("div", this.getId() + "-document-thumbnail-container");
        oRm.class("sapUshellSearchResultListItem-DocumentThumbnailContainer");
        oRm.openEnd();
        if (imageNavigationUrl && imageNavigationUrl.length > 0) {
          oRm.openStart("a", this.getId() + "-document-thumbnail-border-1");
          oRm.attr("href", imageNavigationUrl);
          oRm.class("sapUshellSearchResultListItem-DocumentThumbnailBorder");
          oRm.openEnd();
          oRm.openStart("div", this.getId() + "-document-thumbnail-dogear-1");
          oRm.class("sapUshellSearchResultListItem-DocumentThumbnail-DogEar");
          oRm.openEnd();
          oRm.close("div");
          oRm.renderControl(this._zoomIcon);
          if (imageUrl && imageUrl.length > 0) {
            oRm.openStart("img", this.getId() + "-document-thumbnail-1");
            oRm.class("sapUshellSearchResultListItem-DocumentThumbnail");
            oRm.attr("src", this.getProperty("imageUrl"));
            oRm.openEnd();
            oRm.close("img");
          } // else: is there a placeholder image that could be shown instead?

          oRm.close("a");
        } else {
          oRm.openStart("div", this.getId() + "-document-thumbnail-border-2");
          oRm.class("sapUshellSearchResultListItem-DocumentThumbnailBorder");
          oRm.openEnd();
          oRm.openStart("div", this.getId() + "-document-thumbnail-dogear-2");
          oRm.class("sapUshellSearchResultListItem-DocumentThumbnail-DogEar");
          oRm.openEnd();
          oRm.close("div");
          oRm.renderControl(this._zoomIcon);
          if (imageUrl && imageUrl.length > 0) {
            oRm.openStart("img", this.getId() + "-document-thumbnail-2");
            oRm.class("sapUshellSearchResultListItem-DocumentThumbnail");
            oRm.attr("src", this.getProperty("imageUrl"));
            oRm.openEnd();
            oRm.close("img");
          } // else: is there a placeholder image that could be shown instead?

          oRm.close("div");
        }
        oRm.close("div");
      }
    },
    _cutDescrAttributeOutOfAttributeList: function _cutDescrAttributeOutOfAttributeList() {
      const attributes = this.getProperty("attributes");
      for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        if (attribute.longtext) {
          attributes.splice(i, 1);
          this.setProperty("attributes", attributes);
          return attribute;
        }
      }
      return undefined;
    },
    _renderMultiLineDescription: function _renderMultiLineDescription(oRm) {
      const oModel = this.getModel();
      if (this.getProperty("imageFormat")?.toLowerCase() === "documentthumbnail") {
        // for the time being, only render multiline attribute, if this is a document result item
        const description = this._cutDescrAttributeOutOfAttributeList();
        if (description?.value?.length > 0) {
          const descriptionText = this.getAggregation("_multiLineDescriptionText");
          descriptionText.setText(description.value);
          if (description.whyfound) {
            descriptionText.data("ishighlighted", "true", true);
          } else {
            descriptionText.data("ishighlighted", "false", true);
          }
          if (description.valueWithoutWhyfound) {
            // for attribute values with why-found information, use the raw value information (without why-found-tags) for tooltip and ARIA description
            const hiddenValueText = new InvisibleText({});
            hiddenValueText.setText(description.valueWithoutWhyfound);
            descriptionText.data("tooltippedBy", hiddenValueText.getId(), true);
            descriptionText.addEventDelegate({
              onAfterRendering: () => {
                const $descriptionText = $(descriptionText.getDomRef());
                $descriptionText.attr("aria-describedby", $descriptionText.attr("data-tooltippedby"));
              }
            });
            this.addAggregation("_attributeValuesWithoutWhyfoundHiddenTexts", hiddenValueText, true /* do not invalidate this object */);
            oRm.renderControl(hiddenValueText);
          }
          this.adjustCssDragAndDrop(descriptionText, oModel);
          oRm.renderControl(descriptionText);
        } else {
          oRm.openStart("div", this.getId() + "-multiline-description");
          oRm.class("sapUshellSearchResultListItem-MultiLineDescription");
          oRm.openEnd();
          oRm.close("div");
        }
      }
    },
    _renderAttributesContainer: function _renderAttributesContainer(oRm) {
      const oModel = this.getModel();
      oRm.openStart("div", this.getId() + "-attribute-expand-container");
      oRm.class("sapUshellSearchResultListItem-AttributesExpandContainer");
      if (oModel.config.optimizeForValueHelp) {
        oRm.class("sapUshellSearchResultListItem-AttributesExpandContainerValueHelp");
      }
      const expanded = this.getProperty("expanded");
      if (expanded) {
        oRm.class("sapUshellSearchResultListItem-AttributesExpanded");
      }
      oRm.openEnd();
      oRm.openStart("div", this.getId() + "-attributes-and-actions");
      oRm.class("sapUshellSearchResultListItem-AttributesAndActions");
      oRm.openEnd();
      if (!oModel.config.optimizeForValueHelp) {
        this._renderImageForDocument(oRm);
        this._renderMultiLineDescription(oRm);
      }
      oRm.openStart("ul", this.getId() + "-attributes");
      oRm.class("sapUshellSearchResultListItem-Attributes");
      oRm.openEnd();
      const itemAttributes = this.getProperty("attributes");
      if (!oModel.config.optimizeForValueHelp) {
        this._renderImageAttribute(oRm, /* imageIsOnlyAttribute= */itemAttributes.length === 0);
      }
      this._renderAllAttributes(oRm, itemAttributes);

      // this is just a dummie attribute to store additional space information for the expand and collapse JavaScript function
      if (!oModel.config.optimizeForValueHelp) {
        oRm.openStart("li", this.getId() + "-expand-spacer-attribute");
        oRm.class("sapUshellSearchResultListItem-ExpandSpacerAttribute");
        oRm.attr("aria-hidden", "true");
        oRm.openEnd();
        oRm.close("li");
      }
      oRm.close("ul");
      if (!oModel.config.optimizeForValueHelp) {
        // related objects toolbar will be rendered in line with title attribute
        this._renderRelatedObjectsToolbar(oRm);
      }
      oRm.close("div");
      oRm.close("div");
    },
    // render Attributes
    // ===================================================================
    _renderAllAttributes: function _renderAllAttributes(oRm, itemAttributes) {
      const oModel = this.getModel();
      if (itemAttributes.length === 0) {
        oRm.openStart("li", this.getId() + "-generic-attribute-1");
        oRm.class("sapUshellSearchResultListItem-GenericAttribute");
        if (oModel.config.optimizeForValueHelp) {
          oRm.class("sapUshellSearchResultListItem-GenericAttributeValueHelp");
        }
        oRm.class("sapUshellSearchResultListItem-MainAttribute");
        oRm.class("sapUshellSearchResultListItem-EmptyAttributePlaceholder");
        oRm.attr("aria-hidden", "true");
        oRm.openEnd();
        oRm.close("li");
        return;
      }
      let itemAttribute;
      let labelText;
      let valueText;
      let valueWithoutWhyfound;
      let label, value, isLongText;
      let hiddenValueText;
      let oIcon;
      const layoutCache = this.getProperty("layoutCache") || {};
      this.setProperty("layoutCache", layoutCache, /* suppress rerender */true);
      if (!layoutCache.attributes) {
        layoutCache.attributes = {};
      }
      let i = 0,
        numberOfRenderedAttributes = 0;
      let numberOfColumnsDesktop = 4;
      let numberOfColumnsTablet = 3;
      let distributionOfAttributesDesktop = [0, 0, 0]; // three rows for desktop resolution
      let distributionOfAttributesTablet = [0, 0, 0, 0]; // four rows for tablet resolution
      let additionalWhyFoundAttributesDesktop = 2;
      let additionalWhyFoundAttributesTablet = 2;
      let longTextColumnNumber;
      const isDocumentItem = this.getProperty("imageFormat") && this.getProperty("imageFormat").toLowerCase() === "documentthumbnail";
      const includeImageAttribute = this.getProperty("imageUrl") && !isDocumentItem && !oModel.config.optimizeForValueHelp;
      if (isDocumentItem && !oModel.config.optimizeForValueHelp) {
        numberOfColumnsDesktop = numberOfColumnsTablet = 2;
        distributionOfAttributesDesktop = distributionOfAttributesTablet = [0, 0];
        additionalWhyFoundAttributesDesktop = additionalWhyFoundAttributesTablet = 4;
      }
      let remainingSlotsForAttributesDesktop = numberOfColumnsDesktop * distributionOfAttributesDesktop.length;
      let remainingSlotsForAttributesTablet = numberOfColumnsTablet * distributionOfAttributesTablet.length;
      if (includeImageAttribute) {
        remainingSlotsForAttributesDesktop--;
        remainingSlotsForAttributesTablet--;
        distributionOfAttributesDesktop[0]++;
        distributionOfAttributesTablet[0]++;
      }
      this.destroyAggregation("_attributeLabels");
      this.destroyAggregation("_attributeValues");
      this.destroyAggregation("_attributeValuesWithoutWhyfoundHiddenTexts");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const createAfterRenderingFunctionForAddingAriaDescribedBy = control => {
        return () => {
          const $this = $(this.getDomRef());
          $this.attr("aria-describedby", $this.attr("data-tooltippedby"));
        };
      };
      for (i = 0; !(additionalWhyFoundAttributesDesktop <= 0 && additionalWhyFoundAttributesTablet <= 0) && i < itemAttributes.length; i++) {
        itemAttribute = itemAttributes[i];
        const oModel = this.getModel();
        if (oModel.config.optimizeForValueHelp && !itemAttribute.whyfound) {
          continue; // for value help mode, only render title and why found
        }
        if (isDocumentItem && numberOfRenderedAttributes >= 4) {
          break;
        }
        if (itemAttribute.isTitle) {
          continue;
        }
        if (remainingSlotsForAttributesDesktop <= 0 && remainingSlotsForAttributesTablet <= 0 && !itemAttribute.whyfound) {
          continue;
        }
        labelText = itemAttribute.name;
        valueText = itemAttribute.value;
        if (labelText === undefined || valueText === undefined) {
          continue;
        }
        if (!valueText || valueText.trim().length === 0) {
          valueText = SearchResultListItem.noValue;
        }
        if (itemAttribute.longtext === undefined || itemAttribute.longtext === null || itemAttribute.longtext === "") {
          isLongText = false;
        } else {
          isLongText = true;
        }
        valueWithoutWhyfound = itemAttribute.valueWithoutWhyfound;
        let _rowCountTablet = -1,
          _rowCountDesktop = -1,
          _attributeWeight = {
            desktop: 1,
            tablet: 1
          };
        const attributeLayout = layoutCache.attributes[itemAttribute.key] || {};
        layoutCache.attributes[itemAttribute.key] = attributeLayout;
        oRm.openStart("li", this.getId() + "-generic-attribute-2-" + i);
        oRm.class("sapUshellSearchResultListItem-GenericAttribute");
        if (oModel.config.optimizeForValueHelp) {
          oRm.class("sapUshellSearchResultListItem-GenericAttributeValueHelp");
        }
        oRm.class("sapUshellSearchResultListItem-MainAttribute");
        if (isLongText) {
          longTextColumnNumber = attributeLayout.longTextColumnNumber || this._howManyColumnsToUseForLongTextAttribute(valueWithoutWhyfound);
          attributeLayout.longTextColumnNumber = longTextColumnNumber;
          _attributeWeight = longTextColumnNumber;
          oRm.class("sapUshellSearchResultListItem-LongtextAttribute");
        }
        if (remainingSlotsForAttributesDesktop <= 0) {
          if (itemAttribute.whyfound && additionalWhyFoundAttributesDesktop > 0) {
            oRm.class("sapUshellSearchResultListItem-WhyFoundAttribute-Desktop");
            additionalWhyFoundAttributesDesktop--;
          } else {
            oRm.class("sapUshellSearchResultListItem-DisplayNoneAttribute-Desktop");
          }
        }
        if (remainingSlotsForAttributesTablet <= 0) {
          if (itemAttribute.whyfound && additionalWhyFoundAttributesTablet > 0) {
            oRm.class("sapUshellSearchResultListItem-WhyFoundAttribute-Tablet");
            additionalWhyFoundAttributesTablet--;
          } else {
            oRm.class("sapUshellSearchResultListItem-DisplayNoneAttribute-Tablet");
          }
        }
        if (isLongText && includeImageAttribute && distributionOfAttributesDesktop[0] === 1) {
          _rowCountDesktop = 0;
          longTextColumnNumber = attributeLayout.longTextColumnNumber.desktop < numberOfColumnsDesktop ? attributeLayout.longTextColumnNumber.desktop : numberOfColumnsDesktop - 1;
          distributionOfAttributesDesktop[0] += longTextColumnNumber;
          remainingSlotsForAttributesDesktop -= longTextColumnNumber;
        } else {
          for (let k = 0; k < distributionOfAttributesDesktop.length; k++) {
            if (distributionOfAttributesDesktop[k] + _attributeWeight.desktop <= numberOfColumnsDesktop) {
              distributionOfAttributesDesktop[k] += _attributeWeight.desktop;
              remainingSlotsForAttributesDesktop -= _attributeWeight.desktop;
              _rowCountDesktop = k;
              break;
            }
          }
        }
        if (_rowCountDesktop < 0) {
          _rowCountDesktop = distributionOfAttributesDesktop.length;
        }
        if (isLongText && includeImageAttribute && distributionOfAttributesTablet[0] === 1) {
          _rowCountTablet = 0;
          longTextColumnNumber = attributeLayout.longTextColumnNumber.tablet < numberOfColumnsTablet ? attributeLayout.longTextColumnNumber.tablet : numberOfColumnsTablet - 1;
          distributionOfAttributesTablet[0] += longTextColumnNumber;
          remainingSlotsForAttributesTablet -= longTextColumnNumber;
        } else {
          for (let k = 0; k < distributionOfAttributesTablet.length; k++) {
            if (distributionOfAttributesTablet[k] + _attributeWeight.tablet <= numberOfColumnsTablet) {
              distributionOfAttributesTablet[k] += _attributeWeight.tablet;
              remainingSlotsForAttributesTablet -= _attributeWeight.tablet;
              _rowCountTablet = k;
              break;
            }
          }
        }
        if (_rowCountTablet < 0) {
          _rowCountTablet = distributionOfAttributesTablet.length;
        }
        oRm.class("sapUshellSearchResultListItem-OrderTablet-" + _rowCountTablet);
        oRm.class("sapUshellSearchResultListItem-OrderDesktop-" + _rowCountDesktop);
        if (isLongText) {
          oRm.attr("data-sap-searchresultitem-attributeweight-desktop", _attributeWeight.desktop);
          oRm.attr("data-sap-searchresultitem-attributeweight-tablet", _attributeWeight.tablet);
        }
        oRm.openEnd();
        label = new Label(`${this.getId()}--attr${i}_labelText`, {
          displayOnly: true,
          showColon: true
        });
        label.setText(labelText);
        label.addStyleClass("sapUshellSearchResultListItem-AttributeKey");
        label.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
        this.adjustCssDragAndDrop(label, oModel);
        oRm.renderControl(label);
        oRm.openStart("span", this.getId() + "-attribute-value-container-" + i);
        oRm.class("sapUshellSearchResultListItem-AttributeValueContainer");
        if (oModel.config.optimizeForValueHelp) {
          oRm.class("sapUshellSearchResultListItem-AttributeValueContainerValueHelp");
        }
        oRm.openEnd();
        if (itemAttribute.defaultNavigationTarget instanceof NavigationTarget) {
          const navigationTarget = itemAttribute.defaultNavigationTarget;
          value = new SearchLink(`${this.getId()}--attr${i}_defNavTarget_Link`, {
            navigationTarget: null,
            wrapping: false,
            tooltip: ManagedObject.escapeSettingsValue(itemAttribute.tooltip || "")
          });
          // Lazy loading because of potential {} in the href will be understood as binding path by UI5
          value.setNavigationTarget(navigationTarget);
          value.setText(valueText);
          value.addStyleClass("sapUshellSearchResultListItem-AttributeLink");
        } else {
          value = new SearchText(`${this.getId()}--attr${i}_noDefNavTarget_Text`);
          value.setText(valueText);
        }
        oIcon = undefined;
        const attribluteLinkIcon = value?.getAggregation("icon");
        if (attribluteLinkIcon instanceof Icon) {
          attribluteLinkIcon.addStyleClass("sapUshellSearchResultListItem-AttributeIcon");
        } else if (itemAttribute.iconUrl) {
          oIcon = new Icon(`${this.getId()}--attr${i}_itemAttributeIcon`, {
            src: ManagedObject.escapeSettingsValue(itemAttribute.iconUrl)
          });
          oIcon.addStyleClass("sapUshellSearchResultListItem-AttributeIcon");
        }
        if (oIcon) {
          value.setIcon(oIcon);
        }
        value.addStyleClass("sapUshellSearchResultListItem-AttributeValue");
        value.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
        if (itemAttribute.whyfound) {
          value.data("ishighlighted", "true", true);
          value.addStyleClass("sapUshellSearchResultItem-AttributeValueHighlighted");
        }
        if (isLongText) {
          value.data("islongtext", "true", true);
        }
        if (valueWithoutWhyfound && !(value instanceof SearchLink && value.getTooltip())) {
          // for attribute values with why-found information, use the raw value information (without why-found-tags) for tooltip and ARIA description
          hiddenValueText = new InvisibleText({});
          hiddenValueText.addStyleClass("sapUshellSearchResultListItem-AttributeValueContainer-HiddenText");
          hiddenValueText.setText(valueWithoutWhyfound);
          value.data("tooltippedBy", hiddenValueText.getId(), true);
          value.addEventDelegate({
            onAfterRendering: createAfterRenderingFunctionForAddingAriaDescribedBy(value)
          });
          this.addAggregation("_attributeValuesWithoutWhyfoundHiddenTexts", hiddenValueText, true /* do not invalidate this object */);
          oRm.renderControl(hiddenValueText);
        }
        this.adjustCssDragAndDrop(value, oModel);
        oRm.renderControl(value);
        oRm.close("span");
        oRm.close("li");
        this.addAggregation("_attributeLabels", label, true /* do not invalidate this object */);
        this.addAggregation("_attributeValues", value, true /* do not invalidate this object */);
        numberOfRenderedAttributes++;
      }
      if (includeImageAttribute) {
        const availableSpaceOnFirstLineDesktop = numberOfColumnsDesktop - distributionOfAttributesDesktop[0];
        const availableSpaceOnFirstLineTablet = numberOfColumnsTablet - distributionOfAttributesTablet[0];
        if (availableSpaceOnFirstLineDesktop > 0 || availableSpaceOnFirstLineTablet > 0) {
          oRm.openStart("li", this.getId() + "-generic-attribute-3");
          oRm.class("sapUshellSearchResultListItem-GenericAttribute");
          if (oModel.config.optimizeForValueHelp) {
            oRm.class("sapUshellSearchResultListItem-GenericAttributeValueHelp");
          }
          oRm.class("sapUshellSearchResultListItem-MainAttribute");
          oRm.class("sapUshellSearchResultListItem-OrderTablet-0");
          oRm.class("sapUshellSearchResultListItem-OrderDesktop-0");
          oRm.attr("data-sap-searchresultitem-attributeweight-desktop", availableSpaceOnFirstLineDesktop);
          oRm.attr("data-sap-searchresultitem-attributeweight-tablet", availableSpaceOnFirstLineTablet);
          oRm.openEnd();
          oRm.close("li");
        }
      }
    },
    _howManyColumnsToUseForLongTextAttribute: function _howManyColumnsToUseForLongTextAttribute(attributeValue) {
      if (attributeValue.length < 50) {
        return {
          tablet: 1,
          desktop: 1
        };
      }
      if (attributeValue.length < 85) {
        return {
          tablet: 2,
          desktop: 2
        };
      }
      if (attributeValue.length < 135) {
        return {
          tablet: 3,
          desktop: 3
        };
      }
      return {
        tablet: 3,
        desktop: 4
      };
    },
    _renderImageAttribute: function _renderImageAttribute(oRm, imageIsOnlyAttribute) {
      const oModel = this.getModel();
      if (!this.getProperty("imageUrl") || this.getProperty("imageFormat") && this.getProperty("imageFormat").toLowerCase() === "documentthumbnail") {
        return;
      }
      oRm.openStart("li", this.getId() + "-generic-attribute-4");
      oRm.class("sapUshellSearchResultListItem-GenericAttribute");
      if (oModel.config.optimizeForValueHelp) {
        oRm.class("sapUshellSearchResultListItem-GenericAttributeValueHelp");
      }
      oRm.class("sapUshellSearchResultListItem-ImageAttribute");
      if (imageIsOnlyAttribute) {
        oRm.class("sapUshellSearchResultListItem-LonelyImageAttribute");
      }
      oRm.openEnd();
      oRm.openStart("div", this.getId() + "-image-container");
      oRm.class("sapUshellSearchResultListItem-ImageContainer");
      if (this.getProperty("imageFormat") === "round") {
        oRm.class("sapUshellSearchResultListItem-ImageContainerRound");
      }
      oRm.openEnd();
      if (this.getProperty("imageUrl")) {
        oRm.openStart("img", this.getId() + "-image-2");
        oRm.class("sapUshellSearchResultListItem-Image");
        if (this.getProperty("imageFormat") === "round") {
          //
        }
        oRm.attr("src", this.getProperty("imageUrl"));
        oRm.openEnd();
        oRm.close("img");
      }
      if (this.getProperty("imageFormat") !== "round") {
        oRm.openStart("div", this.getId() + "-image-container-aligment-helper");
        oRm.class("sapUshellSearchResultListItem-ImageContainerAlignmentHelper");
        oRm.openEnd();
        oRm.close("div");
      }
      oRm.close("div");
      oRm.close("li");
    },
    // render Related Objects Toolbar
    // ===================================================================
    _renderRelatedObjectsToolbar: function _renderRelatedObjectsToolbar(oRm) {
      const navigationObjects = this.getProperty("navigationObjects");
      if (!navigationObjects || navigationObjects.length === 0) {
        return;
      }
      this._showExpandButton = true;
      const relatedObjectActionsToolbar = this.getAggregation("_relatedObjectActionsToolbar");
      relatedObjectActionsToolbar.setProperty("navigationObjects", navigationObjects);
      relatedObjectActionsToolbar.setProperty("positionInList", this.getProperty("positionInList"));
      oRm.renderControl(relatedObjectActionsToolbar);
    },
    _renderAccessibilityInformation: function _renderAccessibilityInformation(oRm) {
      const parentListItem = this.getProperty("parentListItem");
      if (parentListItem) {
        this._renderAriaDescriptionElementForTitle(oRm, /* withPrefix = */true, /* doRender= */true);
        this._renderAriaDescriptionElementForAttributes(oRm, /* withPrefix = */ /* doRender= */true);
        this._renderAriaDescriptionElementForCollapsedOrExpandedState(oRm, /* withPrefix = */ /* doRender= */true);
        parentListItem.addEventDelegate({
          onAfterRendering: () => {
            const $parentListItem = $(parentListItem.getDomRef());
            this._addAriaDescriptionToParentListElement(parentListItem, /* includeTotalCountElement = */true);
            registerHandler("acc-listitem-focusin", $parentListItem, "focusin", event => {
              const $relatedTarget = $(event.relatedTarget);
              if ($relatedTarget.hasClass("sapUshellSearchResultListItem") || $relatedTarget.closest(".sapUshellSearchResultListItemApps").length > 0 && !$relatedTarget.hasClass("sapUshellResultListMoreFooter")) {
                this._renderAriaDescriptionElementForTitle(oRm, /* withPrefix = */false, /* doRender= */false);
                this._renderAriaDescriptionElementForAttributes(oRm, /* withPrefix = */ /* doRender= */false);
                this._renderAriaDescriptionElementForCollapsedOrExpandedState(oRm, /* withPrefix = */ /* doRender= */false);
                this._addAriaDescriptionToParentListElement(parentListItem, /* includeTotalCountElement = */false);
              } else {
                this._renderAriaDescriptionElementForTitle(oRm, /* withPrefix = */true, /* doRender= */false);
                this._renderAriaDescriptionElementForAttributes(oRm, /* withPrefix = */ /* doRender= */false);
                this._renderAriaDescriptionElementForCollapsedOrExpandedState(oRm, /* withPrefix = */ /* doRender= */false);
                this._addAriaDescriptionToParentListElement(parentListItem, /* includeTotalCountElement = */true);
              }
            });
          },
          onsapspace: oEvent => {
            if (oEvent["target"] === oEvent["currentTarget"]) {
              this.toggleDetails();
            }
          },
          onsapenter: oEvent => {
            if (oEvent["target"] === oEvent["currentTarget"]) {
              const titleNavigation = this.getProperty("titleNavigation");
              if (titleNavigation instanceof NavigationTarget) {
                titleNavigation.performNavigation();
              }
            }
          }
        });
      }
    },
    getAccessibilityInfo: function _getAccessibilityInfo(...args) {
      let accInfo = {};
      if (Control.prototype.getAccessibilityInfo) {
        accInfo = Control.prototype.getAccessibilityInfo.apply(this, args) || accInfo;
      }
      accInfo["description"] = ""; // description will be provided dynamically in _renderAccessibilityInformation
      return accInfo;
    },
    _renderAriaDescriptionElementForTitle: function _renderAriaDescriptionElementForTitle(oRm, withPrefix, doRender) {
      this._searchResultListPrefix = this._searchResultListPrefix || i18n.getText("result_list_announcement_screenreaders");
      let labelText = this.getProperty("title") + ", " + this.getProperty("type") + ".";
      if (withPrefix) {
        labelText = this._searchResultListPrefix + " " + labelText;
      }
      const titleLabeledByText = this.getAggregation("_titleLabeledByText");
      if (titleLabeledByText) {
        titleLabeledByText.setText(labelText);
      }
      if (doRender && oRm) {
        oRm.renderControl(titleLabeledByText);
      }
    },
    _renderAriaDescriptionElementForAttributes: function _renderAriaDescriptionElementForAttributes(oRm, doRender) {
      const attributesLabeledByText = this.getAggregation("_attributesLabeledByText");
      const $attributes = $(this.getDomRef()).find(".sapUshellSearchResultListItem-Attributes").find(".sapUshellSearchResultListItem-MainAttribute");
      let labelledByText;
      if ($attributes.length === 0) {
        labelledByText = i18n.getText("result_list_item_aria_no_attributes");
      } else {
        labelledByText = i18n.getText("result_list_item_aria_has_attributes");
        $attributes.each(function () {
          const $this = $(this);
          if ($this.is(":visible") && $this.attr("aria-hidden") !== "true") {
            const attributeKey = $this.find(".sapUshellSearchResultListItem-AttributeKey").text();
            const $attributeValueContainer = $this.find(".sapUshellSearchResultListItem-AttributeValueContainer");
            let $attributeValue = $attributeValueContainer.find(".sapUshellSearchResultListItem-AttributeValueContainer-HiddenText");
            if ($attributeValue.length === 0) {
              $attributeValue = $attributeValueContainer.find(".sapUshellSearchResultListItem-AttributeValue");
            }
            const attributeValue = $attributeValue.text();
            labelledByText += i18n.getText("result_list_item_aria_attribute_and_value", [attributeKey, attributeValue]);
          }
        });
      }
      if (attributesLabeledByText) {
        attributesLabeledByText.setText(labelledByText);
      }
      if (doRender && oRm) {
        oRm.renderControl(attributesLabeledByText);
      }
    },
    _renderAriaDescriptionElementForCollapsedOrExpandedState: function _renderAriaDescriptionElementForCollapsedOrExpandedState(oRm, doRender) {
      const expandStateLabeledByText = this.getAggregation("_expandStateLabeledByText");
      let labelledByText;
      const expandButton = this.getAggregation("_expandButton");
      if (!expandButton) {
        return;
      }
      const $expandButton = $(expandButton.getDomRef());
      if ($expandButton.css("visibility") !== "hidden") {
        if (this.isShowingDetails()) {
          labelledByText = i18n.getText("result_list_item_aria_expanded");
          const navigationObjects = this.getProperty("navigationObjects");
          if (Array.isArray(navigationObjects) && navigationObjects.length > 0) {
            labelledByText = i18n.getText("result_list_item_aria_has_links") + labelledByText;
          }
        } else {
          labelledByText = i18n.getText("result_list_item_aria_collapsed");
        }
      }
      expandStateLabeledByText.setText(labelledByText);
      if (doRender && oRm) {
        oRm.renderControl(expandStateLabeledByText);
      }
    },
    _addAriaDescriptionToParentListElement: function _addAriaDescriptionToParentListElement(parentListItem, includeTotalCountElement) {
      const titleLabeledByText = this.getAggregation("_titleLabeledByText");
      if (!titleLabeledByText) {
        return;
      }
      let itemAriaLabeledBy = titleLabeledByText.getId();
      if (includeTotalCountElement) {
        const countBreadcrumbsHiddenElement = this.getProperty("countBreadcrumbsHiddenElement");
        if (countBreadcrumbsHiddenElement) {
          itemAriaLabeledBy += " " + countBreadcrumbsHiddenElement.getId();
        }
      }
      const attributesLabeledByText = this.getAggregation("_attributesLabeledByText");
      itemAriaLabeledBy += " " + attributesLabeledByText.getId();
      const expandStateLabeledByText = this.getAggregation("_expandStateLabeledByText");
      itemAriaLabeledBy += " " + expandStateLabeledByText.getId();
      const $parentListItem = $(parentListItem.getDomRef());
      $parentListItem.attr("aria-labelledby", itemAriaLabeledBy);
    },
    _getExpandAreaObjectInfo: function _getExpandAreaObjectInfo() {
      const oModel = this.getModel();
      const resultListItem = $(this.getDomRef());
      resultListItem.addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");
      const attributesExpandContainer = resultListItem.find(".sapUshellSearchResultListItem-AttributesExpandContainer");
      const relatedObjectsToolbar = resultListItem.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");
      let relatedObjectsToolbarHidden = false;
      if (relatedObjectsToolbar.css("display") === "none" && !oModel.config.optimizeForValueHelp) {
        relatedObjectsToolbar.css("display", "block");
        relatedObjectsToolbarHidden = true;
      }
      const currentHeight = attributesExpandContainer.height();
      const expandedHeight = resultListItem.find(".sapUshellSearchResultListItem-AttributesAndActions").height();
      resultListItem.removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");
      if (relatedObjectsToolbarHidden) {
        relatedObjectsToolbar.css("display", "");
      }
      const elementsToFadeInOrOut = this._getElementsInExpandArea();
      const expandAnimationDuration = 200;
      const fadeInOrOutAnimationDuration = expandAnimationDuration / 10;
      const expandAreaObjectInfo = {
        resultListItem: resultListItem,
        // ToDo
        attributesExpandContainer: attributesExpandContainer,
        // ToDo
        currentHeight: currentHeight,
        expandedHeight: expandedHeight,
        elementsToFadeInOrOut: elementsToFadeInOrOut,
        expandAnimationDuration: expandAnimationDuration,
        fadeInOrOutAnimationDuration: fadeInOrOutAnimationDuration,
        relatedObjectsToolbar: relatedObjectsToolbar // ToDo
      };
      return expandAreaObjectInfo;
    },
    _getElementsInExpandArea: function _getElementsInExpandArea() {
      const $resultListItem = $(this.getDomRef());
      const elementsToFadeInOrOut = [];
      $resultListItem.addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");
      const attributeElements = $resultListItem.find(".sapUshellSearchResultListItem-GenericAttribute:not(.sapUshellSearchResultListItem-ImageAttribute)");
      if (attributeElements.length > 0) {
        const firstLineY = attributeElements.position().top;
        attributeElements.each(function () {
          if ($(this).position().top > firstLineY) {
            elementsToFadeInOrOut.push(this);
          }
        });
      }
      $resultListItem.removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");
      return elementsToFadeInOrOut;
    },
    isShowingDetails: function _isShowingDetails() {
      const expandAreaObjectInfo = this._getExpandAreaObjectInfo();

      /////////////////////////////
      // Expand Result List Item
      if (expandAreaObjectInfo.currentHeight < expandAreaObjectInfo.expandedHeight) {
        return false;
      }
      return true;
    },
    showDetails: function _showDetails() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      if (this.isShowingDetails()) {
        return;
      }
      const expandAreaObjectInfo = this._getExpandAreaObjectInfo();
      expandAreaObjectInfo.relatedObjectsToolbar["css"]("opacity", 0); // Todo (SearchRelatedObjectsToolbar)
      expandAreaObjectInfo.relatedObjectsToolbar["css"]("display", "block"); // Todo (SearchRelatedObjectsToolbar)

      const relatedObjectActionsToolbar = this.getAggregation("_relatedObjectActionsToolbar");
      if (relatedObjectActionsToolbar) {
        relatedObjectActionsToolbar.layoutToolbarElements();
      }
      this.forwardEllipsis($(that.getDomRef()).find(".sapUshellSearchResultListItem-Title, .sapUshellSearchResultItem-AttributeValueHighlighted"));
      $(this.getDomRef()).addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");
      let animation02,
        secondAnimationStarted = false;
      const animation01 = expandAreaObjectInfo.attributesExpandContainer["animate"]({
        height: expandAreaObjectInfo.expandedHeight
      }, {
        duration: expandAreaObjectInfo.expandAnimationDuration,
        progress: function (animation, progress, remainingMs) {
          if (!secondAnimationStarted && progress > 0.5) {
            animation02 = expandAreaObjectInfo.relatedObjectsToolbar["animate"]({
              opacity: 1
            }, remainingMs).promise();
            secondAnimationStarted = true;

            // eslint-disable-next-line @typescript-eslint/no-this-alias
            jQuery.when(animation01, animation02).done(
            // jQuery Deferred for jQuery Animation, Unable to convert to Promise
            function () {
              that.setProperty("expanded", true, true);
              $(this).addClass("sapUshellSearchResultListItem-AttributesExpanded");
              $(this).css("height", "");
              $(expandAreaObjectInfo.elementsToFadeInOrOut).css("opacity", "");
              $(that.getDomRef()).removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");
              const iconArrowUp = IconPool.getIconURI("slim-arrow-up");
              const expandButton = that.getAggregation("_expandButton");
              if (expandButton) {
                // sometimes expandButton is null, why?
                expandButton.setTooltip(i18n.getText("hideDetailBtn_tooltip"));
                expandButton.setIcon(iconArrowUp);
                // expandButton.rerender();
              }
              expandAreaObjectInfo.relatedObjectsToolbar["css"]("display", ""); // Todo (SearchRelatedObjectsToolbar)
              expandAreaObjectInfo.relatedObjectsToolbar["css"]("opacity", ""); // Todo (SearchRelatedObjectsToolbar)

              that._renderAriaDescriptionElementForAttributes(undefined, /* withPrefix = */ /* doRender= */false);
              that._renderAriaDescriptionElementForCollapsedOrExpandedState(undefined, /* withPrefix = */ /* doRender= */false);
            }.bind(this));
          }
        }
      }).promise();
      $(expandAreaObjectInfo.elementsToFadeInOrOut).animate({
        opacity: 1
      }, expandAreaObjectInfo.fadeInOrOutAnimationDuration);
    },
    hideDetails: function _hideDetails() {
      const resultListItem = $(this.getDomRef());
      if (!this.isShowingDetails()) {
        return;
      }
      const expandAreaObjectInfo = this._getExpandAreaObjectInfo();
      expandAreaObjectInfo.relatedObjectsToolbar["css"]("opacity", 1); // Todo (SearchRelatedObjectsToolbar)
      expandAreaObjectInfo.relatedObjectsToolbar["animate"](
      // ToDo
      {
        opacity: 0
      }, expandAreaObjectInfo.expandAnimationDuration / 2);
      const attributeHeight = resultListItem.find(".sapUshellSearchResultListItem-MainAttribute").outerHeight(true) + resultListItem.find(".sapUshellSearchResultListItem-ExpandSpacerAttribute").outerHeight(true);
      let secondAnimationStarted = false;
      const deferredAnimation01 = expandAreaObjectInfo.attributesExpandContainer["animate"]({
        height: attributeHeight
      }, {
        duration: expandAreaObjectInfo.expandAnimationDuration,
        progress: (animation, progress, remainingMs) => {
          if (!secondAnimationStarted && remainingMs <= expandAreaObjectInfo.fadeInOrOutAnimationDuration) {
            secondAnimationStarted = true;
            const deferredAnimation02 = $(expandAreaObjectInfo.elementsToFadeInOrOut).animate({
              opacity: 0
            }, expandAreaObjectInfo.fadeInOrOutAnimationDuration).promise();
            jQuery.when(deferredAnimation01, deferredAnimation02).done(() => {
              // jQuery Deferred for jQuery Animation, Unable to convert to Promise
              this.setProperty("expanded", false, true);
              expandAreaObjectInfo.attributesExpandContainer["removeClass"](
              // ToDo
              "sapUshellSearchResultListItem-AttributesExpanded");
              $(expandAreaObjectInfo.elementsToFadeInOrOut).css("opacity", "");
              expandAreaObjectInfo.relatedObjectsToolbar["css"]("opacity", ""); // ToDo

              const iconArrowDown = IconPool.getIconURI("slim-arrow-down");
              const expandButton = this.getAggregation("_expandButton");
              expandButton.setTooltip(i18n.getText("showDetailBtn_tooltip"));
              expandButton.setIcon(iconArrowDown);
              // expandButton.rerender();

              this._renderAriaDescriptionElementForAttributes(undefined, /* withPrefix = */ /* doRender= */false);
              this._renderAriaDescriptionElementForCollapsedOrExpandedState(undefined, /* withPrefix = */ /* doRender= */false);
            });
          }
        }
      }).promise();
    },
    toggleDetails: function _toggleDetails() {
      let eventType;
      const oModel = this.getModel();
      if (this.isShowingDetails()) {
        eventType = UserEventType.ITEM_HIDE_DETAILS;
        this.hideDetails();
      } else {
        eventType = UserEventType.ITEM_SHOW_DETAILS;
        this.showDetails();
      }
      oModel.eventLogger.logEvent({
        type: eventType,
        itemPosition: this.getProperty("positionInList"),
        executionId: this.getProperty("resultSetId")
      });
    },
    isSelectionModeEnabled: function _isSelectionModeEnabled() {
      let isSelectionModeEnabled = false;
      const selectionBoxContainer = $(this.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");
      if (selectionBoxContainer) {
        isSelectionModeEnabled = selectionBoxContainer.css("opacity") > 0; // ToDo
      }
      return isSelectionModeEnabled;
    },
    enableSelectionMode: function _enableSelectionMode() {
      const selectionBoxOuterContainer = $(this.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-innerContainer");
      const selectionBoxInnerContainer = selectionBoxOuterContainer.find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");
      const duration = 200; // 'fast'
      let secondAnimationStarted = false;
      selectionBoxOuterContainer.animate({
        width: "2rem"
      }, {
        duration: duration,
        progress: (animation, progress) => {
          if (!secondAnimationStarted && progress > 0.5) {
            selectionBoxInnerContainer.css("display", "");
            selectionBoxInnerContainer.animate({
              opacity: "1.0"
            }, duration / 2);
            secondAnimationStarted = true;
          }
        }
      });
    },
    disableSelectionMode: function _disableSelectionMode() {
      const selectionBoxOuterContainer = $(this.getDomRef()).find(".sapUshellSearchResultListItem-multiSelect-innerContainer");
      const selectionBoxInnerContainer = selectionBoxOuterContainer.find(".sapUshellSearchResultListItem-multiSelect-selectionBoxContainer");
      const duration = 200; // 'fast'
      selectionBoxInnerContainer.animate({
        opacity: "0.0"
      }, duration / 2, () => {
        selectionBoxInnerContainer.css("display", "none");
      });
      selectionBoxOuterContainer.animate({
        width: "0"
      }, duration);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toggleSelectionMode: function _toggleSelectionMode(animated) {
      if (this.isSelectionModeEnabled()) {
        this.disableSelectionMode();
      } else {
        this.enableSelectionMode();
      }
    },
    // after rendering
    // ===================================================================
    onAfterRendering: function _onAfterRendering() {
      const $this = $(this.getDomRef());
      this._showOrHideExpandButton();
      this._setListItemStatusBasedOnWindowSize();
      this._renderAriaDescriptionElementForTitle(undefined, /* withPrefix = */false, /* doRender= */false);
      this._renderAriaDescriptionElementForAttributes(undefined, /* withPrefix = */ /* doRender= */false);
      this._renderAriaDescriptionElementForCollapsedOrExpandedState(undefined, /* withPrefix = */ /* doRender= */false);

      // use boldtagunescape like in highlighting for suggestions // TODO
      // allow <b> in title and attributes
      this.forwardEllipsis($this.find(".sapUshellSearchResultListItem-Title, .sapUshellSearchResultItem-AttributeValueHighlighted"));
      SearchHelper.attachEventHandlersForTooltip(this.getDomRef()); // ToDo
    },
    resizeEventHappened: function _resizeEventHappened() {
      const $this = $(this.getDomRef());
      this._showOrHideExpandButton();
      this._setListItemStatusBasedOnWindowSize();
      this.forwardEllipsis($this.find(".sapUshellSearchResultItem-AttributeValueHighlighted"));
      const titleLink = this.getAggregation("_titleLink");
      const titleText = this.getAggregation("_titleText");
      const titleControl = titleLink.getDomRef() ? titleLink : titleText;
      const oModel = this.getModel();
      if (this.supportsDragAndDrop(titleLink, oModel)) {
        if (oModel.config.optimizeForValueHelp) {
          titleControl.getDomRef()["draggable"] = false;
        }
      }
    },
    // ===================================================================
    //  some Helper Functions
    // ===================================================================
    isHierarchyItem: function _isHierarchyItem() {
      return this.getProperty("titleIconUrl") === "sap-icon://folder-blank"; // ToDo
    },
    supportsDragAndDrop: function _supportsDragAndDrop(oControl, oModel) {
      return typeof oModel.getSearchCompositeControlInstanceByChildControl(oControl) !== "undefined" && oModel.getSearchCompositeControlInstanceByChildControl(oControl).getDragDropConfig().length > 0;
    },
    _getPhoneSize: function _getPhoneSize() {
      return 767;
    },
    _resetPrecalculatedValues: function _resetPrecalculatedValues() {
      this._visibleAttributes = undefined;
      this._detailsArea = undefined;
      this._showExpandButton = false;
    },
    _setListItemStatusBasedOnWindowSize: function _setListItemStatusBasedOnWindowSize() {
      const windowWidth = window.innerWidth;
      const parentListItem = this.getProperty("parentListItem");
      if (this.getProperty("titleNavigation") && windowWidth <= this._getPhoneSize()) {
        parentListItem.setType(ListType.Active);
      } else {
        parentListItem.setType(ListType.Inactive);
      }
    },
    _showOrHideExpandButton: function _showOrHideExpandButton() {
      const element = $(this.getDomRef());
      const expandButtonContainer = element.find(".sapUshellSearchResultListItem-ExpandButtonContainer");
      const isVisible = expandButtonContainer.css("visibility") !== "hidden";
      let shouldBeVisible = false;
      const isDocumentItem = this.getProperty("imageFormat")?.toLowerCase() === "documentthumbnail";
      if (!isDocumentItem) {
        const actionBar = element.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar");
        shouldBeVisible = actionBar.length > 0; // && actionBar.css("display") !== "none";
      }
      if (!isDocumentItem && !shouldBeVisible) {
        const elementsInExpandArea = this._getElementsInExpandArea();
        if (elementsInExpandArea.length > 0) {
          shouldBeVisible = true;
        }
      }
      if (isVisible && !shouldBeVisible) {
        expandButtonContainer.css("visibility", "hidden");
        expandButtonContainer.attr("aria-hidden", "true");
        this.setAriaExpandedState();
      } else if (!isVisible && shouldBeVisible) {
        expandButtonContainer.css("visibility", "");
        expandButtonContainer.removeAttr("aria-hidden");
        this.setAriaExpandedState();
      }
    },
    setAriaExpandedState: function _setAriaExpandedState() {
      const expandButton = this.getAggregation("_expandButton");
      if (!expandButton) {
        return;
      }
      const $expandButton = $(expandButton.getDomRef());
      const $this = $(this.getDomRef());
      const $parentListItem = this.getProperty("parentListItem") ? $(this.getProperty("parentListItem").getDomRef()) : $this.closest("li");
      const $expandButtonContainer = $this.find(".sapUshellSearchResultListItem-ExpandButtonContainer");
      if ($expandButtonContainer.css("visibility") === "hidden") {
        $expandButton.removeAttr("aria-expanded");
        $parentListItem.removeAttr("aria-expanded");
      } else {
        const expanded = this.getProperty("expanded");
        if (expanded) {
          $expandButton.attr("aria-expanded", "true");
          $parentListItem.attr("aria-expanded", "true");
        } else {
          $expandButton.attr("aria-expanded", "false");
          $parentListItem.attr("aria-expanded", "false");
        }
      }
    },
    _registerItemPressHandler: function _registerItemPressHandler() {
      const parentListItem = this.getProperty("parentListItem");
      if (parentListItem) {
        parentListItem.attachPress(oEvent => {
          this._performTitleNavigation({
            event: oEvent
          });
        });
        this._registerItemPressHandler = () => {
          //
        };
      }
    },
    _performTitleNavigation: function _performTitleNavigation(params) {
      const titleNavigation = this.getProperty("titleNavigation");
      if (titleNavigation instanceof NavigationTarget) {
        titleNavigation.performNavigation({
          event: params?.event
        });
      }
    },
    adjustCssDragAndDrop: function _adjustCssDragAndDrop(value, oModel) {
      // Drag&Drop - cursor 'grab'
      setTimeout(() => {
        if (typeof oModel.getSearchCompositeControlInstanceByChildControl(value) !== "undefined" && oModel.getSearchCompositeControlInstanceByChildControl(value).getDragDropConfig().length > 0) {
          value.addStyleClass("sapUshellSearchResultListItem-SupportsDragAndDrop");
        }
      });
    },
    forwardEllipsis: function _forwardEllipsis(objs) {
      const $this = $(this.getDomRef());
      $this.addClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");
      objs.each((i, d) => {
        // recover bold tag with the help of text() in a safe way
        SearchUtil.forwardEllipsis4Whyfound(d);
      });
      $this.removeClass("sapUshellSearchResultListItem-AttributesPrepareExpansion");
    }
  });
  SearchResultListItem.noValue = initialValueUnicode;
  return SearchResultListItem;
});
})();