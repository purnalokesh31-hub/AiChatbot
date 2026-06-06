const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chips = document.querySelectorAll(".chip");
const themeToggle = document.getElementById("themeToggle");

const responses = {
  greeting: [
    "Hello! It is great to meet you. How can I help you today?",
    "Hi there! Welcome to Nexa. Ask me anything from my simple rule set.",
    "Hey! I am Nexa, and I am ready to chat with you."
  ],
  identity: [
    "I am Nexa, a rule-based chatbot.",
    "I am Nexa, a chatbot that replies using predefined rules and keyword matching."
  ],
  help: [
    "I can respond to greetings, jokes, identity questions, thanks, and farewells.",
    "Try prompts like hello, who are you, tell me a joke, how are you, or bye."
  ],
  joke: [
    "Why did the computer get glasses? Because it needed better web vision.",
    "Why was the chatbot calm? Because it already had all the answers prepared."
  ],
  thanks: [
    "You are welcome. I am glad I could help.",
    "Happy to help. All the best for your internship project."
  ],
  farewell: [
    "Goodbye! I hope your submission goes really well.",
    "Bye! Wishing you success with your internship task."
  ],
  feeling: [
    "I am doing great. Thanks for asking. How are you?",
    "I am good and fully ready to assist you."
  ],
  fallback: [
    "I am not trained for that yet. Try something like hello, help, joke, or bye.",
    "That is outside my current rules, but I can still handle common chat prompts."
  ]
};

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getBotResponse(message) {
  const text = message.toLowerCase().trim();

  if (/\b(hello|hi|hey|namaste)\b/.test(text)) {
    return pickRandom(responses.greeting);
  } else if (/\b(who are you|what are you|your name)\b/.test(text)) {
    return pickRandom(responses.identity);
  } else if (/\b(help|what can you do|features)\b/.test(text)) {
    return pickRandom(responses.help);
  } else if (/\b(joke|funny|laugh)\b/.test(text)) {
    return pickRandom(responses.joke);
  } else if (/\b(thanks|thank you|thx)\b/.test(text)) {
    return pickRandom(responses.thanks);
  } else if (/\b(bye|goodbye|see you|exit)\b/.test(text)) {
    return pickRandom(responses.farewell);
  } else if (/\b(how are you|how are you doing|how are things)\b/.test(text)) {
    return pickRandom(responses.feeling);
  } else {
    return pickRandom(responses.fallback);
  }
}

function scrollToBottom(behavior = "smooth") {
  requestAnimationFrame(() => {
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: behavior
    });
  });
}

function createMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `message ${sender} bubble-in`;

  const content = document.createElement("p");
  content.textContent = text;

  const label = document.createElement("small");
  label.textContent = sender === "user" ? "You" : "Bot";

  message.appendChild(content);
  message.appendChild(label);

  return message;
}

function addMessage(text, sender) {
  const message = createMessage(text, sender);
  chatBox.appendChild(message);
  scrollToBottom("smooth");
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "message bot bubble-in";
  typing.id = "typingIndicator";
  typing.innerHTML = `
    <div class="typing-dots" aria-label="Bot is typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <small>Bot</small>
  `;
  chatBox.appendChild(typing);
  scrollToBottom("smooth");
}

function removeTyping() {
  const typing = document.getElementById("typingIndicator");
  if (typing) {
    typing.remove();
  }
}

chatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";
  userInput.style.height = "64px";

  showTyping();

  setTimeout(() => {
    removeTyping();
    addMessage(getBotResponse(message), "bot");
  }, 700);
});

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

userInput.addEventListener("input", function () {
  this.style.height = "64px";
  this.style.height = Math.min(this.scrollHeight, 180) + "px";
});

chips.forEach((chip) => {
  chip.addEventListener("click", function () {
    userInput.value = this.textContent;
    userInput.focus();
  });
});

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀" : "☾";
});

window.addEventListener("load", function () {
  scrollToBottom("auto");
});