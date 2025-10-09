// Array to store all words from the JSON files
const wordOfTheDayData = [];

// Elements for random word card
const randomWordThumbnail = document.getElementById('random-word');
const wordCard = document.getElementById('word-card');
const wordText = document.getElementById('word-text');
const meaningText = document.getElementById('meaning-text');
const synonymText = document.getElementById('synonym-text');
const antonymText = document.getElementById('antonym-text');
const sentenceText = document.getElementById('sentence-text');
const pronunciationText = document.getElementById('pronunciation-text');
const newWordButton = document.getElementById('new-word');
const closeWordCardButton = document.getElementById('close-word-card');

// Function to fetch data from all 7 JSON files
async function fetchWords() {
   const jsonFiles = [
      'data1.json', 'data2.json', 'data3.json', 'data4.json',
      'data5.json', 'data6.json', 'data7.json', 'data8.json'
   ];

   const baseURL = 'https://myjvp.in/word-of-the-day/';

   // Fetch all JSON files
   jsonFiles.forEach(file => {
      fetch(`${baseURL}${file}`)
         .then(response => {
            if (!response.ok) {
               throw new Error('Network response was not ok');
            }
            return response.json();
         })
         .then(data => {
            // Push all words into the global wordOfTheDayData array
            wordOfTheDayData.push(...data.words);
         })
         .catch(error => {
            console.error('Error fetching words:', error);
         });
   });
}

// Function to get a random word from the wordOfTheDayData array
function getRandomWord() {
   const randomIndex = Math.floor(Math.random() * wordOfTheDayData.length);
   return wordOfTheDayData[randomIndex];
}


// Show the word card with a random word
window.showRandomWord = function() {
   const randomWord = getRandomWord();

   // Fill the card with the word's details
   wordText.textContent = `Word: ${randomWord.word}`;
   meaningText.textContent = `Meaning: ${randomWord.meaning}`;
   synonymText.textContent = `Synonym: ${randomWord.synonym}`;
   antonymText.textContent = `Antonym: ${randomWord.antonym}`;
   sentenceText.textContent = `Sentence: "${randomWord.sentence}"`;
   pronunciationText.textContent = `Pronunciation: ${randomWord.pronunciation}`;

   // Show the word card
   wordCard.style.display = 'block';
}

// Event listener for new word button
newWordButton.addEventListener('click', window.showRandomWord);

// Event listener to close the word card
closeWordCardButton.addEventListener('click', () => {
   wordCard.style.display = 'none';
});

fetchWords();