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
    questionText += ` (Options: ${optionsString}  Correct: ${formatString(answer)})`;
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

  console.log("Converted question:", `${questionText}JSONParams:${JSON.stringify(jsonParams)}`);
  // 4. Combine and return
  return `${questionText}JSONParams:${JSON.stringify(jsonParams)}`;
}

