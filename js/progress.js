
// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {  
    useFileSystem();
}
//file system 
function useFileSystem() {
    var writeFileButton = document.getElementById("writeToFile");
    writeFileButton.addEventListener("click", showPrompt, false);

    var readFileButton = document.getElementById("readFile");
    readFileButton.addEventListener("click", readFile, false);

    var clearFileButton = document.getElementById("emptyList");
    clearFileButton.addEventListener("click", clearFile, false);

    var sumDistance = document.getElementById("totalDistance").value;

    var file = {};

    // attempt to get access to the file system
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
        // onSuccess
        function (fs) {
            fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, 
                // onSuccess
                function (fileEntry) {
                    file = fileEntry; 
                    
                    writeFile(fileEntry, null);
            
                }, 
                // onError
                function (e) {
                    console.log("Failed file write: " + e.toString());
                }
            );
        }, 
        // onError
        function (e) {
            console.log("Failed to access file system: " + e.toString());
        }   
    );

    function showPrompt() {
        navigator.notification.prompt(
            'Enter the distance you ran',   // message
            writeFile,                  // callback to invoke
            'Save!',            // title
            ['Ok'],                     // buttonLabels
            ''                          // defaultText
        );
    }

    function writeFile(results) {
        // Create a FileWriter object for our FileEntry (log.txt).
        file.createWriter(function (fileWriter) {
    
            // this executes when the writer has finished
            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
            };
            
            // this executes is the writer encounters an error
            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };
    
            // attempt to write to the file using fileWriter object
            fileWriter.write(!!results.input1 ? results.input1 : '');
        });
    };

    function readFile() {
       
        file.file(
            // onSuccess (file can be read)
            function (file) {
                var reader = new FileReader();
    
                reader.onloadend = function() {
                    console.log("Successful file read: " + this.result);
                    console.log(file.fullPath + ": " + this.result);
                    
                    if(this.result !== undefined) {
                        document.getElementById("distance").innerHTML += (this.result) + " km" + "<br />";
                        document.getElementById("totalDistance").value = sumDistance + (this.result);
                    }
                };
                
                reader.readAsText(file);
            }, 
            // onError
            function(e) {
                console.log("Failed file read: " + e.toString());
            }
        );
    };

    function clearFile(results) {
        function onSuccess(writer) {
            // this will truncate all the files data back to position 0 (or whatever index specified)
            writer.truncate(0);
        };
        
        var onError = function(evt) {
            console.log(error.code);
        };
        
        file.createWriter(onSuccess, onError);
    };
}
