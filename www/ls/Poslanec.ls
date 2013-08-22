poslanciAssoc = window.poslanciAssoc
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
        @$wrap.addClass 'poslanecSelected'
        $backButton = $ "<a href='#' class='backButton'></a>"
            ..append "<img src='img/back.png' />"
            ..on \click ~> @$wrap.removeClass 'poslanecSelected'
        @$parent.html "
            <div class='poslanecDetail party-#{@strana.zkratka}'>
                <div class='header'>
                    <h2>#{@titul_pred} #{@jmeno} #{@prijmeni} #{@titul_za}</h2>
                    <h3 class='party'>#{@strana.plny}</h3>
                    <img class='foto' src='img/poslanci/#{@id}.jpg' />
                    <span class='loading'>Prosím strpení, načíají se data...</span>
                </div>
            </div>
        "
        @$element = @$parent.find ".poslanecDetail"
        $header = @$element.find ".header"
        $backButton.prependTo $header
        (err, @data) <~ @loadData
        @$parent.find ".loading" .remove!
        new Calendar @data
            ..$element.appendTo $header
            ..onMonthSelected = @~displayMonth
        $ "<em></em>"
            ..html "Každé políčko grafiky představuje jeden měsíc, každý řádek rok.
                Čím sytější barva, tím byl poslanec daný měsíc aktivnější.
                Kliknutím na políčko zobrazíte aktivitu daný měsíc, případně kliknutím na tlačítko níže zobrazíte veškerou aktivitu daného druhu."
            ..addClass \calendarLegend
            ..appendTo $header
        $header.append @displayContentButtons!
        @$contentElement = $ "<div class='content'></div>"
            ..appendTo @$element

    loadData: (cb) ->
        (err, data) <~ d3.json "./api.php?get=poslanci/#{@id}"
        data.zakony.map ->
            it.nazev = unescape it.nazev
            it
        cb null, data

    displayContentButtons: ->
        $container = $ "<div class='contentButtons'></div>"
        {zakony, vystoupeni, interpelace} = @data
        $ "<button class='vystoupeni'></button>"
            ..append "Vystoupení"
            ..appendTo $container
            ..on \click ~> @displayContent {vystoupeni}
        $ "<button class='interpelace'></button>"
            ..append "Interpelace"
            ..appendTo $container
            ..on \click ~> @displayContent {interpelace}
        $ "<button class='zakony'></button>"
            ..append "Zákony"
            ..appendTo $container
            ..on \click ~> @displayContent {zakony}
        $ "<button class='hlasovani'></button>"
            ..append "Hlasování"
            ..appendTo $container
            ..on \click ~> @displayContent {hlasovani}

        $container

    displayMonth: (month) ->
        @displayContent month

    displayContent: ({zakony, interpelace, vystoupeni})->
        @$contentElement.empty!
        if zakony then @$contentElement.append @displayZakony zakony
        if interpelace then @$contentElement.append @displayInterpelace interpelace
        if vystoupeni then @$contentElement.append @displayVystoupeni vystoupeni

    displayZakony: (zakony) ->
        emText = if zakony.length
            "Kliknutím přejdete na detail zákona na webu Poslanecké sněmovny"
        else
            "Poslanec v daném období žádný zákon nepředložil"
        $element = $ "<div class='zakony'></div>"
            ..html "<h3>Zákony</h3>
                    <em>#emText</em>"
        return $element unless zakony.length
        $list = $ "<ul></ul>"
            ..appendTo $element
        zakony.forEach (zakon) ->
            $ "<li></li>"
                ..html "<a href='http://www.psp.cz/sqw/historie.sqw?o=6&t=#{zakon.cislo_tisku}' target='_blank'>#{zakon.nazev}</a>"
                ..appendTo $list
        $element

    displayInterpelace: (interpelace) ->
        emText = if interpelace.length
            "Kdy, koho a na jaké téma interpeloval"
        else
            "Poslanec v daném období nikoho neinterpeloval"
        $element = $ "<div class='interpelace'></div>"
            ..html "<h3>Interpelace</h3>
                    <em>#emText</em>"
        return $element unless interpelace.length
        $list = $ "<ul></ul>"
            ..appendTo $element
        interpelace.forEach (interpelaca) ->
            date = new Date interpelaca.datum*1000
            targetPoslanec = poslanciAssoc[interpelaca.ministr_id]?.getName!
            if not targetPoslanec then targetPoslanec = "(neznámý)"
            dateString = "#{date.getDate!} #{date.getMonth! + 1} #{date.getFullYear!}"
            $ "<li></li>"
                ..html "<span class='date'>#dateString, </span>
                    <span class='target'>#targetPoslanec: </span>
                    <span class='vec'>#{interpelaca.vec}</span>"
                ..appendTo $list
        $element
    displayVystoupeni: (vystoupeni) ->
        emText = if vystoupeni.length
            "Kliknutím přejdete na příslušný záznam stenoprotokolu"
        else
            "Poslanec v daném období neměl žádné projevy"
        $element = $ "<div class='vystoupeni'></div>"
            ..html "<h3>Vystoupení</h3>
                    <em>#emText</em>"
        return $element unless vystoupeni.length
        $list = $ "<ul></ul>"
            ..appendTo $element
        vystoupeni.forEach ->
            date = new Date it.datum*1000
            dateString = "#{date.getDate!}. #{date.getMonth! + 1}. #{date.getFullYear!}"
            $ "<li></li>"
                ..html "<a href='#{it.url}' target='_blank'>#{dateString}</a>"
                ..appendTo $list
        $element


monthWidth = 31
monthHeight = 31

class Calendar
    firstMonth: 5 # zero based!
    firstYear: 2010
    lastMonth: 8
    lastYear: 2013
    zakonyMax: 1
    interpelaceMax: 1
    vystoupeniMax: 1
    hlasovaniMax: 1
    $element: null
    onMonthSelected: null

    ({@zakony, @interpelace, @vystoupeni, @hlasovani}) ->
        @$element = $ "<div class='calendar'></div>"
        @createLegend!
        @createMonths!
        @populateZakony!
        @populateInterpelace!
        @populateVystoupeni!
        @populateHlasovani!
        backgroundColor  = [255 255 255]
        colorDiffFunction = (color, index) -> backgroundColor[index] - color
        interpelaceDiff  = [127 201 127].map colorDiffFunction
        zakonyDiff       = [190 174 212].map colorDiffFunction
        vystoupeniDiff   = [191  91  23].map colorDiffFunction
        hlasovaniDiff    = [ 56 108 176].map colorDiffFunction
        d3.select @$element.0 .selectAll ".month"
            .data @months
            .enter!.append \div
                ..attr \class \month
                ..style \left -> "#{it.month * monthWidth}px"
                ..style \top ~> "#{(it.year - @firstYear) * monthHeight}px"
                ..attr \data-tooltip ~>
                    escape "<strong>#{it.humanName} #{it.year}</strong><br />
                        Zákony:      <strong>#{it.zakony.length}</strong><br />
                        Interpelace: <strong>#{it.interpelace.length}</strong><br />
                        Vystoupení:  <strong>#{it.vystoupeni.length}</strong><br />
                        Hlasování:  <strong>#{it.hlasovani.length}</strong>
                    "
                ..append \div
                    ..style \background ~>
                        zakonyScore      = it.zakony.length      / @zakonyMax      * it.zakony.length      / it.totalEvents
                        vystoupeniScore  = it.vystoupeni.length  / @vystoupeniMax  * it.vystoupeni.length  / it.totalEvents
                        interpelaceScore = it.interpelace.length / @interpelaceMax * it.interpelace.length / it.totalEvents
                        hlasovaniScore   = it.hlasovani.length   / @hlasovaniMax   * it.hlasovani.length   / it.totalEvents
                        totalScore = zakonyScore + vystoupeniScore + interpelaceScore
                        finalColor = backgroundColor.map (defaultLight, index) ->
                            color = defaultLight
                            color -= interpelaceDiff[index] * interpelaceScore
                            color -= zakonyDiff[index]      * zakonyScore
                            color -= vystoupeniDiff[index]  * vystoupeniScore
                            color -= hlasovaniDiff[index]   * hlasovaniScore
                            Math.round color
                        "rgb(#{finalColor.join ','})"
                ..on \click ~>
                    @onMonthSelected? it
    createLegend: ->
        [@firstYear, @lastYear].forEach (year, index) ~>
            @$element.append "<div class='yearLegend y-#index'>#year</div>"
        [1 to 12].forEach (month, index) ~>
            @$element.append "<div class='monthLegend m-#index'>#month</div>"

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
            date = new Date zakon.datum * 1000
            id = "#{date.getFullYear!}-#{date.getMonth!}"
            len = @monthsAssoc[id]?zakony.push zakon
            @monthsAssoc[id]?totalEvents++
            if len > @zakonyMax then @zakonyMax = len

    populateInterpelace: ->
        @interpelace.forEach (interpelaca) ~>
            date = new Date interpelaca.datum * 1000
            id = "#{date.getFullYear!}-#{date.getMonth!}"
            len = @monthsAssoc[id]?interpelace.push interpelaca
            @monthsAssoc[id]?totalEvents++
            if len > @interpelaceMax then @interpelaceMax = len

    populateVystoupeni: ->
        @vystoupeni.forEach (projev) ~>
            date = new Date projev.datum * 1000
            id = "#{date.getFullYear!}-#{date.getMonth!}"
            len = @monthsAssoc[id]?vystoupeni.push projev
            @monthsAssoc[id]?totalEvents++
            if len > @vystoupeniMax then @vystoupeniMax = len
    populateHlasovani: ->
        @hlasovani.forEach (hlas) ~>
            date = new Date hlas.datum * 1000
            id = "#{date.getFullYear!}-#{date.getMonth!}"
            len = @monthsAssoc[id]?hlasovani.push hlas
            @monthsAssoc[id]?totalEvents++
            if len > @hlasovaniMax then @hlasovaniMax = len


class Month
    humanNames: <[Leden Únor Březen Duben Květen Červen Červenec Srpen Září Říjen Listopad Prosinec]>
    (@year, @month) ->
        @id = "#{@year}-#{@month}"
        @humanName = @humanNames[month]
        @zakony = []
        @interpelace = []
        @vystoupeni = []
        @hlasovani = []
        @totalEvents = 1
