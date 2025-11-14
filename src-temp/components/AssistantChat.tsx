import { useState } from 'react';
import { Send, Mic, Flag, Bot, User } from 'lucide-react';

interface AssistantChatProps {
  isDarkMode: boolean;
}

const AssistantChat = ({ isDarkMode }: AssistantChatProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm your TeachMate AI assistant. How can I help you today? I can assist with lesson planning, content recommendations, student progress insights, and more!",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      sender: 'user',
      text: "Can you suggest some engaging activities for teaching photosynthesis to Grade 9 students?",
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      sender: 'ai',
      text: "Great question! Here are some engaging activities for teaching photosynthesis:\n\n1. Leaf Chromatography Lab - Students extract and separate pigments from leaves\n2. Interactive Simulation - Use virtual labs to manipulate variables like light intensity\n3. Plant Growth Experiment - Track growth with different light conditions over 2 weeks\n4. Photosynthesis Role Play - Students act as different components (chloroplasts, water, CO2)\n5. Real-time Data Collection - Use probes to measure oxygen production in aquatic plants\n\nWould you like detailed lesson plans for any of these activities?",
      timestamp: new Date(Date.now() - 180000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        text: "I'd be happy to help with that! Based on your curriculum requirements and student needs, I recommend...",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClass = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className={`${cardClass} rounded-2xl border shadow-lg flex flex-col h-[calc(100vh-16rem)]`}>
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-cyan-600 to-blue-600' : 'bg-gradient-to-br from-cyan-500 to-blue-500'} shadow-lg`}>
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Teaching Assistant
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Always here to help
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'ai'
                    ? isDarkMode
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-600'
                      : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                    : isDarkMode
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {message.sender === 'ai' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>

                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'ai'
                        ? isDarkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                  <span className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-cyan-600 to-blue-600' : 'bg-gradient-to-br from-cyan-500 to-blue-500'}`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className={`px-4 py-3 rounded-2xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '0ms' }} />
                    <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '150ms' }} />
                    <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} animate-bounce`} style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about teaching..."
                className={`flex-1 px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
              <button className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}>
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className={`w-full text-left px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} transition-colors text-sm`}>
              Suggest lesson activities
            </button>
            <button className={`w-full text-left px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} transition-colors text-sm`}>
              Find teaching resources
            </button>
            <button className={`w-full text-left px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} transition-colors text-sm`}>
              Generate quiz questions
            </button>
            <button className={`w-full text-left px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} transition-colors text-sm`}>
              Explain a concept
            </button>
            <button className={`w-full text-left px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} transition-colors text-sm`}>
              Student progress insights
            </button>
          </div>
        </div>

        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <Flag className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Flagged for Review
            </h3>
          </div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            No items flagged for tutor follow-up yet.
          </p>
          <button className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors text-sm`}>
            View History
          </button>
        </div>

        <div className={`${cardClass} rounded-2xl border shadow-lg p-6`}>
          <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Topics
          </h3>
          <div className="space-y-2">
            {['Photosynthesis activities', 'Quadratic equations', 'Lab safety tips', 'Grammar exercises'].map((topic, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;
