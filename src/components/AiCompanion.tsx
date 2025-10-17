import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  Lightbulb,
  MessageCircle,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AiCompanionProps {
  chapterNumber: number;
  chapterTitle: string;
  currentContent: {
    introduction: string;
    sections: { title: string; content: string; }[];
    conclusion: string;
  };
  onContentGenerated?: (sectionType: 'introduction' | 'section' | 'conclusion', content: string, sectionIndex?: number) => void;
}

const AiCompanion = ({ chapterNumber, chapterTitle, currentContent, onContentGenerated }: AiCompanionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [pendingContent, setPendingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Clean special characters from AI responses
  const cleanText = (text: string) => {
    return text.replace(/[*#_~`]/g, '');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message based on chapter
  useEffect(() => {
    const welcomeMessages = {
      1: `Hello! I'm your AI companion for Chapter 1 - Introduction. I'm here to help you craft a compelling introduction to your capstone project. I can assist with background information, problem statements, objectives, and research questions.`,
      2: `Welcome to Chapter 2 - Literature Review! I'll help you organize your literature review, identify key themes, find gaps in existing research, and structure your theoretical framework.`,
      3: `Ready for Chapter 3 - Methodology! I'll guide you through research design, data collection methods, participant selection, ethical considerations, and analytical approaches.`,
      4: `Time for Chapter 4 - Results & Analysis! I can help you present findings clearly, create data interpretations, discuss implications, and link results to your research questions.`,
      5: `Chapter 5 - Conclusion & Recommendations! I'll assist with summarizing key findings, drawing conclusions, providing recommendations, and discussing limitations and future research directions.`
    };

    const welcomeMessage: Message = {
      id: `welcome-${chapterNumber}`,
      type: 'ai',
      content: welcomeMessages[chapterNumber as keyof typeof welcomeMessages] || `Welcome! I'm here to help with your capstone project.`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
  }, [chapterNumber]);

  const getChapterSuggestions = () => {
    const suggestions = {
      1: [
        "Generate a problem statement",
        "Write research objectives", 
        "Create background section",
        "Draft research questions"
      ],
      2: [
        "Generate literature themes",
        "Write gap analysis",
        "Create theoretical framework",
        "Draft literature summary"
      ],
      3: [
        "Write methodology section",
        "Create data collection plan",
        "Generate ethical considerations",
        "Draft sample description"
      ],
      4: [
        "Generate results summary",
        "Create data analysis",
        "Write findings discussion",
        "Draft implications section"
      ],
      5: [
        "Generate conclusion summary",
        "Write recommendations",
        "Create limitations section",
        "Draft future research"
      ]
    };

    return suggestions[chapterNumber as keyof typeof suggestions] || [];
  };

  const generateAiResponse = async (userMessage: string): Promise<string> => {
    try {
      // Call the backend AI function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/capstone-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            message: userMessage,
            chapterNumber,
            chapterTitle,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  };


  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAiResponse(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      toast({
        title: "Unable to respond",
        description: errorMessage.includes('Rate limit') 
          ? "Too many requests. Please wait a moment and try again."
          : errorMessage.includes('credits')
          ? "AI credits depleted. Please contact support."
          : "I'm having trouble responding. Please try again.",
        variant: "destructive"
      });
      
      // Add an error message to chat
      const errorAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const applySuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  if (chapterNumber > 5) {
    return null; // Only show for chapters 1-5
  }

  return (
    <Card className={`fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 transition-all duration-300 ${
      isExpanded 
        ? 'w-[calc(100vw-1rem)] sm:w-96 h-[85vh] sm:h-[600px]' 
        : 'w-[calc(100vw-1rem)] sm:w-80 h-14 sm:h-16'
    } shadow-lg border-primary/20`}>
      <CardHeader className="pb-2 cursor-pointer p-3 sm:p-4" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xs sm:text-sm truncate">AI Companion</CardTitle>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Chapter {chapterNumber} Helper</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Badge variant="outline" className="text-[10px] sm:text-xs hidden sm:flex">
              <Sparkles className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="flex flex-col p-0">
          <div className="flex flex-col h-[calc(85vh-4rem)] sm:h-[540px]">
            {/* Quick Suggestions */}
            <div className="px-3 sm:px-4 pt-2 sm:pt-3 pb-2">
              <p className="text-[10px] sm:text-xs font-medium mb-1.5 text-muted-foreground">Quick Help:</p>
              <div className="flex flex-wrap gap-1.5">
                {getChapterSuggestions().slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-[10px] sm:text-xs h-7 px-2"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <Lightbulb className="h-3 w-3 mr-1 shrink-0" />
                    <span className="truncate">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="my-2" />

            {/* Messages */}
            <ScrollArea className="flex-1 px-3 sm:px-4">
              <div className="space-y-3 py-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm leading-relaxed ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                      {message.type === 'ai' && message.content.toLowerCase().includes('apply content') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 text-xs h-7 px-3"
                          onClick={() => {
                            // Extract the generated content (everything before the apply instruction)
                            const contentParts = message.content.split(/Click ['"]Apply Content['"]/i);
                            const generatedText = contentParts[0].trim();
                            
                            // Clean up the content by removing markdown formatting
                            let cleanContent = generatedText
                              .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **bold** formatting
                              .replace(/^\*\*Generated [^:]+:\*\*\s*/gm, '') // Remove "Generated X:" headers
                              .replace(/^Generated [^:]+:\s*/gm, '') // Remove "Generated X:" without asterisks
                              .replace(/^#+\s+/gm, '') // Remove markdown headers
                              .trim();

                            setPendingContent(cleanContent);
                            setShowApplyDialog(true);
                          }}
                        >
                          Apply Content
                        </Button>
                      )}
                      <div className="text-[10px] sm:text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2 p-3 sm:p-4 border-t bg-background/95">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about Chapter ${chapterNumber}...`}
                className="flex-1 text-xs sm:text-sm h-9"
                disabled={isLoading}
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="px-3 h-9 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}

      {/* Apply Content Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm sm:text-base">Where would you like to apply this content?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button
              onClick={() => {
                onContentGenerated?.('introduction', pendingContent);
                setShowApplyDialog(false);
                toast({
                  title: "Content Applied",
                  description: "Content added to Introduction section."
                });
              }}
              variant="outline"
              className="w-full justify-start"
            >
              Introduction Section
            </Button>
            
            {currentContent.sections.map((section, index) => (
              <Button
                key={index}
                onClick={() => {
                  onContentGenerated?.('section', pendingContent, index);
                  setShowApplyDialog(false);
                  toast({
                    title: "Content Applied",
                    description: `Content added to ${section.title || `Section ${index + 1}`}.`
                  });
                }}
                variant="outline"
                className="w-full justify-start"
              >
                {section.title || `Section ${index + 1}`}
              </Button>
            ))}
            
            <Button
              onClick={() => {
                onContentGenerated?.('conclusion', pendingContent);
                setShowApplyDialog(false);
                toast({
                  title: "Content Applied",
                  description: "Content added to Conclusion section."
                });
              }}
              variant="outline"
              className="w-full justify-start"
            >
              Conclusion Section
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </Card>
  );
};

export default AiCompanion;