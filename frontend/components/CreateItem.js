import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import gql from 'graphql-tag'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`





export default class CreateItem extends Component {
    state = {
        title: '',
        description: "",
        image: "",
        largeImage: "",
        price: ""
    }
    
    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type == 'number' ? parseFloat(value) : value;
        // [name] is the computed value of the name variable
        this.setState({ [name]: val });
    }
    
    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
            {(createItem, {loading, error}) => (
                
                <Form onSubmit={async e => {
                    e.preventDefault();
                    const res = await createItem();
                    Router.push({
                        pathname: '/item',
                        query: { id: res.data.createItem.id }
                    })
                }}>
                    <Error error={error} />
                    <fieldset disabled={loading} area-busy={loading}>
                        <label htmlFor="title">
                            Title
                        </label>
                            <input type="text" id="title" name="title" placeholder="Title" value={this.state.title} onChange={this.handleChange} required/>
                        <label htmlFor="price">
                            Price
                        </label>
                            <input type="number" id="price" name="price" placeholder="Price" value={this.state.price} onChange={this.handleChange} required/>
                        <label htmlFor="description">
                            Description
                        </label>
                            <textarea id="description" name="description" placeholder="Enter a Description" value={this.state.description} onChange={this.handleChange} required/>
                        <button type="submit">Submit</button>
                    </fieldset>
                </Form>
                
            )}
            </Mutation>
        )
    }
}

export { CREATE_ITEM_MUTATION }