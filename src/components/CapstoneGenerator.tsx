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
import { generateCapstoneProject } from '@/lib/titleGenerator';
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
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  const [isEditingDocument, setIsEditingDocument] = useState(false);
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

  const handleGenerate = async () => {
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
      const project = generateCapstoneProject(formData);
      setGeneratedProject(project);
      toast({
        title: "Success!",
        description: "Your capstone project structure has been generated."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-academic bg-clip-text text-transparent">
            Capstone Project Generator
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Generate professional titles and structure for your capstone project with AI-powered academic formatting
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="field">Field of Study *</Label>
              <Select value={formData.field} onValueChange={(value) => setFormData({...formData, field: value})}>
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (Optional)</Label>
              <Input
                id="keywords"
                placeholder="e.g., AI, medical diagnosis, deep learning"
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="researchType">Research Type</Label>
              <Select value={formData.researchType} onValueChange={(value) => setFormData({...formData, researchType: value})}>
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

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isGenerating ? "Generating..." : "Generate Project Structure"}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Output */}
        {generatedProject && (
          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Project Structure</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleStartWriting}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Start Writing Document
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy}>
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
              <div className="flex gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={expandAllChapters}>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAllChapters}>
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
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                Chapter {chapter.number}
                              </Badge>
                              <CardTitle className="text-lg">{chapter.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-emerald-500" />
                              {expandedChapters.includes(chapter.number) ? 
                                <ChevronDown className="h-5 w-5" /> : 
                                <ChevronRight className="h-5 w-5" />
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
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Expected Length</span>
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
        )}
      </div>
    </div>
  );
};

export default CapstoneGenerator;