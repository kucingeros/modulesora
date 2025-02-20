async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const response = await fetch(`https://154.26.137.28/api-animesail-x-bacamanga?query=${encodedKeyword}`);
        const data = await response.json();
        
        const transformedResults = data.map(anime => ({
            title: anime.title,
            image: anime.image,
            href: anime.link
        }));
        
        return JSON.stringify(transformedResults);
        
    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify([{ title: 'Error', image: '', href: '' }]);
    }
}

async function extractDetails(url) {
    try {
        const response = await fetch(url);
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
        const response = await fetch(url);
        const data = await response.json();

        const transformedResults = data.episodes.map(episode => ({
            href: episode.link,
            number: episode.episode
        }));
        
        return JSON.stringify(transformedResults);
        
    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify([]);
    }    
}

async function extractStreamUrl(url) {
    try {
       const response = await fetch(url);
       const data = await response.json();
       
       const hlsSource = data.sources?.find(source => source.type === 'hls');
       const subtitleTrack = data.subtitles?.find(track => track.language === 'Indonesia');
        
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
