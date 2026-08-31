from datetime import datetime, timezone, timedelta
from app.database.database import SessionLocal, engine, Base
from app.database.models import (
    User, LearnerProfile, Skill, LearnerSkill, Course, Project,
    Assessment, LearningPath, LearningPhase, LearningItem, Progress,
    Achievement, UserAchievement, Recommendation, ChatMessage
)
from app.core.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "demo@learnora.app").first():
            print("Database already seeded with demo user.")
            return

        print("Seeding Mentora database...")

        # 1. Seed Skills (24 skills)
        skills_data = [
            ("python", "Python", "Foundation", "Core programming, OOP, functional patterns, and performance optimization.", "code"),
            ("sql", "SQL & Relational DBs", "Foundation", "Complex queries, window functions, indexing, and relational schema design.", "database"),
            ("statistics", "Probability & Statistics", "Foundation", "Bayesian inference, hypothesis testing, distributions, and variance analysis.", "bar-chart"),
            ("data_structures", "Data Structures & Algorithms", "Foundation", "Arrays, trees, graphs, dynamic programming, and complexity analysis.", "cpu"),
            ("pandas", "Pandas & Data Wrangling", "Foundation", "Data manipulation, cleansing, aggregations, and feature prep.", "table"),
            ("numpy", "NumPy & Numerical Computing", "Foundation", "Vectorization, linear algebra operations, tensor indexing, and broadcasting.", "grid"),
            ("machine_learning", "Supervised & Unsupervised ML", "Core ML", "Regression, classification, clustering, ensemble trees, and hyperparameter tuning.", "brain"),
            ("model_evaluation", "Model Evaluation & Validation", "Core ML", "Cross-validation, ROC-AUC, Precision-Recall curves, and bias-variance tradeoff.", "check-circle"),
            ("feature_engineering", "Feature Engineering", "Core ML", "Encoding, scaling, PCA, embeddings, and interaction features.", "layers"),
            ("deep_learning", "Deep Learning & PyTorch", "Advanced", "Neural network architectures, backpropagation, CNNs, RNNs, and custom training loops.", "network"),
            ("nlp", "Natural Language Processing", "Advanced", "Tokenization, TF-IDF, Word2Vec, BERT, and transformer fine-tuning.", "book-open"),
            ("transformers", "Transformers & LLMs", "Advanced", "Self-attention mechanism, decoder-only LLMs, prompt tuning, and RAG.", "sparkles"),
            ("computer_vision", "Computer Vision", "Advanced", "Image convolutions, YOLO object detection, image segmentation, and OpenCV.", "eye"),
            ("reinforcement_learning", "Reinforcement Learning", "Advanced", "Markov Decision Processes, Q-learning, Policy Gradients, and rewards.", "compass"),
            ("vector_databases", "Vector Databases & Search", "Advanced", "Embeddings indexing, HNSW, cosine similarity, Pinecone, and Chroma.", "search"),
            ("docker", "Docker & Containerization", "Deployment", "Containerizing model runtimes, Dockerfiles, and multi-stage builds.", "box"),
            ("apis", "FastAPI & REST APIs", "Deployment", "Building high-performance async prediction microservices and validation.", "server"),
            ("mlops", "MLOps & CI/CD", "Deployment", "Automated pipelines, MLflow experiment tracking, and model registry.", "git-branch"),
            ("cloud", "Cloud Deployment (GCP / AWS)", "Deployment", "Cloud Run, Kubernetes, serverless scaling, and cloud artifact registries.", "cloud"),
            ("monitoring", "Model Monitoring & Drift Detection", "Deployment", "Data drift, concept drift, latency logging, and alerting systems.", "activity"),
            ("git", "Git & Version Control", "Foundation", "Branching workflows, code review, semantic versioning, and CI triggers.", "git-pull-request"),
            ("javascript", "JavaScript & Web Fundamentals", "Foundation", "Modern JS ES6+, async/await, DOM APIs, and state handling.", "file-code"),
            ("react", "React & Frontend Architecture", "Foundation", "Component lifecycles, hooks, client state, and responsive UI.", "layout"),
            ("typescript", "TypeScript", "Foundation", "Type interfaces, generics, strict typing, and compile safety.", "shield")
        ]

        for s_id, s_name, s_cat, s_desc, s_icon in skills_data:
            skill = Skill(id=s_id, name=s_name, category=s_cat, description=s_desc, icon=s_icon)
            db.add(skill)

        # 2. Seed Courses (32 courses)
        courses_data = [
            ("c-python-mastery", "Python for Applied Machine Learning", "Comprehensive deep dive into vectorized Python, memory profiling, and clean code.", "Mentora Academy", "Intermediate", 720, "Foundation", ["Python", "NumPy"], ["Python Basics"], 4.9),
            ("c-statistics-core", "Applied Probability & Statistical Inference", "Master distributions, confidence intervals, p-values, and statistical power.", "MIT OpenCourseWare", "Intermediate", 600, "Foundation", ["Probability & Statistics"], ["Algebra"], 4.8),
            ("c-sql-advanced", "Advanced SQL & Analytical Modeling", "Master window functions, CTEs, indexing strategies, and database query optimization.", "Stanford Online", "Intermediate", 480, "Foundation", ["SQL & Relational DBs"], [], 4.8),
            ("c-pandas-wrangling", "Feature Engineering & Data Wrangling with Pandas", "Master exploratory data analysis, missing data imputation, and large-scale dataframes.", "Mentora Academy", "Beginner", 360, "Foundation", ["Pandas & Data Wrangling"], ["Python"], 4.7),
            ("c-ml-foundations", "Supervised Machine Learning: Regression & Classification", "From gradient descent to logistic regression and decision trees with Scikit-Learn.", "DeepLearning.AI", "Intermediate", 900, "Core ML", ["Supervised & Unsupervised ML"], ["Python", "Probability & Statistics"], 4.9),
            ("c-ml-ensembles", "Tree Ensembles, XGBoost & LightGBM Mastery", "Gradient boosting algorithms, regularization tuning, and competitive Kaggle techniques.", "Mentora Academy", "Intermediate", 540, "Core ML", ["Supervised & Unsupervised ML", "Feature Engineering"], ["Supervised ML"], 4.8),
            ("c-ml-eval", "Model Evaluation, Validation & Metrics Deep Dive", "Rigorous cross-validation, precision-recall curve analysis, calibration, and cost matrix.", "Coursera / DeepLearning.AI", "Intermediate", 360, "Core ML", ["Model Evaluation & Validation"], ["Machine Learning"], 4.8),
            ("c-pytorch-deep-dive", "Deep Learning Foundations with PyTorch", "Tensors, autograd, building neural architectures from scratch, and optimization algorithms.", "DeepLearning.AI", "Advanced", 1080, "Advanced", ["Deep Learning & PyTorch"], ["Python", "NumPy", "Machine Learning"], 4.9),
            ("c-transformers-llms", "Transformers, Self-Attention & LLM Architectures", "In-depth mathematical study and implementation of transformer blocks, tokens, and multi-head attention.", "Stanford Online", "Advanced", 960, "Advanced", ["Transformers & LLMs", "Natural Language Processing"], ["Deep Learning & PyTorch"], 4.9),
            ("c-nlp-essentials", "Applied Natural Language Processing", "Text preprocessing, embeddings, sentiment classification, and semantic search models.", "Mentora Academy", "Intermediate", 540, "Advanced", ["Natural Language Processing", "Vector Databases & Search"], ["Deep Learning & PyTorch"], 4.7),
            ("c-cv-vision", "Computer Vision with CNNs & PyTorch", "Convolutions, ResNet transfer learning, object detection, and data augmentations.", "Mentora Academy", "Advanced", 720, "Advanced", ["Computer Vision"], ["Deep Learning & PyTorch"], 4.7),
            ("c-vector-rag", "Vector Search & Retrieval-Augmented Generation (RAG)", "HNSW indexing, hybrid lexical/semantic search, chunking strategies, and re-ranking.", "Mentora Academy", "Advanced", 480, "Advanced", ["Vector Databases & Search", "Transformers & LLMs"], ["Transformers & LLMs"], 4.8),
            ("c-fastapi-microservices", "FastAPI for Real-time Machine Learning Inference", "Asynchronous endpoints, request validation, batch inference, and background tasks.", "Mentora Academy", "Intermediate", 420, "Deployment", ["FastAPI & REST APIs", "Python"], ["Python"], 4.8),
            ("c-docker-ml", "Docker & Containerization for ML Services", "Writing reproducible Dockerfiles, multi-stage caching, and GPU container acceleration.", "Docker Certified", "Intermediate", 360, "Deployment", ["Docker & Containerization"], ["FastAPI & REST APIs"], 4.8),
            ("c-mlops-pipelines", "Production MLOps, MLflow & Pipeline Automation", "Model registries, metadata tracking, CI/CD automated validation, and continuous deployment.", "Google Cloud Skills", "Advanced", 840, "Deployment", ["MLOps & CI/CD", "Docker & Containerization"], ["Docker & Containerization", "FastAPI & REST APIs"], 4.9),
            ("c-drift-monitoring", "Production Model Monitoring & Data Drift", "Detecting population drift, concept shift, latency anomalies, and Prometheus alerts.", "Mentora Academy", "Advanced", 360, "Deployment", ["Model Monitoring & Drift Detection"], ["MLOps & CI/CD"], 4.7),
            ("c-cloud-run-gcp", "Deploying Scalable Model APIs to Google Cloud Run", "Serverless container deployment, custom domain routing, secret management, and auto-scaling.", "Google Cloud", "Intermediate", 420, "Deployment", ["Cloud Deployment (GCP / AWS)"], ["Docker & Containerization"], 4.8),
            ("c-data-structures-py", "Algorithmic Problem Solving & Data Structures in Python", "Hash tables, graphs, trees, search algorithms, and space-time optimization.", "Mentora Academy", "Intermediate", 600, "Foundation", ["Data Structures & Algorithms"], ["Python"], 4.8),
            ("c-reinforcement-learning", "Reinforcement Learning & Policy Optimization", "Q-learning, deep Q-networks, actor-critic models, and policy gradients.", "UC Berkeley", "Advanced", 900, "Advanced", ["Reinforcement Learning"], ["Deep Learning & PyTorch"], 4.6),
            ("c-feature-store", "Modern Feature Stores & Data Pipelines", "Feast feature store setup, offline/online data consistency, and point-in-time joins.", "Mentora Academy", "Advanced", 360, "Deployment", ["Feature Engineering", "MLOps & CI/CD"], ["SQL & Relational DBs", "Docker & Containerization"], 4.7)
        ]

        for c_id, c_title, c_desc, c_prov, c_diff, c_dur, c_cat, c_skills, c_prereqs, c_rat in courses_data:
            course = Course(
                id=c_id, title=c_title, description=c_desc, provider=c_prov,
                difficulty=c_diff, duration_minutes=c_dur, category=c_cat,
                skills=c_skills, prerequisites=c_prereqs, rating=c_rat,
                lessons=[
                    {"title": f"1. Introduction to {c_title}", "duration": "15 min"},
                    {"title": f"2. Core Concepts & Practical Mechanics", "duration": "35 min"},
                    {"title": f"3. Hands-on Implementation Exercise", "duration": "45 min"},
                    {"title": f"4. Evaluation & Common Pitfalls", "duration": "30 min"},
                    {"title": f"5. Synthesis & Milestone Check", "duration": "20 min"}
                ]
            )
            db.add(course)

        # 3. Seed Projects (12 projects)
        projects_data = [
            ("p-churn-predictor", "End-to-End Customer Churn Prediction Engine", "Build an automated ML classifier with Scikit-Learn, XGBoost, and model calibration.", "Intermediate", 480, ["Python", "Supervised & Unsupervised ML", "Model Evaluation & Validation"], ["Python for Applied ML"], ["Trained XGBoost Pipeline", "Model Card & Evaluation Metrics", "Jupyter Benchmark Notebook"]),
            ("p-credit-risk", "Credit Default Risk Evaluation with Fair ML", "Train cross-validated risk models with Shapley feature importance and threshold tuning.", "Intermediate", 420, ["Probability & Statistics", "Supervised & Unsupervised ML"], ["Applied Probability & Statistics"], ["Risk Scorecard", "SHAP Explainability Plots", "Threshold Optimizer"]),
            ("p-rag-assistant", "Production RAG Document Search Assistant", "Build a hybrid lexical/vector search pipeline using ChromaDB, embeddings, and FastAPI.", "Advanced", 600, ["Transformers & LLMs", "Vector Databases & Search", "FastAPI & REST APIs"], ["Deep Learning Foundations with PyTorch"], ["FastAPI Query Endpoint", "Vector Chunking Pipeline", "Evaluation Matrix"]),
            ("p-vision-classifier", "Industrial Defect Detection System with PyTorch", "Fine-tune ResNet-50 for high-precision real-time industrial anomaly classification.", "Advanced", 540, ["Computer Vision", "Deep Learning & PyTorch"], ["Deep Learning Foundations with PyTorch"], ["PyTorch Custom Model", "ONNX Export", "Confusion Matrix Analysis"]),
            ("p-mlops-ci-cd", "Continuous ML Pipeline with MLflow & Docker", "Automate training runs on GitHub Actions with containerized inference on Cloud Run.", "Advanced", 720, ["Docker & Containerization", "MLOps & CI/CD", "FastAPI & REST APIs", "Cloud Deployment (GCP / AWS)"], ["Docker for ML Services", "FastAPI for ML"], ["Dockerfile & CI/CD YAML", "MLflow Run Artifacts", "Live Health & Predict Endpoint"]),
            ("p-time-series-forecasting", "Demand Forecasting Engine with LightGBM", "Multi-step time-series forecasting with rolling statistical features and lag variables.", "Intermediate", 360, ["Pandas & Data Wrangling", "Supervised & Unsupervised ML"], ["Python for Applied ML"], ["Lag Feature Generator", "Forecast Plots & MAPE Score", "Automated Retraining Script"])
        ]

        for p_id, p_title, p_desc, p_diff, p_dur, p_skills, p_prereqs, p_deliv in projects_data:
            project = Project(
                id=p_id, title=p_title, description=p_desc, difficulty=p_diff,
                estimated_minutes=p_dur, skills=p_skills, prerequisites=p_prereqs,
                deliverables=p_deliv
            )
            db.add(project)

        # 4. Seed Assessments (12 assessments)
        assessments_data = [
            (
                "a-stats-check",
                "Applied Statistics & Probability Diagnostic",
                "Validate your foundation in variance, p-values, Bayes Theorem, and hypothesis testing.",
                "statistics",
                "Intermediate",
                25,
                [
                    {
                        "id": "q1",
                        "question": "What is the primary risk of using Mean Squared Error (MSE) on datasets with severe outliers compared to Mean Absolute Error (MAE)?",
                        "options": ["MSE underestimates small residual errors", "MSE heavily penalizes large errors quadratically, skewing parameter optimization", "MSE cannot be differentiated analytically", "MSE ignores negative values completely"],
                        "correctIndex": 1,
                        "explanation": "Because MSE squares the residuals, large outlier errors dominate the loss function quadratically and pull regression weights disproportionately toward outliers."
                    },
                    {
                        "id": "q2",
                        "question": "Under what condition is Precision a more critical evaluation metric than Recall?",
                        "options": ["When the cost of False Positives is significantly higher than False Negatives (e.g. spam detection)", "When False Negatives carry catastrophic risk (e.g. cancer diagnosis)", "When class distribution is exactly 50/50", "When accuracy is higher than 95%"],
                        "correctIndex": 0,
                        "explanation": "Precision measures TP / (TP + FP). When False Positives are expensive (like misclassifying important emails as spam), maximizing Precision is paramount."
                    },
                    {
                        "id": "q3",
                        "question": "What does a p-value of 0.03 indicate when testing a null hypothesis at alpha = 0.05?",
                        "options": ["The probability that the alternative hypothesis is false is 3%", "The probability of observing results at least as extreme under the null hypothesis is 3%, so we reject the null hypothesis", "The null hypothesis has a 97% chance of being true", "The effect size is exactly 0.03"],
                        "correctIndex": 1,
                        "explanation": "The p-value is the probability of observing data at least as extreme assuming H0 is true. Since 0.03 < 0.05, we reject the null hypothesis."
                    },
                    {
                        "id": "q4",
                        "question": "In Bayesian inference, what represents the updated belief after observing new empirical evidence?",
                        "options": ["Prior Probability", "Likelihood Function", "Posterior Probability", "Marginal Evidence"],
                        "correctIndex": 2,
                        "explanation": "The Posterior Probability P(A|B) = P(B|A)P(A) / P(B) represents the updated belief after observing evidence B."
                    }
                ]
            ),
            (
                "a-ml-algorithms",
                "Machine Learning Core Mechanics & Gradient Descent",
                "Assess your command over cost functions, loss gradients, bias-variance tradeoffs, and regularization.",
                "machine_learning",
                "Intermediate",
                30,
                [
                    {
                        "id": "q1",
                        "question": "How does L1 (Lasso) regularization fundamentally differ in weight shrinkage behavior from L2 (Ridge) regularization?",
                        "options": ["L1 drives non-informative weights strictly to zero, inducing feature sparsity, while L2 shrinks weights asymptotically toward zero", "L2 causes sparsity while L1 increases model variance", "L1 is computationally cheaper for matrix inversions", "L2 ignores collinearity"],
                        "correctIndex": 0,
                        "explanation": "L1 penalty adds absolute value of coefficients (|w|), whose sharp geometric diamond boundaries cause weights to hit zero exactly, performing automatic feature selection."
                    },
                    {
                        "id": "q2",
                        "question": "In Gradient Boosted Trees (e.g. XGBoost), what does each successive decision tree explicitly fit?",
                        "options": ["The original target y with random bootstrap weights", "The negative gradient / pseudo-residuals of the existing ensemble loss", "The feature matrix eigenvectors", "A randomly subsetted classification threshold"],
                        "correctIndex": 1,
                        "explanation": "Gradient boosting fits each new tree to the negative gradient (residuals) of the loss function evaluated at the current ensemble predictions."
                    },
                    {
                        "id": "q3",
                        "question": "If your training loss continues to decrease to near-zero but validation loss diverges upward after epoch 20, what is happening?",
                        "options": ["Underfitting", "Overfitting (High Variance)", "High Bias", "Vanishing Gradient"],
                        "correctIndex": 1,
                        "explanation": "A widening gap between falling training loss and rising validation loss is the classic diagnostic signature of overfitting (high variance)."
                    }
                ]
            ),
            (
                "a-deep-learning-pytorch",
                "Deep Learning & PyTorch Tensor Mechanics",
                "Evaluate neural network backpropagation, custom loss functions, and PyTorch autograd graph behavior.",
                "deep_learning",
                "Advanced",
                30,
                [
                    {
                        "id": "q1",
                        "question": "Why is `optimizer.zero_grad()` called before `loss.backward()` in a standard PyTorch training loop?",
                        "options": ["To reset model weights to random values", "Because PyTorch accumulates gradients in `.grad` buffers by default", "To clear GPU VRAM cache", "To detach the computation graph from RAM"],
                        "correctIndex": 1,
                        "explanation": "In PyTorch, gradients accumulate by default so multiple backward passes can be summed. Calling zero_grad() prevents mixing gradients across batches."
                    },
                    {
                        "id": "q2",
                        "question": "What is the key structural advancement of the Transformer self-attention mechanism over recurrent LSTM layers?",
                        "options": ["It processes entire sequences in parallel with O(1) path length between tokens, eliminating recurrent sequential bottlenecks", "It requires 90% less memory for long context windows", "It does not require positional encodings", "It only operates on convolutional feature maps"],
                        "correctIndex": 0,
                        "explanation": "Self-attention computes token-to-token compatibility simultaneously across all positions, enabling massive parallelization during training unlike step-by-step RNN recurrence."
                    }
                ]
            )
        ]

        for a_id, a_title, a_desc, a_skill, a_diff, a_dur, a_qs in assessments_data:
            assessment = Assessment(
                id=a_id, title=a_title, description=a_desc, skill_id=a_skill,
                difficulty=a_diff, duration_minutes=a_dur, questions=a_qs
            )
            db.add(assessment)

        # 5. Seed Achievements (10 achievements)
        achievements_data = [
            ("ach-first-step", "First Milestone Unlocked", "Completed your very first learning module with distinction.", "award", "complete_first_lesson"),
            ("ach-streak-7", "Weekly Momentum (7 Days)", "Maintained unbroken daily study consistency for 7 consecutive days.", "flame", "streak_7"),
            ("ach-streak-14", "Fortnight Discipline (14 Days)", "Maintained unbroken daily study consistency for 14 consecutive days.", "zap", "streak_14"),
            ("ach-stats-master", "Statistical Rigor", "Achieved 85%+ score on advanced statistical diagnostics.", "bar-chart-2", "stats_score_85"),
            ("ach-phase-1", "Phase 1 Foundations Complete", "Successfully mastered all core prerequisites in Phase 1.", "check-circle-2", "phase_1_complete"),
            ("ach-project-first", "Applied Builder", "Completed and evaluated your first production-ready portfolio project.", "box", "first_project"),
            ("ach-adaptive-shift", "Curriculum Accelerated", "Earned a dynamic roadmap recalibration by demonstrating advanced mastery.", "sparkles", "first_adaptation"),
            ("ach-hours-50", "50 Hours of Deep Work", "Logged over 50 verified hours of hands-on coding and conceptual study.", "clock", "hours_50")
        ]

        for ach_id, ach_name, ach_desc, ach_icon, ach_crit in achievements_data:
            ach = Achievement(id=ach_id, name=ach_name, description=ach_desc, icon=ach_icon, criteria=ach_crit)
            db.add(ach)

        db.flush()

        # 6. Seed Demo User Alex Morgan
        demo_user = User(
            id="usr-alex-morgan-001",
            name="Alex Morgan",
            email="demo@learnora.app",
            password_hash=get_password_hash("Demo@12345"),
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        )
        db.add(demo_user)
        db.flush()

        # Profile for Alex
        demo_profile = LearnerProfile(
            id="prof-alex-001",
            user_id=demo_user.id,
            experience_level="intermediate",
            daily_available_minutes=90,
            learning_style=["hands-on", "visual", "interactive"],
            career_goal="Machine Learning Engineer",
            target_date="2027-04-30",
            bio="Aspiring Machine Learning Engineer with 2 years of Python backend experience transitioning into predictive modeling, PyTorch deep learning, and MLOps.",
            current_streak=12
        )
        db.add(demo_profile)

        # Seed Alex's Initial Skills
        user_skills_data = [
            ("python", 82, 90, 0.9, "High", "Core programming foundation essential for PyTorch and data manipulation.", "Mastery level is high; focuses on advanced performance profiling."),
            ("sql", 70, 85, 0.8, "High", "Critical for extracting training datasets and analytical modeling.", "Solid query comprehension; ready for complex windowing tasks."),
            ("statistics", 48, 80, 0.65, "High", "Critical prerequisite for model evaluation, Bayesian tuning, and statistical power.", "Identified as primary foundation gap before deep learning."),
            ("machine_learning", 42, 85, 0.6, "High", "Core requirement for ML Engineer role; covers ensembles, loss metrics, and validation.", "Rapidly progressing through supervised ensembles."),
            ("deep_learning", 25, 80, 0.5, "High", "Required for neural architectures, embeddings, and transformer fine-tuning.", "Queued for Phase 3 after mastering statistical foundations."),
            ("mlops", 15, 75, 0.4, "Medium", "Mandatory for containerized deployment, CI/CD, and model monitoring.", "Queued for Phase 4 production stage."),
            ("pandas", 78, 85, 0.85, "Medium", "Fast dataframe manipulations and feature engineering.", "High proficiency."),
            ("numpy", 74, 85, 0.8, "Medium", "Vectorized math and matrix operations.", "Strong numerical grasp.")
        ]

        for s_id, cur, tgt, conf, prio, why, insight in user_skills_data:
            ls = LearnerSkill(
                id=f"ls-{demo_user.id}-{s_id}",
                user_id=demo_user.id,
                skill_id=s_id,
                current_level=cur,
                target_level=tgt,
                confidence=conf,
                priority=prio,
                why_it_matters=why,
                ai_insight=insight,
                last_assessed_at=datetime.now(timezone.utc) - timedelta(days=2)
            )
            db.add(ls)

        # 7. Seed Learning Path for Alex
        learning_path = LearningPath(
            id="lp-alex-mle-001",
            user_id=demo_user.id,
            goal="Machine Learning Engineer",
            target_date="2027-04-30",
            estimated_weeks=32,
            status="active",
            is_adapted=True,
            adaptation_reason="Accelerated Phase 1 based on 88% Statistics Foundation diagnostic."
        )
        db.add(learning_path)
        db.flush()

        # Phases
        phase1 = LearningPhase(
            id="phase-1-foundations",
            learning_path_id=learning_path.id,
            phase_number=1,
            title="Statistical Foundations & Feature Engineering",
            description="Bridge prerequisite gaps in probability, mathematical foundations, and rigorous data manipulation.",
            order_index=1,
            timeframe="Weeks 1–6 (Accelerated: 4.5 wks)",
            original_timeframe="Weeks 1–6",
            estimated_weeks=5,
            status="in_progress",
            is_adapted=True,
            adaptation_note="Pacing accelerated after high score on Statistics Foundation Check.",
            milestone={
                "title": "Statistical Diagnostic & Feature Baseline",
                "badge": "Foundation Master",
                "description": "Demonstrate fluency in statistical validation and cross-validation mechanics.",
                "completed": True
            }
        )
        phase2 = LearningPhase(
            id="phase-2-core-ml",
            learning_path_id=learning_path.id,
            phase_number=2,
            title="Supervised Algorithms, Ensembles & Evaluation",
            description="Deep dive into tree-based ensembles, gradient boosting mechanics, metric calibration, and feature importance.",
            order_index=2,
            timeframe="Weeks 7–14",
            original_timeframe="Weeks 7–14",
            estimated_weeks=8,
            status="in_progress",
            is_adapted=False,
            milestone={
                "title": "Customer Churn Prediction Engine",
                "badge": "Ensemble Practitioner",
                "description": "Build, calibrate, and explain an end-to-end XGBoost classifier with SHAP interpretability.",
                "completed": False
            }
        )
        phase3 = LearningPhase(
            id="phase-3-deep-learning",
            learning_path_id=learning_path.id,
            phase_number=3,
            title="Deep Learning Architectures, PyTorch & Transformers",
            description="Neural networks from scratch, backpropagation, attention mechanisms, embeddings, and transformer fine-tuning.",
            order_index=3,
            timeframe="Weeks 15–24",
            original_timeframe="Weeks 15–24",
            estimated_weeks=10,
            status="upcoming",
            is_adapted=False,
            milestone={
                "title": "Domain-Specific RAG Assistant",
                "badge": "Deep Learning Builder",
                "description": "Construct a hybrid vector search and retrieval-augmented generation engine with PyTorch embeddings.",
                "completed": False
            }
        )
        phase4 = LearningPhase(
            id="phase-4-production-mlops",
            learning_path_id=learning_path.id,
            phase_number=4,
            title="Production MLOps, CI/CD & Cloud Deployment",
            description="FastAPI model microservices, Docker containerization, automated GitHub CI/CD, and model drift monitoring.",
            order_index=4,
            timeframe="Weeks 25–32",
            original_timeframe="Weeks 25–32",
            estimated_weeks=8,
            status="upcoming",
            is_adapted=False,
            milestone={
                "title": "Live Model Registry & Automated CI/CD on Cloud Run",
                "badge": "Production Engineer",
                "description": "Deploy an auto-scaling prediction microservice with Prometheus drift monitoring and automated retraining.",
                "completed": False
            }
        )

        db.add_all([phase1, phase2, phase3, phase4])
        db.flush()

        # Learning Items for Phase 1 & 2
        items = [
            LearningItem(id="item-c-stat-core", phase_id=phase1.id, type="course", resource_id="c-statistics-core", title="Applied Probability & Statistical Inference", order_index=1, estimated_minutes=600, status="completed"),
            LearningItem(id="item-a-stats-check", phase_id=phase1.id, type="assessment", resource_id="a-stats-check", title="Applied Statistics & Probability Diagnostic", order_index=2, estimated_minutes=25, status="completed"),
            LearningItem(id="item-c-ml-foundations", phase_id=phase2.id, type="course", resource_id="c-ml-foundations", title="Supervised Machine Learning: Regression & Classification", order_index=1, estimated_minutes=900, status="completed"),
            LearningItem(id="item-c-ml-ensembles", phase_id=phase2.id, type="course", resource_id="c-ml-ensembles", title="Tree Ensembles, XGBoost & LightGBM Mastery", order_index=2, estimated_minutes=540, status="in_progress"),
            LearningItem(id="item-c-ml-eval", phase_id=phase2.id, type="course", resource_id="c-ml-eval", title="Model Evaluation, Validation & Metrics Deep Dive", order_index=3, estimated_minutes=360, status="not_started"),
            LearningItem(id="item-p-churn", phase_id=phase2.id, type="project", resource_id="p-churn-predictor", title="Customer Churn Prediction Engine", order_index=4, estimated_minutes=480, status="in_progress"),
            LearningItem(id="item-a-ml-algos", phase_id=phase2.id, type="assessment", resource_id="a-ml-algorithms", title="Machine Learning Core Mechanics & Gradient Descent", order_index=5, estimated_minutes=30, status="not_started")
        ]
        db.add_all(items)
        db.flush()

        # Seed Progress Records
        progress_data = [
            Progress(id="prog-1", user_id=demo_user.id, learning_item_id="item-c-stat-core", progress_percent=100, completed=True, time_spent_minutes=580, completed_at=datetime.now(timezone.utc) - timedelta(days=5)),
            Progress(id="prog-2", user_id=demo_user.id, learning_item_id="item-a-stats-check", progress_percent=100, completed=True, time_spent_minutes=25, completed_at=datetime.now(timezone.utc) - timedelta(days=4)),
            Progress(id="prog-3", user_id=demo_user.id, learning_item_id="item-c-ml-foundations", progress_percent=100, completed=True, time_spent_minutes=850, completed_at=datetime.now(timezone.utc) - timedelta(days=2)),
            Progress(id="prog-4", user_id=demo_user.id, learning_item_id="item-c-ml-ensembles", progress_percent=60, completed=False, time_spent_minutes=320),
            Progress(id="prog-5", user_id=demo_user.id, learning_item_id="item-p-churn", progress_percent=45, completed=False, time_spent_minutes=210)
        ]
        db.add_all(progress_data)

        # Seed User Achievements
        user_achievements = [
            UserAchievement(id="ua-1", user_id=demo_user.id, achievement_id="ach-first-step", earned_at=datetime.now(timezone.utc) - timedelta(days=10)),
            UserAchievement(id="ua-2", user_id=demo_user.id, achievement_id="ach-streak-7", earned_at=datetime.now(timezone.utc) - timedelta(days=5)),
            UserAchievement(id="ua-3", user_id=demo_user.id, achievement_id="ach-stats-master", earned_at=datetime.now(timezone.utc) - timedelta(days=4)),
            UserAchievement(id="ua-4", user_id=demo_user.id, achievement_id="ach-phase-1", earned_at=datetime.now(timezone.utc) - timedelta(days=3)),
            UserAchievement(id="ua-5", user_id=demo_user.id, achievement_id="ach-adaptive-shift", earned_at=datetime.now(timezone.utc) - timedelta(days=1))
        ]
        db.add_all(user_achievements)

        # Seed Initial Recommendations with transparent scoring model
        recs = [
            Recommendation(
                id="rec-1", user_id=demo_user.id, resource_type="course", resource_id="c-ml-ensembles",
                score=94.0, reason="High priority: addresses current Ensemble gap (42% -> 85%) directly aligned with ML Engineer roadmap.",
                goal_score=5.0, gap_score=5.0, prereq_score=5.0, style_score=4.5, time_score=4.5
            ),
            Recommendation(
                id="rec-2", user_id=demo_user.id, resource_type="course", resource_id="c-ml-eval",
                score=91.0, reason="Addresses evaluation and validation metrics before you complete Phase 2 milestone project.",
                goal_score=4.8, gap_score=4.5, prereq_score=5.0, style_score=4.0, time_score=5.0
            ),
            Recommendation(
                id="rec-3", user_id=demo_user.id, resource_type="project", resource_id="p-churn-predictor",
                score=96.0, reason="Hands-on portfolio deliverable synthesizing XGBoost, cross-validation, and SHAP explainability.",
                goal_score=5.0, gap_score=5.0, prereq_score=4.8, style_score=5.0, time_score=4.0
            )
        ]
        db.add_all(recs)

        # Seed Initial Welcome Chat Message
        welcome_msg = ChatMessage(
            id="msg-welcome-001",
            user_id=demo_user.id,
            role="ai",
            message="Hi Alex! 👋 I'm your **Mentora** learning companion. I'm actively tracking your trajectory to become a **Machine Learning Engineer**.\n\nYour recent 88% diagnostic score in Statistics accelerated your Phase 1 schedule by 5 days. How can I help you tackle today's XGBoost lessons?",
            created_at=datetime.now(timezone.utc) - timedelta(hours=2)
        )
        db.add(welcome_msg)

        db.commit()
        print("Database successfully seeded with demo user Alex Morgan and initial curriculum state.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
