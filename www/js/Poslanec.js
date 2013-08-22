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
      var x$, $backButton, this$ = this;
      this.$wrap.addClass('poslanecSelected');
      x$ = $backButton = $("<a href='#' class='backButton'><img src='img/back.png' /></a>");
      x$.on('click', function(){
        return this$.$wrap.removeClass('poslanecSelected');
      });
      this.$parent.html("<div class='poslanecDetail " + this.strana.zkratka + "'><h2>" + this.titul_pred + " " + this.jmeno + " " + this.prijmeni + " " + this.titul_za + "</h2><h3 class='party'>" + this.strana.plny + "</h3><img src='img/poslanci/" + this.id + ".jpg' /><span class='loading'>Prosím strpení, načíají se data...</span></div>");
      this.$element = this.$parent.find(".poslanecDetail");
      $backButton.prependTo(this.$element);
      return this.loadData(function(err, data){
        var x$;
        this$.$parent.find(".loading").remove();
        console.log(data);
        x$ = new Calendar(data);
        x$.$element.appendTo(this$.$element);
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
    prototype.zakonyMax = 1;
    prototype.interpelaceMax = 1;
    prototype.vystoupeniMax = 1;
    prototype.$element = null;
    function Calendar(arg$){
      var backgroundColor, colorDiffFunction, interpelaceDiff, zakonyDiff, vystoupeniDiff, x$, y$, this$ = this;
      this.zakony = arg$.zakony, this.interpelace = arg$.interpelace, this.vystoupeni = arg$.vystoupeni;
      this.$element = $("<div class='calendar'></div>");
      this.createMonths();
      this.populateZakony();
      this.populateInterpelace();
      this.populateVystoupeni();
      backgroundColor = [255, 255, 255];
      colorDiffFunction = function(color, index){
        return backgroundColor[index] - color;
      };
      interpelaceDiff = [127, 201, 127].map(colorDiffFunction);
      zakonyDiff = [190, 174, 212].map(colorDiffFunction);
      vystoupeniDiff = [191, 91, 23].map(colorDiffFunction);
      x$ = d3.select(this.$element[0]).selectAll(".month").data(this.months).enter().append('div');
      x$.attr('class', 'month');
      x$.style('left', function(it){
        return it.month * monthWidth + "px";
      });
      x$.style('top', function(it){
        return (it.year - this$.firstYear) * monthHeight + "px";
      });
      x$.attr('data-tooltip', function(it){
        return escape("<strong>" + it.humanName + " " + it.year + "</strong><br />Zákony:      <strong>" + it.zakony.length + "</strong><br />Interpelace: <strong>" + it.interpelace.length + "</strong><br />Vystoupení:  <strong>" + it.vystoupeni.length + "</strong>");
      });
      y$ = x$.append('div');
      y$.attr('class', 'zakony');
      y$.style('background', function(it){
        var zakonyScore, vystoupeniScore, interpelaceScore, totalScore, finalColor;
        zakonyScore = it.zakony.length / this$.zakonyMax * it.zakony.length / it.totalEvents;
        vystoupeniScore = it.vystoupeni.length / this$.vystoupeniMax * it.vystoupeni.length / it.totalEvents;
        interpelaceScore = it.interpelace.length / this$.interpelaceMax * it.interpelace.length / it.totalEvents;
        totalScore = zakonyScore + vystoupeniScore + interpelaceScore;
        finalColor = backgroundColor.map(function(defaultLight, index){
          var color;
          color = defaultLight;
          color -= interpelaceDiff[index] * interpelaceScore;
          color -= zakonyDiff[index] * zakonyScore;
          color -= vystoupeniDiff[index] * vystoupeniScore;
          return Math.round(color);
        });
        return "rgb(" + finalColor.join(',') + ")";
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
        if ((ref$ = this$.monthsAssoc[id]) != null) {
          ref$.totalEvents++;
        }
        if (len > this$.zakonyMax) {
          return this$.zakonyMax = len;
        }
      });
    };
    prototype.populateInterpelace = function(){
      var this$ = this;
      return this.interpelace.forEach(function(interpelaca){
        var date, id, len, ref$;
        date = new Date(interpelaca.datum * 1000);
        id = date.getFullYear() + "-" + date.getMonth();
        len = (ref$ = this$.monthsAssoc[id]) != null ? ref$.interpelace.push(interpelaca) : void 8;
        if ((ref$ = this$.monthsAssoc[id]) != null) {
          ref$.totalEvents++;
        }
        if (len > this$.interpelaceMax) {
          return this$.interpelaceMax = len;
        }
      });
    };
    prototype.populateVystoupeni = function(){
      var this$ = this;
      return this.vystoupeni.forEach(function(projev){
        var date, id, len, ref$;
        date = new Date(projev.datum * 1000);
        id = date.getFullYear() + "-" + date.getMonth();
        len = (ref$ = this$.monthsAssoc[id]) != null ? ref$.vystoupeni.push(projev) : void 8;
        if ((ref$ = this$.monthsAssoc[id]) != null) {
          ref$.totalEvents++;
        }
        if (len > this$.vystoupeniMax) {
          return this$.vystoupeniMax = len;
        }
      });
    };
    return Calendar;
  }());
  Month = (function(){
    Month.displayName = 'Month';
    var prototype = Month.prototype, constructor = Month;
    prototype.humanNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
    function Month(year, month){
      this.year = year;
      this.month = month;
      this.id = this.year + "-" + this.month;
      this.humanName = this.humanNames[month];
      this.zakony = [];
      this.interpelace = [];
      this.vystoupeni = [];
      this.totalEvents = 1;
    }
    return Month;
  }());
}).call(this);
