(function(){
  var list_barchart_height, Poslanec, PoslanecList, this$ = this;
  list_barchart_height = 50;
  Poslanec = (function(){
    Poslanec.displayName = 'Poslanec';
    var prototype = Poslanec.prototype, constructor = Poslanec;
    function Poslanec(arg$){
      this.titul_pred = arg$.titul_pred, this.prijmeni = arg$.prijmeni, this.jmeno = arg$.jmeno, this.titul_za = arg$.titul_za, this.interpelace_source_count = arg$.interpelace_source_count, this.interpelace_target_count = arg$.interpelace_target_count, this.absence_count = arg$.absence_count, this.nazor_count = arg$.nazor_count, this.possible_votes_count = arg$.possible_votes_count, this.zakony_predkladatel_count = arg$.zakony_predkladatel_count;
      this.interpelace_sum = this.interpelace_source_count + this.interpelace_target_count;
      this.absence_normalized = this.absence_count / this.possible_votes_count;
      this.nazor_normalized = this.nazor_count / this.possible_votes_count;
    }
    prototype.getName = function(){
      return this.titul_pred + " " + this.jmeno + " " + this.prijmeni + " " + this.titul_za;
    };
    return Poslanec;
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
      var x$, y$, z$, z1$, z2$, z3$, z4$, this$ = this;
      x$ = this.container.selectAll("li").data(this.poslanci).enter().append("li");
      y$ = x$.append("span");
      y$.attr('class', 'name');
      y$.html(function(it){
        return it.getName();
      });
      z$ = x$.append('div');
      z$.attr('class', 'barchart');
      z1$ = z$.append('div');
      z1$.attr('class', "interpelace bar");
      z1$.style('height', function(it){
        return this$.interpelaceScale(it.interpelace_sum) + "px";
      });
      z2$ = z$.append('div');
      z2$.attr('class', "zakony bar");
      z2$.style('height', function(it){
        return this$.zakonyScale(it.zakony_predkladatel_count) + "px";
      });
      z3$ = z$.append('div');
      z3$.attr('class', "absence bar");
      z3$.style('height', function(it){
        return this$.percentageInvertedScale(it.absence_normalized) + "px";
      });
      z4$ = z$.append('div');
      z4$.attr('class', "nazor bar");
      z4$.style('height', function(it){
        return this$.percentageScale(it.nazor_normalized) + "px";
      });
      return x$;
    };
    prototype.getScales = function(){
      var interpelaceMaximum, x$, zakonyMaximum, y$, z$, z1$;
      interpelaceMaximum = Math.max.apply(Math, this.poslanci.map(function(it){
        return it.interpelace_sum;
      }));
      x$ = this.interpelaceScale = d3.scale.linear();
      x$.domain([0, interpelaceMaximum]);
      x$.range([3, list_barchart_height]);
      zakonyMaximum = Math.max.apply(Math, this.poslanci.map(function(it){
        return it.zakony_predkladatel_count;
      }));
      y$ = this.zakonyScale = d3.scale.linear();
      y$.domain([0, zakonyMaximum]);
      y$.range([3, list_barchart_height]);
      z$ = this.percentageScale = d3.scale.linear();
      z$.domain([0, 1]);
      z$.range([3, list_barchart_height]);
      z1$ = this.percentageInvertedScale = d3.scale.linear();
      z1$.domain([1, 0]);
      z1$.range([3, list_barchart_height]);
      return z1$;
    };
    return PoslanecList;
  }());
  d3.json("./api.php?get=poslanci", function(err, data){
    var poslanci, poslanecList;
    poslanci = data.map(function(it){
      return new Poslanec(it);
    });
    return poslanecList = new PoslanecList('#wrap', poslanci);
  });
}).call(this);
