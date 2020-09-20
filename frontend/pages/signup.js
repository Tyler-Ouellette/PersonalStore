import React from 'react'
import Signup from '../components/Signup'
import Login from '../components/Login'
import styled from 'styled-components'

const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
`

const SignupPage = props => {
    return (
        <Columns>
            <Signup />
            <Login />
            <Signup />
        </Columns>
    )
}

export default SignupPage