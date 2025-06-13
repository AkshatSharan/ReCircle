import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, Recycle, Leaf } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const predefinedQuestions = [
  "How do I recycle plastic bottles?",
  "What items can I donate?",
  "Tips for reducing household waste",
  "How does the Green Score work?"
];

const mockResponses = {
  "How do I recycle plastic bottles?": "Great question! Here's how to properly recycle plastic bottles:\n\n1. Remove caps and labels\n2. Rinse out any remaining liquid\n3. Crush the bottle to save space\n4. Place in your curbside recycling bin\n\nMost plastic bottles (PET #1 and HDPE #2) are widely accepted by recycling programs. Check your local guidelines for specific requirements!",
  "What items can I donate?": "You can donate many items through ReCircle! Here are some popular categories:\n\n• Clothing and accessories in good condition\n• Books, DVDs, and games\n• Small furniture and home decor\n• Electronics that still work\n• Toys and sports equipment\n• Kitchen items and appliances\n\nRemember: items should be clean and in working condition. Our matching system helps connect your donations with people who need them most!",
  "Tips for reducing household waste": "Here are some effective ways to reduce waste at home:\n\n🌱 Reduce:\n• Buy only what you need\n• Choose products with minimal packaging\n• Opt for digital receipts and bills\n\n♻️ Reuse:\n• Repurpose containers and jars\n• Donate items instead of throwing away\n• Use both sides of paper\n\n🗂️ Recycle:\n• Learn your local recycling guidelines\n• Clean containers before recycling\n• Separate materials properly\n\nEvery small action counts toward a more sustainable future!",
  "How does the Green Score work?": "Your Green Score reflects your positive environmental impact! Here's how you earn points:\n\n• Item donations: +50 points\n• Successful item matches: +75 points\n• Recycling scans: +25 points\n• Sharing eco-tips: +15 points\n• Community challenges: +100 points\n\nBonus multipliers apply during Earth Week and other special events. Your score helps you climb the leaderboard and unlock achievement badges. Keep making sustainable choices to boost your score!"
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      message: "Hi! I'm EcoBot, your sustainability assistant. I'm here to help you with recycling questions, donation tips, and eco-friendly advice. How can I help you today?",
      isBot: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      isBot: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        message: mockResponses[message] || "Thanks for your question! While I have information about common sustainability topics, I'd recommend checking with your local recycling center for specific guidelines. Is there anything else I can help you with?",
        isBot: true,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuestionClick = (question) => {
    handleSendMessage(question);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">EcoBot Assistant</h1>
        <p className="text-gray-600">
          Get instant help with sustainability questions and eco-friendly tips
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padding="none" className="h-96 lg:h-[32rem] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex max-w-xs lg:max-w-md ${message.isBot ? '' : 'flex-row-reverse'}`}>
                    <div className={`flex-shrink-0 ${message.isBot ? 'mr-2' : 'ml-2'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isBot ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                        {message.isBot ? (
                          <Bot className="text-green-600" size={16} />
                        ) : (
                          <User className="text-blue-600" size={16} />
                        )}
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${message.isBot
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-green-600 text-white'
                      }`}>
                      <p className="text-sm whitespace-pre-line">{message.message}</p>
                      <span className={`text-xs mt-1 block ${message.isBot ? 'text-gray-500' : 'text-green-100'
                        }`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex max-w-xs lg:max-w-md">
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Bot className="text-green-600" size={16} />
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputMessage);
                }}
                className="flex space-x-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about sustainability..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Button type="submit" disabled={!inputMessage.trim() || isTyping}>
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
            <div className="space-y-2">
              {predefinedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center mb-4">
              <Lightbulb className="text-yellow-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Eco Tip of the Day</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                💡 <strong>Did you know?</strong> Crushing plastic bottles before recycling
                can save up to 70% more space in recycling trucks, making the process
                more efficient!
              </p>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Recycle className="text-green-500 mr-2" size={16} />
                  <span className="text-sm text-gray-600">Items Recycled</span>
                </div>
                <span className="font-semibold text-gray-900">28</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Leaf className="text-green-500 mr-2" size={16} />
                  <span className="text-sm text-gray-600">CO₂ Saved</span>
                </div>
                <span className="font-semibold text-gray-900">45 lbs</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}