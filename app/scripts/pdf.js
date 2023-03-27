window.jsPDF = window.jspdf.jsPDF;

const doc = new jsPDF();

// Source HTMLElement or a string containing HTML.
const elementHTML = document.querySelector("#resume");

doc.html(elementHTML, {
    callback: function(doc) {
        // Save the PDF
        doc.save('./sample-document.pdf');
    },
    x: 15,
    y: 15,
    width: 170, //target width in the PDF document
    windowWidth: 650 //window width in CSS pixels
});

console.log("🚀 ~ file: pdf.js:4 ~ doc:", doc)
