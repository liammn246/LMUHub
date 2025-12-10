import { useState } from "react";
import { addUserToGig } from "../services/dbService";      
import AddCalendar from "./AddCalendar";

export default function Gig({ gig, user}) {
    const [isJoining, setIsJoining] = useState(false);
    const [joinError, setJoinError] = useState(null);
    const member_count = gig.members ? gig.members.length : 0;
    const isFull = member_count >= gig.member_limit;
    const isCreator = user && gig.user === user.email;
    const isMember = user && gig.members?.includes(user.email);
    const canJoin = user && !isCreator && !isMember && !isFull;

    const handleJoinGig = async () => {
        if (isFull) return;
        setIsJoining(true);
        setJoinError(null);
        try {
            await addUserToGig(gig.id, user.email);
        } catch (err) {
            setJoinError(err.message || "Failed to join gig. Please try again.");
        } finally {
            setIsJoining(false);
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    }

    const typeColors = {
        'Event': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Task': 'bg-amber-100 text-amber-700 border-amber-200',
        'Academic': 'bg-blue-100 text-blue-700 border-blue-200',
        'Social': 'bg-purple-100 text-purple-700 border-purple-200',
        'Jobs': 'bg-indigo-100 text-indigo-700 border-indigo-200',
        'Sports': 'bg-orange-100 text-orange-700 border-orange-200'
    };

    return(
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 w-full group hover:border-blue-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight flex-1 group-hover:text-blue-700 transition-colors duration-200">{ gig.header }</h2>
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border transition-transform duration-200 group-hover:scale-105 ${typeColors[gig.type] || 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                    { gig.type }
                </span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <svg className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{ gig.user }</span>
                    </p>
                </div>
            </div>
            
            <p className="text-gray-700 mb-5 leading-relaxed text-sm sm:text-base">{ gig.body }</p>
            
            {(gig.scheduledDate || gig.endTime) && (
                <div className="mb-5 p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:gap-6 gap-3 text-sm">
                        {gig.scheduledDate && (
                            <div className="flex items-start gap-2 group/date">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover/date:scale-110 transition-transform duration-200">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900 block">Start:</span>
                                    <span className="text-gray-700">{formatDate(gig.scheduledDate)}</span>
                                </div>
                            </div>
                        )}
                        {gig.endTime && (
                            <div className="flex items-start gap-2 group/date">
                                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover/date:scale-110 transition-transform duration-200">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900 block">End:</span>
                                    <span className="text-gray-700">{formatDate(gig.endTime)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(isCreator || isMember) && gig.members?.length > 0 && (
                <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Members ({member_count})
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                        {gig.members.map((email) => (
                            <li key={email} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>{email}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {joinError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{joinError}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1.5 rounded-lg shadow-sm">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-gray-700'}`}>
                            {member_count} / {gig.member_limit} {isFull && '(Full)'}
                    </span>
                    </div>
                    {user && gig.scheduledDate && gig.endTime && (
                        <AddCalendar gig={gig} />
                    )}
                </div>

                {isCreator && (
                    <span className="px-4 py-2 bg-amber-100 text-amber-800 text-sm font-bold rounded-lg border border-amber-200 shadow-sm">
                        Your Gig
                    </span>
                )}

                {isMember && (
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-200 flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Joined
                    </span>
                )}

                {canJoin && (
                    <button 
                        onClick={handleJoinGig} 
                        disabled={isJoining || isFull}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isJoining ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Joining...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Join Gig</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}
