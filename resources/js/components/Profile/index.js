import React from "react";
import axios from "axios";
import FormUser from "../FormUser";

export default class Prorile extends React.PureComponent {
    state = {
        user: { data: [], loading: false },
        provinces: []
    };

    componentDidMount() {
        this.handleFetchUser(this.props?.match?.params?.id);
        this.handleFetchProvinces();
    }
    handleSetStep = () => {
        window.location.href = `/dashboard`;
    };

    handleFetchUser = userId => {
        this.setState({ loading: true });
        axios({
            url: `/api/test_v1/user/${userId}`,
            method: "get",
            data: {
                results: 10
            },
            type: "json"
        }).then(data => {
            this.setState({
                user: { data: data?.data?.data, loading: false }
            });
        });
    };

    handleFetchProvinces = () => {
        this.setState({ loading: true });
        axios({
            url: `/api/test_v1/province/as_options`,
            method: "get",
            type: "json"
        }).then(data => {
            this.setState({
                loading: false,
                provinces: data?.data
            });
        });
    };

    render() {
        const { user, provinces } = this.state;

        return (
            <FormUser
                handleSetStep={this.handleSetStep}
                mode="edit"
                data={user?.data}
                provinces={provinces}
            />
        );
    }
}
