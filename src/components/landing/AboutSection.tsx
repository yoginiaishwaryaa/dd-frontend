import { motion, useScroll, useTransform } from 'framer-motion'

export function AboutSection() {
    const { scrollYProgress } = useScroll()
    const yBg = useTransform(scrollYProgress, [0, 1], [0, -150])

    return (
        <section id="about" className="relative w-full pb-24 pt-12 md:pb-32 md:pt-20 bg-[#2A4D88] overflow-hidden text-[#D9D9D8]">
            {/* Background Texture - Minimalist Particles */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y: yBg }}
            >
                {/* Subtle particles */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/5 rounded-full"
                        style={{
                            width: Math.random() * 4 + 2 + 'px',
                            height: Math.random() * 4 + 2 + 'px',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 15,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </motion.div>

            <div className="relative max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6"
                    >
                        Keep your docs real.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-[#B1BBC8] leading-relaxed"
                    >
                        Delta connects to your code, finding changes automatically. No more outdated guides or confusing wikis.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#1E3A66]/30 border border-[#7C94B8]/20 p-8 rounded-xl backdrop-blur-sm"
                    >
                        <h3 className="text-xl font-semibold text-white mb-3">Instant Updates</h3>
                        <p className="text-[#B1BBC8] leading-relaxed">
                            Docs update automatically when you push code. Always in sync.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#1E3A66]/30 border border-[#7C94B8]/20 p-8 rounded-xl backdrop-blur-sm"
                    >
                        <h3 className="text-xl font-semibold text-white mb-3">Smart Alerts</h3>
                        <p className="text-[#B1BBC8] leading-relaxed">
                            We spot differences between code and docs, so you can fix them fast.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ delay: 0.4 }}
                        className="bg-[#1E3A66]/30 border border-[#7C94B8]/20 p-8 rounded-xl backdrop-blur-sm"
                    >
                        <h3 className="text-xl font-semibold text-white mb-3">Safe Merges</h3>
                        <p className="text-[#B1BBC8] leading-relaxed">
                            Stop undocumented changes from merging. Keep quality high effortlessly.
                        </p>
                    </motion.div>
                </div>
            </div>

        </section >
    )
}
