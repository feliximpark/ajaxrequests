
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

 // load streetview
    // ist kein richtiger Ajax-Call, weil wir "nur" den HTML-Link für das Bild
    // erstellen. Das reicht für Street-View, da die Foto-URL immer gleich aufgebaut ist

        console.log ("Function streetView läuft");
        // in JQuery können wir val anstatt value benutzen, WICHTIG: .val()!!!
        var streetadr = $("#street").val();
        console.log (streetadr);
        var cityadr = $("#city").val();
        // dann legen wir eine Variable an, in der die komplette Adresse liegt
        var adress = streetadr + ", " + cityadr;
        // hier holen wir uns den Begrüßungstext und ändern ihn
        $greeting.text("So you want to live at " + cityadr + "?");
        //Hier legen wir eine neue Variable mit der Bild-URL an
        var streetviewURL = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + cityadr;
        // jetzt greifen wir den Body und hängen ein Image mit der BildURL an
        $body.append("<img class='bgimg' src='" + streetviewURL + "'>");

console.log ("Streetview abgeschlossen");
     // YOUR CODE GOES HERE!




// NY times API Key:  ac3bf3e29d5b4ce79a09ff9aac21bb12
// wir nutzen JQuery.getJSON()- Method
// die Methode der URL-Erstellung ist aus der NYT-Documentation
var sort = streetadr + " " + cityadr;
var URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
URL += "?" + $.param({
    "api-key": "ac3bf3e29d5b4ce79a09ff9aac21bb12",
    "sort": "newest",
    "fq": sort
});
console.log(URL);
//mit der richtigen URL im Gepäck starten wir unseren getJSON
$.getJSON(URL, function(data) {
    //zuerst ändern wir die Überschrift der Artikelliste
    $nytHeaderElem.text("NY-Times article about " + cityadr);
    //Hier iterieren wir über die Ergebnisse
    var items=[];
    $.each(data.response.docs, function (key, val){
       var snippet = (data.response.docs[key].snippet);
       var url = (data.response.docs[key].web_url);
       var headline = (data.response.docs[key].headline.main);


    // Hier werden die Ergebnisse in den HTML-Code eingefügt
    $("#nytimes-articles").append("<li class='article'><a href='"+url+"'>" + headline + "</a><p>" + snippet +"</p>");
    });
    // $.each(data.response.docs, function()
    // console.log(this.snippet);

}).fail(function(e){

    $nytHeaderElem.text("Couldn´t load the article");
})
// .done(function(e){
//     console.log("done meldet: alles hat geklappt");
// });


// Hier binden wir die Wikipedia-Artikel ein
// Problem: Wikipedia verhindert CORS, Cross-Origin Resource Sharing
// Hintergrund sind Sicherheitseinstellungen
//Lösung: Wir verwenden keine JSON-Anfrage, sondern fragen JSONP an
// das machen wir mit der Methode jQuery.ajax()

// Zunächst legen wir die URL an
// https://en.wikipedia.org/w/api.php ist die Basis, der Startpunkt
// dann geben wir noch verschiedene Setting mit, immer getrennt durch ein "?"
// action=opensearch (meint Suchfunktion), search=""(hier geben wir ein Suchwort mit)
// format ist klar, callback gibt die Callback-Function für die JsonP-Technik
var wikiURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+cityadr+"&format=json&callback=wikiCallback";

//jsonp hat keine .false-Methode, die müssen wir uns selbst bauen
//folgender Trick: Wir schreiben eine setTimeout-Function, eine Art Zeitzünder
// wir schalten den Zeitzünder im Ajax-Request ab, wenn Success vermeldet wird
var wikiRequestTimeout = setTimeout(function(){
    $wikiElem.text("failed to get wikipedia resources");
}, 8000);

//Hier starten wir den Ajax-Call und geben ein paar Settings mit auf den Weg,
// die Wikipedia für die Bearbeitung benötigt.
$.ajax({
    // hier hätten wir auch schreiben können $ajax(wikiURL, { ...})
    url: wikiURL,
    // dataType: "jsonp" setzt das Setting automatisch aurf jsonp: "callback"
    // es gibt aber auch APIs, die die Callback-Function anders nennen,
    // dann müssen wir das händisch ändern, indem wir jsonp: "callback-functionname" setzen
    dataType: "jsonp",

    // Hier geben wir eine sucess-object mit rein, das zündet bei erfolg
    // die response ist ein Javascript-Objekt, das in eine function eingebettet ist
    // ist notwendig für die jsonp-Methode.
    success: function(response) {
        //response gibt hier mehrere Objekte mit Listen von Artikeln heraus
        //in den Arrays stecken aber nur die Überschriften/Artikelnamen, keine weiteren Inhalte
        // daher iterieren wir über die Array, ziehen die Artikelnamen raus
        // und packen sie in eine URL, die wir dann auf die Seite zaubern
        var articleList = response[1];

        for (var i=0; i<articleList.length; i++) {
            var articleStr = articleList[i];
            var urrl = "http://en.wikipedia.org/wiki/" + articleStr;
            $wikiElem.append("<li><a href='"+urrl+"'>" + articleStr + "</a></li>");
        };
        clearTimeout(wikiRequestTimeout);
   }
})






    return false;
};

$('#form-container').submit(loadData);
