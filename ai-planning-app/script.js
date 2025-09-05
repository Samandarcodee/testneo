// Telegram Web App initialization
let tg = window.Telegram.WebApp;

// Initialize the app
tg.ready();
tg.expand();

// App state
let appState = {
    tasks: [],
    goals: [],
    timer: {
        isRunning: false,
        timeLeft: 25 * 60, // 25 minutes in seconds
        mode: 'pomodoro',
        sessions: 0,
        totalTime: 0
    },
    aiMessages: []
};

// Load saved data
loadAppState();

// Initialize UI
initializeApp();

function initializeApp() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });

    // Timer mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setTimerMode(e.target.dataset.mode);
        });
    });

    // Task filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterTasks(e.target.dataset.filter);
        });
    });

    // Enter key handlers
    document.getElementById('task-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    document.getElementById('goal-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addGoal();
    });

    document.getElementById('ai-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAIMessage();
    });

    // Update UI
    updateDashboard();
    updateTasksList();
    updateGoalsList();
    updateTimerDisplay();
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Task Management
function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    
    if (text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        appState.tasks.push(task);
        input.value = '';
        updateTasksList();
        updateDashboard();
        saveAppState();
        showMessage('Vazifa qo\'shildi!', 'success');
    }
}

function toggleTask(id) {
    const task = appState.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        updateTasksList();
        updateDashboard();
        saveAppState();
    }
}

function deleteTask(id) {
    appState.tasks = appState.tasks.filter(t => t.id !== id);
    updateTasksList();
    updateDashboard();
    saveAppState();
}

function updateTasksList() {
    const container = document.getElementById('tasks-list');
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    let filteredTasks = appState.tasks;
    if (activeFilter === 'pending') {
        filteredTasks = appState.tasks.filter(t => !t.completed);
    } else if (activeFilter === 'completed') {
        filteredTasks = appState.tasks.filter(t => t.completed);
    }
    
    container.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="task-btn delete" onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function filterTasks(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    updateTasksList();
}

// Goal Management
function addGoal() {
    const input = document.getElementById('goal-input');
    const priority = document.getElementById('goal-priority');
    const text = input.value.trim();
    
    if (text) {
        const goal = {
            id: Date.now(),
            text: text,
            priority: priority.value,
            createdAt: new Date().toISOString(),
            completed: false
        };
        
        appState.goals.push(goal);
        input.value = '';
        updateGoalsList();
        updateDashboard();
        saveAppState();
        showMessage('Maqsad qo\'shildi!', 'success');
    }
}

function updateGoalsList() {
    const container = document.getElementById('goals-list');
    container.innerHTML = appState.goals.map(goal => `
        <div class="goal-item ${goal.priority}">
            <div class="goal-text">${goal.text}</div>
            <div class="goal-priority">${goal.priority} ustuvorlik</div>
        </div>
    `).join('');
}

// Timer Functions
function setTimerMode(mode) {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    appState.timer.mode = mode;
    
    switch(mode) {
        case 'pomodoro':
            appState.timer.timeLeft = 25 * 60;
            break;
        case 'short-break':
            appState.timer.timeLeft = 5 * 60;
            break;
        case 'long-break':
            appState.timer.timeLeft = 15 * 60;
            break;
    }
    
    updateTimerDisplay();
    saveAppState();
}

function startTimer() {
    if (!appState.timer.isRunning) {
        appState.timer.isRunning = true;
        document.getElementById('timer-start').disabled = true;
        document.getElementById('timer-pause').disabled = false;
        
        appState.timer.interval = setInterval(() => {
            appState.timer.timeLeft--;
            updateTimerDisplay();
            
            if (appState.timer.timeLeft <= 0) {
                completeTimer();
            }
        }, 1000);
        
        saveAppState();
    }
}

function pauseTimer() {
    if (appState.timer.isRunning) {
        appState.timer.isRunning = false;
        clearInterval(appState.timer.interval);
        document.getElementById('timer-start').disabled = false;
        document.getElementById('timer-pause').disabled = true;
        saveAppState();
    }
}

function resetTimer() {
    pauseTimer();
    setTimerMode(appState.timer.mode);
    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-pause').disabled = true;
}

function completeTimer() {
    pauseTimer();
    
    if (appState.timer.mode === 'pomodoro') {
        appState.timer.sessions++;
        appState.timer.totalTime += 25;
    }
    
    updateTimerStats();
    showMessage('Sessiya yakunlandi!', 'success');
    
    // Auto switch to break
    if (appState.timer.mode === 'pomodoro') {
        setTimeout(() => {
            setTimerMode('short-break');
        }, 1000);
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(appState.timer.timeLeft / 60);
    const seconds = appState.timer.timeLeft % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimerStats() {
    document.getElementById('pomodoro-count').textContent = appState.timer.sessions;
    document.getElementById('total-time').textContent = appState.timer.totalTime + 'm';
}

// AI Assistant
function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const message = input.value.trim();
    
    if (message) {
        addAIMessage(message, 'user');
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = generateAIResponse(message);
            addAIMessage(response, 'ai');
        }, 1000);
    }
}

function addAIMessage(text, sender) {
    const messagesContainer = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}-message`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <strong>${sender === 'user' ? 'Siz:' : 'AI Yordamchi:'}</strong> ${text}
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    appState.aiMessages.push({ text, sender, timestamp: new Date().toISOString() });
    saveAppState();
}

function generateAIResponse(message) {
    const responses = {
        'samaradorlik': 'Samaradorlikni oshirish uchun Pomodoro texnikasidan foydalaning. 25 daqiqa ishlang, 5 daqiqa dam oling. Bu sizning fokus va ehtiyojni oshiradi.',
        'vaqt': 'Vaqtingizni boshqarish uchun kunlik rejalar tuzing. Eng muhim vazifalarni ertalab bajarib, kichik vazifalarni kichik vaqt oralig\'ida qiling.',
        'maqsad': 'Maqsadlaringizni SMART prinsipi bo\'yicha belgilang: Specific (Aniq), Measurable (O\'lchanadigan), Achievable (Erishiladigan), Relevant (Muhim), Time-bound (Vaqt chegarasi bilan).',
        'motivatsiya': 'Motivatsiyani saqlash uchun kichik g\'alabalarni nishonlang. Har bir bajarilgan vazifa uchun o\'zingizni mukofotlang.',
        'stress': 'Stressni kamaytirish uchun muntazam tanaffuslar oling, nafas olish mashqlarini qiling va realistik rejalar tuzing.'
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [keyword, response] of Object.entries(responses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }
    
    return 'Qiziqarli savol! Men sizga samaradorlik, vaqt boshqaruvi va maqsadlarga erishish bo\'yicha yordam beraman. Batafsilroq so\'rashingiz mumkin.';
}

function askAISuggestion(type) {
    const suggestions = {
        'productivity': 'Samaradorlikni oshirish uchun qanday strategiyalar mavjud?',
        'time-management': 'Vaqtimni qanday samarali boshqarishim mumkin?',
        'goal-setting': 'Maqsadlarimni qanday to\'g\'ri belgilashim kerak?',
        'motivation': 'Motivatsiyamni qanday yuqori saqlashim mumkin?'
    };
    
    const question = suggestions[type];
    if (question) {
        document.getElementById('ai-input').value = question;
        sendAIMessage();
    }
}

// Dashboard Updates
function updateDashboard() {
    const today = new Date().toDateString();
    const todayTasks = appState.tasks.filter(task => 
        new Date(task.createdAt).toDateString() === today
    );
    
    document.getElementById('today-tasks').textContent = todayTasks.length;
    document.getElementById('completed-tasks').textContent = 
        appState.tasks.filter(t => t.completed).length;
    document.getElementById('focus-time').textContent = appState.timer.totalTime + 'm';
    document.getElementById('active-goals').textContent = 
        appState.goals.filter(g => !g.completed).length;
    
    updateRecentTasks();
}

function updateRecentTasks() {
    const container = document.getElementById('recent-tasks-list');
    const recentTasks = appState.tasks.slice(-3).reverse();
    
    container.innerHTML = recentTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <span class="task-text">${task.text}</span>
        </div>
    `).join('');
}

// Quick Actions
function addQuickTask() {
    switchTab('tasks');
    document.getElementById('task-input').focus();
}

function startFocusSession() {
    switchTab('timer');
    startTimer();
}

function askAI() {
    switchTab('ai');
    document.getElementById('ai-input').focus();
}

// Utility Functions
function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    document.querySelector('.app-container').insertBefore(messageDiv, document.querySelector('.app-container').firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Data Persistence
function saveAppState() {
    localStorage.setItem('aiPlanningApp', JSON.stringify(appState));
}

function loadAppState() {
    const saved = localStorage.getItem('aiPlanningApp');
    if (saved) {
        appState = { ...appState, ...JSON.parse(saved) };
    }
}

// Initialize timer stats
updateTimerStats();