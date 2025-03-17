/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/mdx-runtime/useMDXComponents", "sap/m/Panel", "sap/fe/base/jsx-runtime/jsx", "sap/fe/base/jsx-runtime/jsxs", "sap/fe/base/jsx-runtime/Fragment"], function (_provideComponents, Panel, _jsx, _jsxs, _Fragment) {
  "use strict";

  function _createMdxContent(props) {
    const _components = Object.assign({
        p: "p",
        pre: "pre",
        code: "code"
      }, _provideComponents(), props.components),
      {
        BuildingBlockPlayground
      } = _components;
    if (!BuildingBlockPlayground) _missingMdxReference("BuildingBlockPlayground", true);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.p, {
        children: "You can use the building blocks provided by SAP Fiori elements even if you built your application without using one of our floorplans. If none of our floorplans suit your use case, you can build a custom app that still runs on the SAP Fiori elements framework, but where all pages are treated like custom pages.\nWhen you create a new application, we recommend that you use the SAP Fiori tools - Application Generator and then choose the \"Custom Page\" template. This template creates an SAP Fiori elements application containing a custom page based on the flexible programming model.\nIn case you want to use our building blocks in an existing SAPUI5 freestyle application, you must make the following changes:"
      }), "\n", _jsxs(Panel, {
        headerText: "1.) Extend sap.fe.AppComponent instead of the UI5 Core Component",
        children: [_jsx(_components.p, {
          children: "You must change your Component.js file to extend the SAP Fiori elements AppComponent instead of the UI5 Core Component. This ensures that your app will run within the SAP Fiori elements framework."
        }), _jsx(_components.pre, {
          children: _jsx(_components.code, {
            className: "language-js",
            children: "sap.ui.define([\"sap/fe/core/AppComponent\"], function (AppComponent) {\n\t\"use strict\";\n\n\treturn AppComponent.extend(\"sap.fe.core.fpmExplorer.guidanceCustomApps.Component\", {\n\t\tmetadata: {\n\t\t\tmanifest: \"json\"\n\t\t}\n\t});\n});\n"
          })
        })]
      }), "\n", _jsxs(Panel, {
        headerText: "2.) Adapt the manifest and wrap your view into the FPM Component provided by SAP Fiori elements",
        children: [_jsx(_components.p, {
          children: "In the manifest, you must wrap each view in which you want to use the building blocks provided by SAP Fiori elements into the FPM component provided by SAP Fiori elements. SAP Fiori elements needs the context path as the pointer to the metadata path."
        }), _jsx(_components.pre, {
          children: _jsx(_components.code, {
            className: "language-json",
            children: "\"targets\": {\n\t\"entryPage\": {\n\t\t\"type\": \"Component\",\n\t\t\"id\": \"entryPage\",\n\t\t\"name\": \"sap.fe.core.fpm\",\n\t\t\"options\": {\n\t\t\t\"settings\": {\n\t\t\t\t\"viewName\": \"your.custom.view\",\n\t\t\t\t\"contextPath\": \"/RootEntity\"\n\t\t\t}\n\t\t}\n\t}\n}\n"
          })
        }), _jsx(_components.p, {
          children: "Note: Because you've added a further component to your application tree, you can't access your app component from the view controller of your custom view via this.getOwnerComponent(). You must use this.getAppComponent() instead."
        })]
      }), "\n", _jsxs(Panel, {
        headerText: "3.) Extend the sap.fe.PageController instead of the UI5 MVC Controller",
        children: [_jsx(_components.p, {
          children: "Extend the page controller of SAP Fiori elements instead of the UI5 MVC controller. Adapt the view controller of your custom page as follows:"
        }), _jsx(_components.pre, {
          children: _jsx(_components.code, {
            className: "language-js",
            children: "sap.ui.define([\"sap/fe/core/PageController\"], function(PageController) {\n\t\"use strict\";\n\n\treturn PageController.extend(\"sap.fe.core.fpmExplorer.guidanceCustomApps.DetailPage\", {\n\t\tonInit() {\n    \t\tPageController.prototype.onInit.apply(this);\n\t\t}\n\t});\n});\n"
          })
        }), _jsxs(_components.p, {
          children: ["Note that you always have to call the ", _jsx(_components.code, {
            children: "onInit"
          }), " of ", _jsx(_components.code, {
            children: "PageController"
          }), " whenever you create your own initialization logic."]
        })]
      }), "\n", _jsxs(Panel, {
        headerText: "You can now use the building blocks provided by SAP Fiori elements",
        height: "400px",
        children: [_jsx(_components.p, {
          children: "Example: Using the 'table' building block. Add the metaPath relative to the contextPath. Click on an entry to navigate to the detail page. This works because we've added the navigation target into the manifest.json, which is then automatically handled by the navigation controller extension provided by SAP Fiori elements."
        }), _jsx(_components.pre, {
          children: _jsx(_components.code, {
            className: "language-xml",
            children: "<fe:Table metaPath=\"@com.sap.vocabularies.UI.v1.LineItem\" id=\"myTable\" />\n"
          })
        }), _jsx(BuildingBlockPlayground, {
          children: `<fe:Table xmlns:fe="sap.fe.macros" metaPath="@com.sap.vocabularies.UI.v1.LineItem" id="myTable" />`
        })]
      }), "\n", _jsx(Panel, {
        headerText: "Handling Edit Mode",
        children: _jsx(_components.p, {
          children: "The building blocks provided by SAP Fiori elements require a 'UI' model with an isEditable property.\nIf you don't use the editFlow controller extension our framework provides, you must set this property yourself.\nIf you want to use a building block in edit mode independent of the UI model, for example when using a dialog, you can explicitly set readOnly to false.\nNote that this also overrides the field control."
        })
      }), "\n", _jsxs(Panel, {
        headerText: "Adding the SAP Fiori Elements Library as a Dependent Library",
        children: [_jsx(_components.p, {
          children: "To benefit from performance optimizations, SAP Fiori elements recommends that you add the SAP Fiori elements library as a dependency to your application.\nBy doing so you ensure the library containing the building blocks and floorplans provided by SAP Fiori elements is preloaded."
        }), _jsx(_components.p, {
          children: "If you want to use SAP Fiori elements building blocks only, you need to add the sap.fe.macros as a dependent library.\nIf you want to additionally use a floorplan provided by SAP Fiori elements (List Report or Object Page), you need to add sap.fe.templates as a dependent library.\nThe sap.fe.templates library has a built-in dependency to sap.fe.macros, so there is no need to add sap.fe.macros as well."
        }), _jsx(_components.p, {
          children: "Enhance the manifest.json of your application as shown in the following sample code:"
        }), _jsx(_components.pre, {
          children: _jsx(_components.code, {
            className: "language-json",
            children: "\"sap.ui5\": {\n\t\"dependencies\": {\n\t\t\"libs\": {\n\t\t...,\n\t\t\"sap.fe.macros\": {}\n\t\t...,\n\t\t}\n\t}\n}\n"
          })
        })]
      })]
    });
  }
  function MDXContent() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      wrapper: MDXLayout
    } = Object.assign({}, _provideComponents(), props.components);
    return MDXLayout ? _jsx(MDXLayout, {
      ...props,
      children: _jsx(_createMdxContent, {
        ...props
      })
    }) : _createMdxContent(props);
  }
  return MDXContent;
  function _missingMdxReference(id, component) {
    throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
  }
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfanN4cyIsIl9GcmFnbWVudCIsImNoaWxkcmVuIiwiX2pzeCIsIl9jb21wb25lbnRzIiwicCIsIlBhbmVsIiwiaGVhZGVyVGV4dCIsInByZSIsImNvZGUiLCJjbGFzc05hbWUiLCJoZWlnaHQiLCJCdWlsZGluZ0Jsb2NrUGxheWdyb3VuZCIsIk1EWENvbnRlbnQiLCJwcm9wcyIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIndyYXBwZXIiLCJNRFhMYXlvdXQiLCJPYmplY3QiLCJhc3NpZ24iLCJfcHJvdmlkZUNvbXBvbmVudHMiLCJjb21wb25lbnRzIiwiX2NyZWF0ZU1keENvbnRlbnQiLCJfbWlzc2luZ01keFJlZmVyZW5jZSIsImlkIiwiY29tcG9uZW50IiwiRXJyb3IiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkVudHJ5UGFnZS5tZHgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhbmVsIGZyb20gXCJzYXAvbS9QYW5lbFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwic2FwL20vQnV0dG9uXCI7XG5cbllvdSBjYW4gdXNlIHRoZSBidWlsZGluZyBibG9ja3MgcHJvdmlkZWQgYnkgU0FQIEZpb3JpIGVsZW1lbnRzIGV2ZW4gaWYgeW91IGJ1aWx0IHlvdXIgYXBwbGljYXRpb24gd2l0aG91dCB1c2luZyBvbmUgb2Ygb3VyIGZsb29ycGxhbnMuIElmIG5vbmUgb2Ygb3VyIGZsb29ycGxhbnMgc3VpdCB5b3VyIHVzZSBjYXNlLCB5b3UgY2FuIGJ1aWxkIGEgY3VzdG9tIGFwcCB0aGF0IHN0aWxsIHJ1bnMgb24gdGhlIFNBUCBGaW9yaSBlbGVtZW50cyBmcmFtZXdvcmssIGJ1dCB3aGVyZSBhbGwgcGFnZXMgYXJlIHRyZWF0ZWQgbGlrZSBjdXN0b20gcGFnZXMuXG5XaGVuIHlvdSBjcmVhdGUgYSBuZXcgYXBwbGljYXRpb24sIHdlIHJlY29tbWVuZCB0aGF0IHlvdSB1c2UgdGhlIFNBUCBGaW9yaSB0b29scyAtIEFwcGxpY2F0aW9uIEdlbmVyYXRvciBhbmQgdGhlbiBjaG9vc2UgdGhlIFwiQ3VzdG9tIFBhZ2VcIiB0ZW1wbGF0ZS4gVGhpcyB0ZW1wbGF0ZSBjcmVhdGVzIGFuIFNBUCBGaW9yaSBlbGVtZW50cyBhcHBsaWNhdGlvbiBjb250YWluaW5nIGEgY3VzdG9tIHBhZ2UgYmFzZWQgb24gdGhlIGZsZXhpYmxlIHByb2dyYW1taW5nIG1vZGVsLlxuSW4gY2FzZSB5b3Ugd2FudCB0byB1c2Ugb3VyIGJ1aWxkaW5nIGJsb2NrcyBpbiBhbiBleGlzdGluZyBTQVBVSTUgZnJlZXN0eWxlIGFwcGxpY2F0aW9uLCB5b3UgbXVzdCBtYWtlIHRoZSBmb2xsb3dpbmcgY2hhbmdlczpcblxuPFBhbmVsIGhlYWRlclRleHQ9e1wiMS4pIEV4dGVuZCBzYXAuZmUuQXBwQ29tcG9uZW50IGluc3RlYWQgb2YgdGhlIFVJNSBDb3JlIENvbXBvbmVudFwifT5cblxuWW91IG11c3QgY2hhbmdlIHlvdXIgQ29tcG9uZW50LmpzIGZpbGUgdG8gZXh0ZW5kIHRoZSBTQVAgRmlvcmkgZWxlbWVudHMgQXBwQ29tcG9uZW50IGluc3RlYWQgb2YgdGhlIFVJNSBDb3JlIENvbXBvbmVudC4gVGhpcyBlbnN1cmVzIHRoYXQgeW91ciBhcHAgd2lsbCBydW4gd2l0aGluIHRoZSBTQVAgRmlvcmkgZWxlbWVudHMgZnJhbWV3b3JrLlxuXG5gYGBqcyB0aXRsZT1cIkNvbXBvbmVudC5qc1wiXG5zYXAudWkuZGVmaW5lKFtcInNhcC9mZS9jb3JlL0FwcENvbXBvbmVudFwiXSwgZnVuY3Rpb24gKEFwcENvbXBvbmVudCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRyZXR1cm4gQXBwQ29tcG9uZW50LmV4dGVuZChcInNhcC5mZS5jb3JlLmZwbUV4cGxvcmVyLmd1aWRhbmNlQ3VzdG9tQXBwcy5Db21wb25lbnRcIiwge1xuXHRcdG1ldGFkYXRhOiB7XG5cdFx0XHRtYW5pZmVzdDogXCJqc29uXCJcblx0XHR9XG5cdH0pO1xufSk7XG5gYGBcblxuPC9QYW5lbD5cbjxQYW5lbCBoZWFkZXJUZXh0PVwiMi4pIEFkYXB0IHRoZSBtYW5pZmVzdCBhbmQgd3JhcCB5b3VyIHZpZXcgaW50byB0aGUgRlBNIENvbXBvbmVudCBwcm92aWRlZCBieSBTQVAgRmlvcmkgZWxlbWVudHNcIj5cblxuICAgIEluIHRoZSBtYW5pZmVzdCwgeW91IG11c3Qgd3JhcCBlYWNoIHZpZXcgaW4gd2hpY2ggeW91IHdhbnQgdG8gdXNlIHRoZSBidWlsZGluZyBibG9ja3MgcHJvdmlkZWQgYnkgU0FQIEZpb3JpIGVsZW1lbnRzIGludG8gdGhlIEZQTSBjb21wb25lbnQgcHJvdmlkZWQgYnkgU0FQIEZpb3JpIGVsZW1lbnRzLiBTQVAgRmlvcmkgZWxlbWVudHMgbmVlZHMgdGhlIGNvbnRleHQgcGF0aCBhcyB0aGUgcG9pbnRlciB0byB0aGUgbWV0YWRhdGEgcGF0aC5cblxuICAgIGBgYGpzb24gdGl0bGU9XCJtYW5pZmVzdC5qc29uXCJcbiAgICBcInRhcmdldHNcIjoge1xuICAgIFx0XCJlbnRyeVBhZ2VcIjoge1xuICAgIFx0XHRcInR5cGVcIjogXCJDb21wb25lbnRcIixcbiAgICBcdFx0XCJpZFwiOiBcImVudHJ5UGFnZVwiLFxuICAgIFx0XHRcIm5hbWVcIjogXCJzYXAuZmUuY29yZS5mcG1cIixcbiAgICBcdFx0XCJvcHRpb25zXCI6IHtcbiAgICBcdFx0XHRcInNldHRpbmdzXCI6IHtcbiAgICBcdFx0XHRcdFwidmlld05hbWVcIjogXCJ5b3VyLmN1c3RvbS52aWV3XCIsXG4gICAgXHRcdFx0XHRcImNvbnRleHRQYXRoXCI6IFwiL1Jvb3RFbnRpdHlcIlxuICAgIFx0XHRcdH1cbiAgICBcdFx0fVxuICAgIFx0fVxuICAgIH1cbiAgICBgYGBcbiAgICBOb3RlOiBCZWNhdXNlIHlvdSd2ZSBhZGRlZCBhIGZ1cnRoZXIgY29tcG9uZW50IHRvIHlvdXIgYXBwbGljYXRpb24gdHJlZSwgeW91IGNhbid0IGFjY2VzcyB5b3VyIGFwcCBjb21wb25lbnQgZnJvbSB0aGUgdmlldyBjb250cm9sbGVyIG9mIHlvdXIgY3VzdG9tIHZpZXcgdmlhIHRoaXMuZ2V0T3duZXJDb21wb25lbnQoKS4gWW91IG11c3QgdXNlIHRoaXMuZ2V0QXBwQ29tcG9uZW50KCkgaW5zdGVhZC5cblxuPC9QYW5lbD5cbjxQYW5lbCBoZWFkZXJUZXh0PXtcIjMuKSBFeHRlbmQgdGhlIHNhcC5mZS5QYWdlQ29udHJvbGxlciBpbnN0ZWFkIG9mIHRoZSBVSTUgTVZDIENvbnRyb2xsZXJcIn0+XG5cdEV4dGVuZCB0aGUgcGFnZSBjb250cm9sbGVyIG9mIFNBUCBGaW9yaSBlbGVtZW50cyBpbnN0ZWFkIG9mIHRoZSBVSTUgTVZDIGNvbnRyb2xsZXIuIEFkYXB0IHRoZSB2aWV3IGNvbnRyb2xsZXIgb2YgeW91ciBjdXN0b20gcGFnZSBhcyBmb2xsb3dzOlxuXHRgYGBqc1xuXHRzYXAudWkuZGVmaW5lKFtcInNhcC9mZS9jb3JlL1BhZ2VDb250cm9sbGVyXCJdLCBmdW5jdGlvbihQYWdlQ29udHJvbGxlcikge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXG4gICAgXHRyZXR1cm4gUGFnZUNvbnRyb2xsZXIuZXh0ZW5kKFwic2FwLmZlLmNvcmUuZnBtRXhwbG9yZXIuZ3VpZGFuY2VDdXN0b21BcHBzLkRldGFpbFBhZ2VcIiwge1xuICAgIFx0XHRvbkluaXQoKSB7XG4gICAgICAgIFx0XHRQYWdlQ29udHJvbGxlci5wcm90b3R5cGUub25Jbml0LmFwcGx5KHRoaXMpO1xuICAgIFx0XHR9XG4gICAgXHR9KTtcbiAgICB9KTtcbiAgICBgYGBcbiAgICBOb3RlIHRoYXQgeW91IGFsd2F5cyBoYXZlIHRvIGNhbGwgdGhlIGBvbkluaXRgIG9mIGBQYWdlQ29udHJvbGxlcmAgd2hlbmV2ZXIgeW91IGNyZWF0ZSB5b3VyIG93biBpbml0aWFsaXphdGlvbiBsb2dpYy5cblxuPC9QYW5lbD5cbjxQYW5lbCBoZWFkZXJUZXh0PXtcIllvdSBjYW4gbm93IHVzZSB0aGUgYnVpbGRpbmcgYmxvY2tzIHByb3ZpZGVkIGJ5IFNBUCBGaW9yaSBlbGVtZW50c1wifSBoZWlnaHQ9e1wiNDAwcHhcIn0+XG5cdEV4YW1wbGU6IFVzaW5nIHRoZSAndGFibGUnIGJ1aWxkaW5nIGJsb2NrLiBBZGQgdGhlIG1ldGFQYXRoIHJlbGF0aXZlIHRvIHRoZSBjb250ZXh0UGF0aC4gQ2xpY2sgb24gYW4gZW50cnkgdG8gbmF2aWdhdGUgdG8gdGhlIGRldGFpbCBwYWdlLiBUaGlzIHdvcmtzIGJlY2F1c2Ugd2UndmUgYWRkZWQgdGhlIG5hdmlnYXRpb24gdGFyZ2V0IGludG8gdGhlIG1hbmlmZXN0Lmpzb24sIHdoaWNoIGlzIHRoZW4gYXV0b21hdGljYWxseSBoYW5kbGVkIGJ5IHRoZSBuYXZpZ2F0aW9uIGNvbnRyb2xsZXIgZXh0ZW5zaW9uIHByb3ZpZGVkIGJ5IFNBUCBGaW9yaSBlbGVtZW50cy5cblxuICAgIGBgYHhtbFxuICAgIDxmZTpUYWJsZSBtZXRhUGF0aD1cIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5MaW5lSXRlbVwiIGlkPVwibXlUYWJsZVwiIC8+XG4gICAgYGBgXG4gICAgPEJ1aWxkaW5nQmxvY2tQbGF5Z3JvdW5kPlxuICAgIFx0e2A8ZmU6VGFibGUgeG1sbnM6ZmU9XCJzYXAuZmUubWFjcm9zXCIgbWV0YVBhdGg9XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIiBpZD1cIm15VGFibGVcIiAvPmB9XG4gICAgPC9CdWlsZGluZ0Jsb2NrUGxheWdyb3VuZD5cblxuPC9QYW5lbD5cbjxQYW5lbCBoZWFkZXJUZXh0PXtcIkhhbmRsaW5nIEVkaXQgTW9kZVwifT5cblx0VGhlIGJ1aWxkaW5nIGJsb2NrcyBwcm92aWRlZCBieSBTQVAgRmlvcmkgZWxlbWVudHMgcmVxdWlyZSBhICdVSScgbW9kZWwgd2l0aCBhbiBpc0VkaXRhYmxlIHByb3BlcnR5LlxuXHRJZiB5b3UgZG9uJ3QgdXNlIHRoZSBlZGl0RmxvdyBjb250cm9sbGVyIGV4dGVuc2lvbiBvdXIgZnJhbWV3b3JrIHByb3ZpZGVzLCB5b3UgbXVzdCBzZXQgdGhpcyBwcm9wZXJ0eSB5b3Vyc2VsZi5cblx0SWYgeW91IHdhbnQgdG8gdXNlIGEgYnVpbGRpbmcgYmxvY2sgaW4gZWRpdCBtb2RlIGluZGVwZW5kZW50IG9mIHRoZSBVSSBtb2RlbCwgZm9yIGV4YW1wbGUgd2hlbiB1c2luZyBhIGRpYWxvZywgeW91IGNhbiBleHBsaWNpdGx5IHNldCByZWFkT25seSB0byBmYWxzZS5cblx0Tm90ZSB0aGF0IHRoaXMgYWxzbyBvdmVycmlkZXMgdGhlIGZpZWxkIGNvbnRyb2wuXG48L1BhbmVsPlxuPFBhbmVsIGhlYWRlclRleHQ9e1wiQWRkaW5nIHRoZSBTQVAgRmlvcmkgRWxlbWVudHMgTGlicmFyeSBhcyBhIERlcGVuZGVudCBMaWJyYXJ5XCJ9PlxuXHRUbyBiZW5lZml0IGZyb20gcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9ucywgU0FQIEZpb3JpIGVsZW1lbnRzIHJlY29tbWVuZHMgdGhhdCB5b3UgYWRkIHRoZSBTQVAgRmlvcmkgZWxlbWVudHMgbGlicmFyeSBhcyBhIGRlcGVuZGVuY3kgdG8geW91ciBhcHBsaWNhdGlvbi5cblx0QnkgZG9pbmcgc28geW91IGVuc3VyZSB0aGUgbGlicmFyeSBjb250YWluaW5nIHRoZSBidWlsZGluZyBibG9ja3MgYW5kIGZsb29ycGxhbnMgcHJvdmlkZWQgYnkgU0FQIEZpb3JpIGVsZW1lbnRzIGlzIHByZWxvYWRlZC5cblxuICAgIElmIHlvdSB3YW50IHRvIHVzZSBTQVAgRmlvcmkgZWxlbWVudHMgYnVpbGRpbmcgYmxvY2tzIG9ubHksIHlvdSBuZWVkIHRvIGFkZCB0aGUgc2FwLmZlLm1hY3JvcyBhcyBhIGRlcGVuZGVudCBsaWJyYXJ5LlxuICAgIElmIHlvdSB3YW50IHRvIGFkZGl0aW9uYWxseSB1c2UgYSBmbG9vcnBsYW4gcHJvdmlkZWQgYnkgU0FQIEZpb3JpIGVsZW1lbnRzIChMaXN0IFJlcG9ydCBvciBPYmplY3QgUGFnZSksIHlvdSBuZWVkIHRvIGFkZCBzYXAuZmUudGVtcGxhdGVzIGFzIGEgZGVwZW5kZW50IGxpYnJhcnkuXG4gICAgVGhlIHNhcC5mZS50ZW1wbGF0ZXMgbGlicmFyeSBoYXMgYSBidWlsdC1pbiBkZXBlbmRlbmN5IHRvIHNhcC5mZS5tYWNyb3MsIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gYWRkIHNhcC5mZS5tYWNyb3MgYXMgd2VsbC5cblxuICAgIEVuaGFuY2UgdGhlIG1hbmlmZXN0Lmpzb24gb2YgeW91ciBhcHBsaWNhdGlvbiBhcyBzaG93biBpbiB0aGUgZm9sbG93aW5nIHNhbXBsZSBjb2RlOlxuICAgIGBgYGpzb24gdGl0bGU9XCJtYW5pZmVzdC5qc29uXCJcbiAgICBcInNhcC51aTVcIjoge1xuICAgIFx0XCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFx0XHRcImxpYnNcIjoge1xuICAgIFx0XHQuLi4sXG4gICAgXHRcdFwic2FwLmZlLm1hY3Jvc1wiOiB7fVxuICAgIFx0XHQuLi4sXG4gICAgXHRcdH1cbiAgICBcdH1cbiAgICB9XG4gICAgYGBgXG5cbjwvUGFuZWw+XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBQUFBLEtBQUEsQ0FBQUMsU0FBQTtNQUFBQyxRQUFBLEdBR0FDLElBQUEsQ0FBQUMsV0FBQSxDQUFBQyxDQUFBO1FBQUFILFFBQUE7TUFFNkgsQ0FBRCxDQUFDLFFBRTdIRixLQUFBLENBQUFNLEtBQUE7UUFBQUMsVUFBQSxFQUFtQixrRUFBa0U7UUFBQUwsUUFBQSxHQUVyRkMsSUFBQSxDQUFBQyxXQUFBLENBQUFDLENBQUE7VUFBQUgsUUFBQTtRQUFvTSxDQUFELENBQUMsRUFFcE1DLElBQUEsQ0FBQUMsV0FBQSxDQUFBSSxHQUFBO1VBQUFOLFFBQUEsRUFBQUMsSUFBQSxDQUFBQyxXQUFBLENBQUFLLElBQUE7WUFBQUMsU0FBQTtZQUFBUixRQUFBO1VBQUEsQ0FVRTtRQUFDLENBQUQsQ0FBQztNQUFBLENBRUksQ0FBQyxRQUNSRixLQUFBLENBQUFNLEtBQUE7UUFBQUMsVUFBQTtRQUFBTCxRQUFBLEdBRUlDLElBQUEsQ0FBQUMsV0FBQSxDQUFBQyxDQUFBO1VBQUFILFFBQUE7UUFBMFAs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