/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/mdx-runtime/useMDXComponents", "sap/m/MessageStrip", "sap/fe/macros/MultiValueField", "sap/m/Panel", "sap/m/CheckBox", "sap/m/FlexBox", "sap/m/VBox", "sap/m/List", "sap/ui/table/Table", "sap/ui/table/Column", "sap/m/Text", "sap/m/Label", "sap/m/StandardListItem", "sap/ui/table/rowmodes/Auto", "sap/fe/base/jsx-runtime/jsx", "sap/fe/base/jsx-runtime/jsxs", "sap/fe/base/jsx-runtime/Fragment"], function (_provideComponents, MessageStrip, MultiValueField, Panel, CheckBox, FlexBox, VBox, List, Table, Column, Text, Label, StandardListItem, Auto, _jsx, _jsxs, _Fragment) {
  "use strict";

  function _createMdxContent(props) {
    const _components = Object.assign({
      p: "p",
      code: "code",
      h2: "h2",
      pre: "pre"
    }, _provideComponents(), props.components);
    return _jsxs(_Fragment, {
      children: [_jsxs(_components.p, {
        children: ["The ", _jsx(_components.code, {
          children: "MultiValueField"
        }), " displays 1:N associations of ", _jsx(_components.code, {
          children: "DataFields"
        }), " or properties.\nIt renders as a ", _jsx(_components.code, {
          children: "MultiInput"
        }), " Field and needs a value help definition on the target property to display the value help."]
      }), "\n", _jsx(_components.h2, {
        children: "metaPath and contextPath"
      }), "\n", _jsxs(_components.p, {
        children: ["To determine what is used in the ", _jsx(_components.code, {
          children: "MultiValueField"
        }), " building block, we use its ", _jsx(_components.code, {
          children: "metaPath"
        }), " and ", _jsx(_components.code, {
          children: "contextPath"
        }), ". This information determines the target object for the building block.\nThe ", _jsx(_components.code, {
          children: "metaPath"
        }), " is mandatory and is relative to the ", _jsx(_components.code, {
          children: "contextPath"
        }), ".\nThe ", _jsx(_components.code, {
          children: "contextPath"
        }), ", if not filled, relates to the context of the page."]
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<macros:MultiValueField metaPath=\"_toChildren/name\" />\n"
        })
      }), "\n", _jsx(Panel, {
        children: _jsxs(VBox, {
          children: [_jsx(CheckBox, {
            text: "Toggle MultiValueField Edit Mode",
            selected: "{ui>/isEditable}",
            select: ".onSelect"
          }), _jsx(FlexBox, {
            alignItems: "Center",
            children: _jsx(MultiValueField, {
              binding: "/RootEntity('1')",
              metaPath: "_toChildren/name",
              id: "SomeUniqueID"
            })
          })]
        })
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.h2, {
        children: "Display of a hierarchy within a Value Help"
      }), "\n", _jsxs(_components.p, {
        children: ["If the ValueList of the target's property is annotated with a ", _jsx(_components.code, {
          children: "PresentationVariantQualifier"
        }), " and if this latter is annotated with a ", _jsx(_components.code, {
          children: "PresentationVariantQualifier"
        }), " (corresponding to the ", _jsx(_components.code, {
          children: "hierarchyQualifier"
        }), "),\nthen the table of the Value Help will be a Tree Table."]
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<macros:MultiValueField metaPath=\"_PreferredNode/ID\" />\n"
        })
      }), "\n", _jsx(Panel, {
        children: _jsxs(VBox, {
          children: [_jsx(CheckBox, {
            text: "Toggle MultiValueField Edit Mode",
            selected: "{ui>/isEditable}",
            select: ".onSelect"
          }), _jsx(FlexBox, {
            alignItems: "Center",
            children: _jsx(MultiValueField, {
              binding: "/RootEntity('1')",
              metaPath: "_PreferredNode/ID",
              id: "VHWithTreeTable"
            })
          })]
        })
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.h2, {
        children: "Attribute 'readOnly'"
      }), "\n", _jsxs(_components.p, {
        children: ["The ", _jsx(_components.code, {
          children: "MultiValueField"
        }), " can be used with or without editing and the corresponding ", _jsx(_components.code, {
          children: "ValueHelp"
        }), ", depending on the attribute 'readOnly'."]
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<macros:MultiValueField metaPath=\"_toChildren/name\" readOnly=\"true\" />\n"
        })
      }), "\n", _jsx(Panel, {
        children: _jsx(MultiValueField, {
          id: "MyReadOnlyMVF",
          binding: "/RootEntity('1')",
          metaPath: "_toChildren/name",
          readOnly: "true"
        })
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.h2, {
        children: "Allowed targets"
      }), "\n", _jsxs(_components.p, {
        children: ["The ", _jsx(_components.code, {
          children: "metaPath"
        }), " can point to one of the following:"]
      }), "\n", _jsxs(_components.p, {
        children: ["\xA0-\xA0\xA0a ", _jsx(_components.code, {
          children: "Property"
        })]
      }), "\n", _jsxs(_components.p, {
        children: ["\xA0-\xA0\xA0a ", _jsx(_components.code, {
          children: "DataField"
        })]
      }), "\n", _jsxs(_components.p, {
        children: ["To Point to a ", _jsx(_components.code, {
          children: "DataField"
        }), ", we need to point to an annotation like a ", _jsx(_components.code, {
          children: "FieldGroup"
        }), " with its qualifier and its data aggregation."]
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<macros:MultiValueField\n\tmetaPath=\"_toChildren/@com.sap.vocabularies.UI.v1.FieldGroup#Default/Data/0\"\n\tid=\"SomeUniqueIDForFieldGroupScenario\"\n\treadOnly=\"true\"\n/>\n"
        })
      }), "\n", _jsx(Panel, {
        children: _jsx(MultiValueField, {
          binding: "/RootEntity('1')",
          metaPath: "_toChildren/@com.sap.vocabularies.UI.v1.FieldGroup#Default/Data/0",
          id: "SomeUniqueIDForFieldGroupScenario",
          readOnly: "true"
        })
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.h2, {
        children: "Table sample"
      }), "\n", _jsx(_components.p, {
        children: "It is possible to use the MultiValueField inside a table, even inside the table building block. Due to performance reasons we strongly recommend adding the MultiValueField as an annotation, instead of as a custom column."
      }), "\n", _jsx(MessageStrip, {
        text: "Adding a building block Field or MultiValueField to the table as a custom column will generate a ValueHelp for each row. This is only allowed for use cases with a defined and limited number of rows.",
        showIcon: "true",
        type: "Information",
        enableFormattedText: "true"
      }), "\n", _jsx(_components.p, {
        children: "\xA0"
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<table:Table rows=\"{/RootEntity}\" xmlns:table=\"sap.ui.table\" xmlns=\"sap.m\">\n\t<table:columns>\n\t\t<table:Column width=\"9rem\">\n\t\t\t<Label text=\"ID\" />\n\t\t\t<template>\n\t\t\t\t<Text text=\"{ID}\" />\n\t\t\t</template>\n\t\t</table:Column>\n\t\t,\n\t\t<Column width=\"9rem\">\n\t\t\t<Label text=\"MultiValueField\" />\n\t\t\t<template>\n\t\t\t\t<MultiValueField id=\"CustomColumnMVF\" metaPath=\"_toChildren/description\" />\n\t\t\t</template>\n\t\t</Column>\n\t</table:columns>\n</table:Table>\n"
        })
      }), "\n", _jsxs(Table, {
        rows: "{/RootEntity}",
        children: [{
          columns: [_jsxs(Column, {
            width: "9rem",
            children: [_jsx(Label, {
              text: "ID"
            }), {
              template: _jsx(Text, {
                text: "{ID}"
              })
            }]
          }), _jsxs(Column, {
            width: "9rem",
            children: [_jsx(Label, {
              text: "MultiValueField"
            }), {
              template: _jsx(MultiValueField, {
                id: "CustomColumnMVF",
                metaPath: "_toChildren/description"
              })
            }]
          })]
        }, {
          rowMode: _jsx(Auto, {
            maxRowCount: "3"
          })
        }]
      }), "\n", _jsx(_components.h2, {
        children: "MultiValueField binding to the JSON Model"
      }), "\n", _jsx(_components.p, {
        children: "It is possible to bind MultiValueField to the JSON Model and get values from it."
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-xml",
          children: "<macros:MultiValueField id=\"multiValueFieldBinding\" metaPath=\"_toChildren/name\" items=\"{jsonModel>/Students}\" readOnly=\"false\" />\n"
        })
      }), "\n", _jsx(Panel, {
        children: _jsxs(VBox, {
          children: [_jsx(MultiValueField, {
            binding: "/RootEntity('1')",
            id: "multiValueFieldBinding",
            metaPath: "_toChildren/name",
            readOnly: "false",
            items: "{jsonModel>/Students}"
          }), _jsx(List, {
            headerText: "JSON Model bound values for jsonModel>/Students",
            items: "jsonModel>/Students",
            children: {
              items: _jsx(StandardListItem, {
                title: "{jsonModel>name}"
              })
            }
          })]
        })
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
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfanN4cyIsIl9GcmFnbWVudCIsImNoaWxkcmVuIiwiX2NvbXBvbmVudHMiLCJwIiwiX2pzeCIsImNvZGUiLCJoMiIsInByZSIsImNsYXNzTmFtZSIsIlBhbmVsIiwiVkJveCIsIkNoZWNrQm94IiwidGV4dCIsInNlbGVjdGVkIiwic2VsZWN0IiwiRmxleEJveCIsImFsaWduSXRlbXMiLCJNdWx0aVZhbHVlRmllbGQiLCJiaW5kaW5nIiwibWV0YVBhdGgiLCJpZCIsInJlYWRPbmx5IiwiTWVzc2FnZVN0cmlwIiwic2hvd0ljb24iLCJ0eXBlIiwiZW5hYmxlRm9ybWF0dGVkVGV4dCIsIlRhYmxlIiwicm93cyIsImNvbHVtbnMiLCJDb2x1bW4iLCJ3aWR0aCIsIkxhYmVsIiwidGVtcGxhdGUiLCJUZXh0Iiwicm93TW9kZSIsIkF1dG8iLCJtYXhSb3dDb3VudCIsIml0ZW1zIiwiTGlzdCIsImhlYWRlclRleHQiLCJTdGFuZGFyZExpc3RJdGVtIiwidGl0bGUiLCJNRFhDb250ZW50IiwicHJvcHMiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJ3cmFwcGVyIiwiTURYTGF5b3V0IiwiT2JqZWN0IiwiYXNzaWduIiwiX3Byb3ZpZGVDb21wb25lbnRzIiwiY29tcG9uZW50cyIsIl9jcmVhdGVNZHhDb250ZW50Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJNdWx0aVZhbHVlRmllbGQubWR4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNZXNzYWdlU3RyaXAgZnJvbSBcInNhcC9tL01lc3NhZ2VTdHJpcFwiO1xuaW1wb3J0IE11bHRpVmFsdWVGaWVsZCBmcm9tIFwic2FwL2ZlL21hY3Jvcy9NdWx0aVZhbHVlRmllbGRcIjtcbmltcG9ydCBQYW5lbCBmcm9tIFwic2FwL20vUGFuZWxcIjtcbmltcG9ydCBDaGVja0JveCBmcm9tIFwic2FwL20vQ2hlY2tCb3hcIjtcbmltcG9ydCBGbGV4Qm94IGZyb20gXCJzYXAvbS9GbGV4Qm94XCI7XG5pbXBvcnQgVkJveCBmcm9tIFwic2FwL20vVkJveFwiO1xuaW1wb3J0IExpc3QgZnJvbSBcInNhcC9tL0xpc3RcIjtcbmltcG9ydCBUYWJsZSBmcm9tIFwic2FwL3VpL3RhYmxlL1RhYmxlXCI7XG5pbXBvcnQgQ29sdW1uIGZyb20gXCJzYXAvdWkvdGFibGUvQ29sdW1uXCI7XG5pbXBvcnQgVGV4dCBmcm9tIFwic2FwL20vVGV4dFwiO1xuaW1wb3J0IExhYmVsIGZyb20gXCJzYXAvbS9MYWJlbFwiO1xuaW1wb3J0IFN0YW5kYXJkTGlzdEl0ZW0gZnJvbSBcInNhcC9tL1N0YW5kYXJkTGlzdEl0ZW1cIjtcbmltcG9ydCBBdXRvIGZyb20gXCJzYXAvdWkvdGFibGUvcm93bW9kZXMvQXV0b1wiO1xuXG5UaGUgYE11bHRpVmFsdWVGaWVsZGAgZGlzcGxheXMgMTpOIGFzc29jaWF0aW9ucyBvZiBgRGF0YUZpZWxkc2Agb3IgcHJvcGVydGllcy5cbkl0IHJlbmRlcnMgYXMgYSBgTXVsdGlJbnB1dGAgRmllbGQgYW5kIG5lZWRzIGEgdmFsdWUgaGVscCBkZWZpbml0aW9uIG9uIHRoZSB0YXJnZXQgcHJvcGVydHkgdG8gZGlzcGxheSB0aGUgdmFsdWUgaGVscC5cblxuIyMgbWV0YVBhdGggYW5kIGNvbnRleHRQYXRoXG5cblRvIGRldGVybWluZSB3aGF0IGlzIHVzZWQgaW4gdGhlIGBNdWx0aVZhbHVlRmllbGRgIGJ1aWxkaW5nIGJsb2NrLCB3ZSB1c2UgaXRzIGBtZXRhUGF0aGAgYW5kIGBjb250ZXh0UGF0aGAuIFRoaXMgaW5mb3JtYXRpb24gZGV0ZXJtaW5lcyB0aGUgdGFyZ2V0IG9iamVjdCBmb3IgdGhlIGJ1aWxkaW5nIGJsb2NrLlxuVGhlIGBtZXRhUGF0aGAgaXMgbWFuZGF0b3J5IGFuZCBpcyByZWxhdGl2ZSB0byB0aGUgYGNvbnRleHRQYXRoYC5cblRoZSBgY29udGV4dFBhdGhgLCBpZiBub3QgZmlsbGVkLCByZWxhdGVzIHRvIHRoZSBjb250ZXh0IG9mIHRoZSBwYWdlLlxuXG5gYGB4bWxcbjxtYWNyb3M6TXVsdGlWYWx1ZUZpZWxkIG1ldGFQYXRoPVwiX3RvQ2hpbGRyZW4vbmFtZVwiIC8+XG5gYGBcblxuPFBhbmVsPlxuXHQ8VkJveD5cblx0XHQ8Q2hlY2tCb3ggdGV4dD1cIlRvZ2dsZSBNdWx0aVZhbHVlRmllbGQgRWRpdCBNb2RlXCIgc2VsZWN0ZWQ9XCJ7dWk+L2lzRWRpdGFibGV9XCIgc2VsZWN0PVwiLm9uU2VsZWN0XCIgLz5cblx0XHQ8RmxleEJveCBhbGlnbkl0ZW1zPVwiQ2VudGVyXCI+XG5cdFx0XHQ8TXVsdGlWYWx1ZUZpZWxkIGJpbmRpbmc9XCIvUm9vdEVudGl0eSgnMScpXCIgbWV0YVBhdGg9XCJfdG9DaGlsZHJlbi9uYW1lXCIgaWQ9XCJTb21lVW5pcXVlSURcIiAvPlxuXHRcdDwvRmxleEJveD5cblx0PC9WQm94PlxuPC9QYW5lbD5cbiZuYnNwO1xuXG4jIyBEaXNwbGF5IG9mIGEgaGllcmFyY2h5IHdpdGhpbiBhIFZhbHVlIEhlbHBcblxuSWYgdGhlIFZhbHVlTGlzdCBvZiB0aGUgdGFyZ2V0J3MgcHJvcGVydHkgaXMgYW5ub3RhdGVkIHdpdGggYSBgUHJlc2VudGF0aW9uVmFyaWFudFF1YWxpZmllcmAgYW5kIGlmIHRoaXMgbGF0dGVyIGlzIGFubm90YXRlZCB3aXRoIGEgYFByZXNlbnRhdGlvblZhcmlhbnRRdWFsaWZpZXJgIChjb3JyZXNwb25kaW5nIHRvIHRoZSBgaGllcmFyY2h5UXVhbGlmaWVyYCksXG50aGVuIHRoZSB0YWJsZSBvZiB0aGUgVmFsdWUgSGVscCB3aWxsIGJlIGEgVHJlZSBUYWJsZS5cblxuYGBgeG1sXG48bWFjcm9zOk11bHRpVmFsdWVGaWVsZCBtZXRhUGF0aD1cIl9QcmVmZXJyZWROb2RlL0lEXCIgLz5cbmBgYFxuXG48UGFuZWw+XG5cdDxWQm94PlxuXHRcdDxDaGVja0JveCB0ZXh0PVwiVG9nZ2xlIE11bHRpVmFsdWVGaWVsZCBFZGl0IE1vZGVcIiBzZWxlY3RlZD1cInt1aT4vaXNFZGl0YWJsZX1cIiBzZWxlY3Q9XCIub25TZWxlY3RcIiAvPlxuXHRcdDxGbGV4Qm94IGFsaWduSXRlbXM9XCJDZW50ZXJcIj5cblx0XHRcdDxNdWx0aVZhbHVlRmllbGQgYmluZGluZz1cIi9Sb290RW50aXR5KCcxJylcIiBtZXRhUGF0aD1cIl9QcmVmZXJyZWROb2RlL0lEXCIgaWQ9XCJWSFdpdGhUcmVlVGFibGVcIiAvPlxuXHRcdDwvRmxleEJveD5cblx0PC9WQm94PlxuPC9QYW5lbD5cbiZuYnNwO1xuXG4jIyBBdHRyaWJ1dGUgJ3JlYWRPbmx5J1xuXG5UaGUgYE11bHRpVmFsdWVGaWVsZGAgY2FuIGJlIHVzZWQgd2l0aCBvciB3aXRob3V0IGVkaXRpbmcgYW5kIHRoZSBjb3JyZXNwb25kaW5nIGBWYWx1ZUhlbHBgLCBkZXBlbmRpbmcgb24gdGhlIGF0dHJpYnV0ZSAncmVhZE9ubHknLlxuXG5gYGB4bWxcbjxtYWNyb3M6TXVsdGlWYWx1ZUZpZWxkIG1ldGFQYXRoPVwiX3RvQ2hpbGRyZW4vbmFtZVwiIHJlYWRPbmx5PVwidHJ1ZVwiIC8+XG5gYGBcblxuPFBhbmVsPlxuXHQ8TXVsdGlWYWx1ZUZpZWxkIGlkPVwiTXlSZWFkT25seU1WRlwiIGJpbmRpbmc9XCIvUm9vdEVudGl0eSgnMScpXCIgbWV0YVBhdGg9XCJfdG9DaGlsZHJlbi9uYW1lXCIgcmVhZE9ubHk9XCJ0cnVlXCIgLz5cbjwvUGFuZWw+XG5cbiZuYnNwO1xuXG4jIyBBbGxvd2VkIHRhcmdldHNcblxuVGhlIGBtZXRhUGF0aGAgY2FuIHBvaW50IHRvIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuXG4mbmJzcDtcXC0mbmJzcDsmbmJzcDthIGBQcm9wZXJ0eWBcblxuJm5ic3A7XFwtJm5ic3A7Jm5ic3A7YSBgRGF0YUZpZWxkYFxuXG5UbyBQb2ludCB0byBhIGBEYXRhRmllbGRgLCB3ZSBuZWVkIHRvIHBvaW50IHRvIGFuIGFubm90YXRpb24gbGlrZSBhIGBGaWVsZEdyb3VwYCB3aXRoIGl0cyBxdWFsaWZpZXIgYW5kIGl0cyBkYXRhIGFnZ3JlZ2F0aW9uLlxuXG5gYGB4bWxcbjxtYWNyb3M6TXVsdGlWYWx1ZUZpZWxkXG5cdG1ldGFQYXRoPVwiX3RvQ2hpbGRyZW4vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXAjRGVmYXVsdC9EYXRhLzBcIlxuXHRpZD1cIlNvbWVVbmlxdWVJREZvckZpZWxkR3JvdXBTY2VuYXJpb1wiXG5cdHJlYWRPbmx5PVwidHJ1ZVwiXG4vPlxuYGBgXG5cbjxQYW5lbD5cblx0PE11bHRpVmFsdWVGaWVsZFxuXHRcdGJpbmRpbmc9XCIvUm9vdEVudGl0eSgnMScpXCJcblx0XHRtZXRhUGF0aD1cIl90b0NoaWxkcmVuL0Bjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GaWVsZEdyb3VwI0RlZmF1bHQvRGF0YS8wXCJcblx0XHRpZD1cIlNvbWVVbmlxdWVJREZvckZpZWxkR3JvdXBTY2VuYXJpb1wiXG5cdFx0cmVhZE9ubHk9XCJ0cnVlXCJcblx0Lz5cbjwvUGFuZWw+XG4mbmJzcDtcblxuIyMgVGFibGUgc2FtcGxlXG5cbkl0IGlzIHBvc3NpYmxlIHRvIHVzZSB0aGUgTXVsdGlWYWx1ZUZpZWxkIGluc2lkZSBhIHRhYmxlLCBldmVuIGluc2lkZSB0aGUgdGFibGUgYnVpbGRpbmcgYmxvY2suIER1ZSB0byBwZXJmb3JtYW5jZSByZWFzb25zIHdlIHN0cm9uZ2x5IHJlY29tbWVuZCBhZGRpbmcgdGhlIE11bHRpVmFsdWVGaWVsZCBhcyBhbiBhbm5vdGF0aW9uLCBpbnN0ZWFkIG9mIGFzIGEgY3VzdG9tIGNvbHVtbi5cblxuPE1lc3NhZ2VTdHJpcFxuXHR0ZXh0PVwiQWRkaW5nIGEgYnVpbGRpbmcgYmxvY2sgRmllbGQgb3IgTXVsdGlWYWx1ZUZpZWxkIHRvIHRoZSB0YWJsZSBhcyBhIGN1c3RvbSBjb2x1bW4gd2lsbCBnZW5lcmF0ZSBhIFZhbHVlSGVscCBmb3IgZWFjaCByb3cuIFRoaXMgaXMgb25seSBhbGxvd2VkIGZvciB1c2UgY2FzZXMgd2l0aCBhIGRlZmluZWQgYW5kIGxpbWl0ZWQgbnVtYmVyIG9mIHJvd3MuXCJcblx0c2hvd0ljb249XCJ0cnVlXCJcblx0dHlwZT1cIkluZm9ybWF0aW9uXCJcblx0ZW5hYmxlRm9ybWF0dGVkVGV4dD1cInRydWVcIlxuLz5cbiZuYnNwO1xuXG5gYGB4bWxcbjx0YWJsZTpUYWJsZSByb3dzPVwiey9Sb290RW50aXR5fVwiIHhtbG5zOnRhYmxlPVwic2FwLnVpLnRhYmxlXCIgeG1sbnM9XCJzYXAubVwiPlxuXHQ8dGFibGU6Y29sdW1ucz5cblx0XHQ8dGFibGU6Q29sdW1uIHdpZHRoPVwiOXJlbVwiPlxuXHRcdFx0PExhYmVsIHRleHQ9XCJJRFwiIC8+XG5cdFx0XHQ8dGVtcGxhdGU+XG5cdFx0XHRcdDxUZXh0IHRleHQ9XCJ7SUR9XCIgLz5cblx0XHRcdDwvdGVtcGxhdGU+XG5cdFx0PC90YWJsZTpDb2x1bW4+XG5cdFx0LFxuXHRcdDxDb2x1bW4gd2lkdGg9XCI5cmVtXCI+XG5cdFx0XHQ8TGFiZWwgdGV4dD1cIk11bHRpVmFsdWVGaWVsZFwiIC8+XG5cdFx0XHQ8dGVtcGxhdGU+XG5cdFx0XHRcdDxNdWx0aVZhbHVlRmllbGQgaWQ9XCJDdXN0b21Db2x1bW5NVkZcIiBtZXRhUGF0aD1cIl90b0NoaWxkcmVuL2Rlc2NyaXB0aW9uXCIgLz5cblx0XHRcdDwvdGVtcGxhdGU+XG5cdFx0PC9Db2x1bW4+XG5cdDwvdGFibGU6Y29sdW1ucz5cbjwvdGFibGU6VGFibGU+XG5gYGBcblxuPFRhYmxlIHJvd3M9XCJ7L1Jvb3RFbnRpdHl9XCI+XG5cdHt7XG5cdFx0Y29sdW1uczogW1xuXHRcdFx0PENvbHVtbiB3aWR0aD1cIjlyZW1cIj5cblx0XHRcdFx0PExhYmVsIHRleHQ9XCJJRFwiIC8+XG5cdFx0XHRcdHt7XG5cdFx0XHRcdFx0dGVtcGxhdGU6IDxUZXh0IHRleHQ9XCJ7SUR9XCIgLz5cblx0XHRcdFx0fX1cblx0XHRcdDwvQ29sdW1uPixcblx0XHRcdDxDb2x1bW4gd2lkdGg9XCI5cmVtXCI+XG5cdFx0XHRcdDxMYWJlbCB0ZXh0PVwiTXVsdGlWYWx1ZUZpZWxkXCIgLz5cblx0XHRcdFx0e3tcblx0XHRcdFx0XHR0ZW1wbGF0ZTogPE11bHRpVmFsdWVGaWVsZCBpZD1cIkN1c3RvbUNvbHVtbk1WRlwiIG1ldGFQYXRoPVwiX3RvQ2hpbGRyZW4vZGVzY3JpcHRpb25cIiAvPlxuXHRcdFx0XHR9fVxuXHRcdFx0PC9Db2x1bW4+XG5cdFx0XVxuXHR9fVxuXHR7eyByb3dNb2RlOiA8QXV0byBtYXhSb3dDb3VudD1cIjNcIiAvPiB9fVxuPC9UYWJsZT5cblxuIyMgTXVsdGlWYWx1ZUZpZWxkIGJpbmRpbmcgdG8gdGhlIEpTT04gTW9kZWxcblxuSXQgaXMgcG9zc2libGUgdG8gYmluZCBNdWx0aVZhbHVlRmllbGQgdG8gdGhlIEpTT04gTW9kZWwgYW5kIGdldCB2YWx1ZXMgZnJvbSBpdC5cblxuYGBgeG1sXG48bWFjcm9zOk11bHRpVmFsdWVGaWVsZCBpZD1cIm11bHRpVmFsdWVGaWVsZEJpbmRpbmdcIiBtZXRhUGF0aD1cIl90b0NoaWxkcmVuL25hbWVcIiBpdGVtcz1cIntqc29uTW9kZWw+L1N0dWRlbnRzfVwiIHJlYWRPbmx5PVwiZmFsc2VcIiAvPlxuYGBgXG5cbjxQYW5lbD5cblx0PFZCb3g+XG5cdFx0PE11bHRpVmFsdWVGaWVsZFxuXHRcdFx0YmluZGluZz1cIi9Sb290RW50aXR5KCcxJylcIlxuXHRcdFx0aWQ9XCJtdWx0aVZhbHVlRmllbGRCaW5kaW5nXCJcblx0XHRcdG1ldGFQYXRoPVwiX3RvQ2hpbGRyZW4vbmFtZVwiXG5cdFx0XHRyZWFkT25seT1cImZhbHNlXCJcblx0XHRcdGl0ZW1zPVwie2pzb25Nb2RlbD4vU3R1ZGVudHN9XCJcblx0XHQvPlxuXHRcdDxMaXN0IGhlYWRlclRleHQ9XCJKU09OIE1vZGVsIGJvdW5kIHZhbHVlcyBmb3IganNvbk1vZGVsPi9TdHVkZW50c1wiIGl0ZW1zPVwianNvbk1vZGVsPi9TdHVkZW50c1wiPlxuXHRcdFx0e3tcblx0XHRcdFx0aXRlbXM6IDxTdGFuZGFyZExpc3RJdGVtIHRpdGxlPVwie2pzb25Nb2RlbD5uYW1lfVwiIC8+XG5cdFx0XHR9fVxuXHRcdDwvTGlzdD5cblx0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aUI7Z0JBQUNELFFBQVEsRUFBQztjQUF5QixDQUFFO1lBQ3JGLENBQUM7VUFBQSxDQUNNLENBQUM7UUFFWCxDQUFDLEVBQ0E7VUFBRWUsT0FBTyxFQUFFOUIsSUFBQSxDQUFDK0IsSUFBSTtZQUFDQyxXQUFXLEVBQUM7VUFBRyxDQUFFO1FBQUUsQ0FBQztNQUFBLENBQ2hDLENBQUMsUUFFUmhDLElBQUEsQ0FBQUYsV0FBQSxDQUFBSSxFQUFBO1FBQUFMLFFBQUEsRUFBRztNQUF5QyxDQUFELENBQUMsUUFFNUNHLElBQUEsQ0FBQUYsV0FBQSxDQUFBQyxDQUFBO1FBQUFGLFFBQUE7TUFBZ0YsQ0FBRCxDQUFDLFFBRWhGRyxJQUFBLENBQUFGLFdBQUEsQ0FBQUssR0FBQTtRQUFBTixRQUFBLEVBQUFHLElBQUEsQ0FBQUYsV0FBQSxDQUFBRyxJQUFBO1VBQUFHLFNBQUE7VUFBQVAsUUFBQTtRQUFBLENBRUU7TUFBQyxDQUFELENBQUMsUUFFSEcsSUFBQSxDQUFBSyxLQUFBO1FBQUFSLFFBQUEsRUFDQ0YsS0FBQSxDQUFBVyxJQUFBO1VBQUFULFFBQUEsR0FDQ0csSUFBQSxDQUFBYSxlQUFBO1lBQUFDLE9BQUE7WUFBQUUsRUFBQTtZQUFBRCxRQUFBO1lBQUFFLFFBQUE7WUFBQWdCLEtBQUE7VUFBQSxDQU1DLENBQUMsRUFDRmpDLElBQUEsQ0FBQWtDLElBQUE7WUFBQUMsVUFBQTtZQUFBRixLQUFBO1lBQUFwQyxRQUFBLEVBQ0U7Y0FDQW9DLEtBQUssRUFBRWpDLElBQUEsQ0FBQ29DLGdCQUFnQjtnQkFBQ0MsS0FBSyxFQUFDO2NBQWtCLENBQUU7WUFDcEQ7VUFBQyxDQUNJLENBQUM7UUFBQSxDQUNGO01BQUMsQ0FDRCxDQUFDO0lBQUEsQ0FDUjtFQUFBO0VBQUEsU0FBQUMsV0FBQTtJQUFBLElBQUFDLEtBQUEsR0FBQUMsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBO0lBQUE7TUFBQUcsT0FBQSxFQUFBQztJQUFBLElBQUFDLE1BQUEsQ0FBQUMsTUFBQSxLQUFBQyxrQkFBQSxJQUFBUixLQUFBLENBQUFTLFVBQUE7SUFBQSxPQUFBSixTQUFBLEdBQUE1QyxJQUFBLENBQUE0QyxTQUFBO01BQUEsR0FBQUwsS0FBQTtNQUFBMUMsUUFBQSxFQUFBRyxJQUFBLENBQUFpRCxpQkFBQTtRQUFBLEdBQUFWO01BQUE7SUFBQSxLQUFBVSxpQkFBQSxDQUFBVixLQUFBO0VBQUE7RUFBQSxPQUFBRCxVQUFBO0FBQUEiLCJpZ25vcmVMaXN0IjpbXX0=