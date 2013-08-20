list_item_height = 62
list_barchart_height = 50
new Tooltip!watchElements!
class Strana
    ({@nazev, @plny, @zkratka}) ->
class Kraj
    ({@nazev}) ->
class Poslanec
    ({@id, @titul_pred, @prijmeni, @jmeno, @titul_za, @interpelace_source_count, @interpelace_target_count, @absence_count, @nazor_count, @possible_votes_count, @zakony_predkladatel_count, @kraj, @strana}) ->
        @interpelace_sum    = @interpelace_source_count + @interpelace_target_count
        @absence_normalized = @absence_count / @possible_votes_count
        @nazor_normalized   = @nazor_count / @possible_votes_count

    getName: -> "#{@titul_pred} #{@jmeno} #{@prijmeni} #{@titul_za}"
class SorterFilter
    sortFunction: null
    filterFunction: null
    onSortChangeCb: null
    onFilterChangeCb: null
    (parentSelector, @parties) ->
        @$element = $ "<div class='filter'></div>"
            ..appendTo $ parentSelector
        @createPartySelect!
        @createSorter!

    createPartySelect: ->
        $element = $ "<div class='party'>
                <select class='party' multiple='multiple' data-placeholder='Zobrazit pouze stranu'></select>
            </div>"
        $element.appendTo @$element
        $element .= find 'select'
        @parties.forEach (party) ->
            return if party is null
            $ "<option value='#{party.zkratka}'>#{party.nazev}</option>"
                ..appendTo $element
        $element
            ..chosen!
            ..on \change ~>
                @onFilterChange \party $element.val!

    createSorter: ->
        $element = $ "<div class='sort'><select class='sort' data-placeholder='Seřadit podle'>
            <option value=''></option>
            <option value='interpelace-desc'>Nejvíce interpelující</option>
            <option value='interpelace-asc'>Nejméně interpelují</option>
            <option value='zakony-desc'>Nejvíce předložených zákonů</option>
            <option value='zakony-asc'>Nejméně předložených zákonů</option>
            <option value='absence-asc'>Nejčastěji přítomní</option>
            <option value='absence-desc'>Nejméně přítomní</option>
            <option value='nazor-desc'>Nejčastěji hlasují ano/ne</option>
            <option value='nazor-asc'>Nejméně hlasují ano/ne</option>
            </select>
            </div>
            "
        $element
            ..appendTo @$element
        $element .= find \select
            ..chosen allow_single_deselect: yes
            ..on \change ~>
                @onSortChange $element.val!

    onSortChange: (sortId) ->
        @sortFunction = switch sortId
        | \interpelace-desc => (a, b) -> b.interpelace_sum - a.interpelace_sum
        | \interpelace-asc  => (a, b) -> a.interpelace_sum - b.interpelace_sum

        | \zakony-desc => (a, b) -> b.zakony_predkladatel_count - a.zakony_predkladatel_count
        | \zakony-asc  => (a, b) -> a.zakony_predkladatel_count - b.zakony_predkladatel_count

        | \absence-desc => (a, b) -> b.absence_normalized - a.absence_normalized
        | \absence-asc  => (a, b) -> a.absence_normalized - b.absence_normalized

        | \nazor-desc => (a, b) -> b.nazor_normalized - a.nazor_normalized
        | \nazor-asc  => (a, b) -> a.nazor_normalized - b.nazor_normalized
        | otherwise         => null
        @onSortChangeCb?!

    onFilterChange: (filterType, filterValue) ->
        @filterFunction = switch filterType
            | \party => (poslanec) -> poslanec.strana.zkratka in filterValue
            | otherwise => null
        @onFilterChangeCb?!



class PoslanecList
    (parentSelector, @poslanci, @sorterFilter) ->
        @container = d3.select parentSelector .append "ul"
            ..attr \class \poslanecList
        @getScales!
        @draw!
        @sorterFilter.onSortChangeCb = @~reSort
        @sorterFilter.onFilterChangeCb = @~reFilter


    draw: ->
        @getRowElements!
            .data @poslanci, -> it.id
            .enter!append \li
                ..attr \class -> "poslanec #{it.strana.zkratka}"
                ..style \top (item, index) -> "#{index * list_item_height}px"
                ..style \left "0%"
                ..append \span
                    ..attr \class \name
                    ..html (.getName!)
                ..append \span
                    ..attr \class \party
                    ..html (.strana.plny)
                ..append \div
                    ..attr \class \barchart
                    ..append \div
                        ..attr \class "interpelace bar"
                        ..attr \data-tooltip ->
                            str = if it.interpelace_source_count
                                "Interpeloval(a) <strong>#{it.interpelace_sum}</strong>x"
                            else
                                "Byl(a) interpelován(a) <strong>#{it.interpelace_sum}</strong>x"
                            escape str

                        ..append \div
                            ..style \height ~>
                                "#{@interpelaceScale it.interpelace_sum}px"
                    ..append \div
                        ..attr \class "zakony bar"
                        ..attr \data-tooltip ->
                            escape "Předložil(a) <strong>#{it.zakony_predkladatel_count}</strong> zákonů"
                        ..append \div
                            ..style \height ~>
                                "#{@zakonyScale it.zakony_predkladatel_count}px"
                    ..append \div
                        ..attr \class "absence bar"
                        ..attr \data-tooltip ->
                            "Byl(a) u <strong>#{Math.round (1-it.absence_normalized)*100}%</strong> hlasování (#{it.absence_count} z #{it.possible_votes_count})"
                        ..append \div
                            ..style \height ~>
                                "#{@percentageInvertedScale it.absence_normalized}px"
                    ..append \div
                        ..attr \class "nazor bar"
                        ..attr \data-tooltip ->
                            "Vlastní nazor projevil(a) u <strong>#{Math.round it.nazor_normalized*100}%</strong> hlasování (#{it.nazor_count} z #{it.possible_votes_count})"
                        ..append \div
                            ..style \height ~>
                                "#{@percentageScale it.nazor_normalized}px"

    reSort: ->
        @getRowElements!
            .sort @sorterFilter.sortFunction
            .transition!
                ..duration 800
                ..style \top (item, index) -> "#{index * list_item_height}px"
    reFilter: ->
        currentData = @poslanci.filter @sorterFilter.filterFunction
        sel = @getRowElements!
            .data currentData, -> it.id
        sel.transition!
            ..delay 400
            ..duration 800
            ..style \top (item, index) -> "#{index * list_item_height}px"

        sel.exit!
            .classed \poslanec false
            .transition!
                ..delay (item, index) -> index * 10
                ..duration 800
                ..style \left "-110%"
                ..remove!

    getScales: ->
        @interpelaceScale = d3.scale.linear!
            ..domain [0 200 718] # deformace, aby Necas tak nevycnival
            ..range [1 list_barchart_height * 0.85, list_barchart_height ]

        zakonyMaximum = Math.max ...@poslanci.map (.zakony_predkladatel_count)
        @zakonyScale = d3.scale.linear!
            ..domain [0 zakonyMaximum]
            ..range [1 list_barchart_height]

        @percentageScale = d3.scale.linear!
            ..domain [0 1]
            ..range [1 list_barchart_height]

        @percentageInvertedScale = d3.scale.linear!
            ..domain [1 0]
            ..range [1 list_barchart_height]

    getRowElements: ->
        @container.selectAll "li.poslanec"

(err, data) <~ d3.json "./api.php?get=poslanci"
kraje  = data.kraje.map  -> if it then new Kraj it   else null
strany = data.strany.map -> if it then new Strana it else null
sorterFilter = new SorterFilter \#wrap strany
poslanci = data.poslanci.map ->
    it.kraj = kraje[it.kraj_id]
    it.strana = strany[it.strana_id]
    new Poslanec it
poslanecList = new PoslanecList do
    \#wrap
    poslanci
    sorterFilter
