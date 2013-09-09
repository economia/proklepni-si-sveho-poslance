sectihlasovani  <- function(idecka) {
  soucethlasovani  <- data.frame()
  pseudoid  <- getpseudoid(idecka)  
  for(i in 1:length(pseudoid$pseudoid)) {
  soucethlasovani  <- rbind(soucethlasovani, c(pseudoid$id[i], pseudoid$pseudoid[i], summary(hlasovani.poslanec$vysledek[hlasovani.poslanec$X.poslanec_id %in% pseudoid$pseudoid[i]])))
    
  }
  names(soucethlasovani)  <- c("id", "pseudoid", "@", "A", "B", "C", "F")
  return(soucethlasovani)
}