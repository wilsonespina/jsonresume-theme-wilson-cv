window.jsPDF = window.jspdf.jsPDF;

const doc = new jsPDF();

// Source HTMLElement or a string containing HTML.
const elementHTML = document.querySelector("#resume");

doc.html(document.body, {
    callback: function(doc) {
        // Save the PDF
        doc.save();
    },
    filename: 'TESTING',
    x: 15,
    y: 15,
    width: 170, //target width in the PDF document
    windowWidth: 650 //window width in CSS pixels
});

console.log("🚀 ~ file: pdf.js:4 ~ doc:", doc)
