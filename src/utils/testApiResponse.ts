// Test data matching the actual API response structure
export const mockApiResponse = {
  "success": true,
  "message": "Lesson plan preview generated successfully",
  "data": {
    "session_details": [
      {
        "session_number": 1,
        "learning_objectives": [
          "Define photosynthesis",
          "Identify the essential components needed for photosynthesis",
          "Understand the role of chlorophyll"
        ],
        "topics_covered": [
          "Introduction to photosynthesis",
          "Basic requirements for photosynthesis",
          "Role of chlorophyll"
        ],
        "teaching_flow": [
          {
            "time_slot": "0-10 min",
            "activity": "Introduction and prior knowledge check",
            "description": "Class discussion about how plants get their food"
          },
          {
            "time_slot": "10-25 min",
            "activity": "Core concept explanation",
            "description": "Explain photosynthesis definition and basic requirements"
          },
          {
            "time_slot": "25-35 min",
            "activity": "Interactive discussion",
            "description": "Group discussion about role of chlorophyll and sunlight"
          },
          {
            "time_slot": "35-45 min",
            "activity": "Concept reinforcement",
            "description": "Quick recap and clarification of doubts"
          }
        ]
      },
      {
        "session_number": 2,
        "learning_objectives": [
          "Understand the process of photosynthesis",
          "Learn about the raw materials required",
          "Identify the products formed"
        ],
        "topics_covered": [
          "Process of photosynthesis",
          "Raw materials",
          "Products of photosynthesis"
        ],
        "teaching_flow": [
          {
            "time_slot": "0-10 min",
            "activity": "Review previous concepts",
            "description": "Quick recap of previous session"
          },
          {
            "time_slot": "10-30 min",
            "activity": "Main lesson",
            "description": "Detailed explanation of photosynthesis process"
          },
          {
            "time_slot": "30-45 min",
            "activity": "Interactive learning",
            "description": "Drawing and labeling of photosynthesis process"
          }
        ]
      }
    ],
    "overall_objectives": [
      "Understand the complete process of photosynthesis",
      "Recognize the importance of photosynthesis in nature",
      "Identify the factors affecting photosynthesis",
      "Apply knowledge to real-world scenarios"
    ],
    "prerequisites": [
      "Basic knowledge of plant parts",
      "Understanding of cell structure",
      "Familiarity with terms like chlorophyll and stomata"
    ],
    "learning_outcomes": [
      "Ability to explain the process of photosynthesis",
      "Understanding of the role of different components in photosynthesis",
      "Knowledge of factors affecting photosynthesis",
      "Appreciation of photosynthesis importance in nature"
    ]
  }
};

// Function to test the API response structure
export const testApiResponseStructure = (response: unknown): boolean => {
  try {
    // Type guard to check if response has the expected structure
    if (
      typeof response !== 'object' || 
      response === null ||
      !('success' in response) ||
      !('message' in response) ||
      !('data' in response)
    ) {
      return false;
    }

    const typedResponse = response as { 
      success: boolean; 
      message: string; 
      data: {
        session_details: Array<{
          session_number: number;
          learning_objectives: string[];
          topics_covered: string[];
          teaching_flow: Array<{
            time_slot: string;
            activity: string;
            description: string;
          }>;
        }>;
        overall_objectives: string[];
        prerequisites: string[];
        learning_outcomes: string[];
      };
    };
    
    // Check main structure
    if (!typedResponse.success || !typedResponse.message || !typedResponse.data) {
      return false;
    }

    const { data } = typedResponse;

    // Check session_details structure
    if (!Array.isArray(data.session_details)) {
      return false;
    }

    // Check each session structure
    for (const session of data.session_details) {
      if (
        typeof session.session_number !== 'number' ||
        !Array.isArray(session.learning_objectives) ||
        !Array.isArray(session.topics_covered) ||
        !Array.isArray(session.teaching_flow)
      ) {
        return false;
      }

      // Check teaching_flow structure
      for (const flow of session.teaching_flow) {
        if (!flow.time_slot || !flow.activity || !flow.description) {
          return false;
        }
      }
    }

    // Check other arrays
    if (
      !Array.isArray(data.overall_objectives) ||
      !Array.isArray(data.prerequisites) ||
      !Array.isArray(data.learning_outcomes)
    ) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating API response structure:', error);
    return false;
  }
};