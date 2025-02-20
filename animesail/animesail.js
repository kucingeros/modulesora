async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const response = await fetch(`https://154.26.137.28/api/search?query=${encodedKeyword}`);
        const data = await response.json();
        
        const transformedResults = data.results.map(anime => ({
            title: anime.title,
            image: anime.image,
            href: `https://154.26.137.28/anime/${anime.id}`
        }));
        
        return JSON.stringify(transformedResults);
        
    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify([{ title: 'Error', image: '', href: '' }]);
    }
}

async function extractDetails(url) {
    try {
        const match = url.match(/https:\/\/154\.26\.137\.28\/anime\/(.+)$/);
        const encodedID = match[1];
        const response = await fetch(`https://154.26.137.28/api/anime/${encodedID}`);
        const data = await response.json();
        
        const animeInfo = data.info;
        
        const transformedResults = [{
            description: animeInfo.synopsis || 'No description available',
            aliases: `Duration: ${animeInfo.duration || 'Unknown'}`,
            airdate: `Aired: ${animeInfo.aired || 'Unknown'}`
        }];
        
        return JSON.stringify(transformedResults);
    } catch (error) {
        console.log('Details error:', error);
        return JSON.stringify([{
            description: 'Error loading description',
            aliases: 'Duration: Unknown',
            airdate: 'Aired: Unknown'
        }]);
    }
}

async function extractEpisodes(url) {
    try {
        const match = url.match(/https:\/\/154\.26\.137\.28\/anime\/(.+)$/);
        const encodedID = match[1];
        const response = await fetch(`https://154.26.137.28/api/anime/${encodedID}/episodes`);
        const data = await response.json();

        const transformedResults = data.episodes.map(episode => ({
            href: `https://154.26.137.28/episode/${episode.id}`,
            number: episode.number
        }));
        
        return JSON.stringify(transformedResults);
        
    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify([]);
    }    
}

async function extractStreamUrl(url) {
    try {
       const match = url.match(/https:\/\/154\.26\.137\.28\/episode\/(.+)$/);
       const encodedID = match[1];
       const response = await fetch(`https://154.26.137.28/api/episode/${encodedID}/sources`);
       const data = await response.json();
       
       const hlsSource = data.sources.find(source => source.type === 'hls');
       const subtitleTrack = data.subtitles.find(track => track.language === 'Indonesia');
        
        const result = {
            stream: hlsSource ? hlsSource.url : null,
            subtitles: subtitleTrack ? subtitleTrack.url : null
        };
        
        return JSON.stringify(result);
    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify({ stream: null, subtitles: null });
    }
}
