async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const url = `https://154.26.137.28/api-animesail-x-bacamanga?query=${encodedKeyword}`;
        console.log('Fetching:', url);

        // Tambahkan timeout untuk fetch request agar tidak menggantung
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // Timeout 5 detik

        let response;
        try {
            response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                signal: controller.signal // Menggunakan sinyal abort
            });
            clearTimeout(timeout); // Hapus timeout jika sukses
        } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            return JSON.stringify([{ title: 'Error fetching data', image: '', href: '' }]);
        }

        // Periksa jika respons tidak OK
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return JSON.stringify([{ title: `Error: HTTP ${response.status}`, image: '', href: '' }]);
        }

        // Parsing JSON dengan try-catch agar tidak error jika respons tidak valid
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
            return JSON.stringify([{ title: 'Error: Invalid JSON response', image: '', href: '' }]);
        }

        console.log('API Response:', data);

        // Jika data kosong, tampilkan error
        if (!data || Object.keys(data).length === 0) {
            console.error('API response is empty');
            return JSON.stringify([{ title: 'Error: Empty response', image: '', href: '' }]);
        }

        // Pastikan data memiliki format yang benar
        if (typeof data !== 'object') {
            console.error('Unexpected API response format:', data);
            return JSON.stringify([{ title: 'Error: Unexpected API response', image: '', href: '' }]);
        }

        // Periksa apakah API mengembalikan array langsung atau dalam properti tertentu
        let animeList = [];
        if (Array.isArray(data)) {
            animeList = data;
        } else if (Array.isArray(data.results)) {
            animeList = data.results;
        } else {
            console.error('API response does not contain expected array:', data);
            return JSON.stringify([{ title: 'Error: No valid data found', image: '', href: '' }]);
        }

        // Jika array kosong, tampilkan peringatan
        if (animeList.length === 0) {
            console.warn('Anime list is empty');
            return JSON.stringify([{ title: 'No results found', image: '', href: '' }]);
        }

        // Transformasi data agar tidak ada undefined values
        const transformedResults = animeList.map(anime => ({
            title: anime.title || 'No Title',
            image: anime.image || '',
            href: anime.link || '#'
        }));

        console.log('Final Transformed Results:', transformedResults);
        return JSON.stringify(transformedResults);

    } catch (error) {
        console.error('Unexpected error:', error);
        return JSON.stringify([{ title: 'Error fetching data', image: '', href: '' }]);
    }
}

// Contoh penggunaan (gunakan async function untuk menunggu hasilnya)
(async () => {
    const result = await searchResults("naruto");
    console.log("Search Results:", result);
})();
