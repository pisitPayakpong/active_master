import React, { Component } from "react";
import { Select } from "antd";
import { map } from "lodash";

class Selector extends Component {
    renderOption = options => {
        return map(options, (option, key) => {
            return (
                <Option value={option?.value} key={key}>
                    {option?.text}
                </Option>
            );
        });
    };

    renderSelectStatus = () => {
        const {
            data,
            onChange,
            value,
            width = "150px",
            renderTitle = true
        } = this.props;
        return (
            <>
                {renderTitle && (
                    <>
                        Select: <span> </span>
                    </>
                )}
                <Select
                    value={value}
                    placeholder="Select a option and change input text above"
                    style={{ width: width }}
                    onChange={onChange}
                >
                    {this.renderOption(data)}
                </Select>
            </>
        );
    };

    render() {
        return <>{this.renderSelectStatus()}</>;
    }
}

export default Selector;
