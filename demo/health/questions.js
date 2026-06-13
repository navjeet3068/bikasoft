// Complete JSON schema logic defining organs and questions
const AnatomyData = {
    brain: {
        name: "Brain & Nervous System",
        questions: [
            { id: "b_headache", text: "Frequent headaches?", weight: 4 },
            { id: "b_dizzy", text: "Dizziness or vertigo?", weight: 5 },
            { id: "b_memory", text: "Memory loss or confusion?", weight: 6 }
        ]
    },
    lungs: {
        name: "Respiratory System",
        questions: [
            { id: "l_cough", text: "How often do you cough?", weight: 4 },
            { id: "l_sob", text: "Shortness of breath?", weight: 6 },
            { id: "l_smoke", text: "Smoking history severity?", weight: 5 },
            { id: "l_wheeze", text: "Wheezing sounds?", weight: 4 }
        ]
    },
    heart: {
        name: "Cardiovascular System",
        questions: [
            { id: "h_pain", text: "Chest pain or tightness?", weight: 8 },
            { id: "h_palp", text: "Heart palpitations?", weight: 5 },
            { id: "h_bp", text: "High Blood Pressure history?", weight: 6 }
        ]
    },
    kidneys: {
        name: "Renal System",
        questions: [
            { id: "k_urine", text: "Changes in urination frequency?", weight: 5 },
            { id: "k_pain", text: "Lower back/flank pain?", weight: 4 },
            { id: "k_swell", text: "Swelling in legs/ankles?", weight: 6 }
        ]
    }
    // Extensible for Liver, Stomach, Pancreas, Spine, etc.
};

// Expose globally
window.AnatomyData = AnatomyData;