import { getCompletion as processWithAI } from "./OpenAi-Integration.js";

const taskStore = new Map();

document.addEventListener('DOMContentLoaded', () => {
    const voiceButton = document.querySelector('.voice-btn');
    if (voiceButton) {
        voiceButton.addEventListener('click', startListening);
    }
});

function clearTaskOutput() {
    const taskInfo = document.querySelector('.task-info');
    if (taskInfo) {
        document.getElementById('operation').textContent = '';
        document.getElementById('task').textContent = '';
        document.getElementById('urgency').textContent = '';
        document.getElementById('datetime').textContent = '';
    }
    const confirmationArea = document.getElementById('confirmation-area');
    if (confirmationArea) {
        confirmationArea.innerHTML = '';
    }
}

function startListening() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('Listening...');
            clearTaskOutput();
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            processVoiceCommand(transcript);
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
        };

        recognition.start();
    } else {
        alert('Speech recognition not supported in this browser.');
    }
   
}

async function processVoiceCommand(command) {
    try {
        console.log("hello");
        const aiResp = await processWithAI(command);
        const aiResponse = JSON.parse(aiResp.choices[0].message.content);
        const requestBody = {
            operation: aiResponse.operation,
            task: aiResponse.task,
            urgency: aiResponse.urgency,
            datetime: aiResponse.datetime
        };

        const response = await fetch("http://localhost:8080/api/tasks", {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            // Handle successful response
        } else {
            console.log('Request unsuccessful');
            throw new Error(`Http error with status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error processing command:', error);
    }
}