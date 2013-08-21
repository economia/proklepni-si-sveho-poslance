(function(){
  var SorterFilter;
  window.SorterFilter = SorterFilter = (function(){
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
      x$.chosen({
        allow_single_deselect: true
      });
      x$.on('change', function(){
        return this$.onFilterChange('party', $element.val());
      });
      return x$;
    };
    prototype.createSorter = function(){
      var $element, x$, y$, this$ = this;
      $element = $("<div class='sort'><select class='sort' data-placeholder='Seřadit podle'><option value=''></option><option value='activity-index-desc'>Celkově nějaktivnější</option><option value='activity-index-asc'>Celkově nejméně aktivní</option><option value='interpelace-desc'>Nejvíce interpelující</option><option value='interpelace-asc'>Nejméně interpelují</option><option value='zakony-desc'>Nejvíce předložených zákonů</option><option value='zakony-asc'>Nejméně předložených zákonů</option><option value='absence-asc'>Nejčastěji přítomní</option><option value='absence-desc'>Nejméně přítomní</option><option value='nazor-desc'>Nejčastěji hlasují ano/ne</option><option value='nazor-asc'>Nejméně hlasují ano/ne</option><option value='vystoupeni-desc'>Pronesli nejvíce projevů</option><option value='vystoupeni-asc'>Pronesli nejméně projevů</option></select></div>");
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
        case 'nazor-desc':
          return function(a, b){
            return b.nazor_normalized - a.nazor_normalized;
          };
        case 'nazor-asc':
          return function(a, b){
            return a.nazor_normalized - b.nazor_normalized;
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
    prototype.onFilterChange = function(filterType, filterValue){
      this.filterFunction = (function(){
        switch (filterType) {
        case 'party':
          if (filterValue) {
            return function(poslanec){
              return in$(poslanec.strana.zkratka, filterValue);
            };
          } else {
            return function(){
              return true;
            };
          }
          break;
        default:
          return null;
        }
      }());
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
