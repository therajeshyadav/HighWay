import kayakingMangrove from "@/assets/kayaking-mangrove.jpg";
import nandiHillsSunrise from "@/assets/nandi-hills-sunrise.jpg";
import coffeeTrail from "@/assets/coffee-trail.jpg";
import kayakingSunset from "@/assets/kayaking-sunset.jpg";
import boatCruise from "@/assets/boat-cruise.jpg";
import bunjeeJumping from "@/assets/bunjee-jumping.jpg";
import coffeeTrailMist from "@/assets/coffee-trail-mist.jpg";

export const imageMap: Record<string, string> = {
  "/kayaking-mangrove": kayakingMangrove,
  "/nandi-hills-sunrise": nandiHillsSunrise,
  "/coffee-trail": coffeeTrail,
  "/kayaking-sunset": kayakingSunset,
  "/boat-cruise": boatCruise,
  "/bunjee-jumping": bunjeeJumping,
  "/coffee-trail-mist": coffeeTrailMist,
};

export const getImageSrc = (path: string): string => {
  return imageMap[path] || path;
};
