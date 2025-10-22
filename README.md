# Debate Corner

An AI debate application where two AI agents with distinct personalities argue opposing sides of user-provided topics, evaluated by three AI judges.

## Features

- **AI vs AI Debates**: Watch two language models debate each other on any topic
- **Dynamic Personalities**: 8 distinct debate personalities randomly assigned to debaters:
  - **Honest** - Intellectually honest, good faith arguments with steelmanning
  - **Academic** - Dense scholarly discourse with citations and theoretical frameworks
  - **Manipulative** - Uses rhetorical tricks, fallacies, and persuasion tactics
  - **Strawman Artist** - Misrepresents and distorts opponent's arguments
  - **Emotional** - Appeals to emotions with vivid storytelling and moral framing
  - **Pedantic** - Obsessively nitpicks definitions and semantics
  - **Zealot** - Fanatical conviction, refuses to concede any point
  - **Ignorant** - Confidently wrong with fundamental misunderstandings
- **Structured Format**: Opening statements → 2 rounds of rebuttals → Judge evaluation
- **Streaming Responses**: Real-time LLM response streaming with proper formatting
- **Customizable Settings**:
  - Select different models for each debater and judge
  - Control response length (short/medium/long)
- **Three-Judge System**: AI judges independently evaluate arguments and determine the winner
- **Two-Column Layout**: Side-by-side debate view with auto-scrolling

## Tech Stack

- **Framework**: SvelteKit 5 (using Svelte 5 runes)
- **Styling**: Tailwind CSS 4
- **LLM Provider**: [Featherless AI](https://featherless.ai/)
- **Language**: TypeScript

## Setup

1. Clone the repository and install dependencies:

```sh
npm install
```

2. Create a `.env` file in the root directory and add your Featherless API key:

```env
FEATHERLESS_API_KEY=your_api_key_here
```

3. Start the development server:

```sh
npm run dev
```

4. Open http://localhost:5173 in your browser

## Usage

1. **Configure Settings** (optional):
   - Click "Settings" in the navigation
   - Select models for each debater and judge from available Featherless models
   - Choose response length (short: 75-150 words, medium: 150-250 words, long: 250-400 words)
   - Settings persist in localStorage

2. **View Personalities** (optional):
   - Click "Personalities" to see all 8 debate personalities and their behavioral prompts
   - Personalities are randomly assigned to debaters at the start of each debate

3. **Start a Debate**:
   - Enter a debate topic on the home page
   - Click "Start Debate"
   - Two random personalities will be assigned
   - AI 1 argues FOR, AI 2 argues AGAINST

4. **Watch the Debate**:
   - Opening statements from both sides
   - Click "Next" to progress through each turn
   - Two rounds of rebuttals where AIs respond to each other
   - Responses stream in real-time

5. **See the Verdict**:
   - Three AI judges independently evaluate the debate
   - Each judge provides their reasoning and declares a winner
   - Final tally determines the debate winner

## Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   │   ├── DebateSetup.svelte
│   │   ├── DebateStage.svelte
│   │   ├── DebateTurn.svelte
│   │   ├── JudgeResults.svelte
│   │   └── ModelSelector.svelte
│   ├── personalities/       # JSON personality definitions
│   │   ├── honest.json
│   │   ├── academic.json
│   │   ├── manipulative.json
│   │   ├── strawman.json
│   │   ├── emotional.json
│   │   ├── pedantic.json
│   │   ├── zealot.json
│   │   └── ignorant.json
│   ├── server/
│   │   └── featherless.ts   # Featherless API wrapper
│   ├── stores/
│   │   └── models.ts        # Available models store
│   └── types/
│       └── index.ts         # TypeScript type definitions
├── routes/
│   ├── api/
│   │   ├── debate/
│   │   │   └── stream/      # Streaming debate endpoint
│   │   ├── judge/           # Judge evaluation endpoint
│   │   └── models/          # Available models endpoint
│   ├── personalities/       # Personalities view page
│   ├── settings/            # Settings configuration page
│   └── +page.svelte         # Main debate page
└── app.css                  # Global styles
```

## How It Works

1. **Debate Flow**: The debate progresses through predefined turns (AI 1 opening → AI 2 opening → AI 1 round 1 → AI 2 round 1 → AI 1 round 2 → AI 2 round 2)

2. **Personality Assignment**: Each debate randomly assigns personalities from `/src/lib/personalities/*.json` files, ensuring varied and entertaining debate styles

3. **Streaming**: Responses use Server-Sent Events (SSE) to stream LLM output chunk-by-chunk, preserving formatting with JSON serialization

4. **Sequential Judges**: Due to Featherless API concurrency limits, judges evaluate sequentially rather than in parallel

5. **Prompt Engineering**:
   - Opening statements prevent premature opponent references
   - Rebuttals encourage engagement with actual arguments made
   - Strict word count enforcement based on response length setting
   - Rich personality prompts guide debate behavior

## Building for Production

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

> To deploy, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Contributing

To add new personalities:

1. Create a new JSON file in `/src/lib/personalities/`
2. Follow the structure:
```json
{
  "name": "Personality Name",
  "description": "Brief description",
  "systemPromptAddition": "Detailed behavioral instructions..."
}
```
3. The personality will be automatically discovered and available in debates

## License

MIT
