const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const themeToggle = document.getElementById("themeToggle");
const chips = document.querySelectorAll(".chip");

let engineState = {
  lastIntent: null,
  lastResponse: null
};

const intents = [
  {
    name: "greeting",
    keywords: ["hello", "hi", "hey", "greetings"],
    responses: [
      "Hello! Nice to meet you. How can I help you today?",
      "Hey there! How can I assist you?",
      "Hi! I'm ready to help out."
    ]
  },
  {
    name: "identity",
    keywords: ["who are you", "your name", "what are you"],
    responses: [
      "I’m Nexa, a rule-based routing engine built to respond using predefined logic.",
      "I am Nexa. I match your keywords to my logic engine to simulate conversation.",
      "They call me Nexa. I'm an AI internship project focused on logic routing."
    ]
  },
  {
    name: "capabilities",
    keywords: ["what can you do", "help", "features"],
    responses: [
      "I can reply to greetings, answer simple questions, tell jokes, and handle basic commands.",
      "Try asking me for a joke, saying hello, or testing my keyword matching!",
      "I route your keywords to my data arrays. Say 'joke' or 'hello' to test it."
    ]
  },
  {
    name: "joke",
    keywords: ["joke", "funny", "laugh"],
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
      "I would tell you a UDP joke, but you might not get it.",
      "There are 10 types of people in the world: those who understand binary, and those who don't."
    ]
  },
  {
    name: "status",
    keywords: ["how are you", "how are things", "status"],
    responses: [
      "My systems are online and routing perfectly. Thanks for asking!",
      "I’m doing great. Ready for your next input.",
      "All logic circuits are firing nicely."
    ]
  },
  {
    name: "gratitude",
    keywords: ["thank you", "thanks", "appreciate"],
    responses: [
      "You’re very welcome!",
      "No problem at all.",
      "Glad I could help!"
    ]
  },
  {
    name: "farewell",
    keywords: ["bye", "goodbye", "see ya", "exit"],
    responses: [
      "Goodbye! Have a great day.",
      "Catch you later. Ending session.",
      "Bye! Feel free to refresh the logic engine anytime."
    ]
  }
];

const fallbackResponses = [
  "Sorry, I didn't catch that. Try using one of the quick prompts.",
  "I don't have a rule for that input yet. Try asking for a joke or saying hello.",
  "That query didn't trigger any of my routes. Can you rephrase?"
];

function scrollChatToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function autoResizeTextarea() {
  userInput.style.height = "auto";
  userInput.style.overflowY = "hidden";

  const maxHeight = 120;
  const newHeight = Math.min(userInput.scrollHeight, maxHeight);

  userInput.style.height = `${newHeight}px`;

  if (userInput.scrollHeight > maxHeight) {
    userInput.style.overflowY = "auto";
  }
}

function createMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `message ${sender} bubble-in`;

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  const tag = document.createElement("small");
  tag.textContent = sender === "user" ? "You" : "Bot";

  message.appendChild(paragraph);
  message.appendChild(tag);
  chatBox.appendChild(message);

  scrollChatToBottom();
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.className = "message bot bubble-in";
  typing.id = "typingIndicator";
  typing.innerHTML = `
    <div class="typing-dots" aria-label="Bot is typing">
      <span></span><span></span><span></span>
    </div>
    <small>Bot</small>
  `;
  chatBox.appendChild(typing);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}

function getBotReply(input) {
  const text = input.toLowerCase().trim();

  for (const intent of intents) {
    const isMatch = intent.keywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(text));

    if (isMatch) {
      let availableResponses = intent.responses;

      if (engineState.lastIntent === intent.name && availableResponses.length > 1) {
        availableResponses = availableResponses.filter(res => res !== engineState.lastResponse);
      }

      const randomIndex = Math.floor(Math.random() * availableResponses.length);
      const selectedResponse = availableResponses[randomIndex];

      engineState.lastIntent = intent.name;
      engineState.lastResponse = selectedResponse;

      return selectedResponse;
    }
  }

  let availableFallbacks = fallbackResponses;
  if (engineState.lastIntent === "fallback") {
      availableFallbacks = availableFallbacks.filter(res => res !== engineState.lastResponse);
  }
  
  const randomFallback = availableFallbacks[Math.floor(Math.random() * availableFallbacks.length)];
  
  engineState.lastIntent = "fallback";
  engineState.lastResponse = randomFallback;
  
  return randomFallback;
}

function handleSubmit(event) {
  event.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  createMessage(text, "user");
  userInput.value = "";
  userInput.style.height = "44px";
  userInput.style.overflowY = "hidden";

  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    createMessage(getBotReply(text), "bot");
  }, 700);
}

userInput.addEventListener("input", autoResizeTextarea);

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

chatForm.addEventListener("submit", handleSubmit);

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    userInput.value = chip.textContent.trim();
    autoResizeTextarea();
    userInput.focus();
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀" : "☾";
});

window.addEventListener("load", () => {
  autoResizeTextarea();
  scrollChatToBottom();
});

window.addEventListener("resize", () => {
  autoResizeTextarea();
  scrollChatToBottom();
});
