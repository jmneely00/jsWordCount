require(["dojo/dom",
         "dojo/on",
         "dgrid/OnDemandGrid",
         "dojo/store/Memory",
         "dojo/data/ObjectStore",
         "dojo/domReady!"],
        function(dom, on, OnDemandGrid, Memory){
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

            var wordCount = 0; // TODO: This is just the sum of all word counts in the datastore
            var uniqueWords = 0; // TODO: Can we get this from the datastore?
            var dataStore = new Memory();
            var words = contents.split(/\s+/);

            for (var i = 0; i < words.length; i++) {
                var strippedWord = words[i].replace(/[.,\-#!$%^*;:{}=_`"()?\[\]]/g, '').toLowerCase();

                if (strippedWord && !strippedWord.match(/\d+/)) {
                    wordCount++;
                    
                    var wordObj = dataStore.get(strippedWord);
                    if (wordObj) {
                        wordObj.count += 1;
                        dataStore.put(wordObj);
                    }
                    else {
                        uniqueWords += 1;
                        dataStore.put({id:strippedWord, count:1});
                    }
                }
            }

            dom.byId('fileOverview').innerHTML = "<pre>" + wordCount + " words total, " + uniqueWords + " unique words</pre>";
            generateTable_DGrid(dataStore);
        }

        reader.readAsText(inFile);
    }
    
    // Function to generate/display a table using the new dojo DGrid.
    function generateTable_DGrid(dataStore) {
        dom.byId('fileOutput').innerHTML = '';
        var grid = new OnDemandGrid({
            store: dataStore,
            minRowsPerPage: 50,
            columns: {
                id: "Word",
                count: "Count"
            }
        }, "fileOutput");
        grid.startup();
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