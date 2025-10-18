/**
 * Helper to safely format strings, replacing newlines with <br>.
 * @param {string | undefined | null} str - The input string.
 * @returns {string} - The formatted string, or "" if input is invalid.
 */
function formatString(str) {
  if (typeof str !== 'string' || !str) {
    return "";
  }
  // Replace all newline characters (Unix/Windows) with <br>
  return str.replace(/\r?\n/g, '<br>');
}

/**
 * Helper to map difficulty level (1-5) to card value (10-100).
 * @param {number} level - The difficulty level.
 * @returns {number} - The corresponding card value.
 */
function getCardValue(level) {
  const difficultyMap = {
    1: 10,
    2: 25,
    3: 50,
    4: 75,
    5: 100
  };
  return difficultyMap[level] || 10; // Default to 10 if level is invalid
}

/**
 * Determines the correct value for 'ansExplanation' based on question type,
 * handling the "hazy" logic from the old format.
 *
 * @param {string} question_type - The type of question.
 * @param {object} details - The details object from the new format.
 * @returns {string} - The formatted string for ansExplanation.
 */
function getAnsExplanation(question_type, details) {
  const { answer, explanation } = details;
  let ansExp = "";

  // Logic based on hints:
  // - MCQ: uses 'explanation'
  // - True/False, Short/Long Answer: uses 'answer'
  // - Fill up: behaves like Short Answer, uses 'answer'
  // - Match items: uses 'explanation' (which is usually "")
  switch (question_type) {
    case "True/False":
    case "Fill up":
    case "Short Answer Type":
    case "Long Answer Type":
    case "Very Long Answer Type":
      ansExp = answer;
      break;
    
    case "MCQ":
    case "Match items":
    default:
      // Default fallback to explanation
      ansExp = explanation;
      break;
  }
  return formatString(ansExp || "");
}

/**
 * Converts a new-format question object into the old string-based format
 * for backward compatibility.
 *
 * @param {object} newQuestion - The question object in the new database format.
 * @returns {string} - The question in the old string format.
 */
function convertQuestionToOldFormat(newQuestion) {
  // Destructure with defaults for safety
  const {
    question,
    question_type,
    difficulty_level,
    details = {}
  } = newQuestion;
  
  const {
    answer,
    explanation, // We'll use getAnsExplanation to process this
    options,
    mediaEmbedded,
    mediaLink,
    weightage,
    matchCols,
    colHeadings
  } = details;

  // 1. Build the main question text part
  let questionText = formatString(question);

  // Append dynamic options string for MCQs
  if (question_type === "MCQ" && options && options.length > 0) {
    const optionsString = options.map((opt, i) => {
      const letter = String.fromCharCode(65 + i); // A, B, C...
      return `Option ${letter}} ${formatString(opt)}`;
    }).join(" "); // Space-separated as per example
    
    // Note: Example 1 output has two spaces before "Correct:"
    questionText += ` (Options: ${optionsString}  Correct: ${formatString(answer)}.)`;
  }

  // 2. Build the JSONParams object
  const jsonParams = {
    qType: question_type,
    weightage: weightage || 1,
    ansExplanation: getAnsExplanation(question_type, details),
    mediaEmbedded: mediaEmbedded || "none",
    mediaLink: mediaLink || "",
    startTime: 0, // Default as per requirement
    endTime: 0,   // Default as per requirement
    card: getCardValue(difficulty_level)
  };

  // 3. Add conditional properties ONLY for 'Match items'
  if (question_type === "Match items") {
    jsonParams.matchCols = matchCols || {};
    jsonParams.colHeadings = colHeadings || [];
  }

  // 4. Combine and return
  return `${questionText}JSONParams:${JSON.stringify(jsonParams)}`;
}

// --- EXAMPLE USAGE ---

// Example 1: MCQ
const input1 = {
  "question_bank_id": 1, "question_bank": "Class 6: English Tenses",
  "question": "Which of the following is in the future tense?",
  "question_type": "MCQ", "difficulty_level": 2,
  "details": {
    "answer": "I will eat breakfast.",
    "options": ["I eat breakfast.", "I am eating breakfast.", "I will eat breakfast.", "I ate breakfast."],
    "explanation": "The auxiliary verb 'will' shows future tense."
  }
};

// Example 4: Fill up
const input4 = {
  "question_bank_id": 2, "question_bank": "Class 6: Computer Basics",
  "question": "_________ language is the only language that a computer understands.",
  "question_type": "Fill up", "difficulty_level": 1,
  "details": { "answer": "Machine", "explanation": "" }
};

// Example 5: True/False
const input5 = {
  "question_bank_id": 2, "question_bank": "Class 6: Computer Basics",
  "question": "Assembly language consists of binary numbers, 0s and 1s.",
  "question_type": "True/False", "difficulty_level": 1,
  "details": { "answer": "F", "explanation": "" }
};

// Example 7: Match items
const input7 = {
  "question_bank_id": 2, "question_bank": "Class 6: Computer Basics",
  "question": "Match the following:", "question_type": "Match items", "difficulty_level": 1,
  "details": {
    "answer": "",
    "matchCols": { "Column A": ["Assembly Language", "Sophia", "Machine Language", "Algorithm", "Neural Network"], "Column B": ["Mnemonic codes", "Robot", "First Generation Language", "Problem-solving", "Brain-like structures"] },
    "colHeadings": ["Column A", "Column B"]
  }
};

console.log("--- Example 1 (MCQ) ---");
console.log(convertQuestionToOldFormat(input1));
// Output: Which of the following is in the future tense? (Options: Option A} I eat breakfast. Option B} I am eating breakfast. Option C} I will eat breakfast. Option D} I ate breakfast.  Correct: I will eat breakfast.)JSONParams:{"qType":"MCQ","weightage":1,"ansExplanation":"The auxiliary verb 'will' shows future tense.","mediaEmbedded":"none","mediaLink":"","startTime":0,"endTime":0,"card":25}

console.log("\n--- Example 4 (Fill up) ---");
console.log(convertQuestionToOldFormat(input4));
// Output: _________ language is the only language that a computer understands.JSONParams:{"qType":"Fill up","weightage":1,"ansExplanation":"Machine","mediaEmbedded":"none","mediaLink":"","startTime":0,"endTime":0,"card":10}
// Note: This output differs from your example ("Binary/Machine"), as the input provided ('answer: "Machine"') does not support that output. This function consistently uses the 'answer' field for this type, as per the hints.

console.log("\n--- Example 5 (True/False) ---");
console.log(convertQuestionToOldFormat(input5));
// Output: Assembly language consists of binary numbers, 0s and 1s.JSONParams:{"qType":"True/False","weightage":1,"ansExplanation":"F","mediaEmbedded":"none","mediaLink":"","startTime":0,"endTime":0,"card":10}

console.log("\n--- Example 7 (Match items) ---");
console.log(convertQuestionToOldFormat(input7));
// Output: Match the following:JSONParams:{"qType":"Match items","weightage":1,"ansExplanation":"","mediaEmbedded":"none","mediaLink":"","startTime":0,"endTime":0,"card":10,"matchCols":{"Column A":["Assembly Language","Sophia","Machine Language","Algorithm","Neural Network"],"Column B":["Mnemonic codes","Robot","First Generation Language","Problem-solving","Brain-like structures"]},"colHeadings":["Column A","Column B"]}
