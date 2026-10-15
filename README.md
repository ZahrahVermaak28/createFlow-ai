# 🚀 CreateFlow AI

**An AI-Powered Content Generation Platform**

CreateFlow AI is a full-stack web application that allows users to generate text, images, and code using Artificial Intelligence.

The platform was designed to make content creation easier by combining multiple AI-powered tools into one simple and interactive application. Users can describe what they want to create, customise their preferences, and receive AI-generated results.

This project was developed as part of my journey in exploring Generative AI, prompt engineering, and full-stack web development.

## 🖥️ Application Preview

![CreateFlow AI Homepage](Creat%20Flow%20AI%20homepage.png)

## ✨ Key Features

### 📝 AI Text Generator
- Generate written content from user prompts.
- Choose different writing tones.
- Adjust the length of generated content (Short, Medium, or Long).
- Generate content for various writing and creative tasks.

### 🎨 AI Image Generator
- Generate images using text descriptions.
- Choose different image styles.
- Use Google Gemini for AI image generation.
- Includes fallback options when the primary image service is unavailable.

### 💻 AI Code Generator
- Generate code snippets based on user instructions.
- Specify a programming language or framework.
- Receive structured code with explanatory comments.
- Support simple programming and development tasks.

### 🖥️ User Interface
- Responsive interface built using React and Tailwind CSS.
- Separate tabs for the three content generators.
- Interactive icons and animations.
- Recent Generations interface.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend user interface |
| TypeScript | Application development |
| Tailwind CSS 4 | Styling and responsive design |
| Vite | Frontend development and build tool |
| Node.js | Backend runtime |
| Express.js | Backend server and API endpoints |
| Google Gemini API | AI-powered content generation |
| Lucide React | Interface icons |
| Motion | UI animations |
| Git & GitHub | Version control |

## 📁 Project Structure

```text
CreateFlow-AI/
├── src/
│   ├── components/
│   │   ├── CodeGenerator.tsx
│   │   ├── Header.tsx
│   │   ├── ImageGenerator.tsx
│   │   ├── RecentGenerations.tsx
│   │   ├── SocialIcons.tsx
│   │   ├── TabNav.tsx
│   │   └── TextGenerator.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

Follow the steps below to run CreateFlow AI on your local computer.

### Prerequisites

Before getting started, ensure you have:

- Node.js and npm installed (use a version compatible with Vite 8).
- Git installed.
- A code editor such as Visual Studio Code.
- A Google Gemini API key with access to the required models.

You can obtain an API key from [Google AI Studio](https://aistudio.google.com/).

### Step 1: Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/ZahrahVermaak28/CreateFlow-AI.git
```

Replace the repository URL if your actual GitHub repository has a different name.

### Step 2: Open the Project Directory

```bash
cd CreateFlow-AI
```

### Step 3: Install Dependencies

Install the required packages:

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a file named `.env` in the project's root directory.

You can copy the contents of `.env.example` and replace the placeholder values:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
APP_URL=http://localhost:3000
```

**Important:**
- Replace `your_actual_gemini_api_key` with your own API key.
- Never commit your `.env` file or private API keys to GitHub.
- Ensure `.env` is included in `.gitignore`.
- `APP_URL` is provided for compatibility with the AI Studio configuration; the supplied server code does not currently use it directly.

### Step 5: Run the Application

Start the development server:

```bash
npm run dev
```

The Express server runs the backend and integrates Vite for frontend development.

Open your browser and visit:

**http://localhost:3000**

The application should now be accessible locally.

### Step 6: Stop the Server

Press `Ctrl + C` in your terminal.

## ⚙️ Available Commands

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the frontend production build |
| `npm run lint` | Run TypeScript checks |
| `npm start` | Start the Express server |

**Note:** `npm run preview` previews the Vite frontend build and does not replace the Express API server.

## 🔌 Backend API Endpoints

CreateFlow AI uses an Express backend to handle content generation requests.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/generate-text` | Generate written content |
| POST | `/api/generate-code` | Generate code snippets |
| POST | `/api/generate-image` | Generate images or fallback visuals |

The backend communicates with the Google Gemini API to process requests and return generated content to the frontend.

## 🧠 How CreateFlow AI Works

1. The user selects a generator: Text, Image, or Code.
2. The user enters a prompt and chooses available preferences.
3. The React frontend sends a request to the Express backend.
4. The backend processes the request using the appropriate generation logic.
5. The AI service returns generated content.
6. The backend sends the result to the frontend, where it is displayed to the user.

For image generation, the application attempts Gemini first, followed by an external image service. If neither produces an image, it returns a styled SVG graphic as a fallback.

## 📸 Application Screenshots

Screenshots can be added to demonstrate the application interface.

### Main Interface

*Screenshot coming soon.*

### Text Generator

*Screenshot coming soon.*

### Image Generator

*Screenshot coming soon.*

### Code Generator

*Screenshot coming soon.*

## ⚠️ Known Limitations

- AI generation requires a valid Gemini API key and access to supported models.
- API usage limits or unavailable models may affect generation.
- Image generation depends on external services.
- The final SVG fallback is a designed graphic rather than a fully AI-generated image.
- Generated code should be reviewed and tested before use.

## 🎯 Project Objectives

The main goals of this project were to:

- Explore Generative AI and its real-world applications.
- Understand how frontend and backend technologies communicate.
- Gain experience integrating AI APIs into web applications.
- Improve my React and TypeScript development skills.
- Practise prompt engineering.
- Develop a functional and user-friendly application.

## 🔮 Future Improvements

Planned improvements include:

- User authentication and personal accounts.
- Saving and managing generated content.
- More advanced content customisation.
- Improved AI error handling.
- Additional image generation options.
- Enhanced generation history.
- More export and sharing options.

## 👩‍💻 Developer

**Zahrah Vermaak**

Application Development Student | Digital Associate | Aspiring Software Developer

**GitHub:** [ZahrahVermaak28](https://github.com/ZahrahVermaak28)

## 📌 About This Project

CreateFlow AI is a practical project demonstrating how Generative AI can be integrated into a full-stack web application.

Through this project, I gained experience working with React, TypeScript, Express.js, REST API endpoints, and AI integration while exploring how modern technologies can simplify content creation.
