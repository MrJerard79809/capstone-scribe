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
    const lowercaseInput = userMessage.toLowerCase();
    
    // Generate actual content based on the chapter and request
    const contentGenerators: Record<number, Record<string, () => string>> = {
      1: {
        "problem statement": () => `**Generated Problem Statement:**

Despite significant advancements in ${chapterTitle.toLowerCase()}, there remains a critical gap in understanding how current approaches address the evolving challenges in this field. This gap has resulted in limited practical solutions and theoretical frameworks that adequately address the complex nature of the problem.

This research addresses the need for a comprehensive analysis of ${chapterTitle.toLowerCase()} by examining current practices, identifying key challenges, and proposing evidence-based solutions that can enhance both theoretical understanding and practical applications in the field.

*Click "Apply Content" to add this to your document.*`,

        "research objectives": () => `**Generated Research Objectives:**

**General Objective:**
To investigate and analyze the current state of ${chapterTitle.toLowerCase()} and develop evidence-based recommendations for improvement.

**Specific Objectives:**
1. To examine the current practices and approaches in ${chapterTitle.toLowerCase()}
2. To identify key challenges and limitations in existing methodologies
3. To analyze the effectiveness of current solutions and interventions
4. To develop practical recommendations for enhancing outcomes
5. To contribute to the theoretical understanding of the field

*Click "Apply Content" to add these objectives to your document.*`,

        "background": () => `**Generated Background Section:**

The field of ${chapterTitle.toLowerCase()} has experienced significant evolution over the past decade, driven by technological advancements, changing societal needs, and emerging research findings. Understanding the historical context and current landscape is essential for identifying areas that require further investigation.

Recent studies have highlighted several key trends in this area, including the increasing complexity of challenges, the need for interdisciplinary approaches, and the growing importance of evidence-based solutions. However, despite these advances, significant gaps remain in our understanding of how to effectively address the multifaceted nature of the problems encountered in this field.

The importance of this research lies in its potential to bridge existing gaps between theory and practice, providing valuable insights that can inform future policy, practice, and research directions.

*Click "Apply Content" to add this background to your document.*`,

        "research questions": () => `**Generated Research Questions:**

**Primary Research Question:**
How can current approaches to ${chapterTitle.toLowerCase()} be enhanced to better address contemporary challenges and improve outcomes?

**Secondary Research Questions:**
1. What are the key factors that influence success in current practices?
2. What barriers exist that limit the effectiveness of existing approaches?
3. How do stakeholders perceive the current state of practice in this field?
4. What evidence-based strategies show the most promise for improvement?
5. How can theoretical frameworks be better aligned with practical applications?

*Click "Apply Content" to add these research questions to your document.*`
      },

      2: {
        "literature themes": () => `**Generated Literature Review Themes:**

**Theme 1: Theoretical Foundations**
The literature reveals several key theoretical frameworks that underpin current understanding of ${chapterTitle.toLowerCase()}. These include [relevant theories] which provide the conceptual foundation for this field of study.

**Theme 2: Methodological Approaches**
Research in this area has employed diverse methodological approaches, ranging from quantitative surveys to qualitative case studies. The literature shows a trend toward mixed-methods approaches that capitalize on the strengths of both paradigms.

**Theme 3: Key Findings and Patterns**
Across multiple studies, consistent patterns emerge regarding the factors that influence success and the challenges that persist in this field. These findings provide important insights for future research and practice.

**Theme 4: Gaps and Contradictions**
While the literature provides valuable insights, several gaps and contradictions exist that warrant further investigation. These areas represent opportunities for meaningful contribution to the field.

*Click "Apply Content" to add these themes to your document.*`,

        "gap analysis": () => `**Generated Gap Analysis:**

**Identified Research Gaps:**

1. **Methodological Gaps:** Limited longitudinal studies examining the long-term effects of interventions in ${chapterTitle.toLowerCase()}.

2. **Population Gaps:** Insufficient research focusing on diverse populations and contexts, particularly underrepresented groups.

3. **Theoretical Gaps:** Lack of comprehensive theoretical frameworks that integrate multiple perspectives and approaches.

4. **Practical Gaps:** Limited research on the translation of theoretical findings into practical applications and real-world implementations.

5. **Measurement Gaps:** Absence of standardized assessment tools and outcome measures specific to this field.

**Opportunities for Contribution:**
This study addresses these gaps by providing [specific contributions your research will make], thereby advancing both theoretical understanding and practical applications in the field.

*Click "Apply Content" to add this gap analysis to your document.*`
      },

      3: {
        "methodology": () => `**Generated Methodology Section:**

**Research Design:**
This study employs a [mixed-methods/quantitative/qualitative] research design to comprehensively investigate ${chapterTitle.toLowerCase()}. This approach was selected because it allows for both breadth and depth of understanding while addressing the research objectives effectively.

**Research Approach:**
The research follows a [descriptive/exploratory/explanatory] approach, enabling systematic investigation of the research questions while maintaining flexibility to explore emerging themes and patterns.

**Justification:**
This methodological approach is most appropriate for this study because it:
- Aligns with the research objectives and questions
- Allows for comprehensive data collection and analysis
- Provides both statistical significance and contextual understanding
- Enables triangulation of findings for enhanced validity

**Data Collection Strategy:**
Data will be collected through multiple sources to ensure comprehensive coverage of the research topic and enhance the reliability of findings.

*Click "Apply Content" to add this methodology to your document.*`,

        "data collection": () => `**Generated Data Collection Plan:**

**Data Collection Methods:**

1. **Primary Data Collection:**
   - Surveys: Structured questionnaires to gather quantitative data from participants
   - Interviews: Semi-structured interviews to explore experiences and perspectives in depth
   - Observations: Systematic observation of practices and behaviors in natural settings

2. **Secondary Data Collection:**
   - Document analysis: Review of relevant reports, policies, and organizational documents
   - Literature review: Systematic analysis of existing research and publications
   - Archival data: Historical records and databases relevant to the study

**Data Collection Timeline:**
- Phase 1 (Months 1-2): Secondary data collection and literature review
- Phase 2 (Months 3-4): Survey data collection
- Phase 3 (Months 5-6): Interview data collection
- Phase 4 (Months 7-8): Data analysis and interpretation

**Quality Assurance:**
All data collection procedures will follow established protocols to ensure reliability, validity, and ethical compliance.

*Click "Apply Content" to add this data collection plan to your document.*`
      },

      4: {
        "results summary": () => `**Generated Results Summary:**

**Overview of Findings:**
The data analysis revealed several significant findings related to ${chapterTitle.toLowerCase()}. The results are organized according to the research objectives and questions, providing a systematic presentation of the key discoveries.

**Key Findings:**

1. **Primary Finding:** The analysis indicates that [describe main finding based on your research focus]

2. **Supporting Findings:** 
   - Participants demonstrated significant variation in [relevant aspect]
   - Strong correlations were found between [relevant variables]
   - Qualitative themes emerged around [key themes]

3. **Unexpected Findings:** 
   The data revealed some unexpected patterns, particularly regarding [describe unexpected results]

**Statistical Significance:**
The results show statistically significant relationships (p < 0.05) between key variables, supporting the research hypotheses and providing confidence in the findings.

**Summary:**
These findings contribute to our understanding of ${chapterTitle.toLowerCase()} and provide evidence for the recommendations presented in the following sections.

*Click "Apply Content" to add this results summary to your document.*`,

        "data analysis": () => `**Generated Data Analysis Section:**

**Analytical Approach:**
The data analysis followed a systematic approach designed to address each research objective comprehensively. Both quantitative and qualitative analytical techniques were employed to maximize the insights gained from the collected data.

**Quantitative Analysis:**
- Descriptive statistics were calculated to summarize participant characteristics and key variables
- Inferential statistics (t-tests, ANOVA, correlation analysis) were used to test hypotheses
- Effect sizes were calculated to determine the practical significance of findings

**Qualitative Analysis:**
- Thematic analysis was conducted to identify patterns and themes in interview data
- Coding procedures followed established qualitative research protocols
- Member checking was employed to enhance the credibility of interpretations

**Data Integration:**
The quantitative and qualitative findings were integrated through a convergent parallel design, allowing for triangulation of results and enhanced understanding of the research topic.

**Validation Procedures:**
Multiple validation strategies were employed including peer debriefing, member checking, and triangulation to ensure the trustworthiness of the findings.

*Click "Apply Content" to add this data analysis section to your document.*`
      },

      5: {
        "conclusion summary": () => `**Generated Conclusion Summary:**

**Research Summary:**
This study investigated ${chapterTitle.toLowerCase()} through a comprehensive research approach that addressed the identified gaps in existing literature. The research successfully achieved its objectives and provided valuable insights into the field.

**Key Contributions:**
1. **Theoretical Contribution:** The study provides new theoretical insights that enhance understanding of [relevant concepts]
2. **Methodological Contribution:** The research methodology offers a framework for future studies in this area
3. **Practical Contribution:** The findings provide evidence-based recommendations for practitioners and policymakers

**Research Questions Addressed:**
Each research question was systematically addressed through the data collection and analysis process:
- The primary research question was answered through [summarize key finding]
- Secondary questions provided additional insights into [supporting findings]

**Significance of Findings:**
The results of this study are significant because they [explain the importance and implications of your findings for the field].

*Click "Apply Content" to add this conclusion summary to your document.*`,

        "recommendations": () => `**Generated Recommendations:**

Based on the findings of this research, the following recommendations are proposed:

**Recommendations for Practice:**
1. **Implementation Recommendation:** Practitioners should consider adopting [specific practice] based on the evidence that it [explain benefit]
2. **Training Recommendation:** Professional development programs should incorporate [specific training elements] to enhance effectiveness
3. **Policy Recommendation:** Organizations should develop policies that support [specific policy area] to improve outcomes

**Recommendations for Future Research:**
1. **Longitudinal Studies:** Future research should examine the long-term effects of the interventions identified in this study
2. **Comparative Studies:** Research comparing different approaches to ${chapterTitle.toLowerCase()} would provide valuable insights
3. **Diverse Populations:** Studies involving diverse populations and contexts would enhance the generalizability of findings

**Implementation Considerations:**
- Resource requirements and feasibility should be considered when implementing recommendations
- Stakeholder engagement is crucial for successful implementation
- Monitoring and evaluation systems should be established to assess effectiveness

*Click "Apply Content" to add these recommendations to your document.*`
      }
    };

    // Check if this is a content generation request
    const generators = contentGenerators[chapterNumber] || {};
    for (const [key, generator] of Object.entries(generators)) {
      if (lowercaseInput.includes(key.split(' ')[0])) { // Match on first word (generate, write, create, draft)
        return generator();
      }
    }

    // If not a specific content generation request, provide guidance
    return `I can help you generate specific content for Chapter ${chapterNumber}. Try asking me to:

• "Generate a problem statement"
• "Write research objectives" 
• "Create a background section"
• "Draft research questions"

Or describe what specific content you need, and I'll create it for you to review and apply to your document.

What would you like me to help you write?`;
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
        content: cleanText(aiResponse),
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
                      {message.type === 'ai' && message.content.includes('Apply Content') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 text-xs h-7 px-3"
                          onClick={() => {
                          // Extract the generated content (everything before the apply instruction)
                          const generatedText = message.content.split('*Click "Apply Content"')[0].trim();
                          
                          // Clean up the content by removing markdown formatting
                          let cleanContent = generatedText
                            .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **bold** formatting
                            .replace(/^\*\*Generated [^:]+:\*\*\s*/gm, '') // Remove "Generated X:" headers
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