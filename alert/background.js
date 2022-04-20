var isOn = false, textToBeSearched = '';

// Audio URI to prevent loading issues
const audioURI = "https://www.mboxdrive.com/intromusic.mp3";

// Message comes here when user enter the text to lookout for in popup
chrome.runtime.onMessage.addListener(({ keyword }) => {

    // Alerts the user to turn on captions
    chrome.tabs.query({ url: "https://meet.google.com/*" }, (tabs) => {
        chrome.tabs.executeScript(tabs[0].id,
            { code: `alert("Captions must be turned on for this to work")` });
    });
    
    // Sets the variables that command the state of extension (on/off) & the lookout text
    if (textToBeSearched !== keyword && keyword !== '') {
        textToBeSearched = keyword;
        isOn = true;
    } else if (keyword === '') {
        isOn = !isOn
    }

    // To prevent connection to close abruptly
    return true;
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.todo == "activate") {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.pageAction.show(tabs[0].id)
        })
    }
})

chrome.storage.onChanged.addListener(function(result, namespaces){
    if (result.subtitleWarning) {
        if(result.subtitleWarning.newValue){
            var notifOption = {
                type: "basic",
                iconUrl: "round-table.png",
                title: "Caption Off!",
                message: "Please turn on CAPTIONS!!"
            };
            chrome.notifications.create("captionOff", notifOption);
        }  
    }
})


// Function that searches lookout text
const searchText = () => {
    // Check if state = ON
    if (isOn) {

        // Finds the tab that hosts the meeting
        chrome.tabs.query({ url: "https://meet.google.com/*" }, (tabs) => {

            // Executes the script in the found tab
            chrome.tabs.executeScript(tabs[0].id, {
                code: ` var captions = document.querySelectorAll('.CNusmb');    // Retrieves all the captions elements from DOM
                        captions.forEach((caption) => {
                            var words = caption.innerHTML.split(' ');           // Breaks a caption element into words
                            words.forEach(word => {                             // Tests each word for lookout text
                                if ((word === '${textToBeSearched}'  ||
                                    word === '${textToBeSearched},' ||
                                    word === '${textToBeSearched}.' ||
                                    word === '${textToBeSearched}?' ||
                                    word === '${textToBeSearched}!')) {
                                    var audio = document.createElement("audio");            // Creates and audio element
                                    audio.setAttribute("src", '${audioURI}');               // and specify its src
                                    audio.addEventListener("ended", () => {                 // Remove the audio when playing finished
                                        audio.remove();
                                    });
                                    document.getElementsByTagName("body")[0].appendChild(audio);            // Add the audio into DOM
                                    audio.play();           // Play the audio
                                }     
                            });
                        });`
            });
        });
    }
}

// Calls the function to search lookout text in captions every 3secs
setInterval(searchText, 8000);