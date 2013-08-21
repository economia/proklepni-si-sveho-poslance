window.list_item_height     = 62
window.list_barchart_height = 50
window.tooltip              = new Tooltip!watchElements!

window.Strana = class Strana
    ({@nazev, @plny, @zkratka}) ->
window.Kraj = class Kraj
    ({@id, @nazev}) ->


(err, data) <~ d3.json "./api.php?get=poslanci"
kraje  = data.kraje.map  -> if it then new Kraj it   else null
strany = data.strany.map -> if it then new Strana it else null
$wrap = $ \#wrap
$rightPart = $wrap.find \.rightPart
sorterFilter = new SorterFilter \.leftPart strany, kraje
    ..onSortChange \activity-index-desc
poslanci = data.poslanci.map ->
    it.kraj = kraje[it.kraj_id]
    it.strana = strany[it.strana_id]
    new Poslanec it, $wrap, $rightPart
poslanci.sort sorterFilter.sortFunction
poslanecList = new PoslanecList do
    \.leftPart
    poslanci
    sorterFilter

