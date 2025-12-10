import Header from "./components/Header"
import GigForm from "./components/GigForm"
import Gig from "./components/Gig"
import { fetchAllGigs, subscribeToGigs } from "./services/dbService";
import { useAuth } from "./services/authService";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
    const [gigs, setGigs] = useState([])
    const [showGigForm, setShowGigForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortOption, setSortOption] = useState("newest")
    const { user, emailVerified } = useAuth()
    
    useEffect(() => {
      setIsLoading(true)
      setError(null)
      try {
      const unsubscribe = subscribeToGigs((articles) => {
        setGigs(articles);
          setIsLoading(false)
      });
      return () => unsubscribe();
      } catch (err) {
        setError("Failed to load gigs. Please refresh the page.")
        setIsLoading(false)
      }
    }, []);

    const filterAndSortGigs = (gigsList) => {
      let filtered = gigsList;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = gigsList.filter(gig => {
          const titleMatch = gig.header?.toLowerCase().includes(query);
          const bodyMatch = gig.body?.toLowerCase().includes(query);
          const typeMatch = gig.type?.toLowerCase().includes(query);
          return titleMatch || bodyMatch || typeMatch;
        });
      }

      const sorted = [...filtered].sort((a, b) => {
        switch (sortOption) {
          case "newest":
            const dateA = a.date?.toDate ? a.date.toDate() : (a.date ? new Date(a.date) : new Date(0));
            const dateB = b.date?.toDate ? b.date.toDate() : (b.date ? new Date(b.date) : new Date(0));
            return dateB - dateA;
          
          case "oldest":
            const dateAOld = a.date?.toDate ? a.date.toDate() : (a.date ? new Date(a.date) : new Date(0));
            const dateBOld = b.date?.toDate ? b.date.toDate() : (b.date ? new Date(b.date) : new Date(0));
            return dateAOld - dateBOld;
          
          case "soonest":
            if (!a.scheduledDate || !b.scheduledDate) {
              if (!a.scheduledDate && !b.scheduledDate) return 0;
              if (!a.scheduledDate) return 1;
              if (!b.scheduledDate) return -1;
            }
            const startA = new Date(a.scheduledDate);
            const startB = new Date(b.scheduledDate);
            return startA - startB;
          
          case "latest":
            if (!a.scheduledDate || !b.scheduledDate) {
              if (!a.scheduledDate && !b.scheduledDate) return 0;
              if (!a.scheduledDate) return 1;
              if (!b.scheduledDate) return -1;
            }
            const startALate = new Date(a.scheduledDate);
            const startBLate = new Date(b.scheduledDate);
            return startBLate - startALate;
          
          default:
            return 0;
        }
      });

      return sorted;
    };

    const displayedGigs = filterAndSortGigs(gigs);

  return (
    <GoogleOAuthProvider clientId="1032464315658-efhl2tha7ec2b5rskjqbuf39f72rgpda.apps.googleusercontent.com">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
        <Header user={user} emailVerified={emailVerified}/>
        
        {user && !emailVerified && (
          <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-200 p-8 sm:p-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full mb-6">
                  <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Email Verification Required</h2>
                <p className="text-gray-600 text-base sm:text-lg mb-2">
                  Please verify your email address to access LMU Hub.
                </p>
                <p className="text-gray-500 text-sm sm:text-base mb-6">
                  We've sent a verification email to <span className="font-semibold text-gray-700">{user.email}</span>. 
                  Please check your inbox and click the verification link.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Don't see the email?</strong> Check your spam folder or use the "Resend Verification" button in the header.
                  </p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>I've Verified My Email - Refresh</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {user && emailVerified && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-blue-600 hover:scale-110 transition-transform duration-200 inline-block">Campus</span>
                  <span className="text-indigo-600 hover:scale-110 transition-transform duration-200 inline-block">Gigs</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Discover opportunities and connect with fellow students</p>
              </div>
              <button 
                onClick={() => setShowGigForm(!showGigForm)}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 self-start sm:self-auto"
              >
                {showGigForm ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Post a New Gig</span>
                  </>
                )}
              </button>
            </div>

            {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium underline"
                >
                  Refresh page
                </button>
              </div>
            </div>
          )}

            {user && emailVerified && (
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                <div className={`${showGigForm ? 'lg:w-1/2' : 'w-full'} transition-all duration-300`}>
                  {isLoading && (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="h-7 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="h-20 bg-gray-100 rounded-lg mb-4"></div>
                      <div className="flex items-center gap-4">
                        <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
                        <div className="h-8 bg-gray-200 rounded-lg w-32"></div>
                      </div>
                </div>
            ))}
                </div>
                  )}
                  
                  {!isLoading && gigs.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center border-2 border-dashed border-gray-300">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No gigs yet</h3>
                  <p className="text-gray-600 mb-6">Be the first to post a gig and help connect the LMU community!</p>
                  <button 
                    onClick={() => setShowGigForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    Post the First Gig
                  </button>
                  </div>
                  )}

                  {!isLoading && gigs.length > 0 && (
                <>
                  <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by title, description, or category..."
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all hover:border-gray-400 hover:bg-white focus:shadow-sm"
                        />
                      </div>
                      <div className="sm:w-56 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </div>
                        <select
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all hover:border-gray-400 hover:bg-white focus:shadow-sm appearance-none cursor-pointer"
                        >
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                          <option value="soonest">Start date: Soonest</option>
                          <option value="latest">Start date: Latest</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {displayedGigs.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center border border-gray-200">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No gigs found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
                      {(searchQuery.trim() || sortOption !== "newest") && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSortOption("newest");
                          }}
                          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {displayedGigs.map(gig => (
                        <Gig key={gig.id} gig={gig} user={user}/>
                      ))}
                    </div>
                  )}
                  </>
                  )}
                </div>

                {showGigForm && (
              <div className="w-full lg:w-1/2 lg:sticky lg:top-24">
                <GigForm user={user} onSuccess={() => setShowGigForm(false)}/>
                </div>
              )}
            </div>
          )}
        </main>
        )}

        {!user && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="max-w-2xl mx-auto mt-8 sm:mt-12">
              <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Sign In Required</h3>
                <p className="text-gray-600 text-sm sm:text-base">You must be signed in with your LMU email to view and join gigs.</p>
              </div>
            </div>
          </main>
        )}
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
