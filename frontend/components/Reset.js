import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Form from './styles/Form'
import Error from './ErrorMessage'
import {CURRENT_USER_QUERY} from './User'

const RESET_PASSWORD_MUTATION = gql`
    mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
            id
            email
            name
        }
    }
`

export default class Reset extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired,
        
    }
    state = {
        password: '',
        confirmPassword: ''
    }
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value})
    }
    
    render() {
        return (
        <Mutation 
            mutation={RESET_PASSWORD_MUTATION} 
            variables={{
                resetToken: this.props.resetToken,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            }} 
            refetchQueries={[{query: CURRENT_USER_QUERY}]}
        >
                { (RequestReset, { error, loading, called }) => {
                return (
                    <Form method="post" onSubmit={ async (e) => {
                        e.preventDefault();
                        await RequestReset();
                        this.setState({password: '', confirmPassword: ''})
                    }}>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Reset Your Password</h2>
                            <Error error={error} />
                            { !error && !loading && called && <p>Success! Check your email for a reset link.</p>}
                            <label htmlFor="password">
                                Password
                                <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.saveToState} required/>
                            </label>
                            <label htmlFor="confirmPassword">
                                Confirm Password
                                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.saveToState} required/>
                            </label>
                        </fieldset>
                        <button type="submit">Reset Password</button>
                    </Form>
                )
                }}
            </Mutation>
        )
    }
}
