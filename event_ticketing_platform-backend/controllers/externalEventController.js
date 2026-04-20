const randomSeeds = [
    { keyword: "music", countryCode: "CA", city: "Toronto" },
    { keyword: "sports", countryCode: "US", city: "New York" },
    { keyword: "festival", countryCode: "GB", city: "London" },
    { keyword: "technology", countryCode: "DE", city: "Berlin" },
    { keyword: "concert", countryCode: "FR", city: "Paris" },
    { keyword: "arts", countryCode: "AU", city: "Sydney" },
    { keyword: "business", countryCode: "JP", city: "Tokyo" },
    { keyword: "community", countryCode: "BR", city: "Sao Paulo" },
];

function pickRandomSeed() {
    return randomSeeds[Math.floor(Math.random() * randomSeeds.length)];
}

function normalizeTicketmasterEvent(event) {
    return {
        id: `tm-${event.id}`,
        source: "ticketmaster",
        title: event.name || "Untitled Event",
        category:
            event.classifications?.[0]?.segment?.name ||
            event.classifications?.[0]?.genre?.name ||
            "Other",
        date: event.dates?.start?.localDate || "",
        time: event.dates?.start?.localTime || "",
        venue: event._embedded?.venues?.[0]?.name || "Venue TBA",
        location: [
            event._embedded?.venues?.[0]?.city?.name,
            event._embedded?.venues?.[0]?.country?.name,
        ]
            .filter(Boolean)
            .join(", "),
        price:
            event.priceRanges?.[0]?.min ??
            event.priceRanges?.[0]?.max ??
            null,
        status: event.dates?.status?.code === "onsale" ? "Available" : "External",
        image:
            event.images?.find((img) => img.ratio === "16_9")?.url ||
            event.images?.[0]?.url ||
            "",
        description: `External event from Ticketmaster`,
        seatsLeft: 0,
        externalUrl: event.url || "",
        isExternal: true,
    };
}

export const searchExternalEvents = async (req, res) => {
    try {
        const userQuery = String(req.query.q || "").trim();
        const seed = pickRandomSeed();

        const keyword = userQuery || seed.keyword;
        const countryCode = String(req.query.countryCode || seed.countryCode);
        const city = String(req.query.city || seed.city);
        const size = Number(req.query.size || 12);

        const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
        url.searchParams.set("apikey", process.env.TICKETMASTER_API_KEY);
        url.searchParams.set("keyword", keyword);
        url.searchParams.set("countryCode", countryCode);
        url.searchParams.set("city", city);
        url.searchParams.set("size", String(size));
        url.searchParams.set("sort", "date,asc");

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: data?.fault?.faultstring || "Failed to fetch external events",
            });
        }

        const events = (data?._embedded?.events || []).map(normalizeTicketmasterEvent);

        res.json({
            source: "ticketmaster",
            seedUsed: { keyword, countryCode, city },
            count: events.length,
            events,
        });
    } catch (error) {
        res.status(500).json({
            message: "External event search failed",
            error: error.message,
        });
    }
};