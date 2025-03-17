/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/base/ClassSupport", "sap/fe/base/HookSupport", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/FPMHelper", "sap/ui/core/Component", "sap/uxap/ObjectPageSection"], function (Log, ClassSupport, HookSupport, CommonUtils, FPMHelper, Component, ObjectPageSection) {
  "use strict";

  var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2;
  var property = ClassSupport.property;
  var defineUI5Class = ClassSupport.defineUI5Class;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  // eslint-disable-next-line @typescript-eslint/no-restricted-imports
  let Section = (_dec = defineUI5Class("sap.fe.macros.controls.Section", {
    designtime: "sap/uxap/designtime/ObjectPageSection.designtime"
  }), _dec2 = property({
    type: "string"
  }), _dec3 = property({
    type: "boolean"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_ObjectPageSection) {
    function Section(properties, others) {
      var _this;
      _this = _ObjectPageSection.call(this, properties, others) || this;
      // TODO: this probably makes sense to be an event. But we can address this later.
      _initializerDefineProperty(_this, "onSectionLoaded", _descriptor, _this);
      _initializerDefineProperty(_this, "useSingleTextAreaFieldAsNotes", _descriptor2, _this);
      _this.registerDelegate();
      return _this;
    }
    _inheritsLoose(Section, _ObjectPageSection);
    var _proto = Section.prototype;
    _proto.registerDelegate = function registerDelegate() {
      const eventDelegates = {
        onAfterRendering: () => {
          const view = CommonUtils.getTargetView(this);
          if (this.useSingleTextAreaFieldAsNotes) {
            this.checkAndAdjustSectionContentForTextArea();
          }
          this.checkAndAdjustForSingleContent(view);
        }
      };
      this.addEventDelegate(eventDelegates);
    };
    _proto.setOnSectionLoaded = function setOnSectionLoaded(onSectionLoaded) {
      const loadSplit = onSectionLoaded.split(".");
      this._sectionLoadMethodName = loadSplit?.pop();
      this._sectionLoadModuleName = loadSplit?.join("/");
      this.setProperty("onSectionLoaded", onSectionLoaded);
    }

    // TODO: Check if onAfterRendering can be used instead of applySettings.
    ;
    _proto.applySettings = function applySettings(mSettings, oScope) {
      _ObjectPageSection.prototype.applySettings.call(this, mSettings, oScope);
      const templateComponent = Component.getOwnerComponentFor(this);
      const pageController = templateComponent.getRootController();
      if (pageController) {
        HookSupport.initControllerExtensionHookHandlers(this, pageController);
      }
      return this;
    }

    /**
     * This method loops through all the visible subsections and triggers the text area flow if thats the only single control within the section.
     */;
    _proto.checkAndAdjustSectionContentForTextArea = function checkAndAdjustSectionContentForTextArea() {
      const visibleSubSections = this.getVisibleSubSections();
      visibleSubSections.forEach(subsection => {
        const content = this.getSingleContent([subsection]);
        if (content) this.adjustForSingleContent(content);
      });
    };
    _proto.checkAndAdjustForSingleContent = function checkAndAdjustForSingleContent(view) {
      if (view?.getViewData()?.sectionLayout === "Page") {
        const singleContent = this.getSingleContent();
        if (singleContent && (singleContent.isA("sap.fe.macros.controls.section.ISingleSectionContributor") || this.checkIfNotesReuseComponent(singleContent))) {
          this.adjustForSingleContent(singleContent);
        } else if (this._sectionLoadModuleName && this._sectionLoadMethodName) {
          return FPMHelper.loadModuleAndCallMethod(this._sectionLoadModuleName, this._sectionLoadMethodName, view, this);
        } else {
          Log.debug("Section cannot be adjusted for single content : Interface 'ISingleSectionContributor' is not implemented");
        }
      } else {
        this.checkAndAdjustTabLayout();
      }
    }

    /**
     *
     * @param singleContent Object of the content present within the section.
     * @returns True if the content present is a notes reuse component
     */;
    _proto.checkIfNotesReuseComponent = function checkIfNotesReuseComponent(singleContent) {
      if (singleContent.isA("sap.m.VBox") && singleContent.getId().includes("NoteSection")) {
        return true;
      }
      return false;
    }

    /**
     * This function checks for the visible subsections and checks for the collection facet label, If present then we merge the title and this function handles the DynamicSideConent as well.
     */;
    _proto.checkAndAdjustTabLayout = function checkAndAdjustTabLayout() {
      const visibleSubSections = this.getVisibleSubSections();
      if (visibleSubSections.length === 1) {
        this.adjustSectionContentWithTitle(visibleSubSections[0]);
      } else {
        visibleSubSections.forEach(subsection => {
          let content;
          const blocks = subsection.getBlocks();
          // In case of Tab layout, we need to check if the section has only one subsection and that subsection has only one control
          // In case of collection Facet, the first block will be Title and the second block will be SubSectionBlock
          if (blocks.length === 2 && blocks[1]?.isA("sap.fe.templates.ObjectPage.controls.SubSectionBlock")) {
            this.adjustSectionContentWithTitle(subsection);
          }
          // In case of Reference Facet, the first block will be SubSectionBlock
          else if (blocks.length === 1 && blocks[0]?.isA("sap.fe.templates.ObjectPage.controls.SubSectionBlock")) {
            content = blocks[0].getAggregation("content");
            if (content.isA("sap.fe.macros.controls.section.ISingleSectionContributor")) {
              this.adjustForSingleContent(content, {
                sectionFromReferenceFacet: true,
                SubSection: subsection
              });
            } else if (content?.isA("sap.ui.layout.DynamicSideContent")) {
              content = content.getMainContent instanceof Function && content?.getMainContent();
              if (content && content.length === 1) {
                content = content[0];
                this.adjustForSingleContent(content, {
                  sectionFromReferenceFacet: true,
                  SubSection: subsection
                });
              }
            }
          }
        });
      }
    }

    /**
     * This function checks for the for the collection facet label,If present then we merge the title.
     * @param subsection ObjectPage SubSection
     */;
    _proto.adjustSectionContentWithTitle = function adjustSectionContentWithTitle(subsection) {
      const blocks = subsection.getBlocks();
      let content;
      if (blocks.length === 2 && blocks[1].isA("sap.fe.templates.ObjectPage.controls.SubSectionBlock")) {
        content = blocks[1].getAggregation("content");
        if (content && content.isA("sap.fe.macros.controls.section.ISingleSectionContributor") && blocks[0].isA("sap.m.Title")) {
          this.adjustForSingleContent(content, {
            sectionfromCollectionFacet: true,
            Title: blocks[0],
            SubSection: subsection
          });
        } else if (content && content.isA("sap.ui.layout.DynamicSideContent")) {
          content = content.getMainContent instanceof Function && content?.getMainContent();
          if (content && content.length === 1) {
            content = content[0];
            this.adjustForSingleContent(content, {
              sectionfromCollectionFacet: true,
              Title: blocks[0],
              SubSection: subsection
            });
          }
        }
      }
    };
    _proto.getSingleContent = function getSingleContent(visibleSubSections) {
      const subSections = visibleSubSections ?? this.getVisibleSubSections();
      if (subSections.length === 1) {
        const blocks = subSections[0].getBlocks();
        if (blocks.length === 1 && blocks[0].isA("sap.fe.templates.ObjectPage.controls.SubSectionBlock")) {
          return blocks[0].getAggregation("content");
        }
        //If there is an invisible text before a standard building block, then also the merge title logic should be applied as its still a single content
        else if (blocks.length === 2 && blocks[0].isA("sap.ui.core.InvisibleText") && blocks[1].isA("sap.fe.templates.ObjectPage.controls.SubSectionBlock")) return blocks[1].getAggregation("content");
      }
    };
    _proto.getVisibleSubSections = function getVisibleSubSections() {
      const subSections = this.getSubSections();
      return subSections.reduce((visibleSubSections, subSection) => {
        if (subSection.getVisible()) {
          visibleSubSections.push(subSection);
        }
        return visibleSubSections;
      }, []);
    };
    _proto.getSectionTitle = function getSectionTitle() {
      let title = this.getTitle();
      if (this.getVisibleSubSections().length === 1) {
        title = this.getVisibleSubSections()[0].getTitle();
      }
      return title;
    };
    _proto.adjustForSingleContent = function adjustForSingleContent(singleContent, sectionDetails) {
      const sectionOnlyContent = singleContent;
      // This function will also be called from the extensionAPI along with some controls by the application developer, the below check is added to cover the cases where the controls passed like sap.m.Title are not implementing the interface
      const contentRole = sectionOnlyContent.getSectionContentRole && sectionOnlyContent.getSectionContentRole();
      if (contentRole === "provider") {
        const infoFromProvider = sectionOnlyContent.getDataFromProvider && sectionOnlyContent.getDataFromProvider(this.useSingleTextAreaFieldAsNotes);
        if (infoFromProvider && this.getTitle() === infoFromProvider.title) {
          this.setTitle(infoFromProvider.title);
          this.setShowTitle(true);
          // TODO: Check if this is really needed?
          this.addStyleClass("sapUiTableOnObjectPageAdjustmentsForSection");
        }
      } else if (contentRole === "consumer") {
        let title = this.getSectionTitle();
        if (sectionDetails?.sectionfromCollectionFacet) {
          title = sectionDetails?.Title?.getText();
          sectionDetails?.Title?.setVisible(false);
          sectionDetails?.SubSection?.setShowTitle(false);
        } else if (sectionDetails?.sectionFromReferenceFacet) {
          title = sectionDetails?.SubSection?.getTitle();
          sectionDetails?.SubSection?.setShowTitle(false);
        }
        if (title === "" && sectionDetails?.SubSection) {
          title = (sectionDetails?.SubSection).getTitle();
        }
        if (sectionOnlyContent.sendDataToConsumer) {
          sectionOnlyContent.sendDataToConsumer({
            titleLevel: this.getTitleLevel(),
            title: title
          });
          this.setShowTitle(false);
          this.addStyleClass("sapUiTableOnObjectPageAdjustmentsForSection");
        }
      } else if (singleContent?.isA("sap.m.Title")) {
        const title = singleContent;
        title.setText(this.getTitle());
        title.setTitleStyle("H4");
        title.setLevel(this.getTitleLevel());
        this.setShowTitle(false);
        this.addStyleClass("sapUiTableOnObjectPageAdjustmentsForSection");
      } else if (this.checkIfNotesReuseComponent(singleContent)) {
        /**
         * Notes Reuse component has the following structure :
         * <VBox id="NoteSection">
         * <MessageStrip id="notesDebugProperties">
         * <List id="NotesList">
         * <headerToolbar>
         * <OverflowToolbar id="noteHeaderOverflowToolbar" style="Standard">
         *       <Title id="noteHeaderOverflowToolbarTitle"/>
         *		......
         *	</OverflowToolbar>
         *	</headerToolbar>
         *	......
         *	</List>
         *	</VBox>
         *	.....
         *
         * We are applying the title merge logic for the title within the overflow toolbar
         * in the following code
         *
         */
        const vBoxItems = singleContent.getItems();
        vBoxItems.forEach(vBoxItem => {
          const headerToolbar = vBoxItem.getAggregation("headerToolbar");
          if (headerToolbar) {
            headerToolbar?.getContent().forEach(control => {
              if (control.isA("sap.m.Title")) {
                const notesTitle = control;
                notesTitle.setText(this.getTitle());
                notesTitle.setTitleStyle("H4");
                notesTitle.setLevel(this.getTitleLevel());
              }
            });
          }
        });
        this.setShowTitle(false);
        this.addStyleClass("sapUiTableOnObjectPageAdjustmentsForSection");
      }
    };
    return Section;
  }(ObjectPageSection), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "onSectionLoaded", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "useSingleTextAreaFieldAsNotes", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _class2)) || _class);
  return Section;
}, false);
//# sourceMappingURL=Section-dbg.js.map
