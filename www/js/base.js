(function(){
  var Strana, Kraj, this$ = this;
  window.list_item_height = 62;
  window.list_item_offset = 35;
  window.list_barchart_height = 50;
  window.tooltip = new Tooltip().watchElements();
  window.poslanciAssoc = {};
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
      this.id = arg$.id, this.nazev = arg$.nazev, this.plny = arg$.plny;
    }
    return Kraj;
  }());
  d3.json("../data/json/list.json", function(err, data){
    var kraje, strany, $wrap, $rightPart, x$, sorterFilter, poslanci, poslanecList;
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
    $wrap = $('#wrap');
    $rightPart = $wrap.find('.rightPart');
    x$ = sorterFilter = new SorterFilter('.leftPart', strany, kraje);
    x$.onSortChange('activity-index-desc');
    poslanci = data.poslanci.map(function(it){
      var poslanec;
      it.kraj = kraje[it.kraj_id];
      it.strana = strany[it.strana_id];
      return poslanciAssoc[it.id] = poslanec = new Poslanec(it, $wrap, $rightPart);
    });
    poslanci.sort(sorterFilter.sortFunction);
    return poslanecList = new PoslanecList('.leftPart', poslanci, sorterFilter);
  });
}).call(this);
