# Compare AI

A Next.js Application for AI Model Comparisons

## 🚀 Introduction

Compare AI is a feature-rich Next.js application designed to help developers, researchers, and AI enthusiasts compare different artificial intelligence models across various providers. The app provides
an intuitive interface to create, save, and view detailed comparisons of model capabilities, pricing, and performance metrics.

## 🎯 What You Can Do with the Application

- **Create Comparisons**: Select multiple AI models and providers to see side-by-side feature comparisons.
- **History**: All comparisons are saved and can be viewed in a dedicated history section.
- **Performance Review**: Time taken by each model is displayed.
- **Pricing Information**: View up-to-date pricing estimates for usage scenarios.

## 🛠️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/LassazVegaz/compare-ai.git
   cd compare-ai
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment**
   - Copy `example.env` to `.env` and fill in any required variables (e.g., database connection string, API keys). Instructions are in the `example.env` file.

4. **Generate Prisma Client**

   ```bash
   pnpm prisma generate
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`.

## 📈 Performance Optimizations

This project leverages multiple Next.js features to ensure fast load times and efficient data fetching:

- **Server-Side Rendering (SSR)**: Key pages such as the comparisons list and single comparison detail pages are completely rendered on the server for improved SEO and faster first paint. If you revisit one of these pages, it is instantanously loaded.
- **Hybrid Rendering**: Home page needs JS for interactivity like the model selection and validations. Except for form, other parts are rendered on the server. This allows for a fast initial load while still providing a dynamic user experience.
- **Caching**: 3rd party API to get models pricing sends pricing of all models at once and caches. Hence it is cached for a while.

These optimizations result in quick navigations and a responsive user experience.

## 🧩 Project Structure Highlights

- `src/app/` – Next.js App Router files and components
- `src/services/` – Business logic and API wrappers (e.g., comparison.service.ts)
- `src/generated/prisma` – Auto-generated Prisma client and types
- `prisma/schema.prisma` – Database schema definitions

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests with clear descriptions of enhancements or bug fixes.

1. Fork the repository
2. Create a feature branch
3. Commit your changes and push
4. Submit a pull request for review

---

If you have questions or need help getting started, feel free to open an issue or reach out!
