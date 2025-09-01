import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Save, 
  Download, 
  Edit3, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Menu,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentChapter {
  number: number;
  title: string;
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
    }[];
    conclusion: string;
  };
  wordCount: number;
  lastEdited: Date;
}

interface DocumentEditorProps {
  initialProject: {
    mainTitle: string;
    chapters: any[];
  };
  onBack: () => void;
}

const DocumentEditor = ({ initialProject, onBack }: DocumentEditorProps) => {
  const [documentTitle, setDocumentTitle] = useState(initialProject.mainTitle);
  const [chapters, setChapters] = useState<DocumentChapter[]>([]);
  const [activeChapter, setActiveChapter] = useState(1);
  const [isEditing, setIsEditing] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();

  // Initialize chapters with editable content
  useEffect(() => {
    const initialChapters: DocumentChapter[] = initialProject.chapters.map((chapter) => ({
      number: chapter.number,
      title: chapter.title,
      content: {
        introduction: generateIntroductionText(chapter),
        sections: chapter.sections.map((section: any) => ({
          title: section.title,
          content: `${section.content}\n\n[Add your detailed content here...]`
        })),
        conclusion: `This chapter concludes with [add your key takeaways and transition to next chapter]...`
      },
      wordCount: 0,
      lastEdited: new Date()
    }));
    setChapters(initialChapters);
  }, [initialProject]);

  const generateIntroductionText = (chapter: any) => {
    const intros = {
      1: `This chapter provides an introduction to the research study on "${initialProject.mainTitle.split(':')[0]}". The following sections will establish the foundation for this investigation by presenting the background context, defining the research problem, and outlining the objectives that guide this study.`,
      2: `This chapter presents a comprehensive review of existing literature relevant to this research. The review synthesizes current knowledge, identifies gaps in the field, and establishes the theoretical framework that supports this investigation.`,
      3: `This chapter details the research methodology employed in this study. The systematic approach described here ensures the reliability and validity of the research findings through carefully designed procedures and appropriate analytical techniques.`,
      4: `This chapter presents the findings from the data analysis and provides a comprehensive discussion of the results. The analysis addresses each research objective and interprets the findings within the context of the established theoretical framework.`,
      5: `This chapter concludes the research study by summarizing the key findings, drawing evidence-based conclusions, and providing recommendations for practice and future research. The implications of this work for the field are discussed in detail.`
    };
    return intros[chapter.number as keyof typeof intros] || `This chapter focuses on ${chapter.title.toLowerCase()}.`;
  };

  const updateChapterContent = (chapterNumber: number, field: string, value: string) => {
    setChapters(prev => prev.map(chapter => {
      if (chapter.number === chapterNumber) {
        const updated = { ...chapter };
        if (field === 'title') {
          updated.title = value;
        } else if (field === 'introduction') {
          updated.content.introduction = value;
        } else if (field === 'conclusion') {
          updated.content.conclusion = value;
        }
        updated.lastEdited = new Date();
        updated.wordCount = calculateWordCount(updated.content);
        return updated;
      }
      return chapter;
    }));
  };

  const updateSectionContent = (chapterNumber: number, sectionIndex: number, field: string, value: string) => {
    setChapters(prev => prev.map(chapter => {
      if (chapter.number === chapterNumber) {
        const updated = { ...chapter };
        if (field === 'title') {
          updated.content.sections[sectionIndex].title = value;
        } else if (field === 'content') {
          updated.content.sections[sectionIndex].content = value;
        }
        updated.lastEdited = new Date();
        updated.wordCount = calculateWordCount(updated.content);
        return updated;
      }
      return chapter;
    }));
  };

  const calculateWordCount = (content: any) => {
    const allText = content.introduction + ' ' + 
                   content.sections.map((s: any) => s.title + ' ' + s.content).join(' ') + 
                   ' ' + content.conclusion;
    return allText.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const saveDocument = () => {
    setLastSaved(new Date());
    toast({
      title: "Document Saved",
      description: "Your capstone document has been saved successfully."
    });
  };

  const exportDocument = () => {
    const content = generateExportContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Document Exported",
      description: "Your capstone document has been downloaded."
    });
  };

  const generateExportContent = () => {
    let content = `${documentTitle}\n${'='.repeat(documentTitle.length)}\n\n`;
    
    chapters.forEach(chapter => {
      content += `CHAPTER ${chapter.number}: ${chapter.title.toUpperCase()}\n`;
      content += `${'='.repeat(50)}\n\n`;
      
      content += `${chapter.content.introduction}\n\n`;
      
      chapter.content.sections.forEach(section => {
        content += `${section.title}\n`;
        content += `${'-'.repeat(section.title.length)}\n`;
        content += `${section.content}\n\n`;
      });
      
      content += `${chapter.content.conclusion}\n\n`;
      content += `\n${'='.repeat(50)}\n\n`;
    });
    
    return content;
  };

  const currentChapter = chapters.find(c => c.number === activeChapter);
  const totalWords = chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 border-r bg-card`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-4 w-4" />
            </Button>
            {sidebarOpen && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        </div>

        {sidebarOpen && (
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-4 space-y-4">
              {/* Document Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Document Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Words:</span>
                    <span className="font-medium">{totalWords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Chapters:</span>
                    <span className="font-medium">{chapters.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Saved:</span>
                    <span className="font-medium">{lastSaved.toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Chapter Navigation */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Chapters</h3>
                {chapters.map((chapter) => (
                  <Button
                    key={chapter.number}
                    variant={activeChapter === chapter.number ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setActiveChapter(chapter.number)}
                  >
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-2 w-full">
                        <span className="font-medium">Chapter {chapter.number}</span>
                        {chapter.wordCount > 0 && (
                          <Check className="h-3 w-3 text-emerald-500 ml-auto" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate w-full text-left">
                        {chapter.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {chapter.wordCount} words
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input 
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="text-lg font-semibold border-none shadow-none p-0 h-auto"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                {isEditing ? 'Preview' : 'Edit'}
              </Button>
              <Button variant="outline" size="sm" onClick={saveDocument}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={exportDocument}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Chapter Editor */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-8">
              {currentChapter && (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="text-center space-y-4 pb-8 border-b">
                    <Badge variant="secondary" className="mb-4">
                      Chapter {currentChapter.number}
                    </Badge>
                    
                    {isEditing ? (
                      <Input
                        value={currentChapter.title}
                        onChange={(e) => updateChapterContent(currentChapter.number, 'title', e.target.value)}
                        className="text-2xl font-bold text-center border-none shadow-none p-0 h-auto"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold">{currentChapter.title}</h1>
                    )}
                    
                    <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                      <span>{currentChapter.wordCount} words</span>
                      <span>•</span>
                      <span>Last edited: {currentChapter.lastEdited.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Chapter Introduction */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Introduction</h2>
                    {isEditing ? (
                      <Textarea
                        value={currentChapter.content.introduction}
                        onChange={(e) => updateChapterContent(currentChapter.number, 'introduction', e.target.value)}
                        className="min-h-32 text-base leading-relaxed"
                        placeholder="Write your chapter introduction here..."
                      />
                    ) : (
                      <div className="prose max-w-none">
                        <p className="text-base leading-relaxed">{currentChapter.content.introduction}</p>
                      </div>
                    )}
                  </div>

                  {/* Chapter Sections */}
                  {currentChapter.content.sections.map((section, index) => (
                    <div key={index} className="space-y-4">
                      <Separator />
                      
                      {isEditing ? (
                        <Input
                          value={section.title}
                          onChange={(e) => updateSectionContent(currentChapter.number, index, 'title', e.target.value)}
                          className="text-xl font-semibold border-none shadow-none p-0 h-auto"
                          placeholder="Section title..."
                        />
                      ) : (
                        <h2 className="text-xl font-semibold">{section.title}</h2>
                      )}
                      
                      {isEditing ? (
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateSectionContent(currentChapter.number, index, 'content', e.target.value)}
                          className="min-h-48 text-base leading-relaxed"
                          placeholder="Write your section content here..."
                        />
                      ) : (
                        <div className="prose max-w-none">
                          <div className="text-base leading-relaxed whitespace-pre-wrap">{section.content}</div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Chapter Conclusion */}
                  <div className="space-y-4">
                    <Separator />
                    <h2 className="text-xl font-semibold">Conclusion</h2>
                    {isEditing ? (
                      <Textarea
                        value={currentChapter.content.conclusion}
                        onChange={(e) => updateChapterContent(currentChapter.number, 'conclusion', e.target.value)}
                        className="min-h-32 text-base leading-relaxed"
                        placeholder="Write your chapter conclusion here..."
                      />
                    ) : (
                      <div className="prose max-w-none">
                        <p className="text-base leading-relaxed">{currentChapter.content.conclusion}</p>
                      </div>
                    )}
                  </div>

                  {/* Chapter Navigation */}
                  <div className="flex justify-between pt-8 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveChapter(Math.max(1, activeChapter - 1))}
                      disabled={activeChapter === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous Chapter
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setActiveChapter(Math.min(5, activeChapter + 1))}
                      disabled={activeChapter === 5}
                    >
                      Next Chapter
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;