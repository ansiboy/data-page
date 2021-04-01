const m = require("maishu-node-mvc");
const { getVirtualPaths } = require("maishu-admin-scaffold");
const path = require("path");

let virtualPaths = getVirtualPaths();
virtualPaths["node_modules"] = path.join(__dirname, "../node_modules");
virtualPaths["out"] = path.join(__dirname, "../out");
/** @type {m.Settings} */
let w = {
    port: 4326,
    virtualPaths
}

exports.default = w;