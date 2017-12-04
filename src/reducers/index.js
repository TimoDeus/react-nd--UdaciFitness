import {RECEIVE_ENTRIES, ADD_ENTRIES} from '../actions';

const entries = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_ENTRIES:
			return {
				...state,
				...action.entries
			};
		case ADD_ENTRIES:
			return {
				...state,
				...action.entry
			};
		default:
			return state;
	}
};

export default entries;
