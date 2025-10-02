# Format

The chain has folder called `branch_<name>` that contains the messages of certain discussion branch.

Each message is a folder, the folder name is the message number/ID.

The message folder contains 2 files:
- `user.md` - the message from the user
- `x_ai.md` - the message from the AI

AI answer has `x` to always appear later when files are sorted alphabetically.

The messages in each files are formatted in markdown.

Header is title, indicating if this is User or AI message.

## Example

```markdown
# User

Lorem ipsum markdown
```

Additional rules:
- Use bold to highlight key thesises