document.addEventListener('DOMContentLoaded', () => {
    // Core State
    const state = {
        user: {},
        answers: {}, // shape: { organId: { questionId: val } }
        currentOrgan: null
    };

    // View Management Elements
    const heroSection = document.getElementById('hero-section');
    const anatomySection = document.getElementById('anatomy-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const recsSection = document.getElementById('recommendations-section');
    const onboardModal = document.getElementById('onboarding-modal');
    const organPanel = document.getElementById('organ-panel');
    
    // Initialize views
    document.getElementById('btn-start-scan').addEventListener('click', () => {
        onboardModal.classList.remove('hidden');
    });

    // Multi-step form logic
    let currentStep = 1;
    document.getElementById('btn-next-step').addEventListener('click', () => {
        // Save data
        if(currentStep === 1) state.user.name = document.getElementById('user-name').value;
        if(currentStep === 2) state.user.age = document.getElementById('user-age').value;
        if(currentStep === 3) state.user.mobile = document.getElementById('user-mobile').value;
        if(currentStep === 4) state.user.whatsapp = document.getElementById('user-whatsapp').value;

        document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('hidden');
        currentStep++;
        
        if(currentStep <= 4) {
            document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('hidden');
            document.getElementById('onboard-progress').style.width = `${currentStep * 25}%`;
            if(currentStep === 4) document.getElementById('btn-next-step').innerText = "Finish";
        } else {
            // Finish Onboarding
            onboardModal.classList.add('hidden');
            heroSection.classList.add('hidden');
            anatomySection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // SVG Interaction Logic
    document.querySelectorAll('.organ-node').forEach(node => {
        node.addEventListener('click', (e) => {
            const organId = node.getAttribute('data-organ');
            openOrganPanel(organId);
        });
    });

    document.getElementById('close-panel').addEventListener('click', () => {
        organPanel.classList.add('hidden');
    });

    function openOrganPanel(organId) {
        state.currentOrgan = organId;
        const data = window.AnatomyData[organId];
        if(!data) return;
        
        document.getElementById('panel-organ-name').innerText = data.name;
        const qContainer = document.getElementById('questions-container');
        qContainer.innerHTML = '';
        
        if(!state.answers[organId]) state.answers[organId] = {};

        data.questions.forEach(q => {
            const val = state.answers[organId][q.id] || 0;
            const html = `
                <div class="slider-group">
                    <label>${q.text} <span class="val-display" id="val-${q.id}">${val}</span></label>
                    <input type="range" min="0" max="5" value="${val}" data-qid="${q.id}" class="organ-slider">
                </div>
            `;
            qContainer.insertAdjacentHTML('beforeend', html);
        });

        // Add slider listeners
        document.querySelectorAll('.organ-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const val = e.target.value;
                const qid = e.target.getAttribute('data-qid');
                document.getElementById(`val-${qid}`).innerText = val;
                state.answers[organId][qid] = parseInt(val);
            });
        });

        organPanel.classList.remove('hidden');
    }

    document.getElementById('save-organ-btn').addEventListener('click', () => {
        organPanel.classList.add('hidden');
    });

    // Generate Report Logic
    document.getElementById('btn-generate-report').addEventListener('click', () => {
        anatomySection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        recsSection.classList.remove('hidden');
        
        renderDashboard();
    });

    function renderDashboard() {
        const scoreGrid = document.getElementById('dashboard-scores');
        scoreGrid.innerHTML = '';
        
        for (const organId in window.AnatomyData) {
            // Calculate score using Risk Engine
            const answers = state.answers[organId] || {};
            const score = window.healthEngine.calculateOrganScore(organId, answers);
            const risk = window.healthEngine.getRiskLevel(score);
            const name = window.AnatomyData[organId].name;

            const html = `
                <div class="score-card">
                    <div>
                        <h3>${name}</h3>
                        <p class="mt-2 text-muted">Risk: ${risk.label}</p>
                    </div>
                    <div class="score-ring ${risk.class}">${score}%</div>
                </div>
            `;
            scoreGrid.insertAdjacentHTML('beforeend', html);
        }
        
        renderRecommendations();
    }

    function renderRecommendations() {
        const recs = window.recEngine.generate(window.healthEngine.scores);
        
        const bGrid = document.getElementById('blood-tests-grid');
        const sGrid = document.getElementById('scans-grid');
        bGrid.innerHTML = ''; sGrid.innerHTML = '';
        
        recs.bloodTests.forEach(r => bGrid.innerHTML += `<div class="rec-card"><h4>${r.test}</h4><p>${r.reason}</p><span class="priority-badge mt-2 inline-block">${r.priority}</span></div>`);
        recs.scans.forEach(r => sGrid.innerHTML += `<div class="rec-card"><h4>${r.scan}</h4><p>${r.reason}</p><span class="priority-badge mt-2 inline-block">${r.priority}</span></div>`);
    }

    // File Upload / Analyzer Logic
    const uploadInput = document.getElementById('file-upload');
    const uploadZone = document.getElementById('upload-zone');
    
    uploadZone.addEventListener('click', () => uploadInput.click());
    uploadInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) 
            window.reportAnalyzer.handleUpload(e.target.files[0], document.getElementById('upload-status'));
    });
});