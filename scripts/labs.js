/*
Object Creation
var obj = {a:1, b:2, c:3};
for (var prop in obj) {
  console.log("obj." + prop + " = " + obj[prop]);
}
console.log(Object.keys(obj), Object.getOwnPropertyNames(obj));

var adder = new Function('x','y', 'return x+y;');
var Fruit = function(color) {
    this.color = color;
}

Object.defineProperty(obj, 'a', {
  value: 37,
  writable: true,
  enumerable: true,
  configurable: false
});

var x = 1;
Object.defineProperty(obj, 'b', {
  set: function() {return x;},
  get: function(newValue) {x = newValue;},
  enumerable: true,
  configurable: false
});

console.log(delete o.a);

*/

Fruit.prototype.color = "Yellow";
Fruit.prototype.sweetness = 7;
Fruit.prototype.fruitName = "Generic Fruit";
Fruit.prototype.nativeToLand = "USA";

Fruit.prototype.showName = function () {
    console.log("This is a " + this.fruitName);
}

Fruit.prototype.nativeTo = function () {
        console.log("Grown in:" + this.nativeToLand);
}

function warn(message) {
   console.log(["WARN: ", message].join(' '));
}

function note(message) {
    console.log(["NOTE: ", message].join(' '));
}

function fail(message) {
    throw new Error(message);
}

function parseAge(age) {
    if (!_.isString(age)) fail("Expecting a string");
    var a;

    note("Attempting to parse age");
    a = parseInt(age, 10);
    if (_.isNaN(a)) {
        a = 0;
        warn(["Unable to parse age: ", age].join(' '));
    }
    return a;
}

function isIndexed(data) {
    return _.isArray(data) || _.isString(data);
}

function nth(a, index) {
    if(!_.isNumber(index)) {
        index = parseInt(index, 10);
        if(!_.isNumber(index) || _.isNaN(index))
            fail("Index has to be a number");
    }
    if(!isIndexed(a)) fail("Expected a number as the index");
    if(0 > index && index > a.length) fail("Out of bounds");

    return a[index];
}


function lessOrEqual(x, y) {
    return x <= y;
}

function comparator(pred) {
    return function(x, y) {
        if(pred(x,y)) return -1;
        else if (pred(y,x)) return 1;
        else return 0;
    }
}

//a = [2, 3, -1, -6, 0, 0, -108, 42, 10].sort(comparator(lessOrEqual));

function lameCSV(str) {
    return _.reduce(str.split("\n"), function(table, row) {
        table.push(_.map(row.split(','), function(c) {
            return c.trim()
        }));
        return table;
    }, []);
};

function selectNames(table) {
    return _.rest(_.map(table, _.first));
}

function selectAges(table) {
    return _.rest(_.map(table, function(row) {
        return nth(row, 1);
    }));
}

function selectHairColor(table) {
    return _.rest(_.map(table, function(row) {
        return nth(row, 2);
    }));
}

var mergeResults = _.zip;

var str = "name, age, hair \n Merble, 35, red \n Bob, 64, blonde";

var peopleTable = lameCSV(str);
//console.log(_.rest(peopleTable).sort());
//console.log(selectAges(peopleTable));

function existy(x) {
    return x != null;
}

function truthy(x) {
    return (x !== false && existy(x));
}

function doWhen(condition, action) {
    if(truthy(condition)) {
        return action();
    }
    else {
        return undefined;
    }
}

function executeIfHasField(target, name) {
    return doWhen(existy(target[name]), function(){
        var result = _.result(target, name);
        console.log(['The result is', result].join(' '));
        return result;
    });
}

// executeIfHasField([1,2,3], 'reverse');
// executeIfHasField({foo: 12}, 'foo');


function lyricSegment(n) {
    return _.chain([])
        .push(n + " bottles of beer on the wall")
        .push(n + " bottles of beer")
        .push("Take one down, pass it around")
        .tap(function(lyrics) {
            if(n > 1)
                lyrics.push((n-1) + " bottles of beer on the wall.");
            else
                lyrics.push("No more bottles of beer on the wall!");
        }).value();
}

function song(start, end, lyricGen) {
    return _.reduce(_.range(start, end, -1), function(acc, n) {
        return acc.concat(lyricGen(n));
    },[]);
}

function point2D(x, y) {
    this._x = x;
    this._y = y;
}

function point3D(x,y,z) {
    point2D.call(this, x,y);
    this._z = z;
}

function allOf() {
    return _.reduce(arguments, function(truth, f) {
        return truth && f();
    }, true);
}

function anyOf() {
    return _.reduce(arguments, function(truth, f) {
        return truth || f();
    }, false);
}

function complement(pred) {
    return function() {
        return !pred.apply(null, _.toArray(arguments));
    };
}

function cat() {
    var head = _.first(arguments);
    if(existy(head))
        return head.concat.apply(head, _.rest(arguments));
    else
        return [];
}


function construct(head, tail) {
    return cat([head], _.toArray(tail));
}

function mapcat(fun, coll) {
    return cat.apply(null, _.map(coll, fun));
}

function buLast(coll) {
    return _.toArray(coll).slice(0, -1);
}

function interpose(inter, coll) {
    return buLast(mapcat(function(e) {
        return construct(e, [inter]);
    }, coll));
}

// interpose(',', [1,2,3]);

var library = [{title: "SICP", isbn: "0262010771", ed: 1},
{title: "SICP", isbn: "0262510871", ed: 2},
{title: "Joy of Clojure", isbn: "1935182641", ed: 1}];

// Select All Query
function project(table, keys) {
    return _.map(table, function(obj) {
        return _.pick.apply(null, construct(obj, keys));
    });
}

function rename(obj, newNames) {
    return _.reduce(newNames, function(o, nu, old) {
        if(_.has(obj, old)) {
            o[nu] = obj[old]
            return o;
        }
        else {
            return o;
        }
    }, _.omit.apply(null, construct(obj, _.keys(newNames))));
}

function as(table,newNames) {
    return _.map(table, function(obj) {
        return rename(obj, newNames);
    });
}

function restrict(table, predicate) {
    return _.reduce(table, function(newTable, obj) {
        if(truthy(predicate(obj)))
            return newTable;
        else
            return _.without(newTable, obj);
    }, table);
}

// Scope
var globals = {};

function makeBindFun(resolver) {
    return function(k, v) {
        var stack = globals[k] || [];
        globals[k] = resolver(stack, v);
        return globals;
    }
}

var stackBinder  = makeBindFun(function(stack , v) {
    stack.push(v);
    return stack;
});

var stackUnbinder = makeBindFun(function(stack) {
    stack.pop();
    return stack;
});

var dynamicLookup = function(k) {
    var slot = globals[k] || [];
    return _.last(slot);
};

// Use bind to preserve scope
var target = {
    name: 'the right value',
    aux: function() { return this.name; },
    act: function() { return this.aux(); }
};
