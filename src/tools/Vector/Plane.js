
'use strict';

/**
 * A plane
 * @param p0 Support vector
 * @param a  One point on the screen
 * @param b  Another point on the screen
 * @constructor
 */
var Plane = function (p0, a, b) {
    var r1 = a.minus(p0); // Direction vector
    var r2 = b.minus(p0); // Direction vector

    if (r1.isLinearlyDependentOn(r2)) {
        throw new Error("Cannot create plane, r1 and r2 are linearly dependent");
    }

    // Normal form
    this.n = r2.cross(r1); // Normal vector
    this.p0 = p0;
};

/**
 * Calculate the intersection point of this plane and a given line
 * @param line
 * @returns {null|Vector}
 */
Plane.prototype.getIntersectionWith = function (line) {
    var a = this.p0.minus(line.l0).scalarProduct(this.n);
    var b = line.l.scalarProduct(this.n);

    // If a is 0 = line is parallel, if b is 0 = line is on the plane
    if (0 == a || 0 == b) {
        return null;
    }

    var d = a / b;

    return line.l.times(d).plus(line.l0);
};

// if (typeof modules !== 'undefined') {
//     modules.export = Line;
// }
