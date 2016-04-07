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

proCon.Pros = function(superClass) {
    extend(Pros, superClass);
    function Pros() {
        this.model = proCon.Pro;
        this.id = "#pros";
        Pros.__super__.constructor.apply(this, arguments);
    }
    return Pros;
}(proCon.Side);