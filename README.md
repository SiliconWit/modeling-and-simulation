---
title: "Modeling and Simulation - Collaboration Guide"
description: "Contributing guide for Modeling and Simulation course content"
tableOfContents: true
sidebar:
  order: 999
---

# Modeling and Simulation

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Contributors Welcome](https://img.shields.io/badge/contributors-welcome-orange)

**Read this course at:** [https://siliconwit.com/education/modeling-and-simulation/](https://siliconwit.com/education/modeling-and-simulation/)

A course on mathematical modeling and computational simulation for engineering system analysis. Covers building mathematical representations of physical systems, numerical methods for solving differential equations, and comparing classical and AI approaches to problems like inverse kinematics.

## Lessons

| # | Title |
|---|-------|
| 1.1 | Simple Pendulum Modeling |
| 1.2 | Spring-Mass System Simulation |
| 1.3 | Inverse Kinematics: Math vs AI Approaches |

## File Structure

```
modeling-and-simulation/
├── index.mdx
├── simple-pendulum-modeling.mdx
├── spring-mass-system-simulation.mdx
├── inverse-kinematics-math-vs-ai.mdx
└── README.md
```

## How to Contribute

1. Fork the repository: [SiliconWit/modeling-and-simulation](https://github.com/SiliconWit/modeling-and-simulation)
2. Create a feature branch: `git checkout -b feature/your-topic`
3. Make your changes and commit with a clear message
4. Push to your fork and open a Pull Request against `main`
5. Describe what you changed and why in the PR description

## Content Standards

- All lesson files use `.mdx` format
- `<BionicText>` may be used in later content sections but not in lesson intro paragraphs
- Code blocks should include a title attribute:
  ````mdx
  ```python title="pendulum_simulation.py"
  from scipy.integrate import solve_ivp
  sol = solve_ivp(pendulum_ode, t_span, y0)
  ```
  ````
- Use Starlight components (`<Tabs>`, `<TabItem>`, `<Steps>`, `<Card>`) where appropriate
- Keep paragraphs concise and focused on practical application
- Include working Python examples that readers can run directly
- Mathematical notation uses LaTeX in MDX

## Local Development

Clone the main site repository and initialize submodules:

```bash
git clone --recurse-submodules <main-repo-url>
cd siliconwit-com
npm install
npm run dev
```

To test a production build:

```bash
npm run build
```

## License

This course content is released under the [MIT License](LICENSE).
