# Git

For a folder kept in Git, on the desktop:

- Files changed since the last commit are marked in the sidebar: **M** changed, **A** added, **U** new and not in Git yet, **R** renamed, **!** in conflict.
- In a changed document, each paragraph, heading or list with lines the last commit hadn't (as saved) has a mark in the right margin; clicking it commits (Textus 1.4.4).
- The status bar shows the branch, with ↑ the commits to push and ↓ those to pull; clicking it commits.
- **Commit Changes…** (Plugins menu, or the branch) lists the changed files, the one in front picked; you write the message, and your own Git commits those files only - its hooks and signing run as usual. The first commit in a folder asks first.
- **Push** and **Pull** (Plugins menu) send the branch to its remote branch and take the remote's commits in, with your own Git and the credentials it has saved - sign in once with Git in a terminal if it asks. A branch with no remote branch yet is pushed to `origin`. A pull that would conflict is undone, nothing changed, and you're told (Textus 1.4.6).
- With Version History 0.4, a document's commits show under its versions, compared and restored the same way.
- Textus AI can read the changes, a file's commits and a file as a commit had it - for example to draft your commit message.

Nothing switches branches. Needs Git installed (on a Mac, the Command Line Tools) and Textus 1.4.6.

## Changes

- **0.3.0** - Push and Pull, and what waits to be pushed or pulled beside the branch (Textus 1.4.6).
- **0.2.0** - Blocks changed since the last commit are marked in the margin (Textus 1.4.4).
- **0.1.1** - The first-commit confirmation's button reads "Commit".
- **0.1.0** - First version.

<!-- ai-tools -->
## Tools for Textus AI

Once it is installed, Textus AI can use these in a conversation:

- `git_changes`: The open folder's branch and changed files, each changed text file's lines against its last commit. Read it before writing a commit message.
- `git_history`: A file's Git commits, newest first, through renames: hash, date, author, subject.
- `git_file_at`: A file's text as one of its commits had it (hash from git_history).
<!-- /ai-tools -->
