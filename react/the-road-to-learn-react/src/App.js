import fetch from 'isomorphic-fetch'
import React, { Component } from 'react';
import logo from './logo.svg';
import {sortBy} from 'lodash'
import './App.css';

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = '100'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`

const SORTS = {
	NONE: list => list,
	TITLE: list => sortBy(list, 'title'),
	AUTHOR: list => sortBy(list, 'author'),
	COMMENTS: list => sortBy(list, 'num_comments').reverse(),
	POINTS: list => sortBy(list, 'points').reverse(),
}

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			results: null,
			searchKey: '',
			searchTerm: DEFAULT_QUERY,
			error: null,
			isLoading: false,
			sortKey: 'NONE',
		}
	}

	onSort = sortKey =>
		this.setState({sortKey})

	needsToSearchTopStories = searchTerm =>
		!this.state.results[searchTerm]

	setSearchTopStories = result => {
		const {hits, page} = result
		const {searchKey, results} = this.state
		const oldHits = results && results[searchKey]
			? results[searchKey].hits
			: []
		const updatedHits = [
			...oldHits,
			...hits
		]
		this.setState({
			results: {
				...results,
				[searchKey]: {hits: updatedHits, page}
			},
			isLoading: false,
		})
	}

	fetchSearchTopStories = (searchTerm, page = 0) => {
		this.setState({isLoading: true})
		fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&\
		${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
			.then(response => response.json())
			.then(result => this.setSearchTopStories(result))
			.catch(e => this.setState({error: e}))
	}

	componentDidMount = () => {
		const {searchTerm} = this.state
		this.setState({searchKey: searchTerm})
		this.fetchSearchTopStories(searchTerm)
	}

	onSearchSubmit = (e) => {
		const {searchTerm} = this.state
		this.setState({searchKey: searchTerm})
		if (this.needsToSearchTopStories(searchTerm)) {
			this.fetchSearchTopStories(searchTerm)
		}
		e.preventDefault()
	}

	onDismiss = id => {
		const {searchKey, results} = this.state
		const {hits, page} = results[searchKey]
		const isNotId = item => item.objectID !== id
		const updatedHits = hits.filter(isNotId)
		this.setState({
			result: {
				...results,
				[searchKey]: {hits: updatedHits, page}
			}
		})
	}

	onSearchChange = e => {
		this.setState({searchTerm: e.target.value})
	}

	render() {
		const {
			searchTerm,
			results,
			searchKey,
			error,
			isLoading,
			sortKey,
		} = this.state
		const page = (
			results &&
			results[searchKey] &&
			results[searchKey].page
		) || 0
		const list = (
			results &&
			results[searchKey] &&
			results[searchKey].hits
		) || []
		return (
			<div className='page'>
				<div className='interactions'>
					<Search
						value={searchTerm}
						onChange={this.onSearchChange}
						onSubmit={this.onSearchSubmit}
					>
						Search
					</Search>
				</div>
				{error
					? <div className='interactions'>
						<p>Something went wrong.</p>
					</div>
					: <Table
						list={list}
						sortKey={sortKey}
						onSort={this.onSort}
						onDismiss={this.onDismiss}
					/>
				}
				<div className='interactions'>
					<ButtonWithLoading
						isLoading={isLoading}
						onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
						More
					</ButtonWithLoading>
				</div>
			</div>
		)
	}
}

const Search = ({value, onChange, onSubmit, children}) => 
	<form onSubmit={onSubmit}>
		<input
			type='text'
			value={value}
			onChange={onChange}
		/>
		<button type="submit">
			{children}
		</button>
	</form>

const Table = ({list, pattern, onDismiss}) =>
	<div className='table'>
		{list.map(item =>
			<div key={item.objectID} className='table-row'>
				<span style={{width: '40%'}}>
					<a href={item.url}>{item.title}</a>
				</span>
				<span style={{width: '30%'}}>
					{item.author}</span>
				<span style={{width: '10%'}}>
					{item.num_comments}</span>
				<span style={{width: '10%'}}>
					{item.points}</span>
				<span style={{width: '10%'}}>
					<Button
						onClick={() => onDismiss(item.objectID)}
						className='button-inline'
					>
						Dismiss
					</Button>
				</span>
			</div>
		)}
	</div>

const Button = ({onClick, className = '', children}) =>
	<button
		onClick={onClick}
		className={className}
		type='button'
	>
		{children}
	</button>

const Loading = () =>
	<div>Loading ...</div>

const withLoading = (Component) => ({isLoading, ...rest}) =>
	isLoading
		? <Loading />
		: <Component {...rest} />

const ButtonWithLoading = withLoading(Button)

export default App;

export {
	Button,
	Search,
	Table,
}