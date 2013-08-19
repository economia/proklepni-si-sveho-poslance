list_barchart_height = 50
class Poslanec
    ({@titul_pred, @prijmeni, @jmeno, @titul_za, @interpelace_source_count, @interpelace_target_count, @absence_count, @nazor_count, @possible_votes_count, @zakony_predkladatel_count}) ->
        @interpelace_sum    = @interpelace_source_count + @interpelace_target_count
        @absence_normalized = @absence_count / @possible_votes_count
        @nazor_normalized   = @nazor_count / @possible_votes_count

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
                    ..append \div
                        ..attr \class "zakony bar"
                        ..style \height ~>
                            "#{@zakonyScale it.zakony_predkladatel_count}px"
                    ..append \div
                        ..attr \class "absence bar"
                        ..style \height ~>
                            "#{@percentageInvertedScale it.absence_normalized}px"
                    ..append \div
                        ..attr \class "nazor bar"
                        ..style \height ~>
                            "#{@percentageScale it.nazor_normalized}px"


    getScales: ->
        interpelaceMaximum = Math.max ...@poslanci.map (.interpelace_sum)
        @interpelaceScale = d3.scale.linear!
            ..domain [0 interpelaceMaximum]
            ..range [3 list_barchart_height]

        zakonyMaximum = Math.max ...@poslanci.map (.zakony_predkladatel_count)
        @zakonyScale = d3.scale.linear!
            ..domain [0 zakonyMaximum]
            ..range [3 list_barchart_height]

        @percentageScale = d3.scale.linear!
            ..domain [0 1]
            ..range [3 list_barchart_height]

        @percentageInvertedScale = d3.scale.linear!
            ..domain [1 0]
            ..range [3 list_barchart_height]


(err, data) <~ d3.json "./api.php?get=poslanci"
poslanci = data.map -> new Poslanec it
poslanecList = new PoslanecList \#wrap poslanci
