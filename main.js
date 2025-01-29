function parsedata (str, base) {
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = 0n;
    base = BigInt(base);
    for (const c of str.toLowerCase()) {
        const value = BigInt(digits.indexOf(c));
        if (value >= base || value < 0n) {
            return " error parsing data";
        }
        result = result * base + value;
    }
    return result;
}

function Secret(jsonData) {
    const data = JSON.parse(jsonData);
    const k = data.keys.k;
    const points = [];
    for (const key of Object.keys(data)) {
        if (key === 'keys') continue;
        const x = BigInt(key);
        const entry = data[key];
        const base = parsedata(entry.base, 10);
        const valueStr = entry.value;
        const y = parsedata(valueStr, base);
        points.push({ x, y });
    }

    points.sort((a, b) => (a.x < b.x) ? -1 : (a.x > b.x) ? 1 : 0);

    const selectedPoints = points.slice(0, k);

    let sum_num = 0n;
    let sum_den = 1n;

    function gcd(a, b) {
        a = a < 0n ? -a : a;
        b = b < 0n ? -b : b;
        while (b !== 0n) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    for (let i = 0; i < selectedPoints.length; i++) {
        const xi = selectedPoints[i].x;
        const yi = selectedPoints[i].y;

        let term_num = yi;
        let term_den = 1n;

        for (let j = 0; j < selectedPoints.length; j++) {
            if (j === i) continue;
            const xj = selectedPoints[j].x;
            term_num *= (-xj);
            term_den *= (xi - xj);
        }

        const new_den = sum_den * term_den;
        const new_num = sum_num * term_den + term_num * sum_den;

        sum_num = new_num;
        sum_den = new_den;

        const current_gcd = gcd(sum_num, sum_den);
        sum_num /= current_gcd;
        sum_den /= current_gcd;
    }

    if (sum_den < 0n) {
        sum_num *= -1n;
        sum_den *= -1n;
    }

    if (sum_den !== 1n) {
        const final_gcd = gcd(sum_num, sum_den);
        sum_num /= final_gcd;
        sum_den /= final_gcd;
        if (sum_den !== 1n) {
            return "error computing solution";
            }
    }

    return sum_num;
}

const testCase1 = {
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
}
const secret1 = Secret(testCase1);
console.log(secret1.toString());

const testCase2 = {
    "keys": {
        "n": 10,
        "k": 7
      },
      "1": {
        "base": "6",
        "value": "13444211440455345511"
      },
      "2": {
        "base": "15",
        "value": "aed7015a346d63"
      },
      "3": {
        "base": "15",
        "value": "6aeeb69631c227c"
      },
      "4": {
        "base": "16",
        "value": "e1b5e05623d881f"
      },
      "5": {
        "base": "8",
        "value": "316034514573652620673"
      },
      "6": {
        "base": "3",
        "value": "2122212201122002221120200210011020220200"
      },
      "7": {
        "base": "3",
        "value": "20120221122211000100210021102001201112121"
      },
      "8": {
        "base": "6",
        "value": "20220554335330240002224253"
      },
      "9": {
        "base": "12",
        "value": "45153788322a1255483"
      },
      "10": {
        "base": "7",
        "value": "1101613130313526312514143"
      }
    }
const secret2 = Secret(testCase2);
console.log(secret2.toString());