/* global QUnit, sinon*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/DownloadManager"
], function(
	jQuery,
	DownloadManager
) {
	"use strict";

	QUnit.module("Network Error Test", {
		// It's important to set up (and consequently tear down) the fake XHR for EACH individual test case
		beforeEach: function() {
			this.xhr = sinon.useFakeXMLHttpRequest();
			var requests = (this.requests = []);
			this.xhr.onCreate = function(xhr) {
				requests.push(xhr);
			};
		},
		afterEach: function() {
			this.xhr.restore();

		}
	});

	QUnit.test("Unsuccessful Resolution / Retry Disabled", function(assert) {
		var done = assert.async();

		var expectedSource = "dummy URL";
		var expectedHttpStatus = 0;

		var onItemSucceeded = sinon.spy();
		var onItemFailed = sinon.spy(function(event) {
			var actualSource = event.getParameters().source;
			var actualHttpStatus = event.getParameters().status;
			assert.strictEqual(actualSource, expectedSource, "Source is as expected");
			assert.strictEqual(actualHttpStatus, expectedHttpStatus, "HTTP status is as expected: " + expectedHttpStatus);
		});
		var onAllItemsCompleted = sinon.spy(function(event) {
			assert.strictEqual(this.requests.length, 1, "Number or requests sent is as expected: 1 (no retries)");
			assert.ok(onItemSucceeded.notCalled, "itemSucceeded handler not called");
			assert.ok(onItemFailed.calledOnce, "itemFailed handler called once");
			assert.ok(onAllItemsCompleted.calledOnce, "allItemsCompleted handler called once");
			done();
		});

		var downloadManager = new DownloadManager([expectedSource], 4, null, 0); // Note that last 0 parameter
		downloadManager
			.attachItemSucceeded(onItemSucceeded, this)
			.attachItemFailed(onItemFailed, this)
			.attachAllItemsCompleted(onAllItemsCompleted, this);
		downloadManager.start();

		this.requests[0].error();
	});

	QUnit.test("Unsuccessful Resolution / Default Retry Count", function(assert) {
		var done = assert.async();

		var retryCount = 1;
		var expectedSource = "dummy URL";
		var expectedHttpStatus = 0;

		var onItemSucceeded = sinon.spy();
		var onItemFailed = sinon.spy(function(event) {
			var actualSource = event.getParameters().source;
			var actualHttpStatus = event.getParameters().status;
			assert.strictEqual(actualSource, expectedSource, "Source is as expected");
			assert.strictEqual(actualHttpStatus, expectedHttpStatus, "HTTP status is as expected: " + expectedHttpStatus);
		});
		var onAllItemsCompleted = sinon.spy(function(event) {
			assert.strictEqual(this.requests.length, 1 + retryCount, "Number or requests sent is as expected: 1 + " + retryCount + " retries");
			assert.ok(onItemSucceeded.notCalled, "itemSucceeded handler not called");
			assert.ok(onItemFailed.calledOnce, "itemFailed handler called once");
			assert.ok(onAllItemsCompleted.calledOnce, "allItemsCompleted handler called once");
			done();
		});

		var downloadManager = new DownloadManager([expectedSource], 4);
		assert.strictEqual(downloadManager._retryCount, retryCount, "Default retry count is as expected: " + retryCount);
		downloadManager
			.attachItemSucceeded(onItemSucceeded, this)
			.attachItemFailed(onItemFailed, this)
			.attachAllItemsCompleted(onAllItemsCompleted, this);
		downloadManager.start();

		this.requests[0].error();
		this.requests[1].error();
	});

	QUnit.test("Unsuccessful Resolution / Explicit Retry Count", function(assert) {
		var done = assert.async();

		var retryCount = 3;
		var expectedSource = "dummy URL";
		var expectedHttpStatus = 0;

		var onItemSucceeded = sinon.spy();
		var onItemFailed = sinon.spy(function(event) {
			var actualSource = event.getParameters().source;
			var actualHttpStatus = event.getParameters().status;
			assert.strictEqual(actualSource, expectedSource, "Source is as expected");
			assert.strictEqual(actualHttpStatus, expectedHttpStatus, "HTTP status is as expected: " + expectedHttpStatus);
		});
		var onAllItemsCompleted = sinon.spy(function(event) {
			assert.strictEqual(this.requests.length, 1 + retryCount, "Number or requests sent is as expected: 1 + " + retryCount + " retries");
			assert.ok(onItemSucceeded.notCalled, "itemSucceeded handler not called");
			assert.ok(onItemFailed.calledOnce, "itemFailed handler called once");
			assert.ok(onAllItemsCompleted.calledOnce, "allItemsCompleted handler called once");
			done();
		});

		var downloadManager = new DownloadManager([expectedSource], 4, null, retryCount);
		downloadManager
			.attachItemSucceeded(onItemSucceeded, this)
			.attachItemFailed(onItemFailed, this)
			.attachAllItemsCompleted(onAllItemsCompleted, this);
		downloadManager.start();

		this.requests[0].error();
		this.requests[1].error();
		this.requests[2].error();
		this.requests[3].error();
	});

	QUnit.test("Successful Resolution on 2nd Retry", function(assert) {
		var done = assert.async();

		var retryCount = 2;
		var expectedSource = "dummy URL";
		var expectedHttpStatus = 200;
		var expectedContentType = "application/octet-stream";
		var expectedContent = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

		var onItemFailed = sinon.spy();
		var onItemSucceeded = sinon.spy(function(event) {
			var actualSource = event.getParameters().source;
			var actualContent = new Uint8Array(event.getParameters().response);
			assert.strictEqual(actualSource, expectedSource, "Source is as expected: " + expectedSource);
			assert.deepEqual(actualContent, expectedContent, "Content is as expected");
		});
		var onAllItemsCompleted = sinon.spy(function(event) {
			assert.strictEqual(this.requests.length, 1 + retryCount, "Number or requests sent is as expected: 1 + " + retryCount + " retries");
			assert.ok(onItemFailed.notCalled, "itemFailed handler not called");
			assert.ok(onItemSucceeded.calledOnce, "itemSucceeded handler called once");
			assert.ok(onAllItemsCompleted.calledOnce, "allItemsCompleted handler called once");
			done();
		});

		var downloadManager = new DownloadManager([expectedSource], 4, null, retryCount);
		downloadManager
			.attachItemSucceeded(onItemSucceeded, this)
			.attachItemFailed(onItemFailed, this)
			.attachAllItemsCompleted(onAllItemsCompleted, this);
		downloadManager.start();

		this.requests[0].error();
		this.requests[1].error();
		this.requests[2].respond(
			expectedHttpStatus,
			{
				"Content-Type": expectedContentType
			},
			expectedContent.buffer
		);
	});


	QUnit.module("HTTP Error Test", {
		beforeEach: function(assert) {
			this.xhr = sinon.useFakeXMLHttpRequest();
			var requests = (this.requests = []);
			this.xhr.onCreate = function(xhr) {
				requests.push(xhr);
			};

			// Each test case is responsible for setting the value of this property to the desired status which is being tested
			this.expectedHttpStatusError = undefined;

			// Data for canned request/response, same for each test case
			this.retryCount = 2;
			this.expectedSource = "dummy URL";
			this.expectedContent = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

			this.onItemFailed = sinon.spy();
			this.onItemSucceeded = sinon.spy(function(event) {
				assert.ok(true, "Content retrieved successfully");
				// Check that the final, successful, response resulted in whatever content was expected to be returned
				var actualSource = event.getParameters().source;
				var actualContent = new Uint8Array(event.getParameters().response);
				assert.strictEqual(actualSource, this.expectedSource, "Source is as expected: " + this.expectedSource);
				assert.deepEqual(actualContent, this.expectedContent, "Content is as expected");
			});
			this.onAllItemsCompleted = sinon.spy(function(event) {
				// Check number of requests sent by the manager. This is how we know that it indeed performed the retries
				// Otherwise we would only get to know about the itemSucceeded event (when the last retry attempt succeeded)
				// There should have been a total of n = 1 + `retryCount` requests made, where + 1 is for the initial, failed, request.
				assert.strictEqual(this.requests.length, 1 + this.retryCount, "Number or requests sent is as expected: 1 + " + this.retryCount + " retries");
				// Check the first n requests (excluding the final, successful, one). These all should have failed with the same error.
				assert.ok(this.requests
					.slice(0, this.retryCount)
					.map(request => request.status)
					.every(status => status === this.expectedHttpStatusError),
					"All requests (except last) returned as expected, with HTTP status: " + this.expectedHttpStatusError);
				// Check final, successful, request
				assert.strictEqual(this.requests[this.retryCount].status, 200, "Last request returned as expected, with HTTP status: 200");
				assert.ok(this.onItemFailed.notCalled, "itemFailed handler not called");
				assert.ok(this.onItemSucceeded.calledOnce, "itemSucceeded handler called once");
				assert.ok(this.onAllItemsCompleted.calledOnce, "allItemsCompleted handler called once");
				this.done();
			});
		},
		afterEach: function() {
			this.xhr.restore();
		},
		execute: function() {
			// Set up download manager and the fake XHR to respond with the appropriate status code for each
			// request made by the manager for every subsequent retry attempt
			var downloadManager = new DownloadManager([this.expectedSource], 4, null, this.retryCount);
			downloadManager
				.attachItemSucceeded(this.onItemSucceeded, this)
				.attachItemFailed(this.onItemFailed, this)
				.attachAllItemsCompleted(this.onAllItemsCompleted, this);

			downloadManager.start();

			// Send fake response to the first n-1 requests with the specified HTTP status...
			for (var i = 0; i < this.retryCount; i++) {
				this.requests[i].respond(this.expectedHttpStatusError);
			}
			// ...but let the final retry attempt to succeed
			this.requests[this.retryCount].respond(
				200,
				{
					"Content-Type": "application/octet-stream"
				},
				this.expectedContent.buffer
			);
		}
	});

	QUnit.test("408: Request Timeout", function(assert) {
		this.done = assert.async();
		this.expectedHttpStatusError = 408;
		this.execute();
	});

	QUnit.test("425: Too Early (RFC 8470)", function(assert) {
		this.done = assert.async();
		this.expectedHttpStatusError = 425;
		this.execute();
	});

	QUnit.test("429: Too Many Requests (RFC 6585)", function(assert) {
		this.done = assert.async();
		this.expectedHttpStatusError = 429;
		this.execute();
	});

	QUnit.test("500: Internal Server Error", function(assert) {
		this.done = assert.async();
		this.expectedHttpStatusError = 500;
		this.execute();
	});

	QUnit.test("502: Bad Gateway", function(assert) {
		this.done = assert.async();
		this.expectedHttpStatusError = 502;
		this.execute();
	});

	QUnit.test("503: Service Unavailable", function(assert) {
		this.done = assert.async();
		this.expectedHttpStatusError = 503;
		this.execute();
	});

	QUnit.test("504: Gateway Timeout", function(assert) {
		this.done = assert.async();
		this.expectedHttpStatusError = 504;
		this.execute();
	});


	QUnit.module("Generic Test");

	/*
		Methods tested:
			Constructor
			attachItemSucceeded
			attachItemFailed
			attachAllItemsCompleted
			start
	*/

	var testConstructor = function(downloadManager, expectedSources) {
		QUnit.test("Constructor", function(assert) {
			assert.propEqual(downloadManager._sourcesToProcess, expectedSources, "The constructor has set the sources to be downloaded.");
			assert.strictEqual(downloadManager._maxParallelTasks, 4, "The constructor has set the max parallel tasks to 4.");
			assert.strictEqual(downloadManager._sourcesBeingProcessed.length, 0, "At the moment of instantiation, there are no sources being processed.");
		});
	};

	var testAttachItemSucceeded = function(sources, source, response) {
		QUnit.test("attachItemSucceeded", function(assert) {
			assert.notStrictEqual(sources.indexOf(source), -1, "The attached source is in the list of initial sources.");
			assert.ok(response instanceof ArrayBuffer, "The attached file is an instance of ArrayBuffer.");
		});
	};

	var testAttachAllItemsCompleted = function(totalItemsAttached) {
		QUnit.test("attachAllItemsCompleted", function(assert) {
			assert.strictEqual(totalItemsAttached, 2, "In total, two items were attached successfully.");
		});
	};

	var testAttachItemFailed = function(source, status) {
		QUnit.test("attachItemFailed", function(assert) {
			assert.strictEqual(source, "test-resources/sap/ui/vk/qunit/media/this_file_does_not_exist.jpg", "The item that failed to load is 'test-resources/sap/ui/vk/qunit/media/this_file_does_not_exist.jpg'");
			assert.strictEqual(status, 404, "The loading status is 404.");
		});
	};

	var testStart = function(downloadManagerBeforeStart, downloadManagerAfterStart) {
		QUnit.test("start", function(assert) {
			assert.strictEqual(downloadManagerBeforeStart._sourcesToProcess.length, 3, "Before starting, there are 3 sources to process.");
			assert.strictEqual(downloadManagerBeforeStart._sourcesBeingProcessed.length, 0, "Before starting, there are 0 sources being processed.");
			assert.strictEqual(downloadManagerAfterStart._sourcesToProcess.length, 0, "After starting, there are no sources to process.");
			assert.strictEqual(downloadManagerAfterStart._sourcesBeingProcessed.length, 3, "After starting, there are 3 sources being processed.");
		});
	};

	var sources = [
		"test-resources/sap/ui/vk/qunit/media/box.vds",
		"test-resources/sap/ui/vk/qunit/media/cat.jpg",
		"test-resources/sap/ui/vk/qunit/media/this_file_does_not_exist.jpg"
	];

	var downloadManager = new DownloadManager(sources, 4);

	QUnit.test("MAIN TEST", function(assertMain) {
		var done = assertMain.async();

		assertMain.ok(true, "The tests have started.");

		testConstructor(jQuery.extend(true, {}, downloadManager), sources);

		var totalItemsAttached = 0;
		downloadManager.attachItemSucceeded(function(event) {
			totalItemsAttached++;
			var source = event.getParameter("source");
			var response = event.getParameter("response");
			testAttachItemSucceeded(sources, source, response);
		}, this)
			.attachAllItemsCompleted(function(event) {
				testAttachAllItemsCompleted(totalItemsAttached);
				done();
			}, this)
			.attachItemFailed(function(event) {
				testAttachItemFailed(event.getParameter("source"), event.getParameter("status"));
			}, this);

		var downloadManagerBeforeStart = jQuery.extend(true, {}, downloadManager);
		downloadManager.start();
		var downloadManagerAfterStart = jQuery.extend(true, {}, downloadManager);

		testStart(downloadManagerBeforeStart, downloadManagerAfterStart);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
