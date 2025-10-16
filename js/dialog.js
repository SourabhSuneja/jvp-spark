const loadingPhrases = [
    // Original Phrases
    "Gearing up the magic...",
    "Setting things in motion...",
    "Almost there, hang tight!",
    "Preparing awesomeness...",
    "Fueling up the engine...",
    "Just a moment...",
    "Gathering stardust...",
    "Almost ready to go!",
    "Hold on... we’re working wonders!",
    "Piecing it all together...",
    "Bringing ideas to life...",
    "Igniting creativity...",
    "Sparking creativity...",
    "Waking up the page...",
    "Hold tight, it’s worth the wait!",
    "Charging up the experience...",
    "Loading wonders...",
    "Your experience is brewing...",
    "Optimizing pixels for you...",
    "Painting the digital canvas...",
    "Polishing things up for you...",
    "Stirring imagination soup...",
    "Aligning the stars...",
    "Weaving some digital magic...",
    "Cooking up something fun...",
    "Brewing ideas into reality...",
    "Stretching the possibilities...",
    "Tuning the final notes...",
    "Almost unwrapping the surprise...",
    "Calibrating the doodads...",
    "Assembling the pixels...",
    "Warming up the tubes...",
    "Reticulating splines...",
    "Herding digital cats...",
    "Engaging the flux capacitor...",
    "Buffering the good stuff...",
    "Summoning the data spirits...",
    "Shuffling the digital deck...",
    "Finding the missing semicolon...",
    "Greasing the cogs of the internet...",
    "Teaching the hamsters to run faster...",
    "Connecting the dots... literally.",
    "Deciphering ancient code...",
    "Getting the bits in a row...",
    "Spinning up the hamster wheel...",
    "Navigating the digital cosmos...",
    "Distilling pure awesome...",
    "Preparing for launch...",
    "Sorting the ones and zeros...",
    "Untangling the interwebs...",
    "Charging the content cannons...",
    "Asking the server nicely...",
    "Waking up the gnomes...",
    "Channeling the digital ether...",
    "Combing the data streams...",
    "Checking for digital dust bunnies...",
    "Tuning the content frequency...",
    "Making sure it's pixel-perfect...",
    "Orchestrating the bytes...",
    "Finalizing the awesomeness...",
    "Consulting the digital oracle...",
    "Knitting the code together...",
    "The bits are flowing...",
    "Cranking up the bandwidth...",
    "Building your digital playground...",
    "Unleashing the kraken... of content.",
    "Compiling the fun parts...",
    "Waiting for the digital tide...",
    "Harnessing cosmic rays...",
    "Letting the algorithms marinate...",
    "Polishing the interface...",
    "Please wait, magic is happening...",
    "Booting up the brilliance...",
    "Making things shiny for you...",
    "Just a few more computations...",
    "Fetching your digital destiny...",
    "Our electrons are working hard!",
    "Don't blink or you'll miss it...",
    "Initiating awesome sequence..."
];


// Function to select a random phrase
const getRandomLoadingPhrase = (() => {
    // This array will hold the shuffled phrases we can pick from.
    let shuffledPhrases = [];

    // A helper function to perform the shuffle and fill the "deck".
    const shuffleAndFill = () => {
        // Create a copy to avoid modifying the original array.
        const phrasesCopy = [...loadingPhrases];

        // Shuffle the copy using the Fisher-Yates algorithm.
        for (let i = phrasesCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [phrasesCopy[i], phrasesCopy[j]] = [phrasesCopy[j], phrasesCopy[i]];
        }
        shuffledPhrases = phrasesCopy;
    };

    // Perform the initial shuffle immediately when this code is first run.
    shuffleAndFill();

    // This is the actual function that will be returned and used.
    return () => {
        // If the deck runs out, shuffle it again for the next cycle.
        if (shuffledPhrases.length === 0) {
            shuffleAndFill();
        }
        // Return the last phrase from the shuffled deck and remove it.
        return shuffledPhrases.pop();
    };
})();



    // Attach showDialog function to the global window object
    window.showDialog = function ({ title, message, type }) {
        return new Promise((resolve) => {
            // Access the elements
            const overlay = document.getElementById('dialog-overlay');
            const dialogBox = document.getElementById('dialog-box');
            const dialogHeader = document.getElementById('dialog-header');
            const dialogMessage = document.getElementById('dialog-message');
            const dialogButtons = document.getElementById('dialog-buttons');
            
            // Clear existing buttons and message
            dialogButtons.innerHTML = '';
            dialogMessage.innerHTML = '';

            // remove processing specific classes
            dialogBox.classList.remove('dialog-minimal-padding');

            // Set the content
            dialogHeader.textContent = title;

            if (type === 'confirm') {
                dialogMessage.textContent = message;

                const yesButton = document.createElement('button');
                yesButton.textContent = 'Yes';
                yesButton.classList.add('dialog-button', 'button-yes');
                yesButton.onclick = () => {
                    closeDialog();
                    resolve(true);
                };

                const noButton = document.createElement('button');
                noButton.textContent = 'No';
                noButton.classList.add('dialog-button', 'button-no');
                noButton.onclick = () => {
                    closeDialog();
                    resolve(false);
                };

                dialogButtons.appendChild(yesButton);
                dialogButtons.appendChild(noButton);
            } else if (type === 'alert') {
                dialogMessage.textContent = message;

                const okButton = document.createElement('button');
                okButton.textContent = 'Ok';
                okButton.classList.add('dialog-button', 'button-ok');
                okButton.onclick = () => {
                    closeDialog();
                    resolve(true);
                };

                dialogButtons.appendChild(okButton);
            } else if (type === 'processing') {
                dialogBox.classList.add('dialog-minimal-padding');
                dialogMessage.classList.add('dialog-processing');
                dialogMessage.innerHTML = `<img src="https://sourabhsuneja.github.io/jvp-spark/images/loading.gif" style="height: 30px"> ${getRandomLoadingPhrase()}`;
                if(APP_CONFIG.theme === 'dark') {
                    dialogBox.classList.add('dark');
                } else {
                    dialogBox.classList.remove('dark');
                }
            }

            // Show the dialog
            overlay.classList.add('show');

            // Function to close the dialog
            function closeDialog() {
                overlay.classList.remove('show');
                dialogMessage.classList.remove('dialog-processing');
            }
        });
    };

    // Attach showProcessingDialog and hideProcessingDialog functions to the global window object
    window.showProcessingDialog = function () {
        window.showDialog({ title: '', type: 'processing' });
    };

    window.hideProcessingDialog = function () {
        document.getElementById('dialog-overlay').classList.remove('show');
    };

