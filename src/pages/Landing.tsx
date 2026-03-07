import { DeltaHero } from '@/components/landing/DeltaHero'
import { AboutSection } from '@/components/landing/AboutSection'
import { Navbar } from '@/components/landing/Navbar'

export default function Landing() {
    return (
        <div className="min-h-screen bg-deep-navy flex flex-col">
            <Navbar />

            <main className="flex-grow">
                <DeltaHero />
                <AboutSection />
            </main>

            {/* Copyright Footer */}
            <footer className="py-6 bg-deep-navy border-t border-ocean-city/20 z-10 relative">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-xs text-ocean-city/60">
                        &copy; 2025 Delta. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
