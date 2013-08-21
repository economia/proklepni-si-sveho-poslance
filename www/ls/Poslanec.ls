window.Poslanec = class Poslanec
    ({@id, @titul_pred, @prijmeni, @jmeno, @titul_za, @interpelace_source_count, @interpelace_target_count, @absence_count, @nazor_count, @possible_votes_count, @zakony_predkladatel_count, @kraj, @strana}) ->
        @interpelace_sum    = @interpelace_source_count + @interpelace_target_count
        @absence_normalized = @absence_count / @possible_votes_count
        @nazor_normalized   = @nazor_count / @possible_votes_count

    getName: -> "#{@jmeno} #{@prijmeni}"
