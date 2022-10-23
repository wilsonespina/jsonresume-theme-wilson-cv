const fs = require('fs');
const handlebars = require('handlebars');
const handlebarsWax = require('handlebars-wax');
const addressFormat = require('address-format');
const moment = require('moment');
const Swag = require('swag');


const path = require('path');
const express = require('express');
const sassMiddleware = require('node-sass-middleware')
const app = express();
const port = 3000;
const resumeJson = require('./resume.json');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');

const { engine } = require ('express-handlebars');

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});



app.use(connectLiveReload());

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  outputStyle: 'compressed',
}));

app.engine('hbs', engine({
  extname: '.hbs',
  partialsDir  : [
    //  path to your partials
    path.join(__dirname, 'app/views/partials'),
    path.join(__dirname, 'app/views/components'),
]
}));
app.set('view engine', 'hbs');
// app.set('views', './app/views');

app.set('views', path.join(__dirname, './app/views'));

app.get('/', (req, res) => {
    res.render('index', {
		resume: resumeJson
	});
});

app.use(express.static(__dirname));

app.listen(port, () => console.log(`App listening to port ${port}`));




Swag.registerHelpers(handlebars);

handlebars.registerHelper({
  removeProtocol: function (url) {
    return url.replace(/.*?:\/\//g, '');
  },

  concat: function () {
    let res = '';

    for (let arg in arguments) {
      if (typeof arguments[arg] !== 'object') {
        res += arguments[arg];
      }
    }

    return res;
  },

  formatAddress: function (address, city, region, postalCode, countryCode) {
    const addressList = addressFormat({
      address: address,
      city: city,
      subdivision: region,
      postalCode: postalCode,
      countryCode: countryCode
    });


    return addressList.join('<br/>');
  },

  formatDate: function (date) {
    return moment(date).format('MM/YYYY');
  }
});

