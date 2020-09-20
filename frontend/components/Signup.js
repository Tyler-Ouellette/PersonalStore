import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!){
        signup(email: $email, name: $name, password: $password){
            id
            email
            name
        }
    }
`


export default class Signup extends Component {
    state = {
        name : '',
        password: '',
        email: ''
    }
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value})
    }
    
    render() {
        return (
            <Mutation mutation={SIGNUP_MUTATION} variables={this.state} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                { (signup, { error, loading }) => {
                return (
                    <Form method="post" onSubmit={ async (e) => {
                        e.preventDefault();
                        const res = await signup();
                        this.setState({name: '', email: '', password: ''})
                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign Up For an Account</h2>
                            <Error error={error} />
                            <label htmlFor="email">
                                Email
                                <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.saveToState} required/>
                            </label>
                            <label htmlFor="name">
                                Name
                                <input type="name" name="name" placeholder="Name" value={this.state.name} onChange={this.saveToState} required/>
                            </label>
                            <label htmlFor="password">
                                Password
                                <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.saveToState} required/>
                            </label>
                        </fieldset>
                        <button type="submit">Signup</button>
                    </Form>
                )
                }}
            </Mutation>
        )
    }
}
