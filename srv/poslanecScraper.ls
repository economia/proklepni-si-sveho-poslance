require! {
    $:jquery
    mysql
    fs
    async
    mysql
    moment
    request
    './config'
    iconv.Iconv
}
connection = mysql.createConnection config
    ..connect!

ic = new Iconv 'cp1250', 'utf-8'
(err, rows) <~ connection.query "SELECT id FROM poslanci WHERE poslanec_2010=1 AND from_date=0"
# rows.length = 1
<~ async.eachLimit rows, 4, ({id}, cb) ->
    if id == 401 then return cb! # predsedkyne - nemcova
    (err, response, body) <~ request.get "http://www.psp.cz/sqw/detail.sqw?id=#id&o=6" {encoding: null}
    console.log id
    body = ic.convert body .toString!
    $body = $ body
    $descripion = $body.find '#main-content .description'
    $joblist = $descripion.find '.job-list'
    poslanecFrom = null
    poslanecTo   = null
    $joblist.find "li" .each ->
        $ele = $ @
        return unless $ele.find "a" .length == 0
        text = $ele.html!
        text .= replace /&nbsp;/g " "
        regExp = new RegExp "(poslanec|poslankyně)  od ([0-9]+\. [0-9]+\. [0-9]+)( do ([0-9]+\. [0-9]+\. [0-9]+))?"
        parts = text.match regExp
        return unless parts
        dateFormat = "DD. MM. YYYY"
        poslanecFrom := moment parts[2], dateFormat
        if parts[4]
            poslanecTo := moment parts[4], dateFormat
    infoText = $body.find '#main-content .section .photo-column .figcaption' .html!
    parts = infoText.match new RegExp "na kandidátce: (.*?)</p>"
    party = parts[1]
    parts = infoText.match new RegExp "Volební kraj:(.*?)    "
    kraj = parts[1]
    query = "UPDATE poslanci SET party='#party', kraj='#kraj', from_date='#{poslanecFrom.format 'X'}',
        to_date='#{poslanecTo?.format 'X'}' WHERE id=#id LIMIT 1"
    (err) <~ connection.query query
    cb!
connection.destroy!
