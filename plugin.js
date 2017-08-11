"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unattendUser = require("./lib/unattendUser");
var notifications = require("./lib/db/notifications");
var meta = require('./plugin.json');
meta.nbbId = meta.id.replace(/nodebb-plugin-/, '');
function setup(params, callback) {
    var admin = require('./lib/admin');
    var api = require('./lib/api');
    var actions = require('./lib/actions').default;
    admin.init(params, meta, function () {
        api.setAllowedCategories(admin.getAllowedCategories());
        api.setApiKey(admin.getApiKey());
        api.init(params, callback);
    });
    actions(params, meta, function () {
    });
}
exports.setup = setup;
function catchAttendanceChange(params, callback) {
    if (params.probability >= 1) {
        return callback && callback();
    }
    unattendUser.unattendUser(params.tid, params.uid, function (err, resultCount) {
        if (resultCount) {
            notifications.notifyAutoUnslotted(params.tid, params.uid, resultCount);
        }
        callback && callback();
    });
}
exports.catchAttendanceChange = catchAttendanceChange;
exports.admin = {
    menu: function (custom_header, callback) {
        custom_header.plugins.push({
            "route": '/plugins/' + meta.nbbId,
            "icon": 'fa-calendar',
            "name": meta.name
        });
        callback(null, custom_header);
    }
};
