# Battleship
A JavaScript implementation of the classic battleship game.

This game is built entirely from HTML, CSS, and vanilla JavaScript. Play against an AI computer opponent on a 10x10 grid.

Some cool technical features
- The software itself is implemented using the MVC design pattern.
- The drag-and-drop feature was built entirely from scratch using vanilla JavaScript. No JQuery or external libraries used.
- The computer that plays against you has a pretty intelligent AI that simulates the way a human would play.

Challenges I've Faced
1) While implementing the drag-and-drop, I came across an issue in which I assigned two vars the same object pointer (when my intention was to create a clone).

2) Ran into some scope problems, with globals being accidentally created because I forgot to add the 'var' keyword before some declarations.
