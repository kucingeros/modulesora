async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const url = `https://154.26.137.28/api-animesail-x-bacamanga?query=${encodedKeyword}`;
        console.log('Fetching:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!Array.isArray(data) || data.length === 0) {
            console.error('No valid data found:', data);
            return JSON.stringify([{ title: 'No results found', image: '', href: '' }]);
        }

        const transformedResults = data.map(anime => ({
            title: anime.title || 'No Title',
            image: anime.image || '',
            href: anime.link || '#'
        }));

        return JSON.stringify(transformedResults);
        
    } catch (error) {
        console.error('Fetch error:', error);
        return JSON.stringify([{ title: 'Error fetching data', image: '', href: '' }]);
    }
}

async function extractDetails(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        
        return JSON.stringify([{
            description: data.synopsis || 'No description available',
            aliases: `Duration: ${data.duration || 'Unknown'}`,
            airdate: `Aired: ${data.aired || 'Unknown'}`
        }]);
    } catch (error) {
        console.error('Details error:', error);
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
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            console.error('No episodes found:', data);
            return JSON.stringify([]);
        }

        return JSON.stringify(data.map(episode => ({
            href: episode.link || '#',
            number: episode.episode || 'Unknown'
        })));
    } catch (error) {
        console.error('Fetch error:', error);
        return JSON.stringify([]);
    }    
}

async function extractStreamUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const hlsSource = data.sources?.find(source => source.type === 'hls');
        
        return JSON.stringify({ stream: hlsSource ? hlsSource.url : null });
    } catch (error) {
        console.error('Fetch error:', error);
        return JSON.stringify({ stream: null });
    }
}
