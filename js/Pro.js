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
        return Pro.__super__.constructor.apply(this, arguments);
    }
    Pro.prototype.getValue = function() {
        return this.value;
    };
    return Pro;
}(proCon.Item);