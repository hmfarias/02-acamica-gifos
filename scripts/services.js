const API_KEY= '4SgwG4zh1E8ChFfX2AFRCifOP8Y1bXGx';
const URL_BASE_TRENDING = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=12`;
const URL_BASE_TRENDING_SEARCH = `https://api.giphy.com/v1/trending/searches?api_key=${API_KEY}&limit=12`;
const URL_BASE_SUGGESTIONS = `https://api.giphy.com/v1/gifs/search/tags?api_key=${API_KEY}&q=`;
// const URL_BASE_SEARCH = 'https://api.giphy.com/v1/gifs/search?api_key=4SgwG4zh1E8ChFfX2AFRCifOP8Y1bXGx&limit=12&offset=';
const URL_BASE_SEARCH = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=12&offset=`;


export async function getTrendings() {
    const response = await fetch(URL_BASE_TRENDING);
    const trendings = await response.json();
    return trendings.data;
}

export async function getTrendingsSearch() {
    const response = await fetch(URL_BASE_TRENDING_SEARCH);
    const trendings = await response.json();
    return trendings.data;
}

export async function getSuggestions(word) {
    const response = await fetch(URL_BASE_SUGGESTIONS + word);
    const suggestions = await response.json();
    return suggestions.data;
}

export async function getSearchByWord(word , offset) {
    const response = await fetch(URL_BASE_SEARCH + offset + '&q='+ word);
    const suggestions = await response.json();
    return suggestions.data;
}

export async function getSearchById(id) {
    const URL_BASE_SEARCH_ID =`https://api.giphy.com/v1/gifs/${id}?api_key=${API_KEY}`;
    const response = await fetch(URL_BASE_SEARCH_ID);
    const gif = await response.json();
    return gif.data;
}


export async function downloadGifFunction(id , name) {
    const a = document.createElement("a");
    a.href = await descargar(id);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function descargar(id) {
    var source = `https://api.giphy.com/v1/gifs/${id}?api_key=${API_KEY}`;
                
    let response = await fetch(source);
    let info = await response.json();

    return fetch(info.data.images.downsized_large.url).then((response) => {
        return response.blob();
    }).then(blob => {
        return URL.createObjectURL(blob);
    });
}