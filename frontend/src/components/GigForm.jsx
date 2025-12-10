import { useState } from "react";
import { createGig } from "../services/dbService"

export default function GigForm({ user, onSuccess }) {
    const getCurrentDateTimeLocal = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const [header, setHeader] = useState("");
    const [body, setBody] = useState("");
    const [member_limit, setMemberLimit] = useState(2);
    const [type, setType] = useState("Event");
    const [scheduledDate, setScheduledDate] = useState(getCurrentDateTimeLocal())
    const [endTime, setEndTime] = useState(getCurrentDateTimeLocal())
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);

    const validateForm = () => {
        const newErrors = {};
        
        if (!header.trim()) {
            newErrors.header = "Title is required";
        }
        
        if (!body.trim()) {
            newErrors.body = "Description is required";
        }
        
        if (!scheduledDate || !endTime) {
            newErrors.time = "Please select both start and end times";
        } else {
        const start = new Date(scheduledDate);
        const end = new Date(endTime);

        if (start.getFullYear() < 2024 || start.getFullYear() > 2028 || end.getFullYear() > 2028) {
                newErrors.time = "Please enter dates between 2024 and 2028";
            } else if (end <= start) {
                newErrors.time = "End time must be after start time";
            }
        }
        
        if (member_limit < 1 || member_limit > 100) {
            newErrors.member_limit = "Member limit must be between 1 and 100";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateGig = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            const username = user ? user.email : "Anonymous";
            await createGig({ header, body, type, member_limit, user: username, scheduledDate, endTime });
        setHeader("");
        setBody("");
            setMemberLimit(2);
            setType("Event");
            setScheduledDate(getCurrentDateTimeLocal());
            setEndTime(getCurrentDateTimeLocal());
            setErrors({});
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setSubmitError(err.message || "Failed to create gig. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="w-full">
            <form onSubmit={handleCreateGig} className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-200 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md hover:scale-110 hover:rotate-90 transition-all duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Create a New Gig</h2>
                </div>

                {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 text-sm font-medium">{submitError}</p>
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                        value={header} 
                        onChange={(e) => {
                            setHeader(e.target.value);
                            if (errors.header) setErrors({...errors, header: null});
                        }} 
                        type="text" 
                        placeholder="e.g., Study Group for CS 2021" 
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all focus:scale-[1.01] focus:shadow-sm ${
                            errors.header 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:border-gray-400'
                        }`}
                        disabled={isSubmitting}
                    />
                    {errors.header && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.header}
                        </p>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                        value={body} 
                        onChange={(e) => {
                            setBody(e.target.value);
                            if (errors.body) setErrors({...errors, body: null});
                        }} 
                        placeholder="Describe what this gig is about, what you're looking for, requirements, etc."
                        rows="5"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-y focus:scale-[1.01] focus:shadow-sm ${
                            errors.body 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:border-gray-400'
                        }`}
                        disabled={isSubmitting}
                    />
                    {errors.body && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.body}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Member Limit
                        </label>
                        <input 
                            value={member_limit} 
                            onChange={(e) => {
                                let value = Number(e.target.value);
                                if (value < 1) value = 1;
                                if (value > 100) value = 100;
                                setMemberLimit(value);
                                if (errors.member_limit) setErrors({...errors, member_limit: null});
                            }} 
                            type="number" 
                            min="1"
                            max="100"
                            step="1"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all focus:scale-[1.01] focus:shadow-sm ${
                                errors.member_limit 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:border-gray-400'
                            }`}
                            disabled={isSubmitting}
                        />
                        {errors.member_limit && (
                            <p className="mt-1 text-sm text-red-600">{errors.member_limit}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Type
                        </label>
                        <select 
                            value={type} 
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all hover:border-gray-400 focus:scale-[1.01] focus:shadow-sm"
                            disabled={isSubmitting}
                        >
                            <option value="Event">Event</option>
                            <option value="Task">Task</option>
                            <option value="Academic">Academic</option>
                            <option value="Social">Social</option>
                            <option value="Jobs">Jobs</option>
                            <option value="Sports">Sports</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Start Time <span className="text-red-500">*</span>
                        </label>
                        <input 
                            value={scheduledDate} 
                            type="datetime-local" 
                            min="2024-01-01T00:00"
                            max="2028-12-31T23:59"
                            onChange={(e) => {
                                setScheduledDate(e.target.value);
                                if (errors.time) setErrors({...errors, time: null});
                            }}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all focus:scale-[1.01] focus:shadow-sm ${
                                errors.time 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:border-gray-400'
                            }`}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            End Time <span className="text-red-500">*</span>
                        </label>
                        <input 
                            value={endTime} 
                            type="datetime-local" 
                            min="2024-01-01T00:00"
                            max="2028-12-31T23:59"
                            onChange={(e) => {
                                setEndTime(e.target.value);
                                if (errors.time) setErrors({...errors, time: null});
                            }}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all focus:scale-[1.01] focus:shadow-sm ${
                                errors.time 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
                                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 hover:border-gray-400'
                            }`}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                {errors.time && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.time}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                    type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Creating Gig...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Create Gig</span>
                            </>
                        )}
                </button>
                </div>
            </form>
        </div>
    )
}