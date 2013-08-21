require! {
    csv
    async
    fs
    mysql
    moment
    './config'
}
connection = mysql.createConnection config
    ..connect!
queries = []
c = csv!.from.stream fs.createReadStream "../data/poslanci-vystoupeni.csv"
    .on \record ([_, id, jmeno, prijmeni, datum, url], index) ->
        return if id is 'id'
        id = +id
        datum = moment datum, 'DD.MM.YYYY'
        queries.push "INSERT INTO poslanci_vystoupeni (poslanec_id, date, url)
            VALUES (#id, #{datum.format 'X'}, '#url')"

<~ c.on \end
<~ async.eachLimit queries, 10, connection~query
connection.destroy!
