var bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments);
    };
}, extend = function(child, parent) {
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

proCon.Controller = function(superClass) {
    extend(Controller, superClass);
    function Controller() {
        this.recalculate = bind(this.recalculate, this);
        this.render = bind(this.render, this);
        this.list = new proCon.Side();
        this.applyHandlers();
    }
    Controller.prototype.applyHandlers = function() {
        window.addEventListener("load", this.render);
        return this.list.on("recalculate", this.recalculate);
    };
    Controller.prototype.render = function() {
        document.querySelector("#sides").appendChild(this.list.el);
        this.decisionEl = document.querySelector("#decision");
        this.sortBtn = document.querySelector("#sort");
        this.sortBtn.addEventListener("click", this.list.sortItems);
        return this.list.updateValue();
    };
    Controller.prototype.recalculate = function() {
        var pct, scale;
        this.getGroups();
        scale = this.pros.value + this.cons.value;
        pct = this.pros.value === this.cons.value ? 50 : this.pros.value / scale * 100;
        document.querySelector("#bar").setAttribute("style", "width:" + pct + "%");
        console.log(pct);
        return this.setText(pct);
    };
    Controller.prototype.getGroups = function() {
        this.pros = [];
        this.pros.value = 0;
        this.cons = [];
        this.cons.value = 0;
        return this.list.items.map(function(_this) {
            return function(item) {
                var val;
                val = item.value.valueOf() || 0;
                if (val > 0) {
                    _this.pros.push(item);
                    return _this.pros.value += val;
                } else {
                    if (val < 0) {
                        val = -val;
                    }
                    _this.cons.push(item);
                    return _this.cons.value += val;
                }
            };
        }(this));
    };
    Controller.prototype.setText = function(pct) {
        var text;
        if (pct >= 85) {
            text = "You should definitely do it!";
        }
        if (pct < 85 && pct >= 65) {
            text = "You should probably do it.";
        }
        if (pct < 65 && pct >= 35) {
            text = "You should think about it some more.";
        }
        if (pct < 35 && pct >= 15) {
            text = "You probably shouldn't do it.";
        }
        if (pct < 15 && pct >= 0) {
            text = "You definitely shouldn't do it.";
        }
        return this.decisionEl.textContent = text;
    };
    return Controller;
}(proCon.Observable);