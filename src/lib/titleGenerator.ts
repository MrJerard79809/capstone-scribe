interface FormData {
  field: string;
  topic: string;
  keywords: string;
  researchType: string;
}

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

const enhancedFieldTemplates: Record<string, {
  prefixes: string[];
  contexts: string[];
  methodologyFocus: string[];
}> = {
  'computer-science': {
    prefixes: ['Development of an Intelligent', 'Implementation of Advanced', 'Design and Analysis of Scalable', 'Machine Learning Approach to', 'AI-Powered Solution for'],
    contexts: [' System', ' Framework', ' Algorithm', ' Platform', ' Architecture'],
    methodologyFocus: ['Agile Development', 'Machine Learning Models', 'System Architecture Design', 'Performance Testing', 'User Interface Design']
  },
  'business': {
    prefixes: ['Strategic Digital Transformation of', 'Comprehensive Market Analysis of', 'Performance Optimization in', 'Sustainable Business Model for', 'Data-Driven Decision Making in'],
    contexts: [' Organizations', ' Industries', ' Markets', ' Enterprises', ' Supply Chains'],
    methodologyFocus: ['Statistical Analysis', 'Survey Research', 'Financial Modeling', 'Market Research', 'Case Study Analysis']
  },
  'education': {
    prefixes: ['Innovative Pedagogical Approach to', 'Assessment and Evaluation of', 'Technology Integration in', 'Personalized Learning Solutions for', 'Evidence-Based Teaching Methods in'],
    contexts: [' Learning Environments', ' Educational Systems', ' Curriculum Development', ' Student Achievement', ' Online Education'],
    methodologyFocus: ['Educational Research Design', 'Learning Assessment', 'Curriculum Analysis', 'Student Performance Metrics', 'Qualitative Interviews']
  },
  'psychology': {
    prefixes: ['Cognitive Behavioral Analysis of', 'Neuropsychological Investigation of', 'Social Psychology Study on', 'Developmental Assessment of', 'Therapeutic Intervention for'],
    contexts: [' Human Behavior', ' Mental Health', ' Social Interactions', ' Cognitive Processes', ' Emotional Regulation'],
    methodologyFocus: ['Experimental Design', 'Psychological Testing', 'Statistical Analysis', 'Clinical Interviews', 'Behavioral Observation']
  },
  'engineering': {
    prefixes: ['Innovative Engineering Solution for', 'Sustainable Design and Development of', 'Performance Optimization of', 'Smart Technology Integration in', 'Advanced Materials Application in'],
    contexts: [' Systems', ' Infrastructure', ' Manufacturing Processes', ' Renewable Energy', ' Automation'],
    methodologyFocus: ['CAD Modeling', 'Simulation Analysis', 'Prototype Testing', 'Material Analysis', 'Performance Benchmarking']
  },
  'healthcare': {
    prefixes: ['Clinical Effectiveness Study of', 'Evidence-Based Healthcare Intervention for', 'Population Health Analysis of', 'Medical Technology Assessment of', 'Patient-Centered Care Model for'],
    contexts: [' Treatment Protocols', ' Healthcare Systems', ' Patient Outcomes', ' Medical Devices', ' Public Health'],
    methodologyFocus: ['Clinical Trials', 'Statistical Analysis', 'Patient Surveys', 'Medical Records Analysis', 'Health Outcome Measurement']
  }
};

const detailedChapterTemplates = {
  1: {
    titles: ['Introduction and Background', 'Problem Statement and Research Context', 'Introduction to the Study'],
    objectives: [
      'Establish the research problem and its significance',
      'Define research objectives and questions',
      'Present the scope and limitations of the study',
      'Outline the structure and organization of the research'
    ],
    sections: [
      { title: 'Background of the Study', content: 'Provides contextual information about the research area and establishes the foundation for the investigation.' },
      { title: 'Statement of the Problem', content: 'Clearly articulates the specific problem or gap that the research addresses.' },
      { title: 'Research Objectives', content: 'Lists the primary and secondary objectives that guide the research investigation.' },
      { title: 'Research Questions', content: 'Formulates specific questions that the study aims to answer through systematic investigation.' },
      { title: 'Significance of the Study', content: 'Explains the importance and potential impact of the research findings.' },
      { title: 'Scope and Limitations', content: 'Defines the boundaries of the study and acknowledges inherent constraints.' }
    ],
    expectedPages: '15-25 pages',
    keyComponents: ['Problem identification', 'Research rationale', 'Conceptual framework', 'Thesis statement']
  },
  2: {
    titles: ['Literature Review and Theoretical Framework', 'Review of Related Literature', 'Theoretical Foundation and Related Studies'],
    objectives: [
      'Synthesize existing knowledge in the research area',
      'Identify gaps in current literature',
      'Establish theoretical foundation for the study',
      'Develop conceptual framework for research'
    ],
    sections: [
      { title: 'Theoretical Framework', content: 'Presents the underlying theories that guide the research approach and methodology.' },
      { title: 'Related Literature Review', content: 'Comprehensive analysis of previous studies, publications, and research findings.' },
      { title: 'Conceptual Framework', content: 'Visual and textual representation of the relationships between key variables and concepts.' },
      { title: 'Research Gap Analysis', content: 'Identification and analysis of gaps in existing knowledge that justify the current study.' },
      { title: 'Literature Synthesis', content: 'Integration of findings from multiple sources to build a cohesive understanding.' }
    ],
    expectedPages: '25-40 pages',
    keyComponents: ['Theory application', 'Critical analysis', 'Knowledge synthesis', 'Research positioning']
  },
  3: {
    titles: ['Research Methodology and Design', 'Methods and Procedures', 'Research Approach and Methodology'],
    objectives: [
      'Describe the research design and approach',
      'Explain data collection procedures and instruments',
      'Detail sampling methodology and population',
      'Outline data analysis techniques and validation methods'
    ],
    sections: [
      { title: 'Research Design', content: 'Describes the overall strategy and framework chosen to integrate different components of the study.' },
      { title: 'Population and Sampling', content: 'Defines the target population and explains the sampling methodology and size determination.' },
      { title: 'Data Collection Instruments', content: 'Details the tools, surveys, interviews, or tests used to gather research data.' },
      { title: 'Data Collection Procedures', content: 'Step-by-step explanation of how data will be collected, including timeline and protocols.' },
      { title: 'Data Analysis Methods', content: 'Describes statistical or qualitative analysis techniques to be employed.' },
      { title: 'Validity and Reliability', content: 'Measures taken to ensure the accuracy, consistency, and credibility of research findings.' }
    ],
    expectedPages: '20-30 pages',
    keyComponents: ['Research design', 'Data collection', 'Analysis framework', 'Quality assurance']
  },
  4: {
    titles: ['Results and Discussion', 'Data Analysis and Findings', 'Research Findings and Analysis'],
    objectives: [
      'Present comprehensive analysis of collected data',
      'Interpret findings in relation to research objectives',
      'Discuss implications of results for theory and practice',
      'Compare findings with existing literature and frameworks'
    ],
    sections: [
      { title: 'Descriptive Analysis', content: 'Presentation of basic statistical information and demographic characteristics of the data.' },
      { title: 'Inferential Analysis', content: 'Advanced statistical analysis including hypothesis testing and relationship examination.' },
      { title: 'Findings Interpretation', content: 'Detailed explanation of what the results mean in the context of the research questions.' },
      { title: 'Discussion of Results', content: 'Critical analysis of findings in relation to existing literature and theoretical framework.' },
      { title: 'Implications for Practice', content: 'Practical applications and recommendations based on the research findings.' }
    ],
    expectedPages: '30-50 pages',
    keyComponents: ['Data presentation', 'Statistical analysis', 'Result interpretation', 'Discussion synthesis']
  },
  5: {
    titles: ['Conclusions and Recommendations', 'Summary, Conclusions and Future Directions', 'Final Conclusions and Implications'],
    objectives: [
      'Summarize key findings and their significance',
      'Draw conclusions based on research evidence',
      'Provide actionable recommendations for stakeholders',
      'Suggest directions for future research and development'
    ],
    sections: [
      { title: 'Summary of Findings', content: 'Concise overview of the main results and discoveries from the research investigation.' },
      { title: 'Conclusions', content: 'Definitive statements about what the research has demonstrated or proven.' },
      { title: 'Practical Recommendations', content: 'Specific, actionable suggestions for practitioners, organizations, or policymakers.' },
      { title: 'Theoretical Contributions', content: 'Explanation of how the research advances knowledge in the field.' },
      { title: 'Limitations and Future Research', content: 'Acknowledgment of study constraints and suggestions for future investigations.' },
      { title: 'Final Reflections', content: 'Personal insights and broader implications of the research journey and outcomes.' }
    ],
    expectedPages: '15-25 pages',
    keyComponents: ['Research synthesis', 'Evidence-based conclusions', 'Strategic recommendations', 'Future directions']
  }
};

// Function to generate complete chapter content based on field and topic
const generateFullChapterContent = (chapterTemplate: any, field: string, topic: string, keywords: string, researchType: string, chapterNumber: number) => {
  const fieldTemplate = enhancedFieldTemplates[field] || enhancedFieldTemplates['other'];
  const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
  
  // Generate complete, detailed content for each section
  const generateSectionContent = (sectionTitle: string, sectionOutline: string) => {
    // Field-specific content templates
    const fieldSpecificContent = {
      'computer-science': {
        1: `The ${topic} represents a significant advancement in computational systems and software engineering. This research addresses critical challenges in algorithm optimization, system scalability, and user experience enhancement. Current technological landscapes demand innovative solutions that can adapt to rapidly evolving digital environments while maintaining robust performance standards.

The significance of this study lies in its potential to revolutionize how we approach ${topic} within computational frameworks. Through comprehensive analysis of existing systems and identification of performance bottlenecks, this research establishes a foundation for developing more efficient and reliable technological solutions.

Key technical considerations include system architecture design, database optimization strategies, and user interface development principles. The proposed methodology incorporates industry best practices while introducing novel approaches to address specific technical challenges. Performance metrics and benchmarking procedures ensure rigorous evaluation of proposed solutions.`,
        2: `Extensive literature review reveals significant developments in ${topic} over the past decade. Foundational theories in computer science provide the theoretical framework for understanding complex computational processes and system interactions. Previous research has established key principles that guide current technological implementations.

Current studies demonstrate various approaches to ${topic}, each with distinct advantages and limitations. Comparative analysis of existing solutions reveals opportunities for improvement and innovation. The integration of artificial intelligence and machine learning techniques has opened new possibilities for enhanced system capabilities.

Theoretical foundations encompass algorithm complexity theory, system design principles, and user-centered design methodologies. These frameworks provide the necessary context for understanding current challenges and developing effective solutions.`,
        3: `The research methodology employs a systematic approach combining quantitative analysis with practical implementation. Data collection procedures include performance testing, user surveys, and system monitoring protocols. The experimental design ensures reliable and valid results through controlled testing environments.

Technical implementation follows agile development principles with iterative testing and continuous integration. Code quality assurance measures include peer reviews, automated testing suites, and adherence to industry coding standards. Performance benchmarking utilizes standardized testing frameworks to ensure accurate measurements.

Validation procedures include unit testing, integration testing, and user acceptance testing. Statistical analysis of performance data employs appropriate mathematical models to identify significant patterns and correlations.`,
        4: `Comprehensive analysis of collected data reveals significant improvements in system performance and user satisfaction. Statistical evaluation demonstrates measurable enhancements in processing speed, resource utilization, and overall system efficiency. Comparative studies with existing solutions show superior performance across multiple metrics.

User feedback analysis indicates high levels of satisfaction with the proposed solution. Usability testing results demonstrate improved user experience and reduced learning curves. Performance monitoring data confirms stable operation under various load conditions.

The findings support the initial hypothesis regarding improved system capabilities through innovative technological approaches. Data visualization techniques present results in accessible formats for stakeholder review and decision-making processes.`,
        5: `Research findings confirm the effectiveness of the proposed approach to ${topic}. The developed solution successfully addresses identified challenges while maintaining high performance standards. Practical applications demonstrate real-world viability and scalability potential.

Recommendations for implementation include phased deployment strategies, comprehensive training programs, and ongoing maintenance protocols. Future research directions encompass advanced algorithm optimization, integration with emerging technologies, and expansion to related application domains.

The theoretical contributions of this research advance understanding of ${topic} within computational frameworks. Practical implications provide valuable insights for industry practitioners and technology developers seeking to implement similar solutions.`
      },
      'business': {
        1: `The business landscape surrounding ${topic} has undergone significant transformation in recent years. Market dynamics, consumer behavior patterns, and technological advancements have created new opportunities and challenges for organizations. This research addresses critical business problems that impact organizational performance and competitive positioning.

Understanding the strategic implications of ${topic} requires comprehensive analysis of market conditions, stakeholder expectations, and operational capabilities. The significance of this study extends beyond theoretical knowledge to provide practical insights for business leaders and decision-makers.

Current business environments demand data-driven approaches to problem-solving and strategic planning. This research employs rigorous analytical methods to examine complex business phenomena and develop evidence-based recommendations.`,
        2: `Business literature reveals diverse perspectives on ${topic} and its impact on organizational success. Strategic management theories provide frameworks for understanding competitive dynamics and resource allocation decisions. Previous research has identified key factors that influence business performance and sustainability.

Contemporary studies examine the relationship between ${topic} and various business outcomes including profitability, market share, and customer satisfaction. Theoretical models from economics, management science, and organizational behavior inform the conceptual framework for this research.

Emerging trends in digital transformation, sustainability initiatives, and stakeholder capitalism influence how organizations approach ${topic}. Literature synthesis reveals gaps in current understanding that this research aims to address.`,
        3: `The research methodology combines quantitative analysis with qualitative insights to provide comprehensive understanding of business phenomena. Data collection includes financial analysis, market research surveys, and stakeholder interviews. The mixed-methods approach ensures robust findings that can inform strategic decision-making.

Statistical analysis employs advanced econometric techniques to identify causal relationships and predict future trends. Case study methodology provides in-depth examination of specific organizational contexts and implementation challenges.

Validation procedures include triangulation of data sources, peer review of analytical methods, and stakeholder feedback on preliminary findings. Ethical considerations ensure responsible conduct of business research.`,
        4: `Financial analysis reveals significant correlations between ${topic} and key performance indicators. Statistical models demonstrate the impact of strategic initiatives on organizational outcomes. Comparative analysis across industry sectors provides insights into best practices and implementation strategies.

Market research findings indicate strong consumer demand for innovative approaches to ${topic}. Stakeholder interviews reveal diverse perspectives on challenges and opportunities. The data supports strategic recommendations for organizational improvement.

Risk assessment identifies potential implementation challenges and mitigation strategies. Cost-benefit analysis demonstrates the economic viability of proposed business solutions.`,
        5: `Research conclusions support the strategic importance of ${topic} for organizational success. Evidence-based recommendations provide actionable guidance for business leaders and policymakers. The findings contribute to theoretical understanding while offering practical applications.

Implementation strategies should consider organizational capabilities, market conditions, and stakeholder expectations. Change management processes must address potential resistance and ensure successful adoption of new approaches.

Future research should explore emerging trends and their implications for business strategy. Longitudinal studies would provide insights into long-term impacts and sustainability of proposed solutions.`
      }
    };

    // Get field-specific content or use generic template
    const fieldContent = fieldSpecificContent[field as keyof typeof fieldSpecificContent];
    let content = '';

    if (fieldContent && fieldContent[chapterNumber as keyof typeof fieldContent]) {
      content = fieldContent[chapterNumber as keyof typeof fieldContent];
    } else {
      // Generic content generation
      const commonIntros = [
        `This section provides comprehensive examination of ${sectionTitle.toLowerCase()} in relation to ${topic}.`,
        `The following analysis presents detailed investigation of ${sectionTitle.toLowerCase()} within the context of ${topic}.`,
        `This ${sectionTitle.toLowerCase()} establishes the foundation for understanding ${topic} and its implications.`,
        `The comprehensive study of ${sectionTitle.toLowerCase()} reveals important insights about ${topic}.`
      ];

      content = `${commonIntros[chapterNumber % commonIntros.length]}

The research demonstrates significant findings that contribute to both theoretical understanding and practical applications. Key factors include systematic analysis of current practices, identification of improvement opportunities, and development of evidence-based recommendations.

Through rigorous investigation and careful analysis, this study provides valuable insights for researchers, practitioners, and policymakers. The findings support informed decision-making and strategic planning processes.`;
    }

    // Add keyword integration if available
    if (keywordList.length > 0) {
      content += `

Key aspects of this research include ${keywordList.slice(0, 3).join(', ')}, which are essential components of ${topic}. These elements provide critical context for understanding the broader implications of the study and its potential applications.`;
    }

    return content;
  };

  return {
    ...chapterTemplate,
    sections: chapterTemplate.sections.map((section: any) => ({
      ...section,
      content: generateSectionContent(section.title, section.content)
    }))
  };
};

export function generateCapstoneProject(formData: FormData): GeneratedProject {
  const { field, topic, keywords, researchType } = formData;
  
  // Generate main title with enhanced intelligence
  const fieldTemplate = enhancedFieldTemplates[field];
  let mainTitle = '';
  
  if (fieldTemplate) {
    const randomPrefix = fieldTemplate.prefixes[Math.floor(Math.random() * fieldTemplate.prefixes.length)];
    const randomContext = fieldTemplate.contexts[Math.floor(Math.random() * fieldTemplate.contexts.length)];
    mainTitle = `${randomPrefix} ${topic}${randomContext}`;
  } else {
    // Fallback for other fields
    const genericPrefixes = ['Comprehensive Analysis of', 'Investigation into', 'Advanced Study on', 'Strategic Approach to'];
    const randomPrefix = genericPrefixes[Math.floor(Math.random() * genericPrefixes.length)];
    mainTitle = `${randomPrefix} ${topic}`;
  }
  
  // Add research type context if specified
  if (researchType) {
    const typeModifiers: Record<string, string> = {
      'quantitative': ': A Quantitative Analysis',
      'qualitative': ': A Qualitative Investigation', 
      'mixed': ': A Mixed-Methods Approach',
      'experimental': ': An Experimental Study',
      'case-study': ': A Case Study Analysis',
      'theoretical': ': A Theoretical Framework'
    };
    
    if (typeModifiers[researchType]) {
      mainTitle += typeModifiers[researchType];
    }
  }

  // Generate comprehensive chapters with complete content
  const chapters = [];
  for (let i = 1; i <= 5; i++) {
    const chapterData = detailedChapterTemplates[i as keyof typeof detailedChapterTemplates];
    const randomTitle = chapterData.titles[Math.floor(Math.random() * chapterData.titles.length)];
    
    // Customize chapter description based on field
    let description = `This chapter focuses on ${chapterData.sections[0].title.toLowerCase()} and related components.`;
    if (fieldTemplate && i === 3) {
      // Customize methodology chapter with field-specific focus
      const methodologyFocus = fieldTemplate.methodologyFocus[Math.floor(Math.random() * fieldTemplate.methodologyFocus.length)];
      description = `This chapter details the research methodology with emphasis on ${methodologyFocus.toLowerCase()} and systematic data collection procedures.`;
    }
    
    // Generate complete chapter with full content
    const completeChapter = generateFullChapterContent(chapterData, field, topic, keywords, researchType, i);
    
    chapters.push({
      number: i,
      title: randomTitle,
      description,
      objectives: completeChapter.objectives,
      sections: completeChapter.sections, // Now contains full content
      expectedPages: completeChapter.expectedPages,
      keyComponents: completeChapter.keyComponents
    });
  }

  return {
    mainTitle,
    chapters
  };
}