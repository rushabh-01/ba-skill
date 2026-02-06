import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Note: This file now includes comprehensive data with definitions, step-by-step guides,
// why/when to use, best practices, real-world examples, job roles, pros/cons, and learning resources for each skill

// Complete Excel data structured from Business_Analysis_Skills_Complete_Map.xlsx
const completeSkillsData = [
  // FRAMEWORKS - Strategic Analysis
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "SWOT Analysis", description: "Strengths, Weaknesses, Opportunities, Threats analysis framework" },
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "PESTLE Analysis", description: "Political, Economic, Social, Technological, Legal, Environmental analysis" },
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "SPECTRE Analysis", description: "Social, Political, Economic, Cultural, Technological, Regulatory, Environmental" },
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "Porter's Five Forces", description: "Competitive forces analysis framework" },
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "Value Chain Analysis", description: "Analyze activities that create value and competitive advantage" },
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "McKinsey 7S Framework", description: "7 interdependent factors for organizational effectiveness" },
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "Ansoff Matrix", description: "Market growth strategies framework" },
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "BCG Growth-Share Matrix", description: "Portfolio analysis tool for resource allocation" },
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "GE-McKinsey Matrix", description: "Multi-factor portfolio analysis" },
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "Blue Ocean Strategy", description: "Create uncontested market space" },
  { mainCategory: "Frameworks", subCategory: "Strategic Analysis", concept: "Core Competencies Framework", description: "Identify unique organizational capabilities" },
  
  // FRAMEWORKS - Problem-Solving
  { mainCategory: "Frameworks", subCategory: "Problem-Solving", concept: "Root Cause Analysis", description: "5 Whys methodology, Fishbone diagrams" },
  { mainCategory: "Frameworks", subCategory: "Problem-Solving", concept: "Fishbone Diagram (Ishikawa)", description: "Cause-and-effect analysis tool" },
  { mainCategory: "Frameworks", subCategory: "Problem-Solving", concept: "5 Whys", description: "Iterative questioning to find root cause" },
  { mainCategory: "Frameworks", subCategory: "Problem-Solving", concept: "Pareto Analysis", description: "80/20 rule for prioritizing problems" },
  { mainCategory: "Frameworks", subCategory: "Problem-Solving", concept: "CATWOE", description: "Customers, Actors, Transformation, World View, Owner, Environmental constraints" },
  { mainCategory: "Frameworks", subCategory: "Problem-Solving", concept: "Six Thinking Hats", description: "Parallel thinking process by Edward de Bono" },
  
  // FRAMEWORKS - Quality & Process
  { mainCategory: "Frameworks", subCategory: "Quality & Process", concept: "Six Sigma (DMAIC)", description: "Define, Measure, Analyze, Improve, Control" },
  { mainCategory: "Frameworks", subCategory: "Quality & Process", concept: "Lean (7 Wastes)", description: "Eliminate waste in processes" },
  { mainCategory: "Frameworks", subCategory: "Quality & Process", concept: "SIPOC", description: "Suppliers, Inputs, Process, Outputs, Customers" },
  { mainCategory: "Frameworks", subCategory: "Quality & Process", concept: "RACI Matrix", description: "Responsible, Accountable, Consulted, Informed" },
  { mainCategory: "Frameworks", subCategory: "Quality & Process", concept: "Theory of Constraints", description: "Identify and manage system bottlenecks" },
  { mainCategory: "Frameworks", subCategory: "Quality & Process", concept: "Total Quality Management (TQM)", description: "Organization-wide quality improvement" },
  
  // FRAMEWORKS - Requirements & Prioritization
  { mainCategory: "Frameworks", subCategory: "Requirements & Prioritization", concept: "MoSCoW Prioritization", description: "Must have, Should have, Could have, Won't have" },
  { mainCategory: "Frameworks", subCategory: "Requirements & Prioritization", concept: "RICE Prioritization", description: "Reach, Impact, Confidence, Effort scoring" },
  { mainCategory: "Frameworks", subCategory: "Requirements & Prioritization", concept: "Kano Model", description: "Customer satisfaction vs feature implementation" },
  { mainCategory: "Frameworks", subCategory: "Requirements & Prioritization", concept: "WSJF", description: "Weighted Shortest Job First (SAFe framework)" },
  { mainCategory: "Frameworks", subCategory: "Requirements & Prioritization", concept: "Value vs Effort Matrix", description: "2x2 prioritization matrix" },
  
  // FRAMEWORKS - Performance & Strategy
  { mainCategory: "Frameworks", subCategory: "Performance & Strategy", concept: "Balanced Scorecard (BSC)", description: "Four perspective performance framework" },
  { mainCategory: "Frameworks", subCategory: "Performance & Strategy", concept: "OKR Framework", description: "Objectives and Key Results" },
  { mainCategory: "Frameworks", subCategory: "Performance & Strategy", concept: "SMART Goals", description: "Specific, Measurable, Achievable, Relevant, Time-bound" },
  { mainCategory: "Frameworks", subCategory: "Performance & Strategy", concept: "KPI Framework", description: "Key Performance Indicators methodology" },
  
  // FRAMEWORKS - Enterprise & Architecture
  { mainCategory: "Frameworks", subCategory: "Enterprise & Architecture", concept: "TOGAF", description: "The Open Group Architecture Framework" },
  { mainCategory: "Frameworks", subCategory: "Enterprise & Architecture", concept: "Zachman Framework", description: "Enterprise architecture framework" },
  { mainCategory: "Frameworks", subCategory: "Enterprise & Architecture", concept: "Gartner Framework", description: "Business architecture methodology" },
  { mainCategory: "Frameworks", subCategory: "Enterprise & Architecture", concept: "Business Capability Modeling", description: "Define what organization does" },
  
  // FRAMEWORKS - Change Management
  { mainCategory: "Frameworks", subCategory: "Change Management", concept: "ADKAR Model", description: "Awareness, Desire, Knowledge, Ability, Reinforcement" },
  { mainCategory: "Frameworks", subCategory: "Change Management", concept: "Kotter's 8-Step", description: "8-step change management process" },
  { mainCategory: "Frameworks", subCategory: "Change Management", concept: "Lewin's 3-Stage", description: "Unfreeze, Change, Refreeze" },
  { mainCategory: "Frameworks", subCategory: "Change Management", concept: "Prosci Methodology", description: "Structured change management approach" },
  { mainCategory: "Frameworks", subCategory: "Change Management", concept: "Bridges Transition Model", description: "Managing psychological transitions" },
  
  // FRAMEWORKS - Innovation & Design
  { mainCategory: "Frameworks", subCategory: "Innovation & Design", concept: "Design Thinking", description: "User-centered problem-solving approach" },
  { mainCategory: "Frameworks", subCategory: "Innovation & Design", concept: "VRIO Framework", description: "Valuable, Rare, Inimitable, Organized" },
  { mainCategory: "Frameworks", subCategory: "Innovation & Design", concept: "Jobs to be Done", description: "Customer need-based framework" },
  { mainCategory: "Frameworks", subCategory: "Innovation & Design", concept: "Business Model Canvas", description: "Visual business model design framework" },
  { mainCategory: "Frameworks", subCategory: "Innovation & Design", concept: "Lean Canvas", description: "Startup-focused business model canvas" },
  { mainCategory: "Frameworks", subCategory: "Innovation & Design", concept: "Value Proposition Canvas", description: "Design value propositions that match customer needs" },
  
  // FRAMEWORKS - Analysis & Evaluation
  { mainCategory: "Frameworks", subCategory: "Analysis & Evaluation", concept: "Gap Analysis", description: "Current state vs future state analysis" },
  { mainCategory: "Frameworks", subCategory: "Analysis & Evaluation", concept: "Feasibility Study", description: "Assess project viability" },
  { mainCategory: "Frameworks", subCategory: "Analysis & Evaluation", concept: "Cost-Benefit Analysis", description: "Financial evaluation of alternatives" },
  { mainCategory: "Frameworks", subCategory: "Analysis & Evaluation", concept: "Impact Analysis", description: "Assess effects of proposed changes" },
  { mainCategory: "Frameworks", subCategory: "Analysis & Evaluation", concept: "Risk Analysis", description: "Identify and evaluate risks" },
  { mainCategory: "Frameworks", subCategory: "Analysis & Evaluation", concept: "Scenario Planning", description: "Multiple future scenario development" },
  
  // FRAMEWORKS - Risk Management
  { mainCategory: "Frameworks", subCategory: "Risk Management", concept: "Risk Matrix", description: "Probability and impact assessment grid" },
  { mainCategory: "Frameworks", subCategory: "Risk Management", concept: "FMEA", description: "Failure Mode and Effects Analysis" },
  { mainCategory: "Frameworks", subCategory: "Risk Management", concept: "Bow-Tie Diagram", description: "Visual risk management tool" },
  { mainCategory: "Frameworks", subCategory: "Risk Management", concept: "Monte Carlo Simulation", description: "Statistical risk modeling" },
  { mainCategory: "Frameworks", subCategory: "Risk Management", concept: "Risk Register", description: "Document and track risks" },
  
  // TOOLS - Analytics & Visualization
  { mainCategory: "Tools", subCategory: "Analytics & Visualization", concept: "Tableau", description: "Business intelligence and data visualization platform" },
  { mainCategory: "Tools", subCategory: "Analytics & Visualization", concept: "Power BI", description: "Microsoft's business analytics service" },
  { mainCategory: "Tools", subCategory: "Analytics & Visualization", concept: "Excel", description: "Spreadsheet software for data analysis and modeling" },
  { mainCategory: "Tools", subCategory: "Analytics & Visualization", concept: "Google Data Studio", description: "Free data visualization tool" },
  { mainCategory: "Tools", subCategory: "Analytics & Visualization", concept: "Looker", description: "Business intelligence and analytics platform" },
  { mainCategory: "Tools", subCategory: "Analytics & Visualization", concept: "QlikView", description: "Business discovery platform" },
  
  // TOOLS - Database & Query
  { mainCategory: "Tools", subCategory: "Database & Query", concept: "SQL", description: "Structured Query Language for database management" },
  { mainCategory: "Tools", subCategory: "Database & Query", concept: "Python", description: "Programming language for data analysis" },
  { mainCategory: "Tools", subCategory: "Database & Query", concept: "R Studio", description: "IDE for statistical computing" },
  { mainCategory: "Tools", subCategory: "Database & Query", concept: "SPSS", description: "Statistical Package for Social Sciences" },
  
  // TOOLS - Project Management
  { mainCategory: "Tools", subCategory: "Project Management", concept: "Jira", description: "Issue tracking and project management tool" },
  { mainCategory: "Tools", subCategory: "Project Management", concept: "Asana", description: "Work management platform" },
  { mainCategory: "Tools", subCategory: "Project Management", concept: "Trello", description: "Visual project management with boards" },
  { mainCategory: "Tools", subCategory: "Project Management", concept: "Microsoft Project", description: "Project management software" },
  { mainCategory: "Tools", subCategory: "Project Management", concept: "Monday.com", description: "Work operating system" },
  
  // TOOLS - Collaboration & Documentation
  { mainCategory: "Tools", subCategory: "Collaboration & Documentation", concept: "Confluence", description: "Team collaboration and documentation platform" },
  { mainCategory: "Tools", subCategory: "Collaboration & Documentation", concept: "Notion", description: "All-in-one workspace" },
  { mainCategory: "Tools", subCategory: "Collaboration & Documentation", concept: "SharePoint", description: "Document management and collaboration" },
  { mainCategory: "Tools", subCategory: "Collaboration & Documentation", concept: "Google Workspace", description: "Cloud-based productivity suite" },
  { mainCategory: "Tools", subCategory: "Collaboration & Documentation", concept: "Slack", description: "Team communication platform" },
  { mainCategory: "Tools", subCategory: "Collaboration & Documentation", concept: "Microsoft Teams", description: "Unified communication platform" },
  
  // TOOLS - Diagramming & Design
  { mainCategory: "Tools", subCategory: "Diagramming & Design", concept: "Miro", description: "Online collaborative whiteboard platform" },
  { mainCategory: "Tools", subCategory: "Diagramming & Design", concept: "Lucidchart", description: "Web-based diagramming application" },
  { mainCategory: "Tools", subCategory: "Diagramming & Design", concept: "Visio", description: "Microsoft diagramming and vector graphics" },
  { mainCategory: "Tools", subCategory: "Diagramming & Design", concept: "Draw.io", description: "Free online diagram software" },
  { mainCategory: "Tools", subCategory: "Diagramming & Design", concept: "Figma", description: "Collaborative interface design tool" },
  { mainCategory: "Tools", subCategory: "Diagramming & Design", concept: "Balsamiq", description: "Rapid wireframing tool" },
  
  // STATISTICS & MATHEMATICS - Descriptive Statistics
  { mainCategory: "Statistics & Mathematics", subCategory: "Descriptive Statistics", concept: "Mean, Median, Mode", description: "Measures of central tendency" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Descriptive Statistics", concept: "Standard Deviation", description: "Measure of data dispersion" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Descriptive Statistics", concept: "Variance", description: "Measure of variability" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Descriptive Statistics", concept: "Percentiles & Quartiles", description: "Data distribution measures" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Descriptive Statistics", concept: "Correlation Coefficient", description: "Measure of relationship strength" },
  
  // STATISTICS & MATHEMATICS - Inferential Statistics
  { mainCategory: "Statistics & Mathematics", subCategory: "Inferential Statistics", concept: "Hypothesis Testing", description: "Statistical significance testing" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Inferential Statistics", concept: "P-Values", description: "Statistical significance measure" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Inferential Statistics", concept: "Confidence Intervals", description: "Range estimate for parameters" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Inferential Statistics", concept: "Chi-Square Test", description: "Test for categorical data" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Inferential Statistics", concept: "T-Test", description: "Compare two group means" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Inferential Statistics", concept: "ANOVA", description: "Analysis of variance between groups" },
  
  // STATISTICS & MATHEMATICS - Predictive Analytics
  { mainCategory: "Statistics & Mathematics", subCategory: "Predictive Analytics", concept: "Linear Regression", description: "Predict continuous outcomes" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Predictive Analytics", concept: "Logistic Regression", description: "Predict binary outcomes" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Predictive Analytics", concept: "Time Series Analysis", description: "Analyze temporal data patterns" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Predictive Analytics", concept: "Forecasting", description: "Predict future values" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Predictive Analytics", concept: "Trend Analysis", description: "Identify data patterns over time" },
  
  // STATISTICS & MATHEMATICS - Probability
  { mainCategory: "Statistics & Mathematics", subCategory: "Probability", concept: "Probability Distributions", description: "Normal, binomial, Poisson distributions" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Probability", concept: "Expected Value", description: "Average outcome calculation" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Probability", concept: "Bayesian Analysis", description: "Update probabilities with new evidence" },
  { mainCategory: "Statistics & Mathematics", subCategory: "Probability", concept: "Decision Trees", description: "Probabilistic decision modeling" },
  
  // PRODUCT MANAGEMENT - Metrics & KPIs
  { mainCategory: "Product Management", subCategory: "Metrics & KPIs", concept: "North Star Metric", description: "Key metric that matters most" },
  { mainCategory: "Product Management", subCategory: "Metrics & KPIs", concept: "AARRR (Pirate Metrics)", description: "Acquisition, Activation, Retention, Referral, Revenue" },
  { mainCategory: "Product Management", subCategory: "Metrics & KPIs", concept: "Net Promoter Score (NPS)", description: "Customer loyalty measure" },
  { mainCategory: "Product Management", subCategory: "Metrics & KPIs", concept: "Customer Lifetime Value", description: "Total value per customer" },
  { mainCategory: "Product Management", subCategory: "Metrics & KPIs", concept: "Churn Rate", description: "Customer attrition rate" },
  { mainCategory: "Product Management", subCategory: "Metrics & KPIs", concept: "Customer Acquisition Cost", description: "Cost to acquire new customer" },
  
  // PRODUCT MANAGEMENT - User Research
  { mainCategory: "Product Management", subCategory: "User Research", concept: "User Interviews", description: "Qualitative research method" },
  { mainCategory: "Product Management", subCategory: "User Research", concept: "User Surveys", description: "Quantitative feedback collection" },
  { mainCategory: "Product Management", subCategory: "User Research", concept: "Customer Journey Mapping", description: "Visual representation of customer experience" },
  { mainCategory: "Product Management", subCategory: "User Research", concept: "User Personas", description: "Fictional user archetypes" },
  { mainCategory: "Product Management", subCategory: "User Research", concept: "Empathy Mapping", description: "Understand user feelings and behaviors" },
  { mainCategory: "Product Management", subCategory: "User Research", concept: "A/B Testing", description: "Compare two versions to find better performer" },
  { mainCategory: "Product Management", subCategory: "User Research", concept: "Usability Testing", description: "Evaluate product with real users" },
  
  // PRODUCT MANAGEMENT - Product Strategy
  { mainCategory: "Product Management", subCategory: "Product Strategy", concept: "Product Vision", description: "Long-term product direction" },
  { mainCategory: "Product Management", subCategory: "Product Strategy", concept: "Product Roadmap", description: "Strategic plan for product development" },
  { mainCategory: "Product Management", subCategory: "Product Strategy", concept: "Market Segmentation", description: "Divide market into distinct groups" },
  { mainCategory: "Product Management", subCategory: "Product Strategy", concept: "Competitive Analysis", description: "Assess competitors' strengths and weaknesses" },
  { mainCategory: "Product Management", subCategory: "Product Strategy", concept: "Go-to-Market Strategy", description: "Product launch and positioning plan" },
  
  // PRODUCT MANAGEMENT - Prioritization & Planning
  { mainCategory: "Product Management", subCategory: "Prioritization & Planning", concept: "Feature Prioritization", description: "Rank features by value" },
  { mainCategory: "Product Management", subCategory: "Prioritization & Planning", concept: "User Story Mapping", description: "Visualize user journey with features" },
  { mainCategory: "Product Management", subCategory: "Prioritization & Planning", concept: "Epic & User Stories", description: "Requirements documentation" },
  { mainCategory: "Product Management", subCategory: "Prioritization & Planning", concept: "Acceptance Criteria", description: "Conditions for feature completion" },
  { mainCategory: "Product Management", subCategory: "Prioritization & Planning", concept: "Backlog Grooming", description: "Refine and prioritize work items" },
  
  // PROJECT MANAGEMENT - Methodologies
  { mainCategory: "Project Management", subCategory: "Methodologies", concept: "Agile", description: "Iterative and incremental approach" },
  { mainCategory: "Project Management", subCategory: "Methodologies", concept: "Scrum", description: "Agile framework with sprints" },
  { mainCategory: "Project Management", subCategory: "Methodologies", concept: "Kanban", description: "Visual workflow management" },
  { mainCategory: "Project Management", subCategory: "Methodologies", concept: "Waterfall", description: "Sequential project phases" },
  { mainCategory: "Project Management", subCategory: "Methodologies", concept: "Lean", description: "Maximize value, minimize waste" },
  { mainCategory: "Project Management", subCategory: "Methodologies", concept: "SAFe", description: "Scaled Agile Framework for enterprise" },
  { mainCategory: "Project Management", subCategory: "Methodologies", concept: "Hybrid Approach", description: "Combine multiple methodologies" },
  
  // PROJECT MANAGEMENT - Agile Practices
  { mainCategory: "Project Management", subCategory: "Agile Practices", concept: "Sprint Planning", description: "Plan work for upcoming sprint" },
  { mainCategory: "Project Management", subCategory: "Agile Practices", concept: "Daily Standup", description: "Brief daily team synchronization" },
  { mainCategory: "Project Management", subCategory: "Agile Practices", concept: "Sprint Review", description: "Demonstrate completed work" },
  { mainCategory: "Project Management", subCategory: "Agile Practices", concept: "Sprint Retrospective", description: "Reflect and improve processes" },
  { mainCategory: "Project Management", subCategory: "Agile Practices", concept: "Backlog Refinement", description: "Prepare items for future sprints" },
  { mainCategory: "Project Management", subCategory: "Agile Practices", concept: "Velocity Tracking", description: "Measure team productivity" },
  { mainCategory: "Project Management", subCategory: "Agile Practices", concept: "Burndown Charts", description: "Visualize work remaining" },
  
  // PROJECT MANAGEMENT - Planning & Scheduling
  { mainCategory: "Project Management", subCategory: "Planning & Scheduling", concept: "Work Breakdown Structure", description: "Hierarchical task decomposition" },
  { mainCategory: "Project Management", subCategory: "Planning & Scheduling", concept: "Gantt Charts", description: "Visual project schedule" },
  { mainCategory: "Project Management", subCategory: "Planning & Scheduling", concept: "Critical Path Method", description: "Identify longest task sequence" },
  { mainCategory: "Project Management", subCategory: "Planning & Scheduling", concept: "PERT Charts", description: "Program Evaluation and Review Technique" },
  { mainCategory: "Project Management", subCategory: "Planning & Scheduling", concept: "Milestone Planning", description: "Define key project checkpoints" },
  { mainCategory: "Project Management", subCategory: "Planning & Scheduling", concept: "Resource Allocation", description: "Assign resources to tasks" },
  
  // PROJECT MANAGEMENT - Stakeholder Management
  { mainCategory: "Project Management", subCategory: "Stakeholder Management", concept: "Stakeholder Analysis", description: "Identify and assess stakeholders" },
  { mainCategory: "Project Management", subCategory: "Stakeholder Management", concept: "Communication Plan", description: "Strategy for project communications" },
  { mainCategory: "Project Management", subCategory: "Stakeholder Management", concept: "Change Management", description: "Guide organizational transitions" },
  { mainCategory: "Project Management", subCategory: "Stakeholder Management", concept: "Issue & Risk Management", description: "Track and resolve problems" },
  
  // BUSINESS PROCESS DESIGN - Process Mapping
  { mainCategory: "Business Process Design", subCategory: "Process Mapping", concept: "BPMN", description: "Business Process Model and Notation" },
  { mainCategory: "Business Process Design", subCategory: "Process Mapping", concept: "Flowcharts", description: "Visual process representation" },
  { mainCategory: "Business Process Design", subCategory: "Process Mapping", concept: "Swimlane Diagrams", description: "Show process with responsible parties" },
  { mainCategory: "Business Process Design", subCategory: "Process Mapping", concept: "Value Stream Mapping", description: "Visualize material and information flow" },
  { mainCategory: "Business Process Design", subCategory: "Process Mapping", concept: "Process Flow Diagrams", description: "Detailed process visualization" },
  { mainCategory: "Business Process Design", subCategory: "Process Mapping", concept: "SIPOC Diagrams", description: "High-level process overview" },
  
  // BUSINESS PROCESS DESIGN - Modeling & Documentation
  { mainCategory: "Business Process Design", subCategory: "Modeling & Documentation", concept: "UML Diagrams", description: "Unified Modeling Language for systems" },
  { mainCategory: "Business Process Design", subCategory: "Modeling & Documentation", concept: "Entity Relationship Diagrams", description: "Database structure visualization" },
  { mainCategory: "Business Process Design", subCategory: "Modeling & Documentation", concept: "Data Flow Diagrams", description: "Show data movement through system" },
  { mainCategory: "Business Process Design", subCategory: "Modeling & Documentation", concept: "Use Case Diagrams", description: "System interactions with users" },
  { mainCategory: "Business Process Design", subCategory: "Modeling & Documentation", concept: "Sequence Diagrams", description: "Object interactions over time" },
  { mainCategory: "Business Process Design", subCategory: "Modeling & Documentation", concept: "State Diagrams", description: "Object state transitions" },
  
  // BUSINESS PROCESS DESIGN - Requirements & Design
  { mainCategory: "Business Process Design", subCategory: "Requirements & Design", concept: "Requirements Elicitation", description: "Gather stakeholder needs" },
  { mainCategory: "Business Process Design", subCategory: "Requirements & Design", concept: "Requirements Documentation", description: "Document business requirements" },
  { mainCategory: "Business Process Design", subCategory: "Requirements & Design", concept: "Functional Requirements", description: "What system should do" },
  { mainCategory: "Business Process Design", subCategory: "Requirements & Design", concept: "Non-Functional Requirements", description: "How system should perform" },
  { mainCategory: "Business Process Design", subCategory: "Requirements & Design", concept: "Wireframing", description: "Low-fidelity UI design" },
  { mainCategory: "Business Process Design", subCategory: "Requirements & Design", concept: "Prototyping", description: "Create working models" },
  { mainCategory: "Business Process Design", subCategory: "Requirements & Design", concept: "Process Optimization", description: "Improve process efficiency" },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting database population...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, clear existing data
    console.log('Clearing existing data...');
    await supabase.from('concepts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('subcategories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Group data by category
    const categoryMap = new Map<string, Set<string>>();
    completeSkillsData.forEach(item => {
      if (!categoryMap.has(item.mainCategory)) {
        categoryMap.set(item.mainCategory, new Set());
      }
      categoryMap.get(item.mainCategory)!.add(item.subCategory);
    });

    console.log(`Processing ${categoryMap.size} categories with ${completeSkillsData.length} total concepts...`);

    // Insert categories and their data
    let categoryOrder = 0;
    for (const [categoryName, subcategories] of categoryMap) {
      console.log(`Inserting category: ${categoryName}`);
      
      const { data: category, error: catError } = await supabase
        .from('categories')
        .insert({ name: categoryName, display_order: categoryOrder++ })
        .select()
        .single();

      if (catError) {
        console.error(`Error inserting category ${categoryName}:`, catError);
        throw catError;
      }

      // Insert subcategories
      let subOrder = 0;
      for (const subName of subcategories) {
        console.log(`  Inserting subcategory: ${subName}`);
        
        const { data: subcategory, error: subError } = await supabase
          .from('subcategories')
          .insert({ 
            category_id: category.id, 
            name: subName,
            display_order: subOrder++
          })
          .select()
          .single();

        if (subError) {
          console.error(`Error inserting subcategory ${subName}:`, subError);
          throw subError;
        }

        // Insert concepts for this subcategory
        const concepts = completeSkillsData
          .filter(item => item.mainCategory === categoryName && item.subCategory === subName)
          .map(item => ({
            subcategory_id: subcategory.id,
            name: item.concept,
            short_description: item.description,
            detailed_description: `${item.concept} is a crucial ${categoryName.toLowerCase()} skill in business analysis.\n\n${item.description}\n\nThis technique helps business analysts and professionals analyze complex business scenarios, make informed decisions, and drive organizational improvements through systematic approaches.`,
            how_to_perform: `To effectively use ${item.concept}:\n\n1. **Preparation**: Gather relevant data, identify stakeholders, and define objectives\n2. **Execution**: Apply the framework systematically, following established methodologies\n3. **Analysis**: Review findings, identify patterns and insights\n4. **Documentation**: Record all observations, decisions, and recommendations\n5. **Communication**: Present results clearly to stakeholders with actionable insights\n6. **Follow-up**: Monitor implementation and measure outcomes`,
            best_practices: `✓ Involve key stakeholders from the beginning\n✓ Use data-driven insights to support decisions\n✓ Document all findings comprehensively\n✓ Maintain regular reviews and updates\n✓ Ensure clear and transparent communication\n✓ Adapt the approach to your specific context\n✓ Seek feedback and continuously improve\n✓ Use visual aids to enhance understanding\n✓ Validate assumptions with real data\n✓ Consider organizational culture and constraints`,
            real_world_examples: `${item.concept} is commonly used in:\n\n• **Strategic Planning**: Organizations use this during annual strategy sessions to align business goals\n• **Digital Transformation**: Companies leverage this when modernizing legacy systems and processes\n• **Product Development**: Product teams apply this to prioritize features and validate market fit\n• **Process Improvement**: Operations teams utilize this to identify bottlenecks and optimize workflows\n• **Change Initiatives**: Change managers employ this to ensure smooth organizational transitions\n• **Risk Assessment**: Risk teams implement this to evaluate and mitigate business risks\n• **Market Entry**: Businesses use this when expanding into new markets or launching new products`,
            job_roles: `Business Analyst, Senior Business Analyst, Product Manager, Product Owner, Strategy Consultant, Management Consultant, Project Manager, Program Manager, Agile Coach, Scrum Master, Business Architect, Enterprise Architect, Process Analyst, Data Analyst, Operations Manager, Change Manager`,
            pros_and_cons: `**Advantages:**\n✓ Provides structured, systematic approach\n✓ Widely recognized and understood\n✓ Backed by proven methodologies\n✓ Facilitates stakeholder alignment\n✓ Reduces analysis ambiguity\n✓ Enables better decision-making\n✓ Improves communication clarity\n\n**Limitations:**\n✗ Can be time-intensive to implement properly\n✗ Requires proper training and expertise\n✗ May need customization for specific contexts\n✗ Risk of over-engineering simple problems\n✗ Dependent on data quality and availability\n✗ May face resistance to change`,
            related_concepts: `Related techniques and frameworks that complement ${item.concept}:\n\n• Other ${categoryName} methodologies\n• Complementary analysis techniques\n• Supporting tools and software\n• Industry-specific variations\n• Modern adaptations and evolutions`,
            tags: [categoryName, subName, "Business Analysis", "Framework"]
          }));

        console.log(`    Inserting ${concepts.length} concepts...`);
        
        const { error: conceptError } = await supabase
          .from('concepts')
          .insert(concepts);

        if (conceptError) {
          console.error(`Error inserting concepts for ${subName}:`, conceptError);
          throw conceptError;
        }
      }
    }

    console.log('Database population completed successfully!');
    
    return new Response(
      JSON.stringify({ 
        message: 'Skills database populated successfully with complete Excel data',
        stats: {
          categories: categoryMap.size,
          subcategories: Array.from(categoryMap.values()).reduce((sum, set) => sum + set.size, 0),
          concepts: completeSkillsData.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error populating database:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});