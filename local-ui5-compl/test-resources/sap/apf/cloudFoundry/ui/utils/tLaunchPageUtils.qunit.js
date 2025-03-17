sap.ui.define([
	"sap/apf/cloudFoundry/ui/utils/LaunchPageUtils",
	"sap/ui/thirdparty/jquery",
	"sap/ushell/Container",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (LaunchPageUtils, jQuery, Container,  sinon) {
	'use strict';

	var ushellPromise = undefined;

	QUnit.begin(function () {
		ushellPromise = new Promise(function (resolve, reject) {
			Container.init("local").then(function () {
				resolve();
			})
		});
		return ushellPromise;
	});

	QUnit.module("Generate Runtime Hash", {
		beforeEach: function (assert) {
			this.configId = "123456789";
			// wait for ushell bootstrap
			var done = assert.async();
			ushellPromise.then(function() {
				done();
			});
		},
		afterEach: function () { }
	});
	QUnit.test("Is Hash", function (assert) {
		var hash = LaunchPageUtils.generateRuntimeHash(this.configId);
		return hash.then(function(shref){						   
		assert.ok(shref.startsWith("#"), "starts with hash");
		});
	});
	QUnit.test("Starts APF Application", function (assert) {
		var hash = LaunchPageUtils.generateRuntimeHash(this.configId);
		return hash.then(function(shref){						   
		var end = shref.indexOf("?");
		var target = shref.substring(1, end);
		assert.strictEqual(target, "FioriApplication-executeAPFConfiguration", "correct target");
		});
	});
	QUnit.test("Contains ConfigurationID", function (assert) {
		var env = this;
		var hash = LaunchPageUtils.generateRuntimeHash(env.configId);
		return hash.then(function(shref){
		var start = shref.indexOf("?") + 1; //? is not part of the parameters
		var parameterStr = shref.substr(start);
		var parameters = parameterStr.split("&");
		assert.expect(3, "contains one parameter");
		parameters.forEach(function (parameter) {
			var parts = parameter.split("=");
			assert.strictEqual(parts.length, 2, "is valid parameter");
			assert.strictEqual(parts[0], "sap-apf-configuration-id", "is configuration id parameter");
			assert.strictEqual(parts[1], env.configId, "contains correct configuration id");
		});
		});
	});

	QUnit.module("Generate Runtime Link", {
		beforeEach: function (assert) {
			var env = this;
			//stub jQuery(location).attr('href')
			//customizable result
			env.href = null;
			// stub JQuery's 'attr' method and return mock value when attribute 'href' is retrieved
			sinon.stub(jQuery.fn, "attr", function(name) {
				if (name === "href") {
					return env.href;
				}
				// for all other attributes, call through to the original function
				return jQuery.fn.attr.wrappedFunction.apply(this, arguments);
			});
			// wait for ushell bootstrap
			var done = assert.async();
			ushellPromise.then(function() {
				done();
			});
		},
		afterEach: function (assert) {
			this.href = "not-my-href";
			assert.strictEqual(jQuery(location).attr("href"), this.href, "jQuery is stubbed");
			jQuery.fn.attr.restore()
			assert.notStrictEqual(jQuery(location).attr("href"), this.href, "jQuery is restored");
		}
	});
	QUnit.test("Empty HREF", function (assert) {
		var env = this;
		env.href = "";
		var link = LaunchPageUtils.generateRuntimeLink("123456789");
		return link.then(function(sLink){						   
		assert.strictEqual(sLink, "#FioriApplication-executeAPFConfiguration?sap-apf-configuration-id=123456789", "runtime hash");
		});
	});
	QUnit.test("HREF without Parameters", function (assert) {
		var env = this;
		var base = "https://my-test.page/index.html";
		env.href = base;
		var link = LaunchPageUtils.generateRuntimeLink("123456789");
		return link.then(function(sLink){
		assert.strictEqual(sLink, base + "#FioriApplication-executeAPFConfiguration?sap-apf-configuration-id=123456789", "base url plus runtime hash");
		});
	});
	QUnit.test("HREF with Parameters", function (assert) {
		var env = this;
		var base = "https://my-test.page/index.html";
		env.href = base + "?param1=value1&param2=value2";
		var link = LaunchPageUtils.generateRuntimeLink("123456789");
		return link.then(function(sLink){						   
		assert.strictEqual(sLink, base + "#FioriApplication-executeAPFConfiguration?sap-apf-configuration-id=123456789", "base url (without parameters) plus runtime hash");
		});
	});
	QUnit.test("HREF with Hash", function (assert) {
		var env = this;
		var base = "https://my-test.page/index.html";
		env.href = base + "#target";
		var link = LaunchPageUtils.generateRuntimeLink("123456789");
		return link.then(function(sLink){
		assert.strictEqual(sLink, base + "#FioriApplication-executeAPFConfiguration?sap-apf-configuration-id=123456789", "base url plus (new) runtime hash");
	    });
	});
	QUnit.test("HREF with Hash and Hash Parameters", function (assert) {
		var env = this;
		var base = "https://my-test.page/index.html";
		env.href = base + "#target?param1=value1&param2=value2";
		var link = LaunchPageUtils.generateRuntimeLink("123456789");
		return link.then(function(sLink){						   
		assert.strictEqual(sLink, base + "#FioriApplication-executeAPFConfiguration?sap-apf-configuration-id=123456789", "base url plus (new) runtime hash (without other hash parameters)");
		});
	});
	QUnit.test("HREF with Parameters, Hash and Hash Parameters", function (assert) {
		var env = this;
		var base = "https://my-test.page/index.html";
		env.href = base + "?param1=value1&param2=value2#target?param3=value3&param3=value3";
		var link = LaunchPageUtils.generateRuntimeLink("123456789");
		return link.then(function(sLink){						   
		assert.strictEqual(sLink, base + "#FioriApplication-executeAPFConfiguration?sap-apf-configuration-id=123456789", "base url (without parameters) plus (new) runtime hash (without other hash parameters)");
		});
	});

	QUnit.module("Build Bookmark Link - Build Test", {
		beforeEach: function () { },
		afterEach: function () { }
	});
	QUnit.test("Empty Link", function (assert) {
		var link = LaunchPageUtils.buildBookmarkLink("");
		assert.strictEqual(link, null, "null, because link does not contain a hash");
	});
	QUnit.test("Link without Hash", function (assert) {
		var link = LaunchPageUtils.buildBookmarkLink("https://my-test.page/index.html?param1=value1");
		assert.strictEqual(link, null, "null, because link does not contain a hash");
	});
	QUnit.test("Link with Hash without Hash Parameters", function (assert) {
		var linkBefore = "https://my-test.page/index.html?param1=value1#target";
		var link = LaunchPageUtils.buildBookmarkLink(linkBefore);
		assert.strictEqual(link, linkBefore + "?bookmark=true", "link with bookmark parameter");
	});
	QUnit.test("Link with Hash and Hash Parameters", function (assert) {
		var linkBefore = "https://my-test.page/index.html?param1=value1#target?param2=value2";
		var link = LaunchPageUtils.buildBookmarkLink(linkBefore);
		assert.strictEqual(link, linkBefore + "&bookmark=true", "link with bookmark parameter (and parameters from before)");
	});

	QUnit.module("Build Bookmark Link - Configuration Test", {
		beforeEach: function () { },
		afterEach: function () { }
	});
	QUnit.test("Empty Configuration", function (assert) {
		var linkBefore = "https://my-test.page/index.html#target";
		var link = LaunchPageUtils.buildBookmarkLink(linkBefore);
		assert.strictEqual(link, linkBefore + "?bookmark=true", "contains bookmark parameter");
	});
	QUnit.test("Configuration with Header", function (assert) {
		var linkBefore = "https://my-test.page/index.html#target";
		var link = LaunchPageUtils.buildBookmarkLink(linkBefore, "my-header");
		assert.strictEqual(link, linkBefore + "?bookmark=true&tile-header=my-header", "contains bookmark and tile-header parameter");
	});
	QUnit.test("Configuration with Subheader", function (assert) {
		var linkBefore = "https://my-test.page/index.html#target";
		var link = LaunchPageUtils.buildBookmarkLink(linkBefore, undefined, "my-subheader");
		assert.strictEqual(link, linkBefore + "?bookmark=true&tile-subheader=my-subheader", "contains bookmark and tile-subheader parameter");
	});
	QUnit.test("Configuration with Icon", function (assert) {
		var linkBefore = "https://my-test.page/index.html#target";
		var link = LaunchPageUtils.buildBookmarkLink(linkBefore, undefined, undefined, "my-icon");
		assert.strictEqual(link, linkBefore + "?bookmark=true&tile-icon=my-icon", "contains bookmark and tile-icon parameter");
	});
	QUnit.test("Configuration with Group", function (assert) {
		var linkBefore = "https://my-test.page/index.html#target";
		var link = LaunchPageUtils.buildBookmarkLink(linkBefore, undefined, undefined, undefined, "my-group");
		assert.strictEqual(link, linkBefore + "?bookmark=true&tile-group=my-group", "contains bookmark and tile-group parameter");
	});
	QUnit.test("Complete Configuration", function (assert) {
		var linkBefore = "https://my-test.page/index.html#target";
		var link = LaunchPageUtils.buildBookmarkLink(linkBefore, "my-header", "my-subheader", "my-icon", "my-group");
		assert.strictEqual(link, linkBefore + "?bookmark=true&tile-header=my-header&tile-subheader=my-subheader&tile-icon=my-icon&tile-group=my-group", "contains bookmark and tile configuration parameters");
	});
	QUnit.test("Complete Configuration with Escaped Characters", function (assert) {
		var linkBefore = "https://my-test.page/index.html#target";
		var link = LaunchPageUtils.buildBookmarkLink(linkBefore, "my!header", "my?subheader", "my:icon", "my group");
		assert.strictEqual(link, linkBefore + "?bookmark=true&tile-header=my%21header&tile-subheader=my%3fsubheader&tile-icon=my%3aicon&tile-group=my%20group", "contains bookmark and escaped tile configuration parameters");
	});

	QUnit.module("Set Bookmark Tile - Without Promise", {
		beforeEach: function (assert) {
			var env = this;
			env.pageGroups = undefined;
			//stub getGroups;
			env.stubGetGroups = sinon.stub();
			env.stubGetGroups.returns({
				then: function (fn) {
					fn(env.pageGroups);
				}
			});
			//spy deleteBookmarks
			env.spyDeleteBookmarks = sinon.spy();
			//spy addBookmark
			env.spyAddBookmark = sinon.spy();
			//stub getService
			env.stubGetService = sinon.stub(sap.ushell.Container, "getService");
			env.stubGetService.withArgs("LaunchPage").returns({
				getGroups: env.stubGetGroups
			});
			env.stubGetService.withArgs("Bookmark").returns({
				deleteBookmarks: env.spyDeleteBookmarks,
				addBookmark: env.spyAddBookmark
			});
			// wait for ushell bootstrap
			var done = assert.async();
			ushellPromise.then(function() {
				done();
			});
		},
		afterEach: function () {
			this.stubGetService.restore();
		}
	});
	QUnit.test("No Groups Available", function (assert) {
		var env = this;
		env.pageGroups = [];
		assert.throws(
			function () {
				LaunchPageUtils.setBookmarkTile("", "", "", "", "my-group");
			},
			function (error) {
				return error.toString() === "group not found";
			},
			"error 'group not found' thrown"
		);
		assert.ok(env.stubGetGroups.calledOnce, "getGroups is called once");
		assert.ok(env.spyDeleteBookmarks.notCalled, "deleteBookmarks is not called");
		assert.ok(env.spyAddBookmark.notCalled, "addBookmark is not called");
	});
	QUnit.test("Update Tiles", function(assert) {
		var env = this;
		env.pageGroups = [{
			identification: {
				id: "my-group"
			}
		}, {
			identification: {
				id: "my-other-group"
			}
		}];
		LaunchPageUtils.setBookmarkTile("https://my-test.page/index.html", "my-header", "my-subheader", "my-icon", "my-group");
		assert.ok(env.spyDeleteBookmarks.calledOnce, "deleteBookmarks is called once");
		assert.strictEqual(env.spyDeleteBookmarks.getCall(0).args[0], "https://my-test.page/index.html", "deleteBookmarks is called with the link as first parameter");
		assert.ok(env.spyAddBookmark.calledOnce, "addBookmark is called once");
		assert.deepEqual(env.spyAddBookmark.getCall(0).args[0], {
			title: "my-header",
			subtitle: "my-subheader",
			url: "https://my-test.page/index.html",
			icon: "my-icon"
		}, "addBookmark is called with the configuration as first parameter");
		assert.deepEqual(env.spyAddBookmark.getCall(0).args[1], env.pageGroups[0], "addBookmark is called with the page group as second parameter");
	});

	QUnit.module("Set Bookmark Tile", {
		beforeEach: function (assert) {
			var env = this;
			env.pageGroups = undefined;
			env.callDeleteBookmarks = undefined;
			env.callAddBookmark = undefined;
			//stub deleteBookmarks
			env.stubDeleteBookmarks = function() {
				if (env.callDeleteBookmarks) {
					env.callDeleteBookmarks.apply(undefined, arguments);
				}
			};
			//stub addBookmark
			env.stubAddBookmark = function() {
				if (env.callAddBookmark) {
					env.callAddBookmark.apply(undefined, arguments);
				}
			};
			//stub getService
			env.stubGetService = sinon.stub(sap.ushell.Container, "getService");
			env.stubGetService.withArgs("LaunchPage").returns({
				getGroups: function () {
					return new Promise(function (resolve) {
						resolve(env.pageGroups);
					});
				}
			});
			env.stubGetService.withArgs("Bookmark").returns({
				deleteBookmarks: env.stubDeleteBookmarks,
				addBookmark: env.stubAddBookmark
			});
			// wait for ushell bootstrap
			var done = assert.async();
			ushellPromise.then(function() {
				done();
			});
		},
		afterEach: function () {
			this.stubGetService.restore();
		}
	});
	QUnit.test("Check Delete Bookmark", function (assert) {
		var done = assert.async();
		var env = this;
		env.pageGroups = [{
			identification: {
				id: "my-group"
			}
		}, {
			identification: {
				id: "my-other-group"
			}
		}];
		env.callDeleteBookmarks = function(link) {
			assert.strictEqual(link, "https://my-test.page/index.html", "deleteBookmarks is called with the link as first parameter");
			done();
		};
		LaunchPageUtils.setBookmarkTile("https://my-test.page/index.html", "my-header", "my-subheader", "my-icon", "my-group");
	});
	QUnit.test("Check Add Bookmark", function (assert) {
		var done = assert.async();
		var env = this;
		env.pageGroups = [{
			identification: {
				id: "my-group"
			}
		}, {
			identification: {
				id: "my-other-group"
			}
		}];
		env.callAddBookmark = function(bookmark, group) {
			assert.deepEqual(bookmark, {
				title: "my-header",
				subtitle: "my-subheader",
				url: "https://my-test.page/index.html",
				icon: "my-icon"
			}, "addBookmark is called with the configuration as first parameter");
			assert.deepEqual(group, env.pageGroups[0], "addBookmark is called with the page group as second parameter");
			done();
		};
		LaunchPageUtils.setBookmarkTile("https://my-test.page/index.html", "my-header", "my-subheader", "my-icon", "my-group");
	});

});
