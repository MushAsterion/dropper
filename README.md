# dropper
Dropper is a small module to easily handle drops. It includes both a "normal" algorithm and a "gentle" algorithm. [See wiki](https://github.com/MushAsterion/dropper/wiki/Algorithms) for details.
 
# Installation
Node.JS 6.0.0 or newer is required.
```
npm install MushAsterion/dropper
```
 
# Initialization
```JavaScript
const Dropper = require('dropper');
const drops = new Dropper(YOUR_DROPS);
```
 
Where:
* `YOUR_DROPS` is an array of [drops](https://github.com/MushAsterion/dropper/wiki/Drop).
 
If you want to change drops once initialized I highly suggest you to create a new dropper.
 
# Usage
Have a [look at the wiki](https://github.com/MushAsterion/dropper/wiki) for how to use it.

* [Dropper](https://github.com/MushAsterion/dropper/wiki/Dropper)
* [Drop](https://github.com/MushAsterion/dropper/wiki/Drop)
* [Algorithms](https://github.com/MushAsterion/dropper/wiki/Algorithms)
