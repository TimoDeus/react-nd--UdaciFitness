export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const ADD_ENTRIES = 'ADD_ENTRIES';

export const receiveEntries = entries => ({
	type: RECEIVE_ENTRIES,
	entries
});

export const addEntry = entry => ({
	type: ADD_ENTRIES,
	entry
});
