#načti jen poslance aktivní ve volebním období 2010
poslanci  <- read.csv("poslanci.csv")
poslanci  <- read.csv("poslanci.csv")[poslanci$poslanec_2010==1,]

library(XML)
library(stringr)
library(RCurl)

#scraper

reci <- data.frame(id=character(),
                   jmeno=character(),
                   prijmeni=character(),
                   datum=character(),
                   url_vystoupeni=character(),
                   stringsAsFactors=FALSE)
pocitadlo  <- 0

for (i in 1:length(poslanci$id)) {
  
  #načti zdrojový kód seznamu stenozáznamů
  uri  <- paste("http://psp.cz/eknih/2010ps/rejstrik/jmenny/", poslanci$id[i], ".html", sep="")
  if (url.exists(uri)) {
  zdrojak  <- htmlParse(uri, encoding="Windows-1250")

  #získej url vystoupení
  url_vystoupeni  <- unlist(sapply(xpathSApply(zdrojak, "//a"), xmlAttrs))[grepl("/eknih/2010ps/stenprot/.*", unlist(sapply(xpathSApply(zdrojak, "//a"), xmlAttrs)))]
  #odstraň odkaz na stenoprotokoly z menu
  url_vystoupeni  <- url_vystoupeni[1:length(url_vystoupeni)-1]
  print(i)
  print(paste(as.character(poslanci$jmeno[i])))
  print(length(url_vystoupeni))
  for (j in 1:length(url_vystoupeni)) {
        pocitadlo  <- pocitadlo + 1
        datum  <- sapply(xpathSApply(htmlParse(paste("http://psp.cz", url_vystoupeni[j], sep=""), encoding="Windows-1250"), "//p[@class='date']"), xmlValue)
        den  <- str_sub(str_split(datum, "\\s")[[1]][2],1,-2)
        mesic  <- str_split(datum, "\\s")[[1]][3]
        if (mesic=="ledna") {mesic  <- 1}
        if (mesic=="února") {mesic  <- 2}
        if (mesic=="března") {mesic  <- 3}
        if (mesic=="dubna") {mesic  <- 4}
        if (mesic=="května") {mesic  <- 5}
        if (mesic=="června") {mesic  <- 6}
        if (mesic=="července") {mesic  <- 7}
        if (mesic=="srpna") {mesic  <- 8}
        if (mesic=="září") {mesic  <- 9}
        if (mesic=="října") {mesic  <- 10}
        if (mesic=="listopadu") {mesic  <- 11}
        if (mesic=="prosince") {mesic  <- 12}
        rok  <- str_split(datum, "\\s")[[1]][4]
        datum  <- paste(den, mesic, rok, sep=".")
        print(datum)
        reci[pocitadlo,]  <- c(as.character(poslanci$id[i]), as.character(poslanci$prijmeni[i]), as.character(poslanci$jmeno[i]), datum, paste("http://psp.cz", url_vystoupeni[j], sep=""))  
        }  
  }
}

write.csv(reci, "poslanci-vystoupeni.csv")