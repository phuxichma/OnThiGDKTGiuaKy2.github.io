// DOM Elements
const questionsPart1 = document.getElementById('questions-part1');
const questionsPart2 = document.getElementById('questions-part2');
const scorePart1 = document.getElementById('score-part1');
const totalPart1 = document.getElementById('total-part1');
const progressPart1 = document.getElementById('progress-part1');
const scorePart2 = document.getElementById('score-part2');
const totalPart2 = document.getElementById('total-part2');
const progressPart2 = document.getElementById('progress-part2');

// State
let state = {
    part1: { correct: 0, total: 0, answered: 0 },
    part2: { score: 0, total: 0, answered: 0 }
};

function init() {
    // Setup Part 1
    if (typeof part1Data !== 'undefined' && part1Data.length > 0) {
        state.part1.total = part1Data.length;
        renderPart1();
    } else {
        questionsPart1.innerHTML = "<p style='text-align:center'>Đang tải dữ liệu câu hỏi...</p>";
    }

    // Setup Part 2
    if (typeof part2Data !== 'undefined' && part2Data.length > 0) {
        let p2Total = 0;
        part2Data.forEach(q => p2Total += q.items.length);
        state.part2.total = p2Total;
        renderPart2();
    } else {
        questionsPart2.innerHTML = "<p style='text-align:center'>Đang tải dữ liệu câu hỏi...</p>";
    }

    updateUI();
}

function updateUI() {
    scorePart1.textContent = state.part1.correct;
    totalPart1.textContent = state.part1.total;
    progressPart1.style.width = state.part1.total ? `${(state.part1.answered / state.part1.total) * 100}%` : '0%';

    scorePart2.textContent = state.part2.score;
    totalPart2.textContent = state.part2.total;
    progressPart2.style.width = state.part2.total ? `${(state.part2.answered / state.part2.total) * 100}%` : '0%';
}

window.openTab = function (tabName) {
    const contents = document.getElementsByClassName('tab-content');
    const btns = document.getElementsByClassName('tab-btn');
    for (let c of contents) c.classList.remove('active');
    for (let b of btns) b.classList.remove('active');
    document.getElementById(tabName).classList.add('active');
    const activeBtn = Array.from(btns).find(b => b.onclick.toString().includes(tabName));
    if (activeBtn) activeBtn.classList.add('active');
}

function renderPart1() {
    questionsPart1.innerHTML = part1Data.map((q, index) => `
        <div class="question-card" id="q1-${q.id}">
            <div class="question-text">Câu ${q.id}. ${q.q}</div>
            <div class="options-grid">
                ${q.opts.map((opt, i) => {
        const letter = String.fromCharCode(65 + i);
        return `<button class="option-btn" onclick="checkPart1(${q.id}, '${letter}', this)">${opt}</button>`;
    }).join('')}
            </div>
        </div>
    `).join('');
}

window.checkPart1 = function (id, selected, btn) {
    const q = part1Data.find(x => x.id === id);
    const parent = btn.parentElement;
    if (parent.dataset.answered) return;
    parent.dataset.answered = "true";

    const buttons = parent.getElementsByClassName('option-btn');
    const correctBtnIndex = q.a.charCodeAt(0) - 65;

    if (selected === q.a) {
        btn.classList.add('correct');
        state.part1.correct++;
        showToast("Chính xác!", "success");
    } else {
        btn.classList.add('incorrect');
        if (buttons[correctBtnIndex]) buttons[correctBtnIndex].classList.add('correct');
        showToast(`Sai rồi. Đáp án đúng là ${q.a}`, "error");
    }
    state.part1.answered++;
    updateUI();
}

function renderPart2() {
    questionsPart2.innerHTML = part2Data.map(q => `
        <div class="question-card">
            <div class="question-text"><strong>${q.title}</strong></div>
            <p>${q.text}</p>
            <div class="tf-container">
                ${q.items.map(item => `
                    <div class="tf-row" id="p2-item-${q.id}-${item.id}" data-ans="${item.ans}">
                        <div class="tf-statement">${item.text}</div>
                        <div class="tf-options">
                            <button class="tf-btn" onclick="checkPart2('${q.id}', '${item.id}', true, this)">Đúng</button>
                            <button class="tf-btn" onclick="checkPart2('${q.id}', '${item.id}', false, this)">Sai</button>
                        </div>
                        <div class="tf-result"></div>
                    </div>
                    <div class="tf-expl" id="expl-${q.id}-${item.id}" style="display:none; margin-left:10px; font-size:0.9em; color:#666;">
                        ${item.explanation ? `<em>Giải thích: ${item.explanation}</em>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

window.checkPart2 = function (qId, itemId, userAns, btn) {
    const q = part2Data.find(x => x.id == qId);
    const item = q.items.find(x => x.id == itemId);
    const row = document.getElementById(`p2-item-${qId}-${itemId}`);

    if (row.dataset.answered) return;
    row.dataset.answered = "true";

    const btns = row.getElementsByClassName('tf-btn');
    if (userAns) btn.classList.add('selected-true');
    else btn.classList.add('selected-false');

    const resultDiv = row.querySelector('.tf-result');
    const explDiv = document.getElementById(`expl-${qId}-${itemId}`);

    if (userAns === item.ans) {
        state.part2.score++;
        resultDiv.innerHTML = '<span class="correct-text">✓</span>';
        btn.style.borderColor = 'var(--primary-light)';
        btn.style.borderWidth = '2px';
    } else {
        resultDiv.innerHTML = '<span class="wrong-text">✕</span>';
        const otherBtn = userAns ? btns[1] : btns[0];
        otherBtn.style.border = '2px solid var(--primary-light)';
        otherBtn.style.color = 'var(--primary-dark)';
        otherBtn.style.fontWeight = 'bold';
    }

    if (explDiv) explDiv.style.display = 'block';

    state.part2.answered++;
    updateUI();
}

function showToast(message, type) {
    const x = document.getElementById("toast");
    x.innerText = message;
    x.className = "toast show";
    setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
}

// Initialize after data load (simulated)
// setTimeout(init, 100);
document.addEventListener('DOMContentLoaded', init);
