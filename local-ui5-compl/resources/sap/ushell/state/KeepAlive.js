// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/state/ControlManager","sap/ushell/state/CurrentState"],function(t,e){"use strict";class s{store(s){e.storeState(s);t.storeList(s)}restore(s){e.restoreState(s);t.restoreList(s)}flush(){e.flushState();t.flushList()}destroy(e){t.destroyFromStorage(e)}}return new s});
//# sourceMappingURL=KeepAlive.js.map