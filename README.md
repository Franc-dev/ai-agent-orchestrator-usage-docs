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
