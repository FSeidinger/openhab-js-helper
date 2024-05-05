// Format a numeric value to a fixed point quantity
function formatQuantity(value, fixedPoints, unitOfMeasurement) {
    assertNumber(value);
    return `${value.toFixed(fixedPoints)} ${unitOfMeasurement}`
}

// Format a decimal value as a percentage string
function formatPercentage(value, fixedPoints = 1) {
    return formatQuantity(value, fixedPoints, '%');
}

// Format a decimal value as a temperature string
function formatTemperature(value, fixedPoints = 1) {
    this.assertNumber(value);
    return formatQuantity(value, fixedPoints, '°C')
}

function setItemState(item, state) {
    assertNotUndefinedOrNull(item, 'Item must not be undefined or null');
    assertNotUndefinedOrNull(state, 'State must not be undefined or null');

    if ((typeof item.state !== 'string') || (item.state !== state)) {
        console.info('Posting new state \'%s\' to item %s', );
    }

     item.sendCommand(state);
}

function isExecutedBySource(scriptContext, source) {
    return scriptContext.event.getSource().localeCompare(source) == 0;
}

function assertNotUndefinedOrNull(value, message) {
    if ((typeof message === 'undefined') || (message === null)) {
        throw new Error('Message must not be null');
    }

    if ((typeof value === 'undefined') || (value === null)) {
        throw new Error(message);
    }
}

function assertNumber(value) {
    assertNotUndefinedOrNull(value, 'Value must not be undefined or null');

    if (typeof value !== 'number' || Number.isNaN(value)) {
        throw new Error('Value is not a number');
    }
}

module.exports = {
    formatQuantity,
    formatPercentage,
    formatTemperature,
    setItemState,
    isExecutedBySource,
    assertNotUndefinedOrNull,
    assertNumber
};