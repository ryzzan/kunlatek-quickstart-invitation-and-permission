export enum MathOperatorEnum {
    Addition = 'addition',
    Subtraction = 'subtraction',
    Multiplication = 'multiplication',
    Division = 'division',
}

export function calculate(params: { operator: MathOperatorEnum, elements: any[], roundTo?: number; }) {

    let total = params.elements.reduce((prev, current, index) => {

        if (!current) return prev;
        if (typeof current === 'function') current = current();
        if (typeof current !== 'number') current = parseFloat(current);

        switch (params.operator) {
            case MathOperatorEnum.Addition:
                return prev += current;

            case MathOperatorEnum.Subtraction:
                if (!index) return current;
                return prev -= current;

            case MathOperatorEnum.Multiplication:
                if (!index) return current;
                else return prev * current;

            case MathOperatorEnum.Division:
                if (!index) return current;
                else return prev / current;

            default:
                break;
        }

    }, 0);

    if (params.roundTo) total = Math.round((total + Number.EPSILON) * Math.pow(10, params.roundTo)) / Math.pow(10, params.roundTo);

    return total;
}

export function calculateArray(params: { array: any[], fieldsArray: string[], composedField: string, operator: MathOperatorEnum, roundTo?: number; }) {
    let array = params.array;
    for (let arrayIndex = 0; arrayIndex < array.length; arrayIndex++) {
        const element = array[arrayIndex];

        let elements: any[] = [];
        for (let fieldsIndex = 0; fieldsIndex < params.fieldsArray.length; fieldsIndex++) {
            const field = params.fieldsArray[fieldsIndex];
            elements = [...elements, element[field]];
        }

        array[arrayIndex][params.composedField] = calculate({ operator: params.operator, elements, roundTo: params.roundTo });

    }

    return array;
}