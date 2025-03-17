

sap.ui.define([
	"../lib/sapvbi",
	"../VBIRenderer",
	"./VectorUtils",
	"./thirdparty/MaplibreStyles",
	"./PayloadGenerator",
	"./RectangularSelection",
	"./LassoSelection",
	"sap/ui/core/Lib",
	//"../lib/sapscene",
	"./thirdparty/maplibregl",
	"./VBITransformer"
], function (vb, VBIRenderer, VectorUtils, MaplibreStyles, PayloadGenerator, RectangularSelection, LassoSelection, Lib) {
	'use strict';

	VBI.MapRenderer = {};
	var map_container = "";
	let isDragging = false;
	let startY;
	let startYpx;
	let isDrawing = false;
	let isCtrlPressed = false;
	let lassoPoints = [];
	var bounds = [];
	let predefinedMarkers = [];
	let allMarkers = [];
	let lineDrag = false;
	let validDrop = false;
	VBI.MapRenderer.name = undefined;

	VBI.MapRenderer.setAdapter = (adapter) => {
		this._adapter = adapter;
		this._payloadGenerator = new PayloadGenerator(this._adapter);
	}

	// Process the GeoJSON spots and its properties
	VBI.MapRenderer._processGeoSpot = (source, data) => {

	}

	// Process the GeoJSON routes/links and its properties
	VBI.MapRenderer._processGeoRoutes = (source, data) => {

	}

	VBI.MapRenderer.renderMap = () => {

		let geoJSON = VBI.VBITransformer.getTransformedJSON();

		map_container = VBIRenderer.getId();

		var styleSheet = document.createElement("style");

		styleSheet.textContent = MaplibreStyles.loadStyles();
		document.head.appendChild(styleSheet);

		const map = VectorUtils.createMap(geoJSON, map_container);
		const canvas = map.getCanvasContainer();
		const rectangularSelection = new RectangularSelection(map);
		const lassoSelection = new LassoSelection(map);
		// Set `true` to dispatch the event before other functions
		// call it. This is necessary for disabling the default map
		// dragging behaviour.
		canvas.addEventListener('mousedown', (e) => rectangularSelection.mouseDown(e, this.Rpressed), true);
		canvas.addEventListener('mousedown', (e) => lassoSelection.mouseDown(e, this.Apressed), true);
		map.touchZoomRotate.enable();
		this.map = map;
		class SAPMapNavControl {
			onAdd(map) {
				this.map = map;
				// Create main container
				this._container = document.createElement('div');
				this._container.id = '__xmlview1--vbi-vbi-nav';
				this._container.className = 'vbi-nav my-custom-control';
				this._container.setAttribute('role', 'Navigation');
				this._container.setAttribute('tabindex', '-1');
				this._container.style.opacity = '0.5';

				// ensures the library is loaded
				Lib.load({ name: "sap.ui.vbm.i18n" });

				// ResourceBundle can be retrieved
				var oResourceBundle = Lib.getResourceBundleFor("sap.ui.vbm.i18n")

				var sTooltipMoveLeft = oResourceBundle.getText("NAVCTL_TITLE_MOVE_LEFT");
				var sTooltipMoveRight = oResourceBundle.getText("NAVCTL_TITLE_MOVE_RIGHT");
				var sTooltipMoveUp = oResourceBundle.getText("NAVCTL_TITLE_MOVE_UP");
				var sTooltipMoveDown = oResourceBundle.getText("NAVCTL_TITLE_MOVE_DOWN");
				var sTooltipMove = oResourceBundle.getText("NAVCTL_TITLE_MOVE");
				var sTooltipZoom = oResourceBundle.getText("NAVCTL_TITLE_ZOOM");


				//Create cursor left div

				var cursorLeft = document.createElement('div');
				cursorLeft.id = '__xmlview1--vbi-vbi-cursor-left';
				cursorLeft.className = 'vbi-cursor-left';
				cursorLeft.setAttribute('role', sap.ui.core.AccessibleRole.Button);
				cursorLeft.setAttribute('aria-label', sTooltipMoveLeft);
				cursorLeft.setAttribute('tabindex', '2');
				cursorLeft.setAttribute('title', sTooltipMoveLeft);

				// Create cursor right div

				var cursorRight = document.createElement('div');
				cursorRight.id = '__xmlview1--vbi-vbi-cursor-right';
				cursorRight.className = 'vbi-cursor-right';
				cursorRight.setAttribute('role', 'Button');
				cursorRight.setAttribute('aria-label', sTooltipMoveRight);
				cursorRight.setAttribute('tabindex', '4');
				cursorRight.setAttribute('title', sTooltipMoveRight);

				// Create cursor top div

				var cursorTop = document.createElement('div');
				cursorTop.id = '__xmlview1--vbi-vbi-cursor-top';
				cursorTop.className = 'vbi-cursor-top';
				cursorTop.setAttribute('role', 'Button');
				cursorTop.setAttribute('aria-label', sTooltipMoveUp);
				cursorTop.setAttribute('tabindex', '1');
				cursorTop.setAttribute('title', sTooltipMoveUp);

				// Create cursor down div

				var cursorDown = document.createElement('div');
				cursorDown.id = '__xmlview1--vbi-vbi-cursor-down';
				cursorDown.className = 'vbi-cursor-down';
				cursorDown.setAttribute('role', 'Button');
				cursorDown.setAttribute('aria-label', sTooltipMoveDown);
				cursorDown.setAttribute('tabindex', '5');
				cursorDown.setAttribute('title', sTooltipMoveDown);

				// Create cursor reset div
				var cursorReset = document.createElement('div');
				cursorReset.id = '__xmlview1--vbi-vbi-cursor-reset';
				cursorReset.className = 'vbi-cursor-reset';
				cursorReset.setAttribute('role', 'Button');
				cursorReset.setAttribute('aria-label', sTooltipMove);
				cursorReset.setAttribute('tabindex', '3');
				cursorReset.setAttribute('title', sTooltipMove);

				this._container.addEventListener('mouseover', function () {
					this.style.opacity = '1';
					this.style.boxShadow = '0 0 25px rgba(255, 0, 0, 0.8)';
				});

				this._container.addEventListener('mouseout', function () {
					this.style.opacity = '0.5';
					this.style.boxShadow = 'none';
				});

				// Create scroll area container
				var scrollArea = document.createElement('div');
				scrollArea.id = '__xmlview1--vbi-vbi-scrollarea';
				scrollArea.className = 'vbi-scrollarea';
				scrollArea.setAttribute('role', 'Slider');
				scrollArea.setAttribute('tabindex', '0');

				// Create scroll line upper ending div
				var scrollLineUpperEnding = document.createElement('div');
				scrollLineUpperEnding.id = '__xmlview1--vbi-vbi-scrolllineupperending';
				scrollLineUpperEnding.className = 'vbi-scrolllineupperending';
				scrollLineUpperEnding.setAttribute('role', 'Img');
				scrollLineUpperEnding.setAttribute('tabindex', '-1');
				scrollLineUpperEnding.style.cursor = 'pointer';
				scrollLineUpperEnding.style.position = 'absolute';
				scrollLineUpperEnding.top = '20px';

				// Create scroll line div
				var scrollLine = document.createElement('div');
				scrollLine.id = '__xmlview1--vbi-vbi-scrollline';
				scrollLine.className = 'vbi-scrollline';
				scrollLine.setAttribute('role', 'Img');
				scrollLine.setAttribute('tabindex', '-1');

				// Create scroll line lower ending div
				var scrollLineLowerEnding = document.createElement('div');
				scrollLineLowerEnding.id = '__xmlview1--vbi-vbi-scrolllinelowerending';
				scrollLineLowerEnding.className = 'vbi-scrolllinelowerending';
				scrollLineLowerEnding.setAttribute('role', 'Img');
				scrollLineLowerEnding.setAttribute('tabindex', '-1');
				scrollLineLowerEnding.style.cursor = 'pointer';
				scrollLineLowerEnding.style.position = 'absolute';
				scrollLineLowerEnding.style.top = '90px';

				// Create scroll point div
				var scrollPoint = document.createElement('div');
				scrollPoint.id = '__xmlview1--vbi-vbi-scrollpoint';
				scrollPoint.className = 'vbi-scrollpoint';
				scrollPoint.setAttribute('role', 'Button');
				scrollPoint.setAttribute('aria-label', sTooltipZoom);
				scrollPoint.setAttribute('tabindex', '0');
				scrollPoint.setAttribute('title', sTooltipZoom);
				scrollPoint.style.top = '4.43911px';
				startYpx = 4.43911;

				// Append scroll line elements to scroll area
				scrollArea.appendChild(scrollLineUpperEnding);
				scrollArea.appendChild(scrollLine);
				scrollArea.appendChild(scrollLineLowerEnding);
				scrollArea.appendChild(scrollPoint);
				// Append scroll area to main container
				this._container.appendChild(scrollArea);

				// Create cursor div
				var cursor = document.createElement('div');
				cursor.id = '__xmlview1--vbi-vbi-cursor';
				cursor.className = 'vbi-cursor';
				cursor.setAttribute('role', 'Presentation');
				cursor.setAttribute('tabindex', '-1');
				// cursor.style.backgroundPosition = '-5px 305px';

				// Append cursor to main container
				this._container.appendChild(cursor);

				// Create cursor grip container
				var cursorGrip = document.createElement('div');
				cursorGrip.id = '__xmlview1--vbi-vbi-cursor-grip';
				cursorGrip.className = 'vbi-cursor-grip';
				cursorGrip.setAttribute('role', 'Img');
				cursorGrip.setAttribute('tabindex', '-1');

				// Create cursor middle container
				var cursorMiddle = document.createElement('div');
				cursorMiddle.id = '__xmlview1--vbi-vbi-cursor-middle';
				cursorMiddle.className = 'vbi-cursor-middle';
				cursorMiddle.setAttribute('role', 'Img');
				cursorMiddle.setAttribute('tabindex', '0');


				// Append cursor buttons to cursor middle container
				cursorMiddle.appendChild(cursorLeft);
				cursorMiddle.appendChild(cursorRight);
				cursorMiddle.appendChild(cursorTop);
				cursorMiddle.appendChild(cursorDown);
				cursorMiddle.appendChild(cursorReset);

				cursorTop.addEventListener('click', function () {
					map.panBy([0, -100]); // Move map up
				});

				cursorDown.addEventListener('click', function () {
					map.panBy([0, 100]); // Move map down
				});

				cursorLeft.addEventListener('click', function () {
					map.panBy([-100, 0]); // Move map left
				});

				cursorRight.addEventListener('click', function () {
					map.panBy([100, 0]); // Move map right
				});
				cursorReset.addEventListener('click', function () {
					map.setCenter([0, 0]); // Reset map 
					map.setZoom(0);
				});



				// Function to handle mouse movement during dragging
				function onMouseMove(event) {
					if (!isDragging) return;

					const currentY = event.clientY;
					const deltaY = currentY - startY; // Calculate the difference in Y movement

					// Get the current position of the scroll point
					let newTop = parseInt(scrollPoint.style.top || "0px") + deltaY;

					// Get the boundaries of the scroll line
					const upperBoundary = 0;
					const lowerBoundary = scrollLine.offsetHeight - scrollPoint.offsetHeight; // Full scroll range

					// Enforce the boundaries
					newTop = Math.max(upperBoundary, Math.min(newTop, lowerBoundary));

					// Update the scroll point position to match mouse drag
					scrollPoint.style.top = `${newTop}px`;

					// Calculate zoom level based on the position of the scroll point
					const zoomRange = map.getMaxZoom() - map.getMinZoom();
					const scrollPositionRatio = (newTop - upperBoundary) / (lowerBoundary - upperBoundary);
					const newZoom = map.getMinZoom() + scrollPositionRatio * zoomRange;

					// Apply the zoom to the map
					map.setZoom(newZoom);

					// Reset `startY` to current Y position after each drag movement
					startY = currentY;
				}

				// Function to update scroll line position based on the map's zoom level
				function updateScrollLinePosition() {
					const zoomLevel = map.getZoom();

					// Define boundaries
					const upperBoundary = 0;
					const lowerBoundary = scrollLine.offsetHeight - scrollPoint.offsetHeight;

					// Calculate the maximum scrollable height
					const maxScrollHeight = lowerBoundary - upperBoundary;

					const minZoom = map.getMinZoom();
					const maxZoom = map.getMaxZoom();

					// Calculate the new scroll position based on the zoom level
					const scrollPosition = ((zoomLevel - minZoom) / (maxZoom - minZoom)) * maxScrollHeight;

					// Update the scroll point's position
					scrollPoint.style.top = `${upperBoundary + scrollPosition}px`;
				}

				// Attach event listeners to update the scroll line position on zoom and move
				map.on('zoom', updateScrollLinePosition);
				map.on('move', updateScrollLinePosition);

				// Initialize the scroll line position when the map loads
				updateScrollLinePosition();

				// Event listeners for drag functionality
				scrollPoint.addEventListener('mousedown', (event) => {
					isDragging = true;
					startY = event.clientY;
					document.addEventListener('mousemove', onMouseMove);
					document.addEventListener('mouseup', onMouseUp);
				});

				// Function to stop dragging
				function onMouseUp() {
					isDragging = false;
					document.removeEventListener('mousemove', onMouseMove);
					document.removeEventListener('mouseup', onMouseUp);
				}

				// Attach the onMouseUp event listener globally
				document.addEventListener('mouseup', onMouseUp);

				// Append cursor middle to cursor grip
				cursorGrip.appendChild(cursorMiddle);

				// Append cursor grip to main container
				this._container.appendChild(cursorGrip);

				// Append main container to the map if available
				if (map && map.getContainer()) {
					map.getContainer().appendChild(this._container);
				}

				// Return the main container
				return this._container;
			}
			onRemove() {
				this._container.parentNode.removeChild(this._container);
				this.map = undefined;
			}
		}
		map.on('load', () => {

			// Legend control
			VBI.VBITransformer._createLegend(map_container);

			// Custom attribution/copyright control
			map.addControl(new maplibregl.AttributionControl({
				customAttribution: '<span>' + geoJSON[0].copyright + '</span>',
				compact: false
			})
			);
			// Scale control in mi,km or nm
			map.addControl(new maplibregl.ScaleControl({
				maxWidth: 80,
				unit: geoJSON[0].scaleType
			}));

			// Parsing GeoJSON for each type of object
			map.addSource('geojson-source', {
				'type': 'geojson',
				'data': geoJSON[1]
			});


			map.addControl(new SAPMapNavControl(), 'top-left');
			//	map.addControl(new SAPMAPLgndControl(), 'top-right');
			// Create a popup, but don't add it to the map yet.
			const popup = new maplibregl.Popup({
				closeButton: false,
				closeOnClick: false
			});
			// add markers to map only for Points
			bounds = [];
			const pointFeatures = [];
			geoJSON[1].features.forEach((marker) => {
				let markerCoordinates = marker.geometry.coordinates;
				if (marker.geometry.type === 'Point') {
					// create a DOM element for the marker (parent div)
					const el = VectorUtils.createSpotElement(marker);

					// Create child element for the SAP icon (icon overlay)
					const child_el = VectorUtils.createIconElement(marker.properties.Icon);

					// Append the icon inside the marker
					el.appendChild(child_el);
					//	add marker to map
					let spot = new maplibregl.Marker({
						element: el,
						draggable: true,
						offset: [0, -25]
					}).setLngLat(marker.geometry.coordinates)
						.on('dragend', onDragEnd)
						.addTo(map);
					let originalpos = spot.getLngLat();
					spot.customProperties = { Key: marker.properties.Key };
					allMarkers.push(spot);

					function onDragEnd() {
						const lngLat = spot.getLngLat();
						if (lngLat !== 0) {
							spot.setLngLat(originalpos);
						}
					}
					// Function to return a promise that resolves when the map is clicked
					function getClickCoordinates() {
						return new Promise((resolve) => {
							map.once('click', function (e) {
								resolve(e.lngLat); // Resolve with the clicked coordinates
							});
						});
					};

					el.addEventListener('mouseenter', () => {
						//Check if a line is dragged here
						if (lineDrag) {
							validDrop = true;
							if (!that.Apressed && !that.Rpressed) {
								el.style.cursor = 'copy';
							}
						} else {
							// Change the cursor style as a UI indicator
							if (!that.Apressed && !that.Rpressed) {
								el.style.cursor = 'pointer';
							}
							if (that.Apressed || that.Rpressed) {
								el.style.cursor = 'crosshair';
							} else {
								popup.setLngLat(marker.geometry.coordinates).setHTML(marker.properties.ToolTip).addTo(map);
							}
						}

					});
					async function triggerPayloadSpot(e, event) {
						let clickCoordinates = null;
						if (event === 'DETAIL_REQUEST') {
							// First, wait for the map click and get the coordinates
							clickCoordinates = await getClickCoordinates();
						} else {
							clickCoordinates = { lng: marker.geometry.coordinates[0], lat: marker.geometry.coordinates[1] };
						}
						const xyobj = VectorUtils.GetEventVPCoordsObj(e, map_container);
						marker.properties.x = xyobj.x;
						marker.properties.y = xyobj.y;
						PayloadGenerator.objectClick('Spot', event, marker, clickCoordinates);
					};

					el.addEventListener('click', (e) => {
						//Trigger payload
						triggerPayloadSpot(e, 'DETAIL_REQUEST');
					});

					el.addEventListener('contextmenu', (e) => {
						//Trigger payload
						triggerPayloadSpot(e, 'CONTEXT_MENU_REQUEST');
					});


					el.addEventListener('mouseleave', () => {
						if (!that.Apressed && !that.Rpressed) {
							map.getCanvas().style.cursor = '';
						}
						popup.remove();
						validDrop = false;
					});

					// Check if the coordinates already exist in predefinedMarkers
					let exists = predefinedMarkers.some(
						(coords) => coords[0] === markerCoordinates[0] && coords[1] === markerCoordinates[1]
					);

					// If it doesn't exist, push the new coordinates
					if (!exists) {
						predefinedMarkers.push(markerCoordinates);
					}
				} else if (marker.geometry.type == "LineString") {
					const coords = marker.geometry.coordinates;
					const startCoord = coords[0];  // First coordinate
					const endCoord = coords[coords.length - 1];  // Last coordinate

					// Calculate angle between the two points
					const angle = VectorUtils.calculateBearing(startCoord, endCoord);

					// Determine the arrow rotations
					const normalizedStartRotation = VectorUtils.normalizeAngle(90 + angle);  // Adjust for start arrow
					const normalizedEndRotation = angle > 90 ? VectorUtils.normalizeAngle(270 + angle) : VectorUtils.normalizeAngle(90 - angle);  // Adjust for end arrow

					if (coords.length > 1) {
						// Create start point
						const startPoint = {
							'type': 'Feature',
							'geometry': {
								'type': 'Point',
								'coordinates': coords[0]  // First coordinate
							},
							'properties': {
								'Color': marker.properties.Color,
								'BorderColor': marker.properties.BorderColor,
								'arrowRotation': normalizedStartRotation,
								'size': 0.07 * parseFloat(marker.properties.LineWidth),
								'borderSize': 0.07 * (parseFloat(marker.properties.LineWidth) + 1)
							}
						};

						// Create end point
						const endPoint = {
							'type': 'Feature',
							'geometry': {
								'type': 'Point',
								'coordinates': coords[coords.length - 1]  // Last coordinate
							},
							'properties': {
								'Color': marker.properties.Color,
								'BorderColor': marker.properties.BorderColor,
								'arrowRotation': normalizedEndRotation,
								'size': 0.07 * parseFloat(marker.properties.LineWidth),
								'borderSize': 0.07 * (parseFloat(marker.properties.LineWidth) + 1)
							}
						};

						// Add the points only if the arrow is supposed to be shown
						if (marker.properties.StartStyle === '1') {
							pointFeatures.push(startPoint);
						}
						if (marker.properties.EndStyle === '1') {
							pointFeatures.push(endPoint);
						}
					}
				}

				// Calculate bounds to Zoom
				if (marker.geometry.type == "LineString") {
					markerCoordinates.forEach((line) => {
						let exists = bounds.some(
							(coords) => coords[0] === line[0] && coords[1] === line[1]
						);
						//If it doesn't exist, push the new coordinates
						if (!exists) {
							bounds.push(line);
						}
					});
				} else {
					// Check if the coordinates already exist in predefinedMarkers
					let exists = bounds.some(
						(coords) => coords[0] === markerCoordinates[0] && coords[1] === markerCoordinates[1]
					);

					// If it doesn't exist, push the new coordinates
					if (!exists) {
						bounds.push(markerCoordinates);
					}
				}

			});

			//Focus the map into the features
			var zoombounds = bounds.reduce((zoombounds, coord) => {
				return zoombounds.extend(coord);
			}, new maplibregl.LngLatBounds(bounds[0], bounds[0]));

			map.fitBounds(zoombounds, {
				padding: 150
			});

			map.addLayer({
				'id': 'geojson-source-point',
				'type': 'circle',
				'source': 'geojson-source',
				'paint': {
					'circle-opacity': 0 // Hide points by making them fully transparent
				},
				'filter': ['==', '$type', 'Point']
			});

			// First layer for the border (wider line)
			map.addLayer({
				'id': 'geojson-source-route-border',
				'type': 'line',
				'source': 'geojson-source',
				'layout': {
					'line-join': 'round',
					'line-cap': 'butt'
				},
				'paint': {
					'line-color': ['get', 'BorderColor'],
					'line-width': ['get', 'BorderWidth']  // Slightly wider for border effect
				},
				'filter': ['==', '$type', 'LineString']
			});
			map.addLayer({
				'id': 'geojson-source-route',
				'type': 'line',
				'source': 'geojson-source',
				'layout': {
					'line-join': 'round',
					'line-cap': 'butt'
				},
				'paint': {
					'line-color': ['get', 'Color'],
					'line-width': ['get', 'LineWidth']
				},
				'filter': ['==', '$type', 'LineString']
			});
			// Create a new FeatureCollection for the points
			const pointGeoJSON = {
				'type': 'FeatureCollection',
				'features': pointFeatures
			};

			// Add the GeoJSON source for the points to the map
			map.addSource('line-end-points', {
				'type': 'geojson',
				'data': pointGeoJSON
			});

			VectorUtils.getArrowHead((image) => {
				map.addImage('arrow-icon', image, { sdf: true });
				// Add a layer to display the arrows borders at the start/end points
				map.addLayer({
					'id': 'route-end-arrows-border',
					'type': 'symbol',
					'source': 'line-end-points',
					'layout': {
						'icon-image': 'arrow-icon',  // base64 arrow icon
						'icon-size': ['get', 'borderSize'],
						'icon-allow-overlap': true,
						'icon-rotation-alignment': 'map',
						'icon-rotate': ['get', 'arrowRotation']  // Rotate based on calculated angle
					},
					'paint': {
						'icon-color': ['get', 'BorderColor']  // Match the arrow color with the line color
					}
				});

				// Add a layer to display the arrows at the start/end points
				map.addLayer({
					'id': 'route-end-arrows',
					'type': 'symbol',
					'source': 'line-end-points',
					'layout': {
						'icon-image': 'arrow-icon',  // Use your base64 arrow icon
						'icon-size': ['get', 'size'],
						'icon-allow-overlap': true,
						'icon-rotation-alignment': 'map',
						'icon-rotate': ['get', 'arrowRotation']  // Rotate based on calculated angle
					},
					'paint': {
						'icon-color': ['get', 'Color']  // Match the arrow color with the line color
					}
				});
			});

		});
		// Change mouse cursor when hovering over the line
		map.on('mouseenter', 'geojson-source-route', function () {
			if (!that.Apressed && !that.Rpressed) {
				map.getCanvas().style.cursor = 'pointer';
			}
		});

		// Revert mouse cursor back when not hovering
		map.on('mouseleave', 'geojson-source-route', function () {
			if (!that.Apressed && !that.Rpressed) {
				map.getCanvas().style.cursor = '';
			}
		});
		map.on('click', 'geojson-source-route', function (e) {
			//Trigger payload
			triggerPayloadRoute(e, 'DETAIL_REQUEST');
		});

		function triggerPayloadRoute(e, event) {
			const coordinates = e.lngLat;
			// Get the GeoJSON properties of the clicked line feature
			const xyobj = VectorUtils.GetEventVPCoordsObj(e.originalEvent, map_container);
			var route = e.features[0];
			route.properties.x = xyobj.x;
			route.properties.y = xyobj.y;

			PayloadGenerator.objectClick('Link', event, route, coordinates);
		}

		function onUp(e) {
			// To be done
			if (validDrop) {
				// Perform action for valid drop
				console.log('Dropped on valid target');
			} else {
				// Perform action for invalid drop
				console.log('Invalid drop');
			}

			// Reset cursor and remove event listeners
			map.getCanvas().style.cursor = '';
			map.off('mousemove', onMove);
			map.off('touchmove', onMove);
			lineDrag = false;
			validDrop = false;
		}

		map.on('mousedown', 'geojson-source-route', (e) => {
			// Check if the left mouse button is clicked (button === 0)
			if (e.originalEvent.button === 0) {
				// Prevent the default map drag behavior.
				e.preventDefault();
				lineDrag = true;

				// Add move and up event listeners
				map.on('mousemove', onMove);
				map.once('mouseup', onUp);
			}
		});

		function onMove(e) {
			const features = map.queryRenderedFeatures(e.point, {
				layers: ['geojson-source-route']
			});

			if (!that.Apressed && !that.Rpressed) {
				if (features.length || validDrop) {
					map.getCanvas().style.cursor = 'copy';

				} else {
					// If not over a valid feature, show the "not-allowed" cursor
					map.getCanvas().style.cursor = 'not-allowed';
				}
			}
		};

		map.on('contextmenu', (e) => {
			// Check if the right-click happened on the 'geojson-source-route' layer
			const features = map.queryRenderedFeatures(e.point, { layers: ['geojson-source-route'] });

			if (features.length > 0) {
				e.features = features;
				// The context menu is for the 'geojson-source-route' layer
				triggerPayloadRoute(e, 'CONTEXT_MENU_REQUEST');
			} else {
				// The context menu is for the map
				const coords = e.lngLat.lng + ";" + e.lngLat.lat + ";0.0";
				const currentZoom = map.getZoom();
				const center = map.getCenter();
				const currentCenter = center.lng + ";" + center.lat;
				const xyobj = VectorUtils.GetEventVPCoordsObj(e.originalEvent, map_container);
				const screenX = xyobj.x;
				const screenY = xyobj.y;
				PayloadGenerator.onMapContextMenu(coords, currentZoom, currentCenter, screenX, screenY);
			}
		});

		var that = this;
		map.on('idle', () => {
			const container = map.getContainer();
			container.addEventListener('keydown', function (event) {
				switch (event.keyCode) {
					case 72:     // Reset map to initial view when 'h' is pressed
						map.setCenter([0, 0]);
						map.setZoom(2);
						map.getCanvas().style.cursor = '';
						break;
					case 82:
						if (!that.Rpressed) {
							// Disable default box zooming.
							that.Rpressed = true;
							that.Apressed = false;
							map.boxZoom.disable();
							map.getCanvas().style.cursor = 'crosshair';
						} else {
							// Enable default box zooming.
							that.Rpressed = false;
							map.boxZoom.enable();
							map.getCanvas().style.cursor = '';
						}
						break;
					case 65:
						if (!that.Apressed) {
							// Disable default box zooming.
							that.Apressed = true;
							that.Rpressed = false;
							map.boxZoom.disable();
							map.getCanvas().style.cursor = 'crosshair';
						} else {
							// Enable default box zooming.
							that.Apressed = false;
							map.boxZoom.enable();
							map.getCanvas().style.cursor = '';
						}
						break;
					default:
						break;
				}
				//Always trigger
				PayloadGenerator.KeyboardHandler(event, VBI.MapRenderer.name);
			});
		})


	}
	VBI.MapRenderer.actionName = (obj) => {
		const actions = Array.isArray(obj?.SAPVB?.Actions?.Set?.Action)
			? obj.SAPVB.Actions.Set.Action
			: [obj?.SAPVB?.Actions?.Set?.Action].filter(Boolean);

		const action = actions.find(act => act.refEvent === "KeyPress");
		VBI.MapRenderer.name = action?.name ?? undefined;
	};

	VBI.MapRenderer.createPopup = (htmlContent, posArray) => {
		let lngLat;
		switch (posArray[0]) {
			case "Spots":
				// Find the spot with the specified key
				const foundSpot = allMarkers.find(spot => spot.customProperties.Key === posArray[1]);
				lngLat = foundSpot?.getLngLat();
				break;
			default:
		}

		if (this.popup) {
			//Remove existing popups
			this.popup.remove();
		}
		// Create a Mapbox popup using the constructed HTML DOM
		this.popup = new maplibregl.Popup({
			closeButton: false,
			offset: [19, 15]
		}).setLngLat(lngLat)
			.setDOMContent(htmlContent)
			.addTo(this.map);
	}

	VBI.MapRenderer.closePopup = () => {
		this.popup?.remove();
	}
	VBI.MapRenderer.setRefMapLayerStack = (style, header) => {
		this.map.setStyle(style);
		// Add the headers only for the specific types of requests
		if (Object.keys(header).length != 0) {
			// Use transformRequest to modify requests for specific maps
			this.map.transformRequest = (url, resourceType) => {
				return {
					url: url,
					headers: header // Add the header
				};
			}
		}
	}

	VBI.MapRenderer.createMenu = (Menu, data) => {
		var contextMenuHandler = {};
		contextMenuHandler.cnt = 0;
		const xyparam = data.Params?.Param ? data.Params.Param : data.Param;
		for (var i = 0; i < xyparam.length; ++i) {
			if (xyparam[i].name === "x") {
				contextMenuHandler.m_x = parseInt(xyparam[i]["#"], 10);
			}
			if (xyparam[i].name === "y") {
				contextMenuHandler.m_y = parseInt(xyparam[i]["#"], 10);
			}
			if (xyparam[i].name === "scene") {
				contextMenuHandler.m_scene = xyparam[i]["#"];
			}
		}
		Menu.findMenuByID(data.refID).open(true, 0, "begin top", "begin top", this.map._container, "" + contextMenuHandler.m_x + " " + contextMenuHandler.m_y + "", "fit");
	}

});

