import fetch from 'isomorphic-fetch'
import React, { Component } from 'react';
import logo from './logo.svg';
import {sortBy} from 'lodash'
import classNames from 'classnames'
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

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
	const {searchKey, results} = prevState
	const oldHits = results && results[searchKey]
		? results[searchKey].hits
		: []
	const updatedHits = [
		...oldHits,
		...hits,
	]
	return {
		results: {
			...results,
			[searchKey]: {hits: updatedHits, page}
		},
		isLoading: false
	}
}

const dismissResult = id => prevState => {
	const {searchKey, results} = prevState
	const {hits, page} = results[searchKey]
	const isNotId = item => item.objectID !== id
	const updatedHits = hits.filter(isNotId)
	return {
		results: {
			...results,
			[searchKey]: {hits: updatedHits, page}
		}
	}
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
		}
	}

	needsToSearchTopStories = searchTerm =>
		!this.state.results[searchTerm]

	setSearchTopStories = result => {
		const {hits, page} = result
		this.setState(updateSearchTopStoriesState(hits, page))
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

	onDismiss = id =>
		this.setState(dismissResult(id))

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
						onDismiss={this.onDismiss}
					/>
				}
				<div className='interactions'>
					<ButtonWithLoading
						isLoading={isLoading}
						onClick={() => this.fetchSearchTopStories(searchKey,
																	page + 1)}>
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

const Sort = ({sortKey, activeSortKey, onSort, children}) => {
	const sortClass = classNames(
		'button-inline',
		{'button-active': sortKey === activeSortKey})
	return (
		<Button 
			onClick={() => onSort(sortKey)}
			className={sortClass}
		>
			{children}
		</Button>
	)
}

const sortSelector = (sortBy, width, onSort, sortKey) =>
	<span style={{width}}>
		<Sort
			sortKey={sortBy.toUpperCase()}
			onSort={onSort}
			activeSortKey={sortKey}
		>
			{sortBy}
		</Sort>
	</span>

class Table extends Component {
	constructor(props) {
		super(props)
		this.state = {
			sortKey: 'NONE',
			isSortReverse: false,
		}
	}

	onSort = sortKey => {
		const isSortReverse 
			= this.state.sortKey === sortKey && !this.state.isSortReverse
		this.setState({sortKey, isSortReverse})
	}

	render() {
		const {
			list,
			onDismiss
		} = this.props
		const {
			sortKey,
			isSortReverse
		} = this.state
		const sortedList = SORTS[sortKey](list)
		const reverseSortedList = isSortReverse
			? sortedList.reverse()
			: sortedList
		return (
			<div className='table'>
				<div className='table-header'>
					{sortSelector('Title', '40%', this.onSort, sortKey)}
					{sortSelector('Author', '30%', this.onSort, sortKey)}
					{sortSelector('Comments', '10%', this.onSort, sortKey)}
					{sortSelector('Points', '10%', this.onSort, sortKey)}
					<span style={{width: '10%'}}>Archive</span>
				</div>
				{reverseSortedList.map(item =>
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
		)
	}
}

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
