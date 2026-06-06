const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const themeToggle = document.getElementById("themeToggle");
const chips = document.querySelectorAll(".chip");

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

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello! Nice to meet you. How can I help you today?";
  } else if (text.includes("who are you") || text.includes("your name")) {
    return "I’m Nexa, a rule-based chatbot built to respond using predefined logic.";
  } else if (text.includes("what can you do") || text.includes("help")) {
    return "I can reply to greetings, simple questions, jokes, thanks, and farewell messages.";
  } else if (text.includes("joke")) {
    return "Why do programmers prefer dark mode? Because light attracts bugs.";
  } else if (text.includes("how are you")) {
    return "I’m doing great. Thanks for asking!";
  } else if (text.includes("thank you") || text.includes("thanks")) {
    return "You’re welcome!";
  } else if (text.includes("bye")) {
    return "Goodbye! Have a nice day.";
  } else {
    return "Sorry, I did not understand that. Try using one of the quick prompts.";
  }
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
