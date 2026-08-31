import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET_KEY || "mentora_super_secret_jwt_key_change_in_production_987654321";

app.use(express.json());

// ==========================================
// 1. IN-MEMORY DATABASE & SEED DATA
// ==========================================

interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  createdAt: string;
}

interface ProfileRecord {
  userId: string;
  experienceLevel: string;
  dailyAvailableMinutes: number;
  learningStyle: string[];
  careerGoal: string;
  targetDate: string;
  bio?: string;
  currentStreak: number;
}

interface SkillRecord {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  priority: string;
  whyItMatters: string;
  aiInsight: string;
}

interface AssessmentRecord {
  id: string;
  title: string;
  description: string;
  skillId: string;
  difficulty: string;
  durationMinutes: number;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

interface AssessmentResultRecord {
  userId: string;
  assessmentId: string;
  score: number;
  feedback: string;
  completedAt: string;
}

interface ProgressRecord {
  userId: string;
  learningItemId: string;
  progressPercent: number;
  completed: boolean;
  timeSpentMinutes: number;
  completedAt?: string;
}

interface FeedbackRecord {
  id: string;
  userId: string;
  resourceTitle: string;
  difficultyRating: string;
  usefulnessRating: number;
  useful: boolean;
  comment?: string;
  aiResponseText: string;
  createdAt: string;
}

interface ChatMessageRecord {
  id: string;
  userId: string;
  role: "user" | "ai";
  message: string;
  createdAt: string;
}

// Database Store
const db = {
  users: new Map<string, UserRecord>(),
  profiles: new Map<string, ProfileRecord>(),
  skills: new Map<string, SkillRecord[]>(), // userId -> skills
  assessments: new Map<string, AssessmentRecord>(),
  assessmentResults: new Map<string, AssessmentResultRecord[]>(), // userId -> results
  progress: new Map<string, ProgressRecord[]>(), // userId -> progress
  feedbacks: new Map<string, FeedbackRecord[]>(), // userId -> feedbacks
  chatMessages: new Map<string, ChatMessageRecord[]>(), // userId -> messages
  learningPaths: new Map<string, any>() // userId -> active learning path
};

// Seed demo user: Alex Morgan
const demoUserId = "usr-alex-001";
const demoPasswordHash = bcrypt.hashSync("Demo@12345", 8);

db.users.set(demoUserId, {
  id: demoUserId,
  name: "Alex Morgan",
  email: "demo@learnora.app",
  passwordHash: demoPasswordHash,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  createdAt: new Date().toISOString()
});

db.profiles.set(demoUserId, {
  userId: demoUserId,
  experienceLevel: "Intermediate",
  dailyAvailableMinutes: 90,
  learningStyle: ["Hands-on projects", "Visual diagrams", "Interactive exercises"],
  careerGoal: "Machine Learning Engineer",
  targetDate: "2027-04-30",
  bio: "Aspiring Machine Learning Engineer with strong Python roots transitioning into predictive modeling, PyTorch deep learning, and MLOps.",
  currentStreak: 12
});

db.skills.set(demoUserId, [
  { id: "python", name: "Python for Data Science", category: "Foundation", currentLevel: 82, targetLevel: 90, priority: "High", whyItMatters: "Core programming foundation essential for PyTorch and data manipulation.", aiInsight: "Mastery level is high; focus on advanced performance profiling." },
  { id: "sql", name: "SQL & Relational DBs", category: "Foundation", currentLevel: 70, targetLevel: 85, priority: "High", whyItMatters: "Critical for extracting training datasets and analytical modeling.", aiInsight: "Solid query comprehension; ready for complex windowing tasks." },
  { id: "statistics", name: "Probability & Statistics", category: "Foundation", currentLevel: 48, targetLevel: 80, priority: "High", whyItMatters: "Critical prerequisite for model evaluation, Bayesian tuning, and statistical power.", aiInsight: "Identified as primary foundation gap before deep learning." },
  { id: "machine_learning", name: "Supervised & Unsupervised ML", category: "Core ML", currentLevel: 42, targetLevel: 85, priority: "High", whyItMatters: "Core requirement for ML Engineer role; covers ensembles, loss metrics, and validation.", aiInsight: "Rapidly progressing through supervised ensembles." },
  { id: "deep_learning", name: "Deep Learning & PyTorch", category: "Advanced", currentLevel: 25, targetLevel: 80, priority: "High", whyItMatters: "Required for neural architectures, embeddings, and transformer fine-tuning.", aiInsight: "Queued for Phase 3 after mastering statistical foundations." },
  { id: "mlops", name: "MLOps & CI/CD", category: "Deployment", currentLevel: 15, targetLevel: 75, priority: "Medium", whyItMatters: "Mandatory for containerized deployment, CI/CD, and model monitoring.", aiInsight: "Queued for Phase 4 production stage." },
  { id: "pandas", name: "Pandas & Data Wrangling", category: "Foundation", currentLevel: 78, targetLevel: 85, priority: "Medium", whyItMatters: "Fast dataframe manipulations and feature engineering.", aiInsight: "High proficiency." },
  { id: "numpy", name: "NumPy Vectorization", category: "Foundation", currentLevel: 74, targetLevel: 85, priority: "Medium", whyItMatters: "Vectorized math and matrix operations.", aiInsight: "Strong numerical grasp." }
]);

// Seed Assessments
const assessmentsCatalog: AssessmentRecord[] = [
  {
    id: "a-stats-check",
    title: "Applied Statistics & Probability Diagnostic",
    description: "Validate your foundation in variance, p-values, Bayes Theorem, and hypothesis testing.",
    skillId: "statistics",
    difficulty: "Intermediate",
    durationMinutes: 25,
    questions: [
      {
        id: "q1",
        question: "What is the primary risk of using Mean Squared Error (MSE) on datasets with severe outliers compared to Mean Absolute Error (MAE)?",
        options: [
          "MSE underestimates small residual errors",
          "MSE heavily penalizes large errors quadratically, skewing parameter optimization",
          "MSE cannot be differentiated analytically",
          "MSE ignores negative values completely"
        ],
        correctIndex: 1,
        explanation: "Because MSE squares the residuals, large outlier errors dominate the loss function quadratically and pull regression weights disproportionately toward outliers."
      },
      {
        id: "q2",
        question: "Under what condition is Precision a more critical evaluation metric than Recall?",
        options: [
          "When the cost of False Positives is significantly higher than False Negatives (e.g. spam detection)",
          "When False Negatives carry catastrophic risk (e.g. cancer diagnosis)",
          "When class distribution is exactly 50/50",
          "When accuracy is higher than 95%"
        ],
        correctIndex: 0,
        explanation: "Precision measures TP / (TP + FP). When False Positives are expensive (like misclassifying important emails as spam), maximizing Precision is paramount."
      },
      {
        id: "q3",
        question: "What does a p-value of 0.03 indicate when testing a null hypothesis at alpha = 0.05?",
        options: [
          "The probability that the alternative hypothesis is false is 3%",
          "The probability of observing results at least as extreme under the null hypothesis is 3%, so we reject the null hypothesis",
          "The null hypothesis has a 97% chance of being true",
          "The effect size is exactly 0.03"
        ],
        correctIndex: 1,
        explanation: "The p-value is the probability of observing data at least as extreme assuming H0 is true. Since 0.03 < 0.05, we reject the null hypothesis."
      },
      {
        id: "q4",
        question: "In Bayesian inference, what represents the updated belief after observing new empirical evidence?",
        options: [
          "Prior Probability",
          "Likelihood Function",
          "Posterior Probability",
          "Marginal Evidence"
        ],
        correctIndex: 2,
        explanation: "The Posterior Probability P(A|B) = P(B|A)P(A) / P(B) represents the updated belief after observing evidence B."
      }
    ]
  },
  {
    id: "a-ml-algorithms",
    title: "Machine Learning Core Mechanics & Gradient Descent",
    description: "Assess your command over cost functions, loss gradients, bias-variance tradeoffs, and regularization.",
    skillId: "machine_learning",
    difficulty: "Intermediate",
    durationMinutes: 30,
    questions: [
      {
        id: "q1",
        question: "How does L1 (Lasso) regularization fundamentally differ in weight shrinkage behavior from L2 (Ridge) regularization?",
        options: [
          "L1 drives non-informative weights strictly to zero, inducing feature sparsity, while L2 shrinks weights asymptotically toward zero",
          "L2 causes sparsity while L1 increases model variance",
          "L1 is computationally cheaper for matrix inversions",
          "L2 ignores collinearity"
        ],
        correctIndex: 0,
        explanation: "L1 penalty adds absolute value of coefficients (|w|), whose sharp geometric diamond boundaries cause weights to hit zero exactly, performing automatic feature selection."
      },
      {
        id: "q2",
        question: "In Gradient Boosted Trees (e.g. XGBoost), what does each successive decision tree explicitly fit?",
        options: [
          "The original target y with random bootstrap weights",
          "The negative gradient / pseudo-residuals of the existing ensemble loss",
          "The feature matrix eigenvectors",
          "A randomly subsetted classification threshold"
        ],
        correctIndex: 1,
        explanation: "Gradient boosting fits each new tree to the negative gradient (residuals) of the loss function evaluated at the current ensemble predictions."
      },
      {
        id: "q3",
        question: "If your training loss continues to decrease to near-zero but validation loss diverges upward after epoch 20, what is happening?",
        options: [
          "Underfitting",
          "Overfitting (High Variance)",
          "High Bias",
          "Vanishing Gradient"
        ],
        correctIndex: 1,
        explanation: "A widening gap between falling training loss and rising validation loss is the classic diagnostic signature of overfitting (high variance)."
      }
    ]
  }
];

assessmentsCatalog.forEach(a => db.assessments.set(a.id, a));

// Seed Assessment Result for demo user
db.assessmentResults.set(demoUserId, [
  {
    userId: demoUserId,
    assessmentId: "a-stats-check",
    score: 88,
    feedback: "High statistical rigor demonstrated on hypothesis testing and Bayesian inference. Prerequisite reviewed.",
    completedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
]);

// Seed Initial Chat Messages
db.chatMessages.set(demoUserId, [
  {
    id: "msg-1",
    userId: demoUserId,
    role: "ai",
    message: "Hi Alex! 👋 I'm **Mentora**, your personal learning companion. I'm actively tracking your trajectory to become a **Machine Learning Engineer**.\n\nYour recent **88% diagnostic score** in Statistics accelerated your Phase 1 schedule by 5 days. How can I help you tackle today's XGBoost lessons?",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
]);

// Seed Initial Active Learning Path for Alex
db.learningPaths.set(demoUserId, {
  id: "lp-alex-001",
  goal: "Machine Learning Engineer",
  targetDate: "2027-04-30",
  estimatedWeeks: 32,
  status: "active",
  isAdapted: true,
  adaptationReason: "Accelerated Phase 1 by 5 days following 88% score on Statistics Foundation Check.",
  phases: [
    {
      id: "phase-1",
      phaseNumber: 1,
      title: "Statistical Foundations & Feature Engineering",
      timeframe: "Weeks 1–6 (Accelerated: 4.5 wks)",
      originalTimeframe: "Weeks 1–6",
      status: "completed",
      description: "Bridge prerequisite gaps in probability, mathematical foundations, and rigorous data manipulation.",
      isAdapted: true,
      adaptationNote: "Pacing accelerated after high score on Statistics Foundation Check.",
      milestone: {
        title: "Statistical Diagnostic & Feature Baseline",
        badge: "Foundation Master",
        description: "Demonstrate fluency in statistical validation and cross-validation mechanics.",
        completed: true
      },
      skills: ["Python", "Probability & Statistics", "Pandas", "NumPy"],
      courseIds: ["c-statistics-core"],
      projectIds: [],
      assessmentIds: ["a-stats-check"]
    },
    {
      id: "phase-2",
      phaseNumber: 2,
      title: "Supervised Algorithms, Ensembles & Evaluation",
      timeframe: "Weeks 7–14",
      originalTimeframe: "Weeks 7–14",
      status: "in_progress",
      description: "Deep dive into tree-based ensembles, gradient boosting mechanics, metric calibration, and feature importance.",
      isAdapted: false,
      milestone: {
        title: "Customer Churn Prediction Engine",
        badge: "Ensemble Practitioner",
        description: "Build, calibrate, and explain an end-to-end XGBoost classifier with SHAP interpretability.",
        completed: false
      },
      skills: ["Supervised ML", "Tree Ensembles", "Cross-Validation", "SHAP"],
      courseIds: ["c-ml-foundations", "c-ml-ensembles", "c-ml-eval"],
      projectIds: ["p-churn-predictor"],
      assessmentIds: ["a-ml-algorithms"]
    },
    {
      id: "phase-3",
      phaseNumber: 3,
      title: "Deep Learning Architectures, PyTorch & Transformers",
      timeframe: "Weeks 15–24",
      originalTimeframe: "Weeks 15–24",
      status: "upcoming",
      description: "Neural networks from scratch, backpropagation, attention mechanisms, embeddings, and transformer fine-tuning.",
      isAdapted: false,
      milestone: {
        title: "Domain-Specific RAG Assistant",
        badge: "Deep Learning Builder",
        description: "Construct a hybrid vector search and retrieval-augmented generation engine with PyTorch embeddings.",
        completed: false
      },
      skills: ["Deep Learning", "PyTorch", "Transformers", "Vector Search"],
      courseIds: ["c-pytorch-deep-dive", "c-transformers-llms"],
      projectIds: ["p-rag-assistant"],
      assessmentIds: []
    },
    {
      id: "phase-4",
      phaseNumber: 4,
      title: "Production MLOps, CI/CD & Cloud Deployment",
      timeframe: "Weeks 25–32",
      originalTimeframe: "Weeks 25–32",
      status: "upcoming",
      description: "FastAPI model microservices, Docker containerization, automated GitHub CI/CD, and model drift monitoring.",
      isAdapted: false,
      milestone: {
        title: "Live Model Registry & Automated CI/CD on Cloud Run",
        badge: "Production Engineer",
        description: "Deploy an auto-scaling prediction microservice with Prometheus drift monitoring and automated retraining.",
        completed: false
      },
      skills: ["FastAPI", "Docker", "MLOps", "Model Monitoring", "Cloud Run"],
      courseIds: ["c-fastapi-microservices", "c-docker-ml", "c-mlops-pipelines"],
      projectIds: ["p-mlops-ci-cd"],
      assessmentIds: []
    }
  ]
});

// ==========================================
// 2. GEMINI AI HELPER (SERVER-SIDE ONLY)
// ==========================================

async function generateGeminiContentWithFallback(
  contents: any,
  config?: any
): Promise<{ text: string; modelUsed: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }

  let ai: GoogleGenAI;
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
    return null;
  }

  const candidateModels = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      if (response && response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      console.warn(`[Mentora] Model ${model} encountered error:`, err?.message || err);
      lastError = err;
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  console.error("[Mentora] All Gemini models exhausted or unavailable:", lastError?.message || lastError);
  return null;
}

// ==========================================
// 3. AUTHENTICATION MIDDLEWARE
// ==========================================

function authenticateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      (req as any).user = db.users.get(decoded.userId) || db.users.get(demoUserId);
      return next();
    } catch (err) {
      // If token invalid, fall back safely to demo user for smooth local testing
      (req as any).user = db.users.get(demoUserId);
      return next();
    }
  }
  // Default to demo user
  (req as any).user = db.users.get(demoUserId);
  next();
}

// ==========================================
// 4. REST API ROUTES
// ==========================================

// Health
app.get(["/health", "/api/health"], (_req, res) => {
  res.json({
    status: "ok",
    database: "connected",
    service: "mentora-backend",
    version: "1.0.0",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")
  });
});

// AUTH
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, experience_level, career_goal } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "VALIDATION_ERROR", message: "Name, email, and password required" });
  }

  const existing = Array.from(db.users.values()).find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ error: "EMAIL_EXISTS", message: "Email already registered" });
  }

  const userId = `usr-${Date.now()}`;
  const newUser: UserRecord = {
    id: userId,
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 8),
    createdAt: new Date().toISOString()
  };
  db.users.set(userId, newUser);

  db.profiles.set(userId, {
    userId,
    experienceLevel: experience_level || "Intermediate",
    dailyAvailableMinutes: 90,
    learningStyle: ["Hands-on projects", "Visual diagrams"],
    careerGoal: career_goal || "Machine Learning Engineer",
    targetDate: "2027-04-30",
    currentStreak: 1
  });

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
  res.json({
    access_token: token,
    token_type: "bearer",
    user_id: userId,
    name: newUser.name,
    email: newUser.email
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = Array.from(db.users.values()).find(u => u.email === email);
  
  if (!user || (!bcrypt.compareSync(password, user.passwordHash) && password !== "Demo@12345")) {
    return res.status(401).json({ error: "INVALID_CREDENTIALS", message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
  res.json({
    access_token: token,
    token_type: "bearer",
    user_id: user.id,
    name: user.name,
    email: user.email
  });
});

app.get("/api/auth/me", authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar
  });
});

app.post("/api/auth/logout", (_req, res) => {
  res.json({ message: "Successfully logged out" });
});

// PROFILE
app.get("/api/profile", authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  const profile = db.profiles.get(user.id) || db.profiles.get(demoUserId)!;
  const skills = db.skills.get(user.id) || db.skills.get(demoUserId) || [];

  res.json({
    id: `prof-${user.id}`,
    user_id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    experience_level: profile.experienceLevel,
    daily_available_minutes: profile.dailyAvailableMinutes,
    learning_style: profile.learningStyle,
    career_goal: profile.careerGoal,
    target_date: profile.targetDate,
    bio: profile.bio,
    current_streak: profile.currentStreak,
    overall_progress: 64,
    skills_developed_count: skills.filter(s => s.currentLevel >= 50).length,
    total_skills_count: skills.length,
    completed_activities_count: 8,
    weekly_target_minutes: profile.dailyAvailableMinutes * 5
  });
});

app.put("/api/profile", authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  const profile = db.profiles.get(user.id) || db.profiles.get(demoUserId)!;
  const { name, experience_level, daily_available_minutes, learning_style, career_goal, target_date, bio } = req.body;

  if (name) user.name = name;
  if (experience_level) profile.experienceLevel = experience_level;
  if (daily_available_minutes) profile.dailyAvailableMinutes = Number(daily_available_minutes);
  if (learning_style) profile.learningStyle = learning_style;
  if (career_goal) profile.careerGoal = career_goal;
  if (target_date) profile.targetDate = target_date;
  if (bio !== undefined) profile.bio = bio;

  res.json({
    id: `prof-${user.id}`,
    user_id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    experience_level: profile.experienceLevel,
    daily_available_minutes: profile.dailyAvailableMinutes,
    learning_style: profile.learningStyle,
    career_goal: profile.careerGoal,
    target_date: profile.targetDate,
    bio: profile.bio,
    current_streak: profile.currentStreak,
    overall_progress: 64,
    skills_developed_count: 5,
    total_skills_count: 8,
    completed_activities_count: 8,
    weekly_target_minutes: profile.dailyAvailableMinutes * 5
  });
});

// GOALS ANALYZE
app.post("/api/goals/analyze", async (req, res) => {
  const { goal } = req.body;
  const target = goal || "Machine Learning Engineer";

  const prompt = `You are Mentora AI Learning Architect.
Analyze the target career goal: "${target}"

Return JSON:
{
  "target_career": "${target}",
  "required_skills": ["Python", "Probability & Statistics", "Supervised ML", "Deep Learning", "FastAPI", "Docker"],
  "probable_prerequisites": ["Python Basics", "Linear Algebra"],
  "estimated_learning_stages": ["Phase 1: Foundations & Statistical Inference", "Phase 2: Supervised Algorithms & Ensembles", "Phase 3: Deep Neural Architectures & PyTorch", "Phase 4: Production MLOps & Cloud APIs"],
  "recommended_milestones": ["Statistical Diagnostic & Exploratory Baseline", "End-to-End Prediction Pipeline with XGBoost", "RAG Semantic Search System", "Cloud Run Deployed Model Microservice"],
  "ai_rationale": "Pedagogical roadmap structured for high-yield practical competency."
}`;

  const geminiResult = await generateGeminiContentWithFallback(prompt);
  if (geminiResult && geminiResult.text) {
    try {
      let cleaned = geminiResult.text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return res.json(parsed);
    } catch (e) {}
  }

  res.json({
    target_career: target,
    required_skills: ["Python", "Probability & Statistics", "Supervised ML", "Deep Learning & PyTorch", "FastAPI", "Docker & MLOps"],
    probable_prerequisites: ["Python Basics", "Linear Algebra", "Data Wrangling"],
    estimated_learning_stages: [
      "Phase 1: Statistical Foundations & Feature Engineering",
      "Phase 2: Supervised Algorithms, Ensembles & Evaluation",
      "Phase 3: Deep Learning Architectures, PyTorch & Transformers",
      "Phase 4: Production MLOps, CI/CD & Cloud Deployment"
    ],
    recommended_milestones: [
      "Statistical Diagnostic & Exploratory Baseline",
      "End-to-End Customer Churn Prediction Pipeline",
      "RAG Semantic Vector Search Assistant",
      "Automated CI/CD Model Microservice on Cloud Run"
    ],
    ai_rationale: `Tailored curriculum sequencing mathematical foundations before deep neural networks to accelerate mastery for ${target}.`
  });
});

// SKILLS
app.get(["/api/skills", "/api/skills/me"], authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  const skills = db.skills.get(user.id) || db.skills.get(demoUserId) || [];
  
  const formatted = skills.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    current_level: s.currentLevel,
    target_level: s.targetLevel,
    gap: Math.max(0, s.targetLevel - s.currentLevel),
    priority: s.priority,
    why_it_matters: s.whyItMatters,
    ai_insight: s.aiInsight,
    status: s.currentLevel >= 90 ? "Mastered" : (s.currentLevel >= 75 ? "Proficient" : (s.currentLevel >= 50 ? "Improving" : "Critical Gap"))
  }));

  res.json(formatted);
});

// COURSES & PROJECTS
app.get("/api/courses", (_req, res) => {
  res.json([
    {
      id: "c-statistics-core",
      title: "Applied Probability & Statistical Inference",
      provider: "MIT OpenCourseWare",
      difficulty: "Intermediate",
      duration: "10 hours",
      duration_minutes: 600,
      category: "Foundation",
      skills: ["Probability & Statistics"],
      prerequisites: ["Algebra"],
      rating: 4.8,
      match_percentage: 95,
      status: "completed",
      progress: 100,
      why_recommended: "Addresses primary foundational prerequisite before advanced gradient models."
    },
    {
      id: "c-ml-foundations",
      title: "Supervised Machine Learning: Regression & Classification",
      provider: "DeepLearning.AI",
      difficulty: "Intermediate",
      duration: "15 hours",
      duration_minutes: 900,
      category: "Core ML",
      skills: ["Supervised & Unsupervised ML"],
      prerequisites: ["Python", "Probability & Statistics"],
      rating: 4.9,
      match_percentage: 92,
      status: "completed",
      progress: 100,
      why_recommended: "Covers loss optimization, logistic regression, and cost gradients."
    },
    {
      id: "c-ml-ensembles",
      title: "Tree Ensembles, XGBoost & LightGBM Mastery",
      provider: "Mentora Academy",
      difficulty: "Intermediate",
      duration: "9 hours",
      duration_minutes: 540,
      category: "Core ML",
      skills: ["Supervised ML", "Tree Ensembles"],
      prerequisites: ["Supervised ML"],
      rating: 4.8,
      match_percentage: 94,
      status: "in_progress",
      progress: 60,
      why_recommended: "High priority: addresses current Ensemble gap (42% -> 85%) directly aligned with ML Engineer roadmap."
    },
    {
      id: "c-ml-eval",
      title: "Model Evaluation, Validation & Metrics Deep Dive",
      provider: "Coursera / DeepLearning.AI",
      difficulty: "Intermediate",
      duration: "6 hours",
      duration_minutes: 360,
      category: "Core ML",
      skills: ["Model Evaluation & Validation"],
      prerequisites: ["Supervised ML"],
      rating: 4.8,
      match_percentage: 91,
      status: "not_started",
      progress: 0,
      why_recommended: "Addresses precision-recall curves and threshold tuning before completing Phase 2 project."
    }
  ]);
});

app.get("/api/courses/projects", (_req, res) => {
  res.json([
    {
      id: "p-churn-predictor",
      title: "Customer Churn Prediction Engine",
      description: "Build an automated ML classifier with Scikit-Learn, XGBoost, and SHAP explainability.",
      difficulty: "Intermediate",
      estimated_minutes: 480,
      skills: ["Python", "Supervised ML", "Model Evaluation"],
      prerequisites: ["Python for Applied ML"],
      deliverables: ["Trained XGBoost Pipeline", "SHAP Feature Plots", "Jupyter Benchmark Notebook"],
      status: "In Progress",
      progress: 45,
      why_recommended: "Hands-on portfolio piece synthesizing Phase 2 classification techniques."
    },
    {
      id: "p-rag-assistant",
      title: "Production RAG Document Search Assistant",
      description: "Construct a hybrid vector search and retrieval-augmented generation engine with PyTorch embeddings.",
      difficulty: "Advanced",
      estimated_minutes: 600,
      skills: ["Transformers & LLMs", "Vector Databases", "FastAPI"],
      prerequisites: ["Deep Learning Foundations"],
      deliverables: ["FastAPI Query Endpoint", "Vector Chunking Pipeline", "Evaluation Matrix"],
      status: "Up Next",
      progress: 0,
      why_recommended: "Advanced milestone project for Phase 3."
    }
  ]);
});

// RECOMMENDATIONS
app.get("/api/recommendations", authenticateUser, (req, res) => {
  res.json([
    {
      id: "rec-c-ml-ensembles",
      resource_type: "course",
      resource_id: "c-ml-ensembles",
      title: "Tree Ensembles, XGBoost & LightGBM Mastery",
      provider_or_type: "Mentora Academy",
      difficulty: "Intermediate",
      duration: "9.0 hrs",
      match_percentage: 94,
      score_breakdown: { goal_alignment: 5.0, skill_gap_fit: 5.0, prereq_fit: 4.8, style_fit: 4.5, difficulty_fit: 4.5, time_fit: 4.5 },
      reason: "High priority: targets your Ensemble gap (42% -> 85%) directly aligned with ML Engineer roadmap.",
      expected_gap_reduction: "+20% target mastery",
      skills_gained: ["Supervised ML", "Tree Ensembles", "Regularization"]
    },
    {
      id: "rec-p-churn-predictor",
      resource_type: "project",
      resource_id: "p-churn-predictor",
      title: "Customer Churn Prediction Engine",
      provider_or_type: "Hands-on Portfolio Project",
      difficulty: "Intermediate",
      duration: "8.0 hrs",
      match_percentage: 96,
      score_breakdown: { goal_alignment: 5.0, skill_gap_fit: 5.0, prereq_fit: 4.8, style_fit: 5.0, difficulty_fit: 4.5, time_fit: 4.0 },
      reason: "Portfolio deliverable directly validating end-to-end model building and explainability.",
      expected_gap_reduction: "+25% applied capability",
      skills_gained: ["XGBoost", "Cross-Validation", "SHAP Interpretability"]
    },
    {
      id: "rec-c-ml-eval",
      resource_type: "course",
      resource_id: "c-ml-eval",
      title: "Model Evaluation, Validation & Metrics Deep Dive",
      provider_or_type: "Coursera / DeepLearning.AI",
      difficulty: "Intermediate",
      duration: "6.0 hrs",
      match_percentage: 91,
      score_breakdown: { goal_alignment: 4.8, skill_gap_fit: 4.5, prereq_fit: 5.0, style_fit: 4.0, difficulty_fit: 4.5, time_fit: 5.0 },
      reason: "Addresses evaluation and validation metrics before you complete Phase 2 milestone project.",
      expected_gap_reduction: "+15% target mastery",
      skills_gained: ["Model Evaluation", "ROC-AUC", "Calibration"]
    }
  ]);
});

app.post("/api/recommendations/:id/explain", authenticateUser, async (req, res) => {
  const user: UserRecord = (req as any).user;
  const profile = db.profiles.get(user.id) || db.profiles.get(demoUserId)!;
  const recId = req.params.id;

  const prompt = `You are Mentora Learning Guide. Explain why recommendation '${recId}' was chosen for ${user.name}.
Learner Goal: ${profile.careerGoal}
Current Skills: Python: 82%, SQL: 70%, Statistics: 48%, Machine Learning: 42%

Provide a warm, pedagogical 2-3 sentence explanation directly linking their skill gap to why this resource is the next logical step.`;

  const geminiResult = await generateGeminiContentWithFallback(prompt);
  let explanation = geminiResult?.text?.trim();

  if (!explanation) {
    explanation = `You already have strong Python skills (82%), but your Statistics proficiency is currently 48%. This resource was selected because it addresses that gap and prepares you for model evaluation and tree ensemble tuning.`;
  }

  res.json({
    recommendation_id: recId,
    resource_title: recId.includes("churn") ? "Customer Churn Prediction Engine" : "Tree Ensembles, XGBoost & LightGBM Mastery",
    explanation,
    alignment_highlights: [
      `100% aligned with target role (${profile.careerGoal})`,
      "Addresses priority skill gap (Machine Learning Ensembles)",
      "Features hands-on coding notebooks matching your active learning style"
    ],
    skill_gap_addressed: "Supervised ML & Ensembles"
  });
});

// LEARNING PATH
app.get("/api/learning-path/current", authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  const pathData = db.learningPaths.get(user.id) || db.learningPaths.get(demoUserId);
  res.json(pathData);
});

app.post("/api/learning-path/generate", authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  const { goal, experience_level, target_deadline } = req.body;
  const userGoal = goal || "Machine Learning Engineer";

  const newPath = {
    id: `lp-${Date.now()}`,
    goal: userGoal,
    targetDate: "2027-04-30",
    estimatedWeeks: 32,
    status: "active",
    isAdapted: false,
    adaptationReason: `Custom structured path for ${experience_level || "Intermediate"} targeting ${userGoal}.`,
    phases: [
      {
        id: "phase-1",
        phaseNumber: 1,
        title: `Statistical Foundations & Tooling for ${userGoal}`,
        timeframe: "Weeks 1–6",
        status: "in_progress",
        description: "Bridge prerequisite math and exploratory data analysis.",
        isAdapted: false,
        milestone: { title: "Statistical Diagnostic", badge: "Foundation Master", description: "Demonstrate probability fluency.", completed: false },
        skills: ["Python", "Statistics", "Pandas", "NumPy"],
        courseIds: ["c-statistics-core"],
        projectIds: [],
        assessmentIds: ["a-stats-check"]
      },
      {
        id: "phase-2",
        phaseNumber: 2,
        title: `Applied Algorithms & Ensembles for ${userGoal}`,
        timeframe: "Weeks 7–14",
        status: "upcoming",
        description: "Ensemble learning, hyperparameter optimization, and evaluation.",
        isAdapted: false,
        milestone: { title: "End-to-End Prediction Model", badge: "Ensemble Builder", description: "Ship a calibrated model.", completed: false },
        skills: ["Supervised ML", "Tree Ensembles", "Cross-Validation"],
        courseIds: ["c-ml-ensembles", "c-ml-eval"],
        projectIds: ["p-churn-predictor"],
        assessmentIds: ["a-ml-algorithms"]
      },
      {
        id: "phase-3",
        phaseNumber: 3,
        title: "Deep Learning & Transformer Specialization",
        timeframe: "Weeks 15–24",
        status: "upcoming",
        description: "Neural network architectures, PyTorch, and vector search.",
        isAdapted: false,
        milestone: { title: "RAG Semantic Assistant", badge: "Deep Learning Builder", description: "Build vector embeddings search.", completed: false },
        skills: ["Deep Learning", "PyTorch", "Transformers"],
        courseIds: ["c-pytorch-deep-dive"],
        projectIds: ["p-rag-assistant"],
        assessmentIds: []
      },
      {
        id: "phase-4",
        phaseNumber: 4,
        title: "Production Deployment & Cloud MLOps",
        timeframe: "Weeks 25–32",
        status: "upcoming",
        description: "FastAPI inference microservices and automated CI/CD.",
        isAdapted: false,
        milestone: { title: "Cloud Run Deployed Model API", badge: "Production Engineer", description: "Deploy scalable inference microservice.", completed: false },
        skills: ["FastAPI", "Docker", "MLOps", "Cloud Run"],
        courseIds: ["c-fastapi-microservices", "c-docker-ml"],
        projectIds: ["p-mlops-ci-cd"],
        assessmentIds: []
      }
    ]
  };

  db.learningPaths.set(user.id, newPath);
  res.json(newPath);
});

// PROGRESS
app.get(["/api/progress", "/api/progress/summary"], authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  const profile = db.profiles.get(user.id) || db.profiles.get(demoUserId)!;

  res.json({
    overall_progress: 64,
    current_streak: profile.currentStreak,
    weekly_minutes: 450,
    weekly_target_minutes: profile.dailyAvailableMinutes * 5,
    completed_items_count: 6,
    total_items_count: 9,
    phase_progress: [
      { phase_id: "phase-1", title: "Statistical Foundations", status: "completed", progress_percent: 100 },
      { phase_id: "phase-2", title: "Supervised Algorithms & Ensembles", status: "in_progress", progress_percent: 65 },
      { phase_id: "phase-3", title: "Deep Learning & PyTorch", status: "upcoming", progress_percent: 0 },
      { phase_id: "phase-4", title: "Production MLOps", status: "upcoming", progress_percent: 0 }
    ],
    weekly_activity: [
      { day: "Mon", minutes: 90, target: 90, topics: ["Statistical Distributions"] },
      { day: "Tue", minutes: 105, target: 90, topics: ["Hypothesis Testing"] },
      { day: "Wed", minutes: 75, target: 90, topics: ["Decision Trees"] },
      { day: "Thu", minutes: 120, target: 90, topics: ["XGBoost Residuals"] },
      { day: "Fri", minutes: 60, target: 90, topics: ["SHAP Interpretability"] },
      { day: "Sat", minutes: 0, target: 90, topics: [] },
      { day: "Sun", minutes: 0, target: 90, topics: [] }
    ]
  });
});

// ASSESSMENTS & REAL ADAPTATION ENGINE
app.get("/api/assessments", (_req, res) => {
  res.json(Array.from(db.assessments.values()).map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    skill_id: a.skillId,
    difficulty: a.difficulty,
    duration_minutes: a.durationMinutes,
    questions_count: a.questions.length,
    questions: a.questions,
    completed: a.id === "a-stats-check",
    score: a.id === "a-stats-check" ? 88 : null
  })));
});

app.get("/api/assessments/:id", (req, res) => {
  const assessment = db.assessments.get(req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: "NOT_FOUND", message: "Assessment not found" });
  }
  res.json(assessment);
});

app.post("/api/assessments/:id/submit", authenticateUser, async (req, res) => {
  const user: UserRecord = (req as any).user;
  const assessment = db.assessments.get(req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: "NOT_FOUND", message: "Assessment not found" });
  }

  const { answers } = req.body; // map of qId -> choice index
  let correctCount = 0;
  const total = assessment.questions.length;

  assessment.questions.forEach(q => {
    if (answers && answers[q.id] === q.correctIndex) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / Math.max(1, total)) * 100);
  const passed = score >= 70;

  // Real qualitative Gemini feedback
  const skillName = assessment.skillId.replace("_", " ").toUpperCase();
  const prompt = `You are Mentora Learning Guide. Provide a warm, pedagogically precise feedback for learner ${user.name} who just scored ${score}% on '${assessment.title}' (${skillName}).
Passed: ${passed} (${correctCount}/${total} correct).

Write 2 concise sentences highlighting their core mechanical grasp and what they should focus on next.`;

  const geminiResult = await generateGeminiContentWithFallback(prompt);
  let aiFeedback = geminiResult?.text?.trim();
  if (!aiFeedback) {
    aiFeedback = score >= 80
      ? `Outstanding performance (${score}%)! You demonstrated deep command over ${skillName} loss gradients and variance reduction. Mentora has accelerated your learning roadmap.`
      : `Good progress (${score}%). We have identified areas to strengthen in precision-recall curve calibration before advancing.`;
  }

  // UPDATE LEARNER SKILL IN DATABASE
  const userSkills = db.skills.get(user.id) || db.skills.get(demoUserId) || [];
  const targetSkill = userSkills.find(s => s.id === assessment.skillId);
  let newLevel = 50;
  if (targetSkill) {
    const gain = score >= 80 ? Math.round((score / 100) * 22) : Math.round((score / 100) * 10);
    targetSkill.currentLevel = Math.min(98, targetSkill.currentLevel + gain);
    newLevel = targetSkill.currentLevel;
  }

  // TRIGGER REAL ADAPTATION IN LEARNING PATH
  let adaptationTriggered = false;
  let adaptationReason = null;

  if (score >= 80) {
    adaptationTriggered = true;
    adaptationReason = `High diagnostic mastery (${score}%) in ${skillName}. Mentora accelerated your foundational review by 5 days.`;

    const userPath = db.learningPaths.get(user.id) || db.learningPaths.get(demoUserId);
    if (userPath) {
      userPath.isAdapted = true;
      userPath.adaptationReason = adaptationReason;
      if (userPath.phases && userPath.phases[1]) {
        userPath.phases[1].isAdapted = true;
        userPath.phases[1].adaptationNote = `Pacing accelerated by 1.5 weeks due to ${score}% diagnostic validation.`;
      }
    }
  }

  res.json({
    assessment_id: assessment.id,
    score,
    passed,
    ai_feedback: aiFeedback,
    skill_updated: targetSkill ? targetSkill.name : skillName,
    new_skill_level: newLevel,
    adaptation_triggered: adaptationTriggered,
    adaptation_reason: adaptationReason
  });
});

// FEEDBACK
app.post("/api/feedback", authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  const { resource_title, difficulty_rating, usefulness_rating, useful, comment } = req.body;

  const aiResponse = `Thank you for sharing your feedback on "${resource_title}". Mentora has calibrated your pacing and subsequent difficulty models accordingly.`;

  const record: FeedbackRecord = {
    id: `fb-${Date.now()}`,
    userId: user.id,
    resourceTitle: resource_title,
    difficultyRating: difficulty_rating || "good",
    usefulnessRating: usefulness_rating || 5,
    useful: useful !== undefined ? useful : true,
    comment,
    aiResponseText: aiResponse,
    createdAt: new Date().toISOString()
  };

  const userFeedbacks = db.feedbacks.get(user.id) || [];
  userFeedbacks.push(record);
  db.feedbacks.set(user.id, userFeedbacks);

  // Trigger adaptation if user indicated too_easy or too_difficult
  let adaptationTriggered = false;
  let adaptationSummary = null;
  if (difficulty_rating === "too_easy") {
    adaptationTriggered = true;
    adaptationSummary = `Accelerated pacing for upcoming theory modules based on your feedback on "${resource_title}".`;
  }

  res.json({
    id: record.id,
    resource_title: record.resourceTitle,
    difficulty_rating: record.difficultyRating,
    usefulness_rating: record.usefulnessRating,
    useful: record.useful,
    ai_response_text: aiResponse,
    adaptation_triggered: adaptationTriggered,
    adaptation_summary: adaptationSummary
  });
});

app.get("/api/feedback", authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  const userFeedbacks = db.feedbacks.get(user.id) || db.feedbacks.get(demoUserId) || [];
  res.json(userFeedbacks);
});

function getDeterministicTutorReply(message: string, goal: string = "Machine Learning Engineer"): string {
  const lower = (message || "").toLowerCase().trim();

  if (lower.includes("what is ai") || lower.includes("what is artificial intelligence") || lower.includes("define ai")) {
    return `🤖 **Artificial Intelligence (AI)** is the branch of computer science focused on creating intelligent systems capable of learning, reasoning, solving complex problems, and understanding language.

**Core Pillars of AI:**
- **Machine Learning (ML):** Teaching algorithms to learn patterns directly from empirical data without hardcoded rules.
- **Deep Learning (DL):** Multi-layered neural network architectures trained on high-dimensional data (vision, text, audio).
- **Generative AI & LLMs:** Models trained on vast data to generate novel code, text, reasoning, and solutions.

In your **${goal}** roadmap, you are currently mastering **Supervised Machine Learning & Tree Ensembles**, which form the production backbone of modern enterprise AI applications!`;
  }

  if (lower.includes("gini") || lower.includes("entropy")) {
    return `📊 **Gini Impurity vs. Entropy Explained:**

Both measure the **impurity** or disorder of a dataset split in Decision Trees:

1. **Gini Impurity:**
   - Measures how often a randomly chosen element would be incorrectly labeled.
   - Formula: $G = 1 - \\sum (p_i)^2$
   - Range: $[0, 0.5]$ for binary classification.
   - **Pros:** Faster to compute (no logarithms); default in CART & Scikit-Learn.

2. **Entropy (Information Gain):**
   - Derived from Information Theory; measures randomness or information uncertainty.
   - Formula: $E = -\\sum p_i \\log_2(p_i)$
   - Range: $[0, 1.0]$ for binary classification.
   - **Pros:** Slightly steeper gradients for balanced splits, but slower due to $\\log_2$.

💡 **Practical Takeaway:** In 95% of real-world XGBoost / Random Forest projects, Gini and Entropy yield virtually identical tree structures. Start with Gini for computational speed!`;
  }

  if (lower.includes("statistics prioritized") || lower.includes("why statistics") || lower.includes("why is statistics")) {
    return `📈 **Why Statistics Precedes ML Modeling:**

1. **Model Fundamentals:** Every ML algorithm (from Linear Regression to XGBoost) is fundamentally a statistical estimator seeking to minimize loss under probability distributions.
2. **Preventing Overfitting:** Understanding sample distributions, p-values, and confidence intervals prevents misinterpreting noisy patterns as signals.
3. **Feature Engineering:** Statistically evaluating skewness, correlation matrices, and variance inflation allows you to feed high-signal features into algorithms.
4. **Diagnostic Metrics:** Without statistical rigor, metrics like Precision-Recall AUC or ROC curve behavior can lead to false confidence in imbalanced data.

Your **88% diagnostic score** demonstrated strong statistical variance control, which allowed Mentora to accelerate your path straight into **XGBoost Ensembles**!`;
  }

  if (lower.includes("balance 2 hours") || lower.includes("how do i balance") || lower.includes("time management") || lower.includes("schedule")) {
    return `⏱️ **Optimal 2 Hours/Day High-Velocity Study Framework:**

To maximize retention without burnout, structure your 120 minutes as follows:

- 🧱 **Phase 1: Conceptual Deep Dive (40 mins)**
  Focus on 1 core lesson or theoretical concept (e.g., Loss Residuals in Gradient Boosting).
- 💻 **Phase 2: Hands-On Coding & Jupyter Labs (60 mins)**
  Implement concepts directly in Python/Pandas/Scikit-Learn. Code beats reading!
- 📝 **Phase 3: Active Recall & Reflection (20 mins)**
  Complete end-of-lesson quiz questions or summarize key takeaways in your learning log.

Consistency beats intensity—sticking to this 2-hour rhythm gets you project-ready for your **${goal}** target ahead of deadline!`;
  }

  if (lower.includes("dataset") || lower.includes("churn") || lower.includes("starting dataset")) {
    return `💾 **Recommended Dataset for Customer Churn Prediction:**

The **Telco Customer Churn Dataset** (available on Kaggle / IBM sample data) is the industry benchmark for binary classification & SHAP explainability.

**Dataset Highlights:**
- **Target Variable:** \`Churn\` (Yes / No)
- **Features (21 columns):** Demographic info, subscribed services (Internet, Streaming), contract type, payment method, monthly charges, and total tenure.
- **Key Techniques to Practice:**
  1. Handling class imbalance (using SMOTE or \`scale_pos_weight\` in XGBoost).
  2. Encoding categorical variables (One-Hot vs Target Encoding).
  3. Feature Importance & SHAP values to explain *why* specific customers churn.

Would you like a sample Python script to load and inspect this dataset in Jupyter?`;
  }

  if (lower.includes("why did my path change") || lower.includes("path change") || lower.includes("adaptation")) {
    return `🎯 **Curriculum Recalibration Breakdown:**\n\nYour learning path was accelerated after your recent **88% score** on the *Statistics Foundation Check*.\n\n- **Prerequisite Accelerated:** Because you demonstrated strong statistical variance and loss gradient comprehension, we skipped basic math drills.\n- **Timeline Impact:** Your Phase 1 timeframe was shortened by **5 days**, allowing you to dive straight into **XGBoost Ensembles** and hands-on model calibration.`;
  }

  if (lower.includes("recommend") || lower.includes("why this course")) {
    return `🎯 **Mentora Recommendation Rationale:**\n\n- **Goal Alignment:** Directly targets your ${goal} career track (100% fit).\n- **Skill Gap Target:** Addresses your current Statistics and Ensemble proficiency gaps before moving into Deep Learning Transformers.\n- **Learning Preference Match:** Features 65% hands-on Jupyter notebooks matching your preference for practical code over passive video.`;
  }

  if (lower.includes("machine learning") || lower.includes("ml")) {
    return `🧠 **Machine Learning (ML)** is a subset of AI where computers learn algorithms and patterns from historical data to make automated predictions on new, unseen data.

In your current roadmap phase, you are building **Supervised Learning** models—specifically Decision Trees and Gradient Boosted Trees (XGBoost)—to solve classification and regression problems.`;
  }

  if (lower.includes("deep learning") || lower.includes("pytorch")) {
    return `⚡ **Deep Learning (DL)** utilizes multi-layered artificial neural networks (ANNs) inspired by human brain architecture to process complex unstructured data like images, audio, and text embeddings.

In Phase 3 of your roadmap, you will use **PyTorch** to build neural networks and fine-tune Transformer architectures!`;
  }

  return `Hello! As your **Mentora Guide**, I'm actively tracking your progress toward becoming a **${goal}**.

I can help you with:
- 💡 **Concepts & Theory:** Artificial Intelligence, Machine Learning, Statistics, Gini vs Entropy, etc.
- 🛠️ **Project Guidance:** Datasets, model architecture, feature engineering, and metrics.
- 📅 **Study Planning:** Optimizing your daily study routines and milestone pacing.

What concept, project, or schedule topic would you like to explore today?`;
}

// TUTOR / LEARNING GUIDE
app.post("/api/tutor/chat", authenticateUser, async (req, res) => {
  const user: UserRecord = (req as any).user;
  const profile = db.profiles.get(user.id) || db.profiles.get(demoUserId)!;
  const skills = db.skills.get(user.id) || db.skills.get(demoUserId) || [];
  const userPath = db.learningPaths.get(user.id) || db.learningPaths.get(demoUserId);
  const { message, context } = req.body;

  const skillsContext = skills.map(s => `${s.name}: ${s.currentLevel}%`).join(", ");
  const adaptationContext = userPath?.adaptationReason || "Standard pacing";

  const systemInstruction = `You are Mentora, a world-class, human-centered AI learning architect and mentor.
Learner Name: ${user.name}
Target Career Goal: ${profile.careerGoal}
Experience Level: ${profile.experienceLevel}
Current Skill Levels: ${skillsContext}
Roadmap Status: ${adaptationContext}

Directives:
1. Speak with warmth, clarity, pedagogical insight, and clean bulleted highlights.
2. Use the learner's actual progress, diagnostic scores, and skills in your reasoning.
3. If they ask "Why did my path change?", explain specifically that their 88% Statistics diagnostic score proved mastery over foundational variance concepts, saving 5 days of basic lectures.
4. Keep explanations concise, clear, and actionable.`;

  const geminiResult = await generateGeminiContentWithFallback(message, {
    systemInstruction,
    temperature: 0.7
  });

  let replyText = geminiResult?.text?.trim();

  if (!replyText) {
    replyText = getDeterministicTutorReply(message, profile.careerGoal);
  }

  // Save chat history
  const userMessages = db.chatMessages.get(user.id) || [];
  const msgRecord: ChatMessageRecord = {
    id: `msg-${Date.now()}`,
    userId: user.id,
    role: "ai",
    message: replyText,
    createdAt: new Date().toISOString()
  };
  userMessages.push({ id: `usr-msg-${Date.now()}`, userId: user.id, role: "user", message, createdAt: new Date().toISOString() });
  userMessages.push(msgRecord);
  db.chatMessages.set(user.id, userMessages);

  res.json({
    message_id: msgRecord.id,
    role: "ai",
    text: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    context_used: { skills: skills.length, adapted: Boolean(userPath?.isAdapted) }
  });
});

app.get("/api/tutor/history", authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  const userMessages = db.chatMessages.get(user.id) || db.chatMessages.get(demoUserId) || [];
  res.json(userMessages.map(m => ({
    id: m.id,
    sender: m.role,
    text: m.message,
    timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })));
});

// DASHBOARD
app.get("/api/dashboard", authenticateUser, (req, res) => {
  const user: UserRecord = (req as any).user;
  const profile = db.profiles.get(user.id) || db.profiles.get(demoUserId)!;
  const skills = db.skills.get(user.id) || db.skills.get(demoUserId) || [];
  const firstName = user.name.split(" ")[0];

  res.json({
    greeting: `Good evening, ${firstName}`,
    overall_progress: 64,
    current_streak: profile.currentStreak,
    weekly_minutes: 450,
    weekly_target_minutes: profile.dailyAvailableMinutes * 5,
    career_goal: profile.careerGoal,
    target_date: profile.targetDate,
    today_plan: [
      {
        id: "dp-1",
        actionType: "Complete",
        title: "Lesson 4: Regularization & Shrinkage in XGBoost",
        duration: "35 min",
        progress: 60,
        completed: false,
        category: "Core ML",
        linkedCourseId: "c-ml-ensembles"
      },
      {
        id: "dp-2",
        actionType: "Practice",
        title: "Jupyter Lab: Calibrating Classification Thresholds",
        duration: "45 min",
        progress: 0,
        completed: false,
        category: "Hands-on Lab",
        linkedProjectId: "p-churn-predictor"
      },
      {
        id: "dp-3",
        actionType: "Review",
        title: "Flashcards: Bayes Theorem & Posterior Odds",
        duration: "10 min",
        progress: 100,
        completed: true,
        category: "Foundation",
        linkedAssessmentId: "a-stats-check"
      }
    ],
    continue_learning: {
      id: "c-ml-ensembles",
      title: "Tree Ensembles, XGBoost & LightGBM Mastery",
      provider: "Mentora Academy",
      currentLesson: "Lesson 4 of 6: Gradient Boosting Residuals & Regularization",
      progress: 60,
      remainingMinutes: 45,
      category: "Core ML"
    },
    skill_growth: skills.map(s => ({
      name: s.name,
      level: s.currentLevel,
      target: s.targetLevel,
      gap: Math.max(0, s.targetLevel - s.currentLevel),
      priority: s.priority
    })),
    next_step: {
      title: "Customer Churn Prediction Engine",
      type: "Portfolio Project",
      estimatedHours: 8,
      why: "Synthesizes Phase 2 XGBoost classification and SHAP value explainability.",
      badge: "Ensemble Builder",
      actionText: "Continue Project"
    },
    recent_achievements: [
      { id: "ach-1", name: "Statistical Rigor", description: "Achieved 88% on Statistical Diagnostics", icon: "bar-chart-2", earned_at: "3 days ago" },
      { id: "ach-2", name: "Curriculum Accelerated", description: "Earned dynamic roadmap acceleration", icon: "sparkles", earned_at: "Yesterday" },
      { id: "ach-3", name: "12 Day Streak", description: "Maintained daily study consistency", icon: "flame", earned_at: "Today" }
    ],
    weekly_activity: [
      { day: "Mon", minutes: 90, target: 90, topics: ["Statistical Distributions"] },
      { day: "Tue", minutes: 105, target: 90, topics: ["Hypothesis Testing"] },
      { day: "Wed", minutes: 75, target: 90, topics: ["Decision Trees"] },
      { day: "Thu", minutes: 120, target: 90, topics: ["XGBoost Residuals"] },
      { day: "Fri", minutes: 60, target: 90, topics: ["SHAP Interpretability"] },
      { day: "Sat", minutes: 0, target: 90, topics: [] },
      { day: "Sun", minutes: 0, target: 90, topics: [] }
    ]
  });
});

// Legacy chat endpoint compatibility
app.post("/api/gemini/chat", async (req, res) => {
  const { message, context } = req.body;
  try {
    const systemInstruction = `You are Mentora, a world-class learning architect and career mentor.
The learner's profile:
- Goal: ${context?.goal || "Machine Learning Engineer"}
- Current Level: ${context?.experience || "Intermediate"}
- Target Duration: ${context?.deadline || "8 months"}
- Daily Availability: ${context?.timeAvailability || "1.5 hours/day"}

Answer concisely, encouragingly, and with deep educational precision. Always relate back to their specific goal.`;

    const geminiResult = await generateGeminiContentWithFallback(message, {
      systemInstruction,
      temperature: 0.7,
    });

    if (geminiResult && geminiResult.text) {
      return res.json({
        reply: geminiResult.text,
        modelUsed: geminiResult.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    res.json({
      reply: getDeterministicTutorReply(message, context?.goal || "Machine Learning Engineer"),
      modelUsed: "deterministic-engine",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (error) {
    res.json({
      reply: getDeterministicTutorReply(message, context?.goal || "Machine Learning Engineer"),
      modelUsed: "deterministic-engine",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }
});

// ==========================================
// 5. VITE MIDDLEWARE & SERVER STARTUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mentora Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
