// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The <code>sap.ushell_abap.pbServices.ui2.ChipDefinition</code> object, representing an XML document
 * which defines a CHIP.
 */

sap.ui.define([
    "sap/ushell_abap/pbServices/ui2/Error"
], function (
    SrvcError
) {
    "use strict";



    var sNAMESPACE = "http://schemas.sap.com/sapui2/services/Chip/1";

    // "private" methods (static) without need to access properties -------------

    /**
     * Returns the local name of the given DOM node.
     * @param {object} oDomNode
     *   the DOM node
     * @returns {string}
     *   the local name
     */
    function getLocalName (oDomNode) {
        // Caution: In IE9 the ActiveX XML parser used in utils.js knows localName, however the
        // XMLHttpRequest doesn't and uses baseName instead!
        return oDomNode.localName || oDomNode.baseName; // W3C vs. IE
    }

    /**
     * Returns the value of the given DOM element's attribute with the given name.
     * <p>
     * Note: We currently expect the attribute not to have a namespace.
     *
     * @param {object} oDomElement
     *   the DOM element
     * @param {string} sName
     *   the attribute name
     * @returns {string}
     *   the attribute value or <code>""</code> if the attribute is not defined
     */
    function getAttribute (oDomElement, sName) {
        var oAttribute, aAttributes, i, n;
        if (typeof oDomElement.getAttributeNS === "function") {
            return oDomElement.getAttributeNS(null, sName);
        }
        // ugly workaround for IE's XMLHttpRequest which doesn't know getAttributeNS, but knows the
        // attribute's namespace
        aAttributes = oDomElement.attributes;
        for (i = 0, n = aAttributes.length; i < n; i += 1) {
            oAttribute = aAttributes[i];
            if (!oAttribute.namespaceURI && getLocalName(oAttribute) === sName) {
                return oAttribute.nodeValue;
            }
        }
        return "";
    }

    /**
     * Returns the text content of the given DOM node.
     *
     * @param {object} oDomNode
     *   the DOM node
     * @returns {string}
     *   the text content (might be <code>""</code> but not <code>undefined</code>
     *   or <code>null</code>)
     */
    function getText (oDomNode) {
        // Note: IE returns "" where FF returns undefined for empty nodes; this leads into trouble
        // when cloning an object via JSON later on!
        return oDomNode.textContent || oDomNode.text || ""; // W3C vs. IE
    }

    /**
     * Visits the children of the given DOM node and call the given handler for each child node
     * with the corresponding name.
     * @param {object} oThat
     *  this used for calling the handlers from <code>mChildHandlers</code>
     * @param {object} oDomNode
     *   the DOM node
     * @param {Object<string,function(object)>} mChildHandlers
     *   maps the child name to a handler function. The handler function's parameter is the DOM node.
     */
    function visit (oThat, oDomNode, mChildHandlers) {
        var oChild,
            aChildren = oDomNode.childNodes,
            fnHandler,
            i,
            n;

        for (i = 0, n = aChildren.length; i < n; i += 1) {
            oChild = aChildren[i];
            if (oChild.namespaceURI === sNAMESPACE) {
                fnHandler = mChildHandlers[getLocalName(oChild)];
                if (fnHandler) {
                    fnHandler.call(oThat, oChild);
                }
            }
        }
    }

    // "public class" -----------------------------------------------------------

    /**
     * Constructs a new representation of a CHIP definition from the given XML document. We expect
     * the XML document to conform to the schema.
     *
     * @param {object} oXml
     *    The DOM representation of the XML document
     *
     * @class
     * @see sap.ushell_abap.pbServices.ui2.Chip
     * @since 1.2.0
     */
    var ChipDefinition = function (oXml) {
        var that = this;

        if (oXml instanceof ChipDefinition) {
            // undocumented "copy constructor", performs deep clone and copies existing stuff only!
            oXml = JSON.parse(JSON.stringify(oXml));
            ["appearance", "contracts", "id", "implementation"].forEach(function (sName) {
                if (Object.prototype.hasOwnProperty.call(oXml, sName)) {
                    that[sName] = oXml[sName];
                }
            });
            return;
        }

        if (getLocalName(oXml.documentElement) !== "chip"
            || oXml.documentElement.namespaceURI !== sNAMESPACE) {
            throw new SrvcError("Missing root <chip>", "ChipDefinition");
        }

        visit(this, oXml.documentElement, {
            appearance: function (oAppearanceNode) {
                this.appearance = {};

                visit(this.appearance, oAppearanceNode, {
                    description: function (oDescriptionNode) {
                        this.description = getText(oDescriptionNode);
                    },

                    title: function (oTitleNode) {
                        this.title = getText(oTitleNode);
                    }
                });
            },

            contracts: function (oContractsNode) {
                this.contracts = {};

                visit(this.contracts, oContractsNode, {
                    consume: function (oConsumeNode) {
                        var sId = getAttribute(oConsumeNode, "id");
                        this[sId] = {};

                        visit(this[sId], oConsumeNode, {
                            parameters: function (oParametersNode) {
                                this.parameters = {};

                                visit(this.parameters, oParametersNode, {
                                    parameter: function (oParameterNode) {
                                        var sName = getAttribute(oParameterNode, "name");
                                        this[sName] = getText(oParameterNode);
                                    }
                                });
                            }
                        });
                    }
                });
            },

            id: function (oIdNode) {
                this.id = getText(oIdNode);
            },

            implementation: function (oImplementationNode) {
                this.implementation = {};

                visit(this.implementation, oImplementationNode, {
                    sapui5: function (oUi5Node) {
                        this.sapui5 = { basePath: "." };
                        var bVirtualNamespace;

                        visit(this.sapui5, oUi5Node, {
                            basePath: function (oBasePathNode) {
                                this.basePath = getText(oBasePathNode);
                            },
                            componentName: function (oComponentNameNode) {
                                this.componentName = getText(oComponentNameNode);
                                bVirtualNamespace = getAttribute(oComponentNameNode, "virtualNamespace");
                            },
                            viewName: function (oViewNameNode) {
                                this.viewName = getText(oViewNameNode);
                                bVirtualNamespace = getAttribute(oViewNameNode, "virtualNamespace");
                            }
                        });

                        if (bVirtualNamespace) {
                            this.sapui5.virtualNamespace = bVirtualNamespace === "true";
                        }
                    }
                });
            }
        });

        // paranoid mode to avoid memory leaks
        oXml = null;
    };

    return ChipDefinition;
});
