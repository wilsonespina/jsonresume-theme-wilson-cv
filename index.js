const handlebars = require('handlebars');
const handlebarsWax = require('handlebars-wax');
const fs = require('fs');
const addressFormat = require('address-format');
const moment = require('moment');
const Swag = require('swag');
const path = require('path');
const express = require('express');
const sassMiddleware = require('node-sass-middleware')
const resumeJson = require('./resume.json');
const app = express();
const port = 3000;

const { engine } = require ('express-handlebars');

// START IN DEV MODE
if (process.env.NODE_ENV !== 'RESUME_SERVE_MODE') {
  app.use(sassMiddleware({
    src: path.join(__dirname, 'docs'),
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

  // app.set('view engine', 'html');

  app.set('views', path.join(__dirname, './app/views'));

  app.get('/', (req, res) => {
      res.render('layouts/main', {
  		resume: resumeJson
  	});
  });

  app.use('/covering-letter', (req, res, next) => {
    console.log('>>>>>>>>>>>> HERE >>>>>>>>>')
      res.render('layouts/covering-letter');

      // res.sendFile(path.join(__dirname + '/docs/', 'index.html'));
      // return next();
  });


  app.use(express.static(__dirname + '/docs'));

  app.listen(port, () => (console.log(`App listening to port ${port}`)));

}

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

// START IN RESUME SERVE MODE
// https://github.com/jsonresume/resume-cli#resume-serve
function render(resume) {
  const dir = __dirname + '/docs';
  const css = fs.readFileSync(dir + '/styles/main.css', 'utf-8');
  const resumeTemplate = fs.readFileSync(dir + '/views/layouts/main.hbs', 'utf-8');

  const Handlebars = handlebarsWax(handlebars);

  Handlebars.partials(dir + '/views/partials/**/*.{hbs,js}');
  Handlebars.partials(dir + '/views/components/**/*.{hbs,js}');

  return Handlebars.compile(resumeTemplate)({
    css: css,
    resume: resume
  });
}

module.exports = {
  render: render
};