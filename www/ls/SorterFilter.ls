window.SorterFilter = class SorterFilter
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
            ..chosen allow_single_deselect: yes
            ..on \change ~>
                @onFilterChange \party $element.val!

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
            <option value='nazor-desc'>Nejčastěji hlasují ano/ne</option>
            <option value='nazor-asc'>Nejméně hlasují ano/ne</option>
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

        | \nazor-desc => (a, b) -> b.nazor_normalized - a.nazor_normalized
        | \nazor-asc  => (a, b) -> a.nazor_normalized - b.nazor_normalized

        | \activity-index-desc => (a, b) -> b.activity_index - a.activity_index
        | \activity-index-asc  => (a, b) -> a.activity_index - b.activity_index
        | otherwise         => null
        @onSortChangeCb?!

    onFilterChange: (filterType, filterValue) ->
        @filterFunction = switch filterType
            | \party =>
                if filterValue
                    (poslanec) -> poslanec.strana.zkratka in filterValue
                else
                    -> true
            | otherwise => null
        @onFilterChangeCb?!



