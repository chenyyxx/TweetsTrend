import React, { Component } from 'react';
import { Icon, Input, AutoComplete } from 'antd';

const Option = AutoComplete.Option;
const axios = require('axios').default;

// Use getAll method in category to get all the category name and find a match
class SearchBar extends Component {
    state = {
        dataSource:
            [
                { categoryName: "Trump" },
                { categoryName: "BlackFriday" }
            ],
    };
    // Send request to get all the result that starts with `value`
    // The request can be handled by Spring Data Jpa => findByCategoryNameStartingWith
    handleSearch = async (value) => {
        if (!value) {
            this.setState({
                dataSource: []
            })
        } else {
            const url = "http://localhost:8080/category/get/" + value
            const response = await axios.get(url)
            // console.log(this.state.dataSource)
            this.setState({
                dataSource: response.data.map(category => ({
                        categoryName: category.categoryName,
                        categoryId: category.categoryId,
                    }))
            })
        }
    };

    onSelect = (categoryName) => {
        this.props.handleSelectCategory(categoryName)
    };

    render() {
        const { dataSource } = this.state;
        const options = dataSource.map((category) => (
            <Option key={category.categoryName} value={category.categoryName} className="search-option">
                <span>{category.categoryName}</span>
            </Option>
        ));
        return (
            <AutoComplete
                className="search-bar"
                size="large"
                dataSource={options}
                onSelect={this.onSelect}
                onSearch={this.handleSearch}
                placeholder="Search an Event"
                optionLabelProp="value"
            >
                <Input
                    suffix={
                        <Icon type="search" className="search" />
                    }
                />
            </AutoComplete>
        );
    }
}

export default SearchBar;