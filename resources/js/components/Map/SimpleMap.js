import React, { Component } from "react";
import { Icon } from "antd";
import GoogleMapReact from "google-map-react";
import styled from "styled-components";

const StyledIcon = styled(Icon)`
    font-size: 40px;
`;

const AnyReactComponent = ({ text }) => (
    <div>
        <StyledIcon type="shop" />
    </div>
);

class SimpleMap extends Component {
    static defaultProps = {
        center: {
            lat: 59.95,
            lng: 30.33
        },
        zoom: 20
    };

    render() {
        const { data } = this.props;
        const center = {
            lat: parseFloat(data?.lat),
            lng: parseFloat(data?.lng)
        };

        return (
            // Important! Always set the container height explicitly
            <div style={{ height: "100vh", width: "100%" }}>
                <GoogleMapReact
                    //   bootstrapURLKeys={{ key: /* YOUR KEY HERE */ }}
                    defaultCenter={center}
                    defaultZoom={this.props.zoom}
                >
                    <AnyReactComponent
                        lat={data?.lat}
                        lng={data?.lng}
                        text={`Machine_${data?.sn}`}
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

export default SimpleMap;
