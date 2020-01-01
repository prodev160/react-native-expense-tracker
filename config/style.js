import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    droidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
    },
    dashboardWidgetText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlignVertical: "center"
    },
    rowStyle: {
        marginHorizontal:  10, 
        borderBottomWidth: 1, 
        borderBottomColor: "lightgrey"
    },
    dashboardWidgetContainer: {
        flexDirection: "row", 
        justifyContent: "space-evenly",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "grey",
        marginLeft: 2,
        marginTop: 6,
        marginRight: 2,
        padding: 2
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        backgroundColor: '#F6820D',
        borderColor: '#F6820D',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff'
    },
    buttonSignup: {
        fontSize: 12
    },
    titleText: {
        fontSize: 48,
        textAlign: 'center'
    },
    subtitleText: {
        fontSize: 32,
        textAlign: 'center'
    },
    boldText18: {
        fontSize: 18,
        fontWeight: "bold"
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold'
    },
});

export default function appStyle() {
    return styles;
}