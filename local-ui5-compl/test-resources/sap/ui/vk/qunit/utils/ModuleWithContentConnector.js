/* global QUnit */
/**
 * Defines a module that creates an instance of sap.ui.vk.Viewer.
 *
 * If loading a model succeeds the module context contains field called 'contentConnector'.
 *
 * @example <caption>Example of usage:</caption>
 *
 * <pre>
 *     QUnit.moduleWithContentConnector("Module name", "a/b/c/something.vds", "vds", function(assert) {
 *         this.nodeHierarchy = this.contentConnector.getContent().scene.getDefaultNodeHierarchy();
 *     });
 * </pre>
 *
 * @param {string} name                 Label for this group of tests.
 * @param {string} url                  URL to load the model from.
 * @param {string} sourceType           Source type of the model.
 * @param {function} onLoadingSucceeded A callback that is called when the model is loaded successfully.
 *                                      The callback takes one parameter 'assert'.
 *                                      The 'this' context is the same as in module hooks.
 * @param {function} beforeEachHook		A callback that is called before each test
 * @param {function} afterEachHook		A callback that is called after each test
 */

sap.ui.define([
	"sap/ui/vk/dvl/ContentManager",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/thirdparty/three"
], function(
	DvlContentManager,
	ContentConnector,
	ContentResource,
	THREE
) {
	"use strict";

	/**
	 * @deprecated As of version 1.120
	 */
	DvlContentManager.setRuntimeSettings({ totalMemory: 16777216 * 2 });

	var testLoader = function(parentNode, contentResource) {
		return new Promise(function(resolve, reject) {
			var loader = new THREE.ObjectLoader();
			loader.load(
				contentResource.getSource(),
				function(obj) {
					parentNode.add(obj);
					resolve({
						node: parentNode,
						contentResource: contentResource
					});
				},
				function(xhr) {
				},
				function(xhr) {
					reject(new Error("Not object json"));
				}
			);
		});
	};

	ContentConnector.addContentManagerResolver({
		pattern: "threejs.test.json",
		dimension: 3,
		contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
		settings: {
			loader: testLoader
		}
	});

	QUnit.moduleWithContentConnector = function(name, url, sourceType, onLoadingSucceeded, beforeEachHook, afterEachHook) {
		QUnit.module(name, {
			beforeEach: function(assert) {
				this.contentConnector = new ContentConnector({
					contentResources: [
						new ContentResource({
							source: url,
							sourceType: sourceType,
							sourceId: "abc"
						})
					]
				});
				if (beforeEachHook) {
					beforeEachHook.call(this, assert);
				}
				var that = this;
				return new Promise(function(resolve, reject) {
					that.contentConnector.attachContentChangesFinished(function(event) {
						var failureReason = event.getParameter("failureReason");
						var content = event.getParameter("content");
						if (failureReason) {
							reject(new Error("Loading model failed."));
						} else if (content) {
							assert.ok(true, "Model loaded successfully.");
							if (onLoadingSucceeded) {
								onLoadingSucceeded.call(that, assert);
							}
							resolve();
						}
					});
				});
			},

			afterEach: function(assert) {
				if (this.contentConnector) {
					this.contentConnector.destroy();
					assert.ok(this.contentConnector.bIsDestroyed, "ContentConnector destroyed.");
					delete this.contentConnector;
				}
				if (afterEachHook) {
					afterEachHook.call(this, assert);
				}
			}
		});
	};
});
