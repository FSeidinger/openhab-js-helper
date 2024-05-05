# openhab-js-helper

I have started the `openhab-js-helper` as a private openHAB JavaScript helper
library to improve the quality of my JavaScript (ECMAScript 2022+) automation
rules. The library uses the `yarn` package manager for testing and building.

It also comes with a test suite using `Jest`. Jest not only let you test your
code, but also has an integrated mocking that I use to mock openHAB specific
objects.

In this way the code can be developed, tested and build outside an openHAB
instance.
