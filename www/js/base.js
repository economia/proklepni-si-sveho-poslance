(function(){
  var list_item_height, list_barchart_height, Strana, Kraj, Poslanec, SorterFilter, PoslanecList, this$ = this;
  list_item_height = 62;
  list_barchart_height = 50;
  new Tooltip().watchElements();
  Strana = (function(){
    Strana.displayName = 'Strana';
    var prototype = Strana.prototype, constructor = Strana;
    function Strana(arg$){
      this.nazev = arg$.nazev, this.plny = arg$.plny, this.zkratka = arg$.zkratka;
    }
    return Strana;
  }());
  Kraj = (function(){
    Kraj.displayName = 'Kraj';
    var prototype = Kraj.prototype, constructor = Kraj;
    function Kraj(arg$){
      this.nazev = arg$.nazev;
    }
    return Kraj;
  }());
  Poslanec = (function(){
    Poslanec.displayName = 'Poslanec';
    var prototype = Poslanec.prototype, constructor = Poslanec;
    function Poslanec(arg$){
      this.id = arg$.id, this.titul_pred = arg$.titul_pred, this.prijmeni = arg$.prijmeni, this.jmeno = arg$.jmeno, this.titul_za = arg$.titul_za, this.interpelace_source_count = arg$.interpelace_source_count, this.interpelace_target_count = arg$.interpelace_target_count, this.absence_count = arg$.absence_count, this.nazor_count = arg$.nazor_count, this.possible_votes_count = arg$.possible_votes_count, this.zakony_predkladatel_count = arg$.zakony_predkladatel_count, this.kraj = arg$.kraj, this.strana = arg$.strana;
      this.interpelace_sum = this.interpelace_source_count + this.interpelace_target_count;
      this.absence_normalized = this.absence_count / this.possible_votes_count;
      this.nazor_normalized = this.nazor_count / this.possible_votes_count;
    }
    prototype.getName = function(){
      return this.jmeno + " " + this.prijmeni;
    };
    return Poslanec;
  }());
  SorterFilter = (function(){
    SorterFilter.displayName = 'SorterFilter';
    var prototype = SorterFilter.prototype, constructor = SorterFilter;
    prototype.sortFunction = null;
    prototype.filterFunction = null;
    prototype.onSortChangeCb = null;
    prototype.onFilterChangeCb = null;
    function SorterFilter(parentSelector, parties){
      var x$;
      this.parties = parties;
      x$ = this.$element = $("<div class='filter'></div>");
      x$.appendTo($(parentSelector));
      this.createPartySelect();
      this.createSorter();
    }
    prototype.createPartySelect = function(){
      var $element, x$, this$ = this;
      $element = $("<div class='party'><select class='party' multiple='multiple' data-placeholder='Zobrazit pouze stranu'></select></div>");
      $element.appendTo(this.$element);
      $element = $element.find('select');
      this.parties.forEach(function(party){
        var x$;
        if (party === null) {
          return;
        }
        x$ = $("<option value='" + party.zkratka + "'>" + party.nazev + "</option>");
        x$.appendTo($element);
        return x$;
      });
      x$ = $element;
      x$.chosen();
      x$.on('change', function(){
        return this$.onFilterChange('party', $element.val());
      });
      return x$;
    };
    prototype.createSorter = function(){
      var $element, x$, y$, this$ = this;
      $element = $("<div class='sort'><select class='sort' data-placeholder='Seřadit podle'><option value=''></option><option value='interpelace-desc'>Nejvíce interpelující</option><option value='interpelace-asc'>Nejméně interpelují</option><option value='zakony-desc'>Nejvíce předložených zákonů</option><option value='zakony-asc'>Nejméně předložených zákonů</option><option value='absence-asc'>Nejčastěji přítomní</option><option value='absence-desc'>Nejméně přítomní</option><option value='nazor-desc'>Nejčastěji hlasují ano/ne</option><option value='nazor-asc'>Nejméně hlasují ano/ne</option></select></div>");
      x$ = $element;
      x$.appendTo(this.$element);
      y$ = $element = $element.find('select');
      y$.chosen({
        allow_single_deselect: true
      });
      y$.on('change', function(){
        return this$.onSortChange($element.val());
      });
      return y$;
    };
    prototype.onSortChange = function(sortId){
      this.sortFunction = (function(){
        switch (sortId) {
        case 'interpelace-desc':
          return function(a, b){
            return b.interpelace_sum - a.interpelace_sum;
          };
        case 'interpelace-asc':
          return function(a, b){
            return a.interpelace_sum - b.interpelace_sum;
          };
        case 'zakony-desc':
          return function(a, b){
            return b.zakony_predkladatel_count - a.zakony_predkladatel_count;
          };
        case 'zakony-asc':
          return function(a, b){
            return a.zakony_predkladatel_count - b.zakony_predkladatel_count;
          };
        case 'absence-desc':
          return function(a, b){
            return b.absence_normalized - a.absence_normalized;
          };
        case 'absence-asc':
          return function(a, b){
            return a.absence_normalized - b.absence_normalized;
          };
        case 'nazor-desc':
          return function(a, b){
            return b.nazor_normalized - a.nazor_normalized;
          };
        case 'nazor-asc':
          return function(a, b){
            return a.nazor_normalized - b.nazor_normalized;
          };
        default:
          return null;
        }
      }());
      return typeof this.onSortChangeCb === 'function' ? this.onSortChangeCb() : void 8;
    };
    prototype.onFilterChange = function(filterType, filterValue){
      this.filterFunction = (function(){
        switch (filterType) {
        case 'party':
          return function(poslanec){
            return in$(poslanec.strana.zkratka, filterValue);
          };
        default:
          return null;
        }
      }());
      return typeof this.onFilterChangeCb === 'function' ? this.onFilterChangeCb() : void 8;
    };
    return SorterFilter;
  }());
  PoslanecList = (function(){
    PoslanecList.displayName = 'PoslanecList';
    var prototype = PoslanecList.prototype, constructor = PoslanecList;
    function PoslanecList(parentSelector, poslanci, sorterFilter){
      var x$;
      this.poslanci = poslanci;
      this.sorterFilter = sorterFilter;
      x$ = this.container = d3.select(parentSelector).append("ul");
      x$.attr('class', 'poslanecList');
      this.getScales();
      this.draw();
      this.sorterFilter.onSortChangeCb = bind$(this, 'reSort');
      this.sorterFilter.onFilterChangeCb = bind$(this, 'reFilter');
    }
    prototype.draw = function(){
      var x$, y$, z$, z1$, z2$, z3$, z4$, z5$, z6$, z7$, z8$, z9$, z10$, this$ = this;
      x$ = this.getRowElements().data(this.poslanci, function(it){
        return it.id;
      }).enter().append('li');
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
      z2$ = x$.append('div');
      z2$.attr('class', 'barchart');
      z3$ = z2$.append('div');
      z3$.attr('class', "interpelace bar");
      z3$.attr('data-tooltip', function(it){
        var str;
        str = it.interpelace_source_count
          ? "Interpeloval(a) <strong>" + it.interpelace_sum + "</strong>x"
          : "Byl(a) interpelován(a) <strong>" + it.interpelace_sum + "</strong>x";
        return escape(str);
      });
      z4$ = z3$.append('div');
      z4$.style('height', function(it){
        return this$.interpelaceScale(it.interpelace_sum) + "px";
      });
      z5$ = z2$.append('div');
      z5$.attr('class', "zakony bar");
      z5$.attr('data-tooltip', function(it){
        return escape("Předložil(a) <strong>" + it.zakony_predkladatel_count + "</strong> zákonů");
      });
      z6$ = z5$.append('div');
      z6$.style('height', function(it){
        return this$.zakonyScale(it.zakony_predkladatel_count) + "px";
      });
      z7$ = z2$.append('div');
      z7$.attr('class', "absence bar");
      z7$.attr('data-tooltip', function(it){
        return "Byl(a) u <strong>" + Math.round((1 - it.absence_normalized) * 100) + "%</strong> hlasování (" + it.absence_count + " z " + it.possible_votes_count + ")";
      });
      z8$ = z7$.append('div');
      z8$.style('height', function(it){
        return this$.percentageInvertedScale(it.absence_normalized) + "px";
      });
      z9$ = z2$.append('div');
      z9$.attr('class', "nazor bar");
      z9$.attr('data-tooltip', function(it){
        return "Vlastní nazor projevil(a) u <strong>" + Math.round(it.nazor_normalized * 100) + "%</strong> hlasování (" + it.nazor_count + " z " + it.possible_votes_count + ")";
      });
      z10$ = z9$.append('div');
      z10$.style('height', function(it){
        return this$.percentageScale(it.nazor_normalized) + "px";
      });
      return x$;
    };
    prototype.reSort = function(){
      var x$;
      x$ = this.getRowElements().sort(this.sorterFilter.sortFunction).transition();
      x$.duration(800);
      x$.style('top', function(item, index){
        return index * list_item_height + "px";
      });
      return x$;
    };
    prototype.reFilter = function(){
      var currentData, x$, sel, y$, z$, z1$;
      currentData = this.poslanci.filter(this.sorterFilter.filterFunction);
      x$ = sel = this.getRowElements().data(currentData, function(it){
        return it.id;
      });
      y$ = x$.transition();
      y$.delay(400);
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
      return x$;
    };
    prototype.getScales = function(){
      var x$, zakonyMaximum, y$, z$, z1$;
      x$ = this.interpelaceScale = d3.scale.linear();
      x$.domain([0, 200, 718]);
      x$.range([1, list_barchart_height * 0.85, list_barchart_height]);
      zakonyMaximum = Math.max.apply(Math, this.poslanci.map(function(it){
        return it.zakony_predkladatel_count;
      }));
      y$ = this.zakonyScale = d3.scale.linear();
      y$.domain([0, zakonyMaximum]);
      y$.range([1, list_barchart_height]);
      z$ = this.percentageScale = d3.scale.linear();
      z$.domain([0, 1]);
      z$.range([1, list_barchart_height]);
      z1$ = this.percentageInvertedScale = d3.scale.linear();
      z1$.domain([1, 0]);
      z1$.range([1, list_barchart_height]);
      return z1$;
    };
    prototype.getRowElements = function(){
      return this.container.selectAll("li.poslanec");
    };
    return PoslanecList;
  }());
  d3.json("./api.php?get=poslanci", function(err, data){
    var kraje, strany, sorterFilter, poslanci, poslanecList;
    kraje = data.kraje.map(function(it){
      if (it) {
        return new Kraj(it);
      } else {
        return null;
      }
    });
    strany = data.strany.map(function(it){
      if (it) {
        return new Strana(it);
      } else {
        return null;
      }
    });
    sorterFilter = new SorterFilter('#wrap', strany);
    poslanci = data.poslanci.map(function(it){
      it.kraj = kraje[it.kraj_id];
      it.strana = strany[it.strana_id];
      return new Poslanec(it);
    });
    return poslanecList = new PoslanecList('#wrap', poslanci, sorterFilter);
  });
  function in$(x, arr){
    var i = -1, l = arr.length >>> 0;
    while (++i < l) if (x === arr[i] && i in arr) return true;
    return false;
  }
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
