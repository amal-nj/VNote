import React from 'react'
import { View, StatusBar, ActivityIndicator, AsyncStorage, StyleSheet, Text } from 'react-native'

export default class AuthLoadingScreen extends React.Component {

    constructor(props) {
        super(props);
        this._bootstrap();
    }

    _bootstrap = async () => {

        const userToken = await AsyncStorage.getItem('userToken');

        // console.log(this.props)

        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});