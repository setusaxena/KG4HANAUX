/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/kg4hana/NavigationUI/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});