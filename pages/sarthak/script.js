// Global chatHistory array to store the chat logs
let chatHistory = [];
const qaPairs = [
  { question: "What is the largest planet in our solar system?", answer: "The largest planet in our solar system is Jupiter." },
  { question: "What is the process by which plants make their own food called?", answer: "The process is called photosynthesis." },
  { question: "Who is known as the 'Father of Computers'?", answer: "Charles Babbage is known as the 'Father of Computers.'" },
  { question: "What is the formula for calculating the area of a rectangle?", answer: "The area of a rectangle is calculated by multiplying its length by its width (Area = length x width)." },
  { question: "How many continents are there on Earth?", answer: "There are seven continents on Earth." },
  { question: "What is the boiling point of water in Celsius?", answer: "The boiling point of water is 100 degrees Celsius." },
  { question: "How can I improve my focus while studying?", answer: "Take short breaks, avoid distractions, and set small goals to stay on track." },
  { question: "What should I do if I feel overwhelmed with homework?", answer: "Prioritize tasks, break them down, and focus on one thing at a time." },
  { question: "How do I manage my time effectively?", answer: "Create a schedule, set priorities, and stick to your plan daily." },
  { question: "What should I do if I don’t understand a topic?", answer: "Don’t hesitate to ask your teacher or classmates, or try using the digital resources provided by Sourabh sir." },
  { question: "Any tips for computer exam preparation?", answer: "Jot down all the 'Quick Knowledge Doses' provided on Sourabh sir's website, take quizzes and solve worksheets." },
  { question: "Who created you?", answer: "I was created by Sourabh sir, a wonderful computer teacher, always trying to make learning fun for his students!" },
  { question: "Describe your creator.", answer: "My creator, Sourabh sir, is a brilliant and passionate computer teacher. He's always dedicated to helping students learn and grow!" }
];

function getRandomQAPair() {
  const randomIndex = Math.floor(Math.random() * qaPairs.length);
  return qaPairs[randomIndex];
}

// Randomly select a QA pair and show it in the chat as  sample conversation
const randomQAPair = getRandomQAPair();
document.getElementById('firstQ').innerText = randomQAPair['question'];
document.getElementById('firstA').innerText = randomQAPair['answer'];

// Toggle Chat Visibility
function toggleChat() {
   document.getElementById('chatContainer').classList.toggle('active');
}

// Send User Message and receive Chatbot Response
async function sendMessage(event) {
   let userInput;
   if (event.key === "Enter" || event.type === "click") {
      userInput = document.getElementById("userInput").value.trim();
      if (userInput) {
         logMessage(userInput, "user");
         document.getElementById("userInput").value = "";

         // Show Typing Animation
         showTypingIndicator();

         let originalResponse, response;
         try {
            // Attempt to fetch response
            originalResponse = await window.fetchResponse(userInput);
            response = formatResponse(originalResponse);
         } catch (error) {
            // Handle error by setting default response
            response = "I couldn't create a response for this. It may go against the terms and conditions of use.";
         } finally {
            // Hide Typing Animation
            hideTypingIndicator();
            
            logMessage(response, 'bot');
            logChatHistory(userInput, "user"); logChatHistory(originalResponse, "model");
            
         }
      }
   }
}

// Log Message Function
function logMessage(message, sender) {
   const messageContainer = document.createElement("div");
   messageContainer.className = `chat-msg ${sender}-msg fade-in`;
   messageContainer.innerHTML = message;
   document.getElementById("chatMessages").appendChild(messageContainer);

   // Scroll to Bottom
   document.getElementById("chatMessages").scrollTop = document.getElementById("chatMessages").scrollHeight;
}

// Typing Indicator
function showTypingIndicator() {
   document.getElementById("typingIndicator").classList.remove("hidden");
}

function hideTypingIndicator() {
   document.getElementById("typingIndicator").classList.add("hidden");
}

function formatResponse(markdown) {
   // Replace line breaks with <br> tags
   let html = markdown.replace(/(?:\r\n|\r|\n)/g, '<br>');

   // Replace **bold** with <strong>bold</strong>
   html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

   // Handle unordered lists (starting with -)
   html = html.replace(/(?:^|\n)([-])\s+(.+)/g, '<li>$2</li>');

   // Replace ordered list markers (*) with right-pointing arrows (→)
   html = html.replace(/(?:^|\n)(\*)\s+(.+)/g, '<li>→ $2</li>');

   // Wrap <li> elements in <ul> tags if any unordered lists are found
   if (html.includes('<li>')) {
      html = html.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
   }

   // Handle ordered lists (starting with numbers followed by a period)
   html = html.replace(/(?:^|\n)(\d+)\.\s+(.+)/g, '<li>$2</li>');

   // Wrap <li> elements in <ol> tags if any ordered lists are found
   if (html.includes('<li>')) {
      html = html.replace(/(<li>.*?<\/li>)/g, '<ol>$1</ol>');
   }

   // Remove trailing <br> tags
   html = html.replace(/(<br\s*\/?>)+$/, '');

   // Replace * after any line breaks with >
   html = html.replace(/<br\s*\/?>\s*\*/g, '<br> >');

   return html;
}

// Function to log (append) messages to chatHistory
function logChatHistory(message, role) {
  // Split the message into words
  const words = message.split(" ");
  
  // Check if the message length exceeds 40 words
  let truncatedMessage = message;
  if (words.length > 40) {
    truncatedMessage = words.slice(0, 20).join(" ") + " ... " + words.slice(-20).join(" ");
  }
  
  // Construct the message object
  const newMessage = {
    role: role,
    parts: [{ text: truncatedMessage }]
  };
  
  // Append the new message object to chatHistory
  chatHistory.push(newMessage);
}
