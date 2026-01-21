"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function MapEmbed() {
  const embedSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1897.7626036555716!2d-121.90962653255518!3d37.69797920056985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808febf8b02edb6f%3A0x60636476d0b0977e!2s6601%20Owens%20Dr%20%23158%2C%20Pleasanton%2C%20CA%2094588!5e0!3m2!1sen!2sus!4v1768979903362!5m2!1sen!2sus";

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <Card className="border-border/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4 pt-6 px-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-2xl font-serif">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <MapPin className="w-6 h-6 text-primary" />
                </motion.div>
                <span className="text-foreground">Find Us</span>
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                6601 Owens Dr #158, Pleasanton, CA 94588
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {/* Responsive iframe area */}
              <div className="aspect-[16/9] sm:aspect-[3/1] w-full bg-muted/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none z-10" />
                <iframe
                  title="Windmill Events Location - 6601 Owens Dr #158, Pleasanton, CA 94588"
                  src={embedSrc}
                  className="w-full h-full block"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
