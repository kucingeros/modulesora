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

        // Cek apakah response sukses
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return [{ title: `Error: HTTP ${response.status}`, image: "", href: "" }];
        }

        // Coba parse JSON
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            return [{ title: "Error: Invalid JSON response", image: "", href: "" }];
        }

        console.log("Raw API Response:", data);

        // Validasi format response
        if (!data || !Array.isArray(data)) {
            console.error("Error: API response format is incorrect.");
            return [{ title: "Error: Unexpected API response", image: "", href: "" }];
        }

        if (data.length === 0) {
            console.warn("No results found from API.");
            return [{ title: "No results found", image: "", href: "" }];
        }

        // Transformasi data agar sesuai dengan UI
        const transformedResults = data.map(anime => ({
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

// ✅ **Contoh Penggunaan di React**
useEffect(() => {
    async function fetchData() {
        const results = await searchResults("naruto");
        console.log("Final Data Before Rendering:", results);
    }
    fetchData();
}, []);
