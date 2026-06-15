class RiskEngine {
    constructor() {
        this.scores = {};
        this.maxScores = {};
    }

    // Add or update an answer
    processAnswer(organId, questionId, weight, answerValue) {
        if (!this.scores[organId]) {
            this.scores[organId] = 0;
            this.maxScores[organId] = 0;
        }
        // Simplistic assumption for architecture: recalculating requires full state,
        // so we just expose a bulk calculate function.
    }

    calculateOrganScore(organId, answers) {
        const questions = window.AnatomyData[organId].questions;
        let currentScore = 0;
        let maxPossible = 0;
        
        questions.forEach(q => {
            let val = answers[q.id] || 0;
            currentScore += (val * q.weight);
            maxPossible += (5 * q.weight); // Assuming slider is 0-5
        });

        let percentage = Math.round((currentScore / maxPossible) * 100);
        this.scores[organId] = percentage || 0;
        return this.scores[organId];
    }

    getRiskLevel(score) {
        if (score <= 25) return { label: 'Low', class: 'risk-low' };
        if (score <= 50) return { label: 'Moderate', class: 'risk-mod' };
        if (score <= 75) return { label: 'High', class: 'risk-high' };
        return { label: 'Very High', class: 'risk-high' }; // reuse high class color for max severity
    }
}

window.healthEngine = new RiskEngine();