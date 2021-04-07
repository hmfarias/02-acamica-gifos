const API_KEY= '4SgwG4zh1E8ChFfX2AFRCifOP8Y1bXGx';
const URL_BASE_TRENDING = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=12`;
const URL_BASE_TRENDING_SEARCH = `https://api.giphy.com/v1/trending/searches?api_key=${API_KEY}&limit=12`;
const URL_BASE_SUGGESTIONS = `https://api.giphy.com/v1/gifs/search/tags?api_key=${API_KEY}&q=`;
const URL_BASE_SEARCH = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=12&offset=`;
const URL_BASE_UPLOAD = `https://upload.giphy.com/v1/gifs?api_key=${API_KEY}`;


// get all Trending gifs an return trending.data
export async function getTrendings() {
    const response = await fetch(URL_BASE_TRENDING);
    const trendings = await response.json();
    return trendings.data;
}

// get trending suggestions to search later
export async function getTrendingsSearch() {
    const response = await fetch(URL_BASE_TRENDING_SEARCH);
    const trendings = await response.json();
    return trendings.data;
}

//get suggestions for search bar
export async function getSuggestions(word) {
    const response = await fetch(URL_BASE_SUGGESTIONS + word);
    const suggestions = await response.json();
    return suggestions.data;
}

//searches for gifs based on what is written in the search bar and the amount set in offset
export async function getSearchByWord(word , offset) {
    const response = await fetch(URL_BASE_SEARCH + offset + '&q='+ word);
    const suggestions = await response.json();
    return suggestions.data;
}

//search for a gif based on its id
export async function getSearchById(id) {
    const URL_BASE_SEARCH_ID =`https://api.giphy.com/v1/gifs/${id}?api_key=${API_KEY}`;
    const response = await fetch(URL_BASE_SEARCH_ID);
    const gif = await response.json();
    return gif.data;
}


//download the gif passed in the id parameter and name it according to the name parameter
export async function downloadGifFunction(gif) {
    const a = document.createElement("a");
    a.href = await downloadGif(gif.target.id);
    a.download = gif.target.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

//Complementary function of the downloadGifFunction function; download the gif passed in the id parameter
async function downloadGif(id) {
    var source = `https://api.giphy.com/v1/gifs/${id}?api_key=${API_KEY}`;
                
    let response = await fetch(source);
    let info = await response.json();

    return fetch(info.data.images.downsized_large.url).then((response) => {
        return response.blob();
    }).then(blob => {
        return URL.createObjectURL(blob);
    });
}


// export async function uploadGif(formData) {
export function uploadGif(formData) {
    // const response = await fetch(URL_BASE_UPLOAD, {
    //     method: 'POST',
    //     body: formData
    // });
    // const result = await response.json();
    // console.log(result);
    // return (result.data.id);
    return('LOhwoZFUQwfMhww0rx');

}





//fix the section results margins when the button show more disappears
export function fixMarginSectionResult(button) {
    button.style.display === "none" 
    ? sectionResults.style.marginBottom ='74px'
    : sectionResults.style.marginBottom ='0';
}


//prepares the array of buttons according to the type of display sent
export function displayPrepare(arrayButtons, typeDisplay, arrayButtons2, typeDisplay2) {
    arrayButtons.forEach(button => {
        button.style.display = typeDisplay;
    });
    
    arrayButtons2.forEach(button2 => {
        button2.style.display = typeDisplay2;
    });
}


//prepares the array of buttons according to the color and background sent
export function formatStepButtons(arrayButtons,color,backColor,arrayButtons2,color2,backColor2) {
    arrayButtons.forEach(button => {
        button.style.color = color;
        button.style.background = backColor;
    });
    arrayButtons2.forEach(button2 => {
        button2.style.color = color2;
        button2.style.background = backColor2;
    });
}