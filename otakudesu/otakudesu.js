async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const response = await fetch(`https://otakudesu-anime-api.vercel.app/search?query=${encodedKeyword}`);
        const data = await response.json();
        
        console.log("API Response:", data);

        if (!data.results || !Array.isArray(data.results)) {
            console.log("Error: 'results' not found or not an array.");
            return JSON.stringify([{ title: 'Error', image: '', href: '' }]);
        }

        const transformedResults = data.results.map(anime => ({
            title: anime.title || 'Unknown Title',
            image: anime.image || '',
            href: anime.url || anime.link || '#' // Sesuaikan dengan properti yang ada
        }));
        
        return JSON.stringify(transformedResults);
        
    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify([{ title: 'Error', image: '', href: '' }]);
    }
}

async function extractDetails(url) {
    try {
        const match = url.match(/https:\/\/otakudesu\.cloud\/anime\/(.+)$/);
        if (!match) throw new Error("Invalid URL format");
        
        const encodedID = match[1];
        const response = await fetch(`https://otakudesu-anime-api.vercel.app/anime/${encodedID}`);
        const data = await response.json();
        
        console.log("Anime Details Response:", data);
        
        const animeInfo = data.info || {};
        
        return JSON.stringify([{
            description: animeInfo.synopsis || 'No description available',
            aliases: `Duration: ${animeInfo.duration || 'Unknown'}`,
            airdate: `Aired: ${animeInfo.aired || 'Unknown'}`
        }]);
    } catch (error) {
        console.log('Details error:', error);
        return JSON.stringify([{ description: 'Error loading description', aliases: 'Duration: Unknown', airdate: 'Aired: Unknown' }]);
    }
}

async function extractEpisodes(url) {
    try {
        const match = url.match(/https:\/\/otakudesu\.cloud\/anime\/(.+)$/);
        if (!match) throw new Error("Invalid URL format");
        
        const encodedID = match[1];
        const response = await fetch(`https://otakudesu-anime-api.vercel.app/anime/${encodedID}/episodes`);
        const data = await response.json();
        
        console.log("Episodes Response:", data);

        if (!data.episodes || !Array.isArray(data.episodes)) {
            return JSON.stringify([]);
        }

        const transformedResults = data.episodes.map(episode => ({
            href: episode.url || episode.link || '#',
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
       const match = url.match(/https:\/\/otakudesu\.cloud\/episode\/(.+)$/);
       if (!match) throw new Error("Invalid URL format");
       
       const encodedID = match[1];
       const response = await fetch(`https://otakudesu-anime-api.vercel.app/episode/${encodedID}/sources`);
       const data = await response.json();
       
       console.log("Stream Response:", data);

       const hlsSource = data.sources?.find(source => source.type === 'hls');
        
        return JSON.stringify({ stream: hlsSource ? hlsSource.url : null });
    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify({ stream: null });
    }
}
