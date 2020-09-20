import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import Error from './ErrorMessage'
import {CURRENT_USER_QUERY} from './User'

const LOGIN_MUTATION = gql`
    mutation LOGIN_MUTATION($email: String!, $password: String!){
        login(email: $email, password: $password){
            id
            email
            name
        }
    }
`


export default class Login extends Component {
    state = {
        email: '',
        password: '',
    }
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value})
    }
    
    render() {
        return (
        <Mutation mutation={LOGIN_MUTATION} variables={this.state} refetchQueries={[{query: CURRENT_USER_QUERY}]}>
                { (Login, { error, loading }) => {
                return (
                    <Form method="post" onSubmit={ async (e) => {
                        e.preventDefault();
                        const res = await Login();
                        this.setState({email: '', password: ''})
                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Login Your Account</h2>
                            <Error error={error} />
                            <label htmlFor="email">
                                Email
                                <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.saveToState} required/>
                            </label>
                            <label htmlFor="password">
                                Password
                                <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.saveToState} required />
                            </label>
                        </fieldset>
                        <button type="submit">Login</button>
                    </Form>
                )
                }}
            </Mutation>
        )
    }
}
