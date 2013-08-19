(function(){
  var list_barchart_height, list_barchart_bar_width, Poslanec, PoslanecList, this$ = this;
  list_barchart_height = 50;
  list_barchart_bar_width = 30;
  Poslanec = (function(){
    Poslanec.displayName = 'Poslanec';
    var prototype = Poslanec.prototype, constructor = Poslanec;
    function Poslanec(arg$){
      this.titul_pred = arg$.titul_pred, this.prijmeni = arg$.prijmeni, this.jmeno = arg$.jmeno, this.titul_za = arg$.titul_za, this.interpelace_source_count = arg$.interpelace_source_count, this.interpelace_target_count = arg$.interpelace_target_count, this.absence_count = arg$.absence_count, this.nazor_count = arg$.nazor_count, this.possible_votes_count = arg$.possible_votes_count;
      this.interpelace_sum = this.interpelace_source_count + this.interpelace_target_count;
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
      var x$, y$, z$, z1$, this$ = this;
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
      z1$.style('left', list_barchart_bar_width * 0);
      return x$;
    };
    prototype.getScales = function(){
      var interpelaceMaximum, x$;
      interpelaceMaximum = Math.max.apply(Math, this.poslanci.map(function(it){
        return it.interpelace_sum;
      }));
      x$ = this.interpelaceScale = d3.scale.linear();
      x$.domain([0, interpelaceMaximum]);
      x$.range([3, list_barchart_height]);
      return x$;
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
