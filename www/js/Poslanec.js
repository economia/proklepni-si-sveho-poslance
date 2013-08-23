(function(){
  var poslanciAssoc, Poslanec, monthWidth, monthHeight, Calendar, Month;
  poslanciAssoc = window.poslanciAssoc;
  window.Poslanec = Poslanec = (function(){
    Poslanec.displayName = 'Poslanec';
    var prototype = Poslanec.prototype, constructor = Poslanec;
    function Poslanec(arg$, $wrap, $parent){
      var activities;
      this.id = arg$.id, this.titul_pred = arg$.titul_pred, this.prijmeni = arg$.prijmeni, this.jmeno = arg$.jmeno, this.titul_za = arg$.titul_za, this.interpelace_source_count = arg$.interpelace_source_count, this.interpelace_target_count = arg$.interpelace_target_count, this.absence_count = arg$.absence_count, this.nazor_count = arg$.nazor_count, this.possible_votes_count = arg$.possible_votes_count, this.zakony_predkladatel_count = arg$.zakony_predkladatel_count, this.vystoupeni_count = arg$.vystoupeni_count, this.kraj = arg$.kraj, this.strana = arg$.strana, this.preferencni = arg$.preferencni, this.novacek = arg$.novacek, this.from_date = arg$.from_date, this.to_date = arg$.to_date;
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
      var x$, $backButton, supplemental, date, str, $header, this$ = this;
      this.$wrap.addClass('poslanecSelected');
      x$ = $backButton = $("<a href='#' class='backButton'></a>");
      x$.append("<img src='img/back.png' />");
      x$.on('click', function(){
        return this$.$wrap.removeClass('poslanecSelected');
      });
      supplemental = [];
      if (this.preferencni) {
        supplemental.push("Zvolen(a) preferenčními hlasy");
      }
      if (this.from_date > 1275696000) {
        date = new Date(this.from_date * 1000);
        supplemental.push("V parlamentu od " + date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear());
      }
      if (this.to_date) {
        date = new Date(this.to_date * 1000);
        str = "";
        if (!(this.from_date > 1275696000)) {
          str = "V parlamentu ";
        }
        str += "do " + date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
        supplemental.push(str);
      }
      if (this.novacek) {
        supplemental.push("Nově zvolený poslanec");
      }
      this.$parent.html("<div class='poslanecDetail party-" + this.strana.zkratka + "'><div class='header'><h2>" + this.titul_pred + " " + this.jmeno + " " + this.prijmeni + " " + this.titul_za + "</h2><h3 class='party'>" + this.strana.plny + " / " + this.kraj.plny + "</h3><h4 class='supplemental'>" + supplemental.join(', ') + "</h4><img class='foto' src='img/poslanci/" + this.id + ".jpg' /><span class='loading'>Prosím strpení, načíají se data...</span></div></div>");
      this.$element = this.$parent.find(".poslanecDetail");
      $header = this.$element.find(".header");
      $backButton.prependTo($header);
      return this.loadData(function(err, data){
        var x$, y$, z$;
        this$.data = data;
        this$.$parent.find(".loading").remove();
        x$ = new Calendar(this$.data);
        x$.$element.appendTo($header);
        x$.onMonthSelected = bind$(this$, 'displayMonth');
        y$ = $("<em></em>");
        y$.html("Každé políčko grafiky představuje jeden měsíc, každý řádek rok.Čím sytější barva, tím byl poslanec daný měsíc aktivnější.Kliknutím na políčko zobrazíte aktivitu daný měsíc, případně kliknutím na tlačítko níže zobrazíte veškerou aktivitu daného druhu.");
        y$.addClass('calendarLegend');
        y$.appendTo($header);
        $header.append(this$.displayContentButtons());
        z$ = this$.$contentElement = $("<div class='content'></div>");
        z$.appendTo(this$.$element);
        return z$;
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
      var $container, ref$, zakony, vystoupeni, interpelace, hlasovani, x$, y$, z$, z1$, this$ = this;
      $container = $("<div class='contentButtons'></div>");
      ref$ = this.data, zakony = ref$.zakony, vystoupeni = ref$.vystoupeni, interpelace = ref$.interpelace, hlasovani = ref$.hlasovani;
      x$ = $("<button class='vystoupeni'></button>");
      x$.append("Vystoupení");
      x$.appendTo($container);
      x$.on('click', function(){
        return this$.displayContent({
          vystoupeni: vystoupeni
        });
      });
      y$ = $("<button class='interpelace'></button>");
      y$.append("Interpelace");
      y$.appendTo($container);
      y$.on('click', function(){
        return this$.displayContent({
          interpelace: interpelace
        });
      });
      z$ = $("<button class='zakony'></button>");
      z$.append("Zákony");
      z$.appendTo($container);
      z$.on('click', function(){
        return this$.displayContent({
          zakony: zakony
        });
      });
      z1$ = $("<button class='hlasovani'></button>");
      z1$.append("Hlasování");
      z1$.appendTo($container);
      z1$.on('click', function(){
        return this$.displayContent({
          hlasovani: hlasovani
        });
      });
      return $container;
    };
    prototype.displayMonth = function(month){
      return this.displayContent(month);
    };
    prototype.displayContent = function(arg$){
      var zakony, interpelace, vystoupeni, hlasovani;
      zakony = arg$.zakony, interpelace = arg$.interpelace, vystoupeni = arg$.vystoupeni, hlasovani = arg$.hlasovani;
      this.$contentElement.empty();
      if (zakony) {
        this.$contentElement.append(this.displayZakony(zakony));
      }
      if (interpelace) {
        this.$contentElement.append(this.displayInterpelace(interpelace));
      }
      if (vystoupeni) {
        this.$contentElement.append(this.displayVystoupeni(vystoupeni));
      }
      if (hlasovani) {
        return this.$contentElement.append(this.displayHlasovani(hlasovani));
      }
    };
    prototype.displayZakony = function(zakony){
      var emText, x$, $element, y$, $list;
      emText = zakony.length ? "Kliknutím přejdete na detail zákona na webu Poslanecké sněmovny" : "Poslanec v daném období žádný zákon nepředložil";
      x$ = $element = $("<div class='zakony'></div>");
      x$.html("<h3>Zákony</h3><em>" + emText + "</em>");
      if (!zakony.length) {
        return $element;
      }
      y$ = $list = $("<ul></ul>");
      y$.appendTo($element);
      zakony.forEach(function(zakon){
        var x$;
        x$ = $("<li></li>");
        x$.html("<a href='http://www.psp.cz/sqw/historie.sqw?o=6&t=" + zakon.cislo_tisku + "' target='_blank'>" + zakon.nazev + "</a>");
        x$.appendTo($list);
        return x$;
      });
      return $element;
    };
    prototype.displayInterpelace = function(interpelace){
      var emText, x$, $element, y$, $list;
      emText = interpelace.length ? "Kdy, koho a na jaké téma interpeloval" : "Poslanec v daném období nikoho neinterpeloval";
      x$ = $element = $("<div class='interpelace'></div>");
      x$.html("<h3>Interpelace</h3><em>" + emText + "</em>");
      if (!interpelace.length) {
        return $element;
      }
      y$ = $list = $("<ul></ul>");
      y$.appendTo($element);
      interpelace.forEach(function(interpelaca){
        var date, targetPoslanec, ref$, dateString, x$;
        date = new Date(interpelaca.datum * 1000);
        targetPoslanec = (ref$ = poslanciAssoc[interpelaca.ministr_id]) != null ? ref$.getName() : void 8;
        if (!targetPoslanec) {
          targetPoslanec = "(neznámý)";
        }
        dateString = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
        x$ = $("<li></li>");
        x$.html("<span class='date'>" + dateString + ", </span><span class='target'>" + targetPoslanec + ": </span><span class='vec'>" + interpelaca.vec + "</span>");
        x$.appendTo($list);
        return x$;
      });
      return $element;
    };
    prototype.displayVystoupeni = function(vystoupeni){
      var emText, x$, $element, y$, $list;
      emText = vystoupeni.length ? "Kliknutím přejdete na příslušný záznam stenoprotokolu" : "Poslanec v daném období neměl žádné projevy";
      x$ = $element = $("<div class='vystoupeni'></div>");
      x$.html("<h3>Vystoupení</h3><em>" + emText + "</em>");
      if (!vystoupeni.length) {
        return $element;
      }
      y$ = $list = $("<ul></ul>");
      y$.appendTo($element);
      vystoupeni.forEach(function(it){
        var date, dateString, x$;
        date = new Date(it.datum * 1000);
        dateString = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
        x$ = $("<li></li>");
        x$.html("<a href='" + it.url + "' target='_blank'>" + dateString + "</a>");
        x$.appendTo($list);
        return x$;
      });
      return $element;
    };
    prototype.displayHlasovani = function(hlasovani){
      var emText, x$, $element, y$, $list;
      emText = hlasovani.length ? "<em>Kliknutím přejdete na detail hlasování na webu psp.cz</em><ul class='legend'><li><span class='voteLabel favor'><span>Pro</span></span>Hlasoval pro</li><li><span class='voteLabel against'><span>Proti</span></span>Hlasoval proti</li><li><span class='voteLabel abstain'><span>Zdržel se</span></span>Hlasoval \"zdržuji se\" (stiskl příslušné tlačítko)</li><li><span class='voteLabel no-vote'><span>Nehlasoval</span></span>Nehlasoval (byl přihlášen, ale nestisknul žádné tlačítko)</li><li><span class='voteLabel absent'><span>Nepřihlášen</span></span>Nebyl přihlášen</li><li><span class='voteLabel pardoned'><span>Omluven</span></span>Nebyl přihlášen, byl omluven</li></ul>" : "<em>Poslanec v daném období nehlasoval</em>";
      x$ = $element = $("<div class='hlasovani'></div>");
      x$.html("<h3>Hlasování</h3>" + emText);
      if (!hlasovani.length) {
        return $element;
      }
      y$ = $list = $("<ul></ul>");
      y$.appendTo($element);
      hlasovani.forEach(function(it){
        var date, dateString, ref$, labelString, labelClass, x$;
        date = new Date(it.datum * 1000);
        dateString = date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear();
        ref$ = (function(){
          switch (it.vysledek) {
          case 'A':
            return ["Pro", "favor"];
          case 'B':
            return ["Proti", "against"];
          case 'C':
            return ["Zdržel se", "abstain"];
          case 'F':
            return ["Nehlasoval", "no-vote"];
          case '@':
            return ["Nepřihlášen", "absent"];
          case 'M':
            return ["Omluven", "pardoned"];
          }
        }()), labelString = ref$[0], labelClass = ref$[1];
        x$ = $("<li></li>");
        x$.html("<a href='http://www.psp.cz/sqw/hlasy.sqw?g=" + it.id + "&amp;l=cz' target='_blank'><span class='voteLabel " + labelClass + "'><span>" + labelString + "</span></span>" + dateString + ": " + unescape(it.nazev) + "</a>");
        x$.appendTo($list);
        return x$;
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
    prototype.hlasovaniMax = 1;
    prototype.$element = null;
    prototype.onMonthSelected = null;
    function Calendar(arg$){
      var backgroundColor, colorDiffFunction, interpelaceDiff, zakonyDiff, vystoupeniDiff, hlasovaniDiff, x$, y$, this$ = this;
      this.zakony = arg$.zakony, this.interpelace = arg$.interpelace, this.vystoupeni = arg$.vystoupeni, this.hlasovani = arg$.hlasovani;
      this.$element = $("<div class='calendar'></div>");
      this.createLegend();
      this.createMonths();
      this.populateZakony();
      this.populateInterpelace();
      this.populateVystoupeni();
      this.populateHlasovani();
      backgroundColor = [255, 255, 255];
      colorDiffFunction = function(color, index){
        return backgroundColor[index] - color;
      };
      interpelaceDiff = [127, 201, 127].map(colorDiffFunction);
      zakonyDiff = [190, 174, 212].map(colorDiffFunction);
      vystoupeniDiff = [191, 91, 23].map(colorDiffFunction);
      hlasovaniDiff = [56, 108, 176].map(colorDiffFunction);
      x$ = d3.select(this.$element[0]).selectAll(".month").data(this.months).enter().append('div');
      x$.attr('class', 'month');
      x$.style('left', function(it){
        return it.month * monthWidth + "px";
      });
      x$.style('top', function(it){
        return (it.year - this$.firstYear) * monthHeight + "px";
      });
      x$.attr('data-tooltip', function(it){
        return escape("<strong>" + it.humanName + " " + it.year + "</strong><br />Zákony:      <strong>" + it.zakony.length + "</strong><br />Interpelace: <strong>" + it.interpelace.length + "</strong><br />Vystoupení:  <strong>" + it.vystoupeni.length + "</strong><br />Hlasování:  <strong>" + it.hlasovani.length + "</strong>");
      });
      y$ = x$.append('div');
      y$.style('background', function(it){
        var zakonyScore, vystoupeniScore, interpelaceScore, hlasovaniScore, totalScore, finalColor;
        zakonyScore = it.zakony.length / this$.zakonyMax * it.zakony.length / it.totalEvents;
        vystoupeniScore = it.vystoupeni.length / this$.vystoupeniMax * it.vystoupeni.length / it.totalEvents;
        interpelaceScore = it.interpelace.length / this$.interpelaceMax * it.interpelace.length / it.totalEvents;
        hlasovaniScore = it.hlasovani.length / this$.hlasovaniMax * it.hlasovani.length / it.totalEvents;
        totalScore = zakonyScore + vystoupeniScore + interpelaceScore;
        finalColor = backgroundColor.map(function(defaultLight, index){
          var color;
          color = defaultLight;
          color -= interpelaceDiff[index] * interpelaceScore;
          color -= zakonyDiff[index] * zakonyScore;
          color -= vystoupeniDiff[index] * vystoupeniScore;
          color -= hlasovaniDiff[index] * hlasovaniScore;
          return Math.round(color);
        });
        return "rgb(" + finalColor.join(',') + ")";
      });
      x$.on('click', function(it){
        return typeof this$.onMonthSelected === 'function' ? this$.onMonthSelected(it) : void 8;
      });
    }
    prototype.createLegend = function(){
      var this$ = this;
      [this.firstYear, this.lastYear].forEach(function(year, index){
        return this$.$element.append("<div class='yearLegend y-" + index + "'>" + year + "</div>");
      });
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(function(month, index){
        return this$.$element.append("<div class='monthLegend m-" + index + "'>" + month + "</div>");
      });
    };
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
    prototype.populateHlasovani = function(){
      var this$ = this;
      return this.hlasovani.forEach(function(hlas){
        var date, id, len, ref$;
        date = new Date(hlas.datum * 1000);
        id = date.getFullYear() + "-" + date.getMonth();
        len = (ref$ = this$.monthsAssoc[id]) != null ? ref$.hlasovani.push(hlas) : void 8;
        if ((ref$ = this$.monthsAssoc[id]) != null) {
          ref$.totalEvents++;
        }
        if (len > this$.hlasovaniMax) {
          return this$.hlasovaniMax = len;
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
      this.hlasovani = [];
      this.totalEvents = 1;
    }
    return Month;
  }());
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
