"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

/**
 * MapEmbed component
 * Displays a Google Maps iframe or a gradient placeholder
 * that matches the page’s content width (consistent margins).
 */
export function MapEmbed() {
  // Replace with your actual Google Maps API key
  const googleMapsApiKey = "YOUR_DUMMY_API_KEY";

  // The address/location you want the map centered on
  const mapQuery = encodeURIComponent("6601 Owens Dr #158, Pleasanton, CA, 94588");

  // Construct the Google Maps Embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${mapQuery}`;

  return (
    // ✅ Keep the same container width as the rest of the page
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Card className="border-border/50 rounded-lg overflow-hidden">
          <CardContent className="p-0">
            {/* ✅ Actual Google Maps Embed */}
            {/* 
            <iframe
              title="Windmill Events Location"
              src={mapUrl}
              width="100%"
              height="350"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            */}

            {/* 🩶 Placeholder Gradient (shown until map is enabled) */}
            <div className="aspect-[3/1] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-foreground mb-2">Find Us</h4>
                <p className="text-muted-foreground text-sm">
                  6601 Owens Dr #158
                  <br />
                  Pleasanton, CA 94588
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Interactive map coming soon
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
