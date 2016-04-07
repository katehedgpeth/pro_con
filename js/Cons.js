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

proCon.Cons = function(superClass) {
    extend(Cons, superClass);
    function Cons() {
        this.id = "#cons";
        this.model = proCon.Con;
        Cons.__super__.constructor.apply(this, arguments);
    }
    return Cons;
}(proCon.Side);