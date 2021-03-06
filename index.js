/**
 * Created by mamoruohara on 12/21/16.
 */
module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var http = require('http');
var app = new alexa.app( 'cumtd' );

//======================================================
var req = require('request');

// var url = "https://developer.cumtd.com/api/v2.2/json/GetDeparturesByStop?stop_id=IT&key=bddb4d82cb704b708cdf32c72a58db04";
// var options = {
//     url: url
// };

// var cb = function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         var info = JSON.parse(body);
//         return info;
//     }
// };

// req(options, cb);


function getJsonStops(stop_id, response, eventCallback) {
    var url = "http://developer.cumtd.com/api/v2.2/json/GetDeparturesByStop?stop_id=IT&key=bddb4d82cb704b708cdf32c72a58db04";

    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = JSON.parse(body);
            eventCallback(response, stringResult);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}
//======================================================

app.launch( function( request, response ) {
    response.say( 'Welcome to your test skill' )
            .reprompt( 'Way to go. You got it to run. Bad ass.' ).shouldEndSession( false );
});


app.error = function( exception, request, response ) {
    console.log(exception);
    console.log(request);
    console.log(response);
    response.say( 'Sorry an error occured ' + error.message);
};

app.intent('sayNumber',
    {
        "slots":{"number":"NUMBER"}
        ,"utterances":[
        "say the number {1-100|number}",
        "give me the number {1-100|number}",
        "tell me the number {1-100|number}",
        "I want to hear you say the number {1-100|number}"]
    },
    function(request,response) {
        var number = request.slot('number');
        response.say("You asked for the number "+number);
    }
);

app.intent('getStop',
    {
        "slots":{"stop":"STOPS"}
        ,"utterances":[
        "Give me buses for stop {-|stop}"]
    },
    function(request,response) {
        var stop = request.slot('stop');
        if (stop === "illinois terminal") {
            getJsonStops("IT", response, function(resp, https_out) {
                if (https_out.departures.length === 0) {
                    resp.say("No departures at this time")
                } else {
                    resp.say("ay lmao").send();
                }
                console.log(https_out);
                resp.send();
            });
        } else {
            response.say("You asked for the stop "+ stop);
        }
        return false;
    }
);



module.exports = app;