# Commit Rules

## CRITICAL - Read Before Every Commit/Push

1. **NO mentions of Claude, Anthropic, or any AI assistant in commits**
   - No "Co-Authored-By" lines referencing any AI
   - No commit messages mentioning AI-generated code
   - No PR descriptions mentioning AI tools
   - Check every commit message before pushing

2. **Scan staged files before committing**
   - Ensure no file content references AI authorship
   - Remove any auto-generated AI attribution lines

3. **Remote repository**: git@github.com:Tatu1984/repair.git
4. **Database**: NeonDB PostgreSQL (connection string in .env.local)
