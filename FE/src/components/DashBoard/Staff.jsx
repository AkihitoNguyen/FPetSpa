import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Staff = () => {
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get('https://localhost:7055/api/account/getAllStaff');
                setStaff(response.data);
            } catch (error) {
                console.error('Error fetching staff data:', error);
            }
        };

        fetchStaff();
    }, []);

    return (
        <div className="p-4 -ml-96">
            <h1 className="text-[17.592px] font-semibold mb-4">Staff List</h1>
            <table className="min-w-full bg-white border border-gray-200 rounded-md mt-4">
                <tr>
                   
                    <th className="name px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
                        FullName
                    </th>
                    <th className="email px-6 py-3 text-left text-[12.35px] font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                    </th>
                </tr>
            </table>
            <tbody>
            {staff.map((member) => (
                <tr key={member.id} className="border-b border-gray-200">
                   
                    <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-gray-900">
                        {member.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13.975px] font-semibold text-gray-900">
                        {member.email}
                    </td>
                </tr>
                 
                ))}
            </tbody>
        </div>
    );
}

export default Staff;
