grafcas  <- function(poslanecid) {

library("lubridate")

# kolikrát se hlasovalo v jednotlivých dnech
hlasovani.dny.celkem  <- as.data.frame(table(hlasovani$datum))
names(hlasovani.dny.celkem)  <- c("datum", "hlasovani")

# všechny dny, kdy sněmovna hlasovala
names(table(as.Date.POSIXct(hlasovani$datum)))



# kolikrát v jednotlivých dnech hlasoval určitý poslanec

pseudoid  <- getpseudoid(poslanecid)[1,2] #zadej id poslance
hlasovaniposlance  <- hlasovani.poslanec[hlasovani.poslanec$X.poslanec_id %in% pseudoid,]

# přidej datum ke každému hlasování
for(i in 1:nrow(hlasovaniposlance)) {  
  hlasovaniposlance [i,4]  <- hlasovani[hlasovani$X.id==hlasovaniposlance[i,2],3]  
}

# agreguj hlasování podle data
hlasovani.poslanec.datum  <- data.frame()
for(i in 1:length(unique(hlasovaniposlance$V4))) {
  hlasovani.poslanec.datum  <- rbind(hlasovani.poslanec.datum, c(unique(hlasovaniposlance$V4)[i], summary(hlasovaniposlance[hlasovaniposlance$V4==unique(hlasovaniposlance$V4)[i],3])))  
}
names(hlasovani.poslanec.datum)  <- c("datum", "@", "A", "B", "C", "F")

poslanec.ucast.na.hlasovani  <- merge(hlasovani.dny.celkem, hlasovani.poslanec.datum)

# spočti a zobraz procentuální účast

poslanec.ucast.na.hlasovani$procento  <- 100/poslanec.ucast.na.hlasovani$hlasovani * (poslanec.ucast.na.hlasovani$A + poslanec.ucast.na.hlasovani$B + poslanec.ucast.na.hlasovani$C)

svg(paste("grafy/", round(mean(poslanec.ucast.na.hlasovani$procento), 0), poslanci[poslanci$X.id==poslanecid,]$prijmeni, ".svg", sep=""),
    height=3.8,
    width=8)

barplot(poslanec.ucast.na.hlasovani$procento, names.arg=strftime(as.Date.POSIXct(as.numeric(levels(poslanec.ucast.na.hlasovani$datum))), format="%b %Y"),
        col="skyblue",
        border="white",
        main=paste("Kolika hlasování se zúčastnil(a)" , poslanci[poslanci$X.id==poslanecid,]$jmeno, poslanci[poslanci$X.id==poslanecid,]$prijmeni),
        xlab="Každý sloupeček představuje jeden den, kdy sněmovna zasedala",
        ylab="Účast při hlasování (procenta)",
        cex.names=0.7,
        cex.axis=1)
abline(h=mean(poslanec.ucast.na.hlasovani$procento),col="red",lty=2)
legend("bottomright",
       legend=paste("Průměr ", round(mean(poslanec.ucast.na.hlasovani$procento), 0), " %"),
       col=c("red"),
       lty=2,
       cex=0.85,
       box.lty=0)
dev.off()
}


