-- QUESTIONS ON ENGLISH ACTIVE AND PASSIVE VOICE CLASS 7

INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade7_english_active_passive_easy',
    'Class 7: Active and Passive Voice (Easy)',
    7,
    'English',
    'Generic',
    'Grammar: Active and Passive Voice',
    'Grammar: Active and Passive Voice'
)
RETURNING id;

INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade7_english_active_passive_moderate',
    'Class 7: Active and Passive Voice (Moderate)',
    7,
    'English',
    'Generic',
    'Grammar: Active and Passive Voice',
    'Grammar: Active and Passive Voice'
)
RETURNING id;


INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade7_english_active_passive_advanced',
    'Class 7: Active and Passive Voice (Advanced)',
    7,
    'English',
    'Generic',
    'Grammar: Active and Passive Voice',
    'Grammar: Active and Passive Voice'
)
RETURNING id;


INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES

-- #################################################
-- ## Set 1: Easy (ID 7, Level 1-2)
-- #################################################

(7, 
'Identify the voice: ''The dog chased the cat.''', 
'MCQ',
1,
'{
  "answer": "Active Voice",
  "options": [
    "Passive Voice",
    "Active Voice",
    "Both",
    "Neither"
  ],
  "explanation": "The sentence is in Active Voice because the subject (''The dog'') performs the action (''chased'')."
}'),

(7, 
'Identify the voice: ''The homework was done by Priya.''', 
'MCQ',
1,
'{
  "answer": "Passive Voice",
  "options": [
    "Active Voice",
    "Passive Voice",
    "Both",
    "Neither"
  ],
  "explanation": "The sentence is in Passive Voice because the subject (''The homework'') receives the action. The doer (''Priya'') is mentioned after ''by''."
}'),

(7, 
'Choose the correct passive form: ''Ravi plays cricket.''', 
'MCQ',
1,
'{
  "answer": "Cricket is played by Ravi.",
  "options": [
    "Cricket was played by Ravi.",
    "Cricket is being played by Ravi.",
    "Cricket has been played by Ravi.",
    "Cricket is played by Ravi."
  ],
  "explanation": "For Simple Present Tense (Active), the Passive form is (Object + is/am/are + V3 + by + Subject)."
}'),

(7, 
'Choose the correct active form: ''A song was sung by her.''', 
'MCQ',
1,
'{
  "answer": "She sang a song.",
  "options": [
    "She sings a song.",
    "She was singing a song.",
    "She sang a song.",
    "She has sung a song."
  ],
  "explanation": "The passive sentence is in Simple Past (was + V3). The active form is (Subject + V2 + Object)."
}'),

(7, 
'Identify the voice: ''The birds are flying in the sky.''', 
'MCQ',
2,
'{
  "answer": "Active Voice",
  "options": [
    "Active Voice",
    "Passive Voice",
    "Cannot be determined",
    "Both"
  ],
  "explanation": "The sentence is in Active Voice. The subject (''The birds'') is performing the action (''are flying'')."
}'),

(7, 
'Choose the correct passive form: ''They will build a house.''', 
'MCQ',
2,
'{
  "answer": "A house will be built by them.",
  "options": [
    "A house is built by them.",
    "A house will be built by them.",
    "A house was built by them.",
    "A house will build them."
  ],
  "explanation": "For Simple Future Tense (Active), the Passive form is (Object + will be + V3 + by + Subject)."
}'),

(7, 
'Choose the correct active form: ''The plants are watered by the gardener.''', 
'MCQ',
2,
'{
  "answer": "The gardener waters the plants.",
  "options": [
    "The gardener watered the plants.",
    "The gardener is watering the plants.",
    "The gardener will water the plants.",
    "The gardener waters the plants."
  ],
  "explanation": "The passive sentence is in Simple Present (are + V3). The active form is (Subject + V1 + Object)."
}'),

(7, 
'Identify the voice: ''The food was cooked.''', 
'MCQ',
2,
'{
  "answer": "Passive Voice",
  "options": [
    "Active Voice",
    "Passive Voice",
    "Imperative",
    "Exclamatory"
  ],
  "explanation": "The sentence is in Passive Voice. The subject (''The food'') receives the action (''was cooked''). The doer is not mentioned."
}'),

(7, 
'Choose the correct passive form: ''She wrote a letter.''', 
'MCQ',
1,
'{
  "answer": "A letter was written by her.",
  "options": [
    "A letter was written by her.",
    "A letter is written by her.",
    "A letter will be written by her.",
    "A letter was being written by her."
  ],
  "explanation": "For Simple Past Tense (Active), the Passive form is (Object + was/were + V3 + by + Subject)."
}'),

(7, 
'Choose the correct active form: ''The mouse was chased by the cat.''', 
'MCQ',
1,
'{
  "answer": "The cat chased the mouse.",
  "options": [
    "The cat chased the mouse.",
    "The cat chases the mouse.",
    "The cat is chasing the mouse.",
    "The cat will chase the mouse."
  ],
  "explanation": "The passive sentence is in Simple Past (was + V3). The active form is (Subject + V2 + Object)."
}');


INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES

-- #################################################
-- ## Set 2: Moderate (ID 8, Level 3-4)
-- #################################################

(8, 
'Choose the correct passive form: ''He is reading a book.''', 
'MCQ',
3,
'{
  "answer": "A book is being read by him.",
  "options": [
    "A book was being read by him.",
    "A book is read by him.",
    "A book is being read by him.",
    "A book has been read by him."
  ],
  "explanation": "For Present Continuous Tense (Active), the Passive form is (Object + is/am/are + being + V3 + by + Subject)."
}'),

(8, 
'Choose the correct active form: ''The match has been won by our team.''', 
'MCQ',
3,
'{
  "answer": "Our team has won the match.",
  "options": [
    "Our team won the match.",
    "Our team has won the match.",
    "Our team had won the match.",
    "Our team will win the match."
  ],
  "explanation": "The passive sentence is in Present Perfect (has been + V3). The active form is (Subject + has/have + V3 + Object)."
}'),

(8, 
'Choose the correct passive form: ''She was writing a novel.''', 
'MCQ',
3,
'{
  "answer": "A novel was being written by her.",
  "options": [
    "A novel is being written by her.",
    "A novel was written by her.",
    "A novel has been written by her.",
    "A novel was being written by her."
  ],
  "explanation": "For Past Continuous Tense (Active), the Passive form is (Object + was/were + being + V3 + by + Subject)."
}'),

(8, 
'Choose the correct active form: ''We will be helped by them.''', 
'MCQ',
3,
'{
  "answer": "They will help us.",
  "options": [
    "They would help us.",
    "They will help us.",
    "They are helping us.",
    "They helped us."
  ],
  "explanation": "The passive sentence is in Simple Future (will be + V3). The active form is (Subject + will + V1 + Object). ''We'' (subject in passive) becomes ''us'' (object in active)."
}'),

(8, 
'Choose the correct passive form: ''The teacher had finished the lesson.''', 
'MCQ',
4,
'{
  "answer": "The lesson had been finished by the teacher.",
  "options": [
    "The lesson had been finished by the teacher.",
    "The lesson was finished by the teacher.",
    "The lesson has been finished by the teacher.",
    "The lesson was being finished by the teacher."
  ],
  "explanation": "For Past Perfect Tense (Active), the Passive form is (Object + had been + V3 + by + Subject)."
}'),

(8, 
'Identify the voice: ''My pocket has been picked.''', 
'MCQ',
3,
'{
  "answer": "Passive Voice",
  "options": [
    "Active Voice",
    "Passive Voice",
    "Both Active and Passive",
    "Neither"
  ],
  "explanation": "The sentence is in Passive Voice (Present Perfect Passive). The subject (''My pocket'') received the action, and the doer (''by someone'') is omitted."
}'),

(8, 
'Choose the correct passive form: ''You must do this work.''', 
'MCQ',
4,
'{
  "answer": "This work must be done by you.",
  "options": [
    "This work must be done by you.",
    "This work must be did by you.",
    "This work should be done by you.",
    "This work is to be done by you."
  ],
  "explanation": "For sentences with modals (like must, can, should), the Passive form is (Object + modal + be + V3 + by + Subject)."
}'),

(8, 
'Choose the correct active form: ''The bridge was being repaired by the workers.''', 
'MCQ',
3,
'{
  "answer": "The workers were repairing the bridge.",
  "options": [
    "The workers were repairing the bridge.",
    "The workers repaired the bridge.",
    "The workers are repairing the bridge.",
    "The workers repair the bridge."
  ],
  "explanation": "The passive sentence is in Past Continuous (was being + V3). The active form is (Subject + was/were + -ing + Object)."
}'),

(8, 
'Choose the correct passive form: ''Someone has stolen my pen.''', 
'MCQ',
4,
'{
  "answer": "My pen has been stolen.",
  "options": [
    "My pen was stolen.",
    "My pen has been stolen by someone.",
    "My pen has been stolen.",
    "My pen had been stolen."
  ],
  "explanation": "The active sentence is in Present Perfect. When the subject is vague (like ''someone'', ''people''), it is often omitted in the passive voice."
}'),

(8, 
'Choose the correct active form: ''This can be solved by him.''', 
'MCQ',
3,
'{
  "answer": "He can solve this.",
  "options": [
    "He can solve this.",
    "He could solve this.",
    "He solves this.",
    "He is solving this."
  ],
  "explanation": "The passive sentence uses a modal (can be + V3). The active form is (Subject + modal + V1 + Object)."
}');


INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES

-- #################################################
-- ## Set 3: Difficult (ID 9, Level 4-5)
-- #################################################

(9, 
'Choose the correct passive form: ''Who taught you French?''', 
'MCQ',
5,
'{
  "answer": "By whom were you taught French?",
  "options": [
    "By whom were you taught French?",
    "Who was French taught by you?",
    "By whom was French taught to you?",
    "French was taught by whom?"
  ],
  "explanation": "This sentence has two objects (you, French). ''Who'' changes to ''By whom''. The passive form is (By whom + was/were + Object1 + V3 + Object2?)."
}'),

(9, 
'Choose the correct passive form: ''Close the door.''', 
'MCQ',
4,
'{
  "answer": "Let the door be closed.",
  "options": [
    "The door must be closed.",
    "You close the door.",
    "The door is closed by you.",
    "Let the door be closed."
  ],
  "explanation": "Imperative sentences (commands/orders) are often changed to passive voice using ''Let + object + be + V3''."
}'),

(9, 
'Choose the correct active form: ''We were advised to start early.''', 
'MCQ',
5,
'{
  "answer": "They/Someone advised us to start early.",
  "options": [
    "They/Someone advised us to start early.",
    "We advised them to start early.",
    "We should start early.",
    "Starting early was advised by us."
  ],
  "explanation": "The passive form omits the agent. We must reintroduce a logical (though vague) subject like ''Someone'' or ''They'' for the active form."
}'),

(9, 
'Choose the correct passive form: ''Did she see the movie?''', 
'MCQ',
4,
'{
  "answer": "Was the movie seen by her?",
  "options": [
    "Did the movie be seen by her?",
    "Was the movie seen by her?",
    "Had the movie been seen by her?",
    "Is the movie seen by her?"
  ],
  "explanation": "For Interrogative (Yes/No) sentences in Simple Past (Did + S + V1), the passive is (Was/Were + Object + V3 + by + Subject?)."
}'),

(9, 
'Choose the correct passive form: ''Why did he scold you?''', 
'MCQ',
5,
'{
  "answer": "Why were you scolded by him?",
  "options": [
    "Why you were scolded by him?",
    "Why did you be scolded by him?",
    "Why were you scolded by him?",
    "Why was you scolded by him?"
  ],
  "explanation": "For Interrogative (WH-) sentences, the WH-word (Why) remains at the start. (Why + was/were + Object + V3 + by + Subject?)."
}'),

(9, 
'Choose the correct active form: ''Let the order be given.''', 
'MCQ',
4,
'{
  "answer": "Give the order.",
  "options": [
    "Give the order.",
    "You should give the order.",
    "The order was given.",
    "Someone gave the order."
  ],
  "explanation": "The passive form ''Let + object + be + V3'' is used for imperative sentences. The active form is the base verb (V1) + object."
}'),

(9, 
'Choose the correct passive form: ''He gave me a pen.''', 
'MCQ',
5,
'{
  "answer": "I was given a pen by him.",
  "options": [
    "A pen was given him by me.",
    "I was given a pen by him.",
    "He was given a pen by me.",
    "I gave a pen to him."
  ],
  "explanation": "This sentence has two objects (me, a pen). Using the indirect object (me) as the subject is common. ''I was given a pen by him.'' is correct. (''A pen was given to me by him'' is also correct, but not an option)."
}'),

(9, 'What is the active form of: ''The thief was caught by the police''?', 
'MCQ',
4,
'{
  "answer": "The police caught the thief.",
  "options": [
    "The police caught the thief.",
    "The police was catching the thief.",
    "The police catches the thief.",
    "The thief caught the police."
  ],
  "explanation": "The passive sentence is in Simple Past (was + V3). The active form is (Subject + V2 + Object)."
}'),

(9, 
'Choose the correct passive form: ''They are going to build a new airport.''', 
'MCQ',
5,
'{
  "answer": "A new airport is going to be built by them.",
  "options": [
    "A new airport is going to be built by them.",
    "A new airport will be built by them.",
    "A new airport is being built by them.",
    "A new airport was going to be built by them."
  ],
  "explanation": "For sentences using ''going to'', the passive form is (Object + is/am/are + going to be + V3 + by + Subject)."
}'),

(9, 
'Choose the correct passive form: ''Please help me.''', 
'MCQ',
4,
'{
  "answer": "You are requested to help me.",
  "options": [
    "Let me be helped.",
    "I should be helped by you.",
    "You must help me.",
    "You are requested to help me."
  ],
  "explanation": "For imperative sentences that are requests (starting with ''Please''), the passive form uses ''You are requested to...''."
}');
