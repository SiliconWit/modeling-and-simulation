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

Build it in simulation before you build it in hardware. Nine complete Python projects covering battery discharge, circuit response, mechanical dynamics, thermal analysis, PID control, sensor fusion, signal processing, Monte Carlo tolerance analysis, and system identification from measured data.

## Lessons

| # | Title |
|---|-------|
| 1 | From Equations to Simulations |
| 2 | Simulating Electrical Circuits |
| 3 | Mechanical System Dynamics |
| 4 | Thermal Modeling for Electronics |
| 5 | Control System Design in Simulation |
| 6 | Sensor Fusion and State Estimation |
| 7 | Simulating Signal Processing Pipelines |
| 8 | Monte Carlo Methods for Engineering Decisions |
| 9 | System Identification from Measured Data |

## File Structure

```
modeling-and-simulation/
├── index.mdx
├── from-equations-to-simulations.mdx
├── simulating-electrical-circuits.mdx
├── mechanical-system-dynamics.mdx
├── thermal-modeling-electronics.mdx
├── control-system-simulation.mdx
├── sensor-fusion-state-estimation.mdx
├── signal-processing-simulation.mdx
├── monte-carlo-engineering-decisions.mdx
├── system-identification-measured-data.mdx
└── README.md
```

## How to Contribute

All commands below work on Linux, macOS, and Windows (using Git Bash, PowerShell, or Command Prompt with Git installed).

### For Team Members (with push access)

**First time setup (clone the repo once):**

```bash
git clone https://github.com/SiliconWit/modeling-and-simulation.git
cd modeling-and-simulation
```

**Every time you start working:**

```bash
git pull origin main
```

Always pull before making changes. This avoids conflicts with other contributors.

**After making your changes:**

```bash
git add .
git commit -m "Brief description of what you changed"
git push origin main
```

**If you get a push error** (someone pushed before you):

```bash
git pull origin main
```

Git will merge the changes automatically in most cases. If there is a conflict, Git will mark the conflicting lines in the file. Open the file, choose which version to keep, then:

```bash
git add .
git commit -m "Resolve merge conflict"
git push origin main
```

**Tips to avoid conflicts:**

- Always `git pull origin main` before you start working
- Push your changes as soon as you are done, do not hold onto uncommitted work for long
- Coordinate with other contributors so two people are not editing the same file at the same time

### For External Contributors (without push access)

1. Fork the repository: [SiliconWit/modeling-and-simulation](https://github.com/SiliconWit/modeling-and-simulation)
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/modeling-and-simulation.git
   cd modeling-and-simulation
   ```
3. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Brief description of what you changed"
   git push origin main
   ```
4. Open a Pull Request against `main` on the original repository
5. Describe what you changed and why in the PR description

## Content Standards

- All lesson files use `.mdx` format
- Do not use `<BionicText>` in this course
- Every lesson contains a complete, runnable Python project
- Code blocks should include a title attribute
- Use ASCII diagrams in `text` code blocks where they help visualize systems
- Use Starlight components where appropriate
- All Python code must be testable: `python3 script.py` should produce output

## Local Development

Clone the main site repository and initialize submodules:

```bash
git clone --recurse-submodules <main-repo-url>
cd siliconwit-com
npm install
npm run dev
```

## License

This course content is released under the [MIT License](LICENSE).
