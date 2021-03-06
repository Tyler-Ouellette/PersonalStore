import React from 'react'
import Head from 'next/head'
import Link from 'next/Link'
import PaginationStyles from '../components/styles/PaginationStyles'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { render } from 'nprogress'
import ErrorMessage from '../components/ErrorMessage'
import { perPage } from '../config'

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`

const Pagination = (props) => {
    return (
        <Query query={PAGINATION_QUERY}>
                {({ data, error, loading }) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <ErrorMessage error={error}/>
                    const count = data.itemsConnection.aggregate.count 
                    const pages = Math.ceil(count / perPage)
                    const page = props.page
                    return (
                        <PaginationStyles>
                            <Head>
                                <title>Sick Fits | {page} of {pages}</title>
                            </Head>
                            <Link href={{
                                    pathname: 'items',
                                    query: { page: page -1}
                                }}>
                                    <a className="prev" aria-disabled={page <= 1}>Prev</a>
                            </Link>
                            <p>Page {props.page} of {pages}</p>
                            <Link 
                                href={{
                                    pathname: 'items',
                                    query: { page: page +1}
                                }}>
                                    <a className="Next" aria-disabled={page >= pages}>Next</a>
                            </Link>
                        </PaginationStyles>
                    )}}
            </Query>
    )
}

export default Pagination;