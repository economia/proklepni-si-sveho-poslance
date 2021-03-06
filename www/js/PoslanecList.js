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
        return (index * list_item_height + list_item_offset) + "px";
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
        return (index * list_item_height + list_item_offset) + "px";
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
      var x$, row, y$, z$, z1$, z2$;
      x$ = row = enterSelection.append('li');
      x$.attr('class', function(it){
        return "poslanec " + it.strana.zkratka;
      });
      x$.style('top', function(item, index){
        return (index * list_item_height + list_item_offset) + "px";
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
      z2$ = x$.append('span');
      z2$.attr('class', 'order');
      z2$.html(function(poslanec, index){
        return (poslanec.index + 1) + ".";
      });
      x$.on('click', function(it){
        return it.onSelect();
      });
      this.appendBarchart(row);
      if (Modernizr.svg) {
        this.appendPiechart(row);
      }
      return row;
    };
    prototype.appendBarchart = function(row){
      var x$, barchart, y$, z$, z1$, z2$, z3$, z4$, z5$, z6$, this$ = this;
      x$ = barchart = row.append('div');
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
      z3$.attr('class', "vystoupeni bar");
      z3$.attr('data-tooltip', function(it){
        return "Promluvil(a) <strong>" + it.vystoupeni_count + "x</strong>";
      });
      z4$ = z3$.append('div');
      z4$.style('height', function(it){
        return this$.vystoupeniScale(it.vystoupeni_count) + "px";
      });
      if (!Modernizr.svg) {
        z5$ = barchart.append('div');
        z5$.attr('class', "absence bar");
        z5$.attr('data-tooltip', function(it){
          return "Byl(a) u <strong>" + (it.possible_votes_count - it.absence_count) + "</strong> hlasování z <strong>" + it.possible_votes_count + "</strong>";
        });
        z6$ = z5$.append('div');
        z6$.style('height', function(it){
          return this$.percentageInvertedScale(it.absence_normalized) + "px";
        });
        return z5$;
      }
    };
    prototype.appendPiechart = function(row){
      var radius, colors, x$, y$, this$ = this;
      radius = list_barchart_height / 2;
      colors = ['#85BEE6', 'transparent'];
      x$ = row.append('svg').append('g').attr('transform', "translate(" + radius + ", " + radius + ")").attr('data-tooltip', function(it){
        return "Byl(a) u <strong>" + (it.possible_votes_count - it.absence_count) + "</strong> hlasování z <strong>" + it.possible_votes_count + "</strong>";
      }).selectAll('path').data(function(it){
        return this$.pie([it.possible_votes_count - it.absence_count, it.absence_count]);
      }).enter();
      y$ = x$.append('path');
      y$.attr('fill', function(d, i){
        return colors[i];
      });
      y$.attr('d', this.pieArc);
      return x$;
    };
    prototype.getScales = function(){
      var interpelaceMaximum, x$, zakonyMaximum, y$, vystoupeniMaximum, z$, z1$, z2$, z3$, z4$;
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
      z2$.range([1, list_barchart_height * 0.9]);
      z3$ = this.pie = d3.layout.pie();
      z3$.startAngle(function(){
        return Math.PI * 1.5;
      });
      z3$.endAngle(Math.PI * 3.5);
      z3$.sort(function(){
        return null;
      });
      z4$ = this.pieArc = d3.svg.arc();
      z4$.outerRadius(list_barchart_height * 0.9 / 2);
      return z4$;
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
