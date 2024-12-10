const userModel = require("../../models/user_model.js")

const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const mammoth = require('mammoth');
const JSZip = require('jszip');
const xml2js = require('xml2js');

// [GET] /print
module.exports.home = async (req, res) => {
    const userID = req.user;

    const printerLocation = await userModel.getPrinterLocation();
    console.log(printerLocation);

    const remainingPaper = await userModel.getRemainingPaper(userID);
    res.render("./user/pages/print.pug", {
        remainingPaper: remainingPaper,
        printerLocation: printerLocation
    })
}

// [POST] /print
module.exports.print = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const filename = file.originalname;
    const filepath = file.path;
    let pageCount = 0;

    if (file.mimetype === 'application/pdf') {
        // Extract page count from PDF
        const pdfBytes = fs.readFileSync(filepath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        pageCount = pdfDoc.getPageCount();
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Approximate page count from Word document
        const docText = await mammoth.extractRawText({ path: filepath });
        pageCount = Math.ceil(docText.value.split('\n').length / 24); // Approximation
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        // Extract slide count from PowerPoint
        const zip = await JSZip.loadAsync(fs.readFileSync(filepath));
        const pptXml = await zip.file('ppt/presentation.xml').async('text');
        const parser = new xml2js.Parser();
        const xmlData = await parser.parseStringPromise(pptXml);

        pageCount = xmlData['p:presentation']['p:sldIdLst'][0]['p:sldId'].length; // Slide count
    } else {
        return res.status(400).send('Unsupported file type.');
    }

    // Clean up uploaded file
    fs.unlinkSync(filepath);

    // res.json({ filename, pageCount });
    const userID = req.user;
    const printerID = req.body.printerID
    const paperSize = req.body.paper_size
    const pagesPerPaper = req.body.pages_per_paper
    const doubleSide = req.body.double_sided
    
    console.log("filename: ", filename)
    console.log("userID: '" + userID + "'")
    console.log("printerID: '" + printerID + "'")
    console.log("paperSize: '" + paperSize + "'")
    console.log("pagesPerPaper: ", pagesPerPaper)
    console.log("doubleSide: ", doubleSide)

    let pageNum;
    if (doubleSide) pageNum = Math.ceil(pageCount / (pagesPerPaper * 2))
    else pageNum = Math.ceil(pageCount / pagesPerPaper);

    pageNum = parseInt(pageNum);
    console.log("pageNum: ", pageNum)

    const hasEnoughPaper = await userModel.hasEnoughPaper(userID, paperSize, pageNum);
    if (!hasEnoughPaper) {
        res.redirect("/print");
        return;
    }

    console.log("ok")
    await userModel.updatePrintHistory(userID, printerID, filename, paperSize, pageNum);
    console.log("ok")
    await userModel.updateRemainingPaper(userID, paperSize, pageNum);
    console.log("ok")

    res.redirect("/print")
}