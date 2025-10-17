-- 1️⃣ Create the Question Bank entry
INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade6_english_tenses',
    'Class 6: English Tenses',
    6,
    'English',
    'Grammar Essentials',
    'Tenses',
    'Tenses'
)
RETURNING id;

-- Assume returned id = 1 (replace if needed)
-- 2️⃣ Insert 10 MCQ questions for "Tenses"
INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES
-- Q1 (Simple present tense – easy)
(1, 
'Identify the correct form of the verb: She ___ to school every day.', 
'MCQ',
1,
'{
  "options": ["go", "goes", "going", "gone"],
  "answer": "goes",
  "explanation": "The subject ''she'' requires the verb in simple present tense with an -s ending."
}'),

-- Q2 (Past tense recognition – moderate)
(1, 
'Choose the correct sentence in past tense.', 
'MCQ',
2,
'{
  "options": ["He plays football.", "He played football.", "He is playing football.", "He will play football."],
  "answer": "He played football.",
  "explanation": "The word ''played'' indicates simple past tense."
}'),

-- Q3 (Future tense identification – moderate)
(1,
'Which of the following is in the future tense?', 
'MCQ',
2,
'{
  "options": ["I eat breakfast.", "I am eating breakfast.", "I will eat breakfast.", "I ate breakfast."],
  "answer": "I will eat breakfast.",
  "explanation": "The auxiliary verb ''will'' shows future tense."
}'),

-- Q4 (Past continuous tense – slightly advanced)
(1,
'Fill in the blank: They ___ watching a movie when I arrived.', 
'MCQ',
3,
'{
  "options": ["was", "were", "are", "be"],
  "answer": "were",
  "explanation": "Past continuous tense uses ''were'' with plural subjects."
}'),

-- Q5 (Simple past usage – moderate)
(1,
'Choose the correct form: He ___ his homework before dinner.', 
'MCQ',
2,
'{
  "options": ["has finished", "finished", "finishes", "will finish"],
  "answer": "finished",
  "explanation": "The sentence indicates a completed action in the past."
}'),

-- Q6 (Present perfect continuous – advanced)
(1,
'Identify the tense: She has been studying since morning.', 
'MCQ',
4,
'{
  "options": ["Present Perfect", "Present Perfect Continuous", "Past Continuous", "Future Continuous"],
  "answer": "Present Perfect Continuous",
  "explanation": "The use of ''has been'' + verb-ing indicates Present Perfect Continuous tense."
}'),

-- Q7 (Past perfect tense – advanced)
(1,
'Select the sentence in past perfect tense.', 
'MCQ',
4,
'{
  "options": ["He had finished his work.", "He finishes his work.", "He is finishing his work.", "He has finished his work."],
  "answer": "He had finished his work.",
  "explanation": "Past Perfect tense uses ''had'' + past participle."
}'),

-- Q8 (Future perfect tense – challenging)
(1,
'Fill in the blank: By this time tomorrow, we ___ the exam.', 
'MCQ',
5,
'{
  "options": ["will complete", "completed", "have completed", "will have completed"],
  "answer": "will have completed",
  "explanation": "Future Perfect tense uses ''will have'' + past participle."
}'),

-- Q9 (Universal fact – easy)
(1,
'Choose the correct option: The sun ___ in the east.', 
'MCQ',
1,
'{
  "options": ["rise", "rises", "rose", "will rise"],
  "answer": "rises",
  "explanation": "This is a universal fact, expressed in simple present tense."
}'),

-- Q10 (Present continuous – moderate)
(1,
'Which sentence is in present continuous tense?', 
'MCQ',
2,
'{
  "options": ["He plays the guitar.", "He is playing the guitar.", "He played the guitar.", "He will play the guitar."],
  "answer": "He is playing the guitar.",
  "explanation": "Present Continuous tense uses ''is/am/are'' + verb-ing."
}');



-- Create the Question Bank entry for Verbs
INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade6_english_verbs',
    'Class 6: English Verbs',
    6,
    'English',
    'Grammar Essentials',
    'Verbs',
    'Verbs'
)
RETURNING id;

-- Assume returned id = 2
-- Insert 5 MCQ questions for "Verbs"
INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES
-- Q1
(2,
'Which of the following words is a verb?',
'MCQ',
1,
'{
  "options": ["quickly", "beautiful", "run", "happy"],
  "answer": "run",
  "explanation": "''Run'' is an action word, hence a verb."
}'),

-- Q2
(2,
'Identify the helping verb in this sentence: She is reading a book.',
'MCQ',
2,
'{
  "options": ["She", "is", "reading", "book"],
  "answer": "is",
  "explanation": "''Is'' helps the main verb ''reading'' to form present continuous tense."
}'),

-- Q3
(2,
'Choose the sentence that contains a linking verb.',
'MCQ',
3,
'{
  "options": ["He runs fast.", "She looks tired.", "They played cricket.", "I am eating food."],
  "answer": "She looks tired.",
  "explanation": "''Looks'' connects the subject to the adjective, showing a state rather than an action."
}'),

-- Q4
(2,
'Select the correct form of the verb: He ___ to the gym every morning.',
'MCQ',
1,
'{
  "options": ["go", "goes", "gone", "going"],
  "answer": "goes",
  "explanation": "The subject ''He'' takes the singular verb form ''goes''."
}'),

-- Q5
(2,
'Which sentence contains an irregular verb?',
'MCQ',
4,
'{
  "options": ["He walked home.", "She played the guitar.", "I ate an apple.", "They jumped high."],
  "answer": "I ate an apple.",
  "explanation": "''Ate'' is the past form of ''eat'' and does not follow the regular -ed pattern."
}');



-- Create the Question Bank entry for Determiners
INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade6_english_determiners',
    'Class 6: English Determiners',
    6,
    'English',
    'Grammar Essentials',
    'Determiners',
    'Determiners'
)
RETURNING id;

-- Assume returned id = 3
-- Insert 5 MCQ questions for "Determiners"
INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES
-- Q1
(3,
'Choose the correct determiner: I have ___ apples in my basket.',
'MCQ',
1,
'{
  "options": ["any", "a", "an", "some"],
  "answer": "some",
  "explanation": "''Some'' is used with plural nouns when quantity is not exact."
}'),

-- Q2
(3,
'Select the correct option: ___ book on the table is mine.',
'MCQ',
2,
'{
  "options": ["A", "An", "The", "That"],
  "answer": "The",
  "explanation": "''The'' is a definite article used for specific nouns."
}'),

-- Q3
(3,
'Identify the quantifier in this sentence: Few students attended the meeting.',
'MCQ',
3,
'{
  "options": ["Few", "students", "attended", "meeting"],
  "answer": "Few",
  "explanation": "''Few'' indicates quantity and acts as a quantifier."
}'),

-- Q4
(3,
'Choose the correct word: She doesn’t have ___ money left.',
'MCQ',
2,
'{
  "options": ["some", "any", "many", "each"],
  "answer": "any",
  "explanation": "''Any'' is used in negative sentences and questions."
}'),

-- Q5
(3,
'Which of these sentences uses a demonstrative determiner?',
'MCQ',
3,
'{
  "options": ["She is a teacher.", "That car belongs to me.", "He has many friends.", "I need some help."],
  "answer": "That car belongs to me.",
  "explanation": "''That'' points to a specific noun, hence a demonstrative determiner."
}');



-- Create the Question Bank entry for Prepositions
INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade6_english_prepositions',
    'Class 6: English Prepositions',
    6,
    'English',
    'Grammar Essentials',
    'Prepositions',
    'Prepositions'
)
RETURNING id;

-- Assume returned id = 4
-- Insert 5 MCQ questions for "Prepositions"
INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES
-- Q1
(4,
'Choose the correct preposition: The cat is ___ the table.',
'MCQ',
1,
'{
  "options": ["in", "on", "at", "for"],
  "answer": "on",
  "explanation": "''On'' shows position over a surface."
}'),

-- Q2
(4,
'Fill in the blank: She walked ___ the park.',
'MCQ',
1,
'{
  "options": ["to", "into", "over", "under"],
  "answer": "through",
  "explanation": "''Through'' indicates movement within a space from one end to another."
}'),

-- Q3
(4,
'Which of the following sentences uses a preposition of time?',
'MCQ',
3,
'{
  "options": ["He sat on the chair.", "She came at 5 PM.", "The book is under the table.", "He ran across the road."],
  "answer": "She came at 5 PM.",
  "explanation": "''At'' is a preposition used to indicate a specific time."
}'),

-- Q4
(4,
'Identify the correct sentence.',
'MCQ',
2,
'{
  "options": ["He is good in dancing.", "He is good at dancing.", "He is good for dancing.", "He is good with dancing."],
  "answer": "He is good at dancing.",
  "explanation": "''Good at'' is the correct prepositional phrase."
}'),

-- Q5
(4,
'Choose the correct option: The bird flew ___ the trees.',
'MCQ',
4,
'{
  "options": ["over", "on", "in", "for"],
  "answer": "over",
  "explanation": "''Over'' indicates movement from above or across something."
}');


-- Computer
-- Create the Question Bank entry for Computer Languages
INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade6_computer_languages',
    'Class 6: Computer Languages',
    6,
    'Computer',
    'Introduction to Computers',
    'Computer Languages',
    'Computer Languages'
)
RETURNING id;

-- Assume returned id = 5
-- Insert 5 MCQ questions for "Computer Languages"
INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES
-- Q1
(5,
'Which of the following is a high-level programming language?',
'MCQ',
1,
'{
  "options": ["Python", "Machine Code", "Assembly", "Binary"],
  "answer": "Python",
  "explanation": "Python is a high-level language, easier for humans to read and write."
}'),

-- Q2
(5,
'Which language is primarily used for web page structure?',
'MCQ',
1,
'{
  "options": ["HTML", "C++", "Java", "Python"],
  "answer": "HTML",
  "explanation": "HTML is used to define the structure of web pages."
}'),

-- Q3
(5,
'Identify the low-level language from the options below.',
'MCQ',
2,
'{
  "options": ["Java", "Assembly", "Python", "JavaScript"],
  "answer": "Assembly",
  "explanation": "Assembly language is closer to machine code and considered low-level."
}'),

-- Q4
(5,
'Which language is mainly used to style web pages?',
'MCQ',
1,
'{
  "options": ["CSS", "C", "Python", "SQL"],
  "answer": "CSS",
  "explanation": "CSS (Cascading Style Sheets) is used for styling web pages."
}'),

-- Q5
(5,
'Which of the following languages is interpreted rather than compiled?',
'MCQ',
2,
'{
  "options": ["C++", "Python", "Java", "C"],
  "answer": "Python",
  "explanation": "Python is an interpreted language, meaning it runs line by line."
}');

-- Create the Question Bank entry for More on Excel
INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade6_computer_more_on_excel',
    'Class 6: More on Excel',
    6,
    'Computer',
    'Introduction to Computers',
    'More on Excel',
    'Excel'
)
RETURNING id;

-- Assume returned id = 6
-- Insert 5 MCQ questions for "More on Excel"
INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES
-- Q1
(6,
'Which of the following is used to calculate the sum of a range of cells in Excel?',
'MCQ',
1,
'{
  "options": ["=SUM(A1:A5)", "=TOTAL(A1:A5)", "=ADD(A1:A5)", "=COUNT(A1:A5)"],
  "answer": "=SUM(A1:A5)",
  "explanation": "The SUM function calculates the total of the specified range."
}'),

-- Q2
(6,
'Which feature allows you to automatically fill cells in Excel based on a pattern?',
'MCQ',
2,
'{
  "options": ["AutoFill", "Flash Fill", "Format Painter", "Conditional Formatting"],
  "answer": "AutoFill",
  "explanation": "AutoFill copies a pattern or series to adjacent cells automatically."
}'),

-- Q3
(6,
'Which symbol is used to start a formula in Excel?',
'MCQ',
1,
'{
  "options": ["#", "&", "=", "%"],
  "answer": "=",
  "explanation": "All Excel formulas start with the equal sign (=)."
}'),

-- Q4
(6,
'What does the function =AVERAGE(B1:B10) do?',
'MCQ',
2,
'{
  "options": ["Adds all values in B1:B10", "Finds the largest value in B1:B10", "Calculates the average of values in B1:B10", "Counts the number of cells in B1:B10"],
  "answer": "Calculates the average of values in B1:B10",
  "explanation": "The AVERAGE function computes the mean of the specified cell range."
}'),

-- Q5
(6,
'Which Excel feature highlights cells automatically based on certain rules?',
'MCQ',
3,
'{
  "options": ["Conditional Formatting", "Data Validation", "Pivot Table", "Freeze Panes"],
  "answer": "Conditional Formatting",
  "explanation": "Conditional Formatting applies styles to cells based on set conditions."
}');