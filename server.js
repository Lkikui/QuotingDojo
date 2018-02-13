//express
var express = require('express');
var app = express();

//mongoose
var mongoose = require('mongoose');

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//path
var path = require('path');

//static and views folders
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

/* ---------- database ---------- */
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quoting_dojo');

var QuoteSchema = new mongoose.Schema ({
    name: {type: String, required: true, minlength: 2},
    quote: {type: String, required: true, maxlength: 100}
}, {timestamps: true});
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

/* ---------- routes ---------- */
app.get('/', function(req, res) {
    res.render('index');
});

app.post('/submitQuote', function(req, res) {
    console.log("POST DATA", req.body);

    var quote = new Quote({name: req.body.name, quote: req.body.quote});
    quote.save(function(err){
        if(err) {
            console.log('something went wrong');
            res.render('index', {errors: quote.errors})
        } else {
            console.log('successfully added a quote!');
            res.redirect('/quotes');
        }
    })
})

app.get('/quotes', function(req, res) {
    Quote.find({}, function(err, quotes){
        if(err) {
            console.log('ERROR: query unsuccessful');
        } else {
            console.log('successfully filtered!');
            console.log(quotes);
            res.render('quotes', {quotes: quotes});
        }
    })
})

/* ---------- port ---------- */
app.listen(8000, function() {
    console.log("QuotingDojo Project listening on port 8000");
})