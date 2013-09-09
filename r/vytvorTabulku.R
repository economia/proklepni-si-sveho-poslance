zjistiJmenaPoslancu <- function (idposlancu) {
  poslanci  <- read.csv("poslanci.csv")
  return(poslanci[poslanci$X.id %in% idposlancu, ])
}


vytvorTabulku  <- function (idposlancu=c(5891, 5926, 5909, 5915, 5959, 5902, 5910, 5990, 5937, 5945, 5953, 5984)) {
  vysledek  <- zjistiJmenaPoslancu(idposlancu)[,c(1,3,4,9,11,13,15)]
  names(vysledek)  <- c("id", "prijmeni", "jmeno", "interpelace", "zakony", "hlasovani_anone", "vystoupeni")
  vysledek$slova  <- c(6368, 15122, 6095, 2560, 1216, 48747, 31465, 180, 1804, 1417, 15199, 5775)
  vysledek$hlasovani_anone  <- 100/5882*vysledek$hlasovani_anone
  

  
  vysledek
  
  browser()
}

hlasovani  <- read.csv("hlasovani_poslanec.csv")

100/sum(table(hlasovani[hlasovani$X.poslanec_id %in% 1138, ]$vysledek))*sum(table(hlasovani[hlasovani$X.poslanec_id %in% 1138, ]$vysledek)[2:4])



head(hlasovani)
