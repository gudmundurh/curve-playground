import { describe, it, expect } from 'vitest';
import { Polynomial, Vector } from './polynomials';


describe('Vector tests', () => {
    it('gives correct zero', () => {
        const v = Vector.zero(2);
        expect(v.values).toEqual([0, 0]);
    });

    it('throws if vectors have different dimensions', () => {
        const v = new Vector([1]);
        const u = new Vector([1, 2]);

        expect(() => v.add(u)).toThrow();
    });

    it('adds correctly', () => {
        const v = new Vector([-1, 10]);
        expect(v.add(new Vector([2, 1])).values).toEqual([1, 11]);
    });

    it('multiplies correctly', () => {
        const v = new Vector([-1, 10]);
        expect(v.multiply(2).values).toEqual([-2, 20]);
    });
})

describe('Polynomial tests', () => {
    const V = (n: number) => new Vector([n]);

    it('empty poly not supported', () => {
        expect(() => new Polynomial([])).toThrow();
    });

    it('dimension is that of the coefficients', () => {
        const p = new Polynomial([new Vector([1, 2, 3])]);
        expect(p.coefficientDimension).toEqual(3);
    });

    it('constant poly evaluates to constant', () => {
        const p = new Polynomial([new Vector([5])]);
        expect(p.eval(2)).toEqual(new Vector([5]));
    });

    it('linear poly evaluates correctly', () => {
        const p = new Polynomial([new Vector([2]), new Vector([1])]);
        expect(p.eval(3)).toEqual(new Vector([5]));
    });

    it('adding polys adds coefficients', () => {
        const p = new Polynomial([V(2), V(1)]);
        const q = new Polynomial([V(3), V(2), V(1)]);
        const r = p.add(q);
        expect(r.coefficients).toEqual([V(5), V(3), V(1)]);
    });

    it('multiplying polys', () => {
        const p = new Polynomial([V(2), V(2)]);
        const q = new Polynomial([V(1), V(-1)]);
        const r = p.multiply(q);
        expect(r.coefficients).toEqual([V(2), V(0), V(-2)]);
    });

    it('differentiating constant poly gives zero', () => {
        const p = new Polynomial([V(5)]);
        const dp = p.differentiate();
        expect(dp.coefficients).toEqual([V(0)]);
    });

    it('differentiating linear poly gives constant', () => {
        // p(t) = 2 + 3t → p'(t) = 3
        const p = new Polynomial([V(2), V(3)]);
        const dp = p.differentiate();
        expect(dp.coefficients).toEqual([V(3)]);
    });

    it('differentiating quadratic poly multiplies by power index', () => {
        // p(t) = 1 + 2t + 3t² → p'(t) = 2 + 6t
        const p = new Polynomial([V(1), V(2), V(3)]);
        const dp = p.differentiate();
        expect(dp.coefficients).toEqual([V(2), V(6)]);
    });

    it('differentiating cubic poly', () => {
        // p(t) = 1 + 0t + 0t² + 4t³ → p'(t) = 0 + 0t + 12t²
        const p = new Polynomial([V(1), V(0), V(0), V(4)]);
        const dp = p.differentiate();
        expect(dp.coefficients).toEqual([V(0), V(0), V(12)]);
    });
});
