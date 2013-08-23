 window.PoslanecList = class PoslanecList
    (parentSelector, @poslanci, @sorterFilter) ->
        @currentData = @poslanci.slice 0
        @container = d3.select parentSelector .append "ul"
            ..attr \class \poslanecList
        @getScales!
        @draw!
        @sorterFilter.onSortChangeCb = @~reSort
        @sorterFilter.onFilterChangeCb = @~reFilter

    draw: ->
        newRows = @getRowElements!
            .data @currentData, -> it.id
            .enter!
        @decorateRows newRows

    reSort: ->
        @poslanci.sort @sorterFilter.sortFunction
        @getRowElements!
            .sort @sorterFilter.sortFunction
            .transition!
                ..duration 800
                ..style \top (item, index) -> "#{index * list_item_height}px"
    reFilter: ->
        @currentData = @poslanci.filter @sorterFilter.filterFunction
        sel = @getRowElements! .data @currentData, (.id)
            ..transition!
                ..delay 600
                ..duration 800
                ..style \top (item, index) -> "#{index * list_item_height}px"
            ..exit!
                ..classed \poslanec false
                ..transition!
                    ..delay (item, index) -> index * 10
                    ..duration 800
                    ..style \left "-110%"
                    ..remove!
        @decorateRows sel.enter!
            ..style \transform "scale(0.1)"
            ..style \-ms-transform "scale(0.1)"
            ..style \-o-transform "scale(0.1)"
            ..style \-webkit-transform "scale(0.1)"
            ..style \-moz-transform "scale(0.1)"
            ..style \opacity "0"
            ..transition!
                ..delay 600
                ..duration 800
                ..style \transform "scale(1)"
                ..style \-ms-transform "scale(1)"
                ..style \-o-transform "scale(1)"
                ..style \-webkit-transform "scale(1)"
                ..style \-moz-transform "scale(1)"
                ..style \opacity "1"

    decorateRows: (enterSelection) ->
        row = enterSelection.append \li
            ..attr \class -> "poslanec #{it.strana.zkratka}"
            ..style \top (item, index) -> "#{index * list_item_height}px"
            ..style \left "0%"
            ..append \span
                ..attr \class \name
                ..html (.getName!)
            ..append \span
                ..attr \class \party
                ..html (.strana.plny)
            ..append \img
                ..attr \src -> "./img/poslanci_thumb/#{it.id}.png"
            ..on \click ->
                it.onSelect!
        @appendBarchart row
        @appendPiechart row

    appendBarchart: (row) ->
        row.append \div
            ..attr \class \barchart
            ..append \div
                ..attr \class "interpelace bar"
                ..attr \data-tooltip ->
                    escape "Interpeloval(a) <strong>#{it.interpelace_sum}</strong>x"
                ..append \div
                    ..style \height ~>
                        "#{@interpelaceScale it.interpelace_source_count}px"
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
                ..attr \class "vystoupeni bar"
                ..attr \data-tooltip ->
                    "Přednesl(a) projev <strong>#{it.vystoupeni_count}x</strong>"
                ..append \div
                    ..style \height ~>
                        "#{@vystoupeniScale it.vystoupeni_count}px"

    appendPiechart: (row) ->
        radius = list_barchart_height / 2
        colors = <[ #FC8D59 #91CF60 ]>
        row.append \svg
            .append \g
                .attr \transform "translate(#radius, #radius)"
                .selectAll \path
                .data ~> @pie [it.absence_count, it.possible_votes_count - it.absence_count]
                .enter!
                    ..append \path
                        ..attr \fill (d, i) ->
                            colors[i]
                        ..attr \d @pieArc



    getScales: ->
        interpelaceMaximum = Math.max ...@poslanci.map (.interpelace_source_count)
        @interpelaceScale = d3.scale.linear!
            ..domain [0 interpelaceMaximum]
            ..range [1 list_barchart_height]

        zakonyMaximum = Math.max ...@poslanci.map (.zakony_predkladatel_count)
        @zakonyScale = d3.scale.linear!
            ..domain [0 zakonyMaximum]
            ..range [1 list_barchart_height]


        vystoupeniMaximum = Math.max ...@poslanci.map (.vystoupeni_count)
        @vystoupeniScale = d3.scale.linear!
            ..domain [0 vystoupeniMaximum]
            ..range [1 list_barchart_height]

        @percentageScale = d3.scale.linear!
            ..domain [0 1]
            ..range [1 list_barchart_height]

        @percentageInvertedScale = d3.scale.linear!
            ..domain [1 0]
            ..range [1 list_barchart_height]
        @pie = d3.layout.pie!
            ..sort -> null
        @pieArc = d3.svg.arc!
            ..outerRadius list_barchart_height / 2

    getRowElements: ->
        @container.selectAll "li.poslanec"
