import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Download, Copy, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCapstoneProject } from '@/lib/titleGenerator';

interface GeneratedProject {
  mainTitle: string;
  chapters: {
    number: number;
    title: string;
    description: string;
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
  const { toast } = useToast();

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

              {/* Chapters */}
              <div className="space-y-4">
                {generatedProject.chapters.map((chapter) => (
                  <div key={chapter.number} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-primary mb-2">
                      Chapter {chapter.number}: {chapter.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chapter.description}
                    </p>
                  </div>
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