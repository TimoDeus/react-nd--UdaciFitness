import React from 'react';
import {Platform, StatusBar, View} from 'react-native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './src/reducers/index';
import History from './src/components/History';
import {StackNavigator, TabNavigator} from 'react-navigation'
import {purple, white} from './src/utils/colors';
import {FontAwesome, Ionicons} from '@expo/vector-icons'
import AddEntry from './src/components/AddEntry';
import {Constants} from 'expo'
import EntryDetail from './src/components/EntryDetail'
import Live from './src/components/Live';

function UdaciStatusBar({backgroundColor, ...props}) {
	return (
		<View style={{backgroundColor, height: Constants.statusBarHeight}}>
			<StatusBar translucent backgroundColor={backgroundColor} {...props} />
		</View>
	)
}

console.ignoredYellowBox = ['Remote debugger']; // eslint-disable-line no-console

const Tabs = TabNavigator({
	History: {
		screen: History,
		navigationOptions: {
			tabBarLabel: 'History',
			tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor}/>
		},
	},
	AddEntry: {
		screen: AddEntry,
		navigationOptions: {
			tabBarLabel: 'Add Entry',
			tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor}/>
		},
	},
	Live: {
		screen: Live,
		navigationOptions: {
			tabBarLabel: 'Live',
			tabBarIcon: ({tintColor}) => <Ionicons name='ios-speedometer' size={30} color={tintColor}/>
		}
	}
}, {
	navigationOptions: {
		header: null
	},
	tabBarOptions: {
		activeTintColor: Platform.OS === 'ios' ? purple : white,
		style: {
			height: 56,
			backgroundColor: Platform.OS === 'ios' ? white : purple,
			shadowColor: 'rgba(0, 0, 0, 0.24)',
			shadowOffset: {
				width: 0,
				height: 3
			},
			shadowRadius: 6,
			shadowOpacity: 1
		}
	}
});

const MainNavigator = StackNavigator({
	Home: {
		screen: Tabs,
	},
	EntryDetail: {
		screen: EntryDetail,
		navigationOptions: {
			headerTintColor: white,
			headerStyle: {
				backgroundColor: purple,
			}
		}
	}
});


export default class App extends React.Component {

	render() {
		return (
			<Provider store={createStore(reducer)}>
				<View style={{flex: 1}}>
					<UdaciStatusBar backgroundColor={purple} barStyle="light-content"/>
					<MainNavigator/>
				</View>
			</Provider>
		);
	}
}
