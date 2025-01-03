

const getLocation = async (ip: string, domain: string) => {
    try{
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.NEXT_PUBLIC_GEOLOCATION_API_KEY}&${domain !== "" ? `domain=${domain}` : `ipAddress=${ip}`}`);
        const data = await response.json();
        return {
            ip: data.ip,
            location: {
                region: data.location?.region || "---",
                city: data.location?.city || "---",
                lat: data.location?.lat || 0,
                lng: data.location?.lng  || 0,
            },
            timezone: data.location?.timezone || "---",
            isp: data.isp || "---",
        }
    } catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
};

export default getLocation;