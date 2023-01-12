import {useEffect, useState} from "react";

const Indicator = (props) => {

    const {entries: oldEntries} = props;
    const [newEntriesCount, setNewEntriesCount] = useState([])
    const fetchEntries = async () => {
        const results = await fetch('https://wavy-media-proxy.wavyapps.com/investors-notebook/?action=get_entries')
        const response = await results.json();
        setNewEntriesCount(response?.length ? response.length : [])
        return response
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchEntries()
        }, [60000])
        return () => clearInterval(interval);
    }, [])
    const entriesDifference = newEntriesCount > oldEntries.length ? newEntriesCount - oldEntries.length : 0;
    return (<h1>
        Don't miss out! Number of new entries: {entriesDifference}
    </h1>)
}

export default Indicator