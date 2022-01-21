const validate = require('../modules/validate');

class Drop {
    /**
     * An item to be dropped.
     * @param {Drop} drop 
     */
    constructor(drop) {
        /** @type {string} ID of the item. Must be a string. */
        this.id = validate('string', drop ? drop.id : '');

        /** @type {number} Chances of dropping the item. 1 = 1% chances, 0.01 means 1/10,000 chances. Note: 100% means that you will always have one dropping. 120% means 1 always dropping and 20% chances to drop a second one. */
        this.chances = Math.max(0, validate('number', drop ? drop.chances : 0));
    }

    /** Chances of dropping based on raw chances. It's also the chances that are used when NORMAL algorithm is used. */
    get effectiveChances() { return this.chances - this.alwaysDrop * 100; }

    /** Chances of dropping based on the GENTLE algorithm. */
    get gentleChances() {
        let chances = 0;

        if (this.effectiveChances < 1) { chances = this.effectiveChances * (1 + 2500 / this.effectiveChances / 500 / 100) + Math.pow(this.effectiveChances, 2) * 200 / this.effectiveChances / 100; }
        else if (this.effectiveChances <= 5) { chances = this.effectiveChances * (1 + 200 / this.effectiveChances / 100); }
        else { chances = this.effectiveChances * 1.1; }

        return Math.max(0, Math.min(chances, 100));
    }

    /** Number of items that are always dropped. */
    get alwaysDrop() { return Math.floor(this.chances / 100); }

    /**
     * Try to drop the item. Returns its ID if dropped and null if not.
     * @param {"NORMAL"|"GENTLE"} algorithm The algorithm to use. NORMAL will use exact drop rates, GENTLE will please the user by giving higher chances of obtaining rare and almost always items.
     * @returns {string|null}
     */
    drop(algorithm) {
        if (Math.random() <= this[algorithm === 'GENTLE' ? 'gentleChances' : 'effectiveChances'] / 100) { return this.id; }
        else { return null; }
    }
}

module.exports = Drop;