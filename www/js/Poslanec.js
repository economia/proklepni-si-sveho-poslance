(function(){
  var Poslanec;
  window.Poslanec = Poslanec = (function(){
    Poslanec.displayName = 'Poslanec';
    var prototype = Poslanec.prototype, constructor = Poslanec;
    function Poslanec(arg$){
      this.id = arg$.id, this.titul_pred = arg$.titul_pred, this.prijmeni = arg$.prijmeni, this.jmeno = arg$.jmeno, this.titul_za = arg$.titul_za, this.interpelace_source_count = arg$.interpelace_source_count, this.interpelace_target_count = arg$.interpelace_target_count, this.absence_count = arg$.absence_count, this.nazor_count = arg$.nazor_count, this.possible_votes_count = arg$.possible_votes_count, this.zakony_predkladatel_count = arg$.zakony_predkladatel_count, this.kraj = arg$.kraj, this.strana = arg$.strana;
      this.interpelace_sum = this.interpelace_source_count + this.interpelace_target_count;
      this.absence_normalized = this.absence_count / this.possible_votes_count;
      this.nazor_normalized = this.nazor_count / this.possible_votes_count;
    }
    prototype.getName = function(){
      return this.jmeno + " " + this.prijmeni;
    };
    return Poslanec;
  }());
}).call(this);
