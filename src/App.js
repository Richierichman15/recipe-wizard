import React, { useState, useEffect } from 'react';
import './App.css';
import OpenAI from 'openai'; 

const App = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [openai, setOpenAI] = useState(null);

  useEffect(() => {
    setOpenAI(new OpenAI({
      apiKey: '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', 
      dangerouslyAllowBrowser: true 
    }));
  }, []);

  const generateChatResponse = async () => {
    if (!openai) {
      console.error('OpenAI not initialized.');
      return 'An error occurred while generating a response.';
    }

    const systemMsg = {
      role: "system",
      content: 
      "you are a helpful cooking assistan, generate a recipe given a list of indgredients.",
  };

  
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [systemMsg,{ role: "user", content: message }],
        model: "gpt-3.5-turbo",
      });

      const aiResponse = chatCompletion.choices[0].message.content;
      return aiResponse;
    } catch (error) {
      console.error('Error generating chat response:', error);
      return 'An error occurred while generating a response.';
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const userMessage = { role: 'user', content: message };
    const aiMessage = { role: 'assistant', content: await generateChatResponse() };

    setChatMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
    setMessage('');
  };

  return (
    <div className="chatbox">
      <div className="chat-content" id="chat-content">
        {chatMessages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? 'message' : 'aiMessage'}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          id="message-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button id="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
