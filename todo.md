# todo
- [x] create (and use for render) Animations for the water (floor layer?)
- [x] support gamepad
- [x] restore proper edge overlays for largeTree
- [x] implement meshTree textures for largeTree (now it just writes over any existing edges)
- [x] make the door go black (like it's opened) when walking into house


## Pause Menu
the idea is: store and draw a 'position' in the pause menu; like the **inventory** or **prompt dialogues**

- [x] create pauseMenu in Game context (ie. replace htmlControls' pauseMenu)
- [x] keep track of pauseMenu position
- [x] draw a position in the pauseMenu
- [ ] employ some menu options other than 'resume'

**bonus**
- [ ] use textures for pauseMenu (like inventory)
- [ ] *(optional)* turn this process into a menu generator thing


## General
- [x] shift the player (and entities) up 1-4 pixels - *currently player is offset -12px*
- [ ] add player + entity shadows