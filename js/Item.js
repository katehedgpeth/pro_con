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

proCon.Item = function(superClass) {
    extend(Item, superClass);
    function Item() {
        this.onRangeChanged = bind(this.onRangeChanged, this);
        this.onRemoveClicked = bind(this.onRemoveClicked, this);
        this.onSaveClicked = bind(this.onSaveClicked, this);
        Item.__super__.constructor.apply(this, arguments);
        this.value = 0;
        proCon.itemCount || (proCon.itemCount = 0);
        this.id = proCon.itemCount;
        proCon.itemCount += 1;
        this.editEl = this.build({
            node: "input.name",
            attributes: {
                type: "text",
                placeholder: "type something here"
            }
        });
        this.removeBtn = this.build({
            node: "a.remove",
            textContent: "X"
        });
        this.showEl = this.build({
            node: "p.name"
        });
        this.valueEl = this.build({
            node: "input.value",
            attributes: {
                min: -20,
                max: 20,
                value: 0,
                type: "range"
            }
        });
        this.container = this.build({
            node: "form.item"
        });
        this.container.appendChild(this.removeBtn);
        this.container.appendChild(this.editEl);
        this.container.appendChild(this.valueEl);
        this.applyHandlers();
    }
    Item.prototype.applyHandlers = function() {
        this.container.addEventListener("submit", this.onSaveClicked);
        this.removeBtn.addEventListener("click", this.onRemoveClicked);
        this.valueEl.addEventListener("change", this.onRangeChanged);
        return this.editEl.addEventListener("keyup", this.onInputKeyup);
    };
    Item.prototype.onSaveClicked = function(e) {
        if (e) {
            e.preventDefault();
        }
        this.name = this.editEl.value;
        this.value = this.valueEl.valueAsNumber;
        this.setLocalStorage();
        this.showEl.textContent = this.name;
        this.editEl.remove();
        this.container.appendChild(this.showEl);
        this.container.appendChild(this.valueEl);
        if (e) {
            return this.fire("save", this);
        }
    };
    Item.prototype.onRemoveClicked = function() {
        this.container.remove();
        window.localStorage.removeItem("proCon" + this.id);
        return this.fire("remove", this.id);
    };
    Item.prototype.onRangeChanged = function() {
        this.editEl.focus();
        this.value = this.valueEl.valueAsNumber;
        this.setLocalStorage();
        if (this.editEl.value !== this.name && this.editEl.value !== "") {
            return this.onSaveClicked();
        } else {
            return this.fire("update");
        }
    };
    Item.prototype.setLocalStorage = function() {
        var val;
        val = JSON.stringify({
            value: this.value,
            name: this.name
        });
        return window.localStorage.setItem("proCon" + this.id, val);
    };
    Item.prototype.onInputKeyup = function(e) {
        if (e.keyCode !== 27) {
            return e.cancelBubble = true;
        }
    };
    return Item;
}(proCon.Observable);