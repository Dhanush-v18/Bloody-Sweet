import { ConsultingService } from '../types';

export const CONSULTING_SERVICES: ConsultingService[] = [
  {
    id: 'business',
    title: 'Business Strategy Consulting',
    subtitle: 'Strategic roadmaps, operations, and scalable growth',
    tagline: 'Turn uncertainty into systematic business execution.',
    description:
      'We help founders, entrepreneurs, and business leaders analyze operations, clarify market positioning, optimize capital allocation, and resolve structural bottlenecks.',
    bulletPoints: [
      'Business planning and milestone prioritization',
      'Sustainable growth strategy and go-to-market validation',
      'Operational friction points and team productivity improvement',
      'Unit economics and business decision-making under risk',
      'Risk assessment and proactive contingency planning'
    ],
    approach: [
      'Diagnosis: Audit current business model and constraint points',
      'Market & Economics: Evaluate margins, audience friction, and resources',
      'Tactical Roadmap: 30-60-90 day execution milestones with measurable metrics'
    ],
    expectedOutcome:
      'A sharp, actionable execution blueprint stripped of theoretical fluff, focused on real revenue and operational clarity.',
    ctaText: 'Discuss a Business Challenge',
    icon: 'Briefcase'
  },
  {
    id: 'personal',
    title: 'Personal Decision Consulting',
    subtitle: 'Structured decision support for life choices and competing priorities',
    tagline: 'When thoughts are tangled, step back and structure the options.',
    description:
      'Navigate difficult everyday choices, competing priorities, and high-stakes personal crossroads using neutral, structured decision frameworks.',
    bulletPoints: [
      'Everyday decisions and organizing overwhelming life choices',
      'Clarifying personal goals vs external expectations',
      'Evaluating trade-offs between competing priorities',
      'Comparing multiple divergent life or relocation paths',
      'Untangling emotional noise to uncover the fundamental trade-off'
    ],
    approach: [
      'Deconstruction: Map out the competing forces and hidden assumptions',
      'Matrix Comparison: Score upside vs downside risk across each option',
      'Action Protocol: Practical first steps to test hypotheses with minimal regret'
    ],
    expectedOutcome:
      'A balanced, grounded perspective that transforms decision paralysis into confident, intentional action.',
    ctaText: 'Discuss My Situation',
    disclaimer:
      'This service provides structured decision support and objective thinking frameworks; it is not licensed medical, legal, financial, or mental-health treatment.',
    icon: 'Compass'
  },
  {
    id: 'career',
    title: 'Career and Work Consulting',
    subtitle: 'Career trajectory, workplace dynamics, and professional elevation',
    tagline: 'Take conscious command of your professional journey.',
    description:
      'Designed for students, working professionals, and transitioning executives seeking clarity in career progression, workplace dynamics, and meaningful compensation.',
    bulletPoints: [
      'Career direction and long-term positioning strategy',
      'Professional skill development and leverage assessment',
      'Navigating workplace friction, organizational politics, and burnout',
      'Time management and executive personal productivity',
      'Strategic job change vs internal advancement trade-off analysis'
    ],
    approach: [
      'Skill & Market Audit: Uncover your unique professional leverage points',
      'Trajectory Assessment: Clarify target roles, industries, and compensation gaps',
      'Transition Strategy: Build a pragmatic narrative and targeted outreach plan'
    ],
    expectedOutcome:
      'A clear professional trajectory with actionable negotiation, development, and daily focus systems.',
    ctaText: 'Explore My Options',
    icon: 'TrendingUp'
  },
  {
    id: 'problem-solving',
    title: 'Problem-Solving Consulting',
    subtitle: 'A rigorous 5-step framework to resolve complex dilemmas',
    tagline: 'Any problem yields when broken into its constituent truths.',
    description:
      'When conventional thinking hits a dead end, we apply first-principles thinking and root-cause analysis to dismantle stubborn dilemmas.',
    bulletPoints: [
      'Step 1: Understand the situation in complete factual context',
      'Step 2: Identify the root underlying challenge beneath symptoms',
      'Step 3: Explore non-obvious, divergent solution architectures',
      'Step 4: Rigorously compare benefits, costs, second-order effects, and risks',
      'Step 5: Develop practical, immediate next steps with accountability'
    ],
    approach: [
      'Factual Dissection: Strip away emotional projections to find the core constraint',
      'Root Cause Analysis: Why does the problem persist despite previous efforts?',
      'Execution Architecture: Construct a fail-safe implementation plan'
    ],
    expectedOutcome:
      'Uncompromising clarity on why the issue exists and a sequenced path to permanently eliminate it.',
    ctaText: 'Find a Way Forward',
    icon: 'Layers'
  },
  {
    id: 'digital',
    title: 'Digital and Technology Consulting',
    subtitle: 'Architecture, digital roadmaps, modern workflows, and tooling',
    tagline: 'Pragmatic tech strategy that serves business reality, not hype.',
    description:
      'Guidance for entrepreneurs and organizations deciding what software to build, which platforms to adopt, and how to automate tedious operational workflows.',
    bulletPoints: [
      'Website and digital product planning from MVP to scale',
      'Technology stack selection and architecture review',
      'Workflow automation to reclaim team hours and reduce manual errors',
      'Digital productivity systems and cloud collaboration tools',
      'Technology investment decisions avoiding vendor lock-in'
    ],
    approach: [
      'Needs Architecture: Map workflows, data flows, and end-user goals',
      'Vendor & Stack Audit: Identify leanest, most reliable software solutions',
      'Implementation Roadmap: Step-by-step rollout plan with risk mitigation'
    ],
    expectedOutcome:
      'A lean, battle-tested technology plan that accelerates operations without needless overhead.',
    ctaText: 'Discuss My Project',
    icon: 'Cpu'
  }
];
