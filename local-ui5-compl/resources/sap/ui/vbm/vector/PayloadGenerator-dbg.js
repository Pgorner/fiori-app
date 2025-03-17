sap.ui.define([
    "sap/ui/base/Object",
    "./VectorUtils"
], function (BaseObject, VectorUtils) {
    'use strict';

    /**
         * Constructor for a new PayloadGenerator.
         *
         * @class
         * Provides a class for creating Payloads from events.
         *
         * @private
         * @author SAP SE
         * @version 1.132.0
         * @alias sap.ui.vbm.vector.PayloadGenerator
         */
    var adapter = {};
    const PayloadGenerator = BaseObject.extend("sap.ui.vbm.vector.PayloadGenerator", /** @lends sap.ui.vbm.vector.PayloadGenerator.prototype */ {
        constructor: function (_adapter) {
            BaseObject.call(this);
            adapter = _adapter;
        }
    });

    this.keysObjects = {};
    this.mergeArray = [];

    // Method to check if the key exists in the array for a given name
    PayloadGenerator.keyExists = function (name, key, mergeArray) {
        const nameObject = mergeArray.find(item => item.name === name);
        if (nameObject) {
            return nameObject.E.some(entry => entry.K === key);
        }
        return false;
    };
    PayloadGenerator.fcodeSelect = function (action_name, action_id,action_obj,action_ins) { 
        const payload = {
            version: "2.0",
            "xmlns:VB": "VB",
            Action: {
                "name": action_name,
                "object": action_obj,
                "id": action_id,
                "instance": action_ins
            } 
        }
        // Fire the submit event with the generated payload
        adapter.fireSubmit({
            data: JSON.stringify(payload)
        });
    };
    // Method to insert unique key-value pairs and update "VB:s" flags
    PayloadGenerator.insertUniqueKey = function (name, event, key, mergeArray) {
        // Update all existing entries' "VB:s" flag to false
        if (event === "CLICK") {
            mergeArray.forEach(item => {
                if (item.name === name) {
                    item.E.forEach(entry => {
                        entry["VB:s"] = "false"; // Set all existing ones to false
                    });
                }
            });
        }

        let nameObject = mergeArray.find(item => item.name === name);

        // If the name (Spot or Link) doesn't exist, create it
        if (!nameObject) {
            nameObject = {
                name: name,
                E: []
            };
            mergeArray.push(nameObject);
        }

        // Check if the key already exists under the given name
        const existingEntry = nameObject.E.find(entry => entry.K === key);

        if (!existingEntry) {
            // Push the new key-value pair with "VB:s" set to true for the clicked spot
            nameObject.E.push({
                K: key,
                "VB:s": "true"
            });
        } else {
            // If it exists, update its "VB:s" to true for the clicked spot
            existingEntry["VB:s"] = "true";
        }
    };

    PayloadGenerator.objectClick = (objectType, event, object, clickCoordinates) => {
        //Format the coordinates
        const formattedCoordinates = VectorUtils.formatCoordinates(clickCoordinates);

        // Initialize objects for this specific call
        const keysObjects = {};
        const mergeArray = this.mergeArray; // This array persists across multiple clicks/selects

        keysObjects["K"] = object.properties.Key;

        // Insert only if the key is unique for "objectType"
        PayloadGenerator.insertUniqueKey(objectType, "CLICK", keysObjects["K"], mergeArray);

        const payload = {
            version: "2.0",
            "xmlns:VB": "VB",
            Action: {
                name: event,
                object: objectType,
                id: object.id.toString(),
                instance: object.properties.Key,
                Params: {
                    Param: [
                        {
                            name: "x",
                            "#": object.properties.x
                        },
                        {
                            name: "y",
                            "#": object.properties.y
                        }
                    ]
                },
                AddActionProperties: {
                    AddActionProperty: [
                        {
                            name: "pos",
                            "#": formattedCoordinates
                        }
                    ]
                }
            },
            Data: {
                Merge: {
                    N: mergeArray
                }
            }
        };

        // Fire the submit event with the generated payload
        adapter.fireSubmit({
            data: JSON.stringify(payload)
        });
    };
    
    PayloadGenerator.KeyboardHandler = (event, name) => {
        const modifiers = {
            code: event.keyCode,
            shift: event.shiftKey,
            ctrl: event.ctrlKey,
            alt: event.altKey,
            meta: event.metaKey
        };

        var data = {
            "version": "2.0",
            "xmlns:VB": "VB",
            "Action": {
                "name": name,
                "Params": {
                    "Param": Object.entries(modifiers).map(([name, value]) => ({
                        "name": name,
                        "#": value
                    }))
                }
            }
        };

        this._adapter.fireSubmit({ data: JSON.stringify(data) });
};

    PayloadGenerator.selectObjects = (objects) => {
        // Initialize objects for this specific call
        const keysObjects = {};
        const mergeArray = this.mergeArray; // This array persists across multiple clicks/selects

        // Set VB:s to false for all existing entries
        mergeArray.forEach(item => {
            item.E.forEach(entry => {
                entry["VB:s"] = "false";
            });
        });
        this.mergeArray = mergeArray;       //Update it back

        objects.forEach(object => {
            switch (object.layer.type) {
                case 'circle':  // Spot
                    keysObjects["K"] = object.properties.Key;
                    // Insert only if the key is unique for "objectType"
                    PayloadGenerator.insertUniqueKey("Spot", "SELECT", keysObjects["K"], mergeArray);
                    break;
                case 'line':  // Link
                    keysObjects["K"] = object.properties.Key;
                    // Insert only if the key is unique for "objectType"
                    PayloadGenerator.insertUniqueKey("Link", "SELECT", keysObjects["K"], mergeArray);
                    break;
                default:
                    break;
            }
        });

        const payload = {
            version: "2.0",
            "xmlns:VB": "VB",
            Action: {
                name: "SELECT",
                object: "General",
                id: "GenSelect"
            },
            Data: {
                Merge: {
                    N: mergeArray
                }
            }
        }
        // Fire the submit event with the generated payload
        adapter.fireSubmit({
            data: JSON.stringify(payload)
        });
    }


    PayloadGenerator.onMapContextMenu = (coords, zoom, center, screenX, screenY) => {

        const payload = {
            version: "2.0",
            "xmlns:VB": "VB",
            Action: {
                name: "CONTEXT_MENU_REQUEST",
                object: "Map",
                id: "7",
                Params: {
                    Param: [
                        {
                            name: "x",
                            "#": screenX
                        },
                        {
                            name: "y",
                            "#": screenY
                        },
                        {
                            name: "scene",
                            "#": "MainScene"
                        }
                    ]
                },
                AddActionProperties: {
                    AddActionProperty: [
                        {
                            name: "pos",
                            "#": coords
                        },
                        {
                            name: "zoom",
                            "#": zoom
                        },
                        {
                            name: "centerpoint",
                            "#": center
                        },
                        {
                            name: "pitch",
                            "#": "0.0"
                        },
                        {
                            name: "yaw",
                            "#": "0.0"
                        }
                    ]
                }
            }
        }

        if (this.mergeArray.length > 0) {
            // Ensure `payload`, `Data`, `Merge`, and `N` nodes exist and set `N` to this.mergeArray
            payload.Data = payload.Data || {};        // Ensure `Data` exists
            payload.Data.Merge = payload.Data.Merge || {}; // Ensure `Merge` exists under `Data`
            payload.Data.Merge.N = this.mergeArray;   // Set `N` to this.mergeArray
        }

        // Fire the submit event with the generated payload
        adapter.fireSubmit({
            data: JSON.stringify(payload)
        });
    }

    return PayloadGenerator;
});
