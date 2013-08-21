(function(){
  var Strana, Kraj, this$ = this;
  window.list_item_height = 62;
  window.list_barchart_height = 50;
  window.tooltip = new Tooltip().watchElements();
  window.Strana = Strana = (function(){
    Strana.displayName = 'Strana';
    var prototype = Strana.prototype, constructor = Strana;
    function Strana(arg$){
      this.nazev = arg$.nazev, this.plny = arg$.plny, this.zkratka = arg$.zkratka;
    }
    return Strana;
  }());
  window.Kraj = Kraj = (function(){
    Kraj.displayName = 'Kraj';
    var prototype = Kraj.prototype, constructor = Kraj;
    function Kraj(arg$){
      this.nazev = arg$.nazev;
    }
    return Kraj;
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
}).call(this);
