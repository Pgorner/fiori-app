/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the Material class.
sap.ui.define([
	"sap/ui/base/Object"
], function(
	BaseObject
) {
	"use strict";

	/**
	 * Constructor for a new Material.
	 *
	 *
	 * @class Provides the interface for the material.
	 *
	 * The objects of this class should not be created directly.
	 *
	 * @public
	 * @abstract
	 * @author SAP SE
	 * @version 1.132.0
	 * @extends sap.ui.base.Object
	 * @alias sap.ui.vk.Material
	 */
	var Material = BaseObject.extend("sap.ui.vk.Material", /** @lends sap.ui.vk.Material.prototype */ {
		metadata: {
			library: "sap.ui.vk",
			"abstract": true
		}
	});

	/**
	 * Gets current value of material name
	 * @returns {string} Material name
	 * @public
	 */
	Material.prototype.getName = function() {
		return this._name;
	};

	/**
	 * Sets a new value for material name
	 * @param {string} sName New value for material name
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setName = function(sName) {
		this._name = sName;
		return this;
	};

	/**
	 * Gets current value of material ambient colour
	 * Default value is "rgba(0, 0, 0, 1)".
	 * @returns {sap.ui.core.CSSColor} Ambient colour - red, green, blue, and alpha
	 * @public
	 */
	Material.prototype.getAmbientColour = function() {
		return this._ambientColour ?? "rgba(0, 0, 0, 1)";
	};

	/**
	 * Sets a new value for material ambient colour
	 * When called with a value of null or undefined, the default value of the property will be restored.
	 * Default value is "rgba(0, 0, 0, 1)".
	 * @param {sap.ui.core.CSSColor} sAmbientColour New value for material ambient colour
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setAmbientColour = function(sAmbientColour) {
		this._ambientColour = sAmbientColour ?? "rgba(0, 0, 0, 1)";
		return this;
	};

	/**
	 * Gets current value of material diffuse colour
	 * Default value is "rgba(0, 0, 0, 1)".
	 * @returns {sap.ui.core.CSSColor} Diffuse colour - red, green, blue, and alpha
	 * @public
	 */
	Material.prototype.getDiffuseColour = function() {
		return this._diffuseColour ?? "rgba(0, 0, 0, 1)";
	};

	/**
	 * Sets a new value for material diffuse colour
	 * When called with a value of null or undefined, the default value of the property will be restored.
	 * Default value is "rgba(0, 0, 0, 1)".
	 * @param {sap.ui.core.CSSColor} sDiffuseColour New value for material diffuse colour
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setDiffuseColour = function(sDiffuseColour) {
		this._diffuseColour = sDiffuseColour ?? "rgba(0, 0, 0, 1)";
		return this;
	};

	/**
	 * Gets current value of material specular colour
	 * Default value is "rgba(0, 0, 0, 1)".
	 * @returns {sap.ui.core.CSSColor} Specular colour - red, green, blue, and alpha
	 * @public
	 */
	Material.prototype.getSpecularColour = function() {
		return this._specularColour ?? "rgba(0, 0, 0, 1)";
	};

	/**
	 * Sets a new value for material specular colour
	 * When called with a value of null or undefined, the default value of the property will be restored.
	 * Default value is "rgba(0, 0, 0, 1)".
	 * @param {sap.ui.core.CSSColor} sSpecularColour New value for material specular colour
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setSpecularColour = function(sSpecularColour) {
		this._specularColour = sSpecularColour ?? "rgba(0, 0, 0, 1)";
		return this;
	};

	/**
	 * Gets current value of material emissive colour
	 * Default value is "rgba(0, 0, 0, 1)".
	 * @returns {sap.ui.core.CSSColor} Emissive colour - red, green, blue, and alpha
	 * @public
	 */
	Material.prototype.getEmissiveColour = function() {
		return this._emissiveColour ?? "rgba(0, 0, 0, 1)";
	};

	/**
	 * Sets a new value for material emissive colour
	 * When called with a value of null or undefined, the default value of the property will be restored.
	 * Default value is "rgba(0, 0, 0, 1)".
	 * @param {sap.ui.core.CSSColor} sEmissiveColour New value for material emissive colour
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setEmissiveColour = function(sEmissiveColour) {
		this._emissiveColour = sEmissiveColour ?? "rgba(0, 0, 0, 1)";
		return this;
	};

	/**
	 * Gets current value of material opacity
	 * Default value is 1.0
	 * @returns {float} Opacity
	 * @public
	 */
	Material.prototype.getOpacity = function() {
		return this._opacity ?? 1.0;
	};

	/**
	 * Sets a new value for material opacity
	 * When called with a value of null or undefined, the default value of the property will be restored.
	 * Default value is 1.0
	 * @param {float} fOpacity New value for material opacity
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setOpacity = function(fOpacity) {
		this._opacity = fOpacity ?? 1.0;
		return this;
	};

	/**
	 * Gets current value of material glossiness
	 * Default value is 0.0
	 * @returns {float} Glossiness
	 * @public
	 */
	Material.prototype.getGlossiness = function() {
		return this._opacity ?? 0.0;
	};

	/**
	 * Sets a new value for material glossiness
	 * When called with a value of null or undefined, the default value of the property will be restored.
	 * Default value is 0.0
	 * @param {float} fGlossiness New value for material glossiness
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setGlossiness = function(fGlossiness) {
		this._glossiness = fGlossiness ?? 0.0;
		return this;
	};

	/**
	 * Gets current value of material line colour
	 * Default value is "rgba(0, 0, 0, 1)".
	 * @returns {sap.ui.core.CSSColor} Line colour - red, green, blue, and alpha
	 * @public
	 */
	Material.prototype.getLineColour = function() {
		return this._lineColour ?? "rgba(0, 0, 0, 1)";
	};

	/**
	 * Sets a new value for material line colour
	 * When called with a value of null or undefined, the default value of the property will be restored.
	 * Default value is "rgba(0, 0, 0, 1)".
	 * @param {sap.ui.core.CSSColor} sLineColour New value for material line colour
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setLineColour = function(sLineColour) {
		this._lineColour = sLineColour ?? "rgba(0, 0, 0, 1)";
		return this;
	};

	/**
	 * Gets current value of material line width
	 * Default value is 0.0
	 * @returns {float} Line width
	 * @public
	 */
	Material.prototype.getLineWidth = function() {
		return this._lineWidth ?? 0.0;
	};

	/**
	 * Sets a new value for material line width
	 * When called with a value of null or undefined, the default value of the property will be restored.
	 * Default value is 0.0
	 * @param {float} fLineWidth New value for material line width
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setLineWidth = function(fLineWidth) {
		this._lineWidth = fLineWidth ?? 0.0;
		return this;
	};

	/**
	 * Gets current value of material diffuse texture
	 * @returns {sap.ui.vk.Texture} Diffuse texture
	 * @public
	 */
	Material.prototype.getTextureDiffuse = function() {
		return this._textureDiffuse;
	};

	/**
	 * Sets a new value for material diffuse texture
	 * @param {sap.ui.vk.Texture} sTextureDiffuse New value for material diffuse texture
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setTextureDiffuse = function(sTextureDiffuse) {
		this._textureDiffuse = sTextureDiffuse;
		return this;
	};

	/**
	 * Gets current value of material bump texture
	 * @returns {sap.ui.vk.Texture} Bump texture
	 * @public
	 */
	Material.prototype.getTextureBump = function() {
		return this._textureBump;
	};

	/**
	 * Sets a new value for material bump texture
	 * @param {sap.ui.vk.Texture} sTextureBump New value for material bump texture
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setTextureBump = function(sTextureBump) {
		this._textureBump = sTextureBump;
		return this;
	};

	/**
	 * Gets current value of material opacity texture
	 * @returns {sap.ui.vk.Texture} Opacity texture
	 * @public
	 */
	Material.prototype.getTextureOpacity = function() {
		return this._textureOpacity;
	};

	/**
	 * Sets a new value for material opacity texture
	 * @param {sap.ui.vk.Texture} sTextureOpacity New value for material opacity texture
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setTextureOpacity = function(sTextureOpacity) {
		this._textureOpacity = sTextureOpacity;
		return this;
	};

	/**
	 * Gets current value of material reflection texture
	 * @returns {sap.ui.vk.Texture} Reflection texture
	 * @public
	 */
	Material.prototype.getTextureReflection = function() {
		return this._textureReflection;
	};

	/**
	 * Sets a new value for material reflection texture
	 * @param {sap.ui.vk.Texture} sTextureReflection New value for material reflection texture
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setTextureReflection = function(sTextureReflection) {
		this._textureReflection = sTextureReflection;
		return this;
	};

	/**
	 * Gets current value of material emissive texture
	 * @returns {sap.ui.vk.Texture} Emissive texture
	 * @public
	 */
	Material.prototype.getTextureEmissive = function() {
		return this._textureEmissive;
	};

	/**
	 * Sets a new value for material emissive texture
	 * @param {sap.ui.vk.Texture} sTextureEmissive New value for material emissive texture
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setTextureEmissive = function(sTextureEmissive) {
		this._textureEmissive = sTextureEmissive;
		return this;
	};

	/**
	 * Gets current value of material ambient occlusion texture
	 * @returns {sap.ui.vk.Texture} Ambient occlusion texture
	 * @public
	 */
	Material.prototype.getTextureAmbientOcclusion = function() {
		return this._textureAmbientOcclusion;
	};

	/**
	 * Sets a new value for material ambient occlusion texture
	 * @param {sap.ui.vk.Texture} sTextureAmbientOcclusion New value for material ambient occlusion texture
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 */
	Material.prototype.setTextureAmbientOcclusion = function(sTextureAmbientOcclusion) {
		this._textureAmbientOcclusion = sTextureAmbientOcclusion;
		return this;
	};

	/**
	 * Gets the reference to the native material object
	 * @function
	 * @name sap.ui.vk.Material#getMaterialRef
	 * @returns {any} Material reference that this material class wraps
	 * @public
	 * @abstract
	 */

	return Material;
});
