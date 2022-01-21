const validate = require('../modules/validate');
const Drop = require('./Drop');

class Dropper {
    /**
     * A dropper. To manage your drops.
     * @param {drop[]} drops 
     */
    constructor(drops) {
        /** @type {Drop[]} List of available drops. */
        this.drops = validate('array', drops).map(function(d) { return new Drop(d); }).filter(function(d) { return d.id && d.chances > 0; }).sort(function(a, b) { return a.effectiveChances - b.effectiveChances; });
    }

    /** Rarest item that can be dropped. */
    get rarestItem() { return this.drops[0] || null; }

    /**
     * All mandatory items.
     * @returns {{ id: string, quantity: number }[]}
     */
    get mandatory() {
        return this.drops.map(function(d) {
            return {
                'id': d.id,
                'quantity': d.alwaysDrop
            };
        }).filter(function(d) { return d.id && d.quantity >= 1; });
    }

    /**
     * Gifts an item based on history.
     * @param {"NORMAL"|"GENTLE"} algorithm The algorithm to use. NORMAL will use exact drop rates, GENTLE will please the user by giving higher chances of obtaining rare and almost always items.
     * @param {{ id: string, quantity: number }[]} history History of all tries. Length must be greater than count.
     * @param {number} count Number of tries before obtaining the rarest item. 0 means no gift.
     * @returns {Drop|null}
     */
    gift(algorithm, history, count) {
        history = validate('array', history).map(function(h) {
            return {
                'id': validate('string', h ? h.id : ''),
                'quantity': Math.round('number', h ? h.number : 0)
            };
        }).filter(function(h) { return h && h.id && h.number >= 1 });

        count = Math.round(validate('number', count));

        if (count === 0 || history.length < count) { return null; }

        const rarest = this.rarestItem;
        if (rarest.chances <= 5 && !history.filter(function(h) { return h.id === rarest.id && h.quantity >= 1; }).length && Math.random() <= rarest[algorithm === 'GENTLE' ? 'gentleChances' : 'effectiveChances'] * 5) { return rarest; }
        else { return null; }
    }

    /**
     * Get drops from the dropper.
     * @param {"NORMAL"|"GENTLE"} algorithm The algorithm to use. NORMAL will use exact drop rates, GENTLE will please the user by giving higher chances of obtaining rare and almost always items.
     * @param {number} required Minimum number of drops to have.
     * @param {number} max Maximum number of drops to have. Doesn't include the mandatory ones.
     * @param {number} gift Gift rarest item to user after a certain number of tries. You must include a history for it to work. 0 is no gifts. Chances of obtaining the item are 5x higher than normal. Only works if rarest item chances <= 5%.
     * @param {{ id: string, quantity: number }[]} history History of previous drops.
     * @returns {{ id: string, quantity: number }[]}
     */
    drop(algorithm = 'NORMAL', required = 1, max = 0, gift = 0, history = []) {
        if (this.drops.length === 0) { return []; }

        required = Math.max(0, Math.round(validate('number', required)));
        max = Math.round(validate('number', max));

        const mandatory = this.mandatory;
        const itemToGift = gift > 0 ? this.gift(history, gift) : null;

        let drops = 0;
        let tries = 0;
        if (itemToGift) {
            drops++;
            tries++;
            mandatory.push(itemToGift);
        }

        while (tries === 0 || drops < required || tries < Math.max(0, required, max)) {
            let drop = null;

            for (let i = 0; i < this.drops.length && !drop; i++) { drop = this.drops[i].drop(algorithm) || null; }

            if (drop) {
                drops++;

                const existing = mandatory.find(function(d) { return d.id === drop; });
                if (existing) { existing.quantity++; }
                else { mandatory.push({ 'id': drop, 'quantity': 1 }); }
            }

            tries++;
        }

        return mandatory;
    }
}

module.exports = Dropper;

/**
 * @typedef {Object} drop
 * @property {id} drop.id ID of the item. Must be a string.
 * @property {number} drop.chances Chances of dropping the item. 1 = 1% chances, 0.01 means 1/10,000 chances. Note: 100% means that you will always have one dropping. 120% means 1 always dropping and 20% chances to drop a second one.
 */