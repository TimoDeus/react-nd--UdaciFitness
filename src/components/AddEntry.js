import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getDailyReminderValue, getMetricMetaInfo, timeToString} from '../utils/helpers';
import UdaciSlider from '../components/UdaciSlider';
import UdaciSteppers from '../components/UdaciSteppers';
import DateHeader from '../components/DateHeader';
import {Ionicons} from '@expo/vector-icons';
import TextButton from './TextButton';
import {removeEntry, submitEntry} from '../utils/API';
import {connect} from 'react-redux';
import {addEntry} from '../actions/index';
import {purple, white} from '../utils/colors';
import {NavigationActions} from 'react-navigation';

const SubmitBtn = ({onPress}) => (
	<TouchableOpacity
		onPress={onPress}
		style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
	>
		<Text style={styles.submitBtnText}>Submit</Text>
	</TouchableOpacity>
);

class AddEntry extends Component {

	state = {
		run: 0,
		bike: 0,
		swim: 0,
		sleep: 0,
		eat: 0,
	};

	increment = metric => {
		const {max, step} = getMetricMetaInfo(metric);
		this.setState(state => {
			const count = state[metric] + step;
			return {
				...state,
				[metric]: Math.min(count, max)
			};
		});
	};

	decrement = metric => {
		const {step} = getMetricMetaInfo(metric);
		this.setState(state => {
			const count = state[metric] - step;
			return {
				...state,
				[metric]: Math.max(count, 0)
			};
		});
	};

	slide = (metric, value) => {
		this.setState(() => ({
			[metric]: value
		}));
	};

	submit = () => {
		const key = timeToString();
		const entry = this.state;

		this.props.dispatch(addEntry({
			[key]: entry
		}));

		this.setState({
			run: 0,
			bike: 0,
			swim: 0,
			sleep: 0,
			eat: 0,
		});

		this.toHome();

		submitEntry({key, entry});

	};

	reset = () => {
		const key = timeToString();

		this.props.dispatch(addEntry({
			[key]: getDailyReminderValue()
		}));

		this.toHome();

		removeEntry({key})
	};

	toHome = () => {
		this.props.navigation.dispatch(NavigationActions.back({key: 'AddEntry'}))
	};

	render() {
		const metaInfo = getMetricMetaInfo();

		if (this.props.alreadyLogged) {
			return (
				<View style={styles.center}>
					<Ionicons
						name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
						size={100}
					/>
					<Text>You already logged your information for today.</Text>
					<TextButton
						onPress={this.reset}
						style={{padding: 10}}
					>
						Reset
					</TextButton>
				</View>
			);
		}

		return (
			<View style={styles.container}>
				<DateHeader date={new Date().toLocaleDateString()}/>
				{Object.keys(metaInfo).map(key => {
					const {getIcon, type, ...rest} = metaInfo[key];
					const value = this.state[key];
					return (
						<View key={key} style={styles.row}>
							{getIcon()}
							{type === 'slider' ?
								<UdaciSlider
									value={value}
									onChange={value => this.slide(key, value)}
									{...rest}
								/> :
								<UdaciSteppers
									value={value}
									onIncrement={() => this.increment(key)}
									onDecrement={() => this.decrement(key)}
									{...rest}
								/>
							}
						</View>
					);
				})}
				<SubmitBtn onPress={this.submit}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: white
	},
	iosSubmitBtn: {
		backgroundColor: purple,
		padding: 10,
		borderRadius: 7,
		height: 45,
		marginLeft: 40,
		marginRight: 40,
	},
	androidSubmitBtn: {
		backgroundColor: purple,
		padding: 10,
		borderRadius: 2,
		height: 45,
		paddingLeft: 30,
		paddingRight: 30,
		alignSelf: 'flex-end',
		justifyContent: 'center',
		alignItems: 'center'
	},
	submitBtnText: {
		color: white,
		fontSize: 22,
		textAlign: 'center',
	},
	row: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center'
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 30,
		marginRight: 30
	}
});

const mapStateToProps = state => {
	const key = timeToString();
	return {
		alreadyLogged: state[key] && typeof state[key].today === 'undefined'
	}
};

export default connect(mapStateToProps)(AddEntry);
