-- QUESTIONS ON PHYSICAL AND CHEMICAL CHANGES CLASS 7

INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade7_science_physical_chemical_changes_easy',
    'Class 7: Physical and Chemical Changes (Easy)',
    7,
    'Science',
    'Generic',
    'Physical and Chemical Changes',
    'Physical and Chemical Changes'
)
RETURNING id;

INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade7_science_physical_chemical_changes_moderate',
    'Class 7: Physical and Chemical Changes (Moderate)',
    7,
    'Science',
    'Generic',
    'Physical and Chemical Changes',
    'Physical and Chemical Changes'
)
RETURNING id;


INSERT INTO question_banks (bank_key, display_name, grade, subject, book, chapter, topic)
VALUES (
    'grade7_science_physical_chemical_changes_advanced',
    'Class 7: Physical and Chemical Changes (Advanced)',
    7,
    'Science',
    'Generic',
    'Physical and Chemical Changes',
    'Physical and Chemical Changes'
)
RETURNING id;

INSERT INTO questions (question_bank_id, question_text, question_type, difficulty_level, details)
VALUES

-- #################################################
-- ## Set 1: Easy (ID 4, Level 1-2)
-- #################################################

(4, 
'Which of the following is a physical change?', 
'MCQ',
1,
'{
  "answer": "Melting of ice",
  "options": [
    "Rusting of iron",
    "Burning of wood",
    "Melting of ice",
    "Digestion of food"
  ],
  "explanation": "Melting of ice is a physical change because it only changes the state (solid to liquid), not the chemical substance (it is still H2O)."
}'),

(4, 
'Which of the following is a chemical change?', 
'MCQ',
1,
'{
  "answer": "Burning of paper",
  "options": [
    "Boiling of water",
    "Burning of paper",
    "Tearing of paper",
    "Melting of wax"
  ],
  "explanation": "Burning of paper is a chemical change because it produces new substances like ash and carbon dioxide."
}'),

(4, 
'A change in which no new substance is formed is called a:', 
'MCQ',
1,
'{
  "answer": "Physical change",
  "options": [
    "Physical change",
    "Chemical change",
    "Rusting",
    "Reversible change"
  ],
  "explanation": "The defining characteristic of a physical change is that the chemical identity of the substance remains the same."
}'),

(4, 
'A change in which a new substance is formed is called a:', 
'MCQ',
1,
'{
  "answer": "Chemical change",
  "options": [
    "Physical change",
    "Chemical change",
    "Melting",
    "Freezing"
  ],
  "explanation": "Chemical changes (or chemical reactions) involve the formation of one or more new substances with different properties."
}'),

(4, 
'Cutting a log of wood into small pieces is a:', 
'MCQ',
1,
'{
  "answer": "Physical change",
  "options": [
    "Physical change",
    "Chemical change",
    "Irreversible change",
    "Biological change"
  ],
  "explanation": "Cutting the wood only changes its size and shape. The substance (wood) remains the same."
}'),

(4, 
'Which of these is an example of a chemical change?', 
'MCQ',
2,
'{
  "answer": "Ripening of a fruit",
  "options": [
    "Dissolving sugar in water",
    "Grinding wheat into flour",
    "Ripening of a fruit",
    "Evaporation of water"
  ],
  "explanation": "Ripening involves complex chemical reactions that change the fruit''s color, texture, and taste, forming new substances."
}'),

(4, 
'Physical changes are generally:', 
'MCQ',
2,
'{
  "answer": "Reversible",
  "options": [
    "Reversible",
    "Irreversible",
    "Permanent",
    "Always exothermic"
  ],
  "explanation": "Many physical changes, like melting ice (to water) and freezing water (to ice), can be easily reversed."
}'),

(4, 
'Chemical changes are generally:', 
'MCQ',
2,
'{
  "answer": "Irreversible",
  "options": [
    "Reversible",
    "Irreversible",
    "Temporary",
    "Only state changes"
  ],
  "explanation": "It is usually very difficult to get back the original substances after a chemical change, like turning ash back into paper."
}'),

(4, 
'Formation of clouds is a:', 
'MCQ',
2,
'{
  "answer": "Physical change",
  "options": [
    "Physical change",
    "Chemical change",
    "Permanent change",
    "None of the above"
  ],
  "explanation": "Cloud formation involves the condensation of water vapor (gas) into tiny water droplets (liquid), which is a physical change of state."
}'),

(4, 
'What is the common name for the chemical change where iron reacts with oxygen and moisture?', 
'MCQ',
2,
'{
  "answer": "Rusting",
  "options": [
    "Melting",
    "Galvanization",
    "Rusting",
    "Crystallization"
  ],
  "explanation": "Rusting is the specific term for the corrosion (a chemical change) of iron."
}'),

-- #################################################
-- ## Set 2: Moderate (ID 5, Level 3-4)
-- #################################################

(5, 
'When magnesium ribbon is burned in the air, it forms a white powder. This is a:', 
'MCQ',
3,
'{
  "answer": "Chemical change",
  "options": [
    "Physical change",
    "Chemical change",
    "Physical and chemical change",
    "None of the above"
  ],
  "explanation": "Burning magnesium (Mg) in oxygen (O2) creates a new substance, magnesium oxide (MgO), which is a white powder. This is a chemical change."
}'),

(5, 
'What gas is produced when vinegar (acetic acid) is mixed with baking soda (sodium bicarbonate)?', 
'MCQ',
3,
'{
  "answer": "Carbon dioxide",
  "options": [
    "Oxygen",
    "Hydrogen",
    "Carbon dioxide",
    "Nitrogen"
  ],
  "explanation": "The reaction between the acid (vinegar) and the base (baking soda) is a chemical change that releases carbon dioxide gas (CO2)."
}'),

(5, 
'What is the process of coating a layer of zinc on iron called?', 
'MCQ',
3,
'{
  "answer": "Galvanization",
  "options": [
    "Rusting",
    "Crystallization",
    "Galvanization",
    "Evaporation"
  ],
  "explanation": "Galvanization is a method used to protect iron from rusting by coating it with a protective layer of zinc."
}'),

(5, 'What is the chemical name of rust?', 
'MCQ',
3,
'{
  "answer": "Iron oxide",
  "options": [
    "Iron sulfide",
    "Iron oxide",
    "Iron carbonate",
    "Iron hydroxide"
  ],
  "explanation": "Rust is hydrated iron(III) oxide, commonly called iron oxide. Its formation is a chemical change."
}'),

(5, 
'The process of obtaining large crystals of pure substances from their solutions is called:', 
'MCQ',
3,
'{
  "answer": "Crystallization",
  "options": [
    "Galvanization",
    "Rusting",
    "Neutralization",
    "Crystallization"
  ],
  "explanation": "Crystallization is a technique used to purify solids. It is a physical change as the chemical substance remains the same."
}'),

(5, 
'Crystallization is an example of a:', 
'MCQ',
4,
'{
  "answer": "Physical change",
  "options": [
    "Physical change",
    "Chemical change",
    "Biological change",
    "Irreversible change"
  ],
  "explanation": "Although the appearance changes (from dissolved to solid crystals), the substance itself (e.g., copper sulphate) does not change its chemical identity."
}'),

(5, 
'Which of the following is NOT a common indicator of a chemical change?', 
'MCQ',
4,
'{
  "answer": "Change in size",
  "options": [
    "Production of a gas",
    "Change in color",
    "Production of heat or light",
    "Change in size"
  ],
  "explanation": "A change in size (like tearing paper) is a physical change. Production of gas, change in color, or release of energy (heat/light) are common signs of a chemical reaction."
}'),

(5, 
'When carbon dioxide gas is passed through limewater, the limewater turns milky. This is due to the formation of:', 
'MCQ',
4,
'{
  "answer": "Calcium carbonate",
  "options": [
    "Calcium oxide",
    "Calcium carbonate",
    "Calcium hydroxide",
    "Carbonic acid"
  ],
  "explanation": "This is a classic test for CO2. The CO2 reacts with limewater (calcium hydroxide) to form calcium carbonate, a white, insoluble substance that makes the solution look milky."
}'),

(5, 
'Why does a sliced apple turn brown when exposed to air?', 
'MCQ',
4,
'{
  "answer": "A chemical change (oxidation)",
  "options": [
    "A physical change (drying out)",
    "A chemical change (oxidation)",
    "It absorbs dust from the air",
    "The water in it evaporates"
  ],
  "explanation": "Enzymes in the apple react with oxygen in the air (oxidation), causing a chemical change that produces the brown color."
}'),

(5, 
'Digestion of food in our body is a:', 
'MCQ',
3,
'{
  "answer": "Chemical change",
  "options": [
    "Physical change",
    "Chemical change",
    "Reversible change",
    "Periodic change"
  ],
  "explanation": "Acids and enzymes in our digestive system break down complex food molecules into simpler, new substances that the body can absorb. This is a series of chemical changes."
}'),

-- #################################################
-- ## Set 3: Difficult (ID 6, Level 4-5)
-- #################################################

(6, 
'What two conditions are essential for the rusting of iron to occur?', 
'MCQ',
4,
'{
  "answer": "Presence of oxygen and water (or water vapour)",
  "options": [
    "Presence of oxygen and nitrogen",
    "Presence of carbon dioxide and sunlight",
    "Presence of oxygen and water (or water vapour)",
    "Presence of salt and heat"
  ],
  "explanation": "Iron will not rust in dry air (no water) or in oxygen-free water. It requires both oxygen and moisture/water to react and form rust."
}'),

(6, 
'Burning of a candle involves:', 
'MCQ',
5,
'{
  "answer": "Both physical and chemical changes",
  "options": [
    "Only a physical change",
    "Only a chemical change",
    "Both physical and chemical changes",
    "Neither physical nor chemical change"
  ],
  "explanation": "It''s a physical change when the wax melts (solid to liquid). It''s a chemical change when the wax vapour and the wick burn in oxygen, producing heat, light, CO2, and water vapour."
}'),

(6, 
'Stainless steel is made by mixing iron with other substances like carbon, chromium, and nickel. This is done to:', 
'MCQ',
4,
'{
  "answer": "Prevent the iron from rusting",
  "options": [
    "Make the iron melt faster",
    "Make the iron softer",
    "Prevent the iron from rusting",
    "Make the iron magnetic"
  ],
  "explanation": "Adding chromium and nickel to iron creates an alloy (stainless steel) that is resistant to rusting (a chemical change)."
}'),

(6, 
'What is the chemical formula for rust?', 
'MCQ',
5,
'{
  "answer": "Fe2O3 . nH2O (Hydrated Iron(III) Oxide)",
  "options": [
    "FeO (Iron(II) Oxide)",
    "Fe2O3 . nH2O (Hydrated Iron(III) Oxide)",
    "Fe(OH)2 (Iron(II) Hydroxide)",
    "FeSO_4 (Iron(II) Sulphate)"
  ],
  "explanation": "Rust is not just iron oxide (Fe2O3); it is hydrated iron(III) oxide (Fe2O3 . nH2O), meaning it has water molecules associated with it."
}'),

(6, 
'A reaction between an acid and a base is called neutralization. This reaction always produces:', 
'MCQ',
4,
'{
  "answer": "A salt and water",
  "options": [
    "A new acid and a new base",
    "A salt and hydrogen gas",
    "A salt and water",
    "A base and oxygen gas"
  ],
  "explanation": "Neutralization is a chemical change where the acid and base react to form a neutral substance (a salt) and water. For example, HCl + NaOH -> NaCl (salt) + H2O (water)."
}'),

(6, 
'Photosynthesis, the process by which plants make food, is a:', 
'MCQ',
4,
'{
  "answer": "Chemical change that absorbs energy (endothermic)",
  "options": [
    "Physical change that absorbs energy",
    "Physical change that releases energy",
    "Chemical change that absorbs energy (endothermic)",
    "Chemical change that releases energy (exothermic)"
  ],
  "explanation": "Plants use energy (sunlight) to chemically convert CO2 and water into a new substance (glucose/sugar). Because it absorbs energy, it is an endothermic chemical change."
}'),

(6, 
'When a copper sulphate solution reacts with an iron nail, the blue color of the solution fades and turns light green, and a brown deposit forms on the nail. Why?', 
'MCQ',
5,
'{
  "answer": "Iron displaces copper from the solution (a chemical change)",
  "options": [
    "The iron nail simply rusts (a chemical change)",
    "The blue solution evaporates (a physical change)",
    "Iron displaces copper from the solution (a chemical change)",
    "The iron nail absorbs the blue color (a physical change)"
  ],
  "explanation": "This is a displacement reaction. Iron (Fe) is more reactive than copper (Cu). It displaces the copper from the copper sulphate (CuSO_4) solution, forming iron sulphate (FeSO_4), which is green. The displaced copper deposits on the nail as a brown layer."
}'),

(6, 
'An explosion of fireworks is a chemical change. What is the primary indicator that a chemical change has occurred?', 
'MCQ',
4,
'{
  "answer": "Production of heat, light, sound, and gas",
  "options": [
    "Change in shape",
    "Change in state (solid to gas)",
    "Production of heat, light, sound, and gas",
    "The fireworks are used up"
  ],
  "explanation": "Explosions are rapid chemical reactions that release a large amount of energy in the form of heat, light, and sound, and also produce new gaseous substances."
}'),

(6, 
'Slaking of lime (adding water to quicklime/Calcium Oxide) is an example of a:', 
'MCQ',
5,
'{
  "answer": "Chemical change that is exothermic",
  "options": [
    "Physical change (dissolving)",
    "Chemical change that is endothermic",
    "Chemical change that is exothermic",
    "Physical change that releases heat"
  ],
  "explanation": "Quicklime (CaO) reacts chemically with water (H2O) to form a new substance, slaked lime (Ca(OH)2). This reaction releases a large amount of heat, so it is an exothermic chemical change."
}'),

(6, 
'How does the zinc layer in galvanization protect iron from rusting, even if the zinc layer is scratched?', 
'MCQ',
5,
'{
  "answer": "Zinc is more reactive than iron and corrodes first",
  "options": [
    "Zinc forms a magnetic field that repels oxygen",
    "Zinc fills the scratch automatically",
    "Zinc is more reactive than iron and corrodes first",
    "Zinc is non-reactive and just acts as a barrier"
  ],
  "explanation": "Zinc provides sacrificial protection. Because zinc is more chemically reactive than iron, it will react with the oxygen and water first, corroding away sacrificially while the iron underneath remains protected."
}')
;
