getpseudoid  <- function(poslanecid) {
  pseudoid  <- vector()
  idecka  <- vector()
  for(i in 1:length(poslanecid)) {
    pseudo  <- poslanec.pseudoid$X.poslanec_hlas_id[poslanec.pseudoid$poslanec_id==poslanecid[i]]
    pseudo  <- pseudo[length(pseudo)]
    pseudoid  <- append(pseudoid, pseudo)
    idecka  <- append(idecka, rep(poslanecid[i], length(pseudo)))
  }
  return(data.frame(id=idecka, pseudoid=pseudoid))
}