// window.jsPDF = window.jspdf.jsPDF;
// window.html2canvas = html2canvas;

// const doc = new jsPDF();

// Source HTMLElement or a string containing HTML.

const elementHTML = document.querySelector("#resume");

const fileName = new Date().toLocaleString("en-NZ", {timeZoneName: "short"})
var opt = {
    margin:       0,
    filename:     `resume-${fileName}.pdf`,
    // image:        { type: 'jpg', quality: 1 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'cm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
};
// var element = document.getElementById('element-to-print');
// html2pdf(elementHTML, opt);
html2pdf().set(opt).from(elementHTML).save();

// doc.html(document.body, {
//     callback: function(doc) {
//         // Save the PDF
//         doc.save();
//     },
//     filename: 'TESTING',
//     x: 15,
//     y: 15,
//     width: 170, //target width in the PDF document
//     windowWidth: 650 //window width in CSS pixels
// });

console.log("🚀 ~ file: pdf.js:4 ~ doc:", doc)
