window.Poslanec = class Poslanec
    ({@id, @titul_pred, @prijmeni, @jmeno, @titul_za, @interpelace_source_count, @interpelace_target_count, @absence_count, @nazor_count, @possible_votes_count, @zakony_predkladatel_count, @vystoupeni_count, @kraj, @strana, @preferencni}, @$wrap, @$parent) ->
        @interpelace_sum    = @interpelace_source_count + @interpelace_target_count
        @absence_normalized = @absence_count / @possible_votes_count
        @nazor_normalized   = @nazor_count / @possible_votes_count
        activities =
            @interpelace_source_count
            (1 - @absence_normalized) * 100
            @nazor_normalized * 100
            @zakony_predkladatel_count
            @vystoupeni_count
        @activity_index = activities.reduce do
            (curr, prev) -> prev + curr
            0

    getName: -> "#{@jmeno} #{@prijmeni}"

    onSelect: ->
        @$wrap.toggleClass 'poslanecSelected'
        @$parent.html "
            <div class='poslanecDetail #{@strana.zkratka}'>
                <img src='img/poslanci/#{@id}.jpg' />
                <h2>#{@titul_pred} #{@jmeno} #{@prijmeni} #{@titul_za}</h2>
                <h3 class='party'>#{@strana.plny}</h3>
                <span class='loading'>Prosím strpení, načíají se data...</span>
            </div>
        "
        (err, data) <~ @loadData
        @$parent.find ".loading" .remove!
        console.log data
        new Calendar data.zakony
            ..$element.appendTo @$parent.find ".poslanecDetail"

    loadData: (cb) ->
        (err, data) <~ d3.json "./api.php?get=poslanci/#{@id}"
        data.zakony.map ->
            it.nazev = unescape it.nazev
            it
        cb null, data

monthWidth = 31
monthHeight = 31

class Calendar
    firstMonth: 5 # zero based!
    firstYear: 2010
    lastMonth: 8
    lastYear: 2013
    zakonyMax: -Infinity
    $element: null

    (@zakony) ->
        @$element = $ "<div class='calendar'></div>"
        @createMonths!
        @populateZakony!
        d3.select @$element.0 .selectAll ".month"
            .data @months
            .enter!.append \div
                ..attr \class \month
                ..style \left -> "#{it.month * monthWidth}px"
                ..style \top ~> "#{(it.year - @firstYear) * monthHeight}px"
                ..append \div
                    ..attr \class \zakony
                    ..style \opacity ~> it.zakony.length / @zakonyMax

    createMonths: ->
        @months = []
        @monthsAssoc = {}
        currentYear = @firstYear
        currentMonth = @firstMonth
        currentDate = new Date 0
        loop
            month = new Month currentYear, currentMonth
            @months.push month
            @monthsAssoc[month.id] = month
            ++currentMonth
            if currentMonth >= 12
                currentMonth = 0
                ++currentYear
            break if currentYear >= @lastYear and currentMonth >= @lastMonth


    populateZakony: ->
        @zakony.forEach (zakon) ~>
            date = new Date zakon.predlozeno * 1000
            id = "#{date.getFullYear!}-#{date.getMonth!}"
            len = @monthsAssoc[id]?zakony.push zakon
            if len > @zakonyMax then @zakonyMax = len

class Month
    (@year, @month) ->
        @id = "#{@year}-#{@month}"
        @zakony = []
