async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const url = `https://154.26.137.28/api-animesail-x-bacamanga?query=${encodedKeyword}`;
        console.log("Fetching URL:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return [{ title: "Error: Invalid JSON response", image: "", href: "" }];
        }

        console.log("Raw API Response:", data);

        // Pastikan response memiliki data yang valid
        if (!data || typeof data !== "object") {
            console.error("Error: API response format is incorrect.");
            return [{ title: "Error: Unexpected API response", image: "", href: "" }];
        }

        let animeList = [];

        // Cek apakah response dalam bentuk array atau memiliki properti results
        if (Array.isArray(data)) {
            animeList = data;
        } else if (Array.isArray(data.results)) {
            animeList = data.results;
        } else {
            console.error("Error: API response does not contain expected array.");
            return [{ title: "Error: No valid data found", image: "", href: "" }];
        }

        // Jika animeList kosong, coba ambil informasi lain dari response
        if (animeList.length === 0) {
            console.warn("No results found from API. Returning default message.");
            return [{ title: "No results found for your search", image: "", href: "" }];
        }

        // Transformasi data agar sesuai dengan yang diharapkan UI
        const transformedResults = animeList.map(anime => ({
            title: anime.title || "No Title",
            image: anime.image ? anime.image.replace(/^http:/, "https:") : "",
            href: anime.link ? anime.link.replace(/^http:/, "https:") : "#",
            score: anime.score || "N/A",
            episode: anime.episode || "Unknown",
        }));

        console.log("Final Transformed Results:", transformedResults);
        return transformedResults;

    } catch (error) {
        console.error("Fetch error:", error);
        return [{ title: "Error fetching data", image: "", href: "" }];
    }
}

// Contoh cara menggunakan fungsi ini di React (atau framework lain)
useEffect(() => {
    async function fetchData() {
        const results = await searchResults("naruto");
        console.log("Final Data Before Rendering:", results);
    }
    fetchData();
}, []);
