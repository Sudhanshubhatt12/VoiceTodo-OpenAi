import { getCompletion } from "./OpenAi-Integration.js";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Your browser doesn't support Speech Recognition");
} else {
    const recognition = new SpeechRecognition();
    const todoList = document.getElementById('todo-list');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const status = document.getElementById('status');
    let todos = [];

    recognition.continuous = false;
    recognition.interimResults = false;

    // Verify elements exist
    if (!startBtn || !stopBtn || !status || !todoList) {
        console.error('Required DOM elements not found');
        alert('Error: Required page elements are missing');
        throw new Error('DOM elements not found');
    }

    // Start button handler
    startBtn.addEventListener('click', () => {
        try {
            console.log('Start button clicked'); // Debug log
            recognition.start();
            startBtn.disabled = true;
            stopBtn.disabled = false;
            status.textContent = 'Listening... Say a command';
            status.classList.add('listening');
        } catch (error) {
            console.error('Error starting recognition:', error);
            status.textContent = `Error starting: ${error.message}`;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            status.classList.remove('listening');
            // Request microphone permission explicitly
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => status.textContent = 'Please try again - microphone permission granted')
                .catch(err => status.textContent = `Microphone permission denied: ${err.message}`);
        }
    });

    stopBtn.addEventListener('click', () => {
        try {
            console.log('Stop button clicked'); // Debug log
            recognition.stop();
            startBtn.disabled = false;
            stopBtn.disabled = true;
            status.textContent = 'Stopped listening';
            status.classList.remove('listening');
        } catch (error) {
            console.error('Error stopping recognition:', error);
            status.textContent = `Error stopping: ${error.message}`;
        }
    });

    recognition.onresult = async (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        status.textContent = `Heard: "${transcript}"`;
        
        if (transcript.toLowerCase().startsWith('add')) {
            const taskDescription = transcript.replace(/add/i, '').trim();
            if (taskDescription) {
                try {
                    const taskDetails = await getCompletion(taskDescription);
                    addTodo(taskDetails);
                    speak(`Added task: ${taskDetails.task}${taskDetails.dueDate ? ', due ' + taskDetails.dueDate : ''}`);
                } catch (error) {
                    console.error('Error processing task:', error);
                    speak('Error processing your task');
                }
            }
        } else if (transcript.toLowerCase().startsWith('remove')) {
            const number = parseInt(transcript.replace(/remove/i, '').trim());
            if (!isNaN(number) && number > 0 && number <= todos.length) {
                const removed = todos.splice(number - 1, 1)[0];
                updateTodoList();
                speak(`Removed: ${removed.task || removed}`);
            }
        } else if (transcript.toLowerCase() === 'clear') {
            todos = [];
            updateTodoList();
            speak('All todos cleared');
        } else if (transcript.toLowerCase() === 'list') {
            if (todos.length > 0) {
                const todoText = todos.map((todo, index) => 
                    `${index + 1}. ${todo.task || todo}${todo.dueDate ? ' (due ' + todo.dueDate + ')' : ''}`
                ).join(', ');
                speak(`Your todos: ${todoText}`);
            } else {
                speak('No todos found');
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('Recognition error:', event.error);
        status.textContent = `Error: ${event.error}`;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        status.classList.remove('listening');
    };

    recognition.onstart = () => {
        console.log('Speech recognition started');
    };

    recognition.onend = () => {
        console.log('Speech recognition ended');
    };

    function addTodo(taskDetails) {
        todos.push(taskDetails);
        updateTodoList();
    }

    function updateTodoList() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            const text = typeof todo === 'string' 
                ? todo 
                : `${todo.task}${todo.description ? ' - ' + todo.description : ''}${todo.priority ? ' [' + todo.priority + ']' : ''}${todo.dueDate ? ' (due ' + todo.dueDate + ')' : ''}`;
            li.textContent = `${index + 1}. ${text}`;
            todoList.appendChild(li);
        });
    }

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}