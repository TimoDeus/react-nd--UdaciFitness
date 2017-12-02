import React, {Component} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {getMetricMetaInfo, timeToString} from '../utils/helpers';
import UdaciSlider from '../components/UdaciSlider';
import UdaciSteppers from '../components/UdaciSteppers';
import DateHeader from '../components/DateHeader';
import {Ionicons} from '@expo/vector-icons';
import TextButton from './TextButton';

const SubmitBtn = ({onPress}) => (
	<TouchableOpacity onPress={onPress}>
		<Text>Submit</Text>
	</TouchableOpacity>
);

export default class AddEntry extends Component {

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
		this.setState({
			run: 0,
			bike: 0,
			swim: 0,
			sleep: 0,
			eat: 0,
		});
	};

	reset = () => {
		const key = timeToString();
		const entry = this.state;
		this.setState({
			run: 0,
			bike: 0,
			swim: 0,
			sleep: 0,
			eat: 0,
		});
	};

	render() {
		const metaInfo = getMetricMetaInfo();

		if (this.props.alreadyLogged) {
			return (
				<View>
					<Ionicons
						name='ios-happy-outline'
						size={100}
					/>
					<Text>You already logged your information for today.</Text>
					<TextButton onPress={this.reset}>Reset</TextButton>
				</View>
			);
		}

		return (
			<View>
				<DateHeader date={new Date().toLocaleDateString()}/>
				{Object.keys(metaInfo).map(key => {
					const {getIcon, type, ...rest} = metaInfo[key];
					const value = this.state[key];
					return (
						<View key={key}>
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
