Berikut adalah beberapa perbaikan yang saya lakukan pada kode:  

1. **Perbaikan Penanganan Response**  
   - Sebelumnya, ada kemungkinan API tidak mengembalikan **`data.results`**, jadi saya menambahkan validasi sebelum memprosesnya.  
2. **Perbaikan Regular Expression (Regex) pada `extractDetails`, `extractEpisodes`, dan `extractStreamUrl`**  
   - Menyesuaikan pola URL agar lebih fleksibel jika ada variasi.  
3. **Penanganan Error Lebih Baik**  
   - Menambahkan logging error yang lebih jelas untuk debugging.  
4. **Perbaikan Format JSON Response**  
   - Memastikan data diubah ke JSON string yang benar sebelum dikembalikan.  

Berikut kode yang telah diperbaiki:  

```javascript
async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const response = await fetch(`https://unofficial-otakudesu-api-ruang-kreatif.vercel.app/api/search?query=${encodedKeyword}`);
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();

        if (!data || !data.results || !Array.isArray(data.results)) {
            throw new Error("Invalid search response format");
        }

        const transformedResults = data.results.map(anime => ({
            title: anime.title,
            image: anime.image,
            href: `https://otakudesu.cloud/anime/${anime.id}`
        }));

        return JSON.stringify(transformedResults);
    } catch (error) {
        console.error("Search Error:", error);
        return JSON.stringify([{ title: "Error", image: "", href: "" }]);
    }
}

async function extractDetails(url) {
    try {
        const match = url.match(/https:\/\/otakudesu\.cloud\/anime\/([^\/]+)/);
        if (!match) throw new Error("Invalid URL format");

        const encodedID = match[1];
        const response = await fetch(`https://unofficial-otakudesu-api-ruang-kreatif.vercel.app/api/anime/${encodedID}`);
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!data || !data.info) throw new Error("Invalid details response format");

        const animeInfo = data.info;

        const transformedResults = [{
            description: animeInfo.synopsis || "No description available",
            aliases: `Duration: ${animeInfo.duration || "Unknown"}`,
            airdate: `Aired: ${animeInfo.aired || "Unknown"}`
        }];

        return JSON.stringify(transformedResults);
    } catch (error) {
        console.error("Details Error:", error);
        return JSON.stringify([{
            description: "Error loading description",
            aliases: "Duration: Unknown",
            airdate: "Aired: Unknown"
        }]);
    }
}

async function extractEpisodes(url) {
    try {
        const match = url.match(/https:\/\/otakudesu\.cloud\/anime\/([^\/]+)/);
        if (!match) throw new Error("Invalid URL format");

        const encodedID = match[1];
        const response = await fetch(`https://unofficial-otakudesu-api-ruang-kreatif.vercel.app/api/anime/${encodedID}/episodes`);
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!data || !data.episodes || !Array.isArray(data.episodes)) {
            throw new Error("Invalid episodes response format");
        }

        const transformedResults = data.episodes.map(episode => ({
            href: `https://otakudesu.cloud/episode/${episode.id}`,
            number: episode.number
        }));

        return JSON.stringify(transformedResults);
    } catch (error) {
        console.error("Episodes Error:", error);
        return JSON.stringify([]);
    }
}

async function extractStreamUrl(url) {
    try {
        const match = url.match(/https:\/\/otakudesu\.cloud\/episode\/([^\/]+)/);
        if (!match) throw new Error("Invalid URL format");

        const encodedID = match[1];
        const response = await fetch(`https://unofficial-otakudesu-api-ruang-kreatif.vercel.app/api/episode/${encodedID}/sources`);
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (!data || !data.sources || !Array.isArray(data.sources)) {
            throw new Error("Invalid stream response format");
        }

        const hlsSource = data.sources.find(source => source.type === "hls");
        const subtitleTrack = data.subtitles ? data.subtitles.find(track => track.language === "Indonesia") : null;

        const result = {
            stream: hlsSource ? hlsSource.url : null,
            subtitles: subtitleTrack ? subtitleTrack.url : null
        };

        return JSON.stringify(result);
    } catch (error) {
        console.error("Stream URL Error:", error);
        return JSON.stringify({ stream: null, subtitles: null });
    }
}
