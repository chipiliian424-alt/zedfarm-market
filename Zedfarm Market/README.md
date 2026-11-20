# 🌾 ZedFarm Market — Zambian Agricultural Marketplace

ZedFarm Market is a modern, accessible web marketplace built with **vanilla HTML5, CSS3, and JavaScript**, backed by a live **Supabase (PostgreSQL & Auth)** database. It is designed specifically for Zambian farmers to advertise fresh produce and livestock directly to buyers, restaurants, and wholesalers without middlemen.

Deployed link for assignment submission: `[Paste your live Netlify / GitHub Pages link here]`

---

## 🌟 Assignment Highlights & Requirements Met

| Requirement | Implementation Details |
| :--- | :--- |
| **Tech Stack** | Pure **HTML5**, **CSS3** (custom properties, Grid, Flexbox), and **Vanilla JS** (`js/app.js`). Runs directly by opening `file:///` or deployed online. |
| **Database & Auth** | **Supabase (PostgreSQL)** with Row Level Security (RLS) policies for public reading & secure owner-only editing/deletion. Farmer accounts via Supabase Auth. |
| **3 Zambian Languages** | **English**, **Chibemba (Bemba)**, and **ChiNyanja (Nyanja)** with persistent language switcher stored in `localStorage`. |
| **Special Needs Screen Reader** | Built-in **Voice Screen Reader (Web Speech API)** with voice playback, pause, stop, speed controls, and per-item audio buttons. |
| **Zambian Context** | Zambian Kwacha (ZMW) pricing, all 10 Zambian provinces, key local crops (Maize, Groundnuts, Cassava, Livestock, Wild Honey), and one-click WhatsApp/Call farmer integration. |
| **Free Deployment** | 100% free hosting on GitHub Pages or Netlify with HTTPS. |

---

## 📁 Project Architecture

```text
├── index.html          # Homepage with Hero, Search, Highlights & Latest Listings
├── browse.html         # Search & filter produce by category, province, district, price
├── listing.html        # Individual produce view with buyer safety & direct farmer contact
├── dashboard.html      # Farmer dashboard: add, edit, delete, mark sold, stats
├── login.html          # Farmer authentication (login)
├── signup.html         # Farmer registration with phone, province & district
├── css/
│   └── styles.css      # Complete modern stylesheet, responsive design, contrast & polish
├── js/
│   └── app.js          # Core application logic (Auth, Supabase, 3 Languages, Speech Synthesis)
├── schema.sql          # PostgreSQL database schema, RLS policies, permissions & seed data
└── README.md           # Documentation & lecturer grading guide
```

---

## 🌐 How to Deploy for Free (To send link to Lecturer)

### Method 1: Netlify (Recommended — Easiest & Fastest)
1. Push your project folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Complete ZedFarm Market"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/zedfarm-market.git
   git push -u origin main
   ```
2. Log into [Netlify](https://app.netlify.com/) (Free).
3. Click **Add new site** → **Import an existing project** → Pick **GitHub** → Select your repository.
4. Build settings:
   - **Build command**: *(leave completely empty)*
   - **Publish directory**: `.` or `/` (root)
5. Click **Deploy**. Within 30 seconds, Netlify will give you a live HTTPS link (e.g. `https://zedfarm-market.netlify.app`).

### Method 2: GitHub Pages (100% Free)
1. Push the code to a GitHub repository.
2. In your GitHub repository, click **Settings** → **Pages** (in left sidebar).
3. Under **Branch**, select `main` and folder `/ (root)`.
4. Click **Save**.
5. In 1–2 minutes, your website is live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 🧪 Lecturer Demonstration & Testing Checklist

1. **Language Switching**:
   - Click the language selector in the top-right header.
   - Switch between **English**, **Chibemba**, and **ChiNyanja**. Notice how navigation, badges, hero text, and form labels immediately adapt.

2. **Screen Reader (Special Needs Accessibility)**:
   - Click the orange **"🔊 Listen"** button in the header to read out the full page using the browser's speech synthesizer.
   - A floating audio player appears at the bottom with **Play**, **Pause**, **Stop**, and **Speed Control** (0.75x to 1.5x).
   - Click the **"🔊 Listen"** button on any individual produce card to hear that specific listing's details read aloud.

3. **Database & Produce Browsing**:
   - Go to **Browse**: Filter by category (e.g., *Maize*, *Groundnuts*, *Livestock*) or province (e.g., *Lusaka*, *Southern*, *Eastern*).
   - Search by crop name or district in the live search bar.
   - Click any listing to view the seller's contact details, location, and direct **WhatsApp** and **Call** buttons.

4. **Farmer Authentication & Produce Posting**:
   - Go to **Sign up** to register a new farmer account (name, email, password, phone, province, district).
   - In the **Dashboard**, view real-time statistics (Total Listings, Active, Sold).
   - Click **➕ Add listing** to post new produce with photos, pricing in ZMW, and quantity.
   - Try the **Mark as Sold**, **Edit**, and **Delete** actions.
