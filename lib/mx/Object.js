var mx = require("../mx-core");

mx.Object = function()
{
    var me = this;

    me.__class__ = mx.Object;
    me.__superClasses__ = [];

    me.constructed = false;
    me.disposed = false;

    me._ = function(p_options)
    {
        if (me.canConstruct())
        {
            if (mx.isPlainObject(p_options))
            {
                var isEventDispatcher = typeof (me.on) === "function";
                for ( var key in p_options)
                {
                    if (p_options.hasOwnProperty(key))
                    {
                        var option = p_options[key];
                        if (isEventDispatcher && typeof (me[key] === "object") && typeof (option) === "function" && key.startsWith("on"))
                        {
                            me.on(key.substr(2), option);
                        }
                        else
                        {
                            me[key] = option;
                        }

                        option = null;
                    }
                }
            }
            me.constructed = true;

            p_options = null;
        }
    };

    me.getClass = function()
    {
        return me.__class__;
    };

    me.getClassName = function()
    {
        var cls = me.getClass();
        if (mx.notEmpty(cls))
        {
            return cls.className;
        }
        return null;
    };

    me.getNamespace = function()
    {
        var clsName = me.getClassName();
        if (mx.notEmpty(clsName))
        {
            var parts = clsName.split(".");
            if (parts.length > 1)
            {
                parts = parts.slice(0, parts.length - 1);
                return parts.join(".");
            }
        }
        return null;
    };
    
    me.getModule = function()
    {
        return mx.getModule(me.getClassName());
    };

    me.getResourcePath = function(p_name, p_ext, p_auto2x)
    {
        var path = me.getModule().id + ".res." + p_name;
        return mx.getResourcePath(path, p_ext, p_auto2x);
    };
    
    me.canConstruct = function()
    {
        return !me.constructed;
    };
    
    me.instanceOf = function(p_class)
    {
        if (p_class === me.__class__)
        {
            return true;
        }
        else if (p_class === Object || p_class === mx.Object)
        {
            return true;
        }
        else
        {
            return me.__superClasses__.indexOf(p_class) !== -1;
        }
    };

    me.endOfClass = function(p_arguments)
    {
        if (me.__class__.caller !== mx.extend)
        {
            me._(p_arguments[0]);
        }
        return me;
    };

    me.dispose = function()
    {
        me.disposed = true;
    };

    return me.endOfClass(arguments);
};
module.exports = mx.Object;