(function () {
    var constantInjection = {};
    BI.constant = function (xtype, cls) {
        if (constantInjection[xtype] != null) {
            throw ("constant:[" + xtype + "] has been registed");
        }
        constantInjection[xtype] = cls;
    };

    var modelInjection = {};
    BI.model = function (xtype, cls) {
        if (modelInjection[xtype] != null) {
            throw ("model:[" + xtype + "] has been registed");
        }
        modelInjection[xtype] = cls;
    };

    var storeInjection = {};
    BI.store = function (xtype, cls) {
        if (storeInjection[xtype] != null) {
            throw ("store:[" + xtype + "] has been registed");
        }
        storeInjection[xtype] = cls;
    };

    var serviceInjection = {};
    BI.service = function (xtype, cls) {
        if (serviceInjection[xtype] != null) {
            throw ("service:[" + xtype + "] has been registed");
        }
        serviceInjection[xtype] = cls;
    };

    var providerInjection = {};
    BI.provider = function (xtype, cls) {
        if (providerInjection[xtype] != null) {
            throw ("provider:[" + xtype + "] has been registed");
        }
        providerInjection[xtype] = cls;
    };

    BI.config = function (type, configFn) {
        if (constantInjection[type]) {
            return constantInjection[type] = configFn(constantInjection[type]);
        }
        if (providerInjection[type]) {
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            return configFn(providers[type]);
        }
        BI.Plugin.configWidget(type, configFn);
    };

    var actions = {};
    BI.action = function (type, actionFn) {
        if (!actions[type]) {
            actions[type] = [];
        }
        actions[type].push(actionFn);
        return function () {
            actions[type].remove(actionFn);
            if (actions[type].length === 0) {
                delete actions[type];
            }
        };
    };

    var points = {};
    BI.point = function (type, action, pointFn, after) {
        if (!points[type]) {
            points[type] = {};
        }
        if (!points[type][action]) {
            points[type][action] = {};
        }
        if (!points[type][action][after ? "after" : "before"]) {
            points[type][action][after ? "after" : "before"] = [];
        }
        points[type][action][after ? "after" : "before"].push(pointFn);
    };

    BI.Constants = {
        getConstant: function (type) {
            return constantInjection[type];
        }
    };

    var callPoint = function (inst, type) {
        if (points[type]) {
            for (var action in points[type]) {
                var bfns = points[type][action].before;
                if (bfns) {
                    BI.aspect.before(inst, action, function (bfns) {
                        return function () {
                            for (var i = 0, len = bfns.length; i < len; i++) {
                                try {
                                    bfns[i].apply(inst, arguments);
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        };
                    }(bfns));
                }
                var afns = points[type][action].after;
                if (afns) {
                    BI.aspect.after(inst, action, function (afns) {
                        return function () {
                            for (var i = 0, len = afns.length; i < len; i++) {
                                try {
                                    afns[i].apply(inst, arguments);
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        }
                    }(afns));
                }
            }
        }
    };

    BI.Models = {
        getModel: function (type, config) {
            var inst = new modelInjection[type](config);
            callPoint(inst, type);
            return inst;
        }
    };

    var stores = {};

    BI.Stores = {
        getStore: function (type, config) {
            if (stores[type]) {
                return stores[type];
            }
            stores[type] = new storeInjection[type](config);
            callPoint(stores[type], type);
            return stores[type];
        }
    };

    var services = {};

    BI.Services = {
        getService: function (type, config) {
            if (services[type]) {
                return services[type];
            }
            services[type] = new serviceInjection[type](config);
            callPoint(services[type], type);
            return services[type];
        }
    };

    var providers = {}, providerInstance = {};

    BI.Providers = {
        getProvider: function (type, config) {
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            if (!providerInstance[type]) {
                providerInstance[type] = new providers[type].$get()(config);
            }
            return providerInstance[type];
        }
    };

    BI.Actions = {
        runAction: function (type, config) {
            BI.each(actions[type], function (i, act) {
                act(config);
            });
        }
    };
})();
