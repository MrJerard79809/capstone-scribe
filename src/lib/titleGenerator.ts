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
  }[];
}

const fieldTemplates: Record<string, string[]> = {
  'computer-science': [
    'Development of', 'Implementation of', 'Design and Analysis of', 'A Study on', 'Optimization of'
  ],
  'business': [
    'Strategic Analysis of', 'Impact of', 'A Comprehensive Study on', 'Performance Evaluation of', 'Market Analysis of'
  ],
  'education': [
    'Effectiveness of', 'Impact of', 'A Comparative Study on', 'Implementation of', 'Assessment of'
  ],
  'psychology': [
    'Psychological Impact of', 'Behavioral Analysis of', 'A Study on the Effects of', 'Understanding', 'Exploring'
  ],
  'engineering': [
    'Design and Development of', 'Performance Analysis of', 'Optimization of', 'A Novel Approach to', 'Implementation of'
  ],
  'healthcare': [
    'Clinical Study on', 'Impact of', 'Effectiveness of', 'A Comprehensive Analysis of', 'Health Outcomes of'
  ],
  'default': [
    'A Study on', 'Analysis of', 'Investigation of', 'Comprehensive Review of', 'Impact of'
  ]
};

const chapterTemplates = {
  1: {
    titles: [
      'Introduction',
      'Introduction and Background',
      'Introduction to the Study',
      'Problem Statement and Introduction'
    ],
    descriptions: [
      'This chapter introduces the research problem, objectives, significance of the study, scope and limitations, and provides an overview of the research methodology.',
      'Presents the background of the study, statement of the problem, research objectives, research questions, and the significance of the study.',
      'Introduces the research topic, establishes the context, defines the problem, and outlines the structure of the entire study.'
    ]
  },
  2: {
    titles: [
      'Review of Related Literature',
      'Literature Review',
      'Theoretical Framework and Literature Review',
      'Review of Related Studies'
    ],
    descriptions: [
      'Comprehensive review of existing literature, theoretical frameworks, and previous studies related to the research topic.',
      'Examines current knowledge, identifies gaps in existing research, and establishes the theoretical foundation for the study.',
      'Synthesizes relevant literature, presents theoretical models, and develops the conceptual framework for the research.'
    ]
  },
  3: {
    titles: [
      'Research Methodology',
      'Methods and Procedures',
      'Research Design and Methodology',
      'Methodology and Research Design'
    ],
    descriptions: [
      'Details the research design, methodology, data collection procedures, sampling techniques, and data analysis methods.',
      'Explains the research approach, instruments used for data collection, population and sampling, and statistical analysis procedures.',
      'Describes the systematic approach used to conduct the research, including research design, data gathering procedures, and analytical techniques.'
    ]
  },
  4: {
    titles: [
      'Results and Discussion',
      'Data Analysis and Results',
      'Findings and Analysis',
      'Results and Interpretation'
    ],
    descriptions: [
      'Presents the findings of the study, data analysis results, and comprehensive discussion of the outcomes in relation to the research objectives.',
      'Analyzes collected data, presents statistical results, and discusses findings in the context of existing literature and theoretical framework.',
      'Details the research findings, interprets results, and discusses implications of the outcomes for theory and practice.'
    ]
  },
  5: {
    titles: [
      'Summary, Conclusions and Recommendations',
      'Conclusions and Recommendations',
      'Summary and Recommendations',
      'Conclusions, Implications and Recommendations'
    ],
    descriptions: [
      'Summarizes the key findings, draws conclusions based on the research results, and provides recommendations for future research and practical applications.',
      'Presents concluding thoughts, discusses implications of the findings, and suggests recommendations for policy, practice, and future studies.',
      'Concludes the study by summarizing major findings, discussing limitations, and providing actionable recommendations.'
    ]
  }
};

export function generateCapstoneProject(formData: FormData): GeneratedProject {
  const { field, topic, keywords, researchType } = formData;
  
  // Generate main title
  const templates = fieldTemplates[field] || fieldTemplates.default;
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  let mainTitle = `${randomTemplate} ${topic}`;
  
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
  
  // Add field context if relevant
  const fieldContexts: Record<string, string> = {
    'computer-science': ' in Computer Science Applications',
    'business': ' in Business Organizations',
    'education': ' in Educational Settings',
    'healthcare': ' in Healthcare Systems',
    'engineering': ' in Engineering Solutions'
  };
  
  if (fieldContexts[field] && !mainTitle.toLowerCase().includes(field.replace('-', ' '))) {
    mainTitle += fieldContexts[field];
  }

  // Generate chapters
  const chapters = [];
  for (let i = 1; i <= 5; i++) {
    const chapterData = chapterTemplates[i as keyof typeof chapterTemplates];
    const randomTitle = chapterData.titles[Math.floor(Math.random() * chapterData.titles.length)];
    const randomDescription = chapterData.descriptions[Math.floor(Math.random() * chapterData.descriptions.length)];
    
    chapters.push({
      number: i,
      title: randomTitle,
      description: randomDescription
    });
  }

  return {
    mainTitle,
    chapters
  };
}