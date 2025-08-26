---
title: "Gaining Interactive Shells"
subtitle: "Cheatsheet for obtaining fully-interactive shells"
date: 2025-08-26
tags: ["general", "cheatsheet", "privesc"]
featured: false
draft: false
---

# Gaining Interactive Shells

Often when uploading a reverse shell on a webserver we are dealing with non-interactive shell. This means it doesn't prompt us for user input or display output in real-time in a traditional terminal window. 

The biggest problem with a non-interactive shell is that you can't run `su` or `sudo`.

Here are some useful ways to upgrade your shell to an interactive one:

```python -c 'import pty; pty.spawn("/bin/sh")'```

**When to use it:** Almost always the first go-to if Python is available on the target. After spawning, run Ctrl-Z and then stty raw -echo; fg on your local terminal to fully fix arrow keys and job control.

```echo 'os.system('/bin/bash')'```

**When to use it:** When you can inject Python code but can’t directly execute shell commands.

```/bin/sh -i``` or ```/bin/bash -i```

**When to use it:** Works on minimal systems where Python or Perl might not be installed. Note the -i flag forces the terminal to be interactive.

```perl -e 'exec "/bin/sh";'```

**When to use it:** When Python isn’t available, but Perl is. This takes advantage of Perl’s exec function.

```:!bash```

**When to use it:** If you can edit files on the system and Vim is installed. This is often used in “local shell escape” scenarios.

```SHELL=/bin/bash script -q /dev/null```

**When to use it:** This command is very reliable if `script` is installed. `Script` spawns a fully interactive shell session, which fixes TTY issues

```stty raw -echo && fg```

**When to use it:** This resets your terminal to raw mode and resumes the background shell. You should use it when your shell has been suspended with Ctrl + Z.

## Cheatsheet

Start by checking available interpreters:

```which python3 python perl bash sh```

How to fix terminal controls after an upgrade:

```Ctrl-Z``` 
```stty raw -echo``` 
```fg```
```reset```


Try Ctrl + C, Ctrl + Z, and Tab completion to make sure the shell is fully interactive.
