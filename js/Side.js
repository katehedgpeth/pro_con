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

proCon.Side = function(superClass) {
    extend(Side, superClass);
    function Side() {
        this.handleShortcuts = bind(this.handleShortcuts, this);
        this.sortItems = bind(this.sortItems, this);
        this.updateValue = bind(this.updateValue, this);
        this.onRemoveItem = bind(this.onRemoveItem, this);
        this.onSaveItem = bind(this.onSaveItem, this);
        this.addItem = bind(this.addItem, this);
        Side.__super__.constructor.apply(this, arguments);
        this.model || (this.model = proCon.Item);
        this.id || (this.id = ".side");
        this.el = this.build({
            node: this.id
        });
        this.addButton = this.build({
            node: "a.add",
            textContent: "+ Add another item"
        });
        this.el.appendChild(this.addButton);
        this.items = [];
        this.value = 0;
        this.getLocalStorage();
        this.addItem();
        this.applyHandlers();
    }
    Side.prototype.getLocalStorage = function() {
        var data, i, item, len, newModel, results, storage;
        storage = _.chain(localStorage).clone().toArray().value();
        localStorage.clear();
        results = [];
        for (i = 0, len = storage.length; i < len; i++) {
            item = storage[i];
            data = JSON.parse(item);
            newModel = this.addItem();
            newModel.editEl.value = data.name;
            newModel.valueEl.value = data.value;
            results.push(newModel.onSaveClicked());
        }
        return results;
    };
    Side.prototype.applyHandlers = function() {
        this.addButton.addEventListener("click", this.addItem);
        return window.addEventListener("keyup", this.handleShortcuts);
    };
    Side.prototype.addItem = function() {
        var newModel;
        newModel = new this.model();
        newModel.on("save", this.onSaveItem);
        newModel.on("remove", this.onRemoveItem);
        newModel.on("update", this.updateValue);
        this.el.appendChild(newModel.container);
        this.el.appendChild(this.addButton);
        newModel.editEl.focus();
        this.items.push(newModel);
        return newModel;
    };
    Side.prototype.onSaveItem = function() {
        this.removeEmpty();
        this.addItem();
        this.el.appendChild(this.addButton);
        return this.updateValue();
    };
    Side.prototype.onRemoveItem = function(id) {
        this.items.splice(this.items.findIndex(function(d) {
            return d.id === id;
        }), 1);
        this.updateValue();
        if (this.items.length === 0) {
            return this.addItem();
        }
    };
    Side.prototype.updateValue = function() {
        var i, item, len, ref;
        this.value = 0;
        ref = this.items;
        for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            this.value += parseInt(item.valueEl.value, 10);
        }
        return this.fire("recalculate");
    };
    Side.prototype.sortItems = function() {
        var empty, i, item, len, sortable;
        this.items.forEach(function(item) {
            return item.container.remove();
        });
        sortable = this.items.filter(function(item) {
            return item.editEl.value !== "";
        });
        empty = this.items.filter(function(item) {
            return item.editEl.value === "";
        });
        this.addButton.remove();
        sortable.sort(function(a, b) {
            if (a.value > b.value) {
                return -1;
            } else if (b.value > a.value) {
                return 1;
            } else if (b.value === a.value) {
                return 0;
            }
        });
        sortable.forEach(function(_this) {
            return function(item) {
                return _this.el.appendChild(item.container);
            };
        }(this));
        localStorage.clear();
        for (i = 0, len = sortable.length; i < len; i++) {
            item = sortable[i];
            item.setLocalStorage();
        }
        empty.forEach(function(_this) {
            return function(item) {
                return _this.el.appendChild(item.container);
            };
        }(this));
        return this.el.appendChild(this.addButton);
    };
    Side.prototype.createRandomItem = function(e) {
        var item;
        item = this.addItem();
        item.valueEl.value = _.random(parseInt(item.valueEl.getAttribute("min"), 10), parseInt(item.valueEl.getAttribute("max"), 10));
        item.editEl.value = proCon.words(Math.random() * 20).join(" ");
        item.onSaveClicked(e);
        return this.updateValue();
    };
    Side.prototype.removeEmpty = function() {
        var empty;
        empty = this.items.filter(function(item) {
            return item.editEl.value === "";
        })[0];
        if (empty) {
            empty.container.remove();
            return this.items.splice(this.items.findIndex(function(d) {
                return d.id === empty.id;
            }), 1);
        }
    };
    Side.prototype.handleShortcuts = function(e) {
        if (e.keyCode === 78) {
            this.addItem();
        }
        if (e.keyCode === 27) {
            this.removeEmpty();
        }
        if (e.keyCode === 83) {
            this.sortItems();
        }
        return console.log(e.keyCode);
    };
    return Side;
}(proCon.Observable);