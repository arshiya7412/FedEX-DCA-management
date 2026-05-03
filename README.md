# FedEx DCA Connect

FedEx DCA Connect is an enterprise portal designed for managing Debt Collection Agencies (DCAs), assigning debt portfolios, and monitoring compliance and recovery performance. It leverages AI for risk analysis, agency recommendations, case prioritization, and placement strategy generation.

## Features

- **Dashboard:** Overview of cases, SLAs, and performance metrics.
- **Agency Management:** View and evaluate DCA compliance scores and recovery rates.
- **AI-Powered Insights:** Uses the Gemini AI model to analyze agency risk, recommend the best agency for cases, prioritize cases, and generate batch strategies.
- **Role-Based Access Control (RBAC):** Distinct views and functionalities for FedEx Admins and DCA Managers.
- **Case Management & Status Hub:** Track and manage assigned cases and their statuses.
- **Reports & SLA Configuration:** Generate insights and configure Service Level Agreements.

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Backend (Local/Dev):** Express Server (`server.ts`)
- **Backend (Production):** Netlify Functions (`netlify/functions/`)
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Deployment:** Configured for Netlify (`netlify.toml`)

## Prerequisites

- Node.js (v20+)
- npm or yarn
- Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/))

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Building for Production

To build the application for production:

```bash
npm run build
```
This will compile the frontend to the `dist` directory.

## Deployment on Netlify

This project is configured strings for deployment on Netlify, including serverless functions for the AI API.

1. Keep the `netlify.toml` file in the root directory.
2. In your Netlify dashboard, configure the build command to `npm run build` and publish directory to `dist`.
3. Set your `GEMINI_API_KEY` in the Netlify site environment variables.
4. The Netlify function located perfectly at `/netlify/functions/gemini.ts` will automatically serve requests to `/api/gemini`.
5. Open [https://fedexdca.netlify.app/](https://fedexdca.netlify.app/) to view project

## Project Structure

- `/src`: Contains the React frontend code components, services, and types.
- `/services/geminiService.ts`: Helper functions to communicate with the AI API.
- `/server.ts`: The Express server used locally for development to serve Vite and proxy API requests.
- `/netlify/functions/`: Serverless functions for Netlify deployment.
- `netlify.toml`: Configuration rules for Netlify build and API redirects.
- `vite.config.ts`: Vite bundling configurations.

## License

MIT
