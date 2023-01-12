import {useEffect, useState} from "react";
import ResultsTable from "./components/ResultsTable";
import Map from "./components/Map";
import Indicator from "./components/Indicator";


const App = () => {
    const [entries, setEntries] = useState([])

    const fetchEntries = async () => {
        const results = await fetch('https://wavy-media-proxy.wavyapps.com/investors-notebook/?action=get_entries')
        const response = await results.json();
        setEntries([...response])
        return response
    }
    useEffect(() => {
        fetchEntries()
    }, [])

    if (!entries?.length) {
        return
    }
    return (
        <>
            <h1>Etap 2 & 3</h1>
            <ResultsTable entries={[...entries]}/>
            <Map entries={[...entries]}/>
            <Indicator entries={[...entries]}/>
        </>
    )
}

export default App