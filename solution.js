const fs = require("fs");
const file = "./input.json";

const input = JSON.parse(fs.readFileSync(file, "utf-8"));
const { n, k } = input.keys;

const points = [];

function baseToBigInt(str, base) {
    if (base < 2 || base > 36) {
        throw new Error("Base must be between 2 and 36");
    }

    const digits = str.toLowerCase();
    const charset = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = 0n;
    let multiplier = 1n;

    for (let i = digits.length - 1; i >= 0; i--) {
        const digitChar = digits[i];
        const digitVal = charset.indexOf(digitChar);

        if (digitVal === -1 || digitVal >= base) {
            throw new Error(`Invalid digit '${digitChar}' for base ${base}`);
        }

        result += BigInt(digitVal) * multiplier;
        multiplier *= BigInt(base);
    }

    return result;
}

for (let i = 1; i <= n && points.length < k; i++) {
    const root = input[i.toString()];
    if (!root) continue;
    const x = BigInt(i);
    const base = parseInt(root.base);
    const y = baseToBigInt(root.value, base); // to convert
    points.push({ x, y });
}

function lagranges(points) {
    let result = 0n;

    for (let i = 0; i < points.length; i++) {
        const { x: xi, y: yi } = points[i];
        let numerator = 1n;
        let denominator = 1n;

        for (let j = 0; j < points.length; j++) {
            if (i === j) continue;
            const { x: xj } = points[j];
            numerator *= -xj;
            denominator *= (xi - xj);
        }

        const term = yi * numerator / denominator;
        result += term;
    }

    return result;
}

const secret = lagranges(points);
const output = secret.toString();

console.log(output);

fs.appendFileSync("output.txt", "\n" + output);
