window.SorterFilter = class SorterFilter
    sortFunction: null
    filterFunction: null
    onSortChangeCb: null
    onFilterChangeCb: null
    (parentSelector, @parties, @kraje) ->
        @$element = $ "<div class='filter'></div>"
            ..appendTo $ parentSelector
        @createFilter!
        @createSorter!

    createFilter: ->
        $element = $ "<div class='party'>
                <select class='party' multiple='multiple' data-placeholder='Zobrazit pouze poslance strany nebo kraje'></select>
            </div>"
        $element.appendTo @$element
        $element .= find 'select'
        [@createPartySelect!, @createKrajSelect!, @createMiscSelect!].forEach ->
            it.appendTo $element
        $element
            ..chosen allow_single_deselect: yes
            ..on \change ~>
                @onFilterChange $element.val!

    createPartySelect: ->
        $partyOptgroup = $ "<optgroup label='Politické strany'></optgroup>"
        @parties.forEach (party) ->
            return if party is null
            $ "<option value='party-#{party.zkratka}'>#{party.nazev}</option>"
                ..appendTo $partyOptgroup

        $partyOptgroup

    createKrajSelect: ->
        $krajOptgroup = $ "<optgroup label='Kraje'></optgroup>"
        @kraje.forEach (kraj) ->
            return if kraj is null
            $ "<option value='kraj-#{kraj.id}'>#{kraj.nazev}</option>"
                ..appendTo $krajOptgroup

        $krajOptgroup

    createMiscSelect: ->
         $ "<optgroup label='Ostatní'>
            <option value='misc-preferencni'>Zvoleni preferenčními hlasy</option>
            <option value='misc-novacek'>Nově zvolení poslanci</option>
            <option value='misc-celeobdobi'>Byli poslanci celé období</option>
         </optgroup>"

    createSorter: ->
        $element = $ "<div class='sort'><select class='sort' data-placeholder='Seřadit podle'>
            <option value=''></option>
            <option value='activity-index-desc'>Celkově nějaktivnější</option>
            <option value='activity-index-asc'>Celkově nejméně aktivní</option>
            <option value='interpelace-desc'>Nejvíce interpelující</option>
            <option value='interpelace-asc'>Nejméně interpelují</option>
            <option value='zakony-desc'>Nejvíce předložených zákonů</option>
            <option value='zakony-asc'>Nejméně předložených zákonů</option>
            <option value='absence-asc'>Nejčastěji přítomní</option>
            <option value='absence-desc'>Nejméně přítomní</option>
            <option value='vystoupeni-desc'>Pronesli nejvíce projevů</option>
            <option value='vystoupeni-asc'>Pronesli nejméně projevů</option>
            </select>
            </div>
            "
        $element
            ..appendTo @$element
        $element .= find \select
            ..chosen! #allow_single_deselect: yes
            ..on \change ~>
                @onSortChange $element.val!

    onSortChange: (sortId) ->
        @sortFunction = switch sortId
        | \interpelace-desc => (a, b) -> b.interpelace_source_count - a.interpelace_source_count
        | \interpelace-asc  => (a, b) -> a.interpelace_source_count - b.interpelace_source_count

        | \zakony-desc => (a, b) -> b.zakony_predkladatel_count - a.zakony_predkladatel_count
        | \zakony-asc  => (a, b) -> a.zakony_predkladatel_count - b.zakony_predkladatel_count

        | \absence-desc => (a, b) -> b.absence_normalized - a.absence_normalized
        | \absence-asc  => (a, b) -> a.absence_normalized - b.absence_normalized

        | \activity-index-desc => (a, b) -> b.activity_index - a.activity_index
        | \activity-index-asc  => (a, b) -> a.activity_index - b.activity_index

        | \vystoupeni-desc => (a, b) -> b.vystoupeni_count - a.vystoupeni_count
        | \vystoupeni-asc  => (a, b) -> a.vystoupeni_count - b.vystoupeni_count

        | otherwise         => null
        @onSortChangeCb?!

    onFilterChange: (filterValue) ->
        @filterFunction = if filterValue
            krajValues  = []
            partyValues = []
            miscValues  = {}
            filterValue.forEach ->
                [prefix, value] = it.split '-'
                switch prefix
                | \kraj  => krajValues.push +value
                | \party => partyValues.push value
                | \misc => miscValues[value] = true

            (poslanec) ->
                if partyValues.length and poslanec.strana.zkratka not in partyValues
                    return false
                if krajValues.length and poslanec.kraj.id not in krajValues
                    return false
                if miscValues.preferencni and not poslanec.preferencni
                    return false
                if miscValues.novacek and not poslanec.novacek
                    return false
                if miscValues.celeobdobi and (poslanec.notActiveFromStart or poslanec.to_date)
                    return false
                return true

        else
            -> true
        @onFilterChangeCb?!



