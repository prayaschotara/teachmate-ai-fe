import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

const AssistantChat = () => {
  const { isDarkMode } = useThemeStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your AI teaching assistant. How can I help you today? I can assist with lesson planning, curriculum questions, student engagement strategies, and more!',
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: 2,
      type: 'user',
      content: 'Can you help me create a lesson plan for teaching quadratic equations to Grade 9 students?',
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: 3,
      type: 'assistant',
      content: 'Absolutely! I\'d be happy to help you create an engaging lesson plan for quadratic equations. Here\'s a structured approach:\n\n**Lesson Objectives:**\n- Understand what quadratic equations are\n- Learn the standard form ax² + bx + c = 0\n- Practice solving simple quadratic equations\n\n**Lesson Structure (45 minutes):**\n1. **Warm-up (5 min):** Review linear equations\n2. **Introduction (10 min):** Real-world examples of parabolic motion\n3. **Main Content (20 min):** Introduce quadratic form and basic solving methods\n4. **Practice (8 min):** Guided examples\n5. **Wrap-up (2 min):** Summary and homework assignment\n\nWould you like me to elaborate on any specific part of this lesson plan?',
      timestamp: new Date(Date.now() - 180000),
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'assistant' as const,
        content: 'Thank you for your question! I\'m processing your request and will provide a helpful response. This is a simulated response for demonstration purposes.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className={`${cardClass} rounded-t-2xl border-b p-6`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Teaching Assistant
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your intelligent companion for teaching support
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 ${cardClass} border-x overflow-y-auto p-6 space-y-4`}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.type === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-[70%] ${msg.type === 'user' ? 'order-1' : ''}`}>
              <div
                className={`p-4 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-100'
                    : 'bg-gray-100 text-gray-900'
                } ${msg.type === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>

            {msg.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className={`${cardClass} rounded-b-2xl border-t p-6`}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about teaching, lesson planning, or student engagement..."
              rows={1}
              className={`w-full px-4 py-3 pr-12 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {[
            'Help me create a lesson plan',
            'Suggest engagement activities',
            'Assessment ideas',
            'Classroom management tips',
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setMessage(suggestion)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                isDarkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;