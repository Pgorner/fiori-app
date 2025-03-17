/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/base/Object"
], function(
	jQuery,
	BaseObject
) {
	"use strict";

	/**
	 * A 2D point.
	 * @typedef Point2D
	 * @property {number} x The x-coordinate.
	 * @property {number} y The y-coordinate.
	 */

	/**
	 * A simplified event object that is passed to the event handlers.
	 *
	 * @typedef LocoEvent
	 * @property {int}          n         The number of touch points.
	 * @property {Point2D[]}    points    The touch points.
	 * @property {number}       [d]       The distance between the two touch points.
	 * @property {int}          buttons   A bitmask of the buttons that are pressed. See
	 *                                    {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons|MouseEvent: buttons property}.
	 * @property {boolean}      handled   If set to <code>true</code> the event is considered handled and not passed to
	 *                                    other handlers attached to the viewport. If you also want to prevent the
	 *                                    default browser behavior set property {@link passEvent} to <code>false</code>.
	 * @property {boolean}      passEvent If set to <code>true</code> we call <code>event.preventDefault()</code> on the
	 *                                    original jQuery.event.
	 * @property {jQuery.event} event     The original jQuery.event.
	 * @property {int}          timeStamp The time when the event occurred. See
	 *                                    {@link https://api.jquery.com/event.timeStamp/|jQuery.Event.timeStamp}
	 * @property {int}          scroll    An integer (32-bit) representing the distance in pixels. See
	 *                                    {@link https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent}
	 */

	/**
	 * The delay between taps to treat clicks as double clicks.
	 *
	 * After a `tap` event occurs we wait for `DOUBLE_CLICK_DELAY_IN_MS` milliseconds for the next
	 * `tap` event. If the second `tap` event occurs within `DOUBLE_CLICK_DELAY_IN_MS` milliseconds
	 * we treat that second `tap` event as a `doubleClick` event and ignore the first `tap` event.
	 * If there is no second `tap` event within `DOUBLE_CLICK_DELAY_IN_MS` milliseconds we treat the
	 * `tap` event as a `click` event, in which case the `click` handler method is called with a
	 * delay of `DOUBLE_CLICK_DELAY_IN_MS` milliseconds.
	 *
	 * If there is a `move` event after the first `tap` event within `DOUBLE_CLICK_DELAY_IN_MS`
	 * milliseconds we cancel waiting for the next `tap` event and treat the first `tap` event as a
	 * `click` event and call the `click` handler method immediately right before calling the `move`
	 * handler method.
	 */
	const DOUBLE_CLICK_DELAY_IN_MS = 250;

	/* eslint-disable no-unused-vars */
	// See https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons.
	/** No button or un-initialized */
	const BUTTON_NONE = 0;
	/** Primary button (usually the left button) */
	const BUTTON_PRIMARY = 1;
	/** Secondary button (usually the right button) */
	const BUTTON_SECONDARY = 2;
	/** Auxiliary button (usually the mouse wheel button or middle button) */
	const BUTTON_AUXILIARY = 4;
	/** 4th button (typically the "Browser Back" button) */
	const BUTTON_4TH = 8;
	/** 5th button (typically the "Browser Forward" button) */
	const BUTTON_5TH = 16;
	/* eslint-enable no-unused-vars */

	/** NOTE: This is private documentation which is not visible in the API reference.
	 *
	 * The Loco class is used mostly by Viewport classes to handle input events.
	 *
	 * The Loco instance is created by a viewport and attached to it. The Loco instance behaves like
	 * a UI5 event delegate. It listens for the events on the viewport, pre-processes and converts
	 * jQuery.Event objects into LocoEvent objects and calls the corresponding methods on the event
	 * handlers attached to the Loco instance.
	 *
	 * An event handler attached to the Loco instance can be any JavaScript object, e.g. a POD
	 * object, with the following methods:
	 *
	 * `beginGesture(event: LocoEvent): void` - this method is called when the first touch point is
	 * detected or simulated.
	 *
	 * `endGesture(event: LocoEvent): void` - this method is called when the last touch point is
	 * released.
	 *
	 * `move(event: LocoEvent): void` - this method is called when the touch points are moved.
	 *
	 * `hover(event: LocoEvent): void` - this method is called when the mouse pointer is moved and
	 * no mouse buttons are pressed.
	 *
	 * `click(event: LocoEvent): void` - this method is called when the mouse button is pressed and
	 * then released.
	 *
	 * `doubleClick(event: LocoEvent): void` - this method is called when the mouse button is
	 * pressed and then released twice within `DOUBLE_CLICK_DELAY_IN_MS` milliseconds.
	 *
	 * `contextMenu(event: LocoEvent): void` - this method is called when the right mouse button is
	 * pressed and released.
	 *
	 * `keyEventHandler(event: jQuery.Event): void` - this method is called when a key is pressed
	 * and released. NOTE: this handler method takes a jQuery.Event object, not LocoEvent.
	 *
	 * `getViewport(): sap.ui.vk.ViewportBase` - this method is called to get the viewport to which
	 * the event handlers are attached.
	 *
	 * All handler methods except `getViewport()` are optional. If a handler method does not exist
	 * it is not called.
	 *
	 * The Loco instance has a priority mechanism to call the event handlers. The handlers with
	 * higher priority are called first. If the event is handled by any of the event handlers
	 * attached to the viewport and the `event.handled` property is set to `true`, the remaining
	 * event handlers are not called.
	 */

	/**
	 * Constructor for a new Loco instance.
	 *
	 * @class
	 * Loco is a utility class that provides a set of methods to handle input events for UI5 controls.
	 *
	 * @extends sap.ui.base.BaseObject
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @constructor
	 * @param {sap.ui.vk.Viewport} [viewport] The viewport to attach the event handlers to.
	 * @public
	 * @alias sap.ui.vk.Loco
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 * @since 1.32.0
	 */
	const Loco = BaseObject.extend("sap.ui.vk.Loco", {
		metadata: {
			library: "sap.ui.vk"
		},

		constructor: function(viewport) {
			if (Loco._instance && this.viewport === viewport) {
				return Loco._instance;
			}

			BaseObject.apply(this);

			// An array of event handlers sorted by priority in ascending order. The handlers with
			// higher priority are called first.
			this._handlers = [];

			// An indicator that a gesture is in progress. It is set to `true` when the first touch
			// point is detected or simulated.
			this._gesture = false;

			// The number of touch points at the beginning of the current gesture in progress.
			this._n = 0;

			// The time when the first touch point is detected or simulated.
			this._touchStart = 0;

			// The origin of the touch points at the beginning of the current gesture in progress.
			this._touchOrigin = { x: 0, y: 0 };

			// An indicator that the touch points have moved. The tiny movement of the touch points
			// within 3 pixels within 200ms is not considered as a move.
			this._touchMoved = false;

			// The timer for detecting double clicks. After the first click we do not fire the
			// click event immediately but wait for the second click within the
			// `DOUBLE_CLICK_DELAY_IN_MS` milliseconds.
			this._clickTimer = 0;

			// The function to be called after the `DOUBLE_CLICK_DELAY_IN_MS` milliseconds.
			this._clickFunc = null;

			if (viewport) {
				this._attachViewportEventHandlers(viewport);
			}

			Loco._instance = this;

			return this;
		}
	});

	/**
	 * Cleans up, removes all handlers.
	 *
	 * @public
	 */
	Loco.prototype.destroy = function() {
		if (this._clickTimer > 0) {
			clearTimeout(this._clickTimer);
			this._clickTimer = 0;
			this._clickFunc = null;
		}

		this._handlers.length = 0;

		this._detachViewportEventHandlers();
	};

	/**
	 * Converts a jQuery event to a simplified event object.
	 *
	 * @param {jQuery.Event} event The original jQuery event.
	 * @returns {LocoEvent} The simplified event object.
	 */
	function convertToLocoEvent(event) {
		/** @type {Point2D[]} */
		const points = [];

		/** @type {LocoEvent} */
		const locoEvent = {
			points,
			buttons: event.buttons ?? BUTTON_NONE,
			handled: false,
			passEvent: false,
			event,
			timeStamp: event.timeStamp,
			scroll: event.wheelDelta
		};

		if (event.touches?.length > 0) {
			for (const touch of event.touches) {
				points.push({ x: touch.pageX, y: touch.pageY });
			}
		} else if (event.pageX != null) {
			points.push({ x: event.pageX, y: event.pageY });
		} else {// touchend event on iOS
			points.push({ x: event.originalEvent.pageX, y: event.originalEvent.pageY });
		}

		// if the right button is pressed, then emulate multi-touch pan
		if ((event.buttons & BUTTON_SECONDARY) && points.length === 1) {
			points.push(points[0]);
		}

		// The first touch point.
		const { x: x0, y: y0 } = points[0];

		// The number of touch points.
		locoEvent.n = points.length;

		if (locoEvent.n === 2) {
			const { x: x1, y: y1 } = points[1];
			const dx = x0 - x1;
			const dy = y0 - y1;

			// The center of the two touch points.
			locoEvent.x = (x0 + x1) * 0.5;
			locoEvent.y = (y0 + y1) * 0.5;

			// The distance between the two touch points.
			locoEvent.d = Math.sqrt(dx * dx + dy * dy);
		} else {
			locoEvent.x = x0;
			locoEvent.y = y0;
			locoEvent.d = 0;
		}

		return locoEvent;
	}

	/**
	 * Attaches UI5 and native browser event handlers to the viewport.
	 *
	 * @param {sap.ui.vk.ViewportBase} viewport The viewport to attach the event handlers to.
	 * @private
	 */
	Loco.prototype._attachViewportEventHandlers = function(viewport) {
		// One Loco instance can be attached to only one viewport.
		this.viewport = viewport;

		// As Loco implements UI5 event delegate methods we attach it to the viewport as the event
		// delegate.

		viewport.addEventDelegate(this);

		// Some events are not handled by the UI5 event delegate methods, so we attach them directly
		// as browser events.

		if (sap.ui.Device.support.touch) {
			viewport.attachBrowserEvent("touchmove", this._onpointermove, this);
		}

		viewport.attachBrowserEvent("mousemove", this._onpointermove, this);

		viewport.attachBrowserEvent(sap.ui.Device.browser.firefox ? "DOMMouseScroll" : "mousewheel", this._onscroll, this);
	};

	Loco.prototype._detachViewportEventHandlers = function() {
		const viewport = this.viewport;

		if (viewport == null) {
			return;
		}

		viewport.detachBrowserEvent(sap.ui.Device.browser.firefox ? "DOMMouseScroll" : "mousewheel", this._onscroll, this);

		viewport.detachBrowserEvent("mousemove", this._onpointermove, this);

		if (sap.ui.Device.support.touch) {
			viewport.detachBrowserEvent("touchmove", this._onpointermove, this);
		}

		viewport.removeEventDelegate(this);

		this.viewport = null;
	};

	////////////////////////////////////////////////////////////////////////////
	// BEGIN: EventDelegate methods
	//
	// The methods starting with 'on' use the UI5 convention for event handlers.
	//
	// The methods starting with '_on' are attached as event handlers via
	// `sap.ui.core.Control#attachBrowserEvent`.
	//
	// Not all event handlers can be implemented as UI5 event delegate methods starting with 'on'.
	// For example, UI5 does not recognize method 'onmousemove' as event handler, so we have to use
	// `sap.ui.core.Control#attachBrowserEvent` method which is more convenient than native browser
	// method `addEventListener` as adding/removing event handlers attached to controls via
	// `sap.ui.core.Control#attachBrowserEvent` to the corresponding DOM elements is done by UI5
	// RenderManager automatically.

	Loco.prototype.ontouchstart = function(event) {
		if (!event.isMarked()) {
			const locoEvent = convertToLocoEvent(event);
			if (this._gesture) {
				this._endGesture(locoEvent);
				locoEvent.handled = false;
			}
			this._beginGesture(locoEvent);
		}
	};

	Loco.prototype.ontouchend = function(event) {
		const locoEvent = convertToLocoEvent(event);

		if (locoEvent.buttons !== BUTTON_NONE) {
			// The `touchend` event can be fired when we reach the border of the viewport. If
			// any button is pressed we want to continue the gesture outside the viewport until
			// all buttons are released.

			const $document = jQuery(document);

			const onMouseMove = (event) => {
				this._move(convertToLocoEvent(event));
			};

			const onMouseUp = (event) => {
				this._endGesture(convertToLocoEvent(event));
				$document.off("mousemove", onMouseMove);
				$document.off("mouseup", onMouseUp);
			};

			$document.on("mousemove", onMouseMove);
			$document.on("mouseup", onMouseUp);

			return;
		}

		this._endGesture(locoEvent);

		if (event.touches.length > 0) {
			locoEvent.handled = false;
			this._beginGesture(locoEvent);
		}
	};

	Loco.prototype.ontap = function(event) {
		if (!event.isMarked() && !this._touchMoved) {
			const locoEvent = convertToLocoEvent(event);

			if (this._clickTimer > 0) {
				// If we tapped within the 'click' delay which means there was the first click
				// before that then treat that tap as 'double click'.
				this._click(locoEvent, true);
			} else {
				this._clickFunc = this._click.bind(this, locoEvent, false);
				this._clickTimer = setTimeout(this._clickFunc, DOUBLE_CLICK_DELAY_IN_MS);
			}
		}
	};

	Loco.prototype.oncontextmenu = function(event) {
		this._contextMenu(convertToLocoEvent(event));
	};

	// NOTE: This is the only event method which does not convert jQuery.event to LocoEvent.
	Loco.prototype.onkeyup = function(event) {
		this._keyEventHandler(event);
	};

	Loco.prototype._onpointermove = function(event) {
		this._move(convertToLocoEvent(event));
	};

	Loco.prototype._onscroll = function(event) {
		if (!event.isMarked()) {
			const {
				originalEvent,
				buttons
			} = event;

			let scroll = originalEvent.detail ? originalEvent.detail * -40 : originalEvent.wheelDelta;
			if (!originalEvent.touches) { // pinch to zoom (no touches) have a scroll value of +120 or -120 and should be significantly reduced
				scroll = Math.min(Math.max(scroll, -20), 20);
			}

			/** @type {LocoEvent} */
			const locoEvent = {
				x: originalEvent.pageX,
				y: originalEvent.pageY,
				d: 0,
				buttons,
				scroll,
				n: 2,
				points: [
					{
						x: originalEvent.pageX,
						y: originalEvent.pageY
					},
					{
						x: originalEvent.pageX,
						y: originalEvent.pageY
					}
				],
				handled: false,
				passEvent: false,
				timeStamp: event.timeStamp
			};

			this._beginGesture(locoEvent);

			locoEvent.points[0].y -= scroll * 0.2;
			locoEvent.points[1].y += scroll * 0.2;
			locoEvent.d = Math.pow(2, scroll / 640); // 640px scales twice

			locoEvent.handled = false;
			this._move(locoEvent);

			locoEvent.handled = false;
			this._endGesture(locoEvent);

			if (locoEvent.handled) {
				event.setMarked();
				if (!locoEvent.passEvent) {
					event.preventDefault();
				}
			}
		}
	};

	// END: EventDelegate methods
	////////////////////////////////////////////////////////////////////////////

	/**
	 * Adds a viewport event handler to the Loco.
	 *
	 * Handlers with higher priority are called first.
	 *
	 * If the viewport already has the event handler attached, the handler is not added again, but
	 * its priority is updated and the handler is moved to the correct position in the list of
	 * handlers.
	 *
	 * @param {object} handler The event handler to be added.
	 * @param {number} priority The priority of the handler.
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining.
	 * @public
	 */
	Loco.prototype.addHandler = function(handler, priority) {
		if (this.viewport == null) {
			this._attachViewportEventHandlers(handler.getViewport());
		}

		// If the handler is already in the list of handlers this will update its priority.
		handler.priority = priority ?? 0;

		const handlers = this._handlers;

		if (!handlers.includes(handler)) {
			handlers.push(handler);
		}

		handlers.sort((a, b) => a.priority - b.priority);

		return this;
	};

	/**
	 * Removes a viewport event handler from Loco.
	 *
	 * @param {object} handler The event handler to be removed.
	 * @returns {this} Reference to <code>this</code> in order to allow method chaining.
	 * @public
	 */
	Loco.prototype.removeHandler = function(handler) {
		const i = this._handlers.indexOf(handler);
		if (i >= 0) {
			this._handlers.splice(i, 1);
		}
		return this;
	};

	/**
	 * Calls the event handlers attached to the viewport.
	 *
	 * If the event is handled by any of the event handlers attached to the viewport, the remaining
	 * event handlers are not called.
	 *
	 * If the event is handled by an event handler attached to the viewport, and the `passEvent`
	 * property is set to `false`, the default browser behavior is prevented.
	 *
	 * @param {string} handlerName The event name.
	 * @param {LocoEvent} locoEvent The event object.
	 * @private
	 */
	Loco.prototype._handleInput = function(handlerName, locoEvent) {
		const handlers = this._handlers;

		// Call the event handlers in reverse order so that the handlers with higher priority or
		// with the same priority but added last are called first.
		for (let i = handlers.length - 1; i >= 0 && !locoEvent.handled; i--) {
			handlers[i][handlerName]?.(locoEvent);
		}

		if (locoEvent.handled && locoEvent.event && !locoEvent.passEvent) {
			locoEvent.event.preventDefault();
		}
	};

	Loco.prototype._beginGesture = function(locoEvent) {
		this._handleInput("beginGesture", locoEvent);

		this._touchStart = locoEvent.timeStamp;
		this._touchMoved = false;
		this._gesture = true;

		this._touchOrigin.x = locoEvent.x;
		this._touchOrigin.y = locoEvent.y;
		this._n = locoEvent.n;
	};

	Loco.prototype._move = function(locoEvent) {
		// If we tapped and then moved within the 'click' delay then call `_click()` first.
		this._clickFunc?.();

		if (this._gesture && this._n === locoEvent.n) {
			if (!this._touchMoved) {
				this._touchMoved = (locoEvent.timeStamp - this._touchStart > 200) &&
					(Math.abs(this._touchOrigin.x - locoEvent.x) > 3 || Math.abs(this._touchOrigin.y - locoEvent.y) > 3);
			}

			this._handleInput("move", locoEvent);
		} else {
			this._handleInput("hover", locoEvent);
		}
	};

	Loco.prototype._endGesture = function(locoEvent) {
		if (!this._gesture) {
			return;
		}

		this._handleInput("endGesture", locoEvent);

		this._gesture = false;
	};

	Loco.prototype._click = function(locoEvent, isDoubleClick) {
		if (this._clickTimer > 0) {
			clearTimeout(this._clickTimer);
			this._clickTimer = 0;
			this._clickFunc = null;
		}

		this._handleInput(isDoubleClick ? "doubleClick" : "click", locoEvent);
	};

	Loco.prototype._contextMenu = function(locoEvent) {
		this._handleInput("contextMenu", locoEvent);
	};

	// NOTE: This is the only event method which does not convert jQuery.event to LocoEvent.
	Loco.prototype._keyEventHandler = function(event) {
		this._handleInput("keyEventHandler", event);
	};

	return Loco;
});
