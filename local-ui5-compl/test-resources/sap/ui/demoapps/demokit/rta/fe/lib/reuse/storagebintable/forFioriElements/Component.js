/*
 * ! Copyright (C) 2009-2024 SAP SE or an SAP affiliate company. All rights reserved.
 * Simple (reuse) Component
 * This component shows how a reuse component should be written. It must offer all mandatory properties
 *		uiMode type enum (display, edit)
 *		semanticObject type string
 * It may offer more properties. All properties must be bindable and allow that the values change during the lifetime
 * of the component instance.
 */

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"
], function(UIComponent, ReuseComponentSupport) {
	"use strict";

	return UIComponent.extend("sap.ui.demoapps.rta.fe.lib.reuse.storagebintable.forFioriElements.Component", {
		metadata: {
			manifest: "json",
			properties: {
				stIsAreaVisible: {
					type: "boolean",
					group: "standard"
				}
			}
		},
		getView: function() {
			/* Convenience function to get the view from the component. It could also be stored in an instance variable this._oView instead */
			return this.getAggregation("rootControl");
		},
		init: function() {
			/* Transforms this component into a reuse component for smart templates */
			ReuseComponentSupport.mixInto(this, "component");
			/* In this simple example we create a view that is later bound to a model
			 * It is important to understand that the component has no property values yet
			 * so the view and in particular its controller code must allow to get the values after it has been created
			 */
			//Defensive call of init of the super class
			(UIComponent.prototype.init || function() {}).apply(this, arguments);

		},

		setStIsAreaVisible: function(value){
			this.getView().setBindingContext(value ? undefined : null);
			this.setProperty("stIsAreaVisible",value);
		},

		/* Smart Template Reuse Component specific functions that can will be called if defined
		 * after ReuseComponentSupport.mixInto has been called
		 */
		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			this.getView().getController().setExtensionAPI(oExtensionAPI);
			this.getView().getController().forwardBindingContext(oBindingContext);
		},

		stRefresh: function(oModel, oBindingContext, oExtensionAPI) {
			this.getView().getController().forwardBindingContext(oBindingContext);
		}
	});
}, /* bExport= */ true);