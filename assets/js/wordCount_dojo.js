require(["dojo/dom", "dojo/on", "dojo/domReady!"], function(dom, on){
        console.log("Ran dojo load function");
        on(dom.byId('processBtn'), 'click', processFile);
        on(dom.byId('displayBtn'), 'click', displayFile);
    
    // Simple word counter
    function processFile() {
        var fileToProcess = dom.byId('inputFile').files[0];

        if (fileToProcess === undefined) {
            alert("Select a text file for processing");
            return;
        }
        console.log("Called processFile for " + fileToProcess.name + ", bytes: " + fileToProcess.size);
        countWords(fileToProcess);
    }

    // Count the words in the file
    // TODO: Both this method and the displayFile() method read
    // the entire file. It would be better to read the file once
    // and pass that data around.
    function countWords(inFile) {
        var reader = new FileReader();

        reader.onload = function (theFile) {
            var contents = theFile.target.result;

            var wordCount = 0;
            var uniqueWords = 0;
            var hist = {};
            var words = contents.split(/\s+/);

            for (var i = 0; i < words.length; i++) {
                var strippedWord = words[i].replace(/[.,\-#!$%^*;:{}=_`"()?\[\]]/g, '').toLowerCase();

                if (strippedWord && !strippedWord.match(/\d+/)) {
                    wordCount++;
                    if (hist[strippedWord]) {
                        hist[strippedWord] += 1;
                    }
                    else {
                        hist[strippedWord] = 1;
                        uniqueWords += 1;
                    }
                }
            }

            dom.byId('fileOverview').innerHTML = "<pre>" + wordCount + " words total, " + uniqueWords + " unique words</pre>";
            generateTable(hist);
        }

        reader.readAsText(inFile);
    }

    // Lousy way to generate a table, but it's working...
    function generateTable(hist) {
        dom.byId('fileOutput').innerHTML = '<h2>Word Histogram Table</h2>\
            <table id="wordHistogramTable" class="table table-striped">\
            <tr>\
                <th>Word</th>\
                <th>Number of Occurrences</th>\
            </tr>';

        var html = '';
        for (key in hist) {
            html += "<tr><td>"+key+"</td><td>"+hist[key]+"</td></tr>";
        }
        dom.byId('wordHistogramTable').innerHTML += html + '</table>';
    }

    // Display the contents of the file in the #fileOutput div
    function displayFile() {
        var fileToProcess = dom.byId('inputFile').files[0];

        if (fileToProcess === undefined) {
            alert("Select a text file for processing");
            return;
        }

        var reader = new FileReader();
        reader.onload = function (theFile) {
            var contents = theFile.target.result;
            dom.byId('fileOutput').innerHTML = "<pre>" + contents + "</pre>";
        }
        reader.readAsText(fileToProcess);
    }
}); 