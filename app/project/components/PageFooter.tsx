import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function PageFooter() {
    return (
        <LinearGradient
            colors={["#1b18b6", "#3c38c0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pageFooterContainer}
        >
            <View style={styles.pageFooterInner}>
                <Image source={require("../../../assets/user.png")} style={styles.footerLogo} />
                <View style={styles.footerTextBlock}>
                    <Text style={styles.footerAppName}>Project Manager Assistant</Text>
                    <Text style={styles.footerContact}>karina@example.com · your-site.example</Text>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    //Footer
    pageFooterContainer: {
        width: "100%",
        alignSelf: "center",
        marginTop: 24,
        paddingTop: 18,
        paddingBottom: 32,
        borderRadius: 0,
        borderTopWidth: 0,
        position: "relative",
    },

    pageFooterInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },

    footerLogo: {
        width: 48,
        height: 48,
        borderRadius: 10,
        marginRight: 12
    },

    footerTextBlock: {
        alignItems: "flex-end"
    },

    footerAppName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff"
    },

    footerContact: {
        fontSize: 15,
        color: "#e0e7ff",
        marginTop: 2
    },

});

