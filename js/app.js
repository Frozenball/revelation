// Copyright 2014 Teemu Kokkonen
// Licensed with GNU General Public License 3 or later

var pg = require('pg');
var handlebars = require('handlebars');
var nsh = require('node-syntaxhighlighter');
var conString = "postgres://lol:lollero@localhost/lol";
var client = new pg.Client(conString);

$(function(){
    var TEMPLATE_ERROR = handlebars.compile($('.js-note-error-template').html());
    var TEMPLATE_QUERY = handlebars.compile($('.js-note-query-template').html());

    function showError(sql, error) {
        $('.notes').append(TEMPLATE_ERROR({
            sql: new handlebars.SafeString(nsh.highlight(
                sql,
                nsh.getLanguage('sql'),
                {'gutter': false}
            )),
            error: error
        }));
    }
    function showResult(sql, result) {
        debugger;
        $('.notes').append(TEMPLATE_QUERY({
            sql: new handlebars.SafeString(nsh.highlight(
                sql,
                nsh.getLanguage('sql'),
                {'gutter': false}
            )),
            fields: result.fields,
            rows: result.rows 
        }));
    }

    client.connect(function(err) {
        if(err) {
            return showError("Could not connect to the database", err);
        }
            $('.js-input').on('keydown', function(e){
                if (event.keyCode === 13 && event.shiftKey) {
                    var query = $('.js-input').val();
                    client.query(query, function(err, result) {
                        if(err) {
                            showError(query, err);
                        }
                        showResult(query, result);
                    });
                    setTimeout(function(){
                        $('.js-input').val('');
                    }, 0);
                }
            })
    });

});