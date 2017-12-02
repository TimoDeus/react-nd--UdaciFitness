import React from 'react';
import {View} from 'react-native';
import AddEntry from './src/components/AddEntry';

console.ignoredYellowBox = ['Remote debugger']; // eslint-disable-line no-console

export default class App extends React.Component {

	render() {
		return (
			<View>
				<AddEntry/>
			</View>
		);
	}
}
