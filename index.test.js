const helper = require('./index.js');
const testHelper = require('./index.test-helpers.js')

describe('Asserting that value is not undefined or null', () => {
    const defaultMessage = 'Value must not be undefined or null';
    const defaultMessageRejection = 'Message must not be null';

    test('fails for undefined', () => {
        expect(() => helper.assertNotUndefinedOrNull(undefined, defaultMessage)).toThrow(new Error(defaultMessage));
    })

    test('fails for null', () => { 
        expect(() => helper.assertNotUndefinedOrNull(null, defaultMessage)).toThrow(new Error(defaultMessage));
    })

    test('fails for undefined message', () => {
        expect(() => helper.assertNotUndefinedOrNull(undefined, undefined)).toThrow(new Error(defaultMessageRejection));
    })

    test('fails for null message', () => {
        expect(() => helper.assertNotUndefinedOrNull(undefined, null)).toThrow(new Error(defaultMessageRejection));
    })

    test('can take a custom message', () => {
        const customMessage = 'No undefined please'
        expect(() => helper.assertNotUndefinedOrNull(undefined, customMessage)).toThrow(new Error(customMessage));
    })
});

describe('Asserting that value is a number', () => {
    test.each`
        value
        ${0}
        ${-1.5}
        ${3.67}
    `('succeeds for value $value', ({value}) => {
        expect(helper.assertNumber(value));
    })

    test('fails for undefined', () => { 
        expect(() => helper.assertNumber(undefined)).toThrow(new Error('Value must not be undefined or null'));
    })

    test('fails for null', () => { 
        expect(() => helper.assertNumber(null)).toThrow(new Error('Value must not be undefined or null'));
    })

    test('fails for NaN', () => { 
        expect(() => helper.assertNumber(NaN)).toThrow(new Error('Value is not a number'));
    })
});

describe('Formatting a quantity', () => {
    test.each`
        value    | fixedPoints | unitOfMeasurement | expected
        ${0}     | ${0}        | ${'mm'}           | ${'0 mm'}
        ${0}     | ${1}        | ${'kg'}           | ${'0.0 kg'}
        ${-1.25} | ${1}        | ${'°C'}           | ${'-1.3 °C'}
    `('for value $value with unit \'$unitOfMeasurement\' and $fixedPoints fixed point digits, returns \'$expected\'', ({value, fixedPoints, unitOfMeasurement, expected}) => {
        expect(helper.formatQuantity(value, fixedPoints, unitOfMeasurement)).toBe(expected);
    });

    test('for value null fails', () => {
        expect(() => helper.formatQuantity(null)).toThrow(new Error('Value must not be undefined or null'));
    });
});

describe('Percentage formatting', () => {
    test('for \(1.7, 2\) returns \'1.70 %\'', () => {
        expect(helper.formatPercentage(1.7, 2)).toBe('1.70 %');
    });

    test('for \(1.73\) returns \'1.7 %\'', () => {
        expect(helper.formatPercentage(1.7)).toBe('1.7 %');
    });
});

describe('Temperature formatting', () => {
    test('for \(1.34, 1\) returns \'1.3 °C\'', () => {
        expect(helper.formatTemperature(1.34, 1)).toBe('1.3 °C');
    });

    test('for \(1.76\) returns \'1.8 %\'', () => {
        expect(helper.formatTemperature(1.76)).toBe('1.8 °C');
    });
});

describe('Set item state', () => {
    test.each`
        itemState      | newState
        ${'OFF'}       | ${'OFF'}
        ${'OFF'}       | ${'ON'}
        ${'ON'}        | ${'ON'}
        ${'ON'}        | ${'OFF'}
        ${'undefined'} | ${'OFF'}
        ${'null'}      | ${'OFF'}
    `('for item with state $itemState to new state $newState succeeds', ({itemState, newState}) => {
        // Given is an item
        const item = testHelper.createItemWithState(itemState);

        // If I set the item state
        helper.setItemState(item, newState);

        // And the sendCommand function was called once
        expect(item.sendCommand).toHaveBeenCalledWith(newState);
    })

    test('for invalid items or states fails', () => {
        const item = testHelper.createItemWithState('ON');

        expect(() => helper.setItemState(undefined, undefined)).toThrow('Item must not be undefined or null');
        expect(() => helper.setItemState(null, undefined)).toThrow('Item must not be undefined or null');
        expect(() => helper.setItemState(item, undefined)).toThrow('State must not be undefined or null');
        expect(() => helper.setItemState(item, null)).toThrow('State must not be undefined or null');
    });
});

describe('Script executed', () => {

    test('by script and checked for \'script\' returns true', () => {
        const source = 'script';
        const scriptContext = testHelper.createScriptContextWithEventSource(source);

        expect(helper.isExecutedBySource(scriptContext, source)).toBe(true);
    });

    test('by script and checked for \'manual\' returns false', () => {
        const source = 'script';
        const scriptContext = testHelper.createScriptContextWithEventSource(source);

        expect(helper.isExecutedBySource(scriptContext, 'manual')).toBe(false);
    });
});
