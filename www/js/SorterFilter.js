(function(){
  var SorterFilter;
  window.SorterFilter = SorterFilter = (function(){
    SorterFilter.displayName = 'SorterFilter';
    var prototype = SorterFilter.prototype, constructor = SorterFilter;
    prototype.sortFunction = null;
    prototype.filterFunction = null;
    prototype.onSortChangeCb = null;
    prototype.onFilterChangeCb = null;
    function SorterFilter(parentSelector, parties, kraje){
      var x$;
      this.parties = parties;
      this.kraje = kraje;
      x$ = this.$element = $("<div class='filter'></div>");
      x$.appendTo($(parentSelector));
      this.createFilter();
      this.createSorter();
    }
    prototype.createFilter = function(){
      var $element, x$, this$ = this;
      $element = $("<div class='party'><select class='party' multiple='multiple' data-placeholder='Zobrazit pouze poslance strany nebo kraje'></select></div>");
      $element.appendTo(this.$element);
      $element = $element.find('select');
      [this.createPartySelect(), this.createKrajSelect(), this.createMiscSelect()].forEach(function(it){
        return it.appendTo($element);
      });
      x$ = $element;
      x$.chosen({
        allow_single_deselect: true
      });
      x$.on('change', function(){
        return this$.onFilterChange($element.val());
      });
      return x$;
    };
    prototype.createPartySelect = function(){
      var $partyOptgroup;
      $partyOptgroup = $("<optgroup label='Politické strany'></optgroup>");
      this.parties.forEach(function(party){
        var x$;
        if (party === null) {
          return;
        }
        x$ = $("<option value='party-" + party.zkratka + "'>" + party.nazev + "</option>");
        x$.appendTo($partyOptgroup);
        return x$;
      });
      return $partyOptgroup;
    };
    prototype.createKrajSelect = function(){
      var $krajOptgroup;
      $krajOptgroup = $("<optgroup label='Kraje'></optgroup>");
      this.kraje.forEach(function(kraj){
        var x$;
        if (kraj === null) {
          return;
        }
        x$ = $("<option value='kraj-" + kraj.id + "'>" + kraj.nazev + "</option>");
        x$.appendTo($krajOptgroup);
        return x$;
      });
      return $krajOptgroup;
    };
    prototype.createMiscSelect = function(){
      return $("<optgroup label='Ostatní'><option value='misc-preferencni'>Zvoleni preferenčními hlasy</option><option value='misc-novacek'>Nově zvolení poslanci</option><option value='misc-celeobdobi'>Byli poslanci celé období</option></optgroup>");
    };
    prototype.createSorter = function(){
      var $element, x$, y$, this$ = this;
      $element = $("<div class='sort'><select class='sort' data-placeholder='Seřadit podle'><option value=''></option><option value='activity-index-desc'>Celkově nejaktivnější</option><option value='activity-index-asc'>Celkově nejméně aktivní</option><option value='interpelace-desc'>Nejvíce interpelující</option><option value='interpelace-asc'>Nejméně interpelují</option><option value='zakony-desc'>Nejvíce předložených zákonů</option><option value='zakony-asc'>Nejméně předložených zákonů</option><option value='absence-asc'>Nejčastěji přítomní</option><option value='absence-desc'>Nejméně přítomní</option><option value='vystoupeni-desc'>Pronesli nejvíce projevů</option><option value='vystoupeni-asc'>Pronesli nejméně projevů</option></select></div>");
      x$ = $element;
      x$.appendTo(this.$element);
      y$ = $element = $element.find('select');
      y$.chosen();
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
            return b.interpelace_source_count - a.interpelace_source_count;
          };
        case 'interpelace-asc':
          return function(a, b){
            return a.interpelace_source_count - b.interpelace_source_count;
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
        case 'activity-index-desc':
          return function(a, b){
            return b.activity_index - a.activity_index;
          };
        case 'activity-index-asc':
          return function(a, b){
            return a.activity_index - b.activity_index;
          };
        case 'vystoupeni-desc':
          return function(a, b){
            return b.vystoupeni_count - a.vystoupeni_count;
          };
        case 'vystoupeni-asc':
          return function(a, b){
            return a.vystoupeni_count - b.vystoupeni_count;
          };
        default:
          return null;
        }
      }());
      return typeof this.onSortChangeCb === 'function' ? this.onSortChangeCb() : void 8;
    };
    prototype.onFilterChange = function(filterValue){
      var krajValues, partyValues, miscValues;
      this.filterFunction = filterValue
        ? (krajValues = [], partyValues = [], miscValues = {}, filterValue.forEach(function(it){
          var ref$, prefix, value;
          ref$ = it.split('-'), prefix = ref$[0], value = ref$[1];
          switch (prefix) {
          case 'kraj':
            return krajValues.push(+value);
          case 'party':
            return partyValues.push(value);
          case 'misc':
            return miscValues[value] = true;
          }
        }), function(poslanec){
          if (partyValues.length && !in$(poslanec.strana.zkratka, partyValues)) {
            return false;
          }
          if (krajValues.length && !in$(poslanec.kraj.id, krajValues)) {
            return false;
          }
          if (miscValues.preferencni && !poslanec.preferencni) {
            return false;
          }
          if (miscValues.novacek && !poslanec.novacek) {
            return false;
          }
          if (miscValues.celeobdobi && (poslanec.notActiveFromStart || poslanec.to_date)) {
            return false;
          }
          return true;
        })
        : function(){
          return true;
        };
      return typeof this.onFilterChangeCb === 'function' ? this.onFilterChangeCb() : void 8;
    };
    return SorterFilter;
  }());
  function in$(x, arr){
    var i = -1, l = arr.length >>> 0;
    while (++i < l) if (x === arr[i] && i in arr) return true;
    return false;
  }
}).call(this);
