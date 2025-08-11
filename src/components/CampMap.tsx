import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import type { GroupedCamp } from "@/utils/campUtils";

interface CampMapProps {
  camps: GroupedCamp[];
  selectedCamp?: GroupedCamp | null;
  onCampSelect?: (camp: GroupedCamp) => void;
  userLocation?: { lat: number; lng: number } | null; // ✅ NEW: User location prop
}

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 49.2827,
  lng: -123.1207,
};

const MAX_GEOCODE_REQUESTS = 40;

interface CampWithCoordinates extends GroupedCamp {
  coordinates: { lat: number; lng: number };
}

// ✅ PRESERVED: All your existing LIGHT MODE STYLES
const lightMapStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#FFFBEB" }], // Beige background
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#663129" }], // Brown text for most labels
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#FFFBEB", weight: 3 }], // Stroke for text readability
  },
  // Road label improvements (existing)
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#000000" }], // Black text for ALL road labels
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#FFFFFF", weight: 4 }], // White stroke with more weight
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#000000" }], // Ensure local roads are black
  },
  {
    featureType: "road.local",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#FFFFFF", weight: 5 }], // Even thicker stroke for small roads
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#FFB823", weight: 3 }], // Yellow roads with weight for visibility
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#663129", weight: 1 }], // Brown outline for definition
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#FF8F00", weight: 4 }], // Darker orange for highways, thicker
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#663129", weight: 2 }], // Brown stroke for highways
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#FFB823", weight: 2 }], // Yellow for arterial roads
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.stroke",
    stylers: [{ color: "#663129", weight: 1 }], // Brown stroke for arterials
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#FFD54F", weight: 1 }], // Lighter yellow for local roads but still visible
  },
  {
    featureType: "road.local",
    elementType: "geometry.stroke",
    stylers: [{ color: "#8D6E63", weight: 0.5 }], // Light brown stroke for locals
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#663129" }], // Brown for admin boundaries
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#ACDB95" }], // Light green for natural areas
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#ACDB95" }], // Light green for parks
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }], // Hide POI labels for cleaner look
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#A2F1F6" }], // Light blue water
  },
  {
    featureType: "water",
    elementType: "labels.text",
    stylers: [{ color: "#004266" }], // Dark blue water labels
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#663129", weight: 2 }], // Brown transit lines, similar weight to roads
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [{ color: "#000000" }], // Black text - same as roads
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#FFFFFF", weight: 4 }], // White stroke - same as roads
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#663129" }], // Brown transit stations
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#000000" }], // Black text - same as roads
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#FFFFFF", weight: 4 }], // White stroke - same as roads
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#000000" }], // Black text for general transit labels
  },
  {
    featureType: "transit",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#FFFFFF", weight: 4 }], // White stroke for general transit labels
  },
];

// ✅ PRESERVED: All your existing DARK MODE STYLES
const darkMapStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1a1a1a" }], // Dark background
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#ACDB95" }], // Light green text for most labels
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1a1a1a", weight: 3 }], // Dark stroke
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#FFFFFF" }], // White text for ALL road labels
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#000000", weight: 4 }], // Black stroke with more weight
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#FFFFFF" }], // Ensure local roads are white
  },
  {
    featureType: "road.local",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#000000", weight: 5 }], // Thicker stroke for small roads
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#663129" }], // Brown boundaries
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#00524C" }], // Dark green for natural areas
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#00524C" }], // Dark green for parks
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#3a3a3a" }], // Lighter gray roads for contrast
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#4a4a4a" }], // Even lighter for highways
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#3a3a3a" }], // Gray for arterial roads
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#004266" }], // Dark blue water
  },
  {
    featureType: "water",
    elementType: "labels.text",
    stylers: [{ color: "#A2F1F6" }], // Light blue water labels
  },
  {
    featureType: "transit",
    elementType: "labels.text",
    stylers: [{ color: "#FFB823" }], // Yellow transit labels
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#663129" }], // Brown transit stations
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#663129" }], // Brown transit lines
  },
];

// ✅ PRESERVED: Your existing geocoding cache and function
const geocodeCache = new Map();

const geocodeAddress = async (
  address: string,
  apiKey: string,
): Promise<{ lat: number; lng: number } | null> => {
  if (geocodeCache.has(address)) {
    return geocodeCache.get(address);
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
    );
    const data = await response.json();

    if (data.status === "OVER_QUERY_LIMIT") {
      console.warn("Geocoding quota exceeded. Using fallback coordinates.");
      geocodeCache.set(address, null);
      return null;
    }

    if (data.results && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      const coordinates = { lat, lng };
      geocodeCache.set(address, coordinates);
      return coordinates;
    }

    geocodeCache.set(address, null);
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    geocodeCache.set(address, null);
    return null;
  }
};

const CampMap: React.FC<CampMapProps> = ({
  camps,
  selectedCamp,
  onCampSelect,
  userLocation, // ✅ NEW: Accept user location as prop
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [campsWithCoords, setCampsWithCoords] = useState<CampWithCoordinates[]>(
    [],
  );
  const [selectedMarker, setSelectedMarker] = useState<GroupedCamp | null>(
    null,
  );
  const mapRef = useRef<google.maps.Map | null>(null);

  // ✅ PRESERVED: Your existing theme detection
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
  });

  // ✅ ENHANCED: Auto-center logic now considers user location
  useEffect(() => {
    if (camps.length > 0 && mapRef.current) {
      const provinces = camps
        .map((camp) => camp.sessions?.[0]?.location?.province)
        .filter(Boolean);

      const provinceCount: { [key: string]: number } = {};
      provinces.forEach((province) => {
        provinceCount[province] = (provinceCount[province] || 0) + 1;
      });

      const mostCommonProvince = Object.keys(provinceCount).reduce((a, b) =>
        provinceCount[a] > provinceCount[b] ? a : b,
      );

      const provinceCenters: { [key: string]: { lat: number; lng: number } } = {
        BC: { lat: 49.2827, lng: -123.1207 },
        AB: { lat: 53.9333, lng: -116.5765 },
        ON: { lat: 45.4215, lng: -75.6972 },
        QC: { lat: 46.8139, lng: -71.208 },
        MB: { lat: 49.8951, lng: -97.1384 },
        SK: { lat: 52.9399, lng: -106.4509 },
        NS: { lat: 44.682, lng: -63.7443 },
        NB: { lat: 46.5653, lng: -66.4619 },
        NL: { lat: 53.1355, lng: -57.6604 },
        PE: { lat: 46.5107, lng: -63.4168 },
        YT: { lat: 64.2823, lng: -135.0 },
        NT: { lat: 61.2181, lng: -113.5047 },
        NU: { lat: 70.2998, lng: -83.1076 },
      };

      // ✅ NEW: Use user location if available, otherwise use province center
      const center =
        userLocation || provinceCenters[mostCommonProvince] || defaultCenter;

      mapRef.current.setCenter(center);
      mapRef.current.setZoom(userLocation ? 10 : 7); // Zoom closer if we have user location
    }
  }, [camps, userLocation]);

  // ✅ ENHANCED: Final auto-center includes user location in bounds
  useEffect(() => {
    if (campsWithCoords.length > 0 && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();

      // Add all camp coordinates to bounds
      campsWithCoords.forEach((camp) => {
        bounds.extend(camp.coordinates);
      });

      // ✅ NEW: Include user location in bounds if available
      if (userLocation) {
        bounds.extend(userLocation);
      }

      mapRef.current.fitBounds(bounds);

      // If only one camp (or just user location), set a reasonable zoom
      if (campsWithCoords.length === 1) {
        setTimeout(() => {
          mapRef.current?.setZoom(12);
        }, 100);
      }
    }
  }, [campsWithCoords, userLocation]);

  // ✅ PRESERVED: Your existing geocoding logic
  useEffect(() => {
    const geocodeCamps = async () => {
      if (!camps.length || !apiKey) return;

      const campsToGeocode = camps.slice(0, MAX_GEOCODE_REQUESTS);
      if (camps.length > MAX_GEOCODE_REQUESTS) {
        console.warn(
          `⚠️ ${camps.length - MAX_GEOCODE_REQUESTS} camps not geocoded due to usage limits`,
        );
      }

      const geocodedCamps: CampWithCoordinates[] = [];
      let cacheHits = 0;
      let apiCalls = 0;

      for (const camp of campsToGeocode) {
        const session = camp.sessions?.[0];
        if (!session?.location) continue;

        const fullAddress = `${session.location.address}, ${session.location.city}, ${session.location.province}, Canada`;
        let coordinates: { lat: number; lng: number } | null = null;

        if (geocodeCache.has(fullAddress)) {
          coordinates = geocodeCache.get(fullAddress);
          cacheHits++;
        } else {
          coordinates = await geocodeAddress(fullAddress, apiKey);
          apiCalls++;

          if (apiCalls > 0 && apiCalls % 5 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        if (coordinates) {
          geocodedCamps.push({
            ...camp,
            coordinates,
          });
        }
      }

      if (cacheHits > 0 || apiCalls > 0) {
        console.log(
          `🗺️ Geocoding: ${cacheHits} from cache, ${apiCalls} new API calls`,
        );
      }

      setCampsWithCoords(geocodedCamps);
    };

    geocodeCamps();
  }, [camps, apiKey]);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading map...
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full">
        Google Maps API key not configured
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={userLocation || defaultCenter}
      zoom={userLocation ? 10 : 7}
      onLoad={onMapLoad}
      options={{
        styles: isDarkMode ? darkMapStyles : lightMapStyles,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
      }}
    >
      {/* ✅ NEW: User Location Marker */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4", // Google's location blue
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 3,
            strokeOpacity: 1,
          }}
          title="Your Location"
          zIndex={1000} // Higher z-index so it appears above camp markers
        />
      )}

      {/* ✅ PRESERVED: Your existing camp markers with exact same styling */}
      {campsWithCoords.map((camp, index) => (
        <Marker
          key={index}
          position={camp.coordinates}
          onClick={() => {
            setSelectedMarker(camp);
            onCampSelect?.(camp);
          }}
          // RED MARKER with alternative symbol options (preserved exactly)
          options={{
            icon: {
              // Option 1: Use Google's built-in arrow symbol (simple pin)
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 5,
              fillColor: "#FF0000", // Red as requested
              fillOpacity: 1,
              strokeColor: isDarkMode ? "#FFFBEB" : "#663129", // Theme-aware border
              strokeWeight: 2,
              rotation: 180, // Point downward like a pin
            },
          }}
        />
      ))}

      {/* ✅ PRESERVED: Your existing InfoWindow */}
      {selectedMarker && (
        <InfoWindow
          position={
            campsWithCoords.find((c) => c.name === selectedMarker.name)
              ?.coordinates
          }
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div>
            <h3>{selectedMarker.name}</h3>
            <p>{selectedMarker.description.slice(0, 100)}...</p>
            <p>Ages: {selectedMarker.ageRange}</p>
            <p>${selectedMarker.sessions?.[0]?.price}/week</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default CampMap;
