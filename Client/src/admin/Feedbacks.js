import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false); // To trigger re-fetching feedbacks
    const [verifying, setVerifying] = useState({}); // Track which row is being verified

    const admintoken = Cookies.get('admintoken');

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:3001/admin/feedbacks', {
                    headers: {
                        'Authorization': `${admintoken}`
                    }
                });
                setFeedbacks(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [admintoken, refresh]);

    const markAsSeen = async (jntuno) => {
        setVerifying(prev => ({ ...prev, [jntuno]: true }));

        try {
            const response = await axios.post('http://localhost:3001/admin/feedback/mark-seen', {
                jntuno,
            }, {
                headers: {
                    'Authorization': `${admintoken}`
                }
            });

            if (response.data.success) {
                setRefresh(prev => !prev); // Trigger a refresh to re-fetch the feedbacks
            }
        } catch (error) {
            console.error('Error marking feedback as seen:', error);
            alert('Failed to mark feedback as seen. Please try again.');
        } finally {
            setVerifying(prev => ({ ...prev, [jntuno]: false }));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;
    if (feedbacks.length === 0) return <p>No feedbacks found.</p>;

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', flexDirection: 'column' }} className="p-6">
            <h2 className="text-xl font-semibold mb-4">Feedbacks</h2>
            <div style={{ width: '70vw'}} className="overflow-x-auto downscroll">
                <table className="border border-gray-200">
                    <thead style={{ backgroundColor: '#1A2438', color: 'white' }}>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">JNTU Number</th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Message</th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Time</th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                                    {feedback.jntuno}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                                    {feedback.fmessage}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                                    {feedback.ftime}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                                    {feedback.fdate}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap">
                                    {!feedback.seen ? (
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded flex items-center justify-center"
                                            onClick={() => markAsSeen(feedback.jntuno)}
                                            disabled={verifying[feedback.jntuno]}
                                        >
                                            {verifying[feedback.jntuno] ? (
                                                <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-white"></div>
                                            ) : (
                                                'Verify'
                                            )}
                                        </button>
                                    ) : (
                                        <span className="text-green-500 font-bold">Seen</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Feedbacks;