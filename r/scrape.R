#načti jen poslance aktivní ve volebním období 2010
poslanci  <- read.csv("poslanci.csv")[poslanci$poslanec_2010==1,]


library(XML)
library(stringr)

foto_url <- data.frame(id=character(),
                       jmeno=character(),
                       prijmeni=character(),
                       url=character(),
                       stringsAsFactors=FALSE)
  
for (i in 1:length(poslanci$id)) {
  
  #načti zdrojový kód
  uri  <- paste("http://www.psp.cz/sqw/detail.sqw?id=", poslanci$id[i], "&o=6", sep="")
  zdrojak  <- htmlParse(uri, encoding="Windows-1250")
  
  #získej url obrázku
  url  <- paste("http://www.psp.cz", xmlAttrs((xpathSApply(zdrojak, "//img")[[2]]))[1], sep="")
  foto_url[i,]  <- c(as.character(poslanci$id[i]), as.character(poslanci$prijmeni[i]), as.character(poslanci$jmeno[i]), url)
  print(as.character(poslanci$jmeno[i]))
}

write.csv(foto_url,"foto_url.csv")

xpathSApply(htmlParse(paste("http://www.psp.cz/sqw/detail.sqw?id=", "5980", "&o=6", sep=""), encoding="Windows-1250"), "//img")
