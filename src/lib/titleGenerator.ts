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

  // Generate comprehensive chapters
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
    
    chapters.push({
      number: i,
      title: randomTitle,
      description,
      objectives: chapterData.objectives,
      sections: chapterData.sections,
      expectedPages: chapterData.expectedPages,
      keyComponents: chapterData.keyComponents
    });
  }

  return {
    mainTitle,
    chapters
  };
}