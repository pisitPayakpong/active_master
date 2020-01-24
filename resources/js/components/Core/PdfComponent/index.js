import React, { PureComponent } from "react";
import {
    PDFViewer,
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from "@react-pdf/renderer";
import GlassList from "../../GlassTable";

const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "#E4E4E4"
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

export default class PdfComponent extends PureComponent {
    render() {
        const { render } = this.props;

        let renderComponent = (
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <GlassList />
                </View>
                {/* <View style={styles.section}>
                    <Text>Section #2</Text>
                </View> */}
            </Page>
        );

        return (
            <PDFViewer>
                <Document>{renderComponent}</Document>
            </PDFViewer>
        );
    }
}
