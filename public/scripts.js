const fetchWojewodztwa = async () => {
    const response = await fetch('https://wavy-media-proxy.wavyapps.com/investors-notebook/data/wojewodztwa.json')
    const wojewodztwa = await response.json();
    return wojewodztwa;
}
let wojewodztwaList = ''
fetchWojewodztwa().then(wojewodztwa => {
    wojewodztwa.forEach(woj => {
        wojewodztwaList += `<option name="${woj.name}" value="${woj.name}">${woj.name}</option>`

    })
    document.getElementById('wojewodztwo').innerHTML = wojewodztwaList

})

const fetchMiasta = async () => {
    const response = await fetch('https://wavy-media-proxy.wavyapps.com/investors-notebook/data/miasta.json')
    const miasta = await response.json();
    return miasta;
}
let miastaList = ''
fetchMiasta().then(miasta => {
    miasta.forEach(miasto => {
        miastaList += `<option name="${miasto.name}" value="${miasto.name}">${miasto.name}</option>`

    })
    document.getElementById('miasto').innerHTML = miastaList

})
const getSingleEntry = () => {
    let params = (new URL(document.location)).searchParams;
    let entryId = params.get('entryId');
    if (!entryId) {
        return
    }
    fetch(`https://wavy-media-proxy.wavyapps.com/investors-notebook/?action=get_entry&entry_id=${entryId}`)
        .then((result) => {
            return result.json()
        })
        .then((data) => {
            const singleEntry = data[0]
            loadDataToForm(singleEntry.Address, singleEntry.Notes)
        })
}
getSingleEntry()

document.addEventListener("DOMContentLoaded", () => {
    const resetButton = document.querySelector('#reset');
    const saveButton = document.querySelector('#submit');
    const form = document.getElementById('notatnikForm');
    resetButton.addEventListener('click', (e) => {
        if ('URLSearchParams' in window) {
            const searchParams = new URLSearchParams(window.location.search)
            searchParams.delete("entryId");
            const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery);
        }
    })
    saveButton.addEventListener('click', (e) => {
        fetchData()
    })
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const wojewodztwo = e.target.wojewodztwo.value;
        const miasto = e.target.miasto.value;
        const ulica = e.target.ulica.value;
        const notatki = e.target.notatki.value;
        sendData(wojewodztwo, miasto, ulica, notatki)
    })
});

const sendData = async (wojewodztwo, miasto, adres, notatki) => {
    const fullAddress = [wojewodztwo, miasto, adres].join(',')
    const formData = {
        entry :{
            Address: fullAddress,
            Notes: notatki
        }
    }

    fetch('https://wavy-media-proxy.wavyapps.com/investors-notebook/?action=get_entries', {
        method: 'POST',
        body: JSON.stringify(formData)
    })
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.log(error)
        });
    ;
}

const fetchData = () => {
    const getLatestEntries = async () => {
        const response = await fetch('https://wavy-media-proxy.wavyapps.com/investors-notebook/?action=get_entries')
        const entries = response.json()
        return entries
    }
    let entriesList = '<tr class="title-row">\n' +
        '    <td>L.p</td>\n' +
        '    <td>ID</td>\n' +
        '    <td>Address</td>\n' +
        '    <td>Notes</td>\n' +
        '  </tr>'
    getLatestEntries().then(entries => {
        entries.forEach((entry, idx) => {
            entriesList += `<tr class="single-entry" data-entry-id="${entry.Id}" data-address="${entry.Address}" data-notes="${entry.Notes}">
<td>${idx + 1}</td>
<td>${entry.Id}</td>
<td>${entry.Address}</td>
<td>${entry.Notes}</td>
</tr>`

        })
        document.getElementById('latestEntriesTable').innerHTML = entriesList

    }).then(() => {
        const entries = document.querySelectorAll('.single-entry');
        entries.forEach((entry) => {
            entry.addEventListener('click', () => {
                if ('URLSearchParams' in window) {
                    const searchParams = new URLSearchParams(window.location.search)
                    const id = entry.getAttribute('data-entry-id');
                    const adres = entry.getAttribute('data-address');
                    const notatki = entry.getAttribute('data-notes');
                    loadDataToForm(adres, notatki)
                    searchParams.set("entryId", id);
                    const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                    history.pushState(null, '', newRelativePathQuery);
                }
            })
        })
    })
}
fetchData()


const loadDataToForm = (adres, notatki) => {
    const wojewodztwoInput = document.getElementById('wojewodztwo');
    const miastoInput = document.getElementById('miasto');
    const ulicaInput = document.getElementById('ulica');
    const notatkiInput = document.getElementById('notatki');
    const addressSplit = adres.split(',')
    const ulica = addressSplit[0].trim();
    const miasto = addressSplit[1].trim();
    const wojewodztwo = addressSplit[2].trim();
    wojewodztwoInput.value = wojewodztwo;
    miastoInput.value = miasto;
    ulicaInput.value = ulica;
    notatkiInput.value = notatki.trim()
}
