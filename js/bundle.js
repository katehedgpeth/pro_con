(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
proCon.words = require("random-words");

require("./Observable.js");

require("./Item.js");

require("./Pro.js");

require("./Con.js");

require("./Side.js");

require("./Pros.js");

require("./Cons.js");

require("./Controller.js");
},{"./Con.js":1,"./Cons.js":2,"./Controller.js":3,"./Item.js":4,"./Observable.js":5,"./Pro.js":6,"./Pros.js":7,"./Side.js":8,"random-words":10}],10:[function(require,module,exports){
var wordList = [
  // Borrowed from xkcd password generator which borrowed it from wherever
  "ability","able","aboard","about","above","accept","accident","according",
  "account","accurate","acres","across","act","action","active","activity",
  "actual","actually","add","addition","additional","adjective","adult","adventure",
  "advice","affect","afraid","after","afternoon","again","against","age",
  "ago","agree","ahead","aid","air","airplane","alike","alive",
  "all","allow","almost","alone","along","aloud","alphabet","already",
  "also","although","am","among","amount","ancient","angle","angry",
  "animal","announced","another","answer","ants","any","anybody","anyone",
  "anything","anyway","anywhere","apart","apartment","appearance","apple","applied",
  "appropriate","are","area","arm","army","around","arrange","arrangement",
  "arrive","arrow","art","article","as","aside","ask","asleep",
  "at","ate","atmosphere","atom","atomic","attached","attack","attempt",
  "attention","audience","author","automobile","available","average","avoid","aware",
  "away","baby","back","bad","badly","bag","balance","ball",
  "balloon","band","bank","bar","bare","bark","barn","base",
  "baseball","basic","basis","basket","bat","battle","be","bean",
  "bear","beat","beautiful","beauty","became","because","become","becoming",
  "bee","been","before","began","beginning","begun","behavior","behind",
  "being","believed","bell","belong","below","belt","bend","beneath",
  "bent","beside","best","bet","better","between","beyond","bicycle",
  "bigger","biggest","bill","birds","birth","birthday","bit","bite",
  "black","blank","blanket","blew","blind","block","blood","blow",
  "blue","board","boat","body","bone","book","border","born",
  "both","bottle","bottom","bound","bow","bowl","box","boy",
  "brain","branch","brass","brave","bread","break","breakfast","breath",
  "breathe","breathing","breeze","brick","bridge","brief","bright","bring",
  "broad","broke","broken","brother","brought","brown","brush","buffalo",
  "build","building","built","buried","burn","burst","bus","bush",
  "business","busy","but","butter","buy","by","cabin","cage",
  "cake","call","calm","came","camera","camp","can","canal",
  "cannot","cap","capital","captain","captured","car","carbon","card",
  "care","careful","carefully","carried","carry","case","cast","castle",
  "cat","catch","cattle","caught","cause","cave","cell","cent",
  "center","central","century","certain","certainly","chain","chair","chamber",
  "chance","change","changing","chapter","character","characteristic","charge","chart",
  "check","cheese","chemical","chest","chicken","chief","child","children",
  "choice","choose","chose","chosen","church","circle","circus","citizen",
  "city","class","classroom","claws","clay","clean","clear","clearly",
  "climate","climb","clock","close","closely","closer","cloth","clothes",
  "clothing","cloud","club","coach","coal","coast","coat","coffee",
  "cold","collect","college","colony","color","column","combination","combine",
  "come","comfortable","coming","command","common","community","company","compare",
  "compass","complete","completely","complex","composed","composition","compound","concerned",
  "condition","congress","connected","consider","consist","consonant","constantly","construction",
  "contain","continent","continued","contrast","control","conversation","cook","cookies",
  "cool","copper","copy","corn","corner","correct","correctly","cost",
  "cotton","could","count","country","couple","courage","course","court",
  "cover","cow","cowboy","crack","cream","create","creature","crew",
  "crop","cross","crowd","cry","cup","curious","current","curve",
  "customs","cut","cutting","daily","damage","dance","danger","dangerous",
  "dark","darkness","date","daughter","dawn","day","dead","deal",
  "dear","death","decide","declared","deep","deeply","deer","definition",
  "degree","depend","depth","describe","desert","design","desk","detail",
  "determine","develop","development","diagram","diameter","did","die","differ",
  "difference","different","difficult","difficulty","dig","dinner","direct","direction",
  "directly","dirt","dirty","disappear","discover","discovery","discuss","discussion",
  "disease","dish","distance","distant","divide","division","do","doctor",
  "does","dog","doing","doll","dollar","done","donkey","door",
  "dot","double","doubt","down","dozen","draw","drawn","dream",
  "dress","drew","dried","drink","drive","driven","driver","driving",
  "drop","dropped","drove","dry","duck","due","dug","dull",
  "during","dust","duty","each","eager","ear","earlier","early",
  "earn","earth","easier","easily","east","easy","eat","eaten",
  "edge","education","effect","effort","egg","eight","either","electric",
  "electricity","element","elephant","eleven","else","empty","end","enemy",
  "energy","engine","engineer","enjoy","enough","enter","entire","entirely",
  "environment","equal","equally","equator","equipment","escape","especially","essential",
  "establish","even","evening","event","eventually","ever","every","everybody",
  "everyone","everything","everywhere","evidence","exact","exactly","examine","example",
  "excellent","except","exchange","excited","excitement","exciting","exclaimed","exercise",
  "exist","expect","experience","experiment","explain","explanation","explore","express",
  "expression","extra","eye","face","facing","fact","factor","factory",
  "failed","fair","fairly","fall","fallen","familiar","family","famous",
  "far","farm","farmer","farther","fast","fastened","faster","fat",
  "father","favorite","fear","feathers","feature","fed","feed","feel",
  "feet","fell","fellow","felt","fence","few","fewer","field",
  "fierce","fifteen","fifth","fifty","fight","fighting","figure","fill",
  "film","final","finally","find","fine","finest","finger","finish",
  "fire","fireplace","firm","first","fish","five","fix","flag",
  "flame","flat","flew","flies","flight","floating","floor","flow",
  "flower","fly","fog","folks","follow","food","foot","football",
  "for","force","foreign","forest","forget","forgot","forgotten","form",
  "former","fort","forth","forty","forward","fought","found","four",
  "fourth","fox","frame","free","freedom","frequently","fresh","friend",
  "friendly","frighten","frog","from","front","frozen","fruit","fuel",
  "full","fully","fun","function","funny","fur","furniture","further",
  "future","gain","game","garage","garden","gas","gasoline","gate",
  "gather","gave","general","generally","gentle","gently","get","getting",
  "giant","gift","girl","give","given","giving","glad","glass",
  "globe","go","goes","gold","golden","gone","good","goose",
  "got","government","grabbed","grade","gradually","grain","grandfather","grandmother",
  "graph","grass","gravity","gray","great","greater","greatest","greatly",
  "green","grew","ground","group","grow","grown","growth","guard",
  "guess","guide","gulf","gun","habit","had","hair","half",
  "halfway","hall","hand","handle","handsome","hang","happen","happened",
  "happily","happy","harbor","hard","harder","hardly","has","hat",
  "have","having","hay","he","headed","heading","health","heard",
  "hearing","heart","heat","heavy","height","held","hello","help",
  "helpful","her","herd","here","herself","hidden","hide","high",
  "higher","highest","highway","hill","him","himself","his","history",
  "hit","hold","hole","hollow","home","honor","hope","horn",
  "horse","hospital","hot","hour","house","how","however","huge",
  "human","hundred","hung","hungry","hunt","hunter","hurried","hurry",
  "hurt","husband","ice","idea","identity","if","ill","image",
  "imagine","immediately","importance","important","impossible","improve","in","inch",
  "include","including","income","increase","indeed","independent","indicate","individual",
  "industrial","industry","influence","information","inside","instance","instant","instead",
  "instrument","interest","interior","into","introduced","invented","involved","iron",
  "is","island","it","its","itself","jack","jar","jet",
  "job","join","joined","journey","joy","judge","jump","jungle",
  "just","keep","kept","key","kids","kill","kind","kitchen",
  "knew","knife","know","knowledge","known","label","labor","lack",
  "lady","laid","lake","lamp","land","language","large","larger",
  "largest","last","late","later","laugh","law","lay","layers",
  "lead","leader","leaf","learn","least","leather","leave","leaving",
  "led","left","leg","length","lesson","let","letter","level",
  "library","lie","life","lift","light","like","likely","limited",
  "line","lion","lips","liquid","list","listen","little","live",
  "living","load","local","locate","location","log","lonely","long",
  "longer","look","loose","lose","loss","lost","lot","loud",
  "love","lovely","low","lower","luck","lucky","lunch","lungs",
  "lying","machine","machinery","mad","made","magic","magnet","mail",
  "main","mainly","major","make","making","man","managed","manner",
  "manufacturing","many","map","mark","market","married","mass","massage",
  "master","material","mathematics","matter","may","maybe","me","meal",
  "mean","means","meant","measure","meat","medicine","meet","melted",
  "member","memory","men","mental","merely","met","metal","method",
  "mice","middle","might","mighty","mile","military","milk","mill",
  "mind","mine","minerals","minute","mirror","missing","mission","mistake",
  "mix","mixture","model","modern","molecular","moment","money","monkey",
  "month","mood","moon","more","morning","most","mostly","mother",
  "motion","motor","mountain","mouse","mouth","move","movement","movie",
  "moving","mud","muscle","music","musical","must","my","myself",
  "mysterious","nails","name","nation","national","native","natural","naturally",
  "nature","near","nearby","nearer","nearest","nearly","necessary","neck",
  "needed","needle","needs","negative","neighbor","neighborhood","nervous","nest",
  "never","new","news","newspaper","next","nice","night","nine",
  "no","nobody","nodded","noise","none","noon","nor","north",
  "nose","not","note","noted","nothing","notice","noun","now",
  "number","numeral","nuts","object","observe","obtain","occasionally","occur",
  "ocean","of","off","offer","office","officer","official","oil",
  "old","older","oldest","on","once","one","only","onto",
  "open","operation","opinion","opportunity","opposite","or","orange","orbit",
  "order","ordinary","organization","organized","origin","original","other","ought",
  "our","ourselves","out","outer","outline","outside","over","own",
  "owner","oxygen","pack","package","page","paid","pain","paint",
  "pair","palace","pale","pan","paper","paragraph","parallel","parent",
  "park","part","particles","particular","particularly","partly","parts","party",
  "pass","passage","past","path","pattern","pay","peace","pen",
  "pencil","people","per","percent","perfect","perfectly","perhaps","period",
  "person","personal","pet","phrase","physical","piano","pick","picture",
  "pictured","pie","piece","pig","pile","pilot","pine","pink",
  "pipe","pitch","place","plain","plan","plane","planet","planned",
  "planning","plant","plastic","plate","plates","play","pleasant","please",
  "pleasure","plenty","plural","plus","pocket","poem","poet","poetry",
  "point","pole","police","policeman","political","pond","pony","pool",
  "poor","popular","population","porch","port","position","positive","possible",
  "possibly","post","pot","potatoes","pound","pour","powder","power",
  "powerful","practical","practice","prepare","present","president","press","pressure",
  "pretty","prevent","previous","price","pride","primitive","principal","principle",
  "printed","private","prize","probably","problem","process","produce","product",
  "production","program","progress","promised","proper","properly","property","protection",
  "proud","prove","provide","public","pull","pupil","pure","purple",
  "purpose","push","put","putting","quarter","queen","question","quick",
  "quickly","quiet","quietly","quite","rabbit","race","radio","railroad",
  "rain","raise","ran","ranch","range","rapidly","rate","rather",
  "raw","rays","reach","read","reader","ready","real","realize",
  "rear","reason","recall","receive","recent","recently","recognize","record",
  "red","refer","refused","region","regular","related","relationship","religious",
  "remain","remarkable","remember","remove","repeat","replace","replied","report",
  "represent","require","research","respect","rest","result","return","review",
  "rhyme","rhythm","rice","rich","ride","riding","right","ring",
  "rise","rising","river","road","roar","rock","rocket","rocky",
  "rod","roll","roof","room","root","rope","rose","rough",
  "round","route","row","rubbed","rubber","rule","ruler","run",
  "running","rush","sad","saddle","safe","safety","said","sail",
  "sale","salmon","salt","same","sand","sang","sat","satellites",
  "satisfied","save","saved","saw","say","scale","scared","scene",
  "school","science","scientific","scientist","score","screen","sea","search",
  "season","seat","second","secret","section","see","seed","seeing",
  "seems","seen","seldom","select","selection","sell","send","sense",
  "sent","sentence","separate","series","serious","serve","service","sets",
  "setting","settle","settlers","seven","several","shade","shadow","shake",
  "shaking","shall","shallow","shape","share","sharp","she","sheep",
  "sheet","shelf","shells","shelter","shine","shinning","ship","shirt",
  "shoe","shoot","shop","shore","short","shorter","shot","should",
  "shoulder","shout","show","shown","shut","sick","sides","sight",
  "sign","signal","silence","silent","silk","silly","silver","similar",
  "simple","simplest","simply","since","sing","single","sink","sister",
  "sit","sitting","situation","six","size","skill","skin","sky",
  "slabs","slave","sleep","slept","slide","slight","slightly","slip",
  "slipped","slope","slow","slowly","small","smaller","smallest","smell",
  "smile","smoke","smooth","snake","snow","so","soap","social",
  "society","soft","softly","soil","solar","sold","soldier","solid",
  "solution","solve","some","somebody","somehow","someone","something","sometime",
  "somewhere","son","song","soon","sort","sound","source","south",
  "southern","space","speak","special","species","specific","speech","speed",
  "spell","spend","spent","spider","spin","spirit","spite","split",
  "spoken","sport","spread","spring","square","stage","stairs","stand",
  "standard","star","stared","start","state","statement","station","stay",
  "steady","steam","steel","steep","stems","step","stepped","stick",
  "stiff","still","stock","stomach","stone","stood","stop","stopped",
  "store","storm","story","stove","straight","strange","stranger","straw",
  "stream","street","strength","stretch","strike","string","strip","strong",
  "stronger","struck","structure","struggle","stuck","student","studied","studying",
  "subject","substance","success","successful","such","sudden","suddenly","sugar",
  "suggest","suit","sum","summer","sun","sunlight","supper","supply",
  "support","suppose","sure","surface","surprise","surrounded","swam","sweet",
  "swept","swim","swimming","swing","swung","syllable","symbol","system",
  "table","tail","take","taken","tales","talk","tall","tank",
  "tape","task","taste","taught","tax","tea","teach","teacher",
  "team","tears","teeth","telephone","television","tell","temperature","ten",
  "tent","term","terrible","test","than","thank","that","thee",
  "them","themselves","then","theory","there","therefore","these","they",
  "thick","thin","thing","think","third","thirty","this","those",
  "thou","though","thought","thousand","thread","three","threw","throat",
  "through","throughout","throw","thrown","thumb","thus","thy","tide",
  "tie","tight","tightly","till","time","tin","tiny","tip",
  "tired","title","to","tobacco","today","together","told","tomorrow",
  "tone","tongue","tonight","too","took","tool","top","topic",
  "torn","total","touch","toward","tower","town","toy","trace",
  "track","trade","traffic","trail","train","transportation","trap","travel",
  "treated","tree","triangle","tribe","trick","tried","trip","troops",
  "tropical","trouble","truck","trunk","truth","try","tube","tune",
  "turn","twelve","twenty","twice","two","type","typical","uncle",
  "under","underline","understanding","unhappy","union","unit","universe","unknown",
  "unless","until","unusual","up","upon","upper","upward","us",
  "use","useful","using","usual","usually","valley","valuable","value",
  "vapor","variety","various","vast","vegetable","verb","vertical","very",
  "vessels","victory","view","village","visit","visitor","voice","volume",
  "vote","vowel","voyage","wagon","wait","walk","wall","want",
  "war","warm","warn","was","wash","waste","watch","water",
  "wave","way","we","weak","wealth","wear","weather","week",
  "weigh","weight","welcome","well","went","were","west","western",
  "wet","whale","what","whatever","wheat","wheel","when","whenever",
  "where","wherever","whether","which","while","whispered","whistle","white",
  "who","whole","whom","whose","why","wide","widely","wife",
  "wild","will","willing","win","wind","window","wing","winter",
  "wire","wise","wish","with","within","without","wolf","women",
  "won","wonder","wonderful","wood","wooden","wool","word","wore",
  "work","worker","world","worried","worry","worse","worth","would",
  "wrapped","write","writer","writing","written","wrong","wrote","yard",
  "year","yellow","yes","yesterday","yet","you","young","younger",
  "your","yourself","youth","zero","zoo"
];

function words(options) {
  function word() {
    return wordList[randInt(wordList.length)];
  }

  function randInt(lessThan) {
    return Math.floor(Math.random() * lessThan);
  }

  // No arguments = generate one word
  if (typeof(options) === 'undefined') {
    return word();
  }

  // Just a number = return that many words
  if (typeof(options) === 'number') {
    options = { exactly: options };
  }

  // options supported: exactly, min, max, join

  if (options.exactly) {
    options.min = options.exactly;
    options.max = options.exactly;
  }
  var total = options.min + randInt(options.max + 1 - options.min);
  var results = [];
  for (var i = 0; (i < total); i++) {
    results.push(word());
  }
  if (options.join) {
    results = results.join(options.join);
  }
  return results;
}

module.exports = words;
// Export the word list as it is often useful
words.wordList = wordList;


},{}]},{},[9]);
