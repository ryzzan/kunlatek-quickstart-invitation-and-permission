export enum MathOperatorEnum {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
}

export function calculate(params: { operator: MathOperatorEnum, elements: any[], roundTo?: number }) {

    let total = params.elements.reduce((prev, current, index) => {

        if (!current) return prev
        if (typeof current === 'function') current = current()
        if (typeof current !== 'number') return prev

        switch (params.operator) {
            case MathOperatorEnum.Addition:
                return prev += current

            case MathOperatorEnum.Subtraction:
                if (!index) return current
                return prev -= current

            case MathOperatorEnum.Multiplication:
                if (!index) return current
                else return prev * current

            case MathOperatorEnum.Division:
                if (!index) return current
                else return prev / current

            default:
                break;
        }

    }, 0)

    if (params.roundTo) total = Math.round((total + Number.EPSILON) * Math.pow(10, params.roundTo)) / Math.pow(10, params.roundTo)

    return total
}