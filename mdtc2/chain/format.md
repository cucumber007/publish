# Format

Each message is a folder, the folder name is the message number/ID.

The folder contains 2 files:
- `user_<ID>.md` - the message from the user with the message ID
- `x_ai_<ID>.md` - the message from the AI with the message ID

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