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
      this.titul_pred = arg$.titul_pred, this.prijmeni = arg$.prijmeni, this.jmeno = arg$.jmeno, this.titul_za = arg$.titul_za, this.interpelace_source_count = arg$.interpelace_source_count, this.interpelace_target_count = arg$.interpelace_target_count, this.absence_count = arg$.absence_count, this.nazor_count = arg$.nazor_count, this.possible_votes_count = arg$.possible_votes_count, this.zakony_predkladatel_count = arg$.zakony_predkladatel_count, this.kraj = arg$.kraj, this.strana = arg$.strana;
      this.interpelace_sum = this.interpelace_source_count + this.interpelace_target_count;
      this.absence_normalized = this.absence_count / this.possible_votes_count;
      this.nazor_normalized = this.nazor_count / this.possible_votes_count;
    }
    prototype.getName = function(){
      return this.titul_pred + " " + this.jmeno + " " + this.prijmeni + " " + this.titul_za;
    };
    return Poslanec;
  }());
  SorterFilter = (function(){
    SorterFilter.displayName = 'SorterFilter';
    var prototype = SorterFilter.prototype, constructor = SorterFilter;
    function SorterFilter(parentSelector, parties){
      var x$;
      this.parties = parties;
      x$ = this.$element = $("<div class='filter'></div>");
      x$.appendTo($(parentSelector));
      this.createPartySelect();
      this.createSorter();
    }
    prototype.createPartySelect = function(){
      var $element;
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
      return $element.chosen();
    };
    prototype.createSorter = function(){
      var $element, x$, y$;
      $element = $("<div class='sort'><select class='sort' data-placeholder='Seřadit podle'><option value=''></option><option value='interpelace-desc'>Nejvíce interpelující</option><option value='interpelace-asc'>Nejméně interpelují</option><option value='zakony-desc'>Nejvíce předložených zákonů</option><option value='zakony-asc'>Nejméně předložených zákonů</option><option value='absence-desc'>Nejčastěji chybějící</option><option value='absence-asc'>Nejméně chybějící</option><option value='nazor-desc'>Nejčastěji hlasují ano/ne</option><option value='nazor-asc'>Nejméně hlasují ano/ne</option></select></div>");
      x$ = $element;
      x$.appendTo(this.$element);
      y$ = $element = $element.find('select');
      y$.chosen({
        allow_single_deselect: true
      });
      return y$;
    };
    return SorterFilter;
  }());
  PoslanecList = (function(){
    PoslanecList.displayName = 'PoslanecList';
    var prototype = PoslanecList.prototype, constructor = PoslanecList;
    function PoslanecList(parentSelector, poslanci){
      var x$;
      this.poslanci = poslanci;
      x$ = this.container = d3.select(parentSelector).append("ul");
      x$.attr('class', 'poslanecList');
      this.getScales();
      this.draw();
    }
    prototype.draw = function(){
      var x$, y$, z$, z1$, z2$, z3$, z4$, z5$, z6$, z7$, z8$, z9$, this$ = this;
      x$ = this.container.selectAll('li').data(this.poslanci).enter().append('li');
      x$.attr('class', function(it){
        return it.strana.zkratka;
      });
      x$.style('top', function(item, index){
        return index * list_item_height + "px";
      });
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
      z1$ = x$.append('div');
      z1$.attr('class', 'barchart');
      z2$ = z1$.append('div');
      z2$.attr('class', "interpelace bar");
      z2$.attr('data-tooltip', function(it){
        var str;
        str = it.interpelace_source_count
          ? "Interpeloval(a) <strong>" + it.interpelace_sum + "</strong>x"
          : "Byl(a) interpelován(a) <strong>" + it.interpelace_sum + "</strong>x";
        return escape(str);
      });
      z3$ = z2$.append('div');
      z3$.style('height', function(it){
        return this$.interpelaceScale(it.interpelace_sum) + "px";
      });
      z4$ = z1$.append('div');
      z4$.attr('class', "zakony bar");
      z4$.attr('data-tooltip', function(it){
        return escape("Předložil(a) <strong>" + it.zakony_predkladatel_count + "</strong> zákonů");
      });
      z5$ = z4$.append('div');
      z5$.style('height', function(it){
        return this$.zakonyScale(it.zakony_predkladatel_count) + "px";
      });
      z6$ = z1$.append('div');
      z6$.attr('class', "absence bar");
      z6$.attr('data-tooltip', function(it){
        return "Byl(a) u <strong>" + Math.round((1 - it.absence_normalized) * 100) + "%</strong> hlasování (" + it.absence_count + " z " + it.possible_votes_count + ")";
      });
      z7$ = z6$.append('div');
      z7$.style('height', function(it){
        return this$.percentageInvertedScale(it.absence_normalized) + "px";
      });
      z8$ = z1$.append('div');
      z8$.attr('class', "nazor bar");
      z8$.attr('data-tooltip', function(it){
        return "Vlastní nazor projevil(a) u <strong>" + Math.round(it.nazor_normalized * 100) + "%</strong> hlasování (" + it.nazor_count + " z " + it.possible_votes_count + ")";
      });
      z9$ = z8$.append('div');
      z9$.style('height', function(it){
        return this$.percentageScale(it.nazor_normalized) + "px";
      });
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
    return PoslanecList;
  }());
  d3.json("./api.php?get=poslanci", function(err, data){
    var kraje, strany, poslanci, poslanecList;
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
    new SorterFilter('#wrap', strany);
    poslanci = data.poslanci.map(function(it){
      it.kraj = kraje[it.kraj_id];
      it.strana = strany[it.strana_id];
      return new Poslanec(it);
    });
    return poslanecList = new PoslanecList('#wrap', poslanci);
  });
}).call(this);
