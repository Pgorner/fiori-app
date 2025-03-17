sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/networkgraph/Node",
	"sap/suite/ui/microchart/RadialMicroChart",
	"sap/base/i18n/Localization"
], function (Controller, JSONModel, Node, RadialMicroChart, Localization) {
	var oCustomNode = Node.extend("sap.suite.ui.commons.sample.NetworkGraphCustomRendering.NetworkGraphCustomNode", {
		oCustomTitleSize: null,
		oCustomTrimmedTextSize: null,
		sBigFont: "BIG FONT TRIMMED TEXT",
		calculateSizes: function () {
			this.oCustomTitleSize = this.computeTextDimensions({
				text: this.getTitle(),
				width: this.getWidth() - 10,
				maxLines: this.getTitleLineSize()
			});

			this.oCustomTrimmedTextSize = this.computeTextDimensions({
				text: this.sBigFont,
				width: this.getWidth() - 10,
				attributes: {
					"font-size": "20px"
				},
				maxLines: 1
			});

			// as we use height property for basic height and add title height we don't want to change heigh directly
			// it would grow with every invalidation... meanwhile we call setSize which change internal values and is reset every cycle
			if (this.getShape() === "Box") {
				var iTitleHeight = this.oCustomTitleSize.lineHeight * this.oCustomTitleSize.text.length;
				this.setSize({
					titleHeight: iTitleHeight,
					height: Math.floor(iTitleHeight + this.oCustomTrimmedTextSize.lineHeight + 25 + 50 /*icon*/)
				});
			}
			if (this.getShape() === "Custom") {
				if (this.oCustomTitleSize.lineHeight > 0) {
					this.setCoreNodeSize(this.getHeight());
					this.setSize({
						height: Math.floor(this.getHeight() + this.oCustomTitleSize.lineHeight * this.oCustomTitleSize.text.length)
					});
				}
			}
		},
		renderItemContent: function (mArguments) {
			if (this.getShape() === "Custom") {
				return Node.prototype.renderContent.call(this);
			}

			var bUseHtml = this.getParent().getRenderType() === "Html";
			return bUseHtml ? this.renderHtmlItemContent(mArguments) : this.renderSvgItemContent(mArguments);
		},
		renderer: "sap.suite.ui.commons.networkgraph.NodeRenderer",
		_renderRadial: function (oRm) {
			if (!this._oRadial) {
				this._oRadial = new RadialMicroChart({
					size: "M",
					percentage: Math.floor(Math.random() * 100)
				});
			}
			oRm.renderControl(this._oRadial);
		},
		_convert: function ($el) {
			$el.removeAttr("data-sap-ui");
			$el.attr("id", $el.attr("id") + this.getId());

			var aChildren = $el.children();
			if (aChildren.length === 0) {
				return;
			}

			aChildren.each(function (i, oChild) {
				this._convert(jQuery(oChild));
			}.bind(this));
		},
		renderHtmlItemContent: function (mArguments) {
			if (this.getShape() === "Box" || this.getShape() === "Circle") {
				var oRm = mArguments.renderManager;
				oRm.openStart("div").attr("id", this.getId() + "-graphwrapper");
				oRm.style("display", "flex");
				oRm.style("justify-content", "center");
				oRm.style("padding", "5px 0 5px 0");
				oRm.openEnd();
				if (!mArguments.mapRender) {
					this._renderRadial(mArguments.renderManager);
				} else {
					// control can be rendered only once using ranger manager
					// so we just clone HTML and change IDs

					var $clone = this.$("graphwrapper").clone();
					this._convert($clone);
					oRm.unsafeHtml($clone[0].innerHTML);
				}
				oRm.close("div");
			}
		},
		renderSvgItemContent: function (mArguments) {
			var bIsRtl = Localization.getRTL();
			var oRm = mArguments.renderManager;

			if (this.getShape() === "Box") {
				var y = 20;
				if (this.oCustomTitleSize) {
					this.renderText({
						x: bIsRtl ? this.getWidth() - 5 : 5,
						y: y,
						lineSize: this.oCustomTitleSize.lineHeight,
						lines: this.oCustomTitleSize.text,
						renderManager: oRm
					});

					y += this.oCustomTitleSize.lineHeight * this.oCustomTitleSize.text.length + 20;

					if (this.oCustomTrimmedTextSize) {
						// solo lane text
						this.renderText({
							x: bIsRtl ? this.getWidth() - 5 : 5,
							y: y,
							lines: this.oCustomTrimmedTextSize.text,
							attributes: {
								"class": "sapSuiteUiCommonsNetworkSvgText",
								"font-size": "20px"
							},
							renderManager: oRm
						});

						y += this.oCustomTrimmedTextSize.lineHeight;
					}

					this.renderIcon({
						icon: this.getIcon(),
						y: y + 30,
						x: this.getWidth() / 2,
						attributes: {
							"class": "sapSuiteUiCommonsNetworkSvgText",
							"text-anchor": "middle",
							"font-size": "50px"
						},
						renderManager: oRm
					});
				}
			} else {
				if (this.oCustomTitleSize) {
					this.renderText({
						x: bIsRtl ? this.getWidth() + 10 : 30,
						y: 35,
						lineSize: this.oCustomTitleSize.lineHeight,
						lines: this.oCustomTitleSize.text,
						attributes: {
							"class": "sapSuiteUiCommonsNetworkSvgText"
						},
						renderManager: oRm
					});
				}
			}

		},
		renderContent: function (mArguments) {
			// size determination rendering is for default nodes using max-width or multiline titles
			// there is no need to waste time rendering in this cycle as its destroyed anyway
			if (mArguments.sizeDetermination) {
				return;
			}

			if (this.getShape() !== "Custom") {
				return Node.prototype.renderContent.call(this, mArguments);
			}

			var bUseHtml = this.getParent().getRenderType() === "Html";
			return bUseHtml ? this.renderHtmlContent(mArguments) : this.renderSvgContent({
				renderManager: mArguments.renderManager
			});
		},
		renderSvgContent: function (mArguments) {
			var oRm = mArguments.renderManager;
			var FOCUS_OFFSET = 3;
			var x = this.getX(),
				y = this.getY(),
				iHeight = 80,
				iWidth = this.getWidth();

			// set default classes if you want to have focus, hover and selected state handled by default
			// otherwise you need to handle it yourself
			this.renderElement("path", {
				stroke: "red",
				"class": "sapSuiteUiCommonsNetworkInnerRect",
				d: "M" + (x + iWidth / 2) + " " + y + " L " + (x + iWidth) + " " + (y + iHeight / 2) +
					" L " + (x + iWidth / 2) + " " + (y + iHeight) +
					" L " + (x) + " " + (y + iHeight / 2) +
					" L " + (x + iWidth / 2) + " " + (y) + "Z",
				renderManager: oRm
			});

			this.renderElement("path", {
				stroke: "red",
				"class": "sapSuiteUiCommonsNetworkBoxFocus",
				d: "M" + (x + iWidth / 2) + " " + (y + FOCUS_OFFSET) + " L " + (x + iWidth - FOCUS_OFFSET) + " " + (y + iHeight / 2) +
					" L " + (x + iWidth / 2) + " " + (y + iHeight - FOCUS_OFFSET) +
					" L " + (x + FOCUS_OFFSET) + " " + (y + iHeight / 2) +
					" L " + (x + iWidth / 2) + " " + (y + FOCUS_OFFSET) + "Z",
					renderManager: oRm
			});

		this.renderIcon({
				icon: this.getIcon(),
				y: 65,
				x: this.getWidth() / 2,
				attributes: {
					"text-anchor": "middle",
					"class": "sapSuiteUiCommonsNetworkSvgText",
					"font-size": "50px"
				},
				renderManager: oRm
			});

			if (this.getTitle()) {
				this.renderText({
					x: this.getWidth() / 2,
					attributes: {
						"text-anchor": "middle",
						"pointer-events": "none",
						"class": "sapSuiteUiCommonsNetworkSvgText"
					},
					y: iHeight + 20,
					lineSize: this.oCustomTitleSize.lineHeight,
					lines: this.oCustomTitleSize.text,
					renderManager: oRm
				});
			}

			// render info box
			this.renderStatusIcon({
				x: this.getWidth() / 2,
				y: 0,
				size: 15,
				iconSize: 25,
				renderManager: oRm
			});
		},
		renderHtmlContent: function (mArguments) {
			var sId = this.getId(),
				oRm = mArguments.renderManager;

			oRm.openStart("div");
			oRm.attr("id", sId + "-wrapper");
			oRm.style("pointer-events", "all");
			oRm.style("background-color", "white");
			oRm.style("height", this.getHeight() + "px");
			oRm.style("width", this.getHeight() + "px");
			oRm.style("transform", "rotate(45deg)");
			oRm.openEnd();

			oRm.openStart("div");
			oRm.attr("id", sId + "-wrapper");
			oRm.style("border-radius", "0");
			oRm.class("sapSuiteUiCommonsNetworkGraphDivInner");
			oRm.openEnd();

			oRm.openStart("div");
			oRm.class("sapSuiteUiCommonsNetworkDivCircleWrapper");
			oRm.openEnd();

			this.renderHtmlInfoIcon({
				top: "-10px",
				left: "-10px",
				transform: "rotate(-45deg)"
			}, mArguments);

			oRm.openStart("div");
			oRm.attr("id", sId + "-focus");
			oRm.style("border-radius", "0");
			oRm.class("sapSuiteUiCommonsNetworkDivFocus");
			oRm.openEnd();

			oRm.openStart("div");
			oRm.attr("id", sId + "-status");
			oRm.style("font-size", "30px");
			oRm.style("transform", "rotate(-45deg)");
			oRm.class("sapSuiteUiCommonsNetworkDivCircleStatus");
			oRm.openEnd();

			this.renderHtmlIcon(this.getIcon(), mArguments);

			oRm.close("div");
			oRm.close("div");
			oRm.close("div");
			oRm.close("div");
			oRm.close("div");

			this.renderHtmlActionButtons(mArguments);

			this.setCoreNodeSize(this.getHeight());
		},
		exit: function () {
			Node.prototype.exit.call(this);
			if (this._oRadial) {
				this._oRadial.destroy();
			}
		}
	});

	return oCustomNode;
});
