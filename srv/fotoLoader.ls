require! {
    fs
    mysql
    async
    request
}
config =
    host     : \localhost
    user     : \root
    password : ''
    database : 'poslanci'

(err, existing) <~ fs.readdir "./images"
existing .= map -> parseInt it, 10
connection = mysql.createConnection config
    ..connect!

(err, rows) <~ connection.query "SELECT id FROM poslanci WHERE poslanec_2010=1 AND id NOT IN (#{existing.join ','})"
<~ async.eachLimit rows, 4, ({id}, cb) ->
    console.log "Loading #id"
    stream = fs.createWriteStream "./images/#id.jpg"
    r = request "http://www.psp.cz/eknih/cdrom/2010ps/eknih/2010ps/poslanci/i#{id}.jpg"
    r.pipe stream
    r.on \end -> cb!
console.log 'done'
<~ setTimeout _, 300
process.exit!
