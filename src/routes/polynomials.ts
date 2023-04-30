
export class Vector {
    constructor(readonly values: number[]) {
    }

    multiply(n: number) {
        const r = this.values.map(x => x * n);
        return new Vector(r);
    }

    add(v: Vector) {
        if (v.dimension !== this.dimension)
            throw 'add: Two vectors must have same dimension';

        const r = [...this.values];
        for (let i = 0; i < r.length; i++)
            r[i] += v.values[i];
        return new Vector(r)
    }

    static zero(dimension: number) {
        return new Vector(Array(dimension).fill(0))
    }

    get dimension() {
        return this.values.length;
    }
}

export class Polynomial {
    constructor(readonly coefficients: Vector[]) {
        if (coefficients.length === 0)
            throw 'At least 1 coefficient must be supplied';
    }

    get coefficientDimension() {
        return this.coefficients[0].dimension;
    }

    eval(t: number): Vector {
        let r = Vector.zero(this.coefficientDimension);

        for (let i = 0; i < this.coefficients.length; i++)
            r = r.add(this.coefficients[i].multiply(Math.pow(t, i)));

        return r;
    }

    add(p: Polynomial): Polynomial {
        const sum = [];

        const length = Math.max(p.coefficients.length, this.coefficients.length);
        for (let i = 0; i < length; i++)
            sum[i] = (p.coefficientAt(i)).add(this.coefficientAt(i));

        return new Polynomial(sum);
    }

    coefficientAt(index: number) {
        return this.coefficients[index] || Vector.zero(this.coefficientDimension);
    }

    multiply(p: Polynomial) {
        if (p.coefficientDimension !== 1)
            throw 'can only multiply with polynomials where coefficients are numbers, not vectors';

        const r = Array((this.coefficients.length - 1) + (p.coefficients.length - 1) + 1).fill(
            Vector.zero(this.coefficientDimension)
        );

        for (let i = 0; i < this.coefficients.length; i++) {
            for (let j = 0; j < p.coefficients.length; j++)
                r[i + j] = r[i + j].add(this.coefficients[i].multiply(p.coefficients[j].values[0]));
        }

        return new Polynomial(r);
    }
}