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
                ..style \top (item, index) -> "#{index * list_item_height + list_item_offset}px"
    reFilter: ->
        @currentData = @poslanci.filter @sorterFilter.filterFunction
        sel = @getRowElements! .data @currentData, (.id)
            ..transition!
                ..delay 600
                ..duration 800
                ..style \top (item, index) -> "#{index * list_item_height + list_item_offset}px"
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
            ..style \top (item, index) -> "#{index * list_item_height + list_item_offset}px"
            ..style \left "0%"
            ..append \span
                ..attr \class \name
                ..html (.getName!)
            ..append \span
                ..attr \class \party
                ..html (.strana.plny)
            ..append \img
                ..attr \src -> "./img/poslanci_thumb/#{it.id}.png"
            ..append \span
                ..attr \class \order
                ..html (poslanec, index) -> "#{poslanec.index+1}."
            ..on \click ->
                it.onSelect!
        @appendBarchart row
        if Modernizr.svg
            @appendPiechart row
        row

    appendBarchart: (row) ->
        barchart = row.append \div
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
                ..attr \class "vystoupeni bar"
                ..attr \data-tooltip ->
                    "Promluvil(a) <strong>#{it.vystoupeni_count}x</strong>"
                ..append \div
                    ..style \height ~>
                        "#{@vystoupeniScale it.vystoupeni_count}px"
        if not Modernizr.svg
            barchart.append \div
                ..attr \class "absence bar"
                ..attr \data-tooltip ->
                    "Byl(a) u <strong>#{it.possible_votes_count - it.absence_count}</strong> hlasování z <strong>#{it.possible_votes_count}</strong>"
                ..append \div
                    ..style \height ~>
                        "#{@percentageInvertedScale it.absence_normalized}px"

    appendPiechart: (row) ->
        radius = list_barchart_height / 2
        colors = <[ #85BEE6 transparent ]>
        row.append \svg
            .append \g
                .attr \transform "translate(#radius, #radius)"
                .attr \data-tooltip ->
                    "Byl(a) u <strong>#{it.possible_votes_count - it.absence_count}</strong> hlasování z <strong>#{it.possible_votes_count}</strong>"
                .selectAll \path
                .data ~> @pie [it.possible_votes_count - it.absence_count, it.absence_count]
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
            ..range [1 list_barchart_height * 0.9]
        @pie = d3.layout.pie!
            ..startAngle -> Math.PI * 1.5
            ..endAngle Math.PI * 3.5
            ..sort -> null
        @pieArc = d3.svg.arc!
            ..outerRadius list_barchart_height * 0.9 / 2

    getRowElements: ->
        @container.selectAll "li.poslanec"
