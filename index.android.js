/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import TabNavigator from "react-native-tab-navigator";
import Ionicons from "react-native-vector-icons/Ionicons";

import Account from "./app/account/index";
import Creation from "./app/creation/index";
import Edit from "./app/edit/index";

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Navigator
} from 'react-native';

export default class dogTalk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "home"
    }
  }


  render() {
    return (
      <TabNavigator>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'home'}
          //title="Home"
          renderIcon={() => <Ionicons name='ios-videocam-outline' size={30} />}
          renderSelectedIcon={() => <Ionicons name='ios-videocam' size={30} color="#ee735c" />}
          onPress={() => this.setState({ selectedTab: 'home' })}>
          <Navigator
            initialRoute={{
              name: 'list',
              component: Creation
            }}
            configureScene={(route) => {
              return Navigator.SceneConfigs.FloatFromRight;
            }}
            renderScene={(route, navigator) => {
              var Component = route.component;
              return <Component {...route.params} navigator={navigator} />
            }}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'edit'}
          //title="Profile"
          renderIcon={() => <Ionicons name="ios-recording-outline" size={30} />}
          renderSelectedIcon={() => <Ionicons name='ios-recording' size={30} color="#ee735c" />}
          onPress={() => this.setState({ selectedTab: 'edit' })}>
          <Navigator
            initialRoute={{
              name: 'edit',
              component: Edit
            }}

            configureScene={(route) => {
              return Navigator.SceneConfigs.FloatFromRight;
            }}

            renderScene={(route, navigator) => {
              let Component = route.component;
              return <Component {...route.params} navigator={navigator} />
            }}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'more'}
          // title="Home"
          renderIcon={() => <Ionicons name='ios-more-outline' size={30} />}
          renderSelectedIcon={() => <Ionicons name='ios-more' size={30} color="#ee735c" />}
          onPress={() => this.setState({ selectedTab: 'more' })}>
          <Navigator
            initialRoute={{
              name: 'account',
              component: Account
            }}
            configureScene={(route) => {
              return Navigator.SceneConfigs.FloatFromRight;
            }}
            renderScene={(route, navigator) => {
              let Component = route.component;
              return <Component {...route.params} navigator={navigator} />
            }}
          />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}



AppRegistry.registerComponent('dogTalk', () => dogTalk);
