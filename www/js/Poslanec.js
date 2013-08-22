(function(){
  var poslanciAssoc, Poslanec, monthWidth, monthHeight, Calendar, Month;
  poslanciAssoc = window.poslanciAssoc;
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
      this.$parent.html("<div class='poslanecDetail party-" + this.strana.zkratka + "'><h2>" + this.titul_pred + " " + this.jmeno + " " + this.prijmeni + " " + this.titul_za + "</h2><h3 class='party'>" + this.strana.plny + "</h3><img src='img/poslanci/" + this.id + ".jpg' /><span class='loading'>Prosím strpení, načíají se data...</span></div>");
      this.$element = this.$parent.find(".poslanecDetail");
      $backButton.prependTo(this.$element);
      return this.loadData(function(err, data){
        var x$, y$;
        this$.data = data;
        this$.$parent.find(".loading").remove();
        x$ = new Calendar(this$.data);
        x$.$element.appendTo(this$.$element);
        x$.onMonthSelected = bind$(this$, 'displayMonth');
        this$.$element.append(this$.displayContentButtons());
        y$ = this$.$contentElement = $("<div class='content'></div>");
        y$.appendTo(this$.$element);
        return y$;
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
    prototype.displayContentButtons = function(){
      var $container, ref$, zakony, vystoupeni, interpelace, x$, y$, z$, this$ = this;
      $container = $("<div class='contentButtons'></div>");
      ref$ = this.data, zakony = ref$.zakony, vystoupeni = ref$.vystoupeni, interpelace = ref$.interpelace;
      x$ = $("<button class='vystoupeni'>Všechna vystoupení</button>");
      x$.appendTo($container);
      x$.on('click', function(){
        return this$.displayContent({
          vystoupeni: vystoupeni
        });
      });
      y$ = $("<button class='interpelace'>Interpelace</button>");
      y$.appendTo($container);
      y$.on('click', function(){
        return this$.displayContent({
          interpelace: interpelace
        });
      });
      z$ = $("<button class='zakony'>Zákony</button>");
      z$.appendTo($container);
      z$.on('click', function(){
        return this$.displayContent({
          zakony: zakony
        });
      });
      return $container;
    };
    prototype.displayMonth = function(month){
      return this.displayContent(month);
    };
    prototype.displayContent = function(arg$){
      var zakony, interpelace, vystoupeni;
      zakony = arg$.zakony, interpelace = arg$.interpelace, vystoupeni = arg$.vystoupeni;
      this.$contentElement.empty();
      if (zakony != null && zakony.length) {
        this.$contentElement.append(this.displayZakony(zakony));
      }
      if (interpelace != null && interpelace.length) {
        this.$contentElement.append(this.displayInterpelace(interpelace));
      }
      if (vystoupeni != null && vystoupeni.length) {
        return this.$contentElement.append(this.displayVystoupeni(vystoupeni));
      }
    };
    prototype.displayZakony = function(zakony){
      var x$, $element, y$, $list;
      x$ = $element = $("<div class='zakony'></div>");
      x$.append("<h3>Zákony</h3>");
      x$.append("<em>Kliknutím přejdete na detail zákona na webu Poslanecké sněmovny</em>");
      y$ = $list = $("<ul></ul>");
      y$.appendTo($element);
      zakony.forEach(function(zakon){
        return $list.append("<li><a href='http://www.psp.cz/sqw/historie.sqw?o=6&t=" + zakon.cislo_tisku + "' target='_blank'>" + zakon.nazev + "</a></li>");
      });
      return $element;
    };
    prototype.displayInterpelace = function(interpelace){
      var x$, $element, y$, $list;
      x$ = $element = $("<div class='interpelace'></div>");
      x$.append("<h3>Interpelace</h3>");
      x$.append("<em>Kdy, koho a na jaké téma interpeloval</em>");
      y$ = $list = $("<ul></ul>");
      y$.appendTo($element);
      interpelace.forEach(function(interpelaca){
        var date, targetPoslanec, ref$, dateString;
        date = new Date(interpelaca.datum * 1000);
        targetPoslanec = (ref$ = poslanciAssoc[interpelaca.ministr_id]) != null ? ref$.getName() : void 8;
        if (!targetPoslanec) {
          targetPoslanec = "(neznámý)";
        }
        dateString = date.getDate() + " " + (date.getMonth() + 1) + " " + date.getFullYear();
        return $list.append("<li><span class='date'>" + dateString + ", </span><span class='target'>" + targetPoslanec + ": </span><span class='vec'>" + interpelaca.vec + "</span></li>");
      });
      return $element;
    };
    prototype.displayVystoupeni = function(vystoupeni){
      var x$, $element, y$, $list;
      x$ = $element = $("<div class='vystoupeni'></div>");
      x$.append("<h3>Vystoupení</h3>");
      x$.append("<em>Kliknutím přejdete na příslušný záznam stenoprotokolu</em>");
      y$ = $list = $("<ul></ul>");
      y$.appendTo($element);
      vystoupeni.forEach(function(it){
        var date, dateString;
        date = new Date(it.datum * 1000);
        dateString = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
        return $list.append("<li><a href='" + it.url + "' target='_blank'>" + dateString + "</a></li>");
      });
      return $element;
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
    prototype.onMonthSelected = null;
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
      x$.on('click', function(it){
        return typeof this$.onMonthSelected === 'function' ? this$.onMonthSelected(it) : void 8;
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
        date = new Date(zakon.datum * 1000);
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
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
