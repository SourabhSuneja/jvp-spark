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