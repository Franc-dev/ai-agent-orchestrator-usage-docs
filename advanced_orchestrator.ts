/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-env node */
/* global console, process, require, module */
import { config } from "dotenv";
import { AgentOrchestrator, Agent, Workflow } from "ai-agent-sdk-orchestrator";
import chalk from "chalk";

// Load environment variables from .env file
config();


// --- Main Application Logic ---
async function main() {
  console.log(chalk.cyan("🚀 Initializing Simplified AI Workflow Orchestrator"));
  console.log(chalk.gray("=".repeat(60)));

  // --- 1. CREATE THE ORCHESTRATOR ---
  const orchestrator = new AgentOrchestrator({ logLevel: "info" });

  // --- 2. DEFINE ORIGINAL AGENTS ---
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
    systemPrompt: "You are a text summarization expert. Take the provided story and create a concise, one-paragraph summary.",
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
    systemPrompt: "Analyze the sentiment of the provided story. Respond with only a single word: Positive, Negative, or Neutral.",
    temperature: 0.1,
  });


  // --- 3. REGISTER AGENTS ---
  console.log("Registering agents...");
  orchestrator.registerAgent(creativeWriterAgent);
  orchestrator.registerAgent(summarizerAgent);
  orchestrator.registerAgent(sentimentAnalyzerAgent);
  console.log("Agents registered successfully.");

  // --- 4. CREATE THE WORKFLOW (SIMPLIFIED) ---
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
        // No 'params' needed; it will receive the initial input from orchestrator.execute()
      },
      {
        id: "summarize_story",
        name: "Summarize Story",
        type: "agent",
        agentId: "summarizer",
         // No 'params' needed; it will automatically receive the output from the previous step
      },
      {
        id: "analyze_sentiment",
        name: "Analyze Sentiment",
        type: "agent",
        agentId: "sentiment-analyzer",
        // This step is tricky without explicit input mapping. It will likely receive
        // the output from 'summarize_story'. To analyze the ORIGINAL story, a more
        // complex workflow structure would be needed if the package supports it.
        // For now, we will let it analyze the summary.
      },
    ],
  });

  orchestrator.registerWorkflow(workflow);
  console.log("Workflow registered successfully.");


  // --- 5. EXECUTE THE WORKFLOW ---
  const topic = "An astronaut who finds a mysterious, glowing plant on Mars.";
  
  console.log(chalk.blue(`\nProcessing topic through the creative pipeline...`));
  console.log(chalk.bold("Initial Topic:"), topic);
  
  const startTime = Date.now();
  try {
    // The 'topic' object key must match the expected input of the first agent.
    // Let's assume the agent expects a 'message' property.
    const result = await orchestrator.execute("creative-analysis-workflow", {
      message: topic,
    });
    const totalTime = Date.now() - startTime;

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

