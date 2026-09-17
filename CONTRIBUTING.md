# Contributing to CINEPASS

Thank you for your interest in contributing to CINEPASS! Follow the guidelines below to submit feature improvements, bug fixes, and documentation updates.

## 🛠️ Development Workflow

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/Sumit12312299/movie-ticket-booking-.git
   cd movie-ticket-booking-
   ```

2. **Branching Convention**:
   - `feat/`: New features (e.g. `feat/food-beverage-addon`)
   - `fix/`: Bug fixes (e.g. `fix/seat-locking-race-condition`)
   - `docs/`: Documentation additions
   - `style/`: UI & design refinements

3. **Commit Convention**:
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(...)`: A new feature
   - `fix(...)`: A bug fix
   - `docs(...)`: Documentation only changes
   - `style(...)`: Formatting, UI styles
   - `refactor(...)`: Code refactoring without changing functionality
   - `chore(...)`: Build process or tooling changes

4. **Code Quality**:
   - Backend: Keep route controllers lean, delegating business logic to service classes.
   - Frontend: Use modular components, accessible markup, and responsive Tailwind styling.

5. **Pull Requests**:
   - Open PRs against `main` with a clear description and testing notes.
