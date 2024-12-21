'use client';

import React from 'react';
import { Bell } from 'lucide-react';

export default function Announcement() {
  // Define the type for Announcement
  type Announcement = {
    id: number;
    title: string;
    date: string;
    content: string;
  };

  // Sample announcement data
  const announcements: Announcement[] = [
    {
      id: 1,
      title: "Network Maintenance Scheduled",
      date: "December 15, 2024",
      content:
        "Planned system upgrade to enhance transaction processing speed and security. Minimal disruption expected.",
    },
    {
      id: 2,
      title: "New Trading Pair Launched",
      date: "December 20, 2024",
      content:
        "Exciting new trading pair added to our platform. Enhanced liquidity and trading opportunities now available!",
    },
    {
      id: 3,
      title: "Holiday Trading Hours",
      date: "December 24, 2024",
      content:
        "Updated trading hours for the holiday season. 24/7 emergency support will be maintained.",
    },
  ];

  return (
    <div className="bg-blue min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl self-center font-bold text-blue-600 mb-6">Announcements</h2>

        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-accent-800/5o shadow-xl rounded-lg p-6 hover:bg-blue-700/50 transition-shadow border border-blue-700/50"
              
            >
              <div className="flex items-center mb-4">
                <Bell className="text-blue-500 w-6 h-6 mr-3" />
                <h3 className="text-lg font-semibold text-primary">
                  {announcement.title}
                </h3>
              </div>
              <p className="text-sm text-blue-500 mb-2">{announcement.date}</p>
              <p className="text-grey-700">{announcement.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
