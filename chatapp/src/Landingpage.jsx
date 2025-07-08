import Navside from './assets/Navside';
import React, { useState, useEffect } from 'react';
import './Landingpage.css';

function Landingpage() {
  const [activeBox, setActiveBox] = useState('chatbox');
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const userEmail = localStorage.getItem('userEmail');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatList, setChatList] = useState([]);
  const profilePicUrl = selectedUser?.profilePicUrl;
  const [aiMessages, setAiMessages] = useState([]);
const [aiInput, setAiInput] = useState('');
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  // Fetch chat list (users you have chatted with)
  useEffect(() => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return;

  fetch(`http://localhost:3001/api/ai-messages?user_email=${encodeURIComponent(userEmail)}`)
    .then(res => res.json())
    .then(data => setAiMessages(data))
    .catch(err => console.error('Failed to fetch AI messages:', err));
}, []);
  useEffect(() => {
    async function fetchChats() {
      const res = await fetch(`http://localhost:3001/api/chats?user=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      setChatList(data);
    }
    fetchChats();
  }, [userEmail, messages]); // update when messages change

  // Search logic remains the same
  // ...

  
const sendToAI = async (e) => {
  e.preventDefault();
  const userEmail = localStorage.getItem('userEmail');
  const userMessage = {
    role: 'user',
    content: aiInput
  };

  // Save user's message
  await fetch('http://localhost:3001/api/ai-messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_email: userEmail, ...userMessage })
  });

  const updatedMessages = [...aiMessages, userMessage];
  setAiMessages(updatedMessages);
  setAiInput('');

  // Get AI reply
  const res = await fetch('http://localhost:3001/api/chatai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: updatedMessages })
  });

  const data = await res.json();
  const aiReply = data.reply;

  const aiMessage = {
    role: 'assistant',
    content: aiReply.content
  };

  // Save AI reply
  await fetch('http://localhost:3001/api/ai-messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_email: userEmail, ...aiMessage })
  });

  setAiMessages([...updatedMessages, aiMessage]);
};

  return (
    <div className="landingpage-container">
      <Navside />
      <div className="chatmenu">
        <div style={{ position: 'relative', width: '100%', justifyContent: 'center' , display: 'flex' }}>
          <input
           style={{ width: '100%' }}
            className="search"
            type="text"
            placeholder="Search"
            value={search}
            onChange={async (e) => {
              const value = e.target.value;
              setSearch(value);
              if (value.trim()) {
                const res = await fetch(
                  `http://localhost:3001/api/users/search?q=${encodeURIComponent(value)}`
                );
                const data = await res.json();
                setSearchResults(data);
              } else {
                setSearchResults([]);
              }
            }}
          />
          {/* Show search results if searching, else show chat list */}
          {search && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((user) => (
                <div
                  key={user.email}
                  className="search-result-item"
            onClick={async () => {
              try {
                // Fetch full user data
                const userDetailsRes = await fetch(`http://localhost:3001/api/user?email=${encodeURIComponent(user.email)}`);
                const userDetails = await userDetailsRes.json();

                setSelectedUser({ ...user, ...userDetails }); // ✅ combine displayname, email, profile_url

                setSearch('');
                setSearchResults([]);

                const res = await fetch(
                  `http://localhost:3001/api/messages/conversation?user1=${encodeURIComponent(userEmail)}&user2=${encodeURIComponent(user.email)}`
                );
                const data = await res.json();
                setMessages(Array.isArray(data) ? data : []);
              } catch (err) {
                console.error('Failed to load messages:', err);
                setMessages([]);
              }
            }}
                            >
                              {user.displayname}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  <div className="chatmenu-options">Personal Chat</div>
<div className="chatmenu-list">
  {chatList.map((user) => (
    <div
      key={user.email}
      className={`search-result-item${
        selectedUser && selectedUser.email === user.email ? ' selected' : ''
      }`}
      style={{
        height: 30, // allow height to adjust if needed
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '5px',
        padding: '10px 16px',
        cursor: 'pointer',
        backgroundColor:
          selectedUser && selectedUser.email === user.email ? '#D9D9D9' : 'white',
        borderBottom: '1px solid #eee',
      }}
      onClick={async () => {
        try {
          const userDetailsRes = await fetch(
            `http://localhost:3001/api/user?email=${encodeURIComponent(user.email)}`
          );
          const userDetails = await userDetailsRes.json();

          setSelectedUser({ ...user, ...userDetails });

          setSearch('');
          setSearchResults([]);

          const res = await fetch(
            `http://localhost:3001/api/messages/conversation?user1=${encodeURIComponent(
              userEmail
            )}&user2=${encodeURIComponent(user.email)}`
          );
          const data = await res.json();
          setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Failed to load messages:', err);
          setMessages([]);
        }
      }}
    >
      {/* Displayname on the left */}
      <span style={{ fontWeight: '500' }}>{user.displayname}</span>

      {/* Timestamp on the right */}
      <span
        style={{
          fontSize: '12px',
          color: '#888',
          marginLeft: 'auto',
        }}
      >
        {user.last_message_time &&
          new Date(user.last_message_time).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
      </span>
    </div>
  ))}
</div>

        
      </div>
      <div className={`chatbox ${activeBox === 'chatbox' ? 'large' : 'small'}`}>
        <div className="chatbox-name">
          {selectedUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {selectedUser.profile_url && (
        <img
          src={`http://localhost:3001${selectedUser.profile_url}`}
          alt="Profile"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
              )}
              <span>{selectedUser.displayname}</span>
            </div>
          )}
        </div>

        <div className="chatbox-content">
          <div className="messages-list">
            {messages.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>
                No messages yet. Start chatting with{' '}
                {selectedUser ? selectedUser.displayname : 'someone'}!
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.sender === userEmail ? 'me' : 'other'}`}
                >
                  <span>{msg.text}
                    <div style={{ fontSize: 10, color: '#888', marginTop: 4, textAlign: 'right' }}>
                      {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </div>
                  </span>
                </div>
              ))
            )}
          </div>
          <form
            className="chatbox-input"
            onSubmit={async (e) => {
              e.preventDefault();
              if (input.trim() && selectedUser) {
                setMessages([
                  ...messages,
                  { sender: userEmail, recipient: selectedUser.email, text: input },
                ]);
                await fetch('http://localhost:3001/api/messages', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    sender: userEmail,
                    recipient: selectedUser.email,
                    text: input,
                    timestamp: new Date().toISOString(),
                  }),
                });
                setInput('');
              }
            }}
          >
            <input
              type="text"
              className='typemessage'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                borderRadius: 20,
                border: '1px solid #ccc',
                padding: 10,
                fontSize: 16,
              }}
            />
            <button
              type="submit"
              className='chatbox-send'
              style={{
                marginLeft: 8,
                borderRadius: 20,
                padding: '10px 20px',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
      <div className={`chatai ${activeBox === 'chatai' ? 'large' : 'small'}`}>
          <button
            onClick={() => setActiveBox(activeBox === 'chatbox' ? 'chatai' : 'chatbox')}
          >
            Chat with AI
          </button>

          {/* Scrollable AI Messages */}
          <div className="chatbox-content1">
            {aiMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  margin: '8px 0',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  className:'mymessageai'
                }}
              >
                <span
                  className={`chatmess-ai ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>

          {/* Input form stays at bottom using flex layout */}
          <div className="chatai-form-container">
            <form onSubmit={sendToAI} style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className='typemessage'
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask something..."
                
              />
              <button
                type="submit"
                className='chatai-send'
              >
                Send
              </button>
            </form>
          </div>
        </div>

      
    </div>
  );
}

export default Landingpage;