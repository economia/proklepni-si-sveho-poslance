(function(){
  var Poslanec, PoslanecList, this$ = this;
  Poslanec = (function(){
    Poslanec.displayName = 'Poslanec';
    var prototype = Poslanec.prototype, constructor = Poslanec;
    function Poslanec(arg$){
      this.titul_pred = arg$.titul_pred, this.prijmeni = arg$.prijmeni, this.jmeno = arg$.jmeno, this.titul_za = arg$.titul_za, this.interpelace_source_count = arg$.interpelace_source_count, this.interpelace_target_count = arg$.interpelace_target_count, this.absence_count = arg$.absence_count, this.nazor_count = arg$.nazor_count, this.possible_votes_count = arg$.possible_votes_count;
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
      this.container;
      this.draw();
    }
    prototype.draw = function(){
      var x$, y$;
      x$ = this.container.data(this.poslanci).enter().append("li");
      y$ = x$.append("span");
      y$.attr('class', 'name');
      y$.html(function(it){
        return it.getName();
      });
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
