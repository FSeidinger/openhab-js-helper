function createScriptContextWithEventSource(eventSource) {
    const scriptContext = new Object();
    scriptContext.event = new Object();
    scriptContext.event.getSource = function() {
        return eventSource;
    }

    return scriptContext;
}

function createItemWithState(itemState) {
    const item = jest.fn();
    item.state = jest.fn();
    item.state.mockReturnValue(itemState);
    item.sendCommand = jest.fn();

    return item;
}

module.exports = {
    createScriptContextWithEventSource,
    createItemWithState
};