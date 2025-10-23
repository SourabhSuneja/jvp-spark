-- QUESTIONS ON INTEGERS CLASS 6

INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade6_maths_integers_easy',
    'Class 6: Maths Integers (Easy)',
    6,
    'Maths',
    'Generic',
    'Integers',
    'Integers'
)
RETURNING id;

INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade6_maths_integers_moderate',
    'Class 6: Maths Integers (Moderate)',
    6,
    'Maths',
    'Generic',
    'Integers',
    'Integers'
)
RETURNING id;


INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade6_maths_integers_advanced',
    'Class 6: Maths Integers (Advanced)',
    6,
    'Maths',
    'Generic',
    'Integers',
    'Integers'
)
RETURNING id;



INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES

(1, 
'What is the smallest positive integer?', 
'MCQ',
1,
'{
  "answer": "1",
  "options": [
    "0",
    "1",
    "-1",
    "10"
  ],
  "explanation": "Positive integers start from 1. 0 is neither positive nor negative."
}'),

(1, 
'Which of the following is NOT an integer?', 
'MCQ',
1,
'{
  "answer": "1.5",
  "options": [
    "-5",
    "0",
    "1.5",
    "100"
  ],
  "explanation": "Integers are whole numbers (positive, negative, or zero), not fractions or decimals."
}'),

(1, 
'What is the opposite (additive inverse) of -8?', 
'MCQ',
1,
'{
  "answer": "8",
  "options": [
    "8",
    "-8",
    "0",
    "1/8"
  ],
  "explanation": "The additive inverse of a number is the number that, when added to it, results in zero. -8 + 8 = 0."
}'),

(1, 
'Which statement is true?', 
'MCQ',
2,
'{
  "answer": "-8 > -10",
  "options": [
    "-5 > -3",
    "0 < -1",
    "-8 > -10",
    "4 < -4"
  ],
  "explanation": "On a number line, -8 is to the right of -10, making it greater."
}'),

(1, 
'What is the result of (-4) + (-6)?', 
'MCQ',
2,
'{
  "answer": "-10",
  "options": [
    "-10",
    "10",
    "-2",
    "2"
  ],
  "explanation": "When adding two negative integers, add their absolute values and keep the negative sign."
}'),

(1, 
'What is the result of (+7) + (-3)?', 
'MCQ',
2,
'{
  "answer": "4",
  "options": [
    "10",
    "-10",
    "4",
    "-4"
  ],
  "explanation": "When adding integers with different signs, subtract their absolute values (7-3=4) and keep the sign of the larger absolute value (+7)."
}'),

(1, 
'What is the absolute value of -15, written as |-15|?', 
'MCQ',
1,
'{
  "answer": "15",
  "options": [
    "15",
    "-15",
    "0",
    "1.5"
  ],
  "explanation": "Absolute value represents the distance from zero on the number line, which is always non-negative."
}'),

(1, 
'Which integer is 4 steps to the left of 1 on the number line?', 
'MCQ',
2,
'{
  "answer": "-3",
  "options": [
    "5",
    "-3",
    "3",
    "-5"
  ],
  "explanation": "Starting at 1 and moving 4 steps left (subtracting 4) brings you to -3. (1 - 4 = -3)."
}'),

(1, 
'What is the result of (+5) - (-2)?', 
'MCQ',
2,
'{
  "answer": "7",
  "options": [
    "3",
    "7",
    "-3",
    "-7"
  ],
  "explanation": "Subtracting a negative number is the same as adding its positive counterpart. 5 - (-2) = 5 + 2 = 7."
}'),

(1, 
'What is the successor of -1?', 
'MCQ',
2,
'{
  "answer": "0",
  "options": [
    "-2",
    "0",
    "1",
    "-10"
  ],
  "explanation": "The successor is the integer immediately to the right on the number line (-1 + 1 = 0)."
}'),

(2, 
'Calculate: 10 + (-5) - (-3)', 
'MCQ',
3,
'{
  "answer": "8",
  "options": [
    "8",
    "2",
    "12",
    "18"
  ],
  "explanation": "10 - 5 + 3 = 5 + 3 = 8."
}'),

(2, 
'Find the value of: (-7) + (-3) + (5)', 
'MCQ',
3,
'{
  "answer": "-5",
  "options": [
    "-15",
    "-5",
    "5",
    "-10"
  ],
  "explanation": "First, add the negatives: (-7) + (-3) = -10. Then add the positive: -10 + 5 = -5."
}'),

(2, 
'What is the result of (-8) x (-3)?', 
'MCQ',
3,
'{
  "answer": "24",
  "options": [
    "24",
    "-24",
    "11",
    "-11"
  ],
  "explanation": "The product of two negative integers is always positive."
}'),

(2, 
'What is the result of (-10) x (+5)?', 
'MCQ',
3,
'{
  "answer": "-50",
  "options": [
    "50",
    "-50",
    "-5",
    "-15"
  ],
  "explanation": "The product of a negative integer and a positive integer is always negative."
}'),

(2, 
'What is the result of (-20) ÷ (4)?', 
'MCQ',
3,
'{
  "answer": "-5",
  "options": [
    "5",
    "-5",
    "80",
    "-80"
  ],
  "explanation": "When dividing a negative integer by a positive integer, the result is negative."
}'),

(2, 
'Which property of addition is shown: (-5) + 3 = 3 + (-5)?', 
'MCQ',
3,
'{
  "answer": "Commutative Property",
  "options": [
    "Commutative Property",
    "Associative Property",
    "Additive Identity",
    "Distributive Property"
  ],
  "explanation": "The Commutative Property of Addition states that changing the order of addends does not change the sum (a + b = b + a)."
}'),

(2, 
'What is the additive identity for integers?', 
'MCQ',
3,
'{
  "answer": "0",
  "options": [
    "1",
    "-1",
    "0",
    "10"
  ],
  "explanation": "The additive identity is the number (0) that, when added to any integer, results in the integer itself (a + 0 = a)."
}'),

(2, 
'The temperature was -3°C in the morning and rose by 8°C by noon. What is the temperature at noon?', 
'MCQ',
3,
'{
  "answer": "5°C",
  "options": [
    "5°C",
    "-11°C",
    "11°C",
    "-5°C"
  ],
  "explanation": "We calculate -3 + 8 = 5. The new temperature is 5°C."
}'),

(2, 
'A submarine is 50m below sea level (-50m). It descends (goes down) another 20m. What is its new position?', 
'MCQ',
3,
'{
  "answer": "-70m",
  "options": [
    "-30m",
    "-70m",
    "30m",
    "70m"
  ],
  "explanation": "Descending means going further down (more negative). -50 - 20 = -70m."
}'),

(2, 
'What is the predecessor of -99?', 
'MCQ',
3,
'{
  "answer": "-100",
  "options": [
    "-98",
    "-100",
    "98",
    "100"
  ],
  "explanation": "The predecessor is the integer immediately to the left on the number line (-99 - 1 = -100)."
}'),

(3, 
'Calculate: (-5) x (3 + (-1))', 
'MCQ',
4,
'{
  "answer": "-10",
  "options": [
    "-10",
    "10",
    "-20",
    "-16"
  ],
  "explanation": "First, solve the parentheses: (3 + (-1)) = 2. Then multiply: (-5) x 2 = -10."
}'),

(3, 
'Which expression shows 15 x (100 - 3) using the distributive property?', 
'MCQ',
4,
'{
  "answer": "(15 x 100) - (15 x 3)",
  "options": [
    "(15 x 100) - (15 x 3)",
    "(15 + 100) x (15 - 3)",
    "15 x 97",
    "(15 - 100) x 3"
  ],
  "explanation": "The distributive property states a(b - c) = ab - ac."
}'),

(3, 
'What integer must be subtracted from -7 to get -15?', 
'MCQ',
4,
'{
  "answer": "8",
  "options": [
    "8",
    "-8",
    "22",
    "-22"
  ],
  "explanation": "Let the integer be x. The equation is -7 - x = -15. Adding 15 to both sides: -7 + 15 = x. So, x = 8."
}'),

(3, 
'What is the value of (-1) multiplied by itself 10 times (i.e., (-1)^10)?', 
'MCQ',
4,
'{
  "answer": "1",
  "options": [
    "1",
    "-1",
    "10",
    "-10"
  ],
  "explanation": "When -1 is multiplied by itself an even number of times, the result is always 1."
}'),

(3, 
'What is the value of (-1) multiplied by itself 15 times (i.e., (-1)^15)?', 
'MCQ',
4,
'{
  "answer": "-1",
  "options": [
    "1",
    "-1",
    "15",
    "-15"
  ],
  "explanation": "When -1 is multiplied by itself an odd number of times, the result is always -1."
}'),

(3, 
'What is the result of 0 ÷ (-12)?', 
'MCQ',
4,
'{
  "answer": "0",
  "options": [
    "0",
    "-12",
    "12",
    "Undefined"
  ],
  "explanation": "Zero divided by any non-zero integer is always zero."
}'),

(3, 
'What is the result of (-12) ÷ 0?', 
'MCQ',
5,
'{
  "answer": "Undefined",
  "options": [
    "0",
    "-12",
    "12",
    "Undefined"
  ],
  "explanation": "Division by zero is undefined in mathematics."
}'),

(3, 
'In a test, +5 marks are given for every correct answer and -2 marks for every incorrect answer. Ram gets 4 correct and 6 incorrect answers. What is his total score?', 
'MCQ',
5,
'{
  "answer": "8",
  "options": [
    "20",
    "12",
    "8",
    "-12"
  ],
  "explanation": "Score = (4 correct x 5 marks) + (6 incorrect x -2 marks) = 20 + (-12) = 20 - 12 = 8."
}'),

(3, 
'Which of the following expressions has the largest value?', 
'MCQ',
5,
'{
  "answer": "(-5) x (-4)",
  "options": [
    "(-5) x (-4)",
    "(20) ÷ (-1)",
    "(-10) + (-15)",
    "(5) - (20)"
  ],
  "explanation": "Calculating each: (-5)x(-4)=20; (20)÷(-1)=-20; (-10)+(-15)=-25; (5)-(20)=-15. The largest value is 20."
}'),

(3, 
'The sum of two integers is -10. If one of them is 5, what is the other integer?', 
'MCQ',
4,
'{
  "answer": "-15",
  "options": [
    "-5",
    "5",
    "-15",
    "15"
  ],
  "explanation": "Let the other integer be x. 5 + x = -10. Subtract 5 from both sides: x = -10 - 5. So, x = -15."
}'),

(1, 
'What is the additive inverse (opposite) of 12?', 
'Short Answer Type',
1,
'{
  "answer": "The additive inverse of 12 is -12, because 12 + (-12) = 0."
}'),

(1, 
'Find the absolute value of -9.', 
'Short Answer Type',
1,
'{
  "answer": "The absolute value of -9, written as |-9|, is 9. It represents the distance from 0 on the number line."
}'),

(1, 
'Calculate: (-5) + 8', 
'Short Answer Type',
1,
'{
  "answer": "(-5) + 8 = 3. We subtract the absolute values (8 - 5 = 3) and take the sign of the larger number (+8), so the answer is 3."
}'),

(1, 
'Calculate: 10 - 15', 
'Short Answer Type',
2,
'{
  "answer": "10 - 15 = -5. This is the same as 10 + (-15). We subtract the absolute values (15 - 10 = 5) and take the sign of the larger number (-15)."
}'),

(1, 
'Which integer is greater: -15 or -8? Why?', 
'Short Answer Type',
2,
'{
  "answer": "-8 is greater than -15. On the number line, -8 is to the right of -15, and numbers to the right are always greater."
}'),

(1, 
'What is the successor of -4?', 
'Short Answer Type',
2,
'{
  "answer": "The successor of -4 is -3. The successor is the number immediately to the right on the number line (-4 + 1 = -3)."
}'),

(1, 
'What is the predecessor of -7?', 
'Short Answer Type',
2,
'{
  "answer": "The predecessor of -7 is -8. The predecessor is the number immediately to the left on the number line (-7 - 1 = -8)."
}'),

(1, 
'If you are at 2 on the number line and move 5 steps to the left, where will you be?', 
'Short Answer Type',
2,
'{
  "answer": "You will be at -3. Moving 5 steps left from 2 means 2 - 5 = -3."
}'),

(1, 
'Find the product: (-6) x 3', 
'Short Answer Type',
2,
'{
  "answer": "(-6) x 3 = -18. The product of a negative integer and a positive integer is always negative."
}'),

(1, 
'Find the quotient: 14 ÷ (-2)', 
'Short Answer Type',
2,
'{
  "answer": "14 ÷ (-2) = -7. When a positive integer is divided by a negative integer, the quotient is always negative."
}'),

(2, 
'Find the sum: (-8) + (-3) + 5', 
'Short Answer Type',
3,
'{
  "answer": "First, add the negative numbers: (-8) + (-3) = -11. Then, add the result to 5: -11 + 5 = -6. The final answer is -6."
}'),

(2, 
'Calculate: 15 - (-5)', 
'Short Answer Type',
3,
'{
  "answer": "15 - (-5) is the same as 15 + 5, which equals 20. Subtracting a negative is the same as adding its positive."
}'),

(2, 
'Find the product: (-10) x (-4)', 
'Short Answer Type',
3,
'{
  "answer": "(-10) x (-4) = 40. The product of two negative integers is always positive."
}'),

(2, 
'Find the quotient: (-36) ÷ (-9)', 
'Short Answer Type',
3,
'{
  "answer": "(-36) ÷ (-9) = 4. When a negative integer is divided by another negative integer, the quotient is always positive."
}'),

(2, 
'The temperature in Shimla was -4°C at night. By morning, it rose by 6°C. What was the morning temperature?', 
'Short Answer Type',
3,
'{
  "answer": "The morning temperature was 2°C. We start at -4°C and add 6°C: -4 + 6 = 2."
}'),

(2, 
'An elevator is on the ground floor. It goes 5 floors down and then 8 floors up. What floor is the elevator on now?', 
'Short Answer Type',
3,
'{
  "answer": "The elevator is on the 3rd floor. Going 5 floors down is -5. Going 8 floors up is +8. The calculation is -5 + 8 = 3."
}'),

(2, 
'Name the property shown by the equation: (-6) + 0 = -6', 
'Short Answer Type',
3,
'{
  "answer": "This shows the Additive Identity property. Adding 0 (the additive identity) to any integer does not change its value."
}'),

(2, 
'Fill in the blank using <, >, or = :  (-3) + (-6) ___ (-3) - (-6)', 
'Short Answer Type',
3,
'{
  "answer": "<. The left side is (-3) + (-6) = -9. The right side is (-3) - (-6) = -3 + 6 = 3. Since -9 is less than 3, the answer is <."
}'),

(2, 
'What integer should be added to 15 to get -5?', 
'Short Answer Type',
3,
'{
  "answer": "-20. Let the integer be x. The equation is 15 + x = -5. To find x, subtract 15 from both sides: x = -5 - 15 = -20."
}'),

(2, 
'Find the value of: 50 - 30 + (-10)', 
'Short Answer Type',
3,
'{
  "answer": "10. First, 50 - 30 = 20. Then, 20 + (-10) = 20 - 10 = 10."
}'),

(3, 
'Use the distributive property to solve: (-8) x (10 + 3)', 
'Short Answer Type',
4,
'{
  "answer": "Using the distributive property:\n(-8) x (10 + 3)\n= (-8 x 10) + (-8 x 3)\n= (-80) + (-24)\n= -104."
}'),

(3, 
'The sum of two integers is 20. If one of them is -8, find the other integer.', 
'Short Answer Type',
4,
'{
  "answer": "Let the other integer be x.\nWe have -8 + x = 20.\nTo find x, add 8 to both sides:\nx = 20 + 8 = 28.\n\nTherefore, the other integer is 28."
}'),

(3, 
'Subtract the sum of -12 and 5 from 10.', 
'Short Answer Type',
4,
'{
  "answer": "Step 1: Find the sum: -12 + 5 = -7.\nStep 2: Subtract this sum from 10:\n10 - (-7) = 10 + 7 = 17.\n\nAnswer: 17."
}'),

(3, 
'What is the sign of the product if we multiply 8 negative integers and 3 positive integers?', 
'Short Answer Type',
4,
'{
  "answer": "The product of 8 negative integers (even number) is positive.\nThe product of 3 positive integers is positive.\nA positive × positive = positive.\n\nTherefore, the sign is Positive."
}'),

(3, 
'Find the value of: 12 - [ 5 + { 3 - (1 - 2) } ]', 
'Short Answer Type',
5,
'{
  "answer": "Work from the innermost bracket:\n(1 - 2) = -1\n\nNext bracket:\n{ 3 - (-1) } = { 3 + 1 } = 4\n\nNext bracket:\n[ 5 + 4 ] = 9\n\nFinal calculation:\n12 - 9 = 3\n\nAnswer: 3."
}'),

(3, 
'A submarine is 200 m below sea level. It descends (goes down) another 150 m and then rises 100 m. Find its final position.', 
'Short Answer Type',
5,
'{
  "answer": "Initial = -200 m.\nDescend = -150 m → -200 + (-150) = -350.\nRise = +100 → -350 + 100 = -250.\nSo, the submarine is now 250 meters below sea level."
}'),

(3, 
'A shopkeeper earns a profit of ₹1 on selling one pen and suffers a loss of 30 paise (₹0.30) on selling one pencil. If he sold 50 pens and 100 pencils in a day, what was his net profit or loss?', 
'Short Answer Type',
5,
'{
  "answer": "Profit from pens = 50 × ₹1 = ₹50\nLoss from pencils = 100 × ₹0.30 = ₹30\n\nNet profit/loss = ₹50 - ₹30 = ₹20\n\nSince the result is positive, he made a net profit of ₹20."
}'),

(3, 
'If a = -3, b = 2, and c = -1, find the value of a x (b - c).', 
'Short Answer Type',
4,
'{
  "answer": "Given a = -3, b = 2, c = -1\n\nStep 1: (b - c) = 2 - (-1) = 3\nStep 2: a × (b - c) = (-3) × 3 = -9\n\nAnswer: -9."
}'),

(3, 
'Verify the associative property for multiplication [ (a x b) x c = a x (b x c) ] using a = -2, b = 3, c = -4.', 
'Short Answer Type',
5,
'{
  "answer": "LHS = (a × b) × c = ((-2) × 3) × (-4) = (-6) × (-4) = 24\nRHS = a × (b × c) = (-2) × (3 × (-4)) = (-2) × (-12) = 24\n\nSince LHS = RHS (24 = 24), the associative property is verified."
}'),

(3, 
'What is (-100) ÷ (-10) + 5?', 
'Short Answer Type',
4,
'{
  "answer": "Step 1: Divide first (BODMAS rule):\n(-100) ÷ (-10) = 10\n\nStep 2: Add 5:\n10 + 5 = 15\n\nAnswer: 15."
}'),

(1, 
'Ravi had ₹50. He spent ₹20 on a book. Represent the remaining money as an integer change from his starting amount.', 
'Short Answer Type',
1,
'{
  "answer": "Ravi spent ₹20, so his amount decreased by 20.\nChange = 50 - 20 = +30.\nRepresented as an integer, the change is -20 (a loss of ₹20)."
}'),

(1, 
'The temperature in Delhi was 5°C in the morning. By night it dropped by 8°C. What was the temperature at night?', 
'Short Answer Type',
1,
'{
  "answer": "Morning temperature = +5°C.\nDrop = -8°C.\nFinal temperature = 5 + (-8) = -3°C.\nSo, the night temperature was -3°C."
}'),

(1, 
'A mountaineer climbs up 1200 meters from the base camp and then descends 500 meters. What is his current height relative to the base camp?', 
'Short Answer Type',
1,
'{
  "answer": "Up = +1200 m, Down = -500 m.\nNet height = 1200 + (-500) = 700.\nSo, he is 700 meters above the base camp."
}'),

(1, 
'During a quiz, a correct answer gives +5 points and a wrong answer gives -2 points. Riya got 4 correct and 2 wrong answers. What is her total score?', 
'Short Answer Type',
1,
'{
  "answer": "Correct: 4 × +5 = +20\nWrong: 2 × -2 = -4\nTotal score = 20 + (-4) = 16.\nRiya scored 16 points."
}'),

(2, 
'A monkey climbs up 3 meters every minute but slips down 2 meters. What will be its position after 5 minutes?', 
'Short Answer Type',
1,
'{
  "answer": "Net gain per minute = 3 - 2 = 1 meter.\nIn 5 minutes: 5 × 1 = 5 meters.\nSo, the monkey will be 5 meters high after 5 minutes."
}'),

(1, 
'A diver dives 25 meters below the water surface and then moves up 10 meters. How far is he from the surface now?', 
'Short Answer Type',
1,
'{
  "answer": "Start: -25 m, Move up: +10 m.\nFinal position = -25 + 10 = -15.\nThe diver is 15 meters below the surface."
}'),

(1, 
'The temperature at 6 a.m. was -4°C. It increased by 6°C by noon. What was the temperature at noon?', 
'Short Answer Type',
1,
'{
  "answer": "Initial = -4°C, Change = +6°C.\nFinal = -4 + 6 = +2°C.\nSo, the noon temperature was 2°C."
}'),

(1, 
'An elevator goes down 8 floors from the 10th floor. Which floor does it reach?', 
'Short Answer Type',
1,
'{
  "answer": "Start = 10th floor.\nDown 8 floors = 10 - 8 = 2.\nSo, the elevator reaches the 2nd floor."
}'),

(1, 
'A football team gained 6 points in the first match and lost 4 points in the second match. What is their total change in points?', 
'Short Answer Type',
1,
'{
  "answer": "Gain = +6, Loss = -4.\nTotal change = 6 + (-4) = 2.\nSo, their points increased by 2 overall."
}'),

(1, 
'A shopkeeper had a profit of ₹200 on Monday and a loss of ₹150 on Tuesday. On Wednesday, he had a profit of ₹100. Represent each day''s transaction as an integer and find his net profit or loss over the three days. Explain your steps.', 
'Long Answer Type',
1,
'{
  "answer": "We represent profit with a positive integer and loss with a negative integer.\n1. Monday''s transaction = +₹200\n2. Tuesday''s transaction = -₹150\n3. Wednesday''s transaction = +₹100\n\nTo find the net profit or loss, we add all the integers:\nNet = (+200) + (-150) + (+100)\nNet = (200 - 150) + 100\nNet = 50 + 100\nNet = 150\nSince the result is positive (+150), the shopkeeper had a net profit of ₹150 over the three days."
}'),

(1, 
'Using a number line, show the operation (-3) + 7. Explain the steps you took to arrive at the answer.', 
'Long Answer Type',
1,
'{
  "answer": "To find (-3) + 7 on a number line:\n1. Draw a number line and mark the center as 0.\n2. First, represent -3. Start at 0 and move 3 units to the left. You will land on -3.\n3. From this position (-3), we need to add +7. This means we move 7 units to the right.\n4. Counting 7 units to the right from -3, we pass -2, -1, 0, 1, 2, 3, and land on 4.\n5. Therefore, the final position is 4.\nSo, (-3) + 7 = 4."
}'),

(1, 
'What is the additive inverse (opposite) of -15? Find the sum of -15 and its additive inverse. Explain the concept of additive inverse.', 
'Long Answer Type',
1,
'{
  "answer": "1. Concept: The additive inverse of a number is the number that, when added to the original number, results in a sum of zero (0).\n2. Additive Inverse of -15: The number that must be added to -15 to get 0 is +15. So, the additive inverse of -15 is 15.\n3. Sum: We need to find the sum of the number (-15) and its additive inverse (+15).\n   Sum = (-15) + (+15)\n   Sum = -15 + 15\n   Sum = 0\nThis confirms that 15 is the correct additive inverse for -15."
}'),

(1, 
'Arrange the following integers in ascending order: -8, 5, 0, -12, 2, -1. Explain your reasoning using the concept of a number line.', 
'Long Answer Type',
2,
'{
  "answer": "Ascending order means arranging numbers from the smallest to the largest.\n\nReasoning using a number line:\nOn a number line, integers increase in value as we move from left to right. Therefore, the number furthest to the left is the smallest, and the number furthest to the right is the largest.\n\n1. Plotting these numbers: -12 would be the furthest to the left.\n2. Next, moving right, we would find -8.\n3. Next would be -1.\n4. Then comes 0 (the origin).\n5. Then comes the positive integer 2.\n6. Finally, the furthest to the right is 5.\n\nSo, the ascending order is: -12, -8, -1, 0, 2, 5."
}'),

(1, 
'The temperature in Manali was -4°C in the morning. By noon, it rose by 10°C. What was the temperature at noon? Represent this situation as an integer addition and solve it.', 
'Long Answer Type',
1,
'{
  "answer": "1. Initial Temperature: The temperature in the morning was -4°C. We represent this as the integer -4.\n2. Change in Temperature: The temperature *rose* by 10°C. A rise is represented by a positive integer, so the change is +10.\n3. Integer Addition: To find the temperature at noon, we add the change to the initial temperature.\n   Noon Temperature = (Initial Temperature) + (Change)\n   Noon Temperature = (-4) + (+10)\n4. Solving:\n   (-4) + 10 = 10 - 4 = 6\n\nTherefore, the temperature at noon was 6°C."
}'),

(1, 
'Subtract 8 from 3. Show the calculation and explain how subtracting a positive integer is the same as adding its negative (additive inverse).', 
'Long Answer Type',
2,
'{
  "answer": "We need to calculate: 3 - 8.\n\nCalculation:\nOn a number line, we would start at +3 and move 8 units to the left (in the negative direction). This would land us on -5.\nSo, 3 - 8 = -5.\n\nExplanation:\nThe rule for subtraction is: `a - b = a + (-b)`.\nThis means subtracting a positive integer (b) is the same as adding its additive inverse (-b).\nIn our case, a = 3 and b = 8.\nSo, `3 - 8` is the same as `3 + (-8)`.\n`3 + (-8) = -5`.\nBoth methods give the same result."
}'),

(1, 
'Use a number line to find the value of 5 - (-2). Explain the steps clearly.', 
'Long Answer Type',
2,
'{
  "answer": "The expression is 5 - (-2).\n\nConcept: Subtracting a negative integer is the same as adding its positive (additive inverse). So, `5 - (-2)` is equivalent to `5 + 2`.\n\nSteps on a number line:\n1. Draw a number line and start at the origin (0).\n2. First, represent the number 5. Move 5 units to the right from 0. You are now at +5.\n3. Next, we need to subtract -2. This means we do the *opposite* of subtracting 2. Instead of moving left, we move 2 units to the right (or, we add +2).\n4. From +5, move 2 more units to the right. You will land on +7.\n\nTherefore, 5 - (-2) = 7."
}'),

(1, 
'An airplane is flying at a height of 5000 m above sea level. A submarine is floating 700 m below sea level. What is the vertical distance between them? Explain your calculation.', 
'Long Answer Type',
2,
'{
  "answer": "1. Representing Positions: We can represent positions relative to sea level (0 m) using integers.\n   - Position of the airplane (above sea level) = +5000 m.\n   - Position of the submarine (below sea level) = -700 m.\n\n2. Finding the Distance: The vertical distance between them is the difference between the highest position and the lowest position.\n   Distance = (Position of Airplane) - (Position of Submarine)\n   Distance = (+5000) - (-700)\n\n3. Calculation:\n   Subtracting a negative is the same as adding its positive:\n   Distance = 5000 + 700\n   Distance = 5700 m.\n\nAlternatively, the distance from the plane to sea level is 5000 m. The distance from sea level to the submarine is 700 m. The total distance is the sum of these two distances: 5000 m + 700 m = 5700 m.\n\nThe vertical distance between them is 5700 meters."
}'),

(1, 
'Find the successor of -50 and the predecessor of -20. Explain what successor and predecessor mean for integers.', 
'Long Answer Type',
1,
'{
  "answer": "Successor:\nThe successor of an integer is the integer that comes *just after* it. We find it by adding 1.\n- Successor of -50 = (-50) + 1 = -49.\n(On a number line, -49 is one step to the right of -50).\n\nPredecessor:\nThe predecessor of an integer is the integer that comes *just before* it. We find it by subtracting 1.\n- Predecessor of -20 = (-20) - 1 = -21.\n(On a number line, -21 is one step to the left of -20)."
}'),

(1, 
'Find the sum: (-10) + (+5) + (-3). Explain the steps you took to simplify this.', 
'Long Answer Type',
2,
'{
  "answer": "We need to find the sum: (-10) + 5 + (-3).\nWe can solve this step-by-step from left to right.\n\nStep 1: Add the first two integers: (-10) + 5.\n   - This means we start at -10 on the number line and move 5 units to the right.\n   - We land on -5.\n   - So, `(-10) + 5 = -5`.\n\nStep 2: Take the result from Step 1 and add the third integer: (-5) + (-3).\n   - This means we start at -5 and add -3, which means moving 3 units to the left.\n   - We land on -8.\n   - So, `(-5) + (-3) = -8`.\n\nFinal Answer: The sum is -8."
}'),

(2, 
'Simplify the expression: 50 - (-40) - (-2) + 10. Explain each step of removing the brackets.', 
'Long Answer Type',
3,
'{
  "answer": "The expression is: 50 - (-40) - (-2) + 10\n\nWe simplify this by applying the rule that subtracting a negative integer is the same as adding its positive.\n\nStep 1: Address ` - (-40)`.\n   - ` - (-40)` becomes `+ 40`.\n   - The expression is now: `50 + 40 - (-2) + 10`\n\nStep 2: Address ` - (-2)`.\n   - ` - (-2)` becomes `+ 2`.\n   - The expression is now: `50 + 40 + 2 + 10`\n\nStep 3: Add all the positive integers together.\n   - `50 + 40 = 90`\n   - `90 + 2 = 92`\n   - `92 + 10 = 102`\n\nFinal Answer: The simplified value is 102."
}'),

(2, 
'Fill in the blanks with <, >, or = and justify your answer for each:\n(a) (-3) + (-6) ___ (-3) - (-6)\n(b) (-21) - (10) ___ (-31) + (-11)', 
'Long Answer Type',
3,
'{
  "answer": "Part (a): (-3) + (-6) ___ (-3) - (-6)\n1. LHS (Left Hand Side): `(-3) + (-6) = -3 - 6 = -9`.\n2. RHS (Right Hand Side): `(-3) - (-6) = -3 + 6 = 3`.\n3. Comparison: We are comparing -9 and 3. On a number line, -9 is to the left of 3. Therefore, -9 is smaller than 3.\n4. Answer: `(-3) + (-6) < (-3) - (-6)`\n\nPart (b): (-21) - (10) ___ (-31) + (-11)\n1. LHS: `(-21) - 10 = -21 - 10 = -31`.\n2. RHS: `(-31) + (-11) = -31 - 11 = -42`.\n3. Comparison: We are comparing -31 and -42. On a number line, -31 is to the right of -42. Therefore, -31 is greater than -42.\n4. Answer: `(-21) - (10) > (-31) + (-11)`"
}'),

(2, 
'An elevator descends into a mine shaft at a rate of 5 meters per minute. What will be its position after 40 minutes if it starts from 10 m above ground level? Explain your calculation.', 
'Long Answer Type',
3,
'{
  "answer": "1. Representing Rate: The elevator *descends*, so its rate is a negative integer: -5 meters per minute.\n2. Representing Starting Position: It starts *above* ground level, so its starting position is a positive integer: +10 meters.\n3. Calculating Total Descent: The elevator travels for 40 minutes.\n   - Total distance moved = Rate × Time\n   - Total distance = (-5 meters/min) × (40 min)\n   - Total distance = -200 meters.\n   - This means the elevator moved 200 meters down from its starting point.\n4. Finding Final Position:\n   - Final Position = (Starting Position) + (Total Distance Moved)\n   - Final Position = (+10) + (-200)\n   - Final Position = 10 - 200\n   - Final Position = -190 meters.\n\nConclusion: After 40 minutes, the elevator will be at -190 m, which is 190 meters below ground level."
}'),

(2, 
'The sum of two integers is -15. If one of them is 9, find the other integer. Explain your method.', 
'Long Answer Type',
3,
'{
  "answer": "Let the two integers be A and B.\n\nGiven:\n1. Sum of the integers: A + B = -15\n2. One integer (let''s say A): A = 9\n\nTo Find: The other integer (B).\n\nMethod:\nWe can substitute the known value of A into the equation:\n`9 + B = -15`\n\nTo find B, we need to isolate it. We can do this by subtracting 9 from both sides of the equation:\n`B = -15 - 9`\n\nNow, we calculate the value of B:\n`B = -15 + (-9)`\n`B = -24`\n\nAnswer: The other integer is -24.\n\nCheck:\nLet''s add the two integers to see if their sum is -15:\n`A + B = 9 + (-24) = 9 - 24 = -15`.\nThe sum is correct."
}'),

(2, 
'Using the associative property of addition, show that [(-5) + (-2)] + 3 is equal to (-5) + [(-2) + 3]. Solve both sides to verify.', 
'Long Answer Type',
3,
'{
  "answer": "The associative property of addition states that the way we group numbers in an addition sum does not change the result. The rule is: `(a + b) + c = a + (b + c)`.\n\nWe need to verify this for a = -5, b = -2, and c = 3.\n\nLHS (Left Hand Side): [( -5) + (-2)] + 3\n1. First, solve the brackets: `(-5) + (-2) = -5 - 2 = -7`.\n2. Now, add the third number: `(-7) + 3 = -4`.\n   So, LHS = -4.\n\nRHS (Right Hand Side): (-5) + [(-2) + 3]\n1. First, solve the brackets: `(-2) + 3 = 1`.\n2. Now, add the first number: `(-5) + (1) = -4`.\n   So, RHS = -4.\n\nVerification:\nSince the LHS (-4) is equal to the RHS (-4), we have verified that `[(-5) + (-2)] + 3 = (-5) + [(-2) + 3]`."
}'),

(2, 
'Mohit has ₹2000 in his bank account. He deposits ₹500 on Monday. He withdraws ₹1200 on Tuesday. He deposits ₹300 on Wednesday. What is his final balance? Show the transactions as integers.', 
'Long Answer Type',
3,
'{
  "answer": "We represent deposits as positive integers and withdrawals as negative integers.\n\n1. Initial Balance: +2000\n2. Monday Transaction (Deposit): +500\n3. Tuesday Transaction (Withdrawal): -1200\n4. Wednesday Transaction (Deposit): +300\n\nTo find the final balance, we add all the transactions to the initial balance:\nFinal Balance = (Initial Balance) + (Mon) + (Tue) + (Wed)\nFinal Balance = `2000 + (+500) + (-1200) + (+300)`\nFinal Balance = `2000 + 500 - 1200 + 300`\n\nLet''s group the positive and negative numbers:\nFinal Balance = `(2000 + 500 + 300) - 1200`\nFinal Balance = `(2800) - 1200`\nFinal Balance = `1600`\n\nHis final balance is ₹1600."
}'),

(2, 
'Subtract the sum of -1032 and 878 from -34. Explain your steps.', 
'Long Answer Type',
3,
'{
  "answer": "This is a two-step problem.\n\nStep 1: Find the sum of -1032 and 878.\nSum = `(-1032) + 878`\nSince the signs are different, we find the difference and keep the sign of the larger number.\n`1032 - 878 = 154`\nThe larger number (1032) is negative, so the sum is -154.\nSum = -154.\n\nStep 2: Subtract this sum (-154) from -34.\nThe expression is: `(-34) - (Sum)`\n`= (-34) - (-154)`\n\nSubtracting a negative is the same as adding its positive:\n`= -34 + 154`\n\nAgain, the signs are different. We find the difference and keep the sign of the larger number.\n`154 - 34 = 120`\nThe larger number (154) is positive, so the result is +120.\n\nFinal Answer: The final answer is 120."
}'),

(2, 
'A person starts at point 0 on a number line. He moves 6 steps to the right, then 10 steps to the left, then 3 steps to the right, and finally 5 steps to the left. Where does he end up? Show the entire journey as an integer expression.', 
'Long Answer Type',
3,
'{
  "answer": "We represent moves to the right as positive integers and moves to the left as negative integers.\n\n1. Starts at 0.\n2. Moves 6 steps right: +6\n3. Moves 10 steps left: -10\n4. Moves 3 steps right: +3\n5. Moves 5 steps left: -5\n\nInteger Expression:\nHis final position is the sum of all these moves:\nFinal Position = `0 + (+6) + (-10) + (+3) + (-5)`\nFinal Position = `6 - 10 + 3 - 5`\n\nCalculation:\nMethod 1 (Left to Right):\n`6 - 10 = -4`\n`-4 + 3 = -1`\n`-1 - 5 = -6`\n\nMethod 2 (Grouping):\nGroup positives: `(6 + 3) = 9`\nGroup negatives: `(-10 - 5) = -15`\nFinal Position = `9 + (-15) = 9 - 15 = -6`\n\nAnswer: He ends up at the integer -6 on the number line."
}'),

(2, 
'Show that (-8) + (-5) is equal to (-5) + (-8). Which property of addition is this? Explain its significance.', 
'Long Answer Type',
3,
'{
  "answer": "We need to check if the two expressions are equal.\n\nLHS (Left Hand Side): (-8) + (-5)\n`= -8 - 5`\n`= -13`\n\nRHS (Right Hand Side): (-5) + (-8)\n`= -5 - 8`\n`= -13`\n\nConclusion:\nSince LHS = -13 and RHS = -13, we have shown that `(-8) + (-5) = (-5) + (-8)`.\n\nProperty:\nThis is the Commutative Property of Addition.\n\nSignificance:\nThis property is significant because it states that the order in which you add two integers does not change the final sum. This allows us to reorder numbers in a long sum to make calculations easier (e.g., grouping all positive numbers and all negative numbers)."
}'),

(2, 
'Reena saves ₹5 every day, but she borrows ₹2 for a snack daily. Represent her daily saving and borrowing as integers. What is her total net savings after 10 days? Explain.', 
'Long Answer Type',
3,
'{
  "answer": "1. Representing Daily Transactions:\n   - Daily Saving = +₹5\n   - Daily Borrowing (spending) = -₹2\n\n2. Calculating Net Daily Savings:\n   To find her net saving for one day, we add the integers:\n   Net Daily Saving = `(+5) + (-2)`\n   `= 5 - 2`\n   `= +3`\n   This means Reena has a net saving of ₹3 every day.\n\n3. Calculating Total Savings after 10 Days:\n   To find the total savings after 10 days, we multiply her net daily saving by the number of days.\n   Total Savings = (Net Daily Saving) × (Number of Days)\n   Total Savings = `3 × 10`\n   Total Savings = `30`\n\nAnswer: Her total net savings after 10 days is ₹30."
}'),

(3, 
'Verify the property a - (-b) = a + b for the following values:\n(a) a = 28, b = 11\n(b) a = -15, b = 7\nShow the complete calculation for both LHS and RHS in each case.', 
'Long Answer Type',
4,
'{
  "answer": "Case (a): a = 28, b = 11\n   - LHS = a - (-b)\n     LHS = `28 - (-11)`\n     Since subtracting a negative is adding a positive:\n     LHS = `28 + 11 = 39`\n   - RHS = a + b\n     RHS = `28 + 11 = 39`\n   - Verification: Since LHS (39) = RHS (39), the property is verified.\n\nCase (b): a = -15, b = 7\n   - LHS = a - (-b)\n     LHS = `-15 - (-7)`\n     Since subtracting a negative is adding a positive:\n     LHS = `-15 + 7 = -8`\n   - RHS = a + b\n     RHS = `-15 + 7 = -8`\n   - Verification: Since LHS (-8) = RHS (-8), the property is verified."
}'),

(3, 
'Find the value of the expression: 39 - [23 - {29 - (17 - 9 - 3)}]. Show the step-by-step simplification, solving the innermost bracket first.', 
'Long Answer Type',
5,
'{
  "answer": "We will solve the brackets in order from innermost to outermost (BODMAS/PEMDAS rule).\nExpression: `39 - [23 - {29 - (17 - 9 - 3)}]`\n\nStep 1: Solve the innermost bracket (parentheses) `(17 - 9 - 3)`\n   `17 - 9 = 8`\n   `8 - 3 = 5`\n   The expression becomes: `39 - [23 - {29 - 5}]`\n\nStep 2: Solve the next bracket (curly braces) `{29 - 5}`\n   `29 - 5 = 24`\n   The expression becomes: `39 - [23 - 24]`\n\nStep 3: Solve the next bracket (square brackets) `[23 - 24]`\n   `23 - 24 = -1`\n   The expression becomes: `39 - [-1]`\n\nStep 4: Solve the final expression `39 - (-1)`\n   Subtracting a negative is the same as adding a positive:\n   `39 + 1 = 40`\n\nFinal Answer: The value of the expression is 40."
}'),

(3, 
'In a class test, +3 marks are given for every correct answer and -2 marks are given for every incorrect answer. No marks are given for not attempting. Sunita scored 20 marks. If she got 12 correct answers, how many questions did she attempt incorrectly? Explain your reasoning.', 
'Long Answer Type',
4,
'{
  "answer": "1. Marks from Correct Answers:\n   Sunita got 12 correct answers.\n   Marks for each correct answer = +3.\n   Total marks from correct answers = `12 × (+3) = +36` marks.\n\n2. Finding Marks from Incorrect Answers:\n   Her total score is 20.\n   Total Score = (Marks from Correct) + (Marks from Incorrect)\n   `20 = 36 + (Marks from Incorrect)`\n   To find the marks from incorrect answers, subtract 36 from 20:\n   Marks from Incorrect = `20 - 36 = -16` marks.\n\n3. Finding Number of Incorrect Answers:\n   We know she got -16 marks from incorrect answers.\n   Marks for *each* incorrect answer = -2.\n   Number of Incorrect Answers = (Total Marks from Incorrect) / (Marks per Incorrect Answer)\n   Number of Incorrect Answers = `(-16) / (-2)`\n   `16 / 2 = 8`\n\nAnswer: Sunita attempted 8 questions incorrectly.\n\nCheck: (12 correct × 3 marks) + (8 incorrect × -2 marks) = 36 + (-16) = 36 - 16 = 20 marks. This matches her total score."
}'),

(3, 
'What integer must be added to the sum of (-25) and 40 to get a result equal to the sum of (-5) and (-12)? Explain your steps.', 
'Long Answer Type',
4,
'{
  "answer": "This problem has three parts.\n\nStep 1: Find the first sum.\n   Sum 1 = `(-25) + 40`\n   `= 40 - 25 = 15`\n\nStep 2: Find the target result (the second sum).\n   Sum 2 = `(-5) + (-12)`\n   `= -5 - 12 = -17`\n\nStep 3: Find the missing integer.\n   The question is: (Sum 1) + (Missing Integer) = (Sum 2)\n   Let the missing integer be ''x''.\n   `15 + x = -17`\n\n   To find x, we subtract 15 from both sides:\n   `x = -17 - 15`\n   `x = -17 + (-15)`\n   `x = -32`\n\nAnswer: The integer -32 must be added.\n\nCheck: `[(-25) + 40] + (-32) = 15 - 32 = -17`. This matches the target sum `(-5) + (-12) = -17`."
}'),

(3, 
'Which is greater: The sum of all integers from -4 to 2, or the sum of all integers from -2 to 4? Justify your answer by calculating both sums.', 
'Long Answer Type',
4,
'{
  "answer": "Calculation for Sum 1 (S1): Integers from -4 to 2\n   S1 = `(-4) + (-3) + (-2) + (-1) + 0 + 1 + 2`\n   We can group additive inverses (like -1 and 1, -2 and 2) which sum to 0.\n   S1 = `(-4) + (-3) + [(-2) + 2] + [(-1) + 1] + 0`\n   S1 = `(-4) + (-3) + 0 + 0 + 0`\n   S1 = `-4 - 3 = -7`\n\nCalculation for Sum 2 (S2): Integers from -2 to 4\n   S2 = `(-2) + (-1) + 0 + 1 + 2 + 3 + 4`\n   Again, we group additive inverses:\n   S2 = `[(-2) + 2] + [(-1) + 1] + 0 + 3 + 4`\n   S2 = `0 + 0 + 0 + 3 + 4`\n   S2 = `3 + 4 = 7`\n\nComparison:\n   We need to compare S1 (-7) and S2 (7).\n   Since 7 is a positive integer and -7 is a negative integer, 7 is greater than -7.\n   `7 > -7`\n\nAnswer: The sum of all integers from -2 to 4 (which is 7) is greater."
}'),

(3, 
'On a certain day, the temperature at 6 a.m. was -5°C. The temperature rose by 2°C every hour until 10 a.m. After 10 a.m., it started to fall by 1°C every hour. What was the temperature at 1 p.m.? Show the timeline and calculations.', 
'Long Answer Type',
5,
'{
  "answer": "We need to calculate the temperature in two parts.\n\nPart 1: Temperature rise from 6 a.m. to 10 a.m.\n   - Initial temperature at 6 a.m. = -5°C\n   - Duration of rise = 10 a.m. - 6 a.m. = 4 hours.\n   - Rate of rise = +2°C per hour.\n   - Total rise = `4 hours × 2°C/hour = 8°C`.\n   - Temperature at 10 a.m. = (Initial Temp) + (Total Rise)\n   - Temp at 10 a.m. = `(-5) + 8 = 3°C`.\n\nPart 2: Temperature fall from 10 a.m. to 1 p.m.\n   - Temperature at 10 a.m. = 3°C\n   - Duration of fall = 1 p.m. - 10 a.m. = 3 hours (11:00, 12:00, 1:00).\n   - Rate of fall = -1°C per hour.\n   - Total fall = `3 hours × (-1°C/hour) = -3°C`.\n   - Temperature at 1 p.m. = (Temp at 10 a.m.) + (Total Fall)\n   - Temp at 1 p.m. = `3 + (-3) = 3 - 3 = 0°C`.\n\nAnswer: The temperature at 1 p.m. was 0°C."
}'),

(3, 
'A shopkeeper earns a profit of ₹1 by selling one pen and incurs a loss of 40 paise (₹0.40) per pencil. In a particular month, she incurs a total loss of ₹5. In this period, she sold 45 pens. How many pencils did she sell in this period? Explain.', 
'Long Answer Type',
5,
'{
  "answer": "1. Represent Profit/Loss:\n   - Profit on one pen = +₹1\n   - Loss on one pencil = -₹0.40\n   - Total Loss = -₹5\n\n2. Calculate Profit from Pens:\n   - She sold 45 pens.\n   - Total profit from pens = `45 × (+1) = +₹45`.\n\n3. Find Loss from Pencils:\n   - Total Loss = (Profit from Pens) + (Loss from Pencils)\n   - ` -5 = (+45) + (Loss from Pencils)`\n   - To find the loss from pencils, subtract 45 from -5:\n   - Loss from Pencils = `-5 - 45 = -₹50`.\n   - So, the total loss just from selling pencils was ₹50.\n\n4. Calculate Number of Pencils:\n   - We know the total loss from pencils (-₹50) and the loss per pencil (-₹0.40).\n   - Number of Pencils = (Total Loss from Pencils) / (Loss per Pencil)\n   - Number of Pencils = `(-50) / (-0.40)`\n   - `50 / 0.40 = 50 / (4/10) = 50 * (10/4) = 500 / 4 = 125`.\n\nAnswer: She sold 125 pencils in this period."
}'),

(3, 
'Find the sum of the greatest 3-digit positive integer and the greatest 2-digit negative integer. Explain your choices for these integers.', 
'Long Answer Type',
4,
'{
  "answer": "1. Finding the Greatest 3-Digit Positive Integer:\n   - Positive 3-digit integers range from 100 to 999.\n   - The greatest (largest) integer in this range is 999.\n\n2. Finding the Greatest 2-Digit Negative Integer:\n   - Negative 2-digit integers range from -99 to -10.\n   - On a number line, the \"greatest\" integer is the one furthest to the right (closest to 0).\n   - Comparing -99 and -10, -10 is much closer to 0.\n   - Therefore, the greatest 2-digit negative integer is -10.\n\n3. Calculating the Sum:\n   - We need to find the sum of 999 and -10.\n   - Sum = `999 + (-10)`\n   - Sum = `999 - 10`\n   - Sum = `989`\n\nAnswer: The sum is 989."
}'),

(3, 
'A diver is 20 m below sea level. He ascends 8 m, then descends 12 m, and then ascends 15 m. What is his final position relative to sea level? Represent his initial position and all movements as integers and solve.', 
'Long Answer Type',
4,
'{
  "answer": "1. Representing the Positions/Movements:\n   - Initial Position (20 m below) = -20\n   - Ascends 8 m = +8\n   - Descends 12 m = -12\n   - Ascends 15 m = +15\n\n2. Calculating the Final Position:\n   The final position is the sum of the initial position and all the movements.\n   Final Position = `(Initial) + (Move 1) + (Move 2) + (Move 3)`\n   Final Position = `(-20) + (+8) + (-12) + (+15)`\n   Final Position = `-20 + 8 - 12 + 15`\n\n3. Solving the Expression:\n   Let''s group the positive and negative numbers:\n   Positives: `8 + 15 = 23`\n   Negatives: `-20 - 12 = -32`\n\n   Now, add the results:\n   Final Position = `23 + (-32)`\n   `= 23 - 32`\n   `= -9`\n\nAnswer: His final position is -9 m, which means he is 9 meters below sea level."
}'),

(3, 
'Find the difference between the sum of integers from -5 to -1 and the sum of integers from 1 to 5. (i.e., [Sum 1] - [Sum 2]). Explain your calculations.', 
'Long Answer Type',
4,
'{
  "answer": "Step 1: Calculate Sum 1 (integers from -5 to -1)\n   Sum 1 = `(-5) + (-4) + (-3) + (-2) + (-1)`\n   Sum 1 = `-5 - 4 - 3 - 2 - 1`\n   `= -9 - 3 - 2 - 1`\n   `= -12 - 2 - 1`\n   `= -14 - 1`\n   Sum 1 = -15\n\nStep 2: Calculate Sum 2 (integers from 1 to 5)\n   Sum 2 = `1 + 2 + 3 + 4 + 5`\n   `= 3 + 3 + 4 + 5`\n   `= 6 + 4 + 5`\n   `= 10 + 5`\n   Sum 2 = 15\n\nStep 3: Find the difference (Sum 1 - Sum 2)\n   Difference = `(Sum 1) - (Sum 2)`\n   Difference = `(-15) - (15)`\n   Difference = `-15 - 15`\n   Difference = -30\n\nAnswer: The difference is -30."
}');