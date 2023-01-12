import React, {useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import classes from './Map.module.css'
import {OpenStreetMapProvider} from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();
const Map = (props) => {

    const [markers, setMarkers] = useState([])
    const getSingleEntry = async (entryId) => {
        const response = await fetch(`https://wavy-media-proxy.wavyapps.com/investors-notebook/?action=get_entry&entry_id=${entryId}`)
            .then((result) => {
                return result.json()
            })
            .then((entries) => {
                return entries
            })
        if (!response?.length) {
            return
        }
        return response[0]
    }
    const getSearch = async (entries) => {
        for (const entry of entries) {
            const results = await provider.search({query: entry.Address});
            if (results?.length) {
                const isMarkerInArray = markers.find(m => {
                    return m.entryId === entry.Id
                })
                if (isMarkerInArray) {
                    return
                }
                const singleEntry = await getSingleEntry(entry.Id)
                setMarkers([...markers, {
                    entryId: entry.Id,
                    lat: results[0].x,
                    lon: results[0].y,
                    notes: singleEntry.Notes,
                }])
            }
        }
    }
    const {entries} = props
    useEffect(() => {
        if (entries?.length) {
            getSearch(entries)
        }
    }, [entries?.length])

    const position = markers?.length ? [markers[0].y, markers[0].x] : [52.2317641, 21.005799675758887]
    return (
        <div id='map'>
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} className={classes.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map(m => {
                    return <Marker key={m.entryId} position={[m.lon, m.lat]}>
                        <Popup>
                            {m.notes}
                        </Popup>
                    </Marker>
                })}
            </MapContainer>
        </div>
    )
}
export default Map