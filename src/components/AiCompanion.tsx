import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  onSuggestionApply?: (section: string, content: string) => void;
}

const AiCompanion = ({ chapterNumber, chapterTitle, currentContent, onSuggestionApply }: AiCompanionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
        "Help me write a problem statement",
        "Suggest research objectives", 
        "Guide me with background context",
        "Help with research questions"
      ],
      2: [
        "Organize my literature themes",
        "Help identify research gaps",
        "Structure theoretical framework",
        "Suggest citation strategies"
      ],
      3: [
        "Choose research methodology",
        "Design data collection plan",
        "Select appropriate sample size",
        "Address ethical considerations"
      ],
      4: [
        "Analyze my findings",
        "Create result interpretations",
        "Link results to objectives",
        "Discuss implications"
      ],
      5: [
        "Summarize key findings",
        "Write strong conclusions",
        "Develop recommendations",
        "Identify limitations"
      ]
    };

    return suggestions[chapterNumber as keyof typeof suggestions] || [];
  };

  const generateAiResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response based on chapter and user input
    const responses: Record<number, Record<string, string>> = {
      1: {
        "problem statement": `For your problem statement, consider these elements:
1. What specific issue are you addressing?
2. Why is this problem important?
3. What gap exists in current knowledge/practice?
4. How will your research contribute to solving this problem?

Example structure: "Despite [current situation], there remains [specific gap] which leads to [consequences]. This research addresses [problem] by [your approach].`,
        
        "research objectives": `Research objectives should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Consider:
1. General objective: Overall aim of your study
2. Specific objectives: 3-5 detailed goals that support the general objective

Format: "To [action verb] [what] [how] [why]"
Example: "To examine the effectiveness of digital marketing strategies on customer engagement in small businesses."`,

        "background": `Your background section should:
1. Start broad, then narrow to your specific topic
2. Establish the importance of your research area
3. Provide context for your research problem
4. Connect to existing knowledge in the field

Structure: General context → Specific area → Your focus → Research gap`,

        "research questions": `Good research questions are:
1. Clear and focused
2. Researchable within your timeframe
3. Aligned with your objectives
4. Open-ended (not yes/no)

Types: Descriptive ("What is...?"), Comparative ("How does X compare to Y?"), Relationship ("What is the relationship between X and Y?")`
      },
      
      2: {
        "literature themes": `Organize your literature by themes, not chronologically. Common themes might be:
1. Theoretical foundations
2. Methodological approaches
3. Key findings and trends
4. Contradictions or debates
5. Gaps and limitations

Create a literature matrix with: Author, Year, Key findings, Methodology, Relevance to your study`,

        "research gaps": `Identify gaps by looking for:
1. Understudied populations or contexts
2. Methodological limitations in existing studies
3. Contradictory findings that need resolution
4. New perspectives or theoretical approaches
5. Practical applications not yet explored

Frame gaps as opportunities for your contribution.`,

        "theoretical framework": `Your theoretical framework should:
1. Define key concepts and variables
2. Explain relationships between concepts
3. Provide lens for data interpretation
4. Connect to your research questions

Include: Main theory/model, supporting theories, visual representation (diagram/model)`
      },

      3: {
        "methodology": `Choose methodology based on:
1. Your research questions (What do you want to know?)
2. Nature of your topic (Quantitative/Qualitative/Mixed)
3. Available resources and time
4. Access to participants/data

Justify why your chosen approach is most appropriate for answering your research questions.`,

        "data collection": `Design your data collection plan:
1. What data do you need?
2. How will you collect it? (surveys, interviews, observations)
3. Who are your participants?
4. When and where will you collect data?
5. What tools/instruments will you use?

Consider validity, reliability, and ethical requirements.`,

        "sample": `Sample size depends on:
1. Research design (qualitative: 8-15 for interviews, quantitative: statistical power analysis)
2. Population characteristics
3. Available resources
4. Saturation point (qualitative)

Justify your sample size and selection method.`
      },

      4: {
        "findings": `Present findings systematically:
1. Organize by research questions/objectives
2. Use clear headings and subheadings
3. Include relevant data (tables, figures, quotes)
4. Describe patterns and trends
5. Highlight key insights

Let the data speak - interpret in discussion section.`,

        "interpretations": `Interpret results by:
1. Explaining what findings mean
2. Connecting to existing literature
3. Addressing research questions
4. Discussing unexpected findings
5. Considering alternative explanations

Support interpretations with evidence from your data.`
      },

      5: {
        "conclusions": `Strong conclusions should:
1. Directly answer research questions
2. Summarize key findings concisely
3. Demonstrate achievement of objectives
4. Avoid introducing new information
5. Connect back to problem statement

Format: Research question → Key finding → Conclusion`,

        "recommendations": `Develop recommendations for:
1. Practice/Implementation
2. Policy (if applicable)
3. Future research
4. Theory development

Make recommendations specific, actionable, and evidence-based from your findings.`
      }
    };

    const chapterResponses = responses[chapterNumber as keyof typeof responses] || {};
    
    // Find matching response based on keywords
    const lowercaseInput = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(chapterResponses)) {
      if (lowercaseInput.includes(key)) {
        return response;
      }
    }

    // Generic helpful response
    return `I understand you need help with "${userMessage}". Based on your current content in Chapter ${chapterNumber}, here are some suggestions:

1. Review your current section structure - does it flow logically?
2. Ensure each section supports your main chapter objective
3. Consider if you need more detail or examples
4. Check that your content aligns with academic writing standards

Would you like me to provide more specific guidance for any particular aspect of Chapter ${chapterNumber}?`;
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
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponse = await generateAiResponse(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "AI Companion Error",
        description: "Sorry, I'm having trouble responding right now. Please try again.",
        variant: "destructive"
      });
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
    <Card className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isExpanded ? 'w-96 h-[600px]' : 'w-80 h-16'
    } shadow-lg border-primary/20`}>
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">AI Companion</CardTitle>
              <p className="text-xs text-muted-foreground">Chapter {chapterNumber} Helper</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
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
        <CardContent className="flex flex-col h-[500px] p-4 pt-0">
          {/* Quick Suggestions */}
          <div className="mb-4">
            <p className="text-xs font-medium mb-2 text-muted-foreground">Quick Help:</p>
            <div className="flex flex-wrap gap-1">
              {getChapterSuggestions().slice(0, 2).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => applySuggestion(suggestion)}
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-muted mr-4'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg text-sm mr-4">
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
          <div className="flex gap-2 pt-4 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask about Chapter ${chapterNumber}...`}
              className="flex-1 text-sm"
              disabled={isLoading}
            />
            <Button 
              size="sm" 
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AiCompanion;