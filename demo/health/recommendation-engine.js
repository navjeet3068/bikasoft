class RecommendationEngine {
    constructor() {
        this.bloodTestMap = {
            lungs: [
                { threshold: 30, test: "CBC", reason: "Check for basic infections", priority: "Low" }
            ],
            heart: [
                { threshold: 30, test: "Lipid Profile", reason: "Assess cholesterol levels", priority: "Moderate" },
                { threshold: 60, test: "Hs-CRP", reason: "Detect cardiac inflammation", priority: "High" }
            ],
            kidneys: [
                { threshold: 30, test: "Urine Routine", reason: "Initial renal check", priority: "Low" },
                { threshold: 60, test: "KFT", reason: "Kidney Function Test", priority: "High" }
            ]
        };
        
        this.scanMap = {
            lungs: [
                { threshold: 30, scan: "Chest X-Ray", reason: "Rule out visual abnormalities", priority: "Moderate" },
                { threshold: 60, scan: "Pulmonary Function Test", reason: "Assess lung capacity", priority: "High" },
                { threshold: 80, scan: "HRCT Chest", reason: "Detailed lung tissue scan", priority: "Urgent" }
            ],
            heart: [
                { threshold: 30, scan: "ECG", reason: "Electrical activity check", priority: "Moderate" },
                { threshold: 60, scan: "2D Echo", reason: "Structural heart analysis", priority: "High" }
            ]
        };
    }

    generate(scores) {
        let recs = { bloodTests: [], scans: [] };

        for (const [organ, score] of Object.entries(scores)) {
            // Blood tests
            if (this.bloodTestMap[organ]) {
                let tests = this.bloodTestMap[organ].filter(r => score >= r.threshold);
                if(tests.length > 0) recs.bloodTests.push(tests[tests.length-1]); // take highest threshold met
            }
            // Scans
            if (this.scanMap[organ]) {
                let scans = this.scanMap[organ].filter(r => score >= r.threshold);
                if(scans.length > 0) recs.scans.push(scans[scans.length-1]);
            }
        }
        
        return recs;
    }
}

window.recEngine = new RecommendationEngine();