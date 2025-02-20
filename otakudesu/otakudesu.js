async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const response = await fetch(`https://unofficial-otakudesu-api-ruang-kreatif.vercel.app/api/search?query=${encodedKeyword}`);
        const data = await response.json();
        
        const transformedResults = data.results.map(anime => ({
            title: anime.title,
            image: anime.image,
            href: `https://otakudesu.cloud/anime/${anime.id}`
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
        const encodedID = match[1];
        const response = await fetch(`https://unofficial-otakudesu-api-ruang-kreatif.vercel.app/api/anime/${encodedID}`);
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
        const match = url.match(/https:\/\/otakudesu\.cloud\/anime\/(.+)$/);
        const encodedID = match[1];
        const response = await fetch(`https://unofficial-otakudesu-api-ruang-kreatif.vercel.app/api/anime/${encodedID}/episodes`);
        const data = await response.json();

        const transformedResults = data.episodes.map(episode => ({
            href: `https://otakudesu.cloud/episode/${episode.id}`,
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
       const encodedID = match[1];
       const response = await fetch(`https://unofficial-otakudesu-api-ruang-kreatif.vercel.app/api/episode/${encodedID}/sources`);
       const data = await response.json();
       
       const hlsSource = data.sources.find(source => source.type === 'hls');
        
        return JSON.stringify({ stream: hlsSource ? hlsSource.url : null });
    } catch (error) {
        console.log('Fetch error:', error);
        return JSON.stringify({ stream: null });
    }
}
