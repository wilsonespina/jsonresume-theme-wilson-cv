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
const coveringLetterJson = require('./covering-letter.json');
const app = express();
const port = 3000;

// const fa = require('@fortawesome/fontawesome-svg-core');

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


  app.set('views', path.join(__dirname, './app/views'));

  app.get('/', (_, res) => {
      res.render('layouts/main', {
  		resume: resumeJson
  	});
  });

  app.use('/covering-letter', (_, res) => {
      res.render('layouts/covering-letter', {
        layout: 'covering-letter',
        resume: resumeJson,
        coveringLetter: coveringLetterJson,
      });
  });


  app.use(express.static(__dirname + '/docs'));

  app.listen(port, () => (console.log(`App listening to port ${port}`)));



  // FONT AWESOME
  const FA = require('./app/js/fontawesome');
  console.log("🚀 ~ file: index.js:61 ~ FA:", FA)
  // const { githubActions } = require('./app/images/github-actions.svg');

  // const gaActions = {
  //   prefix: "fab",
  //   iconName: "github",
  //   icon: [
  //     1568,
  //     1568,
  //     [],
  //     "e001",
  //     "M256 1312v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm1536 768v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5zm-1536-1152v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm1536 768v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5z"
  //   ]
  // };

  // library.add(gaActions);

  // dom.watch();
  // console.log("🚀 ~ file: index.js:16 ~ dom:", dom)
  // console.log("🚀 ~ file: index.js:16 ~ library:", library)

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