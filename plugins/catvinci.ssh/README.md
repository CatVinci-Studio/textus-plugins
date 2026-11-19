# SSH Folders

Open a folder on a server through your own ssh and write there like in a folder on this computer: its documents in tabs, its files in the sidebar. Desktop.

## What it does

- **Plugins › Open Remote Folder…** lists the servers in your `~/.ssh/config` (or takes one you type, such as `me@server`), then the folder to open, starting at your home there.
- The folder opens in the sidebar. Documents open, save, rename, move and search as in any folder; a new document or folder is made on the server.
- Your own `ssh` makes the connection, with your config, keys, agent and known hosts. Only file transfer (SFTP) is asked for: no shell, no commands.
- A connection that drops is made again the next time a file is read or saved.

## Limits

- Sign-in by key or agent only. A server that asks for a password is refused; add a key for it first.
- A server ssh doesn't know yet is refused, never accepted for you: connect once with `ssh` in a terminal and accept its key there.
- Pictures can't be pasted into a document on a server yet, and a deleted file is gone for good: a server has no Trash.

## Permissions

It asks for **ssh**: Textus asks you once for each server before the plugin may connect to it.

## Changes

- **0.1.1** - Uses the plugin API as Textus 1.4.6 ships it.
- **0.1.0** - First version. Needs Textus 1.4.6.
