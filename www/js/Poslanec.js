(function(){
  var Poslanec, monthWidth, monthHeight, Calendar, Month;
  window.Poslanec = Poslanec = (function(){
    Poslanec.displayName = 'Poslanec';
    var prototype = Poslanec.prototype, constructor = Poslanec;
    function Poslanec(arg$, $wrap, $parent){
      var activities;
      this.id = arg$.id, this.titul_pred = arg$.titul_pred, this.prijmeni = arg$.prijmeni, this.jmeno = arg$.jmeno, this.titul_za = arg$.titul_za, this.interpelace_source_count = arg$.interpelace_source_count, this.interpelace_target_count = arg$.interpelace_target_count, this.absence_count = arg$.absence_count, this.nazor_count = arg$.nazor_count, this.possible_votes_count = arg$.possible_votes_count, this.zakony_predkladatel_count = arg$.zakony_predkladatel_count, this.vystoupeni_count = arg$.vystoupeni_count, this.kraj = arg$.kraj, this.strana = arg$.strana, this.preferencni = arg$.preferencni;
      this.$wrap = $wrap;
      this.$parent = $parent;
      this.interpelace_sum = this.interpelace_source_count + this.interpelace_target_count;
      this.absence_normalized = this.absence_count / this.possible_votes_count;
      this.nazor_normalized = this.nazor_count / this.possible_votes_count;
      activities = [this.interpelace_source_count, (1 - this.absence_normalized) * 100, this.nazor_normalized * 100, this.zakony_predkladatel_count, this.vystoupeni_count];
      this.activity_index = activities.reduce(function(curr, prev){
        return prev + curr;
      }, 0);
    }
    prototype.getName = function(){
      return this.jmeno + " " + this.prijmeni;
    };
    prototype.onSelect = function(){
      var this$ = this;
      this.$wrap.toggleClass('poslanecSelected');
      this.$parent.html("<div class='poslanecDetail " + this.strana.zkratka + "'><img src='img/poslanci/" + this.id + ".jpg' /><h2>" + this.titul_pred + " " + this.jmeno + " " + this.prijmeni + " " + this.titul_za + "</h2><h3 class='party'>" + this.strana.plny + "</h3><span class='loading'>Prosím strpení, načíají se data...</span></div>");
      return this.loadData(function(err, data){
        var x$;
        console.log(data);
        x$ = new Calendar(data.zakony);
        x$.$element.appendTo(this$.$parent.find(".poslanecDetail"));
        return x$;
      });
    };
    prototype.loadData = function(cb){
      var this$ = this;
      return d3.json("./api.php?get=poslanci/" + this.id, function(err, data){
        data.zakony.map(function(it){
          it.nazev = unescape(it.nazev);
          return it;
        });
        return cb(null, data);
      });
    };
    return Poslanec;
  }());
  monthWidth = 31;
  monthHeight = 31;
  Calendar = (function(){
    Calendar.displayName = 'Calendar';
    var prototype = Calendar.prototype, constructor = Calendar;
    prototype.firstMonth = 5;
    prototype.firstYear = 2010;
    prototype.lastMonth = 8;
    prototype.lastYear = 2013;
    prototype.zakonyMax = -Infinity;
    prototype.$element = null;
    function Calendar(zakony){
      var x$, y$, this$ = this;
      this.zakony = zakony;
      this.$element = $("<div class='calendar'></div>");
      this.createMonths();
      this.populateZakony();
      x$ = d3.select(this.$element[0]).selectAll(".month").data(this.months).enter().append('div');
      x$.attr('class', 'month');
      x$.style('left', function(it){
        return it.month * monthWidth + "px";
      });
      x$.style('top', function(it){
        return (it.year - this$.firstYear) * monthHeight + "px";
      });
      y$ = x$.append('div');
      y$.attr('class', 'zakony');
      y$.style('opacity', function(it){
        return it.zakony.length / this$.zakonyMax;
      });
    }
    prototype.createMonths = function(){
      var currentYear, currentMonth, currentDate, month, results$ = [];
      this.months = [];
      this.monthsAssoc = {};
      currentYear = this.firstYear;
      currentMonth = this.firstMonth;
      currentDate = new Date(0);
      for (;;) {
        month = new Month(currentYear, currentMonth);
        this.months.push(month);
        this.monthsAssoc[month.id] = month;
        ++currentMonth;
        if (currentMonth >= 12) {
          currentMonth = 0;
          ++currentYear;
        }
        if (currentYear >= this.lastYear && currentMonth >= this.lastMonth) {
          break;
        }
      }
      return results$;
    };
    prototype.populateZakony = function(){
      var this$ = this;
      return this.zakony.forEach(function(zakon){
        var date, id, len, ref$;
        date = new Date(zakon.predlozeno * 1000);
        id = date.getFullYear() + "-" + date.getMonth();
        len = (ref$ = this$.monthsAssoc[id]) != null ? ref$.zakony.push(zakon) : void 8;
        if (len > this$.zakonyMax) {
          return this$.zakonyMax = len;
        }
      });
    };
    return Calendar;
  }());
  Month = (function(){
    Month.displayName = 'Month';
    var prototype = Month.prototype, constructor = Month;
    function Month(year, month){
      this.year = year;
      this.month = month;
      this.id = this.year + "-" + this.month;
      this.zakony = [];
    }
    return Month;
  }());
}).call(this);
