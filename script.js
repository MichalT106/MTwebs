// Language management
const translations = {
    en: {
        "hero.title": "Welcome to my portfolio",
        "hero.subtitlePrefix": "Showcasing my",
        "hero.projects": "School Projects",
        "hero.experience": "Work Experience",
        "hero.subtitleMiddle": " & ",
        "hero.cv": "See CV",
        "school.title": "School Projects",
        "school.carousel.hint": "Swipe or use arrows to explore",
        "school.carousel.prev": "Previous project",
        "school.carousel.next": "Next project",
        "experience.title": "Work Experience",
        "experience.current": "Current",
        "experience.previous": "Previous",
        "experience.viewDetails": "View details →",
        "nav.home": "Home",
        "nav.school": "School Projects",
        "nav.experience": "Work Experience",
        "nav.cv": "CV",
        "footer.links": "Quick Links",
        "footer.contact": "Contact",


        "experience.job1.position": "Position",
        "experience.job1.period": "July 2023 – August 2025",
        "experience.job1.title": "Software & DevOps Engineer",
        "experience.job1.company": "Webasto Convertibles Slovakia s.r.o.",
        "experience.job1.location": "Košice, Slovak Republic",
        "experience.details.title": "Experience Details",
        "experience.details.period": "Period",
        "experience.details.company": "Company",
        "experience.details.location": "Location",

        "experience.job2.position": "Position",
        "experience.job2.period": "February 2026 – Present",
        "experience.job2.title": "Data Engineer",
        "experience.job2.company": "BuiltMind s.r.o.",
        "experience.job2.location": "Home Office",

        "experience.job2.details.intro.title": "Role overview",
        "experience.job2.details.intro.text": "I work on automated collection of real-estate and market data using UiPath workflows and Python-based scrapers. For more complex or unsupported websites, I implement scraping logic in Python (APIs, requests, BeautifulSoup) and deploy it as AWS Lambda functions, with results integrated into downstream data pipelines.",

        "experience.job2.details.keyResponsibilities.title": "Key responsibilities",
        "experience.job2.details.keyResponsibilities.item1": "Implement new scraping projects and data pipelines for real-estate and market analytics.",
        "experience.job2.details.keyResponsibilities.item2": "Maintain and fix existing scrapers when websites change, including selectors, parsing rules, and anti-bot workarounds.",
        "experience.job2.details.keyResponsibilities.item3": "Upload and manage UiPath automation workflows in UiPath Orchestrator and run scheduled jobs reliably.",
        "experience.job2.details.keyResponsibilities.item4": "Monitor data quality and consistency in the database and correct issues to keep analytics and graphs accurate.",
        "experience.job2.details.keyResponsibilities.item5": "Update historical data when required to ensure long-term correctness of reports.",
        "experience.job2.details.keyResponsibilities.item6": "Participate in testing of new application releases.",

        "experience.job2.details.tech.title": "Technologies & tooling",
        "experience.job2.details.tech.subtitle": "Main focus: automated data collection, parsing, orchestration scheduling, and data quality monitoring.",
        "experience.job2.details.sideNote": "This role is ongoing.",

        "school.project1.title": "Game Jam Košice — Game Days",
        "school.project1.subtitle": "48-hour game jam (journalism theme) — Call For Justice",
        "school.project1.desc": "48-hour game challenge",
        "school.project1.tag1": "Unity",
        "school.project1.tag2": "C#",
        "school.project1.tag3": "2D Game Development",
        "school.project1.tag4": "Rapid Prototyping",
        "school.project1.imageAlt": "Game Days — Call For Justice project preview",

        "school.project2.title": "CarInsight – Live IT Projects TUKE",
        "school.project2.desc": "Vehicle management app",
        "school.project2.tag1": "React Native",
        "school.project2.tag2": "FastAPI",
        "school.project2.tag3": "PostgreSQL",
        "school.project2.tag4": "AWS Cognito",
        "school.project2.tag5": "DynamoDB",
        "school.project2.tag6": "Docker",
        "school.project1.cta": "View details",
        "school.project2.cta": "View details",
        "school.project3.cta": "View details",

        "school.project3.title": "Detection of Formal Errors in Final Theses using XML Technologies",
        "school.project3.desc": "Diploma thesis",
        "school.project3.tag1": "LaTeXML",
        "school.project3.tag2": "Python + SaxonC",
        "school.project3.tag3": "GitLab CI/CD",
        "school.project3.tag4": "Docker",
        "school.project3.tag5": "XML + XPath",
        "school.project3.tag6": "LaTeX",
        "school.project2.imageAlt": "CarInsight — project poster",
        "school.project3.imageAlt": "Diploma thesis — LaTeX/XML formal error detection toolchain",


        // ====== ADDED: Experience details (EN) ======
        "experience.details.intro.title": "Role overview",
        "experience.details.intro.text": "I worked as a Software & DevOps Engineer, focusing on internal developer enablement and CI automation. I created and maintained extensive GitLab Wiki documentation and later built a full Polyspace static analysis workflow in Jenkins (Bug Finder and Code Prover), from configuration and filtering to exporting results and publishing reports.",

        "experience.details.keyResponsibilities.title": "Key responsibilities",
        "experience.details.keyResponsibilities.item1": "Create and maintain internal GitLab Wiki documentation for development processes, pipelines, and tooling.",
        "experience.details.keyResponsibilities.item2": "Implement Polyspace static analysis in Jenkins pipelines (Bug Finder and Code Prover) with project- and variant-based configuration.",
        "experience.details.keyResponsibilities.item3": "Design continuous jobs for fast analysis of changed files with concise summaries for Merge Requests, and nightly jobs for full-project analysis with detailed results.",
        "experience.details.keyResponsibilities.item4": "Provide ongoing Polyspace support: troubleshooting, output optimization, and keeping automation stable across projects; occasionally build small helper tools and scripts.",

        "experience.details.polyspace.title": "Polyspace in Jenkins (Bug Finder & Code Prover)",
        "experience.details.polyspace.intro": "The goal was to give developers quick, relevant feedback during Merge Requests, while also running deeper full-project verification regularly. The pipelines were structured around variants, robust source filtering, and clear outputs (artifacts, reports, and server uploads).",

        "experience.details.polyspace.continuous.title": "Continuous job (Merge Requests)",
        "experience.details.polyspace.continuous.item1": "Detect changed files by comparing the Merge Request branch against main and store the list for later filtering.",
        "experience.details.polyspace.continuous.item2": "Analyze only valid changed .c/.cpp files that are present in the variant's compile_commands.json, while excluding configured folders to avoid noise.",
        "experience.details.polyspace.continuous.item3": "Run Polyspace Bug Finder for fast feedback (Code Prover intentionally skipped to keep runtime low).",
        "experience.details.polyspace.continuous.item4": "Export results to CSV and SARIF, normalize SARIF paths with a script, generate a human-readable summary, and post it as a Merge Request comment; archive artifacts for download.",

        "experience.details.polyspace.nightly.title": "Nightly job (full analysis)",
        "experience.details.polyspace.nightly.item1": "Run full analysis across predefined variants, not limited to changed files.",
        "experience.details.polyspace.nightly.item2": "Execute both Bug Finder and Code Prover per variant, with parallel processing and consistent preprocessing configuration.",
        "experience.details.polyspace.nightly.item3": "Upload results to Polyspace Access in a structured hierarchy by variant and tool for team-wide browsing and review.",
        "experience.details.polyspace.nightly.item4": "Generate HTML reports from selected templates and export standardized CSV/SARIF outputs, then package and publish the outputs as Jenkins artifacts.",

        "experience.details.polyspace.implementation.title": "Implementation details",
        "experience.details.polyspace.implementation.item2": "Generate .psopts files via polyspace-configure and apply exclude-sources patterns to remove third-party / generated / irrelevant code from analysis sources.",
        "experience.details.polyspace.implementation.item3": "Handle cases where excluded folders still appear in preprocessing options by building a custom -do-not-generate-results-for argument (derived from .psopts content).",
        "experience.details.polyspace.implementation.item4": "Patch configurations for specific compiler environments (e.g., Green Hills) by adding stub include paths required for preprocessing.",
        "experience.details.polyspace.implementation.item5": "Configure analysis for interrupt handling and project-specific preprocessing (macros and interrupt enable/disable routines).",
        "experience.details.polyspace.implementation.item6": "Document safe usage of Polyspace code annotations as a last resort, with clear status/severity and justification comments for traceability.",

        "experience.details.support.title": "Polyspace support & troubleshooting",
        "experience.details.support.item1": "Diagnose and fix pipeline issues (configuration, missing sources/options, preprocessing problems, tool invocation errors).",
        "experience.details.support.item2": "Improve signal-to-noise by refining exclusions, filtering logic, and report/export outputs so results are actionable.",
        "experience.details.support.item3": "Help developers consume results effectively (Jenkins artifacts, Polyspace Access browsing, SARIF workflows in VS Code) and keep documentation up to date.",

        "experience.details.tech.title": "Technologies & tooling",
        "experience.details.tech.subtitle": "Main focus: CI/CD automation, static analysis integration, reporting/export workflows, and internal documentation.",




        // ====== ADDED / UPDATED: GameDays – Call For Justice ======
        "project1.title": "Call For Justice",

        // --- EVENT ---
        "project1.eventPrefix": "Created during ",
        "project1.eventLink": "GameDays (Game Jam Košice)",
        "project1.eventSuffix": ", an event I took part in as part of a university course.",
        "project1.eventIntro": "GameDays is a 48-hour game development challenge where a small team has to design and build a playable game around a given them, from idea, through implementation, to a final build.",

        // --- OVERVIEW ---
        "project1.overview.h": "Project overview",
        "project1.overview.p1": "In our year, the theme was journalism. Call For Justice is a 2D story-driven adventure made in Unity, where you play an investigative journalist trapped in a web of lies, corruption, and betrayal.",
        "project1.overview.p2": "You explore the city, talk to characters, gather clues, and progress through movement on the map, interactions, and short mini-games that push the narrative forward while the mafia closes in.",

        // --- CONTRIBUTION ---
        "project1.contribution.h": "My contribution",
        "project1.contribution.li1": "Implemented character movement and basic animation logic on the overworld map (controller + Animator).",
        "project1.contribution.li2": "Designed, implemented, and integrated several mini-games used throughout the story progression.",
        "project1.contribution.li3": "Worked with the team on rapid iteration, debugging, and polishing gameplay under strict 48-hour time limits.",

        // --- LEARNED ---
        "project1.learned.h": "What I gained",
        "project1.learned.li1": "Better teamwork in a small team: communication and task distribution.",
        "project1.learned.li2": "Faster thinking and decision-making under time pressure.",
        "project1.learned.li3": "A clearer overview of the full game dev process (idea → prototype → implementation → integration → release build) in a short timeframe.",

        "project1.meta.stackLabel": "Technologies",
        // --- LINKS ---
        "project1.links.h": "Links",
        "project1.links.itch": "Play / view on Itch.io",
        "project1.links.youtube": "Watch gameplay on YouTube",
        "project1.links.gamedays": "About the GameDays event",

        // --- MEDIA ---
        "project1.media.video": "Gameplay video",
        "project1.media.gallery": "Screenshots",

// ===== UPDATED: CarInsight texts (EN) =====

        "project2.media.video": "Video presentation",
        // --- EVENT ---
        "project2.eventPrefix": "Presented at ",
        "project2.eventLink": "Live IT Projects TUKE (Živé IT projekty)",
        "project2.eventSuffix": " as Team #43 in cooperation with Solar Turbines Slovakia (Caterpillar).",

        "project2.eventIntro":
        "Live IT Projects is a team-based university course where student teams work with an industry partner to scope requirements, implement a working prototype, and present results publicly.",

        // --- OVERVIEW ---
        "project2.overview.h": "Project overview",
        "project2.overview.p1":
        "CarInsight is a mobile app for managing multiple vehicles and their lifecycle data from a single account.",

        "project2.overview.p2":
        "The app stores vehicle records and time‑based events (STK/EK, insurance, vignette, service intervals), renders them in a calendar, and sends reminders via push notifications.",

        // --- VERSION 1 ---
        "project2.version1.h": "First version – Team project (monolith)",

        "project2.version1.li1": "The backend was implemented as a monolithic FastAPI application, where a single server exposed all REST endpoints for users, vehicles, service insights, and calendar features.",
        "project2.version1.li2": "The application followed a layered structure: the FastAPI HTTP layer handled client requests, the business logic implemented application rules, and SQLAlchemy ORM managed database access.",
        "project2.version1.li3": "Data was stored in a PostgreSQL relational database, with entities such as User, Car, Insight, and PushToken.",
        "project2.version1.li4": "Authentication was handled using stateless JWT tokens issued during login and validated on each request through FastAPI security dependencies.",
        "project2.version1.li5": "Background tasks were executed using APScheduler, periodically checking service intervals and triggering push notifications when required.",
        "project2.version1.li6": "Vehicle images were stored on the server’s local filesystem and made available to the client through a FastAPI static route.",
        "project2.version1.li7": "The application integrated external services, including the NHTSA VPIC VIN decoder to automatically pre-fill vehicle details and the Expo push service for notification delivery.",
        "project2.version1.li8": "The backend was packaged into a Docker container and executed using the Uvicorn ASGI server.",

        // --- VERSION 1 TECH ---
        "project2.version1.tech":
        "Key technologies:",

        // --- VERSION 2 ---
        "project2.version2.h": "Cloud version – Distributed backend (microservices)",

        "project2.version2.li1": "The backend was refactored into a distributed architecture, where the application was split into multiple independent FastAPI microservices, each running in its own Docker container.",
        "project2.version2.li2": "Each service had a clearly defined responsibility – the User Service handled authentication, the Car Service managed vehicles and images, the Insight Service processed maintenance records, and cache/proxy services improved read performance.",
        "project2.version2.li3": "Authentication was delegated to AWS Cognito User Pools, while each service validated incoming JWT tokens using public keys provided via JWKS.",
        "project2.version2.li4": "Data persistence was migrated to DynamoDB, using global secondary indexes to efficiently query data by user or vehicle.",
        "project2.version2.li5": "Vehicle images were stored in Amazon S3, with the backend storing and returning public URLs to the client.",
        "project2.version2.li6": "Redis cache proxy services were introduced to speed up read operations using read-through caching with TTL and write-based invalidation.",
        "project2.version2.li7": "Inter-service communication was implemented using HTTP calls, with authorization headers propagated between services and requests routed through AWS Application Load Balancers.",
        "project2.version2.li8": "Service configuration was handled through environment variables, while access to AWS services was managed using the AWS SDK (boto3).",

        // --- VERSION 2 TECH ---
        "project2.version2.tech":
        "Key technologies:",

        // --- LEARNED ---
        "project2.learned.h": "What I gained",

        "project2.learned.li1":
        "Hands-on experience with teamwork and collaborative software development based on real client requirements.",

        "project2.learned.li2":
        "A practical perspective on software development, including team work organization, iterative development, and communication with people responsible for the project requirements.",

        "project2.learned.li3":
        "Experience with transforming a centralized system into a cloud-based distributed architecture and working with AWS services.",

        "project2.meta.stackLabel": "Technologies",

        "project2.links.event": "About the Live IT Projects event",
        "project2.links.youtube": "Watch presentation on YouTube",
        "project2.links.repo1": "Repository – Team Project version",
        "project2.links.repo2": "Repository – Cloud Systems version",

        // ====== ADDED: Diploma thesis – Formal error detection (EN) ======
        "project3.title": "Detection of Formal Errors in Final Theses using XML Technologies",

        "project3.eventPrefix": "Diploma thesis topic: ",
        "project3.eventTitle": "Detection of Formal Errors in Final Theses using XML Technologies",
        "project3.eventSuffix": ".",
        "project3.eventIntro": "The goal was to bring repeatable, automation-friendly validation to LaTeX theses by converting sources into structured XML and evaluating an extensible set of rules in CI/CD and locally.",

        "project3.overview.h": "Project overview",
        "project3.overview.p1": "This project implements a toolchain for detecting formal and stylistic issues in LaTeX academic theses. Instead of relying on manual PDF review or basic text-based checking tools, it transforms the document into a structured XML representation and applies rule-based validation over its internal structure.",
        "project3.overview.p2": "It is designed to run automatically in GitLab CI pipelines (with artifacts and optional GitLab Pages publishing) and locally via Docker using the same conversion and detection stack.",

        "project3.architecture.h": "Architecture (converter → detector → outputs)",
        "project3.architecture.li1": "Converter (`converter/`): Perl-based pipeline around the LaTeXML API that converts LaTeX sources into LaTeXML XML and injects source-location metadata for traceability back to the original `.tex`/`.bib` files.",
        "project3.architecture.li2": "Detector (`detector/`): Python rule engine built on SaxonC (XPath 3.1). It loads versioned XML rules, evaluates them over the document structure, and renders TXT/console/HTML reports.",
        "project3.architecture.li3": "CI integration (`ci/`): GitLab CI templates + helper scripts that run the same converter → detector flow inside a prebuilt Docker image and publish artifacts and optional GitLab Pages.",
        "project3.architecture.li4": "Local runner (`local_run/`): Docker Compose + wrapper scripts for reproducible local runs (single thesis or batch mode) that match CI behavior.",

        "project3.workflow.h": "Workflow (from LaTeX sources to actionable findings)",
        "project3.workflow.li1": "Preprocess sources: generate conversion-ready copies with `srcroot` and `srcloc` markers so findings can be mapped back to original paths and line numbers.",
        "project3.workflow.li2": "Convert via LaTeXML: produce `thesis.xml` and, when a bibliography is declared, `thesis.bib.xml` (plus LaTeXML logs for debugging conversion issues).",
        "project3.workflow.li3": "Run rule evaluation: XPath rules match nodes (or thresholds) in the XML; the detector refines locations (e.g., headings, figures, bibliography entries) for more precise navigation.",
        "project3.workflow.li4": "Publish outputs: TXT reports for logs, console-friendly output for terminals, and optional HTML reports (dashboard + tables + source snippets).",

        "project3.features.h": "Key features",
        "project3.features.li1": "Document-aware validation on LaTeXML XML (structure-level checks, not just PDF review or plain text linting).",
        "project3.features.li2": "Extensible XPath rule set stored as versioned XML files (separate scopes for thesis and bibliography).",
        "project3.features.li3": "Central policy file `detector/rules_config.xml` to disable rules and override severities per scope (INFO/WARNING/ERROR).",
        "project3.features.li4": "Actionable outputs: TXT + console summaries + HTML reports with navigation and source context.",

        "project3.rules.h": "Rule engine & extensibility",
        "project3.rules.p1": "Rules are authored as standalone XML files and evaluated as XPath 3.1 expressions over the LaTeXML document model. This keeps the system maintainable: many new checks can be added by writing a rule, without touching Python code.",
        "project3.rules.li1": "Rule groups: `detector/rules/thesis_rules/` and `detector/rules/bibliography_rules/` (loaded automatically at runtime).",
        "project3.rules.li2": "Severity and enable/disable settings are handled centrally in `detector/rules_config.xml`, so the same rule set can be used with different policies (strict CI gate vs. informational guidance).",
        "project3.rules.li3": "Findings include normalized IDs, severity, message templating, and source location derived from converter-injected `srcloc` comments.",

        "project3.outputs.h": "Outputs & results",
        "project3.outputs.p1": "Each run produces conversion artifacts under `output/converter_output/` and findings under `output/detector_output/` (TXT always; HTML when enabled). Reports include rule IDs, severities, normalized messages, and source pointers (file + line).",
        "project3.outputs.p2": "This makes the checker useful both as a review aid and as a CI quality gate (e.g., treat ERROR findings as build-breaking), while preserving an auditable record of automated validation.",

        "project3.reporting.h": "Reporting & navigation (findings → source code)",
        "project3.reporting.li1": "In GitLab CI, HTML report locations become links to repository blobs (`/-/blob/<ref>/<file>#L<line>`), making reviews fast and traceable.",
        "project3.reporting.li2": "In local runs, HTML reports provide editor deep links (`vscode://file/...`) plus a plain `file://` link and a short source snippet for quick context.",
        "project3.reporting.li3": "Local Docker runs automatically rewrite container paths back to host paths, so reports open the correct files on Windows/Linux even though the detector executes in a container.",

        "project3.cicd.h": "CI/CD integration (GitLab)",
        "project3.cicd.p1": "The checker is reused across multiple LaTeX repositories via templates in `ci/`. The analyzed repository includes a `.gitlab-ci.yml` based on these templates and runs the checker inside a Docker image that already contains the full toolchain under `/formal_checker`.",
        "project3.cicd.p2": "The pipeline bundles outputs as artifacts (converter output, detector output, and an archived copy of the LaTeX repository) and can publish HTML reports through GitLab Pages.",

        "project3.image.h": "Packaging & distribution (reusable Docker image)",
        "project3.image.p1": "The full stack is shipped as a Docker image (LaTeXML + TeX Live + Python + SaxonC). This repository’s own GitLab pipeline builds commit-addressable image tags for reproducibility, and analyzed LaTeX repositories reference that image in their CI jobs.",

        "project3.local.h": "Local usage (Docker)",
        "project3.local.p1": "Local execution uses Docker Compose and launcher scripts (`formal_checker.sh` / `formal_checker.ps1`) to run the same converter → detector flow as CI. It supports single-thesis mode and batch scanning (multiple `thesis.tex` projects under a root directory).",

        "project3.extensibility.h": "Rule extensibility",
        "project3.extensibility.p1": "Most checks are added without changing Python: create a new XML rule file in the right group (thesis or bibliography), implement an XPath selector and message, then enable/disable or reclassify severity centrally via `rules_config.xml`.",

        "project3.meta.stackLabel": "Technologies",
        "project3.media.gallery": "Gallery",


    },
    sk: {
        "hero.title": "Vitajte v mojom portfóliu",
        "hero.subtitlePrefix": "Prezentácia mojich",
        "hero.projects": " Školské projekty",
        "hero.experience": "Pracovných skúsenosti",
        "hero.subtitleMiddle": " a ",
        "hero.cv": "Prezrieť životopis",
        "projects.title": "Vybrané projekty",
        "school.title": "Školské projekty",
        "school.carousel.hint": "Potiahnite alebo použite šípky",
        "school.carousel.prev": "Predchádzajúci projekt",
        "school.carousel.next": "Ďalší projekt",
        "experience.title": "Pracovné skúsenosti",
        "experience.current": "Aktuálne",
        "experience.previous": "Predchádzajúca",
        "experience.viewDetails": "Zobraziť detaily →",
        "nav.home": "Domov",
        "nav.school": "Školské projekty",
        "nav.experience": "Pracovné skúsenosti",
        "nav.cv": "Životopis",
        "footer.links": "Rýchle odkazy",
        "footer.contact": "Kontakt",

        "experience.job1.position": "Pozícia",
        "experience.job1.period": "Júl 2023 – August 2025",
        "experience.job1.title": "Software & DevOps Engineer",
        "experience.job1.company": "Webasto Convertibles Slovakia s.r.o.",
        "experience.job1.location": "Košice, Slovenská republika",
        "experience.details.title": "Detaily pracovnej skúsenosti",
        "experience.details.period": "Obdobie",
        "experience.details.company": "Spoločnosť",
        "experience.details.location": "Miesto",

        "experience.job2.position": "Pozícia",
        "experience.job2.period": "Február 2026 – Súčasnosť",
        "experience.job2.title": "Data Engineer",
        "experience.job2.company": "BuiltMind s.r.o.",
        "experience.job2.location": "Home Office",

        "experience.job2.details.intro.title": "Prehľad role",
        "experience.job2.details.intro.text": "Pracujem na automatizovanom zbere dát z realitného trhu a trhových zdrojov pomocou UiPath workflowov a Python scraperov. Pre zložitejšie alebo nepodporované weby implementujem scraping logiku v Pythone (API, requests, BeautifulSoup) a nasadzujem ju ako AWS Lambda funkcie, pričom výsledky sú napojené na ďalšie dátové pipeline.",

        "experience.job2.details.keyResponsibilities.title": "Kľúčové zodpovednosti",
        "experience.job2.details.keyResponsibilities.item1": "Implementácia nových scraping projektov a dátových pipeline pre realitné a trhové analýzy.",
        "experience.job2.details.keyResponsibilities.item2": "Údržba a opravy existujúcich scraperov pri zmenách na weboch (selektory, parsing pravidlá, riešenie obmedzení).",
        "experience.job2.details.keyResponsibilities.item3": "Nahrávanie a správa UiPath automatizácií v UiPath Orchestrator a spoľahlivé spúšťanie naplánovaných jobov.",
        "experience.job2.details.keyResponsibilities.item4": "Monitoring kvality dát a konzistencie v databáze a riešenie problémov tak, aby boli analytiky a grafy správne.",
        "experience.job2.details.keyResponsibilities.item5": "Aktualizácia historických dát podľa potreby pre dlhodobú správnosť reportov.",
        "experience.job2.details.keyResponsibilities.item6": "Spoluúčasť na testovaní nových release verzií aplikácie.",

        "experience.job2.details.tech.title": "Technológie & nástroje",
        "experience.job2.details.tech.subtitle": "Hlavné zameranie: automatizovaný zber dát, parsing, plánovanie jobov a monitoring kvality dát.",
        "experience.job2.details.sideNote": "Táto pozícia je aktuálna (prebieha).",


        "school.project1.title": "Game Jam Košice — Game Days",
        "school.project1.subtitle": "48-hodinová herná výzva (téma žurnalistika) — Call For Justice",
        "school.project1.desc": "48-hodinová herná výzva",
        "school.project1.tag1": "Unity",
        "school.project1.tag2": "C#",
        "school.project1.tag3": "2D herný vývoj",
        "school.project1.tag4": "Rýchle prototypovanie",
        "school.project1.imageAlt": "Game Days — ukážka projektu Call For Justice",

        "school.project2.title": "CarInsight – Živé IT projekty TUKE",
        "school.project2.desc": "Aplikácia na správu vozidiel",
        "school.project2.tag1": "React Native",
        "school.project2.tag2": "FastAPI",
        "school.project2.tag3": "PostgreSQL",
        "school.project2.tag4": "AWS Cognito",
        "school.project2.tag5": "DynamoDB",
        "school.project2.tag6": "Docker",
        "school.project1.cta": "Zobraziť detail",
        "school.project2.cta": "Zobraziť detail",
        "school.project3.cta": "Zobraziť detail",

        "school.project3.title": "Detekcia formálnych chýb v záverečných prácach pomocou XML technológií",
        "school.project3.desc": "Diplomová práca",
        "school.project3.tag1": "LaTeXML",
        "school.project3.tag2": "Python + SaxonC",
        "school.project3.tag3": "GitLab CI/CD",
        "school.project3.tag4": "Docker",
        "school.project3.tag5": "XML + XPath",
        "school.project3.tag6": "LaTeX",
        "school.project2.imageAlt": "CarInsight — plagát projektu",
        "school.project3.imageAlt": "Diplomová práca — toolchain na detekciu formálnych chýb (LaTeX/XML)",


        // ====== ADDED: Experience details (SK) ======
        "experience.details.intro.title": "Prehľad role",
        "experience.details.intro.text": "Pracoval som ako Software & DevOps Engineer so zameraním na interné zlepšovanie vývojárskeho prostredia a automatizáciu CI. Vytváral a udržiaval som rozsiahlu dokumentáciu v GitLab Wiki a neskôr som postavil kompletný workflow statickej analýzy Polyspace v Jenkins (Bug Finder aj Code Prover) od konfigurácie a filtrovania až po export výsledkov a publikovanie reportov.",

        "experience.details.keyResponsibilities.title": "Kľúčové zodpovednosti",
        "experience.details.keyResponsibilities.item1": "Tvorba a údržba internej dokumentácie v GitLab Wiki pre vývojové procesy, pipeline a nástroje.",
        "experience.details.keyResponsibilities.item2": "Implementácia statickej analýzy Polyspace v Jenkins pipelinoch (Bug Finder a Code Prover) s projektovou a variantovou konfiguráciou.",
        "experience.details.keyResponsibilities.item3": "Návrh continuous jobov pre rýchlu analýzu zmenených súborov s krátkym súhrnom pre Merge Requesty a nightly jobov pre plnú analýzu projektu s detailnými výsledkami.",
        "experience.details.keyResponsibilities.item4": "Priebežná podpora Polyspace: troubleshooting, optimalizácia výstupov a stabilita automatizácie naprieč projektmi; občas tvorba pomocných nástrojov a skriptov.",

        "experience.details.polyspace.title": "Polyspace v Jenkins (Bug Finder & Code Prover)",
        "experience.details.polyspace.intro": "Cieľom bolo dávať vývojárom rýchlu a relevantnú spätnú väzbu počas Merge Requestov a zároveň pravidelne spúšťať hlbšiu verifikáciu celého projektu. Pipelines boli postavené na variantoch, robustnom filtrovaní zdrojov a jasných výstupoch (artefakty, reporty a uploady na server).",

        "experience.details.polyspace.continuous.title": "Continuous job (Merge Requesty)",
        "experience.details.polyspace.continuous.item1": "Detekcia zmenených súborov porovnaním Merge Request vetvy s main vetvou a uloženie zoznamu pre následné filtrovanie.",
        "experience.details.polyspace.continuous.item2": "Analýza iba validných zmenených .c/.cpp súborov, ktoré sú prítomné v compile_commands.json daného variantu, s vylúčením nakonfigurovaných priečinkov na zníženie šumu.",
        "experience.details.polyspace.continuous.item3": "Spustenie Polyspace Bug Finder pre rýchlu spätnú väzbu (Code Prover je zámerne preskočený kvôli krátkemu runtime).",
        "experience.details.polyspace.continuous.item4": "Export výsledkov do CSV a SARIF, normalizácia ciest v SARIF skriptom, generovanie čitateľného súhrnu a jeho zverejnenie ako komentár k Merge Requestu; archivácia artefaktov na stiahnutie.",

        "experience.details.polyspace.nightly.title": "Nightly job (plná analýza)",
        "experience.details.polyspace.nightly.item1": "Spustenie plnej analýzy naprieč preddefinovanými variantmi bez obmedzenia na zmenené súbory.",
        "experience.details.polyspace.nightly.item2": "Vykonanie Bug Finder aj Code Prover pre každý variant, paralelne a s konzistentnou konfiguráciou preprocessingu.",
        "experience.details.polyspace.nightly.item3": "Upload výsledkov do Polyspace Access v štruktúrovanej hierarchii podľa variantu a nástroja pre tímové prehliadanie a review.",
        "experience.details.polyspace.nightly.item4": "Generovanie HTML reportov z vybraných šablón a export štandardizovaných CSV/SARIF výstupov, následné zabalenie a publikovanie ako Jenkins artefakty.",

        "experience.details.polyspace.implementation.title": "Implementačné detaily",
        "experience.details.polyspace.implementation.item2": "Generovanie .psopts súborov cez polyspace-configure a použitie exclude-sources vzorov na odstránenie third-party / generovaného / nerelevantného kódu zo zdrojov analýzy.",
        "experience.details.polyspace.implementation.item3": "Riešenie prípadov, keď sa vylúčené priečinky stále objavia v preprocessing voľbách, vytvorením vlastného argumentu -do-not-generate-results-for (odvodeného z obsahu .psopts).",
        "experience.details.polyspace.implementation.item4": "Úprava konfigurácií pre špecifické kompilátorové prostredia (napr. Green Hills) doplnením stub include ciest potrebných pre preprocessing.",
        "experience.details.polyspace.implementation.item5": "Konfigurácia analýzy pre prerušenia (interrupt handling) a projektovo špecifický preprocessing (makrá a enable/disable rutiny).",
        "experience.details.polyspace.implementation.item6": "Zdokumentovanie bezpečného používania Polyspace anotácií ako poslednej možnosti, s jasným statusom/severitou a odôvodnením pre dohľadateľnosť.",

        "experience.details.support.title": "Podpora Polyspace & troubleshooting",
        "experience.details.support.item1": "Diagnostika a oprava problémov v pipeline (konfigurácia, chýbajúce sources/options, preprocessing problémy, chyby pri spúšťaní nástroja).",
        "experience.details.support.item2": "Zlepšenie pomeru signal/noise úpravou vylúčení, filtrovacej logiky a report/export výstupov tak, aby boli výsledky použiteľné.",
        "experience.details.support.item3": "Pomoc vývojárom pri práci s výsledkami (Jenkins artefakty, prehliadanie v Polyspace Access, SARIF workflow vo VS Code) a udržiavanie dokumentácie aktuálnej.",

        "experience.details.tech.title": "Technológie & nástroje",
        "experience.details.tech.subtitle": "Hlavné zameranie: CI/CD automatizácia, integrácia statickej analýzy, reporting/export workflowy a interná dokumentácia.",



        // ====== ADDED / UPDATED: GameDays – Call For Justice (SK) ======

        "project1.title": "Call For Justice",

        // --- EVENT ---
        "project1.eventPrefix": "Vytvorené počas ",
        "project1.eventLink": "GameDays (Game Jam Košice)",
        "project1.eventSuffix": ", udalosti, ktorej som sa zúčastnil v rámci univerzitného predmetu.",
        "project1.eventIntro": "GameDays je 48-hodinová výzva vo vývoji hier, kde má malý tím za krátky čas navrhnúť a vytvoriť hrateľnú hru na zadanú tému, od nápadu cez implementáciu až po finálny build.",

        // --- OVERVIEW ---
        "project1.overview.h": "Prehľad projektu",
        "project1.overview.p1": "V našom ročníku bola témou žurnalistika. Call For Justice je 2D príbehová adventúra vytvorená v Unity, v ktorej hráč hrá vyšetrovacieho novinára uväzneného v sieti klamstiev, korupcie a zrady.",
        "project1.overview.p2": "Hráč skúma mesto, komunikuje s postavami, zbiera stopy a postupuje vďaka pohybu po mape, interakciám a krátkym minihrám, ktoré posúvajú príbeh vpred, kým mafia pritvrdzuje.",

        // --- CONTRIBUTION ---
        "project1.contribution.h": "Môj príspevok",
        "project1.contribution.li1": "Implementoval som pohyb postavy a základnú logiku animácií na mape (controller + Animator).",
        "project1.contribution.li2": "Navrhol som, implementoval a integroval viacero mini-hier, ktoré sa používajú počas progresu príbehu.",
        "project1.contribution.li3": "Spolupracoval som s tímom na rýchlej iterácii, debugovaní a doladení hrateľnosti v rámci 48-hodinového limitu.",

        // --- LEARNED ---
        "project1.learned.h": "Čo mi to dalo",
        "project1.learned.li1": "Lepšia práca v tíme: komunikácia a rozdelenie úloh v malom tíme.",
        "project1.learned.li2": "Rýchlejšie rozmýšľanie a rozhodovanie pod časovým tlakom.",
        "project1.learned.li3": "Praktický prehľad celého procesu vývoja hry (nápad → prototyp → implementácia → integrácia → release build) v krátkom čase.",

        "project1.meta.stackLabel": "Technológie",
        // --- LINKS ---
        "project1.links.h": "Odkazy",
        "project1.links.itch": "Hra na Itch.io",
        "project1.links.youtube": "YouTube video",
        "project1.links.gamedays": "Informácie o udalosti GameDays",

        // --- MEDIA ---
        "project1.media.video": "Video z hry",
        "project1.media.gallery": "Screenshoty",


        // ===== UPDATED: CarInsight texts (SK) =====

        "project2.media.video": "Video prezentácia",

        // --- EVENT ---
        "project2.eventPrefix": "Prezentované na ",
        "project2.eventLink": "Živé IT projekty TUKE (Live IT Projects)",
        "project2.eventSuffix": " ako tím #43 v spolupráci so Solar Turbines Slovakia (Caterpillar).",

        "project2.eventIntro":
        "Živé IT projekty sú tímový univerzitný predmet, kde študenti v spolupráci s firmou analyzujú požiadavky, implementujú funkčný prototyp a výsledky verejne odprezentujú.",

        // --- OVERVIEW ---
        "project2.overview.h": "Prehľad projektu",

        "project2.overview.p1":
        "CarInsight je mobilná aplikácia na správu viacerých vozidiel a ich životného cyklu v rámci jedného používateľského účtu.",

        "project2.overview.p2":
        "Aplikácia ukladá údaje o vozidlách a časovo viazané udalosti (STK/EK, poistenie, diaľničná známka, servisné intervaly), zobrazuje ich v kalendári a posiela upozornenia cez push notifikácie.",

        // --- VERSION 1 ---
        "project2.version1.h": "Prvá verzia – Tímový projekt (monolit)",

        "project2.version1.li1": "Backend aplikácia bola vytvorená ako monolit v FastAPI, kde jeden server poskytoval všetky REST endpointy pre používateľov, autá, servisné upozornenia a kalendár.",
        "project2.version1.li2": "Aplikácia mala vrstvenú architektúru – HTTP API riešilo komunikáciu s klientom, business logika spracovávala pravidlá aplikácie a SQLAlchemy ORM zabezpečovalo prácu s databázou.",
        "project2.version1.li3": "Dáta sa ukladali do relačnej databázy PostgreSQL, kde boli definované entity ako User, Car, Insight a PushToken.",
        "project2.version1.li4": "Autentifikácia bola riešená pomocou stateless JWT tokenov, ktoré sa vydávali pri prihlásení a overovali pri každej požiadavke.",
        "project2.version1.li5": "Na pozadí bežali periodické úlohy pomocou APScheduler, ktoré kontrolovali servisné intervaly a spúšťali push notifikácie.",
        "project2.version1.li6": "Fotografie áut sa ukladali lokálne na server a klient ich získaval cez FastAPI static route.",
        "project2.version1.li7": "Aplikácia využívala externé služby – NHTSA VPIC VIN dekóder na doplnenie údajov o vozidle a Expo push službu na doručovanie notifikácií.",
        "project2.version1.li8": "Backend bol zabalený do Docker kontajnera a spustený pomocou Uvicorn ASGI servera.",

        
        // --- VERSION 1 TECH ---
        "project2.version1.tech":
        "Kľúčové technológie:",

        // --- VERSION 2 ---
        "project2.version2.h": "Cloud verzia – Distribuovaný backend (mikroslužby)",

        "project2.version2.li1": "Backend bol refaktorovaný do distribuovanej architektúry, kde bola aplikácia rozdelená na viacero nezávislých FastAPI mikroslužieb, každá bežiaca vo vlastnom Docker kontajneri.",
        "project2.version2.li2": "Jednotlivé služby mali jasne definované zodpovednosti – User Service riešila autentifikáciu, Car Service správu vozidiel a obrázkov, Insight Service servisné záznamy, pričom cache/proxy služby zrýchľovali čítanie dát.",
        "project2.version2.li3": "Autentifikácia bola presunutá na AWS Cognito User Pools, pričom každá služba overovala JWT tokeny pomocou verejných kľúčov (JWKS).",
        "project2.version2.li4": "Dáta boli migrované do DynamoDB, kde sa využívali globálne sekundárne indexy na efektívne dotazy podľa používateľa alebo vozidla.",
        "project2.version2.li5": "Ukladanie obrázkov vozidiel bolo presunuté do služby Amazon S3 a backend pracoval s verejnými URL adresami uložených súborov.",
        "project2.version2.li6": "Na zrýchlenie čítania dát boli použité Redis cache proxy služby s read-through cachingom, TTL a invalidáciou pri zápise.",
        "project2.version2.li7": "Komunikácia medzi službami prebiehala cez HTTP volania s propagáciou autorizačnej hlavičky, pričom routovanie zabezpečoval AWS Application Load Balancer.",
        "project2.version2.li8": "Konfigurácia služieb bola riešená pomocou environment variables a prístup k AWS službám zabezpečoval AWS SDK (boto3).",

        // --- VERSION 2 TECH ---
        "project2.version2.tech":
        "Kľúčové technológie:",

        // --- LEARNED ---
        "project2.learned.h": "Čo mi to dalo",

        "project2.learned.li1":
        "Skúsenosť s tímovou spoluprácou a vývojom softvéru podľa reálnych požiadaviek zadávateľa.",

        "project2.learned.li2":
        "Praktický pohľad na vývoj softvéru vrátane tímovej organizácie práce, postupného vývoja a komunikácie s osobami zodpovednými za zadanie projektu.",

        "project2.learned.li3":
        "Skúsenosti s transformáciou centralizovaného systému do cloudovej architektúry a prácou s AWS službami.",

        "project2.meta.stackLabel": "Technológie",

        "project2.links.event": "O udalosti Live IT Projects",
        "project2.links.youtube": "Pozrieť prezentáciu na YouTube",
        "project2.links.repo1": "Repozitár – verzia z tímového projektu",
        "project2.links.repo2": "Repozitár – verzia z predmetu Cloudové systémy",

        // ====== ADDED: Diploma thesis – Formal error detection (SK) ======
        "project3.title": "Detekcia formálnych chýb v záverečných prácach pomocou XML technológií",

        "project3.eventPrefix": "Téma diplomovej práce: ",
        "project3.eventTitle": "Detekcia formálnych chýb v záverečných prácach pomocou XML technológií",
        "project3.eventSuffix": ".",
        "project3.eventIntro": "Cieľom bolo priniesť opakovateľnú a automatizovanú validáciu LaTeX záverečných prác tým, že sa zdrojové súbory konvertujú do štruktúrovaného XML a nad dokumentovou štruktúrou sa vyhodnocujú rozšíriteľné pravidlá v CI/CD aj lokálne.",

        "project3.overview.h": "Prehľad projektu",
        "project3.overview.p1": "Projekt implementuje nástrojový reťazec na detekciu formálnych a štylistických nedostatkov v LaTeX záverečných prácach. Namiesto manuálneho prechádzania PDF dokumentu alebo využívania jednoduchých textových kontrolných nástrojov pracuje s dokumentom v štruktúrovanej XML podobe, nad ktorou vykonáva pravidlové kontroly zamerané na samotnú štruktúru práce.",
        "project3.overview.p2": "Je navrhnutý pre automatické spúšťanie v GitLab CI (s artefaktmi a voliteľným publikovaním cez GitLab Pages) a aj pre lokálne spustenie cez Docker s rovnakým conversion/detection stackom.",

        "project3.architecture.h": "Architektúra (converter → detector → výstupy)",
        "project3.architecture.li1": "Converter (`converter/`): Perl pipeline nad LaTeXML API, ktorá konvertuje LaTeX zdroje do LaTeXML XML a dopĺňa metadáta o zdrojových lokáciách (mapovanie späť na pôvodné `.tex`/`.bib` súbory a riadky).",
        "project3.architecture.li2": "Detector (`detector/`): Python rule engine postavený na SaxonC (XPath 3.1). Načíta XML pravidlá, vyhodnocuje ich nad štruktúrou dokumentu a generuje TXT/konzolové/HTML výstupy.",
        "project3.architecture.li3": "CI integrácia (`ci/`): GitLab CI šablóny a pomocné skripty, ktoré spúšťajú converter → detector v predpripravenom Docker image a publikujú artefakty a voliteľne GitLab Pages.",
        "project3.architecture.li4": "Lokálne spustenie (`local_run/`): Docker Compose + wrapper skripty pre reprodukovateľné lokálne spúšťanie (single aj batch režim) so správaním zhodným s CI.",

        "project3.workflow.h": "Workflow (od LaTeX zdrojov po použiteľné nálezy)",
        "project3.workflow.li1": "Preprocessing zdrojov: vytvoria sa konverzii prispôsobené kópie so značkami `srcroot` a `srcloc`, aby bolo možné mapovať nálezy späť na reálne súbory a riadky.",
        "project3.workflow.li2": "Konverzia cez LaTeXML: vznikne `thesis.xml` a pri deklarovanej bibliografii aj `thesis.bib.xml` (vrátane LaTeXML logov pre diagnostiku).",
        "project3.workflow.li3": "Vyhodnotenie pravidiel: XPath pravidlá označia uzly (alebo threshold výrazy); detektor následne spresňuje lokácie (napr. nadpisy, obrázky, bibliografia) pre presnejšiu navigáciu.",
        "project3.workflow.li4": "Publikovanie výstupov: TXT reporty pre logy, konzolové výpisy pre terminál a voliteľné HTML reporty (dashboard + tabuľky + source snippet).",

        "project3.features.h": "Kľúčové vlastnosti",
        "project3.features.li1": "Validácia na úrovni štruktúry dokumentu v LaTeXML XML (nie len manuálna kontrola PDF alebo jednoduchý textový linter).",
        "project3.features.li2": "Rozšíriteľná sada XPath pravidiel uložená ako verzované XML súbory (samostatne pre text práce a bibliografiu).",
        "project3.features.li3": "Centrálna politika v `detector/rules_config.xml`: vypnutie pravidiel a override severity podľa scope (INFO/WARNING/ERROR).",
        "project3.features.li4": "Použiteľné výstupy: TXT + konzolové sumáre + HTML reporty s navigáciou a kontextom.",

        "project3.rules.h": "Rule engine & rozšíriteľnosť",
        "project3.rules.p1": "Pravidlá sú definované ako samostatné XML súbory a vyhodnocujú sa ako XPath 3.1 výrazy nad LaTeXML modelom dokumentu. V praxi to zjednodušuje údržbu: veľa nových kontrol sa dá doplniť napísaním pravidla bez zásahu do Python kódu.",
        "project3.rules.li1": "Skupiny pravidiel: `detector/rules/thesis_rules/` a `detector/rules/bibliography_rules/` (načítajú sa automaticky pri spustení).",
        "project3.rules.li2": "Zapnutie/vypnutie a severity sa riadia centrálne cez `detector/rules_config.xml`, takže rovnaké pravidlá sa dajú použiť v rôznych režimoch (prísny CI gate vs. informačné odporúčania).",
        "project3.rules.li3": "Nálezy obsahujú ID pravidla, severitu, templating správ a lokáciu odvodenú zo značiek `srcloc`, ktoré vkladá converter.",

        "project3.outputs.h": "Výstupy & výsledky",
        "project3.outputs.p1": "Každé spustenie vytvorí konverzné artefakty v `output/converter_output/` a nálezy v `output/detector_output/` (TXT vždy; HTML pri zapnutí). Reporty obsahujú ID pravidla, severitu, normalizované správy a odkazy na zdroj (súbor + riadok).",
        "project3.outputs.p2": "Vďaka tomu sa dá nástroj použiť ako pomôcka pri kontrole aj ako CI quality gate (napr. ERROR nálezy môžu zlyhať build), pričom zostáva auditovateľný záznam automatizovanej validácie.",

        "project3.reporting.h": "Reporting & navigácia (nález → zdrojový kód)",
        "project3.reporting.li1": "V GitLab CI sa lokácie v HTML reporte premenia na odkazy do repozitára (`/-/blob/<ref>/<file>#L<line>`), takže reviewer sa vie prekliknúť priamo na problémový riadok.",
        "project3.reporting.li2": "Pri lokálnom spustení HTML report ponúka editor deep link (`vscode://file/...`) a zároveň aj `file://` link a krátky výrez zdroja (source snippet).",
        "project3.reporting.li3": "Pri lokálnom spustení v Dockeri sa cesty automaticky premapujú z kontajnera na hosta, aby sa súbory otvárali korektne aj na Windows/Linux.",

        "project3.cicd.h": "CI/CD integrácia (GitLab)",
        "project3.cicd.p1": "Checker je znovupoužiteľný naprieč LaTeX repozitármi cez šablóny v `ci/`. Analyzovaný repozitár obsahuje `.gitlab-ci.yml` založený na týchto šablónach a spúšťa checker v Docker image, ktorý už obsahuje celý toolchain pod `/formal_checker`.",
        "project3.cicd.p2": "Pipeline zbiera výstupy ako artefakty (converter output, detector output a archivovanú kópiu LaTeX repozitára) a HTML reporty môže publikovať cez GitLab Pages.",

        "project3.image.h": "Balíčkovanie & distribúcia (znovupoužiteľný Docker image)",
        "project3.image.p1": "Celý stack je zabalený do Docker image (LaTeXML + TeX Live + Python + SaxonC). V tomto repozitári sa v GitLab CI buildujú commit-addressable image tagy pre reprodukovateľné výsledky a analyzované LaTeX repozitáre tento image používajú v CI joboch.",

        "project3.local.h": "Lokálne použitie (Docker)",
        "project3.local.p1": "Lokálne spustenie používa Docker Compose a launcher skripty (`formal_checker.sh` / `formal_checker.ps1`) a vykoná rovnaký converter → detector flow ako CI. Podporuje single režim aj batch skenovanie (viac projektov s `thesis.tex` pod jedným root adresárom).",

        "project3.extensibility.h": "Rozšíriteľnosť pravidiel",
        "project3.extensibility.p1": "Väčšinu kontrol je možné doplniť bez úprav Python kódu: stačí pridať nové XML pravidlo do správnej skupiny (práca alebo bibliografia), definovať XPath selektor a správu a následne doladiť zapnutie/severity centrálne cez `rules_config.xml`.",

        "project3.meta.stackLabel": "Technológie",
        "project3.media.gallery": "Galéria",
    }
};

// expose translations for components
window.translations = translations;

let currentLanguage = 'en';

// Apply translations for non-shadow DOM elements (light DOM only; shadow roots use their own listeners)
function applyTranslations(lang) {
    const resolved = lang === 'sk' ? 'sk' : 'en';
    const dict = translations[resolved] || {};
    window.currentLanguage = resolved;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (dict[key]) {
            element.textContent = dict[key];
        }
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        if (dict[key]) {
            element.setAttribute('alt', dict[key]);
        }
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');
        if (dict[key]) {
            element.setAttribute('aria-label', dict[key]);
        }
    });
    document.querySelectorAll('.language-btn').forEach(btn => {
        if (btn.dataset.lang === resolved) btn.classList.add('active'); else btn.classList.remove('active');
    });
}

let _lightDomLanguageBound = false;

function bindLanguageChangeToLightDom() {
    if (_lightDomLanguageBound) return;
    _lightDomLanguageBound = true;
    if (window.AppState && typeof window.AppState.on === 'function') {
        window.AppState.on('languageChange', (e) => {
            const next = (e && e.detail && e.detail.language) ? e.detail.language : window.AppState.getLanguage();
            applyTranslations(next);
        });
    } else {
        document.addEventListener('languageChange', (e) => {
            const next = (e && e.detail && e.detail.language) ? e.detail.language : 'en';
            applyTranslations(next);
        });
    }
}

function initAnchorSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initCvButtonIfPresent() {
    const cvBtn = document.getElementById('cvBtn');
    if (!cvBtn) return;
    cvBtn.addEventListener('click', () => {
        const lang = (window.getLanguage && window.getLanguage()) || window.currentLanguage || 'en';
        const fileName = lang === 'sk' ? 'CV_SK.pdf' : 'CV_EN.pdf';
        const cvUrl = './biography/' + fileName;
        window.open(cvUrl, '_blank');
    });
}

function initPageI18nAndUi() {
    const lang = (window.AppState && window.AppState.getLanguage && window.AppState.getLanguage()) || (window.getLanguage && window.getLanguage()) || 'en';
    applyTranslations(lang);
    bindLanguageChangeToLightDom();
    initAnchorSmoothScroll();
    initCvButtonIfPresent();
    window.translations = translations;
    window.applyTranslations = applyTranslations;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageI18nAndUi);
} else {
    initPageI18nAndUi();
}


// Theme management is handled globally by globals.js. Components can listen to
// the 'themeChange' event or call window.setTheme / window.toggleTheme (exposed by globals.js).