-- soucty hlasovani jsou v unl importeru, summator.ls
update poslanci set poslanec_2010=(SELECT COUNT(*) > 0 FROM poslanci_zarazeni WHERE poslanec_id=poslanci.id and funkce_id=170)

update poslanci set interpelace_source_count=(SELECT COUNT(interpelace.id) FROM interpelace
    JOIN interpelace_losovani ON (interpelace.losovani_id = interpelace_losovani.id)
    WHERE poslanec_id=poslanci.id and interpelace_losovani.datum > 1275350400)

update poslanci set interpelace_target_count=(SELECT COUNT(interpelace.id) FROM interpelace
    JOIN interpelace_losovani ON (interpelace.losovani_id = interpelace_losovani.id)
    WHERE ministr_id=poslanci.id and interpelace_losovani.datum > 1275350400)

update poslanci set zakony_predkladatel_count=(SELECT COUNT(tisk_id) FROM predkladatele
    JOIN tisky ON (predkladatele.tisk_id = tisky.id)
    WHERE osoba_id=poslanci.id and tisky.predlozeno > 1275350400)
