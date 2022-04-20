var lookoutInput = document.getElementById("lookoutText");          // Input field element
const toggler = document.getElementById("toggle");                  // Toggler element
const notes = document.getElementById("notes");   

toggler.addEventListener('click', () => {                           // Event listener for click on toggler
    chrome.runtime.sendMessage({ keyword: lookoutInput.value });    // Send the lookout text to background script in form of message
});

notes.addEventListener('click', () => {                           // Event listener for click on toggler
    window.open("chrome-extension://ehfnobgjdkhbafkinojaimcejlehjnek/popup.html")   // Send the lookout text to background script in form of message
});