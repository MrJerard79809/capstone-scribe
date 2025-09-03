import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Download, Copy, Sparkles, ChevronDown, ChevronRight, Target, FileText, Clock, CheckCircle, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateTitleOptions, generateCapstoneProjectWithTitle } from '@/lib/titleGenerator';
import DocumentEditor from './DocumentEditor';

interface GeneratedProject {
  mainTitle: string;
  chapters: {
    number: number;
    title: string;
    description: string;
    objectives: string[];
    sections: {
      title: string;
      content: string;
    }[];
    expectedPages: string;
    keyComponents: string[];
  }[];
}

const CapstoneGenerator = () => {
  const [formData, setFormData] = useState({
    field: '',
    topic: '',
    keywords: '',
    researchType: ''
  });
  const [titleOptions, setTitleOptions] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  const [isEditingDocument, setIsEditingDocument] = useState(false);
  const [step, setStep] = useState<'form' | 'title-selection' | 'document'>('form');
  const { toast } = useToast();

  const toggleChapter = (chapterNumber: number) => {
    setExpandedChapters(prev => 
      prev.includes(chapterNumber) 
        ? prev.filter(n => n !== chapterNumber)
        : [...prev, chapterNumber]
    );
  };

  const expandAllChapters = () => {
    if (!generatedProject) return;
    setExpandedChapters(generatedProject.chapters.map(c => c.number));
  };

  const collapseAllChapters = () => {
    setExpandedChapters([]);
  };

  const handleGenerateTitles = async () => {
    if (!formData.field || !formData.topic) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the field of study and research topic.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const titles = generateTitleOptions(formData);
      setTitleOptions(titles);
      setStep('title-selection');
      toast({
        title: "Success!",
        description: "Title options have been generated. Please select your preferred title."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate titles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title);
  };

  const handleGenerateDocument = async () => {
    if (!selectedTitle) {
      toast({
        title: "No Title Selected",
        description: "Please select a title before generating the document.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingDocument(true);
    try {
      const project = generateCapstoneProjectWithTitle(formData, selectedTitle);
      setGeneratedProject(project);
      setStep('document');
      toast({
        title: "Success!",
        description: "Your complete capstone project has been generated."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingDocument(false);
    }
  };

  const handleBackToForm = () => {
    setStep('form');
    setTitleOptions([]);
    setSelectedTitle('');
    setGeneratedProject(null);
  };

  const handleBackToTitles = () => {
    setStep('title-selection');
    setSelectedTitle('');
    setGeneratedProject(null);
  };

  const handleCopy = () => {
    if (!generatedProject) return;
    
    const text = `${generatedProject.mainTitle}\n\n${generatedProject.chapters.map(
      (chapter) => `Chapter ${chapter.number}: ${chapter.title}\n${chapter.description}`
    ).join('\n\n')}`;
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Project structure copied to clipboard."
    });
  };

  const handleStartWriting = () => {
    setIsEditingDocument(true);
  };

  const handleBackToGenerator = () => {
    setIsEditingDocument(false);
  };

  // Render DocumentEditor if in editing mode
  if (isEditingDocument && generatedProject) {
    return (
      <DocumentEditor 
        initialProject={generatedProject}
        onBack={handleBackToGenerator}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 pt-4 sm:pt-0">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-academic bg-clip-text text-transparent">
              Capstone Project Generator
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Generate professional titles and structure for your capstone project with AI-powered academic formatting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Input Form - Step 1 */}
        {(step === 'form' || step === 'title-selection') && (
          <Card className="shadow-elegant lg:sticky lg:top-8 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="field">Field of Study *</Label>
                <Select 
                  value={formData.field} 
                  onValueChange={(value) => setFormData({...formData, field: value})}
                  disabled={step === 'title-selection'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your field of study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="business">Business Administration</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="psychology">Psychology</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="social-sciences">Social Sciences</SelectItem>
                    <SelectItem value="natural-sciences">Natural Sciences</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Research Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Machine Learning in Healthcare"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  disabled={step === 'title-selection'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (Optional)</Label>
                <Input
                  id="keywords"
                  placeholder="e.g., AI, medical diagnosis, deep learning"
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  disabled={step === 'title-selection'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="researchType">Research Type</Label>
                <Select 
                  value={formData.researchType} 
                  onValueChange={(value) => setFormData({...formData, researchType: value})}
                  disabled={step === 'title-selection'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select research approach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quantitative">Quantitative Research</SelectItem>
                    <SelectItem value="qualitative">Qualitative Research</SelectItem>
                    <SelectItem value="mixed">Mixed Methods</SelectItem>
                    <SelectItem value="experimental">Experimental</SelectItem>
                    <SelectItem value="case-study">Case Study</SelectItem>
                    <SelectItem value="theoretical">Theoretical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {step === 'form' && (
                <Button 
                  onClick={handleGenerateTitles} 
                  disabled={isGenerating}
                  className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-base font-medium"
                >
                  {isGenerating ? "Generating Titles..." : "Generate Title Options"}
                </Button>
              )}

              {step === 'title-selection' && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToForm}
                    className="flex-1 h-12 text-base"
                  >
                    Back to Form
                  </Button>
                  <Button 
                    onClick={handleGenerateDocument} 
                    disabled={isGeneratingDocument || !selectedTitle}
                    className="flex-1 h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-base font-medium"
                  >
                    {isGeneratingDocument ? "Generating Document..." : "Generate Full Document"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Title Selection - Step 2 */}
        {step === 'title-selection' && (
          <Card className="shadow-elegant animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Target className="h-5 w-5 text-primary" />
                Select Your Preferred Title
              </CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground">
                Choose from these professionally generated titles for your capstone project
              </p>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {titleOptions.map((title, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md hover-scale touch-manipulation ${
                    selectedTitle === title 
                      ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                      : 'hover:bg-muted/30'
                  }`}
                  onClick={() => handleTitleSelect(title)}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        selectedTitle === title 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      }`}>
                        {selectedTitle === title && (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base leading-relaxed">{title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Option {index + 1} - Tap to select this title
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Document View - Step 3 */}
        {step === 'document' && generatedProject && (
          <div className="lg:col-span-2">
            <Card className="shadow-elegant animate-fade-in">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg sm:text-xl">Generated Project Structure</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleBackToTitles}
                    className="flex-1 sm:flex-none"
                  >
                    Change Title
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleStartWriting}
                    className="bg-gradient-primary hover:shadow-glow flex-1 sm:flex-none"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Start Writing
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1 sm:flex-none">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Title */}
              <div className="p-4 bg-gradient-subtle rounded-lg border">
                <h3 className="font-semibold text-primary mb-2">Project Title</h3>
                <p className="text-lg font-medium">{generatedProject.mainTitle}</p>
              </div>

              {/* Chapter Controls */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={expandAllChapters} className="flex-1 sm:flex-none">
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAllChapters} className="flex-1 sm:flex-none">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Collapse All
                </Button>
              </div>

              {/* Interactive Chapters */}
              <div className="space-y-4">
                {generatedProject.chapters.map((chapter) => (
                  <Collapsible 
                    key={chapter.number}
                    open={expandedChapters.includes(chapter.number)}
                    onOpenChange={() => toggleChapter(chapter.number)}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 touch-manipulation">
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-start sm:items-center justify-between gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <Badge variant="secondary" className="bg-primary/10 text-primary self-start">
                                Chapter {chapter.number}
                              </Badge>
                              <CardTitle className="text-base sm:text-lg leading-tight">{chapter.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                              {expandedChapters.includes(chapter.number) ? 
                                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                              }
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground text-left mt-2">
                            {chapter.description}
                          </p>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="space-y-6 pt-0">
                          <Separator />
                          
                          {/* Chapter Overview */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm sm:text-base">Expected Length</span>
                              </div>
                              <p className="text-sm text-muted-foreground pl-6">{chapter.expectedPages}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Key Components</span>
                              </div>
                              <div className="flex flex-wrap gap-1 pl-6">
                                {chapter.keyComponents.map((component, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {component}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Chapter Objectives */}
                          <div className="space-y-3">
                            <h5 className="font-semibold flex items-center gap-2">
                              <Target className="h-4 w-4 text-primary" />
                              Learning Objectives
                            </h5>
                            <ul className="space-y-2">
                              {chapter.objectives.map((objective, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{objective}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Chapter Sections */}
                          <div className="space-y-3">
                            <h5 className="font-semibold flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              Chapter Sections
                            </h5>
                            <div className="space-y-3">
                              {chapter.sections.map((section, idx) => (
                                <div key={idx} className="border-l-2 border-primary/20 pl-4 space-y-1">
                                  <h6 className="font-medium text-sm">{section.title}</h6>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {section.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
            </Card>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CapstoneGenerator;