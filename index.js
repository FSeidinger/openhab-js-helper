const { actions, time, items } = require('openhab');

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

/*
    The event when triggered by UI is like this:

    {
        "eventClass": "org.openhab.core.automation.events.ExecutionEvent",
        "payload": {},
        "eventType": "manual"
    }

    The event when triggered by item state change is like this:

    {
        "receivedState": "65 %",
        "eventClass": "org.openhab.core.items.events.ItemStateUpdatedEvent",
        "payload": {
            "type": "Quantity",
            "value": "65 %"
        },
        "itemName": "Badezimmer_Klima_Luftfeuchtigkeit",
        "eventType": "update",
        "triggerType": "ItemStateUpdateTrigger",
        "module": "795328d5-04c2-441b-96c8-5f1eef990eb8"
    }  
*/

function enhanceEvent(event, itemName, logEvent = false) {
    if (event.eventType === "manual") {
        const item = items.getItem(itemName)
        event.itemName = item.name
        event.payload = {
            "type" : item.type,
            "value": item.state
        }

        console.info("Enhanced event due to manual call")
    }

    if (logEvent) {
        console.info("Event is", event)
    }

    return event
}

function processWindowContactForHeatingLock(event, context, windowContact, heatingLock) {
    const payload = event.payload

    if (payload.value === "OPEN") {
        // Reset old timer after window was opened
        resetTimer(context, windowContact, heatingLock)

        // Schedule a new timer
        scheduleTimer(context, windowContact, heatingLock)
    } else {
        // Reset timer after window was closed
        resetTimer(context, windowContact, heatingLock)
    }
}

function scheduleTimer(context, windowContact, heatingLock) {
    var scheduledTime = time.ZonedDateTime.now().plusSeconds(180);
  
    context.timer = actions.ScriptExecution.createTimer(scheduledTime, function() {
        switchOffHeating(context, windowContact, heatingLock);
    });

    console.debug("Scheduled timer for", windowContact.name)
}

function resetTimer(context, windowContact, heatingLock) {
    if (typeof context.timer !== 'undefined') {
        context.timer.cancel()
        context.timer = undefined

        console.debug("Cancelled timer for", windowContact.name)
    }

    heatingLock.sendCommand("OFF")
    console.info("Switched off heating lock", heatingLock.name)
}

function switchOffHeating(context, windowContact, heatingLock) {
    if (windowContact.state === "NULL" || windowContact.state === "OPEN") {
        heatingLock.sendCommand("ON")
        console.info("Switched on heating lock", heatingLock.name)
    } else {
        console.info("Switched off heating lock", heatingLock.name, "due to window closing during grace time period")
    }
    
    context.timer = undefined
}

module.exports = {
    formatQuantity,
    formatPercentage,
    formatTemperature,
    setItemState,
    isExecutedBySource,
    assertNotUndefinedOrNull,
    assertNumber,
    enhanceEvent,
    processWindowContactForHeatingLock
};