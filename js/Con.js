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
        return Con.__super__.constructor.apply(this, arguments);
    }
    Con.prototype.getValue = function() {
        return this.value * -1;
    };
    return Con;
}(proCon.Item);