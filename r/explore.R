poslanci  <- read.csv("poslanci/poslanci.csv")
hlasovani  <- read.csv("poslanci/hlasovani.csv")

#nově zvolení poslanci
novi  <- c(poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==6, 1], #veckari
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==4 & poslanci$prijmeni!="Kalousek" & poslanci$prijmeni!="Husák" & poslanci$prijmeni!="Parkanová" & poslanci$prijmeni!="Laudát" & poslanci$prijmeni!="Schwarzenberg" & poslanci$prijmeni!="Lobkowicz", 1], #topka
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Wenigerová", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Weberová", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Vodrážka", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Šulc", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Šnajdr", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Svoják", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Stanjura", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Staněk", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Řápková", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Pekárek", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Pajer", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Němeček", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Mečíř", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Martinů", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Kubata", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Kohoutová", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Jirout", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Chalupa", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Fuksa", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Florián", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Fischerová", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Drobil", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Černochová", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Čechlovský", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Bureš", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Bernášek", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Bém", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==1 & poslanci$prijmeni=="Baštýř", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Zemek", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Zemánek", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Vandas", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$X.id=="5980", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Váhalová", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Tancoš", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Šlégr", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Strnadlová", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Sklenák", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Rykala", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Pecina", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Novotný", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Neubauer", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Koubík", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Koskuba", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Jalowiczor", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Jakubčík", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Chvojka", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Huml", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Holík", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Foldyna", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==2 & poslanci$prijmeni=="Antonín", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==3 & poslanci$prijmeni=="Semelová", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==3 & poslanci$prijmeni=="Nekl", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==3 & poslanci$prijmeni=="Nedvědová", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==3 & poslanci$prijmeni=="Matušovská", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==3 & poslanci$prijmeni=="Klán", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==3 & poslanci$prijmeni=="Hubáčková", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==3 & poslanci$prijmeni=="Končická", 1],
                   poslanci[poslanci$poslanec_2010==1 & poslanci$strana_id==3 & poslanci$prijmeni=="Rusová", 1]
                   )

# zvolení preferenčními hlasy

preferencni  <- as.integer(c(5433,386,5924,4,5937,5910,5921,5915,356,5274,211,5475,5928,5520,5970,5991,5925,5899,5920,5911,5941,5909,5949,5984,5975,5968,261,5953,6120,5912,5938,5926,5964,5900,5931,5945,5902,5296,5891,5959,5990,5297,5940,5918,5972,5445,5461,5916))

# ve sněmovně po celé volební období

as.Date.POSIXct(poslanci[poslanci$poslanec_2010==1,15])
