import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'
import Login from './Login'

const PleaseLogin = props => <Query query={CURRENT_USER_QUERY}>
    {({data, loading}) => {
        if (loading) return <p>Loading</p>
        if (!data.me) {
            return (
                <div>
                    <p>Please Log in before Continuing</p>
                    <Login />
                </div>
            )
        }
        // Within Sell --> <PleaseLogin> is parent to Create Item Page
        return props.children;
    }}
</Query>

export default PleaseLogin;