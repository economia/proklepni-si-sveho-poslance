class Poslanec
    ({@titul_pred, @prijmeni, @jmeno, @titul_za, @interpelace_source_count, @interpelace_target_count, @absence_count, @nazor_count, @possible_votes_count}) ->
    getName: -> "#{@titul_pred} #{@jmeno} #{@prijmeni} #{@titul_za}"

class PoslanecList
    (parentSelector, @poslanci) ->
        @container = d3.select parentSelector .append "ul"
            ..attr \class \poslanecList
        @container
        @draw!
    draw: ->
        @container
            .data @poslanci
            .enter!append "li"
                ..append "span"
                    ..attr \class \name
                    ..html (.getName!)


(err, data) <~ d3.json "./api.php?get=poslanci"
poslanci = data.map -> new Poslanec it
poslanecList = new PoslanecList \#wrap poslanci
