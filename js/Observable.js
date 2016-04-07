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
    Observable.prototype.build = function(opts) {
        var child, childEl, el, i, len, ref;
        if (!opts.node) {
            opts.node = "div";
        }
        el = this.parseElNode(opts.node);
        if (opts.attributes) {
            _.each(opts.attributes, function(val, key) {
                return el.setAttribute(key, val);
            });
        }
        if (opts.data) {
            _.each(opts.data, function(val, key) {
                return el.dataset[key] = val;
            });
        }
        if (opts.textContent) {
            el.textContent = opts.textContent;
        }
        if (el.nodeName === "A" && el.href === "") {
            el.href = "javascript:void(0)";
        }
        if (opts.children != null) {
            ref = opts.children;
            for (i = 0, len = ref.length; i < len; i++) {
                child = ref[i];
                childEl = this.build(child);
                el.appendChild(childEl);
            }
        }
        if (opts.variable) {
            this[opts.variable] = el;
        }
        return el;
    };
    Observable.prototype.parseElNode = function(node) {
        var classStart, classes, el, end, id, idStart, nodeType, stop;
        idStart = node.indexOf("#");
        classStart = node.indexOf(".");
        if (idStart !== -1) {
            stop = classStart !== -1 && idStart < classStart ? idStart : node.length;
            id = node.slice(idStart + 1, stop);
        }
        if (classStart !== -1) {
            stop = idStart !== -1 && classStart < idStart ? idStart : node.length;
            classes = node.slice(classStart, stop).replace(/\./g, " ").trim();
        }
        if (node[0] === "#" || node[0] === ".") {
            nodeType = "div";
        } else {
            end = node.search(/\W/);
            nodeType = end !== -1 ? node.slice(0, end) : node;
        }
        el = document.createElement(nodeType);
        if (classes) {
            el.setAttribute("class", classes);
        }
        if (id) {
            el.setAttribute("id", id);
        }
        return el;
    };
    return Observable;
}();