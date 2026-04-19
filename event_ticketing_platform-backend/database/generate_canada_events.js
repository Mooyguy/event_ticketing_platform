import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categories = [
    "Music & Concerts",
    "Sports",
    "Technology",
    "Food & Drink",
    "Arts & Culture",
    "Business",
    "Education",
    "Health & Wellness",
    "Fashion",
    "Travel",
    "Community",
    "Other",
];

const cities = [
    { city: "Winnipeg", province: "Manitoba", venue: "RBC Convention Centre Winnipeg" },
    { city: "Toronto", province: "Ontario", venue: "Metro Toronto Convention Centre" },
    { city: "Vancouver", province: "British Columbia", venue: "Vancouver Convention Centre" },
    { city: "Calgary", province: "Alberta", venue: "BMO Centre" },
    { city: "Edmonton", province: "Alberta", venue: "Edmonton Expo Centre" },
    { city: "Ottawa", province: "Ontario", venue: "Shaw Centre" },
    { city: "Montreal", province: "Quebec", venue: "Palais des congrès de Montréal" },
    { city: "Halifax", province: "Nova Scotia", venue: "Halifax Convention Centre" },
    { city: "Regina", province: "Saskatchewan", venue: "Conexus Arts Centre" },
    { city: "Saskatoon", province: "Saskatchewan", venue: "TCU Place" },
    { city: "Quebec City", province: "Quebec", venue: "Centre des congrès de Québec" },
    { city: "Victoria", province: "British Columbia", venue: "Victoria Conference Centre" },
    { city: "St. John's", province: "Newfoundland and Labrador", venue: "St. John's Convention Centre" },
    { city: "Charlottetown", province: "Prince Edward Island", venue: "Delta Prince Edward" },
    { city: "Fredericton", province: "New Brunswick", venue: "Fredericton Convention Centre" },
    { city: "Whitehorse", province: "Yukon", venue: "Kwanlin Dün Cultural Centre" },
    { city: "Yellowknife", province: "Northwest Territories", venue: "Yellowknife Multiplex" },
    { city: "Iqaluit", province: "Nunavut", venue: "Aqsarniit Hotel & Conference Centre" },
];

const categoryTitles = {
    "Music & Concerts": ["Summer Beats Festival", "Northern Lights Concert", "City Sound Sessions", "Live Vibes Night", "Maple Music Jam"],
    "Sports": ["Championship Fan Rally", "Canada Sports Expo", "Hockey Showcase", "Weekend Sports Festival", "Athlete Meet & Greet"],
    "Technology": ["Tech Innovators Summit", "AI & Future Expo", "Digital Creators Forum", "Startup Builders Conference", "Cloud Tech Meetup"],
    "Food & Drink": ["Taste of Canada", "Street Food Carnival", "Maple & Spice Festival", "Chef Showcase", "Canadian Food Market"],
    "Arts & Culture": ["Creative Arts Expo", "Culture Connect Festival", "Gallery Nights", "Canadian Heritage Showcase", "Design & Craft Fair"],
    "Business": ["Business Growth Summit", "Entrepreneurship Forum", "Leaders Exchange", "Startup Investor Connect", "Future of Work Forum"],
    "Education": ["Student Success Forum", "Learning Futures Expo", "Career & Study Fair", "Academic Innovation Summit", "Campus Connect Event"],
    "Health & Wellness": ["Wellness Retreat Day", "Healthy Living Expo", "Mind & Body Festival", "Fitness and Wellness Summit", "Community Health Fair"],
    "Fashion": ["Style Week Showcase", "Fashion Forward Expo", "Urban Style Runway", "Canadian Fashion Collective", "Designer Pop-Up Event"],
    "Travel": ["Travel & Adventure Expo", "Explore Canada Fair", "Outdoor Discovery Summit", "Weekend Escape Showcase", "Tourism Connect Event"],
    "Community": ["Community Unity Day", "Neighbourhood Festival", "Volunteer Connect", "Local Impact Fair", "City Community Gathering"],
    "Other": ["General Events Showcase", "Seasonal Community Fair", "Weekend Discovery Event", "Public Engagement Forum", "Special Interest Expo"],
};

const categoryImages = {
    "Music & Concerts": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    "Sports": "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    "Technology": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    "Food & Drink": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    "Arts & Culture": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    "Business": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    "Education": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    "Health & Wellness": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    "Fashion": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    "Travel": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    "Community": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    "Other": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
};

const descriptions = {
    "Music & Concerts": "Enjoy live performances, vibrant entertainment, and an unforgettable music experience.",
    "Sports": "Join fans and athletes for an action-packed sports event with exciting activities.",
    "Technology": "Explore the latest trends in innovation, AI, software, and digital transformation.",
    "Food & Drink": "Experience delicious local flavours, chef showcases, and culinary discovery.",
    "Arts & Culture": "Celebrate creativity, culture, exhibitions, and artistic expression.",
    "Business": "Network with professionals, founders, and leaders discussing growth and innovation.",
    "Education": "Discover learning opportunities, academic insights, and career development resources.",
    "Health & Wellness": "Focus on fitness, mindfulness, healthy living, and personal well-being.",
    "Fashion": "Discover trends, style showcases, and creative fashion experiences.",
    "Travel": "Find inspiration for adventures, destinations, and tourism experiences across Canada.",
    "Community": "Connect with people through meaningful local gatherings and shared experiences.",
    "Other": "A unique event experience featuring engaging activities and public participation.",
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
    return arr[rand(0, arr.length - 1)];
}

function sqlEscape(str) {
    return String(str).replace(/'/g, "''");
}

function makeDate(index) {
    const start = new Date("2026-05-01");
    start.setDate(start.getDate() + index * 2);
    return start.toISOString().slice(0, 10);
}

function makeTime() {
    const hours = [10, 11, 12, 13, 14, 15, 16, 18, 19];
    const mins = ["00", "30"];
    const h = pick(hours);
    const m = pick(mins);
    return `${String(h).padStart(2, "0")}:${m}:00`;
}

const rows = [];
const totalEvents = 200;

for (let i = 1; i <= totalEvents; i++) {
    const category = categories[(i - 1) % categories.length];
    const place = cities[(i - 1) % cities.length];
    const titleBase = pick(categoryTitles[category]);
    const title = `${titleBase} - ${place.city}`;
    const eventDate = makeDate(i);
    const eventTime = makeTime();
    const location = `${place.city}, Canada`;
    const price = rand(15, 180);
    const seatsLeft = rand(40, 500);
    const status = "Available";
    const image = categoryImages[category];
    const description = `${descriptions[category]} Hosted in ${place.city}, ${place.province}.`;

    rows.push(
        `('${sqlEscape(title)}', '${sqlEscape(category)}', '${eventDate}', '${eventTime}', '${sqlEscape(
            place.venue
        )}', '${sqlEscape(location)}', ${price.toFixed(2)}, '${status}', '${image}', '${sqlEscape(
            description
        )}', ${seatsLeft})`
    );
}

const sql = `
INSERT INTO events
(title, category, event_date, event_time, venue, location, price, status, image, description, seats_left)
VALUES
${rows.join(",\n")};
`;

const outputPath = path.join(__dirname, "events_seed_canada_200.sql");
fs.writeFileSync(outputPath, sql);

console.log(`Generated: ${outputPath}`);