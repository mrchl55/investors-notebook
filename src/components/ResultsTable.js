import React from "react";
import {useState} from "react";
import classes from './ResultsTable.module.css'

const ResultsTable = (props) => {

    const {entries} = props
    const [currentPage, setCurrentPage] = useState(1)
    const entriesPerPage = 3;

    const handleClick = (event) => {
        setCurrentPage(+event.target.id)
    }
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = entries?.length ? entries.slice(indexOfFirstEntry, indexOfLastEntry) : [];
    const renderEntries = currentEntries.map((entry, index) => {

        return <tr key={index}>
            <td>
                {entry.Id}</td>
            <td>{entry.Address}</td>
            <td>{entry.Notes}</td>
        </tr>;
    });
    const pageNumbers = [];

    for (let i = 1; i <= entries.length / entriesPerPage; i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
        return (
            <li
                key={number}
                id={number}
                onClick={handleClick}
            >
                {number}
            </li>
        );
    });

    return (
        <div>
            <table className={classes.results}>
                <tbody>
                <tr className="title-row">
                    <td>ID</td>
                    <td>Address</td>
                    <td>Notes</td>
                </tr>
                {renderEntries}
                </tbody>
            </table>
            <h2>Pages:</h2>
            <ul className={classes.pagination}>
                {renderPageNumbers}
            </ul>
        </div>
    );

}

export default ResultsTable