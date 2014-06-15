var pathUtil = require("path"); 
var mx = require("./javascript-extensions");
exports = mx;
module.exports = mx;

exports.contentPath = null;

exports.init = function()
{
    exports.contentPath = process.env.PWD;
};

exports.mappath = function(p_url)
{
    if (typeof (p_url) !== "string")
    {
        return null;
    }

    var url = p_url;
    if (url.startsWith("~/"))
    {
        url = exports.contentPath + url.substr(1);
    }
    return url;
};


var _logger = null;
exports.__defineGetter__('logger', function()
{
    if (_logger === null)
    {
        _logger = require("tracer").colorConsole({
            dateformat : "HH:MM:ss",
            format : [
                "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
                {
                    error : "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}"
                }
            ],
        });
    }
    return _logger;
});
exports.__defineSetter__('logger', function(p_logger)
{
    _logger = p_logger;
});



/*
 * Object-Oriented Features
 */
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

exports.registerAssembly = function(p_assemblyId, p_path)
{
    if (!_checkNamespace(p_assemblyId))
    {
        throw new Error("Invalid assembly name '" + p_assemblyId + "'.");
    }
    if (isEmpty(p_path))
    {
        p_path = pathUtil.join(exports.contentPath, "lib", p_assemblyId); 
    }
    var path = p_path;
    if (!path.endsWith(pathUtil.sep))
    {
        path += pathUtil.sep;
    }
    
    var assembly = {
        id: p_assemblyId,
        path: path
    };
    mx.assemblies.add(assembly);
    mx.assemblies.sort(function(a, b)
    {
        return a.id.length - b.id.length;
    });
};

exports.getAssembly = function(p_id)
{
    var assembly = null;
    for (var i = mx.assemblies.length - 1; i >= 0; i--)
    {
        var m = mx.assemblies[i];
        if (p_id.startsWith(m.id + "."))
        {
            assembly = m;
            break;
        }
    }
    return assembly;
};

exports.getResourcePath = function(p_name, p_ext)
{
    if (mx.isEmpty(p_ext))
    {
        p_ext = "json";
    }
    var assembly = exports.getAssembly(p_name);
    if (assembly === null)
    {
        return null;
    }
    var path = assembly.path;
    path = pathUtil.join(path, p_name.substr(assembly.id.length + 1).replace(/\./g, pathUtil.sep));
    path += "." + p_ext;
    return path;
};

exports.importClass = function(p_fullClassName)
{
    var path = exports.getResourcePath(p_fullClassName, "js");
    if (path === null)
    {
        throw new Error("Can not find class " + p_fullClassName + ". Parent assembly may not registered yet.");
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