import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import { Button } from '@/components/shadcn/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isScrolled ? 'py-2' : 'py-4'
        )}
      >
        {/* Navbar container with glassmorphism */}
        <div
          className={cn(
            'mx-auto transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]',
            isScrolled
              ? 'max-w-5xl px-4 sm:px-6'
              : 'max-w-7xl px-4 sm:px-6 lg:px-8'
          )}
        >
          <nav
            className={cn(
              'relative flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]',
              isScrolled
                ? 'bg-deep-navy/90 backdrop-blur-xl rounded-full px-6 sm:px-8 py-3.5 border border-glacial-salt/20 shadow-brand-medium'
                : 'px-2 py-2 border border-transparent'
            )}
          >
            {/* Logo */}
            <Link
              to="/"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault()
                  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="link-reset relative z-10 flex items-center gap-2"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="flex items-center gap-2"
              >
                <img 
                  src="/Delta Docs Logo.png" 
                  alt="Delta Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className={cn(
                  'text-xl font-bold tracking-tight transition-colors duration-700',
                  isScrolled ? 'text-pure-white' : 'text-deep-navy'
                )}>
                  Delta<span className="text-ocean-city">.</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3 relative z-10">
              <Link to="/login" className="link-reset">
                <Button
                  variant="ghost"
                  className={cn(
                    'font-medium transition-colors duration-300 !bg-transparent hover:!bg-transparent focus-visible:ring-0',
                    isScrolled
                      ? 'text-glacial-salt hover:text-pure-white'
                      : 'text-soft-ink hover:text-deep-navy'
                  )}
                >
                  Log in
                </Button>
              </Link>
              <Link to="/signup" className="link-reset">
                <Button
                  className={cn(
                    'font-medium transition-colors duration-300 focus-visible:ring-0',
                    isScrolled
                      ? 'bg-deep-blue text-pure-white hover:!bg-deep-blue hover:text-glacial-salt shadow-cta'
                      : 'bg-deep-blue text-pure-white hover:!bg-deep-blue hover:text-concerto shadow-brand-soft'
                  )}
                >
                  Sign up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={cn(
                'md:hidden relative z-10 p-2 rounded-lg transition-colors duration-300',
                isScrolled
                  ? 'text-glacial-salt hover:text-pure-white'
                  : 'text-soft-ink hover:text-deep-navy'
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} weight="bold" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <List size={24} weight="bold" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-deep-navy/80 backdrop-blur-sm md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden"
            >
              <nav className="bg-deep-navy/95 backdrop-blur-xl rounded-2xl p-6 border border-glacial-salt/20 shadow-brand-medium">
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={closeMobileMenu} className="link-reset">
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-glacial-salt hover:text-pure-white !bg-transparent hover:!bg-transparent font-medium focus-visible:ring-0"
                      size="lg"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu} className="link-reset">
                    <Button
                      className="w-full justify-center bg-ocean-city text-pure-white hover:!bg-ocean-city hover:text-glacial-salt font-medium shadow-cta focus-visible:ring-0"
                      size="lg"
                    >
                      Sign up
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
