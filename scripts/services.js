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
    console.log(gif);
    return gif.data;
}