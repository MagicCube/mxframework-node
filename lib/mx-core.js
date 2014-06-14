var pathUtil = require("path"); 
var mx = require("./javascript-extensions");
exports = mx;
module.exports = mx;

exports.namespace = function(p_namespace)
{
    if (!_checkNamespace(p_namespace))
    {
        throw new Error("Invalid namespace '" + p_namespace + "'.");
    }
    var parts = p_namespace.split(".");
    if (parts.length === 0)
    {
        return null;
    }

    var partialNS = null;
    var context = global;
    for (var i = 0; i < parts.length; i++)
    {
        partialNS = parts[i];
        if (mx.isEmpty(context[partialNS]))
        {
            context[partialNS] =
            {};
        }
        context = context[partialNS];
    }
    return context;
};

exports.extend = function(p_baseClass)
{
    if (typeof (p_baseClass) === "function")
    {
        var inst = new p_baseClass();
        inst.__class__ = mx.extend.caller;
        if (p_baseClass !== mx.Object && p_baseClass !== mx.Component)
        {
            inst.__superClasses__.push(p_baseClass);
        }
        return inst;
    }
};

exports.getClass = function(p_inst)
{
    if (mx.isEmpty(p_inst))
    {
        return null;
    }
    switch (typeof (p_inst))
    {
        case "boolean":
            return Boolean;

        case "number":
            return Number;

        case "string":
            return String;

        case "function":
            return Function;

        case "object":
            if (typeof (p_inst.getClass) === "function")
            {
                return p_inst.getClass();
            }
            else if (mx.isDate(p_inst))
            {
                return Date;
            }
            else if (mx.isArray(p_inst))
            {
                return Array;
            }
            else
            {
                return Object;
            }
            break;
        default:
            return null;
    }
};

exports.instanceOf = function(p_inst, p_class)
{
    if (mx.isEmpty(p_inst))
    {
        return false;
    }
    switch (typeof (p_inst))
    {
        case "boolean":
            return p_class === Boolean;

        case "number":
            return p_class === Number;

        case "string":
            return p_class === String;

        case "function":
            return p_class === Function;

        case "object":
            if (typeof (p_inst.instanceOf) === "function")
            {
                return p_inst.instanceOf(p_class);
            }
            else if (mx.isDate(p_inst))
            {
                return p_class === Date;
            }
            else if (mx.isArray(p_inst))
            {
                return p_class === Array;
            }
            else
            {
                return true;
            }
            break;
        default:
            return false;
    }
};

exports.registerModule = function(p_moduleId, p_path)
{
    if (!_checkNamespace(p_moduleId))
    {
        throw new Error("Invalid module name '" + p_moduleId + "'.");
    }
    var path = p_path;
    if (!path.endsWith(pathUtil.sep))
    {
        path += pathUtil.sep;
    }
    
    var module = {
        id: p_moduleId,
        path: path
    };
    mx.modules.add(module);
    mx.modules.sort(function(a, b)
    {
        return a.id.length - b.id.length;
    });
};

exports.getModule = function(p_id)
{
    var module = null;
    for (var i = mx.modules.length - 1; i >= 0; i--)
    {
        var m = mx.modules[i];
        if (p_id.startsWith(m.id + "."))
        {
            module = m;
            break;
        }
    }
    return module;
};

exports.getResourcePath = function(p_name, p_ext)
{
    if (mx.isEmpty(p_ext))
    {
        p_ext = "json";
    }
    var module = exports.getModule(p_name);
    if (module === null)
    {
        return null;
    }
    var path = module.path;
    path += p_name.substr(module.id.length + 1).replace(/\./g, pathUtil.sep);
    path += "." + p_ext;
    return path;
};

exports.importClass = function(p_fullClassName)
{
    var path = exports.getResourcePath(p_fullClassName, "js");
    if (path === null)
    {
        throw new Error("Can not find class " + p_fullClassName + ". Parent module may not registered yet.");
    }
    var cls = require(path);
    if (mx.isClass(cls))
    {
        cls.className = p_fullClassName;
    }
};





function _checkNamespace(p_namespace)
{
    return /^[a-z]+[a-z0-9\._\$]*[a-z0-9]$/.test(p_namespace);
}