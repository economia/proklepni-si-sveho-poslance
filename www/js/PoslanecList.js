(function(){
  var PoslanecList;
  window.PoslanecList = PoslanecList = (function(){
    PoslanecList.displayName = 'PoslanecList';
    var prototype = PoslanecList.prototype, constructor = PoslanecList;
    function PoslanecList(parentSelector, poslanci, sorterFilter){
      var x$;
      this.poslanci = poslanci;
      this.sorterFilter = sorterFilter;
      this.currentData = this.poslanci.slice(0);
      x$ = this.container = d3.select(parentSelector).append("ul");
      x$.attr('class', 'poslanecList');
      this.getScales();
      this.draw();
      this.sorterFilter.onSortChangeCb = bind$(this, 'reSort');
      this.sorterFilter.onFilterChangeCb = bind$(this, 'reFilter');
    }
    prototype.draw = function(){
      var newRows;
      newRows = this.getRowElements().data(this.currentData, function(it){
        return it.id;
      }).enter();
      return this.decorateRows(newRows);
    };
    prototype.reSort = function(){
      var x$;
      this.poslanci.sort(this.sorterFilter.sortFunction);
      x$ = this.getRowElements().sort(this.sorterFilter.sortFunction).transition();
      x$.duration(800);
      x$.style('top', function(item, index){
        return index * list_item_height + "px";
      });
      return x$;
    };
    prototype.reFilter = function(){
      var x$, sel, y$, z$, z1$, z2$, z3$;
      this.currentData = this.poslanci.filter(this.sorterFilter.filterFunction);
      x$ = sel = this.getRowElements().data(this.currentData, function(it){
        return it.id;
      });
      y$ = x$.transition();
      y$.delay(600);
      y$.duration(800);
      y$.style('top', function(item, index){
        return index * list_item_height + "px";
      });
      z$ = x$.exit();
      z$.classed('poslanec', false);
      z1$ = z$.transition();
      z1$.delay(function(item, index){
        return index * 10;
      });
      z1$.duration(800);
      z1$.style('left', "-110%");
      z1$.remove();
      z2$ = this.decorateRows(sel.enter());
      z2$.style('transform', "scale(0.1)");
      z2$.style('-ms-transform', "scale(0.1)");
      z2$.style('-o-transform', "scale(0.1)");
      z2$.style('-webkit-transform', "scale(0.1)");
      z2$.style('-moz-transform', "scale(0.1)");
      z2$.style('opacity', "0");
      z3$ = z2$.transition();
      z3$.delay(600);
      z3$.duration(800);
      z3$.style('transform', "scale(1)");
      z3$.style('-ms-transform', "scale(1)");
      z3$.style('-o-transform', "scale(1)");
      z3$.style('-webkit-transform', "scale(1)");
      z3$.style('-moz-transform', "scale(1)");
      z3$.style('opacity', "1");
      return z2$;
    };
    prototype.decorateRows = function(enterSelection){
      var x$, row, y$, z$, z1$;
      x$ = row = enterSelection.append('li');
      x$.attr('class', function(it){
        return "poslanec " + it.strana.zkratka;
      });
      x$.style('top', function(item, index){
        return index * list_item_height + "px";
      });
      x$.style('left', "0%");
      y$ = x$.append('span');
      y$.attr('class', 'name');
      y$.html(function(it){
        return it.getName();
      });
      z$ = x$.append('span');
      z$.attr('class', 'party');
      z$.html(function(it){
        return it.strana.plny;
      });
      z1$ = x$.append('img');
      z1$.attr('src', function(it){
        return "./img/poslanci_thumb/" + it.id + ".png";
      });
      x$.on('click', function(it){
        return it.onSelect();
      });
      return this.appendBarchart(row);
    };
    prototype.appendBarchart = function(row){
      var x$, y$, z$, z1$, z2$, z3$, z4$, z5$, z6$, this$ = this;
      x$ = row.append('div');
      x$.attr('class', 'barchart');
      y$ = x$.append('div');
      y$.attr('class', "interpelace bar");
      y$.attr('data-tooltip', function(it){
        return escape("Interpeloval(a) <strong>" + it.interpelace_sum + "</strong>x");
      });
      z$ = y$.append('div');
      z$.style('height', function(it){
        return this$.interpelaceScale(it.interpelace_source_count) + "px";
      });
      z1$ = x$.append('div');
      z1$.attr('class', "zakony bar");
      z1$.attr('data-tooltip', function(it){
        return escape("Předložil(a) <strong>" + it.zakony_predkladatel_count + "</strong> zákonů");
      });
      z2$ = z1$.append('div');
      z2$.style('height', function(it){
        return this$.zakonyScale(it.zakony_predkladatel_count) + "px";
      });
      z3$ = x$.append('div');
      z3$.attr('class', "absence bar");
      z3$.attr('data-tooltip', function(it){
        return "Byl(a) u <strong>" + Math.round((1 - it.absence_normalized) * 100) + "%</strong> hlasování (" + it.absence_count + " z " + it.possible_votes_count + ")";
      });
      z4$ = z3$.append('div');
      z4$.style('height', function(it){
        return this$.percentageInvertedScale(it.absence_normalized) + "px";
      });
      z5$ = x$.append('div');
      z5$.attr('class', "vystoupeni bar");
      z5$.attr('data-tooltip', function(it){
        return "Přednesl(a) projev <strong>" + it.vystoupeni_count + "x</strong>";
      });
      z6$ = z5$.append('div');
      z6$.style('height', function(it){
        return this$.vystoupeniScale(it.vystoupeni_count) + "px";
      });
      return x$;
    };
    prototype.getScales = function(){
      var interpelaceMaximum, x$, zakonyMaximum, y$, vystoupeniMaximum, z$, z1$, z2$;
      interpelaceMaximum = Math.max.apply(Math, this.poslanci.map(function(it){
        return it.interpelace_source_count;
      }));
      x$ = this.interpelaceScale = d3.scale.linear();
      x$.domain([0, interpelaceMaximum]);
      x$.range([1, list_barchart_height]);
      zakonyMaximum = Math.max.apply(Math, this.poslanci.map(function(it){
        return it.zakony_predkladatel_count;
      }));
      y$ = this.zakonyScale = d3.scale.linear();
      y$.domain([0, zakonyMaximum]);
      y$.range([1, list_barchart_height]);
      vystoupeniMaximum = Math.max.apply(Math, this.poslanci.map(function(it){
        return it.vystoupeni_count;
      }));
      z$ = this.vystoupeniScale = d3.scale.linear();
      z$.domain([0, vystoupeniMaximum]);
      z$.range([1, list_barchart_height]);
      z1$ = this.percentageScale = d3.scale.linear();
      z1$.domain([0, 1]);
      z1$.range([1, list_barchart_height]);
      z2$ = this.percentageInvertedScale = d3.scale.linear();
      z2$.domain([1, 0]);
      z2$.range([1, list_barchart_height]);
      return z2$;
    };
    prototype.getRowElements = function(){
      return this.container.selectAll("li.poslanec");
    };
    return PoslanecList;
  }());
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
