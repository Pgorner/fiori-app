sap.ui.define([
           	"sap/ui/vbdemos/component/ScrollCarousel",
			"sap/m/ImageRenderer",
			"sap/ui/core/mvc/View"
], function (ScrollCarousel, ImageRenderer, View) {
	"use strict";

	return View.extend("sap.ui.vbdemos.component.CarouselView", {
	  getControllerName: function() {
	    return "sap.ui.vbdemos.component.Carousel";
	  },
	  createContent: function(oController) {
	
		  var img = sap.m.Image.extend("sap.ui.vbdemos.component.ScrollCarouselImage", {
				metadata: {
					properties : {
						"title" : {type : "string"}
					}
				},
				
				renderer : {
					apiVersion: 2,			 // Semantic Rendering
					render: function (oRm, oControl){
					oRm.openStart("div");
					oRm.attr("class", "sapScrollChr");
					oRm.openEnd();
					ImageRenderer.render(oRm,oControl);
					oRm.openStart("div");
					oRm.attr("class", "sapScrollChrCaption");
					oRm.openEnd();
					oRm.text(oControl.getTitle());
					oRm.close("div");
					oRm.close("div");
				}
			}
			});
			
				  
		const scrollcont = new ScrollCarousel({
	    	   content: {
	    		   path: "/routes",
	    		   template : new img({
	    			   width: "300px",
	    			   src : "{image}",
	    			   title : "{description}"
	    		   })
	    	   },
	    	   vertical: false,
	    	   horizontal: true,
	    	   selectionChanged : oController.onSelectionChange
	       });
	       
	       
	       this.ScrollContainer = scrollcont;
	       return scrollcont;
	
	  }
	});
});
