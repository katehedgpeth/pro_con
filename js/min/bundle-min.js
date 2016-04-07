(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})({
    1: [ function(require, module, exports) {
        var extend = function(child, parent) {
            for (var key in parent) {
                if (hasProp.call(parent, key)) child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        }, hasProp = {}.hasOwnProperty;
        proCon.Con = function(superClass) {
            extend(Con, superClass);
            function Con() {
                Con.__super__.constructor.apply(this, arguments);
            }
            return Con;
        }(proCon.side);
    }, {} ],
    2: [ function(require, module, exports) {
        proCon.Controller = function() {
            function Controller() {
                this.pros = new proCon.Pro();
                this.cons = new proCon.Con();
                this.applyHandlers();
            }
            Controller.prototype.applyHandlers = function() {};
            return Controller;
        }();
    }, {} ],
    3: [ function(require, module, exports) {
        var slice = [].slice;
        proCon.Observable = function() {
            function Observable() {}
            Observable.prototype.on = function(event, handler) {
                var base;
                (base = this.events || (this.events = {}))[event] || (base[event] = $.Callbacks());
                return this.events[event].add(handler);
            };
            Observable.prototype.fire = function() {
                var event, params, ref;
                event = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
                if (this.events && this.events[event] != null) {
                    return (ref = this.events[event]).fire.apply(ref, params);
                }
            };
            return Observable;
        }();
    }, {} ],
    4: [ function(require, module, exports) {
        var extend = function(child, parent) {
            for (var key in parent) {
                if (hasProp.call(parent, key)) child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        }, hasProp = {}.hasOwnProperty;
        proCon.Pro = function(superClass) {
            extend(Pro, superClass);
            function Pro() {
                Pro.__super__.constructor.apply(this, arguments);
            }
            return Pro;
        }(proCon.side);
    }, {} ],
    5: [ function(require, module, exports) {
        var extend = function(child, parent) {
            for (var key in parent) {
                if (hasProp.call(parent, key)) child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        }, hasProp = {}.hasOwnProperty;
        proCon.Side = function(superClass) {
            extend(Side, superClass);
            function Side() {
                Side.__super__.constructor.apply(this, arguments);
            }
            return Side;
        }(proCon.Observable);
    }, {} ],
    6: [ function(require, module, exports) {
        var proCon;
        proCon = {};
        require("./Observable.js");
        require("./Side.js");
        require("./Pro.js");
        require("./Con.js");
        require("./Controller.js");
    }, {
        "./Con.js": 1,
        "./Controller.js": 2,
        "./Observable.js": 3,
        "./Pro.js": 4,
        "./Side.js": 5
    } ]
}, {}, [ 6 ]);