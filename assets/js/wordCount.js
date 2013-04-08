$(document).ready(function () {
    $('#inputFile').change(function (evt) {
        console.log("Selected input file: " + evt.target.files[0].name);
    })

    $('#processBtn').click(processFile);
})



// Simple word counter
function processFile() {
    var fileToProcess = $('#inputFile')[0].files[0];

    if (fileToProcess === undefined) {
        alert("Select a text file for processing");
        return;
    }

    console.log("Called processFile for " + fileToProcess.name + ", bytes: "+fileToProcess.size);

    var reader = new FileReader();
    reader.onload = function(theFile) {
        var contents = theFile.target.result;

        $('#fileOutput').html("<pre>"+contents+"</pre>");
        console.log("Added text done")
    }

    reader.readAsText(fileToProcess)
}