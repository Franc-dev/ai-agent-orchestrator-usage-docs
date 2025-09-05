# AI Workflow Orchestrator

A TypeScript-based AI workflow orchestrator that demonstrates multi-agent collaboration using the `ai-agent-sdk-orchestrator` package. This project showcases how different AI agents can work together in a sequential pipeline to process content.

## 🚀 Features

- **Multi-Agent Workflow**: Sequential execution of specialized AI agents
- **Multiple AI Models**: Integration with various AI models via OpenRouter
- **Environment Configuration**: Secure API key management with dotenv
- **TypeScript Support**: Full TypeScript implementation with proper type definitions
- **Comprehensive Logging**: Detailed execution metrics and step-by-step logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or pnpm package manager
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai/))

## 🛠️ Installation

1. **Clone or download the project**
   ```bash
   cd ai-agents
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the project root
   - Add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your-api-key-here
   ```

## 🎯 Usage

### Running the Workflow

```bash
npx ts-node advanced_orchestrator.ts
```

### What It Does

The orchestrator runs a creative writing and analysis pipeline with three sequential steps:

1. **Creative Writer Agent** (`openai/gpt-4o`)
   - Generates a compelling short story based on the input topic
   - Temperature: 0.8 (high creativity)

2. **Summarizer Agent** (`meta-llama/llama-3.1-8b-instruct`)
   - Creates a concise, one-paragraph summary of the generated story
   - Temperature: 0.2 (low creativity, high accuracy)

3. **Sentiment Analyzer Agent** (`google/gemma-7b-it:free`)
   - Analyzes the sentiment of the summary
   - Returns: Positive, Negative, or Neutral
   - Temperature: 0.1 (very low creativity, maximum consistency)

### Sample Output

```
📊 Final Results:
────────────────────────────────────────────────────────────

📖 Generated Story:
Title: The Luminaria of Mars

In the year 2045, humanity had finally set its footprints on Mars...

📝 Summary of Story:
In 2045, Commander Elara Hayes, a seasoned astronaut and chief botanist...

🎭 Sentiment of Summary:
Positive

📈 Execution Metrics:
──────────────────────────────
Total time: 15484 ms
Steps executed: 3
1. generate_story: 8609ms
2. summarize_story: 3296ms
3. analyze_sentiment: 3577ms
```

## 🏗️ Project Structure

```
ai-agents/
├── advanced_orchestrator.ts    # Main orchestrator implementation
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── .env                       # Environment variables (create this)
└── README.md                  # This file
```

## 🔧 Configuration

### TypeScript Configuration

The project uses a custom `tsconfig.json` optimized for Node.js development:

- **Module System**: CommonJS
- **Target**: ES2020
- **Types**: Node.js types included
- **Strict Mode**: Enabled for better type safety

### Agent Configuration

Each agent is configured with:

- **Model Provider**: OpenRouter (supports multiple AI providers)
- **Primary Model**: High-quality model for the specific task
- **Fallback Models**: Free alternatives if primary model fails
- **System Prompt**: Task-specific instructions
- **Temperature**: Controls creativity vs. consistency

## 🚨 Troubleshooting

### Common Issues

1. **"Cannot find name 'process'" Error**
   - Solution: Already fixed by installing `@types/node` and updating `tsconfig.json`

2. **"Unknown file extension .ts" Error**
   - Solution: Use `npx ts-node` instead of `node` to run TypeScript files

3. **"No auth credentials found" Error**
   - Solution: Ensure your `.env` file contains a valid `OPENROUTER_API_KEY`

4. **"Cannot read properties of undefined" Error**
   - Solution: Fixed by correcting the result variable access pattern

### Environment Setup

If you encounter module resolution issues:

1. Ensure `package.json` doesn't have `"type": "module"`
2. Verify `tsconfig.json` has `"module": "commonjs"`
3. Check that `verbatimModuleSyntax` is set to `false`

## 📦 Dependencies

### Production Dependencies
- `ai-agent-sdk-orchestrator`: Core orchestration framework
- `chalk`: Terminal string styling
- `dotenv`: Environment variable management

### Development Dependencies
- `@types/node`: Node.js type definitions
- `ts-node`: TypeScript execution environment
- `typescript`: TypeScript compiler

## 🔄 Workflow Customization

### Adding New Agents

```typescript
const newAgent = new Agent({
  id: "agent-id",
  name: "Agent Name",
  model: {
    provider: "openrouter",
    model: "model-name",
    apiKey: process.env.OPENROUTER_API_KEY!,
    fallbackModels: ["fallback-model"],
  },
  systemPrompt: "Your system prompt here",
  temperature: 0.5,
});

orchestrator.registerAgent(newAgent);
```
# AI Workflow Orchestrator - Functionalities Documentation

This document provides comprehensive documentation of every function, orchestration process, and registration mechanism in the AI Workflow Orchestrator package.

## Table of Contents

1. [Core Classes and Architecture](#core-classes-and-architecture)
2. [AgentOrchestrator Class](#agentorchestrator-class)
3. [Agent Class and Registration](#agent-class-and-registration)
4. [Workflow Class and Management](#workflow-class-and-management)
5. [Execution Process](#execution-process)
6. [Configuration and Setup](#configuration-and-setup)
7. [Error Handling and Logging](#error-handling-and-logging)
8. [Code Examples and Usage Patterns](#code-examples-and-usage-patterns)

## Core Classes and Architecture

The AI Workflow Orchestrator is built around three main classes:

- **`AgentOrchestrator`**: Central coordinator that manages agents and workflows
- **`Agent`**: Individual AI agents with specific capabilities and models
- **`Workflow`**: Sequential or parallel execution plans that coordinate multiple agents

### Architecture Overview

```typescript
import { AgentOrchestrator, Agent, Workflow } from "ai-agent-sdk-orchestrator";

// Main orchestrator instance
const orchestrator = new AgentOrchestrator({ logLevel: "info" });

// Individual agents
const agent1 = new Agent({ /* configuration */ });
const agent2 = new Agent({ /* configuration */ });

// Workflow definition
const workflow = new Workflow({ /* steps configuration */ });

// Registration and execution
orchestrator.registerAgent(agent1);
orchestrator.registerAgent(agent2);
orchestrator.registerWorkflow(workflow);
await orchestrator.execute("workflow-id", inputData);
```

## AgentOrchestrator Class

The `AgentOrchestrator` is the central hub that coordinates all AI agents and workflows.

### Constructor

```typescript
const orchestrator = new AgentOrchestrator({
  logLevel: "info" | "debug" | "warn" | "error"
});
```

**Parameters:**
- `logLevel`: Controls the verbosity of logging output

### Core Methods

#### 1. `registerAgent(agent: Agent): void`

Registers an agent with the orchestrator, making it available for workflow execution.

```typescript
// Create an agent
const creativeWriterAgent = new Agent({
  id: "creative-writer",
  name: "Creative Story Writer",
  model: {
    provider: "openrouter",
    model: "openai/gpt-4o",
    apiKey: process.env.OPENROUTER_API_KEY!,
    fallbackModels: ["mistralai/mistral-7b-instruct:free"],
  },
  systemPrompt: "You are a world-class short story author...",
  temperature: 0.8,
});

// Register the agent
orchestrator.registerAgent(creativeWriterAgent);
console.log("Agent registered successfully.");
```

**Functionality:**
- Validates agent configuration
- Stores agent in internal registry
- Makes agent available for workflow steps
- Throws error if agent ID already exists

#### 2. `registerWorkflow(workflow: Workflow): void`

Registers a workflow definition with the orchestrator.

```typescript
const workflow = new Workflow({
  id: "creative-analysis-workflow",
  name: "Creative Writing and Analysis Workflow",
  description: "Generates a story, then summarizes it and analyzes its sentiment.",
  steps: [
    {
      id: "generate_story",
      name: "Generate Story",
      type: "agent",
      agentId: "creative-writer",
    },
    {
      id: "summarize_story",
      name: "Summarize Story",
      type: "agent",
      agentId: "summarizer",
    },
    {
      id: "analyze_sentiment",
      name: "Analyze Sentiment",
      type: "agent",
      agentId: "sentiment-analyzer",
    },
  ],
});

orchestrator.registerWorkflow(workflow);
console.log("Workflow registered successfully.");
```

**Functionality:**
- Validates workflow configuration
- Ensures all referenced agents are registered
- Stores workflow in internal registry
- Validates step dependencies and order

#### 3. `execute(workflowId: string, inputData: any): Promise<ExecutionResult>`

Executes a registered workflow with the provided input data.

```typescript
const result = await orchestrator.execute("creative-analysis-workflow", {
  message: "An astronaut who finds a mysterious, glowing plant on Mars."
});
```

**Parameters:**
- `workflowId`: The ID of the registered workflow to execute
- `inputData`: Input data to pass to the first workflow step

**Returns:**
```typescript
interface ExecutionResult {
  variables: {
    [stepId: string]: any; // Output from each step
  };
  history: Array<{
    stepId: string;
    duration: number;
    success: boolean;
    error?: string;
  }>;
  totalDuration: number;
  success: boolean;
}
```

**Functionality:**
- Validates workflow exists
- Executes steps sequentially
- Passes output from one step to the next
- Tracks execution metrics
- Handles errors and rollback if needed

#### 4. `shutdown(): Promise<void>`

Gracefully shuts down the orchestrator and cleans up resources.

```typescript
await orchestrator.shutdown();
console.log("Orchestrator shut down.");
```

**Functionality:**
- Closes all active connections
- Cleans up resources
- Finalizes any pending operations
- Ensures graceful termination

## Agent Class and Registration

The `Agent` class represents an individual AI agent with specific capabilities.

### Constructor

```typescript
const agent = new Agent({
  id: string,                    // Unique identifier
  name: string,                  // Human-readable name
  model: {                       // AI model configuration
    provider: string,            // Model provider (e.g., "openrouter")
    model: string,               // Specific model name
    apiKey: string,              // API key for the provider
    fallbackModels?: string[]    // Alternative models if primary fails
  },
  systemPrompt: string,          // Instructions for the agent
  temperature?: number,          // Creativity level (0.0-1.0)
  maxTokens?: number,            // Maximum response length
  timeout?: number               // Request timeout in milliseconds
});
```

### Agent Configuration Examples

#### 1. Creative Writer Agent

```typescript
const creativeWriterAgent = new Agent({
  id: "creative-writer",
  name: "Creative Story Writer",
  model: {
    provider: "openrouter",
    model: "openai/gpt-4o",
    apiKey: process.env.OPENROUTER_API_KEY!,
    fallbackModels: ["mistralai/mistral-7b-instruct:free"],
  },
  systemPrompt: "You are a world-class short story author. Write a compelling and imaginative story based on the user's topic. The story should have a clear beginning, middle, and end.",
  temperature: 0.8,  // High creativity
  maxTokens: 2000,
  timeout: 30000
});
```

**Configuration Details:**
- **Primary Model**: `openai/gpt-4o` - High-quality creative writing
- **Fallback**: `mistralai/mistral-7b-instruct:free` - Free alternative
- **Temperature**: 0.8 - High creativity for imaginative content
- **System Prompt**: Defines the agent's role and behavior

#### 2. Summarizer Agent

```typescript
const summarizerAgent = new Agent({
  id: "summarizer",
  name: "Story Summarizer",
  model: {
    provider: "openrouter",
    model: "meta-llama/llama-3.1-8b-instruct",
    apiKey: process.env.OPENROUTER_API_KEY!,
    fallbackModels: ["mistralai/mistral-7b-instruct:free"],
  },
  systemPrompt: "You are a text summarization expert. Take the provided story and create a concise, one-paragraph summary.",
  temperature: 0.2,  // Low creativity, high accuracy
  maxTokens: 500,
  timeout: 15000
});
```

**Configuration Details:**
- **Primary Model**: `meta-llama/llama-3.1-8b-instruct` - Good for summarization
- **Temperature**: 0.2 - Low creativity for consistent, accurate summaries
- **Max Tokens**: 500 - Limits summary length

#### 3. Sentiment Analyzer Agent

```typescript
const sentimentAnalyzerAgent = new Agent({
  id: "sentiment-analyzer",
  name: "Sentiment Analyzer",
  model: {
    provider: "openrouter",
    model: "google/gemma-7b-it:free",
    apiKey: process.env.OPENROUTER_API_KEY!,
  },
  systemPrompt: "Analyze the sentiment of the provided story. Respond with only a single word: Positive, Negative, or Neutral.",
  temperature: 0.1,  // Very low creativity, maximum consistency
  maxTokens: 10,
  timeout: 10000
});
```

**Configuration Details:**
- **Primary Model**: `google/gemma-7b-it:free` - Free model for simple classification
- **Temperature**: 0.1 - Very low creativity for consistent results
- **Max Tokens**: 10 - Very short response (single word)
- **System Prompt**: Forces structured output format

### Agent Registration Process

```typescript
// Step 1: Create the orchestrator
const orchestrator = new AgentOrchestrator({ logLevel: "info" });

// Step 2: Create agents
const agents = [
  creativeWriterAgent,
  summarizerAgent,
  sentimentAnalyzerAgent
];

// Step 3: Register all agents
console.log("Registering agents...");
agents.forEach(agent => {
  orchestrator.registerAgent(agent);
});
console.log("Agents registered successfully.");
```

**Registration Flow:**
1. **Validation**: Checks agent configuration for required fields
2. **ID Uniqueness**: Ensures no duplicate agent IDs
3. **Model Validation**: Verifies model configuration
4. **Storage**: Adds agent to internal registry
5. **Availability**: Makes agent available for workflow steps

## Workflow Class and Management

The `Workflow` class defines the execution plan for coordinating multiple agents.

### Constructor

```typescript
const workflow = new Workflow({
  id: string,                    // Unique workflow identifier
  name: string,                  // Human-readable name
  description: string,           // Workflow description
  steps: Array<{                 // Sequential execution steps
    id: string,                  // Step identifier
    name: string,                // Human-readable step name
    type: "agent" | "condition" | "parallel", // Step type
    agentId?: string,            // Agent ID (for agent steps)
    condition?: string,          // Condition expression (for condition steps)
    parallelSteps?: Array<{      // Parallel execution steps
      id: string,
      agentId: string
    }>,
    params?: any,                // Additional parameters
    timeout?: number,            // Step timeout
    retries?: number             // Number of retry attempts
  }>
});
```

### Workflow Configuration Example

```typescript
const workflow = new Workflow({
  id: "creative-analysis-workflow",
  name: "Creative Writing and Analysis Workflow",
  description: "Generates a story, then summarizes it and analyzes its sentiment.",
  steps: [
    {
      id: "generate_story",
      name: "Generate Story",
      type: "agent",
      agentId: "creative-writer",
      timeout: 30000,
      retries: 2
    },
    {
      id: "summarize_story",
      name: "Summarize Story",
      type: "agent",
      agentId: "summarizer",
      timeout: 15000,
      retries: 1
    },
    {
      id: "analyze_sentiment",
      name: "Analyze Sentiment",
      type: "agent",
      agentId: "sentiment-analyzer",
      timeout: 10000,
      retries: 1
    }
  ]
});
```

### Workflow Step Types

#### 1. Agent Steps

Execute a single agent with the output from the previous step.

```typescript
{
  id: "step-id",
  name: "Step Name",
  type: "agent",
  agentId: "agent-id",
  timeout: 30000,
  retries: 2
}
```

**Functionality:**
- Calls the specified agent
- Passes previous step output as input
- Handles timeouts and retries
- Returns agent response

#### 2. Condition Steps

Execute different paths based on conditions.

```typescript
{
  id: "conditional-step",
  name: "Conditional Processing",
  type: "condition",
  condition: "variables.previous_step.length > 100",
  trueSteps: [
    { id: "long-content-step", agentId: "long-content-agent" }
  ],
  falseSteps: [
    { id: "short-content-step", agentId: "short-content-agent" }
  ]
}
```

#### 3. Parallel Steps

Execute multiple agents simultaneously.

```typescript
{
  id: "parallel-analysis",
  name: "Parallel Analysis",
  type: "parallel",
  parallelSteps: [
    { id: "sentiment-analysis", agentId: "sentiment-analyzer" },
    { id: "topic-analysis", agentId: "topic-analyzer" },
    { id: "language-analysis", agentId: "language-analyzer" }
  ]
}
```

### Workflow Registration

```typescript
// Register the workflow
orchestrator.registerWorkflow(workflow);
console.log("Workflow registered successfully.");
```

**Registration Process:**
1. **Validation**: Checks workflow configuration
2. **Agent Verification**: Ensures all referenced agents exist
3. **Step Validation**: Validates step dependencies and order
4. **Storage**: Adds workflow to internal registry
5. **Availability**: Makes workflow available for execution

## Execution Process

The execution process coordinates the sequential or parallel execution of workflow steps.

### Execution Flow

```typescript
// 1. Start execution
const startTime = Date.now();
const result = await orchestrator.execute("creative-analysis-workflow", {
  message: "An astronaut who finds a mysterious, glowing plant on Mars."
});

// 2. Process results
console.log("Generated Story:", result.variables.generate_story);
console.log("Summary:", result.variables.summarize_story);
console.log("Sentiment:", result.variables.analyze_sentiment);

// 3. Display metrics
const totalTime = Date.now() - startTime;
console.log("Total time:", totalTime, "ms");
console.log("Steps executed:", result.history.length);
```

### Step-by-Step Execution

#### Step 1: Generate Story

```typescript
// Input: { message: "An astronaut who finds a mysterious, glowing plant on Mars." }
// Agent: creative-writer
// Process:
// 1. Validate input data
// 2. Call OpenAI GPT-4o via OpenRouter
// 3. Process response
// 4. Store in result.variables.generate_story

const storyResult = await creativeWriterAgent.execute({
  message: "An astronaut who finds a mysterious, glowing plant on Mars."
});
// Output: Full story text
```

#### Step 2: Summarize Story

```typescript
// Input: Previous step output (story text)
// Agent: summarizer
// Process:
// 1. Take story from previous step
// 2. Call Llama 3.1 via OpenRouter
// 3. Generate concise summary
// 4. Store in result.variables.summarize_story

const summaryResult = await summarizerAgent.execute(storyResult);
// Output: One-paragraph summary
```

#### Step 3: Analyze Sentiment

```typescript
// Input: Previous step output (summary text)
// Agent: sentiment-analyzer
// Process:
// 1. Take summary from previous step
// 2. Call Gemma 7B via OpenRouter
// 3. Classify sentiment
// 4. Store in result.variables.analyze_sentiment

const sentimentResult = await sentimentAnalyzerAgent.execute(summaryResult);
// Output: "Positive", "Negative", or "Neutral"
```

### Execution Result Structure

```typescript
interface ExecutionResult {
  variables: {
    generate_story: string;      // Full story text
    summarize_story: string;     // Story summary
    analyze_sentiment: string;   // Sentiment classification
  };
  history: Array<{
    stepId: string;              // Step identifier
    duration: number;            // Execution time in ms
    success: boolean;            // Success status
    error?: string;              // Error message if failed
    tokensUsed?: number;         // AI model tokens consumed
    modelUsed?: string;          // Actual model used (including fallbacks)
  }>;
  totalDuration: number;         // Total execution time
  success: boolean;              // Overall success status
  metadata: {
    workflowId: string;          // Executed workflow ID
    startTime: Date;             // Execution start time
    endTime: Date;               // Execution end time
    environment: string;         // Runtime environment
  };
}
```

## Configuration and Setup

### Environment Configuration

```typescript
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Access API keys
const apiKey = process.env.OPENROUTER_API_KEY!;
```

### .env File Setup

```env
# OpenRouter API Key (get from https://openrouter.ai/)
OPENROUTER_API_KEY=your-api-key-here

# Optional: Custom model configurations
DEFAULT_MODEL_PROVIDER=openrouter
DEFAULT_TEMPERATURE=0.7
DEFAULT_MAX_TOKENS=1000
DEFAULT_TIMEOUT=30000
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Package Dependencies

```json
{
  "dependencies": {
    "ai-agent-sdk-orchestrator": "^1.1.3",
    "chalk": "^4.1.2",
    "dotenv": "^17.2.2"
  },
  "devDependencies": {
    "@types/node": "^24.3.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.2"
  }
}
```

## Error Handling and Logging

### Error Types and Handling

#### 1. Agent Registration Errors

```typescript
try {
  orchestrator.registerAgent(agent);
} catch (error) {
  if (error.message.includes("Agent ID already exists")) {
    console.error("Agent with this ID is already registered");
  } else if (error.message.includes("Invalid agent configuration")) {
    console.error("Agent configuration is invalid:", error.details);
  }
}
```

#### 2. Workflow Execution Errors

```typescript
try {
  const result = await orchestrator.execute("workflow-id", inputData);
} catch (error) {
  if (error.message.includes("Workflow not found")) {
    console.error("Workflow not registered");
  } else if (error.message.includes("Agent not found")) {
    console.error("Referenced agent not registered");
  } else if (error.message.includes("API key invalid")) {
    console.error("Invalid API key for model provider");
  } else if (error.message.includes("Model rate limit")) {
    console.error("Model rate limit exceeded, retrying with fallback");
  }
}
```

#### 3. Model Fallback Handling

```typescript
// Automatic fallback to alternative models
const agent = new Agent({
  model: {
    provider: "openrouter",
    model: "openai/gpt-4o",           // Primary model
    fallbackModels: [                 // Fallback models
      "mistralai/mistral-7b-instruct:free",
      "google/gemma-7b-it:free"
    ],
    apiKey: process.env.OPENROUTER_API_KEY!
  }
});

// If primary model fails, automatically tries fallbacks
// Error handling is built into the SDK
```

### Logging Configuration

```typescript
// Different log levels
const orchestrator = new AgentOrchestrator({ 
  logLevel: "debug"  // "debug" | "info" | "warn" | "error"
});

// Debug logging shows:
// - Agent registration details
// - Workflow step execution
// - Model API calls
// - Token usage
// - Performance metrics

// Info logging shows:
// - Workflow start/end
// - Step completion
// - Basic metrics

// Warn logging shows:
// - Fallback model usage
// - Performance warnings
// - Non-critical errors

// Error logging shows:
// - Critical errors only
// - Execution failures
```

## Code Examples and Usage Patterns

### Complete Working Example

```typescript
import { config } from "dotenv";
import { AgentOrchestrator, Agent, Workflow } from "ai-agent-sdk-orchestrator";
import chalk from "chalk";

// Load environment variables
config();

async function main() {
  console.log(chalk.cyan("🚀 Initializing AI Workflow Orchestrator"));
  
  // 1. Create orchestrator
  const orchestrator = new AgentOrchestrator({ logLevel: "info" });
  
  // 2. Create agents
  const creativeWriterAgent = new Agent({
    id: "creative-writer",
    name: "Creative Story Writer",
    model: {
      provider: "openrouter",
      model: "openai/gpt-4o",
      apiKey: process.env.OPENROUTER_API_KEY!,
      fallbackModels: ["mistralai/mistral-7b-instruct:free"],
    },
    systemPrompt: "You are a world-class short story author...",
    temperature: 0.8,
  });
  
  const summarizerAgent = new Agent({
    id: "summarizer",
    name: "Story Summarizer",
    model: {
      provider: "openrouter",
      model: "meta-llama/llama-3.1-8b-instruct",
      apiKey: process.env.OPENROUTER_API_KEY!,
      fallbackModels: ["mistralai/mistral-7b-instruct:free"],
    },
    systemPrompt: "You are a text summarization expert...",
    temperature: 0.2,
  });
  
  const sentimentAnalyzerAgent = new Agent({
    id: "sentiment-analyzer",
    name: "Sentiment Analyzer",
    model: {
      provider: "openrouter",
      model: "google/gemma-7b-it:free",
      apiKey: process.env.OPENROUTER_API_KEY!,
    },
    systemPrompt: "Analyze the sentiment...",
    temperature: 0.1,
  });
  
  // 3. Register agents
  console.log("Registering agents...");
  orchestrator.registerAgent(creativeWriterAgent);
  orchestrator.registerAgent(summarizerAgent);
  orchestrator.registerAgent(sentimentAnalyzerAgent);
  console.log("Agents registered successfully.");
  
  // 4. Create workflow
  const workflow = new Workflow({
    id: "creative-analysis-workflow",
    name: "Creative Writing and Analysis Workflow",
    description: "Generates a story, then summarizes it and analyzes its sentiment.",
    steps: [
      {
        id: "generate_story",
        name: "Generate Story",
        type: "agent",
        agentId: "creative-writer",
      },
      {
        id: "summarize_story",
        name: "Summarize Story",
        type: "agent",
        agentId: "summarizer",
      },
      {
        id: "analyze_sentiment",
        name: "Analyze Sentiment",
        type: "agent",
        agentId: "sentiment-analyzer",
      },
    ],
  });
  
  // 5. Register workflow
  orchestrator.registerWorkflow(workflow);
  console.log("Workflow registered successfully.");
  
  // 6. Execute workflow
  const topic = "An astronaut who finds a mysterious, glowing plant on Mars.";
  
  console.log(chalk.blue(`\nProcessing topic through the creative pipeline...`));
  console.log(chalk.bold("Initial Topic:"), topic);
  
  const startTime = Date.now();
  try {
    const result = await orchestrator.execute("creative-analysis-workflow", {
      message: topic,
    });
    const totalTime = Date.now() - startTime;
    
    // 7. Display results
    console.log("\n" + chalk.green("📊 Final Results:"));
    console.log(chalk.gray("─".repeat(60)));
    
    console.log("\n" + chalk.yellow("📖 Generated Story:"));
    console.log(result.variables.generate_story);
    
    console.log("\n" + chalk.yellow("📝 Summary of Story:"));
    console.log(result.variables.summarize_story);
    
    console.log("\n" + chalk.yellow("🎭 Sentiment of Summary:"));
    console.log(result.variables.analyze_sentiment);
    
    console.log("\n" + chalk.green("📈 Execution Metrics:"));
    console.log(chalk.gray("─".repeat(30)));
    console.log(chalk.bold("Total time:"), totalTime, "ms");
    console.log(chalk.bold("Steps executed:"), result.history.length);
    
    result.history.forEach((step, i) => {
      console.log(`${i + 1}. ${step.stepId}: ${step.duration}ms`);
    });
    
  } catch (error) {
    console.error("\n" + chalk.red("An error occurred during workflow execution:"), error);
  } finally {
    await orchestrator.shutdown();
    console.log(chalk.cyan("\nOrchestrator shut down."));
  }
}

// Run the main function
main().catch(console.error);
```

### Advanced Usage Patterns

#### 1. Custom Error Handling

```typescript
async function executeWithRetry(workflowId: string, inputData: any, maxRetries: number = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await orchestrator.execute(workflowId, inputData);
      return result;
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Workflow execution failed after ${maxRetries} attempts`);
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

#### 2. Dynamic Agent Creation

```typescript
function createAgent(config: {
  id: string;
  name: string;
  modelName: string;
  systemPrompt: string;
  temperature?: number;
}) {
  return new Agent({
    id: config.id,
    name: config.name,
    model: {
      provider: "openrouter",
      model: config.modelName,
      apiKey: process.env.OPENROUTER_API_KEY!,
      fallbackModels: ["mistralai/mistral-7b-instruct:free"],
    },
    systemPrompt: config.systemPrompt,
    temperature: config.temperature || 0.7,
  });
}

// Usage
const agents = [
  createAgent({
    id: "writer",
    name: "Writer",
    modelName: "openai/gpt-4o",
    systemPrompt: "You are a creative writer...",
    temperature: 0.8
  }),
  createAgent({
    id: "editor",
    name: "Editor",
    modelName: "meta-llama/llama-3.1-8b-instruct",
    systemPrompt: "You are an editor...",
    temperature: 0.3
  })
];
```

#### 3. Workflow Composition

```typescript
function createWorkflow(workflowConfig: {
  id: string;
  name: string;
  description: string;
  agentIds: string[];
}) {
  const steps = workflowConfig.agentIds.map((agentId, index) => ({
    id: `step_${index + 1}`,
    name: `Step ${index + 1}`,
    type: "agent" as const,
    agentId: agentId,
  }));
  
  return new Workflow({
    id: workflowConfig.id,
    name: workflowConfig.name,
    description: workflowConfig.description,
    steps: steps,
  });
}

// Usage
const workflow = createWorkflow({
  id: "custom-workflow",
  name: "Custom Workflow",
  description: "A custom workflow",
  agentIds: ["writer", "editor", "reviewer"]
});
```

This comprehensive documentation covers every aspect of the AI Workflow Orchestrator package, from basic usage to advanced patterns. Each function, class, and process is explained with detailed code examples and practical usage scenarios.

### Modifying Workflow Steps

```typescript
const workflow = new Workflow({
  id: "workflow-id",
  name: "Workflow Name",
  description: "Workflow description",
  steps: [
    {
      id: "step-id",
      name: "Step Name",
      type: "agent",
      agentId: "agent-id",
    },
    // Add more steps...
  ],
});
```

## 📊 Performance Metrics

The orchestrator provides detailed execution metrics:

- **Total Execution Time**: End-to-end workflow duration
- **Per-Step Duration**: Individual agent execution times
- **Token Usage**: AI model token consumption (redacted in logs)
- **Success/Failure Rates**: Agent execution success tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Related Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [AI Agent SDK Orchestrator](https://www.npmjs.com/package/ai-agent-sdk-orchestrator)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**Happy Orchestrating! 🎭🤖**
