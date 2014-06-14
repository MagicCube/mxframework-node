var path = require("path");

var mx = require("./lib/javascript-extensions");
module.exports = mx;
mx.merge(mx, {
    modules: [],
    about: {
        version: "0.1.0",
        author: {
            name: "Henry Li",
            email: "henry1943@163.com"
        }
    }
});
mx.merge(mx, require("./lib/mx-core.js"));




/**
 * Module mx
 */
mx.registerModule("mx", path.resolve(module.paths[0], "../lib/mx"));
mx.importClass("mx.Object");
mx.importClass("mx.Event");
mx.importClass("mx.Component");
console.log(mx);




/**
 * Globalization
 */
global.mx = mx;
global.isEmpty = mx.isEmpty;
global.notEmpty = mx.notEmpty;
global.isBoolean = mx.isBoolean;
global.isString = mx.isString;
global.isNumber = mx.isNumber;
global.isDate = mx.isDate;
global.isArray = mx.isArray;
global.isObject = mx.isObject;
global.isPlainObject = mx.isPlainObject;
global.isFunction = mx.isFunction;
global.isClass = mx.isClass;
global.parseBoolean = mx.parseBoolean;
global.parseTimeString = mx.parseTimeString;
global.parseDateString = mx.parseDateString;
global.parseDate = mx.parseDate;
global.$ns = mx.namespace;
global.$extend = mx.extend;
global.$getclass = mx.getClass;
global.$instanceof = mx.instanceOf;
global.$register = mx.registerModule;
global.$import = mx.importClass;