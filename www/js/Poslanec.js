(function(){
  var Poslanec;
  window.Poslanec = Poslanec = (function(){
    Poslanec.displayName = 'Poslanec';
    var prototype = Poslanec.prototype, constructor = Poslanec;
    function Poslanec(arg$){
      var activities;
      this.id = arg$.id, this.titul_pred = arg$.titul_pred, this.prijmeni = arg$.prijmeni, this.jmeno = arg$.jmeno, this.titul_za = arg$.titul_za, this.interpelace_source_count = arg$.interpelace_source_count, this.interpelace_target_count = arg$.interpelace_target_count, this.absence_count = arg$.absence_count, this.nazor_count = arg$.nazor_count, this.possible_votes_count = arg$.possible_votes_count, this.zakony_predkladatel_count = arg$.zakony_predkladatel_count, this.vystoupeni_count = arg$.vystoupeni_count, this.kraj = arg$.kraj, this.strana = arg$.strana;
      this.interpelace_sum = this.interpelace_source_count + this.interpelace_target_count;
      this.absence_normalized = this.absence_count / this.possible_votes_count;
      this.nazor_normalized = this.nazor_count / this.possible_votes_count;
      activities = [this.interpelace_source_count, (1 - this.absence_normalized) * 100, this.nazor_normalized * 100, this.zakony_predkladatel_count, this.vystoupeni_count];
      this.activity_index = activities.reduce(function(curr, prev){
        return prev + curr;
      }, 0);
    }
    prototype.getName = function(){
      return this.jmeno + " " + this.prijmeni;
    };
    return Poslanec;
  }());
}).call(this);
