list_barchart_height = 50
list_barchart_bar_width = 30

class Poslanec
    ({@titul_pred, @prijmeni, @jmeno, @titul_za, @interpelace_source_count, @interpelace_target_count, @absence_count, @nazor_count, @possible_votes_count}) ->
        @interpelace_sum = @interpelace_source_count + @interpelace_target_count

    getName: -> "#{@titul_pred} #{@jmeno} #{@prijmeni} #{@titul_za}"

class PoslanecList
    (parentSelector, @poslanci) ->
        @container = d3.select parentSelector .append "ul"
            ..attr \class \poslanecList
        @getScales!
        @draw!

    draw: ->
        @container
            .selectAll "li"
            .data @poslanci
            .enter!append "li"
                ..append "span"
                    ..attr \class \name
                    ..html (.getName!)
                ..append \div
                    ..attr \class \barchart
                    ..append \div
                        ..attr \class "interpelace bar"
                        ..style \height ~>
                            "#{@interpelaceScale it.interpelace_sum}px"
                        ..style \left list_barchart_bar_width * 0

    getScales: ->
        interpelaceMaximum = Math.max ...@poslanci.map (.interpelace_sum)
        @interpelaceScale = d3.scale.linear!
            ..domain [0 interpelaceMaximum]
            ..range [3 list_barchart_height]



(err, data) <~ d3.json "./api.php?get=poslanci"
poslanci = data.map -> new Poslanec it
poslanecList = new PoslanecList \#wrap poslanci
