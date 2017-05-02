import TabNavigator from "react-native-tab-navigator";
import React, { Component } from "React";
import {
    Platform
} from "react-native";


export default class CusTabNavigator extend Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTab: ''
        }
    }

    render(){
        return (
            <TabNavigator>
                <TabNavigator.Item>

                </TabNavigator.Item>
            </TabNavigator>
        )
    }

    // 封装tabBarItem
    renderTabBarItem(title, iconName, selectedIconName, selectedTab, componentName, component, badgeText){
        return (
            <TabNavigator.Item
                title={title}
                renderIcon={() => <Image source={{ uri: iconName }} style={styles.iconStyle} />}
                renderSelectedIcon={() => <Image source={{ uri: selectedIconName }} style={styles.iconStyle} />}
                selected={this.state.selectedTab === selectedTab}
                onPress={() => this.setState({ selectedTab: selectedTab })}
                selectedTitleStyle={styles.selectedTitleStyle} //tabBarItem选中的文字样式
                badgeText={badgeText}
            >
                <Navigator
                    initialRoute={{ name: componentName, component: component }}
                    configureScene={() => {
                        return Navigator.SceneConfigs.PushFromRight;
                    }}
                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        return <Component {...route.passProps} navigator={navigator} />
                    }}
                />
            </TabNavigator.Item>
        )
    }

    const styles = StyleSheet.create({
    // icon默认样式
    iconStyle:{
        width: Platform.OS === 'ios' ? 30 : 25,
        height:Platform.OS === 'ios' ? 30 : 25,
    },
    // tabBarItem选中的文字样式
    selectedTitleStyle:{
        color: 'rgba(212,97,0,1)',
    }
});
}