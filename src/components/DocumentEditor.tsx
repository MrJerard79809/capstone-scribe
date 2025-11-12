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
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

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

  // Initialize chapters with AI-generated content
  useEffect(() => {
    const initialChapters: DocumentChapter[] = initialProject.chapters.map((chapter) => ({
      number: chapter.number,
      title: chapter.title,
      content: {
        introduction: cleanText(generateIntroductionText(chapter)),
        sections: chapter.sections.map((section: any) => ({
          title: section.title,
          content: cleanText(generateSectionContent(chapter.number, section.title))
        })),
        conclusion: cleanText(generateConclusionText(chapter.number))
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

  const generateConclusionText = (chapterNumber: number) => {
    const conclusions = {
      1: `This introductory chapter has established the foundation for the research by presenting the background, defining the problem statement, outlining research objectives, and formulating key research questions. The subsequent chapters will build upon this framework to conduct a comprehensive investigation of the research topic.`,
      2: `This literature review has provided a comprehensive analysis of existing research in the field, identified key themes and patterns, highlighted gaps in current knowledge, and established the theoretical framework for this study. The insights gained from this review inform the methodology and guide the research approach detailed in the following chapter.`,
      3: `This chapter has outlined a comprehensive methodology for conducting the research, including the research design, data collection methods, participant selection criteria, ethical considerations, and analytical approaches. This systematic methodology ensures the reliability and validity of the findings presented in subsequent chapters.`,
      4: `This chapter has presented the research findings and provided a thorough analysis of the results. The data analysis has addressed each research objective and answered the research questions formulated in Chapter 1. These findings provide the foundation for the conclusions and recommendations presented in the final chapter.`,
      5: `This concluding chapter has synthesized the key findings of the research, drawn evidence-based conclusions, provided practical recommendations, and discussed the implications for theory and practice. While limitations exist, this study makes significant contributions to the field and opens avenues for future research in this important area.`
    };
    return conclusions[chapterNumber as keyof typeof conclusions] || `This chapter concludes the discussion on ${chapterNumber === 1 ? 'the introduction' : chapterNumber === 2 ? 'the literature review' : chapterNumber === 3 ? 'the methodology' : chapterNumber === 4 ? 'the results' : 'the study'}.`;
  };

  // Clean special characters from generated content
  const cleanText = (text: string) => {
    return text.replace(/[*#_~`]/g, '');
  };

  const generateSectionContent = (chapterNumber: number, sectionTitle: string) => {
    const lowerTitle = sectionTitle.toLowerCase();
    
    // Chapter 1 content generators
    if (chapterNumber === 1) {
      if (lowerTitle.includes('background') || lowerTitle.includes('introduction')) {
        return `The field of ${initialProject.mainTitle.toLowerCase()} has experienced significant evolution over the past decade, driven by technological advancements, changing societal needs, and emerging research findings. Understanding the historical context and current landscape is essential for identifying areas that require further investigation.\n\nRecent studies have highlighted several key trends in this area, including the increasing complexity of challenges, the need for interdisciplinary approaches, and the growing importance of evidence-based solutions. However, despite these advances, significant gaps remain in our understanding of how to effectively address the multifaceted nature of the problems encountered in this field.\n\nThe importance of this research lies in its potential to bridge existing gaps between theory and practice, providing valuable insights that can inform future policy, practice, and research directions.`;
      }
      if (lowerTitle.includes('problem') || lowerTitle.includes('statement')) {
        return `Despite significant advancements in ${initialProject.mainTitle.toLowerCase()}, there remains a critical gap in understanding how current approaches address the evolving challenges in this field. This gap has resulted in limited practical solutions and theoretical frameworks that adequately address the complex nature of the problem.\n\nThis research addresses the need for a comprehensive analysis by examining current practices, identifying key challenges, and proposing evidence-based solutions that can enhance both theoretical understanding and practical applications in the field.\n\nThe significance of addressing this problem extends beyond academic interest, as it has direct implications for practitioners, policymakers, and stakeholders who seek to improve outcomes and effectiveness in this domain.`;
      }
      if (lowerTitle.includes('objective') || lowerTitle.includes('goals')) {
        return `**General Objective:**\nTo investigate and analyze the current state of ${initialProject.mainTitle.toLowerCase()} and develop evidence-based recommendations for improvement.\n\n**Specific Objectives:**\n1. To examine the current practices and approaches in the field\n2. To identify key challenges and limitations in existing methodologies\n3. To analyze the effectiveness of current solutions and interventions\n4. To develop practical recommendations for enhancing outcomes\n5. To contribute to the theoretical understanding of the field`;
      }
      if (lowerTitle.includes('research question') || lowerTitle.includes('questions')) {
        return `**Primary Research Question:**\nHow can current approaches be enhanced to better address contemporary challenges and improve outcomes in ${initialProject.mainTitle.toLowerCase()}?\n\n**Secondary Research Questions:**\n1. What are the key factors that influence success in current practices?\n2. What barriers exist that limit the effectiveness of existing approaches?\n3. How do stakeholders perceive the current state of practice in this field?\n4. What evidence-based strategies show the most promise for improvement?\n5. How can theoretical frameworks be better aligned with practical applications?`;
      }
    }
    
    // Chapter 2 content generators
    if (chapterNumber === 2) {
      if (lowerTitle.includes('theoretical') || lowerTitle.includes('framework')) {
        return `The theoretical foundation for this research draws upon several established frameworks in the field. These frameworks provide the conceptual lens through which the research problem is examined and understood.\n\nKey theoretical perspectives include [relevant theories], which offer complementary insights into the phenomena under investigation. The integration of these perspectives allows for a comprehensive understanding that accounts for multiple dimensions of the problem.\n\nThis theoretical framework guides the research design, informs the selection of variables and constructs, and provides the foundation for interpreting the findings in the context of existing knowledge.`;
      }
      if (lowerTitle.includes('review') || lowerTitle.includes('literature')) {
        return `A comprehensive review of the literature reveals several key themes and patterns in research related to ${initialProject.mainTitle.toLowerCase()}. Studies in this area have employed diverse methodological approaches and have contributed to our understanding from multiple perspectives.\n\nThe body of literature demonstrates both areas of consensus and ongoing debates within the field. Researchers generally agree on the importance of evidence-based approaches, though perspectives differ on the most effective strategies and interventions.\n\nRecent developments in the field have introduced new concepts and methodologies that show promise for advancing both theoretical understanding and practical applications. However, significant gaps remain that warrant further investigation.`;
      }
      if (lowerTitle.includes('gap') || lowerTitle.includes('analysis')) {
        return `**Identified Research Gaps:**\n\n1. **Methodological Gaps:** Limited longitudinal studies examining the long-term effects of interventions in this field.\n\n2. **Population Gaps:** Insufficient research focusing on diverse populations and contexts, particularly underrepresented groups.\n\n3. **Theoretical Gaps:** Lack of comprehensive theoretical frameworks that integrate multiple perspectives and approaches.\n\n4. **Practical Gaps:** Limited research on the translation of theoretical findings into practical applications and real-world implementations.\n\n5. **Measurement Gaps:** Absence of standardized assessment tools and outcome measures specific to this field.\n\nThis study addresses these gaps by providing specific contributions that advance both theoretical understanding and practical applications in the field.`;
      }
    }
    
    // Chapter 3 content generators
    if (chapterNumber === 3) {
      if (lowerTitle.includes('research design') || lowerTitle.includes('design')) {
        return `This study employs a comprehensive research design that allows for systematic investigation of the research questions while maintaining flexibility to explore emerging themes and patterns. The design has been carefully selected to align with the research objectives and ensure the validity and reliability of findings.\n\nThe research follows a systematic approach that enables both breadth and depth of understanding. This approach is particularly appropriate for this study because it allows for triangulation of data sources and methods, thereby enhancing the credibility of the findings.\n\nKey features of the research design include clearly defined phases, systematic data collection procedures, and rigorous analytical approaches that ensure the quality and trustworthiness of the research outcomes.`;
      }
      if (lowerTitle.includes('data collection') || lowerTitle.includes('collection')) {
        return `**Data Collection Methods:**\n\n1. **Primary Data Collection:**\n   - Surveys: Structured questionnaires to gather quantitative data from participants\n   - Interviews: Semi-structured interviews to explore experiences and perspectives in depth\n   - Observations: Systematic observation of practices and behaviors in natural settings\n\n2. **Secondary Data Collection:**\n   - Document analysis: Review of relevant reports, policies, and organizational documents\n   - Literature review: Systematic analysis of existing research and publications\n   - Archival data: Historical records and databases relevant to the study\n\n**Data Collection Timeline:**\nThe data collection process is organized into distinct phases, each with specific objectives and timeframes, to ensure systematic and comprehensive coverage of the research topic.`;
      }
      if (lowerTitle.includes('sample') || lowerTitle.includes('participant')) {
        return `**Population and Sample:**\n\nThe target population for this study consists of individuals and organizations relevant to ${initialProject.mainTitle.toLowerCase()}. The sample is selected using purposive sampling techniques to ensure representation of key stakeholder groups and perspectives.\n\n**Sample Selection Criteria:**\n- Relevant experience or involvement in the field\n- Willingness to participate and provide informed consent\n- Ability to provide meaningful insights related to the research questions\n- Representation of diverse perspectives and contexts\n\n**Sample Size:**\nThe sample size is determined based on the principle of data saturation for qualitative components and power analysis for quantitative components, ensuring adequate data for meaningful analysis and interpretation.`;
      }
      if (lowerTitle.includes('analysis') || lowerTitle.includes('analytical')) {
        return `**Analytical Approach:**\n\nThe data analysis follows a systematic approach designed to address each research objective comprehensively. Both quantitative and qualitative analytical techniques are employed to maximize the insights gained from the collected data.\n\n**Quantitative Analysis:**\n- Descriptive statistics to summarize participant characteristics and key variables\n- Inferential statistics to test hypotheses and examine relationships\n- Effect sizes to determine the practical significance of findings\n\n**Qualitative Analysis:**\n- Thematic analysis to identify patterns and themes in the data\n- Coding procedures following established qualitative research protocols\n- Member checking to enhance the credibility of interpretations\n\nThe integration of quantitative and qualitative findings allows for triangulation and enhanced understanding of the research topic.`;
      }
      if (lowerTitle.includes('ethical') || lowerTitle.includes('ethics')) {
        return `**Ethical Considerations:**\n\nThis research adheres to the highest standards of research ethics and follows established guidelines for the protection of human participants. Key ethical considerations include:\n\n1. **Informed Consent:** All participants provide voluntary informed consent after receiving complete information about the study.\n\n2. **Confidentiality:** Participant identities and data are protected through secure storage and anonymization procedures.\n\n3. **Privacy:** Personal information is collected only when necessary and is handled with strict confidentiality protocols.\n\n4. **Risk Minimization:** The research is designed to minimize any potential risks to participants.\n\n5. **Right to Withdraw:** Participants retain the right to withdraw from the study at any time without penalty.\n\nEthical approval has been obtained from the relevant institutional review board prior to data collection.`;
      }
    }
    
    // Chapter 4 content generators
    if (chapterNumber === 4) {
      if (lowerTitle.includes('results') || lowerTitle.includes('findings')) {
        return `**Overview of Findings:**\n\nThe data analysis revealed several significant findings related to ${initialProject.mainTitle.toLowerCase()}. The results are organized according to the research objectives and questions, providing a systematic presentation of the key discoveries.\n\n**Key Findings:**\n\n1. **Primary Finding:** The analysis indicates significant patterns and relationships among the key variables examined in this study.\n\n2. **Supporting Findings:**\n   - Participants demonstrated significant variation in relevant aspects\n   - Strong correlations were found between key variables\n   - Qualitative themes emerged around important concepts\n\n3. **Statistical Significance:** The results show statistically significant relationships (p < 0.05) between key variables, supporting the research hypotheses and providing confidence in the findings.`;
      }
      if (lowerTitle.includes('analysis') || lowerTitle.includes('interpretation')) {
        return `**Data Analysis and Interpretation:**\n\nThe analytical process followed a systematic approach to ensure rigorous examination of the data. Both descriptive and inferential analyses were conducted to address the research questions comprehensively.\n\nThe findings reveal important patterns and relationships that contribute to our understanding of ${initialProject.mainTitle.toLowerCase()}. When interpreted in light of the theoretical framework established in Chapter 2, these results provide valuable insights into the mechanisms and processes underlying the phenomena of interest.\n\nThe consistency between quantitative and qualitative findings strengthens confidence in the results and provides a more complete picture of the research topic. Areas of convergence and divergence between data sources are examined to enhance the depth of understanding.`;
      }
      if (lowerTitle.includes('discussion')) {
        return `**Discussion of Results:**\n\nThe findings of this study have important implications for both theory and practice in the field of ${initialProject.mainTitle.toLowerCase()}. When examined in the context of existing literature, these results both confirm and extend previous research.\n\nSeveral aspects of the findings align with established theories and previous empirical work, providing additional evidence for existing conceptual frameworks. However, the results also reveal new insights and patterns that contribute novel understanding to the field.\n\nThe practical implications of these findings are significant for stakeholders, including practitioners, policymakers, and researchers. The results suggest specific strategies and approaches that may enhance effectiveness and improve outcomes in this domain.\n\nLimitations of the study should be considered when interpreting these findings, including constraints related to sample characteristics, measurement approaches, and research design features.`;
      }
    }
    
    // Chapter 5 content generators
    if (chapterNumber === 5) {
      if (lowerTitle.includes('summary') || lowerTitle.includes('conclusion')) {
        return `**Research Summary:**\n\nThis study investigated ${initialProject.mainTitle.toLowerCase()} through a comprehensive research approach that addressed the identified gaps in existing literature. The research successfully achieved its objectives and provided valuable insights into the field.\n\n**Key Contributions:**\n\n1. **Theoretical Contribution:** The study provides new theoretical insights that enhance understanding of relevant concepts and frameworks.\n\n2. **Methodological Contribution:** The research methodology offers a framework for future studies in this area.\n\n3. **Practical Contribution:** The findings provide evidence-based recommendations for practitioners and policymakers.\n\nEach research question was systematically addressed through the data collection and analysis process, and the findings contribute meaningfully to advancing knowledge in this important area.`;
      }
      if (lowerTitle.includes('recommendation')) {
        return `**Recommendations:**\n\nBased on the findings of this research, the following recommendations are proposed:\n\n**Recommendations for Practice:**\n1. Practitioners should consider adopting evidence-based strategies identified in this study\n2. Professional development programs should incorporate relevant training elements\n3. Organizations should develop policies that support effective implementation\n\n**Recommendations for Future Research:**\n1. Longitudinal studies examining long-term effects would provide valuable insights\n2. Research with diverse populations and contexts would enhance generalizability\n3. Studies exploring specific aspects identified in this research would deepen understanding\n\n**Implementation Considerations:**\n- Resource requirements and feasibility should be carefully assessed\n- Stakeholder engagement is crucial for successful implementation\n- Monitoring and evaluation systems should track effectiveness and outcomes`;
      }
      if (lowerTitle.includes('limitation')) {
        return `**Limitations of the Study:**\n\nWhile this research makes important contributions to the field, several limitations should be acknowledged:\n\n1. **Sample Limitations:** The sample characteristics may affect the generalizability of findings to other populations and contexts.\n\n2. **Methodological Limitations:** The research design, while appropriate for the objectives, has inherent constraints that affect the scope and nature of conclusions.\n\n3. **Measurement Limitations:** The instruments and measures used, though validated, may not capture all relevant dimensions of the constructs.\n\n4. **Time Constraints:** The cross-sectional nature of data collection limits conclusions about causality and long-term effects.\n\n5. **Contextual Limitations:** The specific context of the study may influence the applicability of findings to different settings.\n\nThese limitations, while notable, do not diminish the significance of the contributions made by this research. They do, however, suggest directions for future investigations.`;
      }
      if (lowerTitle.includes('future') || lowerTitle.includes('research')) {
        return `**Directions for Future Research:**\n\nThis study opens several avenues for future research that would further advance understanding in the field of ${initialProject.mainTitle.toLowerCase()}:\n\n1. **Longitudinal Studies:** Research examining changes and effects over extended time periods would provide insights into development and long-term outcomes.\n\n2. **Comparative Studies:** Investigations comparing different approaches, contexts, or populations would enhance understanding of boundary conditions and contextual factors.\n\n3. **Intervention Studies:** Research testing specific interventions based on the findings of this study would contribute to evidence-based practice.\n\n4. **Mixed-Methods Research:** Studies employing complementary methodological approaches would provide more comprehensive understanding.\n\n5. **Replication Studies:** Research replicating these findings in different contexts would establish the robustness and generalizability of results.\n\nThese research directions represent important opportunities to build upon the foundation established by this study and to continue advancing knowledge in this vital area.`;
      }
    }
    
    // Default content if no specific match
    return `This section on "${sectionTitle}" provides important context and analysis for Chapter ${chapterNumber}. The content addresses key aspects of the research topic and contributes to the overall understanding of ${initialProject.mainTitle.toLowerCase()}.\n\nThe analysis presented here draws upon both theoretical frameworks and empirical evidence to provide a comprehensive examination of the relevant issues. Multiple perspectives are considered to ensure a balanced and thorough treatment of the topic.\n\nThe findings and insights presented in this section inform the subsequent discussions and contribute to the overall conclusions and recommendations of the research study.`;
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

  const exportDocument = async () => {
    try {
      const doc = await generateWordDocument();
      const blob = await Packer.toBlob(doc);
      
      // Force download as .docx file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentTitle.replace(/[^a-z0-9\s]/gi, '_').replace(/\s+/g, '_')}.docx`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Document Exported",
        description: "Your capstone document has been downloaded as a Word (.docx) file."
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Error",
        description: "Failed to export document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateWordDocument = async () => {
    const children = [
      // Document Title
      new Paragraph({
        children: [
          new TextRun({
            text: documentTitle,
            bold: true,
            size: 32,
          }),
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      
      // Add page break before chapters
      new Paragraph({
        children: [new TextRun({ text: "", break: 1 })],
        pageBreakBefore: true,
      }),
    ];

    // Add each chapter
    chapters.forEach((chapter, chapterIndex) => {
      // Chapter title
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `CHAPTER ${chapter.number}: ${chapter.title.toUpperCase()}`,
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 200 },
        })
      );

      // Chapter introduction
      if (chapter.content.introduction) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Introduction",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );

        // Split introduction into paragraphs
        const introParagraphs = chapter.content.introduction.split('\n\n');
        introParagraphs.forEach(para => {
          if (para.trim()) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: para.trim(), size: 24 })],
                spacing: { after: 200 },
                alignment: AlignmentType.JUSTIFIED,
              })
            );
          }
        });
      }

      // Chapter sections
      chapter.content.sections.forEach((section, sectionIndex) => {
        if (section.title && section.content) {
          // Section title
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: section.title,
                  bold: true,
                  size: 20,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            })
          );

          // Section content
          const sectionParagraphs = section.content.split('\n\n');
          sectionParagraphs.forEach(para => {
            if (para.trim()) {
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: para.trim(), size: 24 })],
                  spacing: { after: 200 },
                  alignment: AlignmentType.JUSTIFIED,
                })
              );
            }
          });
        }
      });

      // Chapter conclusion
      if (chapter.content.conclusion) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Conclusion",
                bold: true,
                size: 20,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );

        const conclusionParagraphs = chapter.content.conclusion.split('\n\n');
        conclusionParagraphs.forEach(para => {
          if (para.trim()) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: para.trim(), size: 24 })],
                spacing: { after: 200 },
                alignment: AlignmentType.JUSTIFIED,
              })
            );
          }
        });
      }

      // Add page break between chapters (except for the last one)
      if (chapterIndex < chapters.length - 1) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "", break: 1 })],
            pageBreakBefore: true,
          })
        );
      }
    });

    return new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });
  };

  const currentChapter = chapters.find(c => c.number === activeChapter);
  const totalWords = chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden border-b bg-card p-3 sticky top-0 z-40">
        <div className="flex items-center justify-between gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-1 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm">Back</span>
          </Button>
          <h2 className="font-semibold truncate text-sm flex-1 text-center">{documentTitle}</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className={`${
        sidebarOpen ? 'fixed inset-0 z-50 lg:relative lg:inset-auto' : 'hidden'
      } lg:block ${sidebarOpen ? 'w-full lg:w-80' : 'lg:w-16'} transition-all duration-300 border-r bg-card`}>
        {/* Mobile backdrop */}
        <div 
          className={`${sidebarOpen ? 'block' : 'hidden'} lg:hidden fixed inset-0 bg-black/50 z-40`}
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Sidebar content */}
        <div className="relative z-50 bg-card h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="h-4 w-4" />
              </Button>
              {sidebarOpen && (
                <Button variant="ghost" size="sm" onClick={onBack} className="hidden lg:flex">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
          </div>

          {sidebarOpen && (
            <ScrollArea className="flex-1">
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
                      className="w-full justify-start h-auto p-3 touch-manipulation"
                      onClick={() => {
                        setActiveChapter(chapter.number);
                        // Auto-close sidebar on mobile after selection
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                      }}
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
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Toolbar */}
        <div className="hidden lg:block border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Input 
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="text-lg font-semibold border-none shadow-none p-0 h-auto max-w-md"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                <span className="hidden sm:inline">{isEditing ? 'Preview' : 'Edit'}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={saveDocument}>
                <Save className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button variant="outline" size="sm" onClick={exportDocument}>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Toolbar */}
        <div className="lg:hidden border-b bg-card p-3">
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="flex-1">
              {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
            <Button variant="outline" size="sm" onClick={saveDocument} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={exportDocument} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Chapter Editor */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
              {currentChapter && (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="text-center space-y-4 pb-6 sm:pb-8 border-b">
                    <Badge variant="secondary" className="mb-2 sm:mb-4">
                      Chapter {currentChapter.number}
                    </Badge>
                    
                    {isEditing ? (
                      <Input
                        value={currentChapter.title}
                        onChange={(e) => updateChapterContent(currentChapter.number, 'title', e.target.value)}
                        className="text-xl sm:text-2xl font-bold text-center border-none shadow-none p-0 h-auto"
                      />
                    ) : (
                      <h1 className="text-xl sm:text-2xl font-bold">{currentChapter.title}</h1>
                    )}
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <span>{currentChapter.wordCount} words</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Last edited: {currentChapter.lastEdited.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Chapter Introduction */}
                  <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Introduction</h2>
                    {isEditing ? (
                      <Textarea
                        value={currentChapter.content.introduction}
                        onChange={(e) => updateChapterContent(currentChapter.number, 'introduction', e.target.value)}
                        className="min-h-32 text-sm sm:text-base leading-relaxed"
                        placeholder="Write your chapter introduction here..."
                      />
                    ) : (
                      <div className="prose max-w-none">
                        <p className="text-sm sm:text-base leading-relaxed">{currentChapter.content.introduction}</p>
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
                          className="text-lg sm:text-xl font-semibold border-none shadow-none p-0 h-auto"
                          placeholder="Section title..."
                        />
                      ) : (
                        <h2 className="text-lg sm:text-xl font-semibold">{section.title}</h2>
                      )}
                      
                      {isEditing ? (
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateSectionContent(currentChapter.number, index, 'content', e.target.value)}
                          className="min-h-48 text-sm sm:text-base leading-relaxed"
                          placeholder="Write your section content here..."
                        />
                      ) : (
                        <div className="prose max-w-none">
                          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{section.content}</div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Chapter Conclusion */}
                  <div className="space-y-4">
                    <Separator />
                    <h2 className="text-lg sm:text-xl font-semibold">Conclusion</h2>
                    {isEditing ? (
                      <Textarea
                        value={currentChapter.content.conclusion}
                        onChange={(e) => updateChapterContent(currentChapter.number, 'conclusion', e.target.value)}
                        className="min-h-32 text-sm sm:text-base leading-relaxed"
                        placeholder="Write your chapter conclusion here..."
                      />
                    ) : (
                      <div className="prose max-w-none">
                        <p className="text-sm sm:text-base leading-relaxed">{currentChapter.content.conclusion}</p>
                      </div>
                    )}
                  </div>

                  {/* Chapter Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 sm:pt-8 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveChapter(Math.max(1, activeChapter - 1))}
                      disabled={activeChapter === 1}
                      className="flex-1 sm:flex-none touch-manipulation"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous Chapter
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setActiveChapter(Math.min(5, activeChapter + 1))}
                      disabled={activeChapter === 5}
                      className="flex-1 sm:flex-none touch-manipulation"
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